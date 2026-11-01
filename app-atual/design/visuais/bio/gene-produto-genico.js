/* O gene codifica PROTEINA (via RNAm), nunca aminoacido nem odor. Exemplo 1: receptor olfativo OR6A2 na membrana
   da celula olfativa liga o aldeido do coentro (P2da2724). Exemplo 2: aminoacido essencial = faltam os genes das
   enzimas da via que o fabrica (Pa3fea10). */
/* etapa final "Resposta" (variante lateral): o cartao ocupa a coluna de texto da direita e o desenho da
   esquerda fica inteiro, congelado no quadro que decide a questao. R[qid] = ['Por isso a resposta é X', linhas curtas...] */
function fimLado(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 3.2); def.marcas.push([TF, 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var x = opc.x || 430, w = vb[2] - x - 6, y = opc.y || 14, h = Math.min(vb[3] - y - 10, 91 + 21 * (r.length - 1));
  var c = el('g', {});
  el('rect', { x: x - 4, y: 0, width: vb[2] - x + 4, height: vb[3], style: 'fill:var(--folha)' }, c);
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var m = r[0].match(/^(.*?)\s*(é .*)$/) || [0, r[0], ''];
  el('text', { x: x + 16, y: y + 30, style: 'font-size:15px;font-weight:600;fill:var(--lapis)' }, c).textContent = m[1];
  el('text', { x: x + 16, y: y + 60, style: 'font-size:24px;font-weight:700;fill:var(--ad-t)' }, c).textContent = m[2];
  r.slice(1).forEach(function (s, i) { el('text', { x: x + 16, y: y + 94 + 21 * i, style: 'font-size:14px;fill:var(--tinta)' }, c).textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    c.style.opacity = on ? Math.min(1, (t - TF) / .3).toFixed(2) : 0; c.style.display = on ? '' : 'none';
  };
}
var RESP = {
  'P2da2724': ['Por isso a resposta é A',
    'O gene OR6A2 fica no', 'núcleo e codifica uma', 'proteína: o receptor.', '',
    'Ele fica na membrana da', 'célula olfativa, voltado', 'para fora. O aldeído se', 'liga ao receptor, nunca', 'ao gene.'],
  'Pa3fea10': ['Por isso a resposta é B',
    'Faltam ao ser humano os', 'genes das ENZIMAS da via', 'que fabrica esses', 'aminoácidos: a via para.', '',
    'O RNAt existe (usamos o', 'aa que vem da comida), e', 'não há "gene de', 'aminoácido".']
};
VIS.def['gene-produto-genico'] = {
  tit: 'O gene codifica proteína: não aminoácido, não cheiro',
  fontes: [
    'OpenStax, Biology 2e, 15.1 The Genetic Code (gene → RNAm → proteína) — https://openstax.org/books/biology-2e/pages/15-1-the-genetic-code',
    'OpenStax, Biology 2e, 36.3 Taste and Smell (receptores olfativos são proteínas na membrana dos cílios do neurônio olfativo; o odorante se liga a eles) — https://openstax.org/books/biology-2e/pages/36-3-taste-and-smell',
    'Wikipedia (en), OR6A2 (receptor olfativo acoplado à proteína G; liga aldeídos do coentro) — https://en.wikipedia.org/wiki/OR6A2',
    'Wikipedia (en), Essential amino acid (o organismo não tem a via de síntese) — https://en.wikipedia.org/wiki/Essential_amino_acid'
  ],
  tipo: 'anim', dur: 13.6,
  marcas: [[0, 'Gene→proteína'], [4.4, 'Receptor'], [9, 'Aminoácido']],
  cred: 'Animação feita para o app (esquema fora de escala). A via do passo 3 é genérica (precursor → A → B → aminoácido) para mostrar a ideia; vias reais têm mais etapas.',
  nota: 'Gene é informação no DNA, dentro do núcleo. Quem trabalha é a proteína que ele codifica: o receptor na membrana, a enzima que faz cada passo de uma via. Sem o gene da enzima, a via para.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0.001 ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var DNA = '#2b6cb0', RNA = '#c26a12', PROT = '#6b4fa0', ALD = '#2f7d4f', MEM = '#d9a441';
    var S = { tit: 'font-size:19px;font-weight:700;fill:var(--tinta)', l: 'font-size:14px;fill:var(--tinta)', b: 'font-size:14px;font-weight:700;fill:var(--tinta)', m: 'font-size:13px;fill:var(--lapis)' };
    var TX = 440, tT = tx(TX, 40, '', S.tit), tL = [];
    for (var i = 0; i < 10; i++) tL.push(tx(TX, 70 + i * 21, '', S.l));
    el('line', { x1: 424, x2: 424, y1: 20, y2: 330, style: 'stroke:var(--linha);stroke-width:1.2' });
    function helice(pai, x0, x1, y, cor) {
      var a = '', b = '';
      for (var x = x0; x <= x1; x += 3) { a += (a ? 'L' : 'M') + x + ' ' + (y + 6 * Math.sin((x - x0) / 8)).toFixed(1) + ' '; b += (b ? 'L' : 'M') + x + ' ' + (y - 6 * Math.sin((x - x0) / 8)).toFixed(1) + ' '; }
      el('path', { d: a, style: 'fill:none;stroke:' + cor + ';stroke-width:2.2' }, pai); el('path', { d: b, style: 'fill:none;stroke:' + cor + ';stroke-width:2.2;opacity:.55' }, pai);
    }

    /* ===== 1. gene -> RNAm -> proteina ===== */
    var G1 = el('g', {});
    el('ellipse', { cx: 110, cy: 150, rx: 92, ry: 74, style: 'fill:color-mix(in srgb,' + DNA + ' 7%,var(--folha));stroke:' + DNA + ';stroke-width:2;stroke-dasharray:7 4' }, G1);
    tx(110, 66, 'núcleo', S.b + ';text-anchor:middle;fill:' + DNA, G1);
    helice(G1, 36, 184, 130, '#7f9cc0');
    el('rect', { x: 78, y: 116, width: 66, height: 28, rx: 6, style: 'fill:none;stroke:' + DNA + ';stroke-width:2.4' }, G1);
    tx(111, 162, 'gene (DNA)', S.b + ';text-anchor:middle;fill:' + DNA, G1);
    tx(111, 178, 'a receita', S.m + ';text-anchor:middle', G1);
    var rna1 = el('path', { style: 'fill:none;stroke:' + RNA + ';stroke-width:3;stroke-linecap:round' }, G1);
    var rnaT = tx(0, 0, 'RNAm', 'font-size:14px;font-weight:700;fill:' + RNA, G1);
    var ribo = el('g', {}, G1);
    el('ellipse', { cx: 268, cy: 120, rx: 22, ry: 13, style: 'fill:#c9b79c;stroke:#8a7458;stroke-width:1.4' }, ribo);
    el('ellipse', { cx: 268, cy: 140, rx: 28, ry: 15, style: 'fill:#b8a17f;stroke:#8a7458;stroke-width:1.4' }, ribo);
    tx(268, 98, 'ribossomo', S.b + ';text-anchor:middle', ribo);
    var contas = []; for (i = 0; i < 9; i++) contas.push(el('circle', { r: 6, style: 'fill:' + PROT + ';stroke:#fff;stroke-width:1' }, G1));
    var protT = tx(340, 262, 'proteína', 'font-size:15px;font-weight:700;fill:' + PROT + ';text-anchor:middle', G1);
    var protT2 = tx(340, 280, '(cadeia de aminoácidos)', S.m + ';text-anchor:middle', G1);
    var nao1 = tx(30, 300, 'Não existe "gene de aminoácido" nem "gene de cheiro".', 'font-size:14px;font-weight:700;fill:var(--ad-t)', G1);

    /* ===== 2. receptor olfativo ===== */
    var G2 = el('g', {});
    el('rect', { x: 14, y: 30, width: 400, height: 112, style: 'fill:color-mix(in srgb,#7fb8de 14%,var(--folha))' }, G2);
    tx(24, 50, 'fora da célula: muco do nariz, com o ar inspirado', S.m, G2);
    el('rect', { x: 14, y: 142, width: 400, height: 22, style: 'fill:' + MEM + ';opacity:.55' }, G2);
    el('line', { x1: 14, x2: 414, y1: 142, y2: 142, style: 'stroke:#a8781c;stroke-width:1.5' }, G2);
    el('line', { x1: 14, x2: 414, y1: 164, y2: 164, style: 'stroke:#a8781c;stroke-width:1.5' }, G2);
    tx(20, 158, 'membrana plasmática', 'font-size:13px;font-weight:700;fill:#7a520e', G2);
    /* receptor: 7 passagens pela membrana */
    var dR = 'M180 100'; var xs = [184, 196, 208, 220, 232, 244, 256];
    xs.forEach(function (x, k) { dR += k % 2 === 0 ? ' L' + x + ' 178 C' + x + ' 190 ' + (x + 12) + ' 190 ' + (x + 12) + ' 178' : ' L' + x + ' 128 C' + x + ' 116 ' + (x + 12) + ' 116 ' + (x + 12) + ' 128'; });
    dR += ' L268 200';
    el('path', { d: dR, style: 'fill:none;stroke:' + PROT + ';stroke-width:7;stroke-linecap:round;stroke-linejoin:round' }, G2);
    el('path', { d: 'M212 110 C214 98 238 98 240 110', style: 'fill:none;stroke:' + PROT + ';stroke-width:2;stroke-dasharray:3 3' }, G2);
    tx(282, 104, 'receptor OR6A2', 'font-size:14px;font-weight:700;fill:' + PROT, G2);
    tx(282, 121, '= uma proteína', S.m, G2);
    tx(282, 136, 'encaixe para fora', S.m, G2);
    /* aldeidos */
    function aldeido(pai) {
      var g = el('g', {}, pai);
      el('path', { d: 'M-16 4 L-10 -2 L-4 4 L2 -2 L8 4 L14 -2', style: 'fill:none;stroke:' + ALD + ';stroke-width:2.4;stroke-linejoin:round' }, g);
      el('circle', { cx: 18, cy: -6, r: 4, style: 'fill:#d0452f' }, g);
      return g;
    }
    var ald = [aldeido(G2), aldeido(G2), aldeido(G2)];
    var aldT = tx(40, 80, 'aldeído do coentro', 'font-size:13px;font-weight:700;fill:' + ALD, G2);
    var sinal = el('g', {}, G2);
    el('path', { d: 'M226 206 V246 m-6 -8 l6 8 l6 -8', style: 'fill:none;stroke:#d0452f;stroke-width:2.4' }, sinal);
    tx(240, 236, 'sinal → impulso nervoso', 'font-size:13px;font-weight:700;fill:#d0452f', sinal);
    /* nucleo com o gene, longe */
    el('ellipse', { cx: 86, cy: 278, rx: 64, ry: 34, style: 'fill:color-mix(in srgb,' + DNA + ' 7%,var(--folha));stroke:' + DNA + ';stroke-width:1.8;stroke-dasharray:6 4' }, G2);
    helice(G2, 42, 130, 276, '#7f9cc0');
    tx(86, 328, 'gene OR6A2 (núcleo)', 'font-size:13px;font-weight:700;fill:' + DNA + ';text-anchor:middle', G2);
    el('path', { d: 'M150 268 C176 250 182 230 184 204 m-6 7 l6 -7 l5 8', style: 'fill:none;stroke:' + RNA + ';stroke-width:1.8;stroke-dasharray:5 4' }, G2);
    tx(30, 232, 'RNAm → proteína', 'font-size:13px;font-weight:700;fill:' + RNA, G2);
    var nao2 = tx(206, 290, 'O aldeído não vai ao núcleo:', 'font-size:13px;font-weight:700;fill:var(--ad-t)', G2);
    var nao2b = tx(206, 306, 'ele toca o receptor, não o gene.', 'font-size:13px;font-weight:700;fill:var(--ad-t)', G2);

    /* ===== 3. via do aminoacido ===== */
    var G3 = el('g', {});
    var MX = [54, 166, 266, 368], MW = [86, 50, 50, 56], ML = ['precursor', 'A', 'B', 'aminoácido'];
    function via(y, falta, nome) {
      var g = el('g', {}, G3), parts = { mol: [], enz: [] };
      tx(14, y - 70, nome, S.b, g);
      MX.forEach(function (x, k) {
        var m = el('g', {}, g);
        el('rect', { x: x - MW[k] / 2, y: y - 14, width: MW[k], height: 28, rx: 14, style: 'fill:' + (k === 3 ? 'color-mix(in srgb,' + PROT + ' 18%,var(--folha))' : 'var(--folha)') + ';stroke:' + (k === 3 ? PROT : 'var(--lapis)') + ';stroke-width:1.6' + (falta.indexOf(k - 1) >= 0 && k < 3 ? ';stroke-dasharray:4 3;opacity:.45' : '') }, m);
        tx(x, y + 5, k === 3 ? 'aa' : ML[k], 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', m);
        parts.mol.push(m);
        if (k < 3) {
          var e = el('g', {}, g), xm = (x + MX[k + 1]) / 2, ok = falta.indexOf(k) < 0;
          el('path', { d: 'M' + (x + MW[k] / 2 + 2) + ' ' + y + ' H' + (MX[k + 1] - MW[k + 1] / 2 - 4) + ' m-7 -5 l7 5 l-7 5', style: 'fill:none;stroke:' + (ok ? 'var(--tinta)' : 'var(--linha)') + ';stroke-width:2;' + (ok ? '' : 'stroke-dasharray:4 4') }, e);
          if (ok) {
            el('path', { d: 'M' + (xm - 13) + ' ' + (y - 22) + ' a13 13 0 1 1 26 0 l-8 0 a5 5 0 0 0 -10 0 Z', style: 'fill:' + PROT }, e);
            tx(xm, y - 40, 'enzima ' + (k + 1), 'font-size:13px;font-weight:700;fill:' + PROT + ';text-anchor:middle', e);
          } else {
            el('path', { d: 'M' + (xm - 13) + ' ' + (y - 22) + ' a13 13 0 1 1 26 0 l-8 0 a5 5 0 0 0 -10 0 Z', style: 'fill:none;stroke:var(--lapis);stroke-width:1.4;stroke-dasharray:3 3' }, e);
            el('path', { d: 'M' + (xm - 9) + ' ' + (y - 39) + ' l18 18 m0 -18 l-18 18', style: 'stroke:#d0452f;stroke-width:2.2' }, e);
            tx(xm, y - 44, 'sem gene', 'font-size:13px;font-weight:700;fill:#d0452f;text-anchor:middle', e);
          }
          parts.enz.push(e);
        }
      });
      return parts;
    }
    var V1 = via(112, [], 'Planta, bactéria: têm os genes das enzimas → fabricam o aa');
    var V2 = via(236, [1, 2], 'Ser humano: faltam genes de enzimas da via → não fabrica');
    var com = el('g', {}, G3);
    el('path', { d: 'M368 300 V256 m-6 8 l6 -8 l6 8', style: 'fill:none;stroke:' + ALD + ';stroke-width:2.4' }, com);
    tx(360, 318, 'vem pronto da comida', 'font-size:13px;font-weight:700;fill:' + ALD + ';text-anchor:end', com);
    tx(360, 334, '(aminoácido essencial)', 'font-size:13px;fill:var(--lapis);text-anchor:end', com);

    var TXT = [
      ['Gene → proteína', 'O gene é um trecho de DNA', 'que fica no núcleo. Ele é', 'copiado em RNAm, e o', 'ribossomo lê o RNAm e monta', 'uma PROTEÍNA, aminoácido', 'por aminoácido.', '', 'Gene codifica proteína (ou', 'RNA), nunca aminoácido.'],
      ['O gene do cheiro?', 'O gene OR6A2 codifica uma', 'proteína receptora. Ela vai', 'para a membrana da célula', 'olfativa, com o encaixe', 'para fora. O aldeído do', 'coentro se liga a ela, e a', 'célula manda um impulso.', 'A variante do gene muda o', 'receptor, não a célula.'],
      ['Aminoácido essencial', 'Fabricar um aminoácido é uma', 'via: várias reações, cada uma', 'feita por uma ENZIMA.', 'Enzima é proteína, e cada', 'uma vem de um gene.', '', 'Sem os genes das enzimas, a', 'via para: o aminoácido tem', 'de vir pronto da dieta.']
    ];
    var T = [0, 4.4, 9, 13.6];
    return fimLado(VIS.def['gene-produto-genico'], svg, function (t) {
      var k = t < 4.4 ? 0 : t < 9 ? 1 : 2, u = t - T[k];
      tT.textContent = TXT[k][0];
      tL.forEach(function (e, i) { var s = TXT[k][i + 1] || ''; e.textContent = s; });
      vis(G1, k === 0 ? 1 : 0); vis(G2, k === 1 ? 1 : 0); vis(G3, k === 2 ? 1 : 0);
      if (k === 0) {
        /* RNAm sai do gene, atravessa o envoltorio e chega ao ribossomo */
        var a = ease((u - .2) / 1.1), x0 = 111, len = lerp(10, 150, a), xs0 = lerp(x0, 220, ease((u - .9) / .9));
        var d = ''; for (var s = 0; s <= len; s += 4) { var xx = xs0 - 40 + s; d += (d ? 'L' : 'M') + xx.toFixed(1) + ' ' + (108 - 3 * Math.sin(s / 5)).toFixed(1) + ' '; }
        rna1.setAttribute('d', d); vis(rna1, cl((u - .2) / .3));
        rnaT.setAttribute('x', (xs0 - 40).toFixed(1)); rnaT.setAttribute('y', 98); vis(rnaT, cl((u - .4) / .3));
        vis(ribo, cl((u - 1.2) / .4));
        var nb = Math.floor(cl((u - 1.7) / 1.1) * 9.99);
        contas.forEach(function (c, i) {
          var px, py;
          if (i < 5) { px = 286 + i * 10; py = 160 + i * 14; } else { px = 336 + 16 * Math.cos((i - 5) * 1.3); py = 226 + 14 * Math.sin((i - 5) * 1.3); }
          c.setAttribute('cx', px.toFixed(1)); c.setAttribute('cy', py.toFixed(1)); vis(c, i < nb ? 1 : 0);
        });
        vis(protT, cl((u - 2.4) / .3)); vis(protT2, cl((u - 2.4) / .3)); vis(nao1, cl((u - 2.6) / .3));
      }
      if (k === 1) {
        var pos = [[60, 96], [120, 72], [330, 70]];
        ald.forEach(function (g, i) {
          var b = ease((u - .5 - i * .25) / 1.2), px = lerp(pos[i][0], 226 + (i - 1) * 4, i === 0 ? b : 0), py = lerp(pos[i][1], 104, i === 0 ? b : 0);
          if (i > 0) { px = pos[i][0] + 6 * Math.sin(u * 2 + i); py = pos[i][1] + 4 * Math.cos(u * 2 + i); }
          g.setAttribute('transform', 'translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ')');
        });
        aldT.setAttribute('x', 30); aldT.setAttribute('y', 124);
        vis(sinal, cl((u - 1.9) / .3)); vis(nao2, cl((u - 2.3) / .3)); vis(nao2b, cl((u - 2.3) / .3));
      }
      if (k === 2) {
        [V1, V2].forEach(function (V, j) {
          V.mol.forEach(function (m, i) { vis(m, cl((u - .2 - j * 1 - i * .18) / .25)); });
          V.enz.forEach(function (e, i) { vis(e, cl((u - .35 - j * 1 - i * .18) / .25)); });
        });
        vis(com, cl((u - 2.3) / .4));
      }
    }, 13.6, RESP, qid, { congela: function (q) { return q === 'P2da2724' ? 8.9 : 13.5; } });
  }
};
VIS.liga('gene-produto-genico', ['Pa3fea10', 'P2da2724']);
