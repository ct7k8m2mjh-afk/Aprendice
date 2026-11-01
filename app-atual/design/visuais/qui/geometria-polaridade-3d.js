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
'P1d0b21c': ['Por isso a resposta é D', 'H₂S: o S tem 2 ligações + 2 pares livres, como o O da água → angular (92°).', '1-pentanotiol: cadeia de 5 C com –SH na ponta: CH₃(CH₂)₄SH = C₅H₁₂S.'],
'P29685c7': ['Por isso a resposta é D', 'SO₂: S e O têm eletronegatividades diferentes → ligações covalentes polares.', 'H₂S: 2 ligações + 2 pares livres no S → angular.', 'CO₂: linear, as duas setas se anulam → molécula apolar.'],
'P4005266': ['Por isso a resposta é B', 'CCl₄ (tetraédrica) e CO₂ (linear): ligações polares, mas as setas se anulam.', 'NH₃ (piramidal) e SO₂ (angular) têm par livre no central: setas não se anulam.'],
'P7063d85': ['Por isso a resposta é E', 'Nos dois compostos o C ligado ao Cl faz 1 dupla (C=O) + 2 simples', 'e não tem par livre: 3 regiões → trigonal plano, cerca de 120°.'],
'P859363c': ['Por isso a resposta é B', 'CCl₄: 4 ligações, sem par livre → tetraédrica.', 'NH₃: 3 ligações + 1 par livre → piramidal.', 'H₂S: 2 ligações + 2 pares livres (como a água) → angular.'],
'Pa88aa4e': ['Por isso a resposta é C', 'A ureia com água forma NH₃ e CO₂.', 'NH₃: piramidal, setas somam → polar. CO₂: linear, setas se anulam → apolar.', 'Geometrias diferentes, uma polar e a outra apolar.'],
'Pd637f88': ['Por isso a resposta é E', 'Ureia: C com 1 dupla + 2 simples, sem par livre → 3 regiões, plana trigonal.', 'CO₂: C com 2 duplas, sem par livre → 2 regiões, linear (180°).'],
'Pea0600a': ['Por isso a resposta é B', 'Só o CO₂ tem o átomo central com 2 regiões e nenhum par livre: 180°.', 'Água e H₂S são angulares, NH₃ piramidal (107°), CH₄ tetraédrico (109,5°).'],
'W2cf1c1f': ['Por isso a resposta é B', 'As ligações Be–F e O–F são polares nas duas moléculas.', 'BeF₂ é linear: as setas se anulam. OF₂ é angular (2 pares livres no O):', 'as setas somam. Quem decide é a geometria molecular.'],
'W96b0d89': ['Por isso a resposta é C', 'O N da amônia tem 3 ligações + 1 par livre: pirâmide trigonal (107°).', 'As três setas N–H somam para o lado do par livre: molécula polar.'],
'Wc551cba': ['Por isso a resposta é B', 'NH₃: piramidal, polar. CHCl₃: tetraédrica, mas o H no lugar de um Cl', 'impede o cancelamento → polar. SO₃: trigonal plana, 3 ligações iguais', 'sem par livre no S → as setas se anulam, apolar.'],
'W6e969cf': ['Por isso a resposta é D', 'C=O é ligação covalente polar (O é mais eletronegativo que C).', 'O CO₂ é linear e apolar: entre as moléculas só há forças de', 'Van der Waals (dipolo induzido), por isso ele é gás.']
};
VIS.def['geometria-polaridade-3d'] = {
  tit: 'Geometria molecular e polaridade',
  fontes: ['OpenStax, Chemistry 2e, 7.6 Molecular Structure and Polarity (VSEPR) — https://openstax.org/books/chemistry-2e/pages/7-6-molecular-structure-and-polarity', 'Wikipedia (en), VSEPR theory — https://en.wikipedia.org/wiki/VSEPR_theory', 'Wikipedia (en), Electronegativities of the elements (data page) — https://en.wikipedia.org/wiki/Electronegativities_of_the_elements_(data_page)', 'Ângulos: Wikipedia (en), Water, Hydrogen sulfide, Ammonia, Sulfur dioxide, Phosgene, Urea, Oxygen difluoride'],
  tipo: 'anim', dur: 20,
  marcas: [[0, '2 ligações'], [5, '3 regiões'], [10, '4 regiões'], [15, 'Ligantes ≠']],
  cred: 'Animação feita para o app (modelos 3D com ângulos reais; pares livres em lilás; setas de polaridade apontam para o átomo mais eletronegativo, comprimento esquemático).',
  nota: 'Conte as regiões de elétrons ao redor do átomo central (cada ligação simples, dupla ou tripla conta uma; cada par livre conta uma). Elas se afastam ao máximo. A forma da molécula é dada só pelos átomos. Se a soma das setas de polaridade for zero, a molécula é apolar.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var RAD = Math.PI / 180, ROX = '#7d4fa8', VM = '#b4442f', AZ = '#2b6cb0';
    svg.setAttribute('viewBox', '0 0 640 410');
    /* elementos: cor, raio, eletronegatividade (Pauling) */
    var E = { C: ['#4a4a4a', 17, 2.55, '#fff'], H: ['#f2f2f2', 11, 2.20, '#333'], O: ['#cc3d33', 16, 3.44, '#fff'], N: ['#3a62c4', 16, 3.04, '#fff'], S: ['#d9b526', 19, 2.58, '#333'],
      Cl: ['#3d9e57', 18, 3.16, '#fff'], F: ['#86c440', 15, 3.98, '#333'], Be: ['#a3a36b', 16, 1.57, '#fff'], NH2: ['#3a62c4', 20, 3.04, '#fff', 'NH₂'], OCH3: ['#cc3d33', 22, 3.44, '#fff', 'OCH₃'] };
    function v(x, y, z) { return [x, y, z]; }
    function ang(a) { var h = a / 2 * RAD; return [v(-Math.sin(h), -Math.cos(h), 0), v(Math.sin(h), -Math.cos(h), 0)]; }   /* duas ligacoes para baixo, angulo a */
    function tri(a) { return [v(0, 1, 0)].concat(ang(a)); }   /* uma para cima + duas para baixo */
    function tetra() { var s = Math.sqrt(8 / 9); return [v(0, 1, 0)].concat([90, 210, 330].map(function (p) { return v(s * Math.cos(p * RAD), -1 / 3, s * Math.sin(p * RAD)); })); }
    function pir(a) { var c = Math.sqrt((Math.cos(a * RAD) + .5) / 1.5), s = Math.sqrt(1 - c * c); return [90, 210, 330].map(function (p) { return v(s * Math.cos(p * RAD), -c, s * Math.sin(p * RAD)); }); }
    function M(f, cen, lig, ordem, pares, geo, reg) { return { f: f, cen: cen, lig: lig, ordem: ordem, pares: pares, geo: geo, reg: reg }; }
    var lpA = [v(0, Math.cos(55 * RAD), Math.sin(55 * RAD)), v(0, Math.cos(55 * RAD), -Math.sin(55 * RAD))];
    var MOL = {
      CO2: M('CO₂', 'C', [['O', v(-1, 0, 0)], ['O', v(1, 0, 0)]], 2, [], 'linear · 180°', '2 regiões · 0 par livre'),
      BeF2: M('BeF₂', 'Be', [['F', v(-1, 0, 0)], ['F', v(1, 0, 0)]], 1, [], 'linear · 180°', '2 regiões · 0 par livre'),
      H2O: M('H₂O', 'O', ang(104.5).map(function (d) { return ['H', d]; }), 1, lpA, 'angular · 104,5°', '4 regiões · 2 pares livres'),
      H2S: M('H₂S', 'S', ang(92.1).map(function (d) { return ['H', d]; }), 1, lpA, 'angular · 92°', '4 regiões · 2 pares livres'),
      OF2: M('OF₂', 'O', ang(103.1).map(function (d) { return ['F', d]; }), 1, lpA, 'angular · 103°', '4 regiões · 2 pares livres'),
      SO3: M('SO₃', 'S', tri(120).map(function (d) { return ['O', d]; }), 2, [], 'trigonal plana · 120°', '3 regiões · 0 par livre'),
      SO2: M('SO₂', 'S', ang(119).map(function (d) { return ['O', d]; }), 2, [v(0, 1, 0)], 'angular · 119°', '3 regiões · 1 par livre'),
      CCl4: M('CCl₄', 'C', tetra().map(function (d) { return ['Cl', d]; }), 1, [], 'tetraédrica · 109,5°', '4 regiões · 0 par livre'),
      NH3: M('NH₃', 'N', pir(107).map(function (d) { return ['H', d]; }), 1, [v(0, 1, 0)], 'piramidal · 107°', '4 regiões · 1 par livre'),
      COCl2: M('COCl₂', 'C', [['O', v(0, 1, 0), 2]].concat(ang(111.8).map(function (d) { return ['Cl', d]; })), 1, [], 'trigonal plana · ≈120°', '3 regiões · 0 par livre'),
      CHCl3: M('CHCl₃', 'C', tetra().map(function (d, i) { return [i ? 'Cl' : 'H', d]; }), 1, [], 'tetraédrica · ≈109,5°', '4 regiões · 0 par livre'),
      UREIA: M('ureia, CO(NH₂)₂', 'C', [['O', v(0, 1, 0), 2]].concat(ang(117).map(function (d) { return ['NH2', d]; })), 1, [], 'trigonal plana · ≈120°', '3 regiões · 0 par livre'),
      CLF: M('cloroformato de metila', 'C', [['O', v(0, 1, 0), 2], ['Cl', ang(110)[0]], ['OCH3', ang(110)[1]]], 1, [], 'trigonal plana · ≈120°', '3 regiões · 0 par livre')
    };
    /* etapas: par de moleculas (variantes por questao) */
    var PAR = [['CO2', 'H2O'], ['SO3', 'SO2'], ['CCl4', 'NH3'], ['COCl2', 'CHCl3']];
    var TXT = [
      ['1. Duas ligações no átomo central: linear ou angular', 'CO₂: o C tem 2 regiões (duas duplas) e nenhum par livre → linear, 180°.', 'H₂O: o O tem 4 regiões (2 ligações + 2 pares livres) → angular, 104,5°.', 'As setas: no CO₂ se anulam (apolar); na água se somam (polar).'],
      ['2. Três regiões: trigonal plana ou angular', 'SO₃: 3 ligações e nenhum par livre no S → trigonal plana, 120°: apolar.', 'SO₂: 2 ligações + 1 par livre no S → angular, cerca de 119°: polar.', 'As ligações S–O são polares nas duas; o que muda é a simetria.'],
      ['3. Quatro regiões: tetraédrica ou piramidal', 'CCl₄: 4 ligações iguais a 109,5°: as quatro setas se anulam (apolar).', 'NH₃: 3 ligações + 1 par livre no N → pirâmide trigonal, 107°: polar.', 'O par livre não entra no nome da forma, mas empurra as ligações.'],
      ['4. Átomos diferentes em volta do central', 'COCl₂: o C tem 1 dupla + 2 simples e nenhum par livre → trigonal plana.', 'CHCl₃: tetraedro com um H no lugar de um Cl: as setas não se anulam.', 'Apolar exige forma simétrica e ligantes iguais.']
    ];
    var VAR = {
      W2cf1c1f: { 0: [['BeF2', 'OF2'], ['1. Duas ligações no átomo central: linear ou angular', 'BeF₂: o Be tem 2 regiões e nenhum par livre → linear, 180°.', 'OF₂: o O tem 2 ligações + 2 pares livres → angular, 103°.', 'Ligações polares nas duas: só a geometria decide (BeF₂ apolar, OF₂ polar).']] },
      P1d0b21c: { 0: [['CO2', 'H2S'], ['1. Duas ligações no átomo central: linear ou angular', 'CO₂: o C tem 2 regiões (duas duplas) e nenhum par livre → linear, 180°.', 'H₂S: o S, como o O da água, tem 2 ligações + 2 pares livres → angular.', 'As setas: no CO₂ se anulam (apolar); no H₂S se somam (polar).']] },
      Pa88aa4e: { 2: [['CO2', 'NH3'], ['3. Os produtos da ureia com água: CO₂ e NH₃', 'CO₂: o C tem 2 regiões e nenhum par livre → linear: as setas se anulam.', 'NH₃: 3 ligações + 1 par livre no N → pirâmide trigonal, 107°: polar.', 'Geometrias diferentes; uma apolar (CO₂), a outra polar (NH₃).']] },
      Pd637f88: { 3: [['UREIA', 'CO2'], ['4. Carbono da ureia × carbono do CO₂', 'Ureia: o C tem 1 dupla (C=O) + 2 simples (C–N), sem par livre → trigonal plana.', 'CO₂: o C tem 2 duplas e nenhum par livre → linear, 180°.', 'Ligação dupla conta como uma região só.']] },
      P7063d85: { 3: [['COCl2', 'CLF'], ['4. O carbono ligado ao cloro, antes e depois', 'Fosgênio: o C tem 1 dupla (C=O) + 2 simples (C–Cl), sem par livre.', 'Cloroformato de metila: o C ligado ao Cl tem =O, –Cl e –OCH₃.', 'Três regiões, nenhum par livre nos dois: trigonal plano (≈120°).']] }
    };
    VAR.Wc551cba = { 3: [['CHCl3', 'SO3'], ['4. Clorofórmio × trióxido de enxofre', 'CHCl₃: tetraedro com um H no lugar de um Cl: as setas não se anulam (polar).', 'SO₃: 3 ligações iguais a 120°, sem par livre no S: se anulam (apolar).', 'NH₃ (etapa 3): piramidal, polar.']] };
    VAR.P29685c7 = VAR.P1d0b21c;
    var vq = VAR[qid] || {};
    var pares = PAR.map(function (p, i) { return vq[i] ? vq[i][0] : p; });
    var textos = TXT.map(function (p, i) { return vq[i] ? vq[i][1] : p; });
    /* construcao de uma molecula 3D (esquerda) + soma das setas (direita) */
    var BL = 70, CXS = [160, 480], CY = 118;
    function cria(key, cx) {
      var m = MOL[key], g = el('g', {}), cena = el('g', {}, g), seta = el('g', {}, g);
      var o = { m: m, g: g, cx: cx - 42, ix: cx + 100, iy: CY + 6, itens: [], setas: [] };
      tx(cx, 26, m.f, 'font-size:17px;font-weight:700;fill:var(--tinta);text-anchor:middle', g);
      o.geo = tx(cx, 214, m.geo, 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g);
      o.reg = tx(cx, 234, m.reg, 'font-size:14px;fill:var(--lapis);text-anchor:middle', g);
      o.pol = tx(cx, 254, '', 'font-size:15px;font-weight:700;text-anchor:middle', g);
      o.ins = el('g', {}, g);
      el('circle', { cx: o.ix, cy: o.iy, r: 50, style: 'fill:color-mix(in srgb,' + ROX + ' 5%,var(--folha));stroke:var(--linha);stroke-width:1.2' }, o.ins);
      tx(o.ix, o.iy - 58, 'soma das setas', 'font-size:14px;fill:var(--lapis);text-anchor:middle', o.ins);
      g.appendChild(seta);
      o.zero = tx(o.ix, o.iy + 70, 'soma = 0', 'font-size:14px;font-weight:700;fill:' + AZ + ';text-anchor:middle', g);
      var ec = E[m.cen];
      m.lig.forEach(function (L) {
        var e = E[L[0]], ord = L[2] || m.ordem;
        var b = { tipo: 'b', d: L[1], ord: ord, g: el('g', {}, cena) };
        b.l = []; for (var k = 0; k < ord; k++) b.l.push(el('line', { style: 'stroke:#8c8c8c;stroke-width:' + (ord > 1 ? 3.4 : 5) + ';stroke-linecap:round' }, b.g));
        o.itens.push(b);
        var a = { tipo: 'a', d: L[1], r: e[1], g: el('g', {}, cena) };
        a.c = el('circle', { r: e[1], style: 'fill:' + e[0] + ';stroke:#5a5a5a;stroke-width:1.2' }, a.g);
        a.t = tx(0, 5, e[4] || L[0], 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + e[3], a.g);
        o.itens.push(a);
        var dEN = e[2] - ec[2];   /* >0: seta do central para o ligante */
        o.setas.push({ d: L[1], s: dEN, k: Math.min(12 + 18 * Math.abs(dEN), 40) / BL });
      });
      m.pares.forEach(function (d) {
        var p = { tipo: 'p', d: d, g: el('g', {}, cena) };
        p.e = el('ellipse', { style: 'fill:color-mix(in srgb,' + ROX + ' 16%,transparent);stroke:' + ROX + ';stroke-width:1.3' }, p.g);
        p.p1 = el('circle', { r: 2.6, style: 'fill:' + ROX }, p.g); p.p2 = el('circle', { r: 2.6, style: 'fill:' + ROX }, p.g);
        o.itens.push(p);
      });
      var cen = { tipo: 'c', d: v(0, 0, 0), g: el('g', {}, cena) };
      el('circle', { r: ec[1], style: 'fill:' + ec[0] + ';stroke:#5a5a5a;stroke-width:1.2' }, cen.g);
      tx(0, 5, m.cen, 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + ec[3], cen.g);
      o.itens.push(cen);
      o.cena = cena;
      o.setas.forEach(function (s) {
        s.g = el('g', {}, seta);
        s.l = el('line', { style: 'stroke:' + ROX + ';stroke-width:3;stroke-linecap:round' }, s.g);
        s.h = el('path', { style: 'fill:' + ROX }, s.g);
      });
      o.res = el('g', {}, seta);
      o.resL = el('line', { style: 'stroke:' + VM + ';stroke-width:4.5;stroke-linecap:round' }, o.res);
      o.resH = el('path', { style: 'fill:' + VM }, o.res);
      var sx = 0, sy = 0, sz = 0;
      o.setas.forEach(function (s) { var f = Math.sign(s.s) * s.k; sx += s.d[0] * f; sy += s.d[1] * f; sz += s.d[2] * f; });
      o.sum = [sx, sy, sz]; o.polar = Math.sqrt(sx * sx + sy * sy + sz * sz) > 0.03;
      return o;
    }
    function rot(p, yaw, pit) {
      var c = Math.cos(yaw), s = Math.sin(yaw), x = p[0] * c + p[2] * s, z = -p[0] * s + p[2] * c, y = p[1];
      var c2 = Math.cos(pit), s2 = Math.sin(pit), y2 = y * c2 - z * s2, z2 = y * s2 + z * c2;
      return [x, y2, z2];
    }
    function seta2(l, h, x1, y1, x2, y2, w) {
      var dx = x2 - x1, dy = y2 - y1, n = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / n, uy = dy / n, hl = w * 2.6;
      var bx = x2 - ux * hl, by = y2 - uy * hl;
      l.setAttribute('x1', x1.toFixed(1)); l.setAttribute('y1', y1.toFixed(1)); l.setAttribute('x2', bx.toFixed(1)); l.setAttribute('y2', by.toFixed(1));
      h.setAttribute('d', 'M' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' L' + (bx - uy * w * 1.5).toFixed(1) + ' ' + (by + ux * w * 1.5).toFixed(1) + ' L' + (bx + uy * w * 1.5).toFixed(1) + ' ' + (by - ux * w * 1.5).toFixed(1) + ' Z');
      var vis = n > hl * .9; l.style.opacity = vis ? 1 : 0; h.style.opacity = vis ? 1 : 0;
    }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function pose(o, t, lt) {
      var yaw = ((o.m.lig.length === 2 && !o.m.pares.length ? 10 : 34) + 14 * Math.sin(t * 0.9)) * RAD, pit = 12 * RAD;
      function P(d, k, ox, oy) { var r = rot(d, yaw, pit); return [(ox || o.cx) + r[0] * BL * k, (oy || CY) - r[1] * BL * k, r[2]]; }
      o.itens.forEach(function (it) {
        var p = P(it.d, 1);
        if (it.tipo === 'a' || it.tipo === 'c') { it.g.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')'); it.z = it.tipo === 'c' ? 0 : p[2]; }
        if (it.tipo === 'b') {
          it.z = -10 + p[2] * .01;
          var dx = p[0] - o.cx, dy = p[1] - CY, n = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / n, ny = dx / n;
          it.l.forEach(function (l, k) { var off = it.ord > 1 ? (k - (it.ord - 1) / 2) * 6.5 : 0;
            l.setAttribute('x1', (o.cx + nx * off).toFixed(1)); l.setAttribute('y1', (CY + ny * off).toFixed(1)); l.setAttribute('x2', (p[0] + nx * off).toFixed(1)); l.setAttribute('y2', (p[1] + ny * off).toFixed(1)); });
        }
        if (it.tipo === 'p') {
          var q = P(it.d, .8), dx2 = q[0] - o.cx, dy2 = q[1] - CY, len = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          var a = Math.atan2(dy2, dx2) / RAD, ux = dx2 / (len || 1), uy = dy2 / (len || 1);
          var mxx = o.cx + ux * len * .6, myy = CY + uy * len * .6;
          it.e.setAttribute('cx', mxx.toFixed(1)); it.e.setAttribute('cy', myy.toFixed(1)); it.e.setAttribute('rx', Math.max(len * .45, 12).toFixed(1)); it.e.setAttribute('ry', 12);
          it.e.setAttribute('transform', 'rotate(' + a.toFixed(1) + ' ' + mxx.toFixed(1) + ' ' + myy.toFixed(1) + ')');
          var px = -uy * 5, py = ux * 5, cxp = o.cx + ux * len * .78, cyp = CY + uy * len * .78;
          it.p1.setAttribute('cx', (cxp + px).toFixed(1)); it.p1.setAttribute('cy', (cyp + py).toFixed(1)); it.p2.setAttribute('cx', (cxp - px).toFixed(1)); it.p2.setAttribute('cy', (cyp - py).toFixed(1));
          it.z = q[2] * .6;
        }
      });
      o.itens.slice().sort(function (a, b) { return a.z - b.z; }).forEach(function (it) { o.cena.appendChild(it.g); });
      /* setas: aparecem sobre as ligacoes (1,3-2,0 s) e voam para o circulo da soma, todas com a cauda no centro (2,1-3,1 s) */
      var ap = cl((lt - 1.3) / .6), w = ease((lt - 2.1) / 1.0);
      o.setas.forEach(function (s) {
        var sg = Math.sign(s.s), vec = [s.d[0] * sg * s.k, s.d[1] * sg * s.k, s.d[2] * sg * s.k];
        var a0 = sg > 0 ? [s.d[0] * .3, s.d[1] * .3, s.d[2] * .3] : [s.d[0] * (.3 + s.k), s.d[1] * (.3 + s.k), s.d[2] * (.3 + s.k)];
        var p1 = P(a0, 1), p2 = P([a0[0] + vec[0], a0[1] + vec[1], a0[2] + vec[2]], 1);
        var q1 = P([0, 0, 0], 1, o.ix, o.iy), q2 = P(vec, 1, o.ix, o.iy);
        seta2(s.l, s.h, lerp(p1[0], q1[0], w), lerp(p1[1], q1[1], w), lerp(p2[0], q2[0], w), lerp(p2[1], q2[1], w), 2.6);
        op(s.g, ap * (lt > 3.3 && o.polar ? .55 : 1));
      });
      var vr = cl((lt - 3.2) / .4);
      var sl = Math.sqrt(o.sum[0] * o.sum[0] + o.sum[1] * o.sum[1] + o.sum[2] * o.sum[2]) || 1, sk = Math.max(sl, 26 / BL) / sl;
      var r1 = P([o.sum[0] * sk, o.sum[1] * sk, o.sum[2] * sk], 1, o.ix, o.iy);
      if (o.polar) seta2(o.resL, o.resH, o.ix, o.iy, lerp(o.ix, r1[0], vr), lerp(o.iy, r1[1], vr), 3.6);
      op(o.res, o.polar ? vr : 0); op(o.zero, o.polar ? 0 : vr);
      o.pol.textContent = o.polar ? 'polar: as setas somam' : 'apolar: as setas se anulam'; o.pol.style.fill = o.polar ? VM : AZ; op(o.pol, vr);
      op(o.geo, cl((lt - .5) / .4)); op(o.reg, cl((lt - .5) / .4)); op(o.ins, cl((lt - 1.8) / .4));
    }
    var ETAPAS = pares.map(function (p) { var g = el('g', {}); var a = cria(p[0], CXS[0]), b = cria(p[1], CXS[1]); g.appendChild(a.g); g.appendChild(b.g); return { g: g, a: a, b: b }; });
    el('line', { x1: 320, x2: 320, y1: 14, y2: 254, style: 'stroke:var(--linha);stroke-width:1.2;stroke-dasharray:4 5' });
    el('line', { x1: 14, x2: 626, y1: 266, y2: 266, style: 'stroke:var(--linha);stroke-width:1.5' });
    var L0 = tx(18, 292, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)');
    var Ls = [0, 1, 2].map(function (i) { return tx(18, 320 + 24 * i, '', 'font-size:15px;fill:var(--tinta)'); });
    var _desenha = function (t) {
      var f = Math.min(3, Math.floor(t / 5)), lt = t - f * 5;
      ETAPAS.forEach(function (E2, i) { op(E2.g, i === f ? 1 : 0); });
      var E2 = ETAPAS[f];
      pose(E2.a, t, lt); pose(E2.b, t, lt);
      op(E2.a.cena, cl(lt / .5)); op(E2.b.cena, cl(lt / .5));
      var T = textos[f]; L0.textContent = T[0]; Ls.forEach(function (o, i) { o.textContent = T[i + 1] || ''; });
    };
    var FR = { P1d0b21c: 4.9, P29685c7: 4.9, Pea0600a: 4.9, W2cf1c1f: 4.9, W6e969cf: 4.9, P4005266: 14.9, P859363c: 14.9, Pa88aa4e: 14.9, W96b0d89: 14.9, P7063d85: 19.9, Pd637f88: 19.9, Wc551cba: 19.9 };
    return fimResposta(VIS.def['geometria-polaridade-3d'], svg, _desenha, 20, RESP, qid, { semEsmaecer: true, y: 272, oculta: [L0].concat(Ls), x: 8, w: 624, dt: 3.6, congela: function (q) { return FR[q] || 19.9; } });
  }
};
VIS.liga('geometria-polaridade-3d', ['P1d0b21c', 'P29685c7', 'P4005266', 'P7063d85', 'P859363c', 'Pa88aa4e', 'Pd637f88', 'Pea0600a', 'W2cf1c1f', 'W96b0d89', 'Wc551cba', 'W6e969cf']);
