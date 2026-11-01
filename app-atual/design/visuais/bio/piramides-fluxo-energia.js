/* Fluxo de energia (entra pela fotossintese, sai como calor em cada nivel, ~10% sobe), decompositores fora da piramide,
   e as tres piramides: numeros e biomassa podem inverter, energia nunca. Lote bio 9. */
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
'P8f3cb1f': ['Por isso a resposta é B',
  'O produtor transforma luz em energia química, mas queima',
  'grande parte dela na própria respiração (sai como calor).',
  'Só o que sobra fica no corpo dele para o consumidor primário.'],
'W797d420': ['Por isso a resposta é E',
  'Os decompositores comem restos de todos os níveis ao',
  'mesmo tempo: não cabem em nenhum degrau da pirâmide.'],
'Wa8bb125': ['Por isso a resposta é C',
  'A energia não volta: entra como luz e sai como calor.',
  'A única entrada de energia nova no lago é a fotossíntese.'],
'W6b81b3f': ['Por isso a resposta é D',
  'Topo mais largo que a base = pirâmide invertida. Energia',
  'nunca inverte; números e biomassa podem. Sem unidade na',
  'figura, só dá para dizer: invertida, de biomassa ou número.'],
'W38fe97d': ['Por isso a resposta é C',
  'A pirâmide de energia mede a energia TOTAL de cada nível:',
  'maior nos produtores, menor nos carnívoros. Não diz',
  'quantos indivíduos há nem quanta energia tem cada um.'],
'Wab3e2ba': ['Por isso a resposta é A',
  'Base estreita + 2º degrau larguíssimo:',
  'uma árvore grande sustenta muitos',
  'herbívoros pequenos. Jacarandá, larvas',
  'de borboleta, besouros e, no topo, a coruja.']
};
VIS.def['piramides-fluxo-energia'] = {
  tit: 'A energia entra como luz, sai como calor e só diminui a cada nível',
  fontes: ['OpenStax, Biology 2e, 46.2 Energy Flow through Ecosystems (PPB e PPL, perda como calor metabólico, pirâmides de números, biomassa e energia; floresta temperada e Canal da Mancha) — https://openstax.org/books/biology-2e/pages/46-2-energy-flow-through-ecosystems',
    'Wikipedia (en), Ecological pyramid — https://en.wikipedia.org/wiki/Ecological_pyramid',
    'Wikipedia (en), Ten percent law (eficiência de transferência ~10%, varia de ~5 a 20%) — https://en.wikipedia.org/wiki/Ten_percent_law'],
  tipo: 'anim', dur: 14,
  marcas: [[0, '1. Luz'], [2.8, '2. Respira'], [5.4, '3. 10% sobe'], [8, '4. Restos'], [10.6, '5. Invertida']],
  cred: 'Animação feita para o app (esquema fora de escala; valores redondos só para ilustrar a regra dos ~10%, que na natureza varia de cerca de 5 a 20%).',
  nota: 'Matéria circula (ciclos); energia flui num sentido só: entra pela fotossíntese e sai como calor da respiração de todos os níveis.',
  monta: function (svg, qid) {
    var K = kit(svg), el = K.el, tx = K.tx, cl = K.cl, ease = K.ease, lerp = K.lerp, op = K.op;
    svg.setAttribute('viewBox', '0 0 640 354');
    var PROD = '#3f8a3a', HERB = '#b08a1e', CARN = '#b4552f', CAL = '#d0621f', DEC = '#7a5a3a';
    var M = [0, 2.8, 5.4, 8, 10.6], TF = 14;
    /* ===== cena A: piramide de energia com fluxo ===== */
    var A = el('g', {});
    var CX = 300, NV = [
      { y: 212, w: 340, cor: PROD, n: 'Produtores', v: '10 000 kcal' },
      { y: 150, w: 210, cor: HERB, n: 'Herbívoros', v: '1 000 kcal' },
      { y: 88, w: 116, cor: CARN, n: 'Carnívoros', v: '100 kcal' }];
    NV.forEach(function (n, i) {
      n.g = el('g', {}, A);
      n.r = el('rect', { x: CX - n.w / 2, y: n.y, width: n.w, height: 48, rx: 6, style: 'fill:color-mix(in srgb,' + n.cor + ' 18%,var(--folha));stroke:' + n.cor + ';stroke-width:2' }, n.g);
      n.fill = el('rect', { x: CX - n.w / 2, y: n.y, width: n.w, height: 48, rx: 6, style: 'fill:color-mix(in srgb,' + n.cor + ' 42%,var(--folha))' }, n.g);
      tx(CX, n.y + 21, n.n, 'font-size:14.5px;font-weight:700;fill:' + n.cor + ';text-anchor:middle', n.g);
      n.vt = tx(CX, n.y + 39, n.v, 'font-size:13px;font-weight:600;fill:var(--tinta);text-anchor:middle', n.g);
    });
    /* sol e luz */
    var sol = el('g', {}, A);
    el('circle', { cx: 46, cy: 52, r: 22, style: 'fill:#f2c230;stroke:#d9a514;stroke-width:2' }, sol);
    for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; el('line', { x1: 46 + 28 * Math.cos(a), y1: 52 + 28 * Math.sin(a), x2: 46 + 36 * Math.cos(a), y2: 52 + 36 * Math.sin(a), style: 'stroke:#d9a514;stroke-width:2.5;stroke-linecap:round' }, sol); }
    tx(14, 104, 'luz do Sol', 'font-size:13.5px;font-weight:700;fill:#a07a0a', sol);
    var luz = K.seta(A, 70, 74, CX - 140, 210, '#d9a514', 3);
    var luzT = el('g', {}, A);
    tx(18, 150, 'fotossíntese:', 'font-size:13.5px;font-weight:700;fill:' + PROD, luzT);
    tx(18, 167, 'só ~1% da luz', 'font-size:13px;fill:var(--tinta)', luzT);
    tx(18, 183, 'vira energia química', 'font-size:13px;fill:var(--tinta)', luzT);
    var foton = el('circle', { r: 6, style: 'fill:#f2c230;stroke:#d9a514;stroke-width:1.5' }, A);
    /* calor (respiracao) saindo de cada nivel */
    function onda(pai, x, y) {
      var d = 'M' + x + ' ' + y; for (var j = 0; j < 2; j++) d += ' q 7 -5 0 -10 q -7 -5 0 -10';
      el('path', { d: d, style: 'fill:none;stroke:' + CAL + ';stroke-width:2.4;stroke-linecap:round' }, pai);
      el('path', { d: 'M' + (x - 6) + ' ' + (y - 34) + ' l6 -9 l6 9', style: 'fill:none;stroke:' + CAL + ';stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round' }, pai);
    }
    NV.forEach(function (n, i) {
      n.cal = el('g', {}, A);
      var xc = CX + n.w / 2 + 14;
      onda(n.cal, xc, n.y + 44);
      tx(xc + 12, n.y + 14, 'calor', 'font-size:13.5px;font-weight:700;fill:' + CAL, n.cal);
      tx(xc + 12, n.y + 31, i === 0 ? 'respiração do produtor' : 'respiração', 'font-size:13px;fill:' + CAL, n.cal);
    });
    /* setas de ~10% subindo */
    var sobe = [0, 1].map(function (i) {
      var g = el('g', {}, A), xs = CX - NV[i + 1].w / 2 - 22, y1 = NV[i].y - 2, y2 = NV[i + 1].y + 24;
      el('path', { d: 'M' + xs + ' ' + y1 + ' V' + y2 + ' H' + (xs + 18), style: 'fill:none;stroke:var(--tinta);stroke-width:2.4;stroke-linejoin:round' }, g);
      K.seta(g, xs + 8, y2, xs + 20, y2, 'var(--tinta)', 2.4);
      tx(xs - 6, y2 + 5, '~10%', 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:end', g);
      g.xs = xs; g.y1 = y1; g.y2 = y2;
      return g;
    });
    var bola = el('circle', { r: 6, style: 'fill:var(--ad-c)' }, A);
    /* decompositores, fora da piramide */
    var D = el('g', {}, A);
    var DX = 8, DY = 108;
    el('rect', { x: DX, y: DY, width: 150, height: 58, rx: 10, style: 'fill:color-mix(in srgb,' + DEC + ' 12%,var(--folha));stroke:' + DEC + ';stroke-width:2;stroke-dasharray:6 4' }, D);
    tx(DX + 10, DY + 22, 'Decompositores', 'font-size:14.5px;font-weight:700;fill:' + DEC, D);
    tx(DX + 10, DY + 42, 'fungos e bactérias', 'font-size:13px;fill:var(--tinta)', D);
    NV.forEach(function (n, i) {
      var x0 = CX - n.w / 2 - 4, y0 = n.y + 24, xe = DX + 152, ye = DY + 29 + (1 - i) * 12;
      el('path', { d: 'M' + x0 + ' ' + y0 + ' C' + (x0 - 30) + ' ' + y0 + ' ' + (xe + 30) + ' ' + ye + ' ' + xe + ' ' + ye, style: 'fill:none;stroke:' + DEC + ';stroke-width:1.8;stroke-dasharray:5 4' }, D);
      el('circle', { cx: xe + 1, cy: ye, r: 3, style: 'fill:' + DEC }, D);
    });
    tx(DX, DY + 82, 'restos de TODOS', 'font-size:13px;font-weight:700;fill:' + DEC, D);
    tx(DX, DY + 98, 'os níveis', 'font-size:13px;font-weight:700;fill:' + DEC, D);
    /* ===== cena B: tres piramides ===== */
    var B = el('g', {});
    function col(cx, tit, barras, veredito, bom) {
      tx(cx, 26, tit[0], 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', B);
      tx(cx, 44, tit[1], 'font-size:13px;fill:var(--lapis);text-anchor:middle', B);
      barras.forEach(function (b, i) {
        var y = 218 - i * 40;
        el('rect', { x: cx - b.w / 2, y: y, width: b.w, height: 34, rx: 5, style: 'fill:color-mix(in srgb,' + b.cor + ' 22%,var(--folha));stroke:' + b.cor + ';stroke-width:2' }, B);
        var dentro = b.w > b.t.length * 7.2 + 10;
        tx(dentro ? cx : cx + b.w / 2 + 6, y + 22, b.t, 'font-size:13px;font-weight:600;fill:var(--tinta)' + (dentro ? ';text-anchor:middle' : ''), B);
      });
      tx(cx, 272, veredito, 'font-size:14.5px;font-weight:700;text-anchor:middle;fill:' + (bom ? '#2f7a34' : '#b4442f'), B);
    }
    col(112, ['de números', 'uma floresta'], [
      { w: 40, t: '1 árvore', cor: PROD }, { w: 196, t: 'milhares de lagartas', cor: HERB },
      { w: 120, t: 'aves insetívoras', cor: CARN }, { w: 34, t: 'gavião', cor: '#7a3a5a' }], 'pode inverter', false);
    col(332, ['de biomassa', 'o mar (Canal da Mancha)'], [
      { w: 98, t: 'fitoplâncton', cor: PROD }, { w: 180, t: 'zooplâncton', cor: HERB }], 'pode inverter', false);
    col(530, ['de energia', 'qualquer ecossistema'], [
      { w: 180, t: 'produtores', cor: PROD }, { w: 86, t: 'herbívoros', cor: HERB }, { w: 30, t: 'carnívoros', cor: CARN }], 'nunca inverte', true);
    var painel = K.painel();
    var _desenha = function (t) {
      var e = K.etapa(t, M);
      var aA = t < 10.4 ? 1 : 1 - cl((t - 10.4) / .3), aB = cl((t - 10.6) / .3);
      op(A, aA); op(B, aB);
      /* etapa 1: luz entrando */
      op(luz, e === 0 ? 1 : e === 3 ? 0 : .35); op(luzT, e === 0 ? 1 : e === 1 ? .45 : 0); op(sol, e === 3 ? .3 : 1);
      var u = ((t % 1.4) / 1.4);
      foton.setAttribute('cx', lerp(70, CX - 140, u).toFixed(1)); foton.setAttribute('cy', lerp(74, 210, u).toFixed(1)); op(foton, e === 0 && t > .3 ? 1 : 0);
      var enche = [cl(t / 2.2), cl((t - 5.6) / 1), cl((t - 6.8) / 1)];
      NV.forEach(function (n, i) {
        n.fill.setAttribute('width', (n.w * (i === 0 ? enche[0] : t >= 8 ? 1 : enche[i])).toFixed(1));
        op(n.g, i === 0 ? 1 : (e >= 2 ? .3 + .7 * enche[i] : .3));
        op(n.cal, e === 1 ? (i === 0 ? 1 : 0) : e === 2 ? (enche[i] > .5 || i === 0 ? 1 : 0) : e >= 3 ? .35 : 0);
      });
      sobe.forEach(function (s, i) { op(s, e === 2 ? (t > 5.4 + i * 1.2 ? 1 : 0) : e > 3 ? .5 : 0); });
      if (e === 2) { var v = ((t - 5.4) % 1.2) / 1.2, j = t < 6.6 ? 0 : 1, s = sobe[j]; bola.setAttribute('cx', s.xs); bola.setAttribute('cy', lerp(s.y1, s.y2, ease(v)).toFixed(1)); op(bola, 1); } else op(bola, 0);
      op(D, e === 3 ? 1 : 0);
      var L;
      if (e === 0) L = ['1. A energia entra pela fotossíntese', 'Só os produtores captam energia de fora do ecossistema: a luz do Sol.', 'Respirar, comer ou guardar não trazem energia nova; a fotossíntese traz.'];
      else if (e === 1) L = ['2. O produtor gasta boa parte respirando', 'A planta também vive: queima na própria respiração grande parte do que', 'fixou, e isso sai como calor. Só o que sobra no corpo dela pode ser comido.'];
      else if (e === 2) L = ['3. Cada nível respira; só ~10% sobe', 'Herbívoros e carnívoros também respiram e perdem calor. A energia nunca', 'volta: flui num sentido só. A pirâmide de energia mostra o total de cada nível.'];
      else if (e === 3) L = ['4. Decompositores ficam fora da pirâmide', 'Fungos e bactérias comem restos de produtores, herbívoros e carnívoros', 'ao mesmo tempo. Não têm um degrau próprio, então não aparecem.'];
      else L = ['5. Números e biomassa podem inverter; energia, não', 'Uma árvore sustenta milhares de lagartas; o fitoplâncton, pequeno mas que se', 'renova rápido, sustenta mais zooplâncton. A energia sempre diminui ao subir.'];
      painel(L);
    };
    return fimResposta(VIS.def['piramides-fluxo-energia'], svg, _desenha, TF, RESP, qid, { x: qid === 'Wab3e2ba' ? 222 : undefined, w: qid === 'Wab3e2ba' ? 412 : undefined, y: { P8f3cb1f: 4, W6b81b3f: 2 }[qid], congela: function (q) {
      return { P8f3cb1f: 5.2, W797d420: 10.2, Wa8bb125: 2.4, W6b81b3f: 13.9, W38fe97d: 7.9, Wab3e2ba: 13.9 }[q] || TF - .001; } });
  }
};
VIS.liga('piramides-fluxo-energia', ['P8f3cb1f', 'W797d420', 'Wa8bb125', 'W6b81b3f', 'W38fe97d', 'Wab3e2ba']);
