/* Onde comeca a digestao de cada nutriente: o alimento percorre o tubo e as tres curvas vao sendo tracadas
   (mesmo formato do grafico da Unesp 2015: tamanho das moleculas x percurso). */
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
'Pf55e071': [
'Por isso a resposta é C',
'A curva 1 cai na boca (carboidrato), a 2 no estômago',
'(proteína) e a 3 só no intestino delgado (lipídio).',
'Na ordem proteínas, lipídios, carboidratos: 2, 3 e 1.'
],
'Wff64b49': [
'Por isso a resposta é B',
'Batata é amido: começa a ser digerida na boca (amilase).',
'Carne é proteína: começa no estômago (pepsina).'
]
};
VIS.def['digestao-ao-longo-do-tubo'] = {
  tit: 'Onde começa a digestão de cada nutriente',
  fontes: ['OpenStax, Biology 2e, 34.3 Digestive System Processes (amilase salivar, pepsina, bile, lipase pancreática) — https://openstax.org/books/biology-2e/pages/34-3-digestive-system-processes'],
  tipo: 'anim', dur: 12,
  marcas: [[0, 'Boca'], [3.2, 'Estômago'], [6.4, 'Intestino delgado'], [9.8, 'Grosso']],
  cred: 'Animação feita para o app (esquema fora de escala; o eixo vertical é qualitativo).',
  nota: 'A curva cai onde a digestão daquele nutriente começa: carboidrato na boca (amilase salivar), proteína no estômago (pepsina) e lipídio só no intestino delgado (lipase do pâncreas, com a bile emulsionando).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    var S = { sub: 'font-size:14.5px;fill:var(--tinta)', forte: 'font-size:15px;font-weight:700;fill:var(--tinta)', lab: 'font-size:14px;font-weight:600;fill:var(--lapis)', mini: 'font-size:13px;fill:var(--lapis)' };
    svg.setAttribute('viewBox', '0 0 640 350');
    var B = [[40, 110, 'boca', ''], [110, 180, 'esôfago', ''], [180, 320, 'estômago', ''], [320, 480, 'intestino', 'delgado'], [480, 620, 'intestino', 'grosso']];
    var YT = 86, YB = 214;
    function Y(f) { return YB - (YB - YT) * f; }
    /* faixas dos orgaos */
    B.forEach(function (b, i) {
      el('rect', { x: b[0], y: 40, width: b[1] - b[0], height: YB + 6 - 40, style: 'fill:color-mix(in srgb,var(--tinta) ' + (i % 2 ? 4 : 8) + '%,transparent)' });
      tx((b[0] + b[1]) / 2, 240, b[2], S.mini + ';text-anchor:middle'); if (b[3]) tx((b[0] + b[1]) / 2, 256, b[3], S.mini + ';text-anchor:middle');
    });
    el('path', { d: 'M40 40 V' + (YB + 6) + ' H624', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' });
    var ey = el('text', { x: 0, y: 0, transform: 'translate(28 ' + ((40 + YB) / 2) + ') rotate(-90)', style: S.mini + ';text-anchor:middle' }); ey.textContent = 'tamanho das moléculas';
    /* curvas: f(x) = fracao do tamanho original */
    function cai(x, a, b, v0, v1, k) { if (x <= a) return v0; if (x >= b) return v1; return v0 + (v1 - v0) * (1 - Math.exp(-(x - a) / k)) / (1 - Math.exp(-(b - a) / k)); }
    var N = [
      { n: 'carboidrato', cor: '#c98a12', ini: 40, enz: 'amilase salivar', f: function (x) { return x < 320 ? cai(x, 40, 180, 1, .6, 45) : cai(x, 320, 480, .6, .05, 40); } },
      { n: 'proteína', cor: '#b4442f', ini: 180, enz: 'pepsina', f: function (x) { return x < 320 ? cai(x, 180, 320, .96, .42, 40) : cai(x, 320, 480, .42, .13, 40); } },
      { n: 'lipídio', cor: '#3f7fbf', ini: 320, enz: 'lipase', f: function (x) { return cai(x, 320, 480, .92, .21, 38); } }
    ];
    N.forEach(function (n, i) {
      n.p = el('path', { style: 'fill:none;stroke:' + n.cor + ';stroke-width:3.2;stroke-linejoin:round' + (i === 0 ? ';stroke-dasharray:9 5' : i === 2 ? ';stroke-dasharray:2 4;stroke-linecap:round' : '') });
      n.g = el('g', { style: 'opacity:0' });
      el('path', { d: 'M' + (n.ini + 3) + ' 45 v32', style: 'stroke:' + n.cor + ';stroke-width:2' }, n.g);
      tx(n.ini + 9, 57, n.n, 'font-size:14px;font-weight:700;fill:' + n.cor, n.g);
      tx(n.ini + 9, 74, 'começa aqui', 'font-size:13px;fill:' + n.cor, n.g);
    });
    /* alimento + cursor */
    var cur = el('line', { y1: 40, y2: YB + 6, style: 'stroke:var(--tinta);stroke-width:1.5;stroke-dasharray:4 4;opacity:.6' });
    var bolo = el('circle', { cy: 30, r: 9, style: 'fill:#b88a5a;stroke:#7d5a35;stroke-width:1.5' });
    var bolT = tx(0, 34, 'alimento', S.lab);
    /* painel embaixo */
    var p1 = tx(40, 288, '', S.forte), p2 = tx(40, 310, '', S.sub), p3 = tx(40, 330, '', S.sub);
    var K = [[0, 40], [2, 110], [3.2, 180], [6.4, 320], [9.8, 480], [11.3, 616], [12, 616]];
    function xDe(t) { for (var i = 1; i < K.length; i++) if (t <= K[i][0]) { var a = K[i - 1], b = K[i]; return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]); } return 616; }
    var _desenha = function (t) {
      var xb = xDe(t);
      N.forEach(function (n) {
        var d = '';
        for (var x = 40; x <= xb; x += 3) d += (d ? 'L' : 'M') + x + ' ' + Y(n.f(x)).toFixed(1) + ' ';
        d += (d ? 'L' : 'M') + xb.toFixed(1) + ' ' + Y(n.f(xb)).toFixed(1);
        n.p.setAttribute('d', d);
        n.g.style.opacity = cl((xb - n.ini + 2) / 20).toFixed(2);
      });
      cur.setAttribute('x1', xb.toFixed(1)); cur.setAttribute('x2', xb.toFixed(1));
      bolo.setAttribute('cx', xb.toFixed(1));
      var fim = xb > 520; bolT.setAttribute('x', (fim ? xb - 16 : xb + 15).toFixed(1)); bolT.style.textAnchor = fim ? 'end' : 'start';
      var L;
      if (xb < 110) L = ['Boca: amilase salivar (pH quase neutro)', 'O amido começa a virar maltose: a curva do carboidrato já cai.', 'Proteína e lipídio passam sem ser quebrados.'];
      else if (xb < 180) L = ['Esôfago: só transporte (peristaltismo)', 'Não há enzima digestiva secretada aqui; a amilase engolida', 'com a saliva segue agindo no bolo por pouco tempo.'];
      else if (xb < 320) L = ['Estômago: HCl ativa a pepsina (pH ~2)', 'A proteína começa a ser quebrada: a curva dela despenca.', 'A acidez inativa a amilase; o lipídio ainda não é digerido.'];
      else if (xb < 480) L = ['Intestino delgado: suco pancreático, bile e enzimas da mucosa', 'A lipase começa a digestão do lipídio (a bile só emulsiona);', 'tripsina e amilase pancreática terminam proteína e amido.'];
      else L = ['Intestino grosso: absorção de água', 'Não há mais digestão por enzimas humanas: as curvas ficam', 'baixas e paradas (só as bactérias fermentam restos).'];
      p1.textContent = L[0]; p2.textContent = L[1]; p3.textContent = L[2];
    };
    return fimResposta(VIS.def['digestao-ao-longo-do-tubo'], svg, _desenha, 12, RESP, qid);
  }
};
VIS.liga('digestao-ao-longo-do-tubo', ['Pf55e071', 'Wff64b49']);
