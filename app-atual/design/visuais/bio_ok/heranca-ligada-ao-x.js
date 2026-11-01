/* Heranca ligada ao X: o gene so no X; portadora x homem normal; homem afetado x mulher normal;
   heredograma rastreando o X do menino afetado; e a variante dominante ligada ao X. */
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
'W1beffac': [
'Por isso a resposta é E',
'O homem tem um X só: um alelo recessivo já o afeta, por isso é mais comum neles.',
'O pai afetado dá o seu X a todas as filhas: todas portadoras (o X da mãe encobre).'
],
'W7c92921': [
'Por isso a resposta é C',
'O X do menino afetado veio da mãe (3): ela é portadora certa. O avô (1) é normal',
'e, com um X só, não esconde o alelo: ele veio da avó (2), também portadora certa.'
],
'Wd11b878': [
'Por isso a resposta é E',
'Menina hemofílica tem os dois X alterados: um vem do pai, que com um X só é hemofílico,',
'e o outro vem da mãe, que precisa carregar o alelo (portadora ou afetada).'
],
'Wb390bc0': [
'Por isso a resposta é B',
'Pai afetado dá o X a todas as filhas e o Y aos filhos: filhas afetadas, filhos normais.',
'Um só alelo, ao lado do X normal da mãe, já afeta a filha: dominante ligado ao X.'
],
'Paa0a4f9': [
'Por isso a resposta é B',
'Mulher portadora × homem normal é o cruzamento da etapa 2: só 1 casa em 4 é afetada',
'(o menino que recebe o X alterado). Criança daltônica: 1/4 = 25%; menina, nenhuma.'
]
};
VIS.def['heranca-ligada-ao-x'] = {
  tit: 'Herança ligada ao X: o homem tem um X só',
  fontes: ['OpenStax, Biology 2e, 12.2 Characteristics and Traits (Sex-linked traits: homem hemizigoto; mulher heterozigota portadora passa o alelo a metade dos filhos) — https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits', 'OpenStax, Biology 2e, 13.1 Chromosomal Theory and Genetic Linkage — https://openstax.org/books/biology-2e/pages/13-1-chromosomal-theory-and-genetic-linkage', 'Wikipedia (en), X-linked recessive inheritance — https://en.wikipedia.org/wiki/X-linked_recessive_inheritance', 'Wikipedia (en), X-linked dominant inheritance — https://en.wikipedia.org/wiki/X-linked_dominant_inheritance'],
  tipo: 'anim', dur: 14,
  marcas: [[0, '1. X e Y'], [2.8, '2. Portadora'], [5.6, '3. Pai'], [8.4, '4. Família'], [11.2, '5. Dominante']],
  cred: 'Animação feita para o app (esquema; círculo = mulher, quadrado = homem, cheio = afetado, meio cheio = portadora).',
  nota: 'O gene está no X e o Y não tem cópia dele: o homem é hemizigoto e manifesta o alelo que estiver no seu único X. O pai passa o X a todas as filhas e o Y a todos os filhos; o filho homem sempre recebe o X da mãe.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); o.style.display = v <= 0 ? 'none' : ''; }
    svg.setAttribute('viewBox', '0 0 640 360');
    var NOR = '#4f7fc0', ALT = '#c0392b', ESC = '#3a3a3a';
    /* genotipo com sobrescrito: lista de [base, sup] */
    function gen(tEl, lista) {
      while (tEl.firstChild) tEl.removeChild(tEl.firstChild);
      lista.forEach(function (p) {
        var a = el('tspan', {}, tEl); a.textContent = p[0];
        if (p[1]) { var b = el('tspan', { dy: -6, style: 'font-size:13px;fill:' + (p[1] === 'a' || p[1] === 'D' ? ALT : NOR) }, tEl); b.textContent = p[1]; var c = el('tspan', { dy: 6 }, tEl); c.textContent = ' '; }
      });
    }
    function simbolo(pai, mulher) {
      var g = el('g', {}, pai);
      var f = mulher ? el('circle', { r: 11, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:1.8' }, g) : el('rect', { x: -11, y: -11, width: 22, height: 22, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:1.8' }, g);
      var meia = el('path', { d: mulher ? 'M0 -11 A11 11 0 0 1 0 11 Z' : 'M0 -11 H11 V11 H0 Z', style: 'fill:' + ESC }, g);
      return { g: g, f: f, meia: meia, set: function (est) { f.style.fill = est === 2 ? ESC : 'var(--folha)'; meia.style.display = est === 1 ? '' : 'none'; } };
    }
    /* ===== etapa 1: cromossomos ===== */
    var E1 = el('g', {});
    function crom(x, y, h, alelo, pai, nome) {
      var g = el('g', {}, pai);
      el('rect', { x: x - 9, y: y, width: 18, height: h, rx: 9, style: 'fill:#d9cbb4;stroke:#8d7a5c;stroke-width:1.5' }, g);
      el('path', { d: 'M' + (x - 9) + ' ' + (y + h * .38) + ' q9 5 18 0', style: 'fill:none;stroke:#8d7a5c;stroke-width:1.5' }, g);
      if (alelo) el('rect', { x: x - 9, y: y + h * .62, width: 18, height: 12, style: 'fill:' + (alelo === 'A' ? NOR : ALT) }, g);
      tx(x, y + h + 18, nome, 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', g);
      return g;
    }
    tx(86, 22, 'Mulher', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', E1);
    crom(66, 36, 104, 'A', E1, 'X'); crom(106, 36, 104, 'a', E1, 'X');
    var g1 = tx(86, 182, '', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', E1); gen(g1, [['X', 'A'], ['X', 'a']]);
    tx(86, 202, 'portadora: o normal', 'font-size:13px;fill:var(--lapis);text-anchor:middle', E1); tx(86, 218, 'encobre o alterado', 'font-size:13px;fill:var(--lapis);text-anchor:middle', E1);
    tx(250, 22, 'Homem', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', E1);
    crom(230, 36, 104, 'a', E1, 'X'); crom(270, 70, 56, null, E1, 'Y');
    var g2 = tx(250, 182, '', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', E1); gen(g2, [['X', 'a'], ['Y', '']]);
    tx(250, 202, 'afetado: não tem', 'font-size:13px;fill:var(--lapis);text-anchor:middle', E1); tx(250, 218, 'outro X para encobrir', 'font-size:13px;fill:var(--lapis);text-anchor:middle', E1);
    var leg1 = el('g', {}, E1);
    el('rect', { x: 352, y: 40, width: 18, height: 12, style: 'fill:' + NOR }, leg1); tx(378, 51, 'alelo normal (A)', 'font-size:14px;fill:var(--tinta)', leg1);
    el('rect', { x: 352, y: 66, width: 18, height: 12, style: 'fill:' + ALT }, leg1); tx(378, 77, 'alelo alterado, recessivo (a)', 'font-size:14px;fill:var(--tinta)', leg1);
    tx(352, 116, 'O Y não tem esse gene.', 'font-size:14px;font-weight:700;fill:var(--tinta)', leg1);
    tx(352, 140, 'Homem: 1 alelo só (hemizigoto).', 'font-size:14px;fill:var(--tinta)', leg1);
    tx(352, 162, 'Mulher: 2 alelos; precisa dos', 'font-size:14px;fill:var(--tinta)', leg1);
    tx(352, 182, 'dois alterados para ser afetada.', 'font-size:14px;fill:var(--tinta)', leg1);
    /* ===== etapas 2, 3, 5: quadro ===== */
    var Q = el('g', {});
    var GX = 178, GY = 62, C = 76;
    var mae = tx(GX + C, 22, '', 'font-size:14.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', Q);
    var maeD = tx(GX + C, 40, '', 'font-size:13px;fill:var(--lapis);text-anchor:middle', Q);
    var pai = tx(16, GY + C - 8, '', 'font-size:14.5px;font-weight:700;fill:var(--tinta)', Q);
    var paiD = tx(16, GY + C + 10, '', 'font-size:13px;fill:var(--lapis)', Q);
    var hT = [0, 1].map(function (i) { return tx(GX + C * i + C / 2, GY - 6, '', 'font-size:15px;font-weight:700;fill:var(--ad-t);text-anchor:middle', Q); });
    var hL = [0, 1].map(function (i) { return tx(GX - 14, GY + C * i + C / 2 + 5, '', 'font-size:15px;font-weight:700;fill:var(--ad-t);text-anchor:end', Q); });
    var cel = [];
    for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
      var cg = el('g', {}, Q), x0 = GX + C * j, y0 = GY + C * i;
      var r = el('rect', { x: x0 + 2, y: y0 + 2, width: C - 4, height: C - 4, rx: 8, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' }, cg);
      var s = simbolo(cg, i === 0); s.g.setAttribute('transform', 'translate(' + (x0 + 18) + ' ' + (y0 + 28) + ')');
      var gt = tx(x0 + 34, y0 + 33, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', cg);
      var fe = tx(x0 + C / 2, y0 + 60, '', 'font-size:13px;fill:var(--tinta);text-anchor:middle', cg);
      cel.push({ g: cg, r: r, s: s, gt: gt, fe: fe, i: i, j: j });
    }
    var RX = 352;
    var res = [0, 1, 2, 3].map(function (k) { return tx(RX, 82 + 26 * k, '', 'font-size:14.5px;' + (k === 3 ? 'font-weight:700;fill:var(--ad-t)' : 'fill:var(--tinta)'), Q); });
    var resT = tx(RX, 52, '', 'font-size:14.5px;font-weight:700;fill:var(--tinta)', Q);
    /* ===== etapa 4: heredograma ===== */
    var H = el('g', {});
    function ped(x, y, mulher, est, rot, pai) { var s = simbolo(pai || H, mulher); s.g.setAttribute('transform', 'translate(' + x + ' ' + y + ')'); s.set(est); tx(x, y + 30, rot, 'font-size:13px;fill:var(--tinta);text-anchor:middle', pai || H); return s; }
    el('path', { d: 'M111 42 H189 M150 42 V121 M161 132 H229 M195 132 V172 M150 172 H230 M150 172 V189 M190 172 V189 M230 172 V189', style: 'fill:none;stroke:var(--tinta);stroke-width:1.8' }, H);
    ped(100, 42, false, 0, '1 avô');
    var avo = ped(200, 42, true, 0, '2 avó');
    var mae3 = ped(150, 132, true, 0, '3 mãe');
    ped(240, 132, false, 0, '4 pai');
    ped(150, 200, true, 0, 'filha'); ped(190, 200, true, 0, 'filha');
    ped(230, 200, false, 2, 'menino');
    var rastro = el('g', {}, H);
    el('path', { d: 'M220 190 C212 165 176 152 162 142', style: 'fill:none;stroke:' + ALT + ';stroke-width:2.5;stroke-dasharray:6 4' }, rastro);
    el('path', { d: 'M156 120 C156 92 172 60 188 48', style: 'fill:none;stroke:' + ALT + ';stroke-width:2.5;stroke-dasharray:6 4' }, rastro);
    var corta = el('g', {}, H);
    tx(100, 90, 'normal: não', 'font-size:13px;font-weight:700;fill:' + ALT + ';text-anchor:middle', corta);
    tx(100, 106, 'tem o alelo', 'font-size:13px;font-weight:700;fill:' + ALT + ';text-anchor:middle', corta);
    var hTxt = [0, 1, 2, 3, 4].map(function (k) { return tx(300, 40 + 34 * k, '', 'font-size:14px;fill:var(--tinta)', H); });
    var hTxt2 = [0, 1, 2, 3, 4].map(function (k) { return tx(300, 57 + 34 * k, '', 'font-size:13px;fill:var(--lapis)', H); });
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 240, y2: 240, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P0 = tx(16, 266, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    var P = [0, 1, 2].map(function (i) { return tx(16, 290 + 22 * i, '', 'font-size:14.5px;fill:var(--tinta)'); });
    function painel(L) { P0.textContent = L[0]; P.forEach(function (p, i) { p.textContent = L[i + 1] || ''; }); }
    /* cruzamentos: gametas da mae (topo) e do pai (lado) */
    var CR = {
      2: { dom: false, m: [['X', 'A'], ['X', 'a']], p: [['X', 'A'], ['Y', '']], mae: ['mãe portadora', 'XᴬXᵃ'], pai: ['pai normal', 'XᴬY'],
        res: ['Resultado', 'filhas: nenhuma afetada (1/2 portadoras)', 'filhos: 1/2 afetados', '', 'afetados: 1 casa em 4 = 1/4'] },
      3: { dom: false, m: [['X', 'A'], ['X', 'A']], p: [['X', 'a'], ['Y', '']], mae: ['mãe normal', 'XᴬXᴬ'], pai: ['pai afetado', 'XᵃY'],
        res: ['Resultado', 'filhas: todas portadoras', '(o X do pai vai para todas)', 'filhos: todos normais (Y do pai)', 'nenhuma criança afetada'] },
      5: { dom: true, m: [['X', 'd'], ['X', 'd']], p: [['X', 'D'], ['Y', '']], mae: ['mãe normal', 'XᵈXᵈ'], pai: ['pai afetado', 'XᴰY'],
        res: ['Se o alelo for dominante (D)', 'filhas: todas afetadas', '(1 alelo D já basta)', 'filhos: todos normais', 'só as filhas herdam do pai'] }
    };
    function estado(dom, a, b) {
      var al = [a[1], b[1]].filter(function (x) { return x; });
      var homem = b[0] === 'Y';
      if (dom) { var temD = al.indexOf('D') >= 0; return { e: temD ? 2 : 0, w: temD ? (homem ? 'afetado' : 'afetada') : 'normal' }; }
      var n = al.filter(function (x) { return x === 'a'; }).length;
      if (homem) return { e: n ? 2 : 0, w: n ? 'afetado' : 'normal' };
      return { e: n === 2 ? 2 : n === 1 ? 1 : 0, w: n === 2 ? 'afetada' : n === 1 ? 'portadora' : 'normal' };
    }
    var _desenha = function (t) {
      var f = t < 2.8 ? 1 : t < 5.6 ? 2 : t < 8.4 ? 3 : t < 11.2 ? 4 : 5, t0 = [0, 0, 2.8, 5.6, 8.4, 11.2][f], u = t - t0;
      op(E1, f === 1 ? cl(u / .3) : 0); op(H, f === 4 ? cl(u / .3) : 0); op(Q, (f === 2 || f === 3 || f === 5) ? cl(u / .3) : 0);
      if (CR[f]) {
        var X = CR[f];
        mae.textContent = X.mae[0] + ' ' + X.mae[1]; maeD.textContent = 'gametas ↓';
        pai.textContent = X.pai[0]; paiD.textContent = X.pai[1] + ' · gametas →';
        hT.forEach(function (h, k) { gen(h, [X.m[k]]); op(h, cl((u - .3) / .3)); });
        hL.forEach(function (h, k) { gen(h, [X.p[k]]); op(h, cl((u - .3) / .3)); });
        cel.forEach(function (c, k) {
          var a = X.m[c.j], b = X.p[c.i], est = estado(X.dom, a, b);
          gen(c.gt, [a, b]); c.s.set(est.e); c.fe.textContent = est.w;
          c.fe.style.fontWeight = est.e === 2 ? '700' : '400'; c.fe.style.fill = est.e === 2 ? ALT : 'var(--tinta)';
          c.r.style.stroke = est.e === 2 ? ALT : 'var(--linha)';
          op(c.g, cl((u - .7 - k * .2) / .25));
        });
        resT.textContent = X.res[0]; op(resT, cl((u - 1.6) / .3));
        res.forEach(function (r, k) { r.textContent = X.res[k + 1]; op(r, cl((u - 1.7 - k * .15) / .3)); });
      }
      if (f === 4) {
        avo.set(u > 1.6 ? 1 : 0); mae3.set(u > 0.8 ? 1 : 0);
        op(rastro, cl((u - .5) / .3)); op(corta, cl((u - 1.3) / .3));
        var L = [['menino afetado: XᵃY', 'o Y veio do pai; o X, da mãe 3'], ['mãe 3 é normal: XᴬXᵃ', 'portadora certa'], ['avô 1 é normal: XᴬY', 'um X só: não esconde o alelo'], ['então o Xᵃ veio da avó 2', 'avó 2: portadora certa'], ['filhas de 3: 1/2 de chance', 'de serem portadoras (não é certeza)']];
        hTxt.forEach(function (h, k) { h.textContent = L[k][0]; op(h, cl((u - .4 - k * .4) / .3)); });
        hTxt2.forEach(function (h, k) { h.textContent = L[k][1]; op(h, cl((u - .4 - k * .4) / .3)); });
      }
      if (f === 1) painel(['1. O gene está no cromossomo X', 'A mulher tem dois X: com um alelo normal e um alterado, ela é portadora.', 'O homem tem X e Y, e o Y não tem esse gene: um alelo alterado já o afeta.']);
      else if (f === 2) painel(['2. Mãe portadora × pai normal', 'Toda filha recebe o X normal do pai: nenhuma é afetada.', 'Cada filho recebe o Y do pai e um X da mãe: metade dos meninos é afetada.']);
      else if (f === 3) painel(['3. Pai afetado × mãe normal', 'O pai dá o seu X (com o alelo) a todas as filhas: todas portadoras.', 'Aos filhos ele dá o Y: nenhum menino recebe o alelo do pai.']);
      else if (f === 4) painel(['4. Lendo um heredograma', 'O X do menino afetado só pode ter vindo da mãe. Homem normal não carrega', 'o alelo escondido; por isso a mãe e a avó são portadoras certas.']);
      else painel(['5. Variante: dominante ligada ao X', 'Agora um alelo basta para afetar. O pai afetado dá o X a todas as filhas:', 'todas afetadas; os filhos recebem o Y e saem todos normais.']);
    };
    return fimResposta(VIS.def['heranca-ligada-ao-x'], svg, _desenha, 14, RESP, qid, {
      semEsmaecer: true, x: 8, y: 242, w: 624, h: 114,
      congela: function (q) { return q === 'Paa0a4f9' ? 5.55 : q === 'W7c92921' ? 11.15 : q === 'Wb390bc0' ? 13.95 : 8.35; }
    });
  }
};
VIS.liga('heranca-ligada-ao-x', ['W1beffac', 'W7c92921', 'Wd11b878', 'Wb390bc0', 'Paa0a4f9']);
