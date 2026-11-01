/* Sucessao ecologica num campo abandonado: PPB, respiracao (R), PPL = PPB - R e biomassa ao longo do tempo;
   PPL alta nas pioneiras, perto de zero no climax; primaria (rocha, liquens) x secundaria (solo, herbaceas). Lote bio 9. */
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
'Pe1d4e32': ['Por isso a resposta é A',
  'No começo há pouca biomassa respirando: a PPL (PPB − R) é',
  'alta e positiva, então a fotossíntese supera a respiração.',
  'A PPL cai depois porque a respiração cresce, não a PPB.'],
'Wf50f24f': ['Por isso a resposta é D',
  'O estágio final, relativamente estável, é a comunidade clímax:',
  'biomassa máxima e quase tudo o que produz é gasto respirando.',
  'Primária e secundária são tipos de sucessão, não estágios.']
};
VIS.def['sucessao-ecologica-produtividade'] = {
  tit: 'Sucessão ecológica: a biomassa sobe e a sobra (PPL) cai',
  fontes: ['OpenStax, Biology 2e, 45.6 Community Ecology, Ecological Succession (pioneiras, sucessão primária e secundária, comunidade clímax) — https://openstax.org/books/biology-2e/pages/45-6-community-ecology',
    'OpenStax, Biology 2e, 46.2 Energy Flow through Ecosystems (PPB, PPL = PPB − respiração) — https://openstax.org/books/biology-2e/pages/46-2-energy-flow-through-ecosystems',
    'Odum, E. P. (1969), The strategy of ecosystem development, Science 164: 262-270 (produção líquida alta no início e baixa no clímax, biomassa máxima no clímax) — https://doi.org/10.1126/science.164.3877.262'],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. Pioneiras'], [3, '2. Biomassa'], [6, '3. Clímax'], [9, '4. Tipos']],
  cred: 'Animação feita para o app (curvas esquemáticas em valores relativos; a biomassa está em escala própria).',
  nota: 'PPB = tudo o que os produtores fabricam na fotossíntese; R = o que a comunidade gasta respirando; PPL = PPB − R, a sobra que vira biomassa nova.',
  monta: function (svg, qid) {
    var K = kit(svg), el = K.el, tx = K.tx, cl = K.cl, ease = K.ease, lerp = K.lerp, op = K.op;
    svg.setAttribute('viewBox', '0 0 640 354');
    var M = [0, 3, 6, 9], TF = 12;
    var CB = '#2f7a34', CR = '#c4562a', CL = '#2b6cb0', CM = '#8a6a2a';
    function ppb(s) { return .40 + .48 * (1 - Math.exp(-3 * s)); }
    function res(s) { return .03 + .76 * (1 - Math.exp(-3.4 * s)); }
    function ppl(s) { return ppb(s) - res(s); }
    function bio(s) { return .04 + .58 * Math.pow(1 - Math.exp(-2.4 * s), 1.4); }
    function S(t) { return t < 3 ? .06 : t < 6 ? lerp(.06, .62, ease((t - 3) / 2.8)) : lerp(.62, 1, ease((t - 6) / 2.4)); }
    /* ===== paisagem ===== */
    var A = el('g', {});
    el('rect', { x: 14, y: 8, width: 612, height: 92, rx: 10, style: 'fill:color-mix(in srgb,#8fc0e8 14%,var(--folha))' }, A);
    el('rect', { x: 14, y: 88, width: 612, height: 12, style: 'fill:color-mix(in srgb,#b08a5a 40%,var(--folha))' }, A);
    var sem = 7; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    var ervas = [], arbs = [], arvs = [];
    for (var i = 0; i < 26; i++) { var g = el('g', {}, A), x = 24 + i * 23.5 + rnd() * 6; el('path', { d: 'M' + x + ' 89 l-5 -12 M' + x + ' 89 l0 -15 M' + x + ' 89 l5 -12', style: 'fill:none;stroke:#6aa84f;stroke-width:2;stroke-linecap:round' }, g); ervas.push(g); }
    for (i = 0; i < 9; i++) { g = el('g', {}, A); x = 40 + i * 66 + rnd() * 18; el('ellipse', { cx: x, cy: 78, rx: 18, ry: 13, style: 'fill:#7aa860;stroke:#4f7a3a;stroke-width:1.5' }, g); arbs.push(g); }
    for (i = 0; i < 6; i++) { g = el('g', {}, A); x = 180 + i * 78 + rnd() * 16; el('rect', { x: x - 4, y: 52, width: 8, height: 37, style: 'fill:#7a5a3a' }, g); el('circle', { cx: x, cy: 40, r: 25, style: 'fill:#3f7a3a;stroke:#2f5a2a;stroke-width:1.5' }, g); arvs.push(g); }
    var estT = tx(26, 30, '', 'font-size:14.5px;font-weight:700;fill:var(--tinta);paint-order:stroke;stroke:var(--folha);stroke-width:4px', A);
    /* ===== grafico ===== */
    var X0 = 64, X1 = 612, Y0 = 260, H = 126;
    function gx(s) { return X0 + (X1 - X0) * s; } function gy(v) { return Y0 - H * v; }
    el('path', { d: 'M' + X0 + ' ' + (Y0 - H - 6) + ' V' + Y0 + ' H' + (X1 + 8), style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, A);
    tx(X1 + 8, Y0 + 16, 'tempo de sucessão →', 'font-size:13px;fill:var(--lapis);text-anchor:end', A);
    tx(X0 - 8, Y0 - H + 4, 'alto', 'font-size:13px;fill:var(--lapis);text-anchor:end', A);
    tx(X0 - 8, Y0, 'zero', 'font-size:13px;fill:var(--lapis);text-anchor:end', A);
    function curva(cor, w, tr) { return el('path', { style: 'fill:none;stroke:' + cor + ';stroke-width:' + w + ';stroke-linejoin:round' + (tr ? ';stroke-dasharray:' + tr : '') }, A); }
    var cM = curva(CM, 2.6, '7 5'), cR = curva(CR, 3), cB = curva(CB, 3), cL = curva(CL, 3.6);
    var rot = [
      { s: .30, f: ppb, dy: -8, t: 'PPB (fotossíntese)', c: CB },
      { s: .62, f: res, dy: 18, t: 'R (respiração)', c: CR },
      { s: .80, f: bio, dy: 18, t: 'biomassa', c: CM },
      { s: .74, f: ppl, dy: -8, t: 'PPL = PPB − R', c: CL }].map(function (r) {
        r.el = tx(gx(r.s), gy(r.f(r.s)) + r.dy, r.t, 'font-size:13.5px;font-weight:700;fill:' + r.c + ';paint-order:stroke;stroke:var(--folha);stroke-width:4px', A); return r; });
    var cur = el('line', { y1: Y0 - H - 6, y2: Y0, style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:3 3' }, A);
    /* colchete PPL */
    var br = el('g', {}, A), brB = tx(0, 0, 'PPB', 'font-size:13px;font-weight:700;fill:' + CB, br), brR = tx(0, 0, 'R', 'font-size:13px;font-weight:700;fill:' + CR, br), brL = el('path', { style: 'fill:none;stroke:' + CL + ';stroke-width:2.6' }, br), brT = tx(0, 0, '', 'font-size:13.5px;font-weight:700;fill:' + CL + ';paint-order:stroke;stroke:var(--folha);stroke-width:4px', br);
    /* ===== cena B: primaria x secundaria ===== */
    var B = el('g', {});
    function linha(y, tit, sub, itens, cor) {
      tx(16, y, tit, 'font-size:15px;font-weight:700;fill:' + cor, B); tx(16, y + 18, sub, 'font-size:13px;fill:var(--lapis)', B);
      var x = 16;
      itens.forEach(function (it, k) {
        var w = it.length * 7.4 + 18;
        el('rect', { x: x, y: y + 30, width: w, height: 34, rx: 8, style: 'fill:color-mix(in srgb,' + (k === 0 ? '#999' : k === itens.length - 1 ? '#2f7a34' : cor) + ' 14%,var(--folha));stroke:' + (k === 0 ? '#999' : k === itens.length - 1 ? '#2f7a34' : cor) + ';stroke-width:1.6' }, B);
        tx(x + w / 2, y + 52, it, 'font-size:13.5px;font-weight:600;fill:var(--tinta);text-anchor:middle', B);
        x += w; if (k < itens.length - 1) { K.seta(B, x + 3, y + 47, x + 15, y + 47, 'var(--lapis)', 2); x += 19; }
      });
    }
    linha(28, 'Sucessão primária', 'começa sem solo: rocha nua, lava resfriada', ['rocha nua', 'liquens', 'musgos', 'herbáceas', 'arbustos', 'clímax'], '#7a5a9e');
    linha(140, 'Sucessão secundária', 'já há solo: roça ou pasto abandonado, área queimada', ['solo exposto', 'herbáceas', 'arbustos', 'árvores', 'clímax'], '#a07a10');
    tx(16, 262, 'Pioneiras: liquens na rocha (primária); ervas e gramíneas no campo (secundária).', 'font-size:13.5px;font-weight:600;fill:var(--tinta)', B);
    var painel = K.painel();
    var _desenha = function (t) {
      var e = K.etapa(t, M), s = S(t);
      op(A, t < 8.8 ? 1 : 1 - cl((t - 8.8) / .3)); op(B, cl((t - 9) / .3));
      /* plantas */
      ervas.forEach(function (g, k) { op(g, cl(s / .12 - k * .02) * (s > .7 ? .55 : 1)); });
      arbs.forEach(function (g, k) { op(g, cl((s - .22 - k * .02) / .12)); });
      arvs.forEach(function (g, k) { var u = cl((s - .5 - k * .03) / .2); op(g, u); g.setAttribute('transform', 'translate(0 ' + ((1 - u) * 30).toFixed(1) + ')'); });
      estT.textContent = s < .2 ? 'Campo abandonado: ervas pioneiras' : s < .5 ? 'Arbustos chegam' : s < .9 ? 'Árvores crescem' : 'Floresta clímax';
      /* curvas ate o cursor */
      function d(f) { var p = ''; for (var k = 0; k <= 60; k++) { var u = s * k / 60; p += (k ? 'L' : 'M') + gx(u).toFixed(1) + ' ' + gy(f(u)).toFixed(1) + ' '; } return p; }
      cB.setAttribute('d', d(ppb)); cR.setAttribute('d', d(res)); cL.setAttribute('d', d(ppl)); cM.setAttribute('d', d(bio));
      rot.forEach(function (r) { op(r.el, s >= r.s ? 1 : 0); });
      cur.setAttribute('x1', gx(s).toFixed(1)); cur.setAttribute('x2', gx(s).toFixed(1));
      /* colchete: PPB - R no instante do cursor (etapas 1 e 3) */
      var sb = e === 0 ? s : e === 2 && t > 8.2 ? 1 : -1;
      if (sb >= 0) {
        var xb = gx(sb) + (sb > .9 ? -14 : 12), yb = gy(ppb(sb)), yr = gy(res(sb));
        brL.setAttribute('d', 'M' + (xb - 6) + ' ' + yb + ' H' + xb + ' V' + yr + ' H' + (xb - 6));
        brT.textContent = sb > .9 ? 'PPL ≈ 0' : 'PPL grande';
        brT.setAttribute('x', sb > .9 ? xb - 10 : xb + 8); brT.setAttribute('y', sb > .9 ? yb - 10 : (yb + yr) / 2 + 5); brT.style.textAnchor = sb > .9 ? 'end' : 'start';
        brB.setAttribute('x', xb + 4); brB.setAttribute('y', yb - 6); brR.setAttribute('x', xb + 4); brR.setAttribute('y', yr + 16); op(brB, sb > .9 ? 0 : 1); op(brR, sb > .9 ? 0 : 1);
        op(br, 1);
      } else op(br, 0);
      var L;
      if (e === 0) L = ['1. Pioneiras: pouca biomassa, PPL alta', 'Há pouca matéria viva respirando (R baixa). A fotossíntese (PPB) supera', 'a respiração: sobra muito (PPL = PPB − R), e a comunidade cresce.'];
      else if (e === 1) L = ['2. A biomassa acumula e a respiração sobe', 'Chegam arbustos e árvores. A PPB até aumenta, mas a respiração de tanta', 'biomassa cresce mais rápido: a sobra (PPL) vai diminuindo.'];
      else if (e === 2) L = ['3. Clímax: biomassa máxima, PPL perto de zero', 'A comunidade produz muito e gasta quase tudo respirando. É o estágio final,', 'relativamente estável (equilíbrio dinâmico): a comunidade clímax.'];
      else L = ['4. Primária × secundária: muda só o começo', 'Primária e secundária são tipos de sucessão, conforme já exista solo ou não.', 'Pioneira, intermediária e clímax são os estágios.'];
      painel(L);
    };
    return fimResposta(VIS.def['sucessao-ecologica-produtividade'], svg, _desenha, TF, RESP, qid, { x: qid === 'Pe1d4e32' ? 204 : undefined, w: qid === 'Pe1d4e32' ? 430 : undefined, congela: function (q) {
      return { Pe1d4e32: 2.9, Wf50f24f: 8.7 }[q] || TF - .001; } });
  }
};
VIS.liga('sucessao-ecologica-produtividade', ['Pe1d4e32', 'Wf50f24f']);
