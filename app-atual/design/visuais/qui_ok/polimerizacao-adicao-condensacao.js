/* Polimeros: adicao (a dupla abre; volta ao monomero, estireno) x condensacao (PET = poliester;
   nailon/Kevlar = poliamida, mesma ligacao da peptidica), com a agua liberada a cada ligacao. */
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
'P26d3188': ['Por isso a resposta é D',
'Polipropileno = poli + propileno (propeno, CH₂=CH–CH₃): a dupla abre e as',
'unidades –CH₂–CH(CH₃)– se encadeiam, com 3 C cada, sem perder átomos.'],
'W5b45917': ['Por isso a resposta é C',
'Adição exige C=C. I (CH₂=CH–CH₂Br) e IV (CH₂=CHCℓ) têm a dupla;',
'o tetrafluoretano e o propan-1-ol só têm ligações simples.'],
'Pdb1f85d': ['Por isso a resposta é C',
'Fechando a dupla da unidade –CH₂–CH(C₆H₅)– volta-se ao estireno,',
'C₆H₅CH=CH₂ (C₈H₈): polímero de adição de um só monômero.'],
'Pf50dd5c': ['Por isso a resposta é D',
'Composto 1: estireno, C₆H₅–CH=CH₂ (a unidade do isopor com a dupla de volta).',
'Reação 2: ácido + diol formam o PET soltando água: condensação.'],
'P2d74c77': ['Por isso a resposta é A',
'Na cadeia do PET, cada O simples fica entre uma carbonila e um carbono:',
'–C(=O)–O–, o grupo éster. O PET é um poliéster.'],
'Pcd2f026': ['Por isso a resposta é A',
'O Kevlar se forma soltando H₂O (condensação) e liga as unidades por',
'–C(=O)–NH–, a amida: a mesma ligação peptídica das proteínas.'],
'Wa1c74ea': ['Por isso a resposta é E',
'Desfazendo cada amida, o trecho –CO–(CH₂)₄–CO– volta a ácido',
'dicarboxílico e o –NH–(CH₂)₆–NH– volta a diamina primária.']
};
VIS.def['polimerizacao-adicao-condensacao'] = {
  tit: 'Polímeros de adição × de condensação',
  fontes: ['OpenStax, Chemistry 2e, 20.1 Hydrocarbons e 20.4 Amines and Amides (polímeros; náilon) — https://openstax.org/books/chemistry-2e/pages/20-4-amines-and-amides', 'OpenStax, Organic Chemistry (McMurry), 8.10 Radical Additions to Alkenes: Chain-Growth Polymers e 21.9 Polyamides and Polyesters: Step-Growth Polymers — https://openstax.org/books/organic-chemistry/pages/21-9-polyamides-and-polyesters-step-growth-polymers', 'Wikipedia (en), Polyethylene terephthalate; Nylon 66; Kevlar; Polystyrene — https://en.wikipedia.org/wiki/Polyethylene_terephthalate'],
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Adição'], [4, 'Monômero'], [7.5, 'PET'], [11.5, 'Poliamida']],
  cred: 'Animação feita para o app (fórmulas condensadas; três unidades representam a cadeia). Fórmula do estireno contada no código.',
  nota: 'Adição: o monômero tem C=C, a dupla abre e as unidades se encadeiam sem perder nenhum átomo (PE, PP, PVC, PS). Condensação: monômeros com dois grupos reagem e soltam uma molécula pequena (água) a cada ligação: ácido + diol dá poliéster (PET); ácido + diamina dá poliamida (náilon, Kevlar), com a mesma ligação –CO–NH– das proteínas.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var T1 = 4, T2 = 7.5, T3 = 11.5, TF = 15;
    var NOVA = '#2f8a5b', AGUA = '#2b6cb0', SAI = '#c0392b', EST = '#b06a1a', AMI = '#8a5a9e';
    var LG = 'stroke:var(--tinta);stroke-width:2.2;fill:none;stroke-linecap:round';
    var AT = 'font-size:16px;font-weight:700;text-anchor:middle;fill:var(--tinta)';
    function larg(s) { var n = 0; for (var i = 0; i < s.length; i++) n += '₀₁₂₃₄₅₆₇₈₉⁺ₙ'.indexOf(s[i]) >= 0 ? .55 : s[i] === ' ' ? .4 : s[i] === '(' || s[i] === ')' || s[i] === '[' || s[i] === ']' ? .5 : s[i] === '…' ? .9 : 1; return n * 10.2; }
    function cadeia(g, x, y, toks, gap) {
      gap = gap || 16; var pos = [];
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
          if (s.b === 2) el('path', { d: 'M' + (cx - 3.5) + ' ' + (y + s.d * 13) + ' V' + (y + s.d * 28) + ' M' + (cx + 3.5) + ' ' + (y + s.d * 13) + ' V' + (y + s.d * 28), style: LG }, gg);
          else el('path', { d: 'M' + cx + ' ' + (y + s.d * 13) + ' V' + (y + s.d * 28), style: LG }, gg);
          tx(cx, y + s.d * 40 + 6, s.l, AT.replace('var(--tinta)', s.c || 'var(--tinta)'), gg);
        });
        pos.push({ x: cx, w: w }); x += w;
      });
      pos.fim = x; return pos;
    }
    function largCad(toks, gap) { var w = 0; toks.forEach(function (k, i) { w += larg(k.l) + (i ? (gap || 16) : 0); }); return w; }
    function caixa(pai, pos, i, j, y, cor, rot, cima) {
      var x0 = pos[i].x - pos[i].w / 2 - 6, x1 = pos[j].x + pos[j].w / 2 + 6, g = el('g', {}, pai);
      el('rect', { x: x0, y: y - 15, width: x1 - x0, height: 30, rx: 8, style: 'fill:color-mix(in srgb,' + cor + ' 12%,transparent);stroke:' + cor + ';stroke-width:2' }, g);
      tx((x0 + x1) / 2, cima ? y - 48 : y + 36, rot, 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + cor, g);
      return g;
    }
    /* ===== etapa 1: adicao (propeno -> polipropileno) ===== */
    var g1 = el('g', {});
    tx(20, 24, 'n CH₂=CH–X  →  –[CH₂–CH(X)]ₙ–   (aqui X = CH₃)', 'font-size:15px;font-weight:700;fill:var(--lapis)', g1);
    var mono = [], pontes = [], y1 = 74, wU = largCad([{ l: 'CH₂' }, { l: 'CH' }]);
    for (var i = 0; i < 3; i++) {
      var g = el('g', {}, g1), sec = el('g', {}, g);
      var p = cadeia(g, 0, y1, [{ l: 'CH₂' }, { l: 'CH', b: 0, s: [{ l: 'CH₃', d: 1 }] }]);
      var xa = p[0].x + p[0].w / 2 + 3;
      el('path', { d: 'M' + xa + ' ' + y1 + ' h10', style: LG }, g);
      el('path', { d: 'M' + xa + ' ' + (y1 - 5) + ' h10', style: LG.replace('var(--tinta)', SAI) }, sec);
      g.sec = sec; mono.push(g);
      if (i) pontes.push(el('path', { style: LG.replace('var(--tinta)', NOVA) + ';stroke-width:2.8' }, g1));
    }
    var pontas = el('path', { style: LG.replace('var(--tinta)', NOVA) + ';stroke-width:2.8' }, g1);
    var X0 = [70, 270, 470], XF = [], passo = wU + 16, xi = 320 - (3 * wU + 2 * 16) / 2;
    for (var k2 = 0; k2 < 3; k2++) XF.push(xi + k2 * passo);
    var nada = tx(320, 150, 'nada sai: cada unidade tem os mesmos átomos do monômero', 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + NOVA, g1);
    var tab = el('g', {}, g1);
    [['X = H', 'polietileno (eteno)'], ['X = CH₃', 'polipropileno (propeno)'], ['X = Cℓ', 'PVC (cloroeteno)'], ['X = C₆H₅', 'poliestireno (estireno)']].forEach(function (r, i) {
      var x = i % 2 ? 330 : 20, y = i < 2 ? 182 : 206;
      tx(x, y, r[0] + ' → ' + r[1], 'font-size:15px;fill:var(--tinta)' + (i === 1 ? ';font-weight:700' : ''), tab);
    });
    /* ===== etapa 2: de volta ao monomero (poliestireno -> estireno) ===== */
    var g2 = el('g', {}), y2 = 86;
    tx(20, 24, 'poliestireno (isopor)', 'font-size:15px;font-weight:700;fill:var(--lapis)', g2);
    var u2 = cadeia(g2, 30, y2, [{ l: '–[' }, { l: 'CH₂', b: 0 }, { l: 'CH', s: [{ l: 'C₆H₅', d: 1 }] }, { l: ']ₙ–', b: 0 }]);
    el('path', { d: 'M' + (u2.fim + 22) + ' ' + y2 + ' h70 m-9 -6 l9 6 l-9 6', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, g2);
    tx(u2.fim + 57, y2 - 12, 'reabra a dupla', 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--lapis)', g2);
    var m2 = el('g', {}, g2);
    var e2 = cadeia(m2, u2.fim + 112, y2, [{ l: 'CH₂' }, { l: 'CH', b: 2, s: [{ l: 'C₆H₅', d: 1 }] }]);
    var CC = { C: 2 + 6, H: 2 + 1 + 5 };
    var c2 = el('g', {}, g2);
    tx(e2.fim + 16, y2 + 6, 'estireno', 'font-size:17px;font-weight:700;fill:' + NOVA, c2);
    tx(320, 178, 'C: 2 + 6 = ' + CC.C + ' · H: 2 + 1 + 5 = ' + CC.H + ' → C' + '₀₁₂₃₄₅₆₇₈₉'[CC.C] + 'H' + '₀₁₂₃₄₅₆₇₈₉'[CC.H], 'font-size:16px;font-weight:700;text-anchor:middle;fill:var(--tinta)', c2);
    tx(320, 204, 'mesmos átomos da unidade: só a dupla volta', 'font-size:14px;text-anchor:middle;fill:var(--lapis)', c2);
    /* ===== etapa 3: condensacao, PET ===== */
    function condensa(pai, y, A, B, nA, nB, sA, sB) {
      var o = { g: el('g', {}, pai), sai: el('g', {}, pai) };
      var wa = largCad(A), wb = largCad(B), x0 = 320 - (wa + 40 + wb) / 2;
      var pa = cadeia(o.g, x0, y, A), pb = cadeia(o.g, pa.fim + 40, y, B);
      tx(pa.fim + 20, y + 6, '+', AT, o.g);
      tx((x0 + pa.fim) / 2, y - 62, nA, 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--lapis)', o.g);
      tx((pa.fim + 40 + pb.fim) / 2, y - 62, nB, 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--lapis)', o.g);
      var a = pa[sA], b = pb[sB];
      el('ellipse', { cx: a.x, cy: y, rx: a.w / 2 + 8, ry: 16, style: 'fill:none;stroke:' + SAI + ';stroke-width:2;stroke-dasharray:4 3' }, o.sai);
      el('ellipse', { cx: b.x, cy: y, rx: b.w / 2 + 8, ry: 16, style: 'fill:none;stroke:' + SAI + ';stroke-width:2;stroke-dasharray:4 3' }, o.sai);
      return o;
    }
    var g3 = el('g', {});
    var c3 = condensa(g3, 84, [{ l: 'HO' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }, { l: 'C₆H₄' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }, { l: 'OH', c: SAI }], [{ l: 'H', c: SAI }, { l: 'O' }, { l: 'CH₂' }, { l: 'CH₂' }, { l: 'OH' }], 'ácido tereftálico', 'etilenoglicol', 4, 0);
    var r3 = el('g', {}, g3);
    var P3 = [{ l: '…' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }, { l: 'C₆H₄' }, { l: 'C', c: EST, s: [{ l: 'O', d: -1, b: 2, c: EST }] }, { l: 'O', c: EST }, { l: 'CH₂' }, { l: 'CH₂' }, { l: 'O' }, { l: '…' }];
    var x3 = 300 - largCad(P3) / 2, p3 = cadeia(r3, x3, 168, P3);
    tx(p3.fim + 30, 174, '+ H₂O', 'font-size:18px;font-weight:700;fill:' + AGUA, r3);
    var b3 = caixa(g3, p3, 3, 4, 168, EST, 'éster', false);
    /* ===== etapa 4: poliamida ===== */
    var g4 = el('g', {});
    var c4 = condensa(g4, 84, [{ l: 'HO' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }, { l: '(CH₂)₄' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }, { l: 'OH', c: SAI }], [{ l: 'H', c: SAI }, { l: 'NH' }, { l: '(CH₂)₆' }, { l: 'NH₂' }], 'ácido dicarboxílico', 'diamina', 4, 0);
    var r4 = el('g', {}, g4);
    var P4 = [{ l: '…' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }, { l: '(CH₂)₄' }, { l: 'C', c: AMI, s: [{ l: 'O', d: -1, b: 2, c: AMI }] }, { l: 'NH', c: AMI }, { l: '(CH₂)₆' }, { l: 'NH' }, { l: '…' }];
    var x4 = 300 - largCad(P4) / 2, p4 = cadeia(r4, x4, 168, P4);
    tx(p4.fim + 30, 174, '+ H₂O', 'font-size:18px;font-weight:700;fill:' + AGUA, r4);
    var b4 = caixa(g4, p4, 3, 4, 168, AMI, 'amida = ligação peptídica', false);
    /* ===== painel ===== */
    el('line', { x1: 12, x2: 628, y1: 218, y2: 218, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 242, '', 'font-size:16px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 267 + 23 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. Adição: a dupla abre e as unidades se encadeiam', 'O monômero precisa de uma dupla C=C. Ela se abre, e cada carbono usa', 'a ligação livre para se prender à unidade vizinha. Nada sai: a unidade', 'tem os mesmos átomos do monômero (polipropileno vem do propeno).'],
      ['2. De volta ao monômero', 'Tire os colchetes da unidade e ponha a dupla entre os dois carbonos', 'da cadeia: –CH₂–CH(C₆H₅)– vem do estireno, C₆H₅–CH=CH₂.', 'Um só monômero, nada liberado: polímero de adição.'],
      ['3. Condensação: cada ligação solta uma água', 'Os monômeros têm dois grupos cada: ácido tereftálico (2 COOH) e', 'etilenoglicol (2 OH). COOH + OH formam o éster –C(=O)–O– e H₂O.', 'O PET é um poliéster; cada ligação éster solta uma água.'],
      ['4. Poliamida: COOH + NH₂ formam –C(=O)–NH–', 'Ácido dicarboxílico + diamina: cada encontro solta H₂O e forma amida.', 'Náilon-6,6 e Kevlar (com anéis no lugar dos CH₂) são poliamidas:', 'a mesma ligação peptídica que une os aminoácidos das proteínas.']
    ];
    var _desenha = function (t) {
      var f = t < T1 ? 0 : t < T2 ? 1 : t < T3 ? 2 : 3;
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      /* etapa 1 */
      var a = ease((t - .6) / .8), u = ease((t - 1.4) / 1.3);
      mono.forEach(function (g, i) {
        g.setAttribute('transform', 'translate(' + lerp(X0[i], XF[i], u).toFixed(1) + ' 0)'); op(g.sec, 1 - a);
      });
      pontes.forEach(function (pp, i) { var x = XF[i] + wU + 3; pp.setAttribute('d', 'M' + x.toFixed(1) + ' ' + y1 + ' h10'); op(pp, u >= 1 ? 1 : 0); });
      pontas.setAttribute('d', 'M' + (XF[0] - 16) + ' ' + y1 + ' h12 M' + (XF[2] + wU + 3) + ' ' + y1 + ' h12'); op(pontas, u >= 1 ? 1 : 0);
      op(nada, cl((t - 2.8) / .4)); op(tab, cl((t - 3.1) / .4));
      /* etapa 2 */
      op(m2, cl((t - T1 - .7) / .5)); op(c2, cl((t - T1 - 1.4) / .5));
      /* etapa 3 e 4 */
      [[c3, r3, b3, T2], [c4, r4, b4, T3]].forEach(function (z) {
        var s = t - z[3]; op(z[0].sai, s > .5 && s < 1.6 ? 1 : 0); op(z[1], cl((s - 1.4) / .5)); op(z[2], cl((s - 2.2) / .5));
      });
      var L = TXT[f];
      for (var k = 0; k < 4; k++) P[k].textContent = L[k] || '';
    };
    return fimResposta(VIS.def['polimerizacao-adicao-condensacao'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'P26d3188' || q === 'W5b45917' ? T1 - .01 : q === 'Pdb1f85d' ? T2 - .01 : q === 'Pf50dd5c' || q === 'P2d74c77' ? T3 - .01 : TF - .01; }
    });
  }
};
VIS.liga('polimerizacao-adicao-condensacao', ['P26d3188', 'W5b45917', 'Pdb1f85d', 'Pf50dd5c', 'P2d74c77', 'Pcd2f026', 'Wa1c74ea']);
