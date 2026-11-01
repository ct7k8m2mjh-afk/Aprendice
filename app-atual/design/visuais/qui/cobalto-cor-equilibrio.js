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
'P2e239ea': [
'Por isso a resposta é D',
'Ensaio 5, K₂SO₄: dissolve, mas o sulfato não está na equação: vermelha.',
'Ensaio 6, AgCl: quase insolúvel, quase não solta Cl⁻: vermelha.',
'Ensaio 7, NaCl: solúvel, solta muito Cl⁻ → [CoCl₄]²⁻: azul.'
]
};
VIS.def['cobalto-cor-equilibrio'] = {
  tit: 'Cobalto: o Cl⁻ livre decide a cor',
  fontes: ['OpenStax, Chemistry 2e, 13.3 Shifting Equilibria: Le Châtelier’s Principle — https://openstax.org/books/chemistry-2e/pages/13-3-shifting-equilibria-le-chateliers-principle', 'Wikipedia (en), Cobalt(II) chloride (cor rosa do [Co(H₂O)₆]²⁺, azul do [CoCl₄]²⁻ com HCl, azul ao aquecer) — https://en.wikipedia.org/wiki/Cobalt(II)_chloride', 'Wikipedia (en), Solubility table (AgCl e CuCl quase insolúveis em água) — https://en.wikipedia.org/wiki/Solubility_table'],
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Duas cores'], [3, '+ NaCl'], [6, '+ K₂SO₄'], [9, '+ AgCl'], [12, 'Água e calor']],
  cred: 'Foto: "Cobalt chloride equilibrium.JPG", Chemicalinterest, domínio público, via Wikimedia Commons (recortada: só os dois primeiros tubos). Tubos animados feitos para o app (esquema).',
  nota: 'Só desloca o equilíbrio o que muda a concentração de uma espécie da equação. Íons que não aparecem nela (sulfato, nitrato, Na⁺, K⁺) não mexem na cor; um sal com cloreto só mexe se dissolver e soltar Cl⁻ na solução.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var ROSA = [210, 84, 100], AZUL = [47, 72, 170], CLC = '#2e8b57';
    function mix(f) { return 'rgb(' + ROSA.map(function (c, i) { return Math.round(c + (AZUL[i] - c) * f); }).join(',') + ')'; }
    svg.setAttribute('viewBox', '0 0 640 370');
    var D = 3;
    /* equacao */
    var eq = el('text', { x: 16, y: 24, style: 'font-size:17px;font-weight:700' });
    [['[Co(H₂O)₆]²⁺', 'rgb(190,60,80)'], [' + 4 Cl⁻ ', CLC], ['⇌', 'var(--tinta)'], [' [CoCl₄]²⁻', 'rgb(47,72,170)'], [' + 6 H₂O', 'var(--tinta)']].forEach(function (p) { var s = el('tspan', { style: 'fill:' + p[1] }, eq); s.textContent = p[0]; });
    tx(420, 24, 'rosa ⇌ azul', 'font-size:15px;fill:var(--lapis)');
    /* foto */
    var defs = el('defs', {}), cp = el('clipPath', { id: 'co-cp' }, defs);
    el('rect', { x: 16, y: 40, width: 224, height: 168, rx: 10 }, cp);
    var fg = el('g', {});
    var im = el('image', { x: 16, y: 40, width: 224, height: 168, 'clip-path': 'url(#co-cp)', preserveAspectRatio: 'xMidYMid slice' }, fg);
    im.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'vis/cobalto-cor-equilibrio-1.webp'); im.setAttribute('href', 'vis/cobalto-cor-equilibrio-1.webp');
    el('rect', { x: 16, y: 40, width: 224, height: 168, rx: 10, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, fg);
    [[96, '1'], [194, '2']].forEach(function (m) { el('circle', { cx: m[0], cy: 62, r: 12, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:1.5' }, fg); tx(m[0], 67, m[1], 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', fg); });
    /* tubos animados */
    var TU = [{ x: 300, sal: 'NaCl', cor: 'solúvel, com Cl⁻' }, { x: 410, sal: 'K₂SO₄', cor: 'solúvel, sem Cl⁻' }, { x: 520, sal: 'AgCl', cor: 'quase insolúvel' }];
    var sem = 5; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    TU.forEach(function (u, i) {
      u.g = el('g', {});
      u.liq = el('path', { d: 'M' + (u.x - 24) + ' 92 V170 a24 24 0 0 0 48 0 V92 Z', style: 'stroke:none' }, u.g);
      el('path', { d: 'M' + (u.x - 26) + ' 56 V170 a26 26 0 0 0 52 0 V56', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, u.g);
      u.nome = tx(u.x, 50, '+ ' + u.sal, 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', u.g);
      u.res = tx(u.x, 214, '', 'font-size:14px;font-weight:700;text-anchor:middle', u.g);
      u.ion = [];
      var LB = i === 0 ? [['Na⁺', -11, 112], ['Cl⁻', 11, 132], ['Cl⁻', -11, 152], ['Na⁺', 11, 172]] : i === 1 ? [['K⁺', -11, 116], ['SO₄²⁻', 4, 142], ['K⁺', -9, 168]] : [];
      LB.forEach(function (l) { u.ion.push(tx(u.x + l[1], l[2], l[0], 'font-size:14px;font-weight:700;text-anchor:middle;fill:#fff')); });
      u.ion.forEach(function (o) { u.g.appendChild(o); });
      if (i === 2) { u.solido = el('path', { d: 'M' + (u.x - 20) + ' 186 q20 -14 40 0 a20 8 0 0 1 -40 0 Z', style: 'fill:#f2f2f0;stroke:#9a9a9a;stroke-width:1.2' }, u.g); }
      u.desc = tx(u.x, 196 + 0, '', 'font-size:14px;fill:var(--lapis);text-anchor:middle', u.g);
    });
    var agua = tx(TU[0].x + 34, 80, '+ água', 'font-size:14px;font-weight:700;fill:#2b7bbf'), fogo = el('g', {});
    for (var k = 0; k < 3; k++) el('path', { d: 'M' + (TU[0].x - 16 + 16 * k) + ' 210 q-6 -7 0 -14 q6 7 0 14 Z', style: 'fill:#e07a2a;stroke:#b4442f;stroke-width:1' }, fogo);
    /* painel */
    el('line', { x1: 16, x2: 624, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.2' });
    var p0 = tx(16, 268, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)'), P = [292, 316, 340, 364].map(function (y) { return tx(16, y, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['Duas cores, um equilíbrio', 'Foto, tubo 1: pouco Cl⁻, predomina o [Co(H₂O)₆]²⁺, rosa-avermelhado.', 'Tubo 2: com HCl (muito Cl⁻) predomina o [CoCl₄]²⁻, azul.', 'Quem decide a cor é a concentração de Cl⁻ LIVRE na solução.'],
      ['Sal solúvel com cloreto: NaCl (ou KCl)', 'Dissolve inteiro e solta muito Cl⁻ na solução.', 'Le Chatelier: o excesso de Cl⁻ é consumido, o equilíbrio vai', 'para a direita e forma [CoCl₄]²⁻: a solução fica azul.'],
      ['Sal solúvel sem cloreto: K₂SO₄ (ou Na₂SO₄)', 'Dissolve, mas K⁺ e SO₄²⁻ não aparecem na equação.', 'A concentração de Cl⁻ não muda: o equilíbrio fica onde está.', 'A solução continua rosa-avermelhada.'],
      ['Cloreto quase insolúvel: AgCl (ou CuCl)', 'Tem Cl na fórmula, mas quase nada dissolve: fica sólido no fundo.', 'Quase nenhum Cl⁻ livre entra na solução, então não há deslocamento.', 'Continua rosa. Não basta ter cloro na fórmula: ele precisa estar solto.'],
      ['Água e temperatura', 'Mais água (um produto): o equilíbrio volta para a esquerda, rosa.', 'Aquecer deixa a solução azul: o sentido que forma [CoCl₄]²⁻', 'absorve calor (endotérmico). Esfriar devolve o rosa.']
    ];
    var _desenha = function (t) {
      var i = Math.min(4, Math.floor(t / D)), u = t - i * D;
      op(fg, i === 0 ? 1 : .35);
      TU.forEach(function (tb, j) {
        var ativo = j + 1, chegou = i >= ativo, ff = 0;
        if (j === 0) { ff = i < 1 ? 0 : i === 1 ? ease((u - .6) / 1.4) : i < 4 ? 1 : u < 1.4 ? 1 - ease((u - .2) / .9) : ease((u - 1.6) / .9); }
        tb.liq.style.fill = mix(ff); tb.liq.style.opacity = .85;
        op(tb.nome, chegou ? 1 : .3);
        var vis = !chegou ? 0 : i === ativo ? cl((u - .1) / .5) : 1;
        tb.ion.forEach(function (o) { op(o, vis); });
        if (tb.solido) op(tb.solido, vis);
        tb.res.textContent = !chegou || (i === ativo && u < 1.6) ? '' : j === 0 ? 'azul' : 'continua rosa';
        tb.res.style.fill = j === 0 ? 'rgb(47,72,170)' : 'rgb(190,60,80)';
        tb.desc.textContent = '';
        op(tb.g, i === 4 && j > 0 ? .3 : 1);
      });
      var r0 = TU[0].res; r0.setAttribute('x', TU[0].x); r0.setAttribute('y', i === 4 ? 230 : 214); r0.style.textAnchor = 'middle';
      if (i === 4) TU[0].res.textContent = u < .8 ? '' : u < 2.0 ? 'rosa de novo' : 'azul (quente)';
      if (i === 4) TU[0].res.style.fill = u < 2.0 ? 'rgb(190,60,80)' : 'rgb(47,72,170)';
      op(agua, i === 4 && u < 1.4 ? 1 : 0); op(fogo, i === 4 && u >= 1.5 ? 1 : 0);
      var L = TXT[i]; p0.textContent = L[0]; P.forEach(function (q, j) { q.textContent = L[j + 1] || ''; });
    };
    return fimResposta(VIS.def['cobalto-cor-equilibrio'], svg, _desenha, 5 * D, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function () { return 4 * D - .05; }
    });
  }
};
VIS.liga('cobalto-cor-equilibrio', ['P2e239ea']);
