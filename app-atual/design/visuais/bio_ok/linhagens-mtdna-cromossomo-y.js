/* Marcadores de linhagem: DNA mitocondrial (so pela mae) e cromossomo Y (so de pai para filho homem).
   Usa o mesmo heredograma da Unesp 2026 (P5c31a9c), com a mesma numeracao 1 a 9. */
/* etapa final "Resposta": congela o desenho no ultimo quadro e mostra o porque da questao aberta (qid).
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
'P5c31a9c': [
'Por isso a resposta é E',
'O mtDNA passa só de mãe para filhos: 1 → 6 e 7, e 7 → 9.',
'Têm moléculas idênticas: 1, 6, 7 e 9.'
],
'P9c44554': [
'Por isso a resposta é B',
'A linha do sobrenome (pai → filho homem) é a do cromossomo Y,',
'que quase não recombina; ele está em metade dos',
'espermatozoides (a outra metade leva o X).'
]
};
VIS.def['linhagens-mtdna-cromossomo-y'] = {
  tit: 'DNA mitocondrial segue as mães; cromossomo Y segue os pais',
  fontes: ['Wikipedia (en), Human mitochondrial genetics (herança materna do mtDNA) — https://en.wikipedia.org/wiki/Human_mitochondrial_genetics', 'Wikipedia (en), Y chromosome (herança pai → filho, região que não recombina) — https://en.wikipedia.org/wiki/Y_chromosome'],
  tipo: 'anim', dur: 11,
  marcas: [[0, 'DNA mitocondrial (mãe)'], [5.6, 'Cromossomo Y (pai)']],
  cred: 'Animação feita para o app. Heredograma: círculo = mulher, quadrado = homem; mesma cor = mesma molécula.',
  nota: 'Para o mtDNA, siga só as setas que saem de mulheres: 1 → 7 → 9 é uma corrente contínua de mães; 6 recebe o mtDNA de 1, mas não passa adiante. Para o Y, siga só pai → filho homem: é o mesmo caminho do sobrenome.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    var S = { fase: 'font-size:23px;font-weight:700;fill:var(--tinta)', sub: 'font-size:14.5px;fill:var(--tinta)', forte: 'font-size:14.5px;font-weight:700;fill:var(--tinta)', mini: 'font-size:13px;fill:var(--lapis)', num: 'font-size:15px;font-weight:700;fill:var(--tinta)' };
    svg.setAttribute('viewBox', '0 0 640 350');
    /* cores das linhagens maternas (mtDNA) e dos Y */
    var LA = '#d9822b', LB = '#3f7fbf', L2 = '#8f9a63', L4 = '#9a6fb0';
    /* individuos: x, y, sexo (f/m) */
    var P = { 1: [42, 62, 'f'], 2: [102, 62, 'm'], 3: [300, 62, 'f'], 4: [362, 62, 'm'], 5: [200, 140, 'f'], 6: [42, 212, 'm'], 7: [112, 212, 'f'], 8: [331, 212, 'm'], 9: [222, 296, 'f'] };
    var R = 17;
    /* linhas do heredograma */
    var ln = 'fill:none;stroke:var(--tinta);stroke-width:1.6';
    el('path', { d: 'M59 62 H85 M72 62 V182 M42 182 H112 M42 182 V195 M112 182 V195', style: ln });   /* casal 1-2, filhos 6 e 7 */
    el('path', { d: 'M119 62 H283 M200 62 V123', style: ln });                                         /* casal 2-3, filha 5 */
    el('path', { d: 'M317 62 H345 M331 62 V195', style: ln });                                         /* casal 3-4, filho 8 */
    el('path', { d: 'M129 212 H314 M222 212 V279', style: ln });                                       /* casal 7-8, filha 9 */
    /* setas de heranca (desenhadas por cima, aparecem em sequencia) */
    function seta(d, cor) { return el('path', { d: d, style: 'fill:none;stroke:' + cor + ';stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round;opacity:0' }); }
    var mt = [
      [seta('M30 78 Q20 140 34 192 m-9 -9 l9 9 l5 -12', LA), 1.0],       /* 1 -> 6 */
      [seta('M54 76 Q92 120 104 192 m-11 -7 l11 7 l3 -13', LA), 1.0],     /* 1 -> 7 */
      [seta('M288 76 Q232 96 214 126 m1 -13 l-1 13 l12 -5', LB), 2.0],    /* 3 -> 5 */
      [seta('M308 77 Q312 140 322 194 m-10 -7 l10 7 l3 -13', LB), 2.0],   /* 3 -> 8 */
      [seta('M124 226 Q150 286 204 296 m-11 -8 l11 8 l-11 6', LA), 3.0]   /* 7 -> 9 */
    ];
    function curva(x0, y0, cx, cy, x1, y1) {   /* curva com ponta de seta calculada pela tangente final */
      var dx = x1 - cx, dy = y1 - cy, m = Math.hypot(dx, dy), ux = dx / m, uy = dy / m;
      var a = [x1 - 11 * ux + 6 * uy, y1 - 11 * uy - 6 * ux], b = [x1 - 11 * ux - 6 * uy, y1 - 11 * uy + 6 * ux];
      return 'M' + x0 + ' ' + y0 + ' Q' + cx + ' ' + cy + ' ' + x1 + ' ' + y1 + ' M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' L' + x1 + ' ' + y1 + ' L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
    }
    var yy = [
      [seta(curva(96, 79, 70, 150, 40, 194), L2), 6.6],      /* 2 -> 6 (Y): ponta fora do selo Y */
      [seta(curva(368, 79, 366, 150, 334, 194), L4), 7.4]    /* 4 -> 8 (Y) */
    ];
    /* pai nao transmite mtDNA: seta cortada 2 -> 5 */
    var nao = el('g', { style: 'opacity:0' });
    el('path', { d: 'M114 76 Q150 120 184 134', style: 'fill:none;stroke:var(--lapis);stroke-width:2;stroke-dasharray:5 5' }, nao);
    el('path', { d: 'M140 96 l12 12 M152 96 l-12 12', style: 'fill:none;stroke:#b4442f;stroke-width:3;stroke-linecap:round' }, nao);
    /* simbolos */
    var sim = {};
    Object.keys(P).forEach(function (k) {
      var p = P[k], g = el('g', {}), f;
      if (p[2] === 'f') f = el('circle', { cx: p[0], cy: p[1], r: R }, g);
      else f = el('rect', { x: p[0] - R, y: p[1] - R, width: 2 * R, height: 2 * R, rx: 2 }, g);
      var t = tx(p[0], p[1] + 5, k, S.num + ';text-anchor:middle', g);
      var yb = el('g', { style: 'opacity:0' }, g);
      if (p[2] === 'm') { el('rect', { x: p[0] + 9, y: p[1] - 30, width: 20, height: 18, rx: 4 }, yb); tx(p[0] + 19, p[1] - 16, 'Y', 'font-size:13px;font-weight:700;fill:#fff;text-anchor:middle', yb); }
      sim[k] = { f: f, t: t, yb: yb };
    });
    /* rotulos curtos no desenho */
    var r9 = tx(222, 336, '', S.mini + ';text-anchor:middle');
    /* painel */
    var px = 404;
    var fase = tx(px, 40, '', S.fase), s1 = tx(px, 66, '', S.sub), s2 = tx(px, 85, '', S.sub), s3 = tx(px, 104, '', S.sub);
    var q1 = tx(px, 140, '', S.forte), q2 = tx(px, 159, '', S.sub), q3 = tx(px, 178, '', S.sub);
    /* quadro dos grupos (fase mtDNA) */
    var gr = el('g', {});
    var grupos = [[LA, '1, 6, 7, 9', 'mtDNA da mulher 1'], [LB, '3, 5, 8', 'mtDNA da mulher 3'], [L2, '2', 'da mãe dele (fora)'], [L4, '4', 'da mãe dele (fora)']];
    var gl = grupos.map(function (g, i) {
      var y = 214 + i * 30, G = el('g', { style: 'opacity:0' }, gr);
      el('rect', { x: px, y: y - 13, width: 16, height: 16, rx: 4, style: 'fill:' + g[0] }, G);
      tx(px + 24, y, g[1], S.forte, G); tx(px + 24 + (i < 2 ? (i ? 56 : 76) : 18), y, g[2], S.mini, G);
      return G;
    });
    /* espermatozoides (fase Y) */
    var esp = el('g', { style: 'opacity:0' });
    tx(px, 204, 'Homem XY: na meiose, X e Y', S.sub, esp); tx(px, 223, 'vão para gametas diferentes', S.sub, esp);
    [['X', 0], ['Y', 1], ['X', 2], ['Y', 3]].forEach(function (s) {
      var x = px + 14 + s[1] * 58, y = 254;
      el('ellipse', { cx: x, cy: y, rx: 12, ry: 9, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:1.6' }, esp);
      el('path', { d: 'M' + (x + 12) + ' ' + y + ' q6 -6 12 0 t12 0', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' }, esp);
      tx(x, y + 5, s[0], 'font-size:13px;font-weight:700;text-anchor:middle;fill:' + (s[0] === 'Y' ? L2 : 'var(--tinta)'), esp);
    });
    tx(px, 290, 'metade dos espermatozoides leva X,', S.sub, esp); tx(px, 309, 'metade leva Y (e gera filho homem)', S.sub, esp);
    function pinta(k, cor, a) {
      var s = sim[k];
      s.f.setAttribute('style', 'stroke:var(--tinta);stroke-width:1.8;fill:' + (a > 0 ? cor : 'var(--folha)') + ';fill-opacity:' + (a > 0 ? (0.25 + 0.75 * a).toFixed(2) : 1));
      s.t.setAttribute('style', S.num + ';text-anchor:middle;fill:' + (a > .5 ? '#fff' : 'var(--tinta)'));
    }
    var _desenha = function (t) {
      var mtF = t < 5.6;
      var a0 = cl((t - 0.2) / 0.5);
      if (mtF) {
        pinta(1, LA, a0); pinta(3, LB, a0); pinta(2, L2, a0); pinta(4, L4, a0);
        pinta(6, LA, cl((t - 1.5) / .5)); pinta(7, LA, cl((t - 1.5) / .5));
        pinta(5, LB, cl((t - 2.5) / .5)); pinta(8, LB, cl((t - 2.5) / .5));
        pinta(9, LA, cl((t - 3.5) / .5));
        mt.forEach(function (m) { m[0].style.opacity = (t > m[1] ? Math.min(1, (t - m[1]) / .4) : 0).toFixed(2); });
        yy.forEach(function (m) { m[0].style.opacity = 0; });
        nao.style.opacity = cl((t - 4) / .4).toFixed(2);
        Object.keys(sim).forEach(function (k) { sim[k].yb.style.opacity = 0; });
        fase.textContent = 'DNA mitocondrial';
        s1.textContent = 'As mitocôndrias do zigoto vêm do'; s2.textContent = 'óvulo; as do espermatozoide são'; s3.textContent = 'eliminadas: o mtDNA vem só da mãe.';
        if (t < 4) { q1.textContent = ''; q2.textContent = ''; q3.textContent = ''; }
        else { q1.textContent = 'Homem recebe, mas não passa:'; q2.textContent = 'o 2 é pai da 5, e a 5 tem o'; q3.textContent = 'mtDNA da mãe dela (3), não o dele.'; }
        gl.forEach(function (g, i) { g.style.opacity = cl((t - 4.4 - i * .15) / .4).toFixed(2); });
        esp.style.opacity = 0;
        r9.textContent = t > 3.8 ? 'a 9 tem o mtDNA da avó 1' : '';
      } else {
        /* fase Y: so os homens; pais de Y em cor, filhos herdam a mesma cor */
        Object.keys(P).forEach(function (k) { pinta(k, '', 0); });
        var b2 = cl((t - 5.9) / .4), b6 = cl((t - 7) / .5), b8 = cl((t - 7.8) / .5);
        function yb(k, cor, a) { var g = sim[k].yb; g.style.opacity = a.toFixed(2); g.firstChild.setAttribute('style', 'fill:' + cor); }
        yb(2, L2, b2); yb(4, L4, b2); yb(6, L2, b6); yb(8, L4, b8);
        pinta(2, L2, b2 * .55); pinta(4, L4, b2 * .55); pinta(6, L2, b6 * .55); pinta(8, L4, b8 * .55);
        mt.forEach(function (m) { m[0].style.opacity = 0; }); nao.style.opacity = 0;
        yy.forEach(function (m) { m[0].style.opacity = (t > m[1] ? Math.min(1, (t - m[1]) / .4) : 0).toFixed(2); });
        gl.forEach(function (g) { g.style.opacity = 0; });
        fase.textContent = 'Cromossomo Y';
        s1.textContent = 'Só o homem tem Y, e ele o passa'; s2.textContent = 'apenas aos filhos homens (2 → 6,'; s3.textContent = '4 → 8). Mulheres (5, 7, 9) não têm Y.';
        q1.textContent = 'Quase não recombina com o X:'; q2.textContent = 'chega quase igual ao neto, como'; q3.textContent = 'o sobrenome que passa de pai a filho.';
        esp.style.opacity = cl((t - 8.4) / .5).toFixed(2);
        r9.textContent = '';
      }
    };
    return fimResposta(VIS.def['linhagens-mtdna-cromossomo-y'], svg, _desenha, 11, RESP, qid, { congela: function (q) { return q === 'P5c31a9c' ? 5.5 : 10.99; } });
  }
};
VIS.liga('linhagens-mtdna-cromossomo-y', ['P5c31a9c', 'P9c44554']);
