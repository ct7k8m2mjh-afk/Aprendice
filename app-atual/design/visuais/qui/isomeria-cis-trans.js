/* Isomeria cis-trans: a dupla C=C nao gira; cis x trans (dicloroeteno, maleico x fumarico); condicao de dois
   ligantes diferentes em cada C; polaridade e ebulicao do cis x trans. */
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
'Wb991032': ['Por isso a resposta é C',
'Maleico: as duas COOH do mesmo lado da dupla (cis); fumárico: em lados',
'opostos (trans). Mesma fórmula e dupla travada: isomeria geométrica.'],
'Pb33d86e': ['Por isso a resposta é B',
'PVC: n CH₂=CHCℓ se somam sem soltar nada, então é polímero de adição.',
'Trocando o H da seta por Cℓ, um Cℓ fica em cima e o outro embaixo: trans.'],
'P65cbd47': ['Por isso a resposta é C',
'2 mol de alceno dão 4 mol de H₂O: cada molécula tem 4 H, e CₙH₂ₙ dá C₂H₄.',
'No eteno, H₂C=CH₂, cada C tem dois H iguais: não há cis-trans.'],
'Pca6647a': ['Por isso a resposta é B',
'Geométricos. O cis (composto 2) é polar e ferve mais: 60,2 °C × 48,5 °C.',
'O trans (composto 1) é apolar: pela regra do semelhante, que a questão',
'cobra, é o menos solúvel em água (as medidas reais deste par divergem).']
};
VIS.def['isomeria-cis-trans'] = {
  tit: 'Isomeria cis-trans: a dupla que não gira',
  fontes: ['OpenStax, Organic Chemistry (McMurry), 7.4 Cis–Trans Isomerism in Alkenes — https://openstax.org/books/organic-chemistry/pages/7-4-cis-trans-isomerism-in-alkenes', 'OpenStax, Chemistry 2e, 20.1 Hydrocarbons (isômeros cis e trans; a dupla não gira) — https://openstax.org/books/chemistry-2e/pages/20-1-hydrocarbons', 'Wikipedia (en), 1,2-Dichloroethene (ebulição: cis 60,2 °C, trans 48,5 °C; momento de dipolo: cis 1,9 D, trans 0) — https://en.wikipedia.org/wiki/1,2-Dichloroethene', 'Wikipedia (en), Maleic acid; Fumaric acid — https://en.wikipedia.org/wiki/Maleic_acid'],
  tipo: 'anim', dur: 13.5,
  marcas: [[0, 'Não gira'], [3.5, 'Cis × trans'], [7, 'Condição'], [10, 'Polar']],
  cred: 'Animação feita para o app (ângulos de 120° em volta de cada C da dupla). Ebulição a 1 atm.',
  nota: 'A ligação dupla C=C não gira, então os grupos ficam presos de um lado ou do outro. Se cada carbono da dupla tem dois ligantes diferentes, há dois compostos: cis (iguais do mesmo lado) e trans (lados opostos). O cis costuma ser polar; o trans, com os polos se cancelando, apolar.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var T1 = 3.5, T2 = 7, T3 = 10, TF = 13.5;
    var CL = '#2f8a5b', VERM = '#c0392b', AZ = '#2b6cb0', LG = 'stroke:var(--tinta);stroke-width:2.2;fill:none;stroke-linecap:round';
    var AT = 'font-size:17px;font-weight:700;text-anchor:middle;fill:var(--tinta)';
    function larg(s) { var n = 0; for (var i = 0; i < s.length; i++) n += '₀₁₂₃₄₅₆₇₈₉'.indexOf(s[i]) >= 0 ? .55 : 1; return n * 11; }
    function cor(l) { return l === 'Cℓ' ? CL : l === 'COOH' ? '#b06a1a' : 'var(--tinta)'; }
    /* linha entre dois rotulos, encurtada pela "caixa" de cada um */
    function lig(pai, a, b, ra, rb, dbl, st) {
      var dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy), ux = dx / m, uy = dy / m;
      var p = [a[0] + ux * ra, a[1] + uy * ra], q = [b[0] - ux * rb, b[1] - uy * rb];
      if (!dbl) return el('path', { d: 'M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ' L' + q[0].toFixed(1) + ' ' + q[1].toFixed(1), style: st || LG }, pai);
      var nx = -uy * 3.4, ny = ux * 3.4, g = el('g', {}, pai);
      g.l1 = el('path', { d: 'M' + (p[0] + nx).toFixed(1) + ' ' + (p[1] + ny).toFixed(1) + ' L' + (q[0] + nx).toFixed(1) + ' ' + (q[1] + ny).toFixed(1), style: st || LG }, g);
      g.l2 = el('path', { d: 'M' + (p[0] - nx).toFixed(1) + ' ' + (p[1] - ny).toFixed(1) + ' L' + (q[0] - nx).toFixed(1) + ' ' + (q[1] - ny).toFixed(1), style: st || LG }, g);
      return g;
    }
    function raio(l, ux, uy) { var a = larg(l) / 2 + 3, b = 11; return 1 / Math.sqrt((ux / a) * (ux / a) + (uy / b) * (uy / b)); }
    /* alceno X1(cima-esq) X2(baixo-esq) C=C X3(cima-dir) X4(baixo-dir), angulos de 120 graus */
    function alceno(pai, cx, cy, L, D) {
      var g = el('g', {}, pai), c1 = [cx - 22, cy], c2 = [cx + 22, cy];
      var ang = [120, 240, 60, 300], at = [];
      tx(c1[0], c1[1] + 6, 'C', AT, g); tx(c2[0], c2[1] + 6, 'C', AT, g);
      g.dup = lig(g, c1, c2, 9, 9, true);
      L.forEach(function (l, i) {
        var c = i < 2 ? c1 : c2, a = ang[i] * Math.PI / 180, ux = Math.cos(a), uy = -Math.sin(a), d = D + (larg(l) > 30 ? 12 : 0);
        var p = [c[0] + ux * d, c[1] + uy * d];
        lig(g, c, p, 9, raio(l, ux, uy));
        tx(p[0], p[1] + 6, l, AT.replace('var(--tinta)', cor(l)), g);
        at.push(p);
      });
      g.at = at; g.c1 = c1; g.c2 = c2;
      return g;
    }
    /* ===== etapa 1: simples gira, dupla nao ===== */
    var g1 = el('g', {});
    function giro(cx, dupla) {
      var g = el('g', {}, g1), cy = 112;
      tx(cx, 28, dupla ? 'dupla C=C' : 'simples C–C', 'font-size:16px;font-weight:700;text-anchor:middle;fill:var(--tinta)', g);
      var c1 = [cx - 26, cy], c2 = [cx + 26, cy];
      tx(c1[0], cy + 6, 'C', AT, g);
      var esq = [[120, 'Cℓ'], [240, 'H']];
      if (!dupla) esq.push([180, 'H']);
      esq.forEach(function (e) { var a = e[0] * Math.PI / 180, p = [c1[0] + 44 * Math.cos(a), cy - 44 * Math.sin(a)]; lig(g, c1, p, 9, 10); tx(p[0], p[1] + 6, e[1], AT.replace('var(--tinta)', cor(e[1])), g); });
      var d = lig(g, c1, c2, 9, 9, dupla);
      /* o carbono da direita gira em torno do eixo C–C (horizontal): na tela, a altura de cada ligante vira y·cos(giro) */
      var dl = [[60, 'Cℓ'], [300, 'H']];
      if (!dupla) dl.push([0, 'H']);
      var lg = dl.map(function (e) {
        var a = e[0] * Math.PI / 180;
        return { dx: 44 * Math.cos(a), dy: -44 * Math.sin(a), l: el('path', { style: LG }, g), t: tx(0, 0, e[1], AT.replace('var(--tinta)', cor(e[1])), g) };
      });
      tx(c2[0], cy + 6, 'C', AT, g);
      function gira(th) {
        lg.forEach(function (o) {
          var x = c2[0] + o.dx, y = cy + o.dy * Math.cos(th), ux = x - c2[0], uy = y - cy, m = Math.hypot(ux, uy) || 1;
          o.l.setAttribute('d', 'M' + (c2[0] + ux / m * 9).toFixed(1) + ' ' + (cy + uy / m * 9).toFixed(1) + ' L' + (x - ux / m * 10).toFixed(1) + ' ' + (y - uy / m * 10).toFixed(1));
          o.t.setAttribute('x', x.toFixed(1)); o.t.setAttribute('y', (y + 6).toFixed(1));
        });
      }
      var v = tx(cx, 196, '', 'font-size:15px;font-weight:700;text-anchor:middle', g);
      return { gira: gira, dup: d, v: v };
    }
    var GS = giro(160, false), GD = giro(480, true);
    el('line', { x1: 320, x2: 320, y1: 20, y2: 205, style: 'stroke:var(--linha);stroke-width:1.5' }, g1);
    /* ===== etapa 2: cis x trans ===== */
    var g2 = el('g', {});
    var mol = [
      { x: 170, y: 72, L: ['Cℓ', 'H', 'Cℓ', 'H'] },
      { x: 470, y: 72, L: ['Cℓ', 'H', 'H', 'Cℓ'] },
      { x: 170, y: 164, L: ['COOH', 'H', 'COOH', 'H'], n: ['ácido', 'maleico'] },
      { x: 470, y: 164, L: ['COOH', 'H', 'H', 'COOH'], n: ['ácido', 'fumárico'] }
    ];
    var M2 = mol.map(function (m) {
      var g = el('g', {}, g2);
      el('line', { x1: m.x - 62, x2: m.x + 62, y1: m.y, y2: m.y, style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:3 4' }, g);
      alceno(g, m.x, m.y, m.L, m.n ? 30 : 38);
      if (m.n) { var xo = m.x < 320 ? 52 : 588; tx(xo, m.y - 2, m.n[0], 'font-size:14px;text-anchor:middle;fill:var(--lapis)', g); tx(xo, m.y + 16, m.n[1], 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--tinta)', g); }
      return g;
    });
    tx(170, 18, 'cis: iguais do mesmo lado', 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + AZ, g2);
    tx(470, 18, 'trans: iguais em lados opostos', 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + VERM, g2);
    tx(320, 68, '1,2-dicloro-', 'font-size:14px;text-anchor:middle;fill:var(--lapis)', g2);
    tx(320, 85, 'eteno', 'font-size:14px;text-anchor:middle;fill:var(--lapis)', g2);
    tx(320, 170, 'C₄H₄O₄', 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--lapis)', g2);
    /* ===== etapa 3: condicao ===== */
    var g3 = el('g', {});
    var C3 = [
      { x: 110, L: ['H', 'H', 'H', 'H'], n: 'eteno', e: 'H = H', d: 'H = H', ok: false },
      { x: 320, L: ['H', 'H', 'Cℓ', 'H'], n: 'cloroeteno', e: 'H = H', d: 'Cℓ ≠ H', ok: false },
      { x: 530, L: ['Cℓ', 'H', 'Cℓ', 'H'], n: '1,2-dicloroeteno', e: 'Cℓ ≠ H', d: 'Cℓ ≠ H', ok: true }
    ];
    var M3 = C3.map(function (m) {
      var g = el('g', {}, g3);
      tx(m.x, 30, m.n, 'font-size:15px;font-weight:700;text-anchor:middle;fill:var(--tinta)', g);
      alceno(g, m.x, 96, m.L, 40);
      var ce = m.e.indexOf('≠') > 0 ? CL : VERM, cd = m.d.indexOf('≠') > 0 ? CL : VERM;
      var r = el('g', {}, g);
      tx(m.x - 42, 152, m.e, 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + ce, r);
      tx(m.x + 42, 152, m.d, 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + cd, r);
      tx(m.x, 184, m.ok ? 'tem cis-trans' : 'não tem cis-trans', 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + (m.ok ? CL : VERM), r);
      g.r = r;
      return g;
    });
    /* ===== etapa 4: polaridade ===== */
    var g4 = el('g', {});
    var P4 = [{ x: 160, L: ['Cℓ', 'H', 'Cℓ', 'H'], k: 'cis', pol: 'polar', eb: 'ferve a 60,2 °C' }, { x: 480, L: ['Cℓ', 'H', 'H', 'Cℓ'], k: 'trans', pol: 'apolar (polos se anulam)', eb: 'ferve a 48,5 °C' }];
    var vet = [], res;
    P4.forEach(function (m, i) {
      var g = el('g', {}, g4);
      tx(m.x, 30, m.k, 'font-size:18px;font-weight:700;text-anchor:middle;fill:' + (i ? VERM : AZ), g);
      var a = alceno(g, m.x, 104, m.L, 46);
      /* setas de polaridade C -> Cl (o Cl puxa os eletrons) */
      [[0, a.c1], [i ? 3 : 2, a.c2]].forEach(function (k) {
        var p = a.at[k[0]], c = k[1], dx = p[0] - c[0], dy = p[1] - c[1], m2 = Math.hypot(dx, dy), ux = dx / m2, uy = dy / m2, nx = -uy * 14, ny = ux * 14;
        if ((p[0] - m.x) * nx < 0) { nx = -nx; ny = -ny; }
        var x0 = c[0] + ux * 10 + nx, y0 = c[1] + uy * 10 + ny, x1 = p[0] - ux * 12 + nx, y1 = p[1] - uy * 12 + ny, ang = Math.atan2(y1 - y0, x1 - x0);
        vet.push(el('path', { d: 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' L' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' M' + (x1 - 8 * Math.cos(ang - .45)).toFixed(1) + ' ' + (y1 - 8 * Math.sin(ang - .45)).toFixed(1) + ' L' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + (x1 - 8 * Math.cos(ang + .45)).toFixed(1) + ' ' + (y1 - 8 * Math.sin(ang + .45)).toFixed(1), style: 'fill:none;stroke:' + VERM + ';stroke-width:2.2' }, g));
      });
      if (!i) res = el('path', { d: 'M' + m.x + ' 132 V176 M' + (m.x - 6) + ' 168 L' + m.x + ' 176' , style: 'display:none' }, g);
      tx(m.x, 184, m.pol, 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + (i ? 'var(--lapis)' : AZ), g);
      tx(m.x, 204, m.eb, 'font-size:15px;font-weight:700;text-anchor:middle;fill:var(--tinta)', g);
    });
    /* resultante do cis: as duas setas apontam para cima -> soma para cima */
    var resC = el('path', { d: 'M160 162 V130 M153 139 L160 130 L167 139', style: 'fill:none;stroke:' + AZ + ';stroke-width:3' }, g4);
    var resT = tx(160, 160, '', 'font-size:14px', g4);
    el('line', { x1: 320, x2: 320, y1: 20, y2: 205, style: 'stroke:var(--linha);stroke-width:1.5' }, g4);
    /* ===== painel ===== */
    el('line', { x1: 12, x2: 628, y1: 222, y2: 222, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 246, '', 'font-size:16px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 271 + 23 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. A ligação dupla não gira', 'Na ligação simples, um carbono gira em torno do outro: é sempre a mesma', 'molécula. Na dupla, a segunda ligação (π) se romperia ao girar.', 'Por isso, em volta da C=C, cada grupo fica preso no seu lado.'],
      ['2. Cis × trans', 'Cis: os ligantes iguais do mesmo lado da dupla. Trans: em lados opostos.', 'Mesma fórmula, mesma ordem de ligações, outro arranjo no espaço:', 'isomeria geométrica (cis-trans). Maleico é o cis; fumárico, o trans.'],
      ['3. Condição: cada C com dois ligantes diferentes', 'Se um carbono da dupla tem dois ligantes iguais (H e H), trocar de', 'lado dá a mesma molécula: não há cis-trans (eteno, cloroeteno).', 'Cada C precisa de dois ligantes diferentes entre si.'],
      ['4. Cis polar, trans apolar', 'Cada C–Cℓ é um polo (o Cℓ puxa elétrons). No cis os dois apontam', 'para o mesmo lado e se somam: polar, atração maior, ferve mais.', 'No trans apontam em sentidos opostos e se anulam: apolar.']
    ];
    var _desenha = function (t) {
      var f = t < T1 ? 0 : t < T2 ? 1 : t < T3 ? 2 : 3;
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      /* etapa 1 */
      var th = Math.PI * ease((t - .5) / 1.6);
      GS.gira(th);
      GS.v.textContent = t > 2.1 ? 'girou: é a mesma molécula' : ''; GS.v.style.fill = CL;
      var u = t < 1.5 ? ease((t - .5) / 1) : 1 - ease((t - 1.9) / .8), thd = 1.35 * u;
      GD.gira(thd);
      GD.dup.l2.style.stroke = u > .15 ? VERM : 'var(--tinta)'; op(GD.dup.l2, 1 - .8 * u);
      GD.v.textContent = u > .5 || (t > 1.5 && t < 2.9) ? 'girar rompe a ligação π: não gira' : ''; GD.v.style.fill = VERM;
      /* etapa 2: destaca primeiro o par de cima, depois o de baixo */
      var lin = t < T2 - 1.6 ? 0 : 1;
      M2.forEach(function (g, i) { op(g, f === 1 ? (Math.floor(i / 2) === lin || t > T2 - .6 ? 1 : .3) : 0); });
      if (qid === 'Pb33d86e' && f === 1) { M2.forEach(function (g, i) { op(g, i === 1 ? 1 : .25); }); }
      /* etapa 3: um por vez */
      M3.forEach(function (g, i) { var on = t > T2 + .3 + .9 * i; op(g, on ? 1 : .2); op(g.r, t > T2 + .7 + .9 * i ? 1 : 0); });
      /* etapa 4 */
      var v4 = cl((t - T3 - .4) / .6);
      vet.forEach(function (v) { op(v, v4); }); op(resC, cl((t - T3 - 1.3) / .5));
      var L = TXT[f];
      for (var k = 0; k < 4; k++) P[k].textContent = L[k] || '';
    };
    return fimResposta(VIS.def['isomeria-cis-trans'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'Wb991032' || q === 'Pb33d86e' ? T2 - .01 : q === 'P65cbd47' ? T3 - .01 : TF - .01; }
    });
  }
};
VIS.liga('isomeria-cis-trans', ['Wb991032', 'Pb33d86e', 'P65cbd47', 'Pca6647a']);
