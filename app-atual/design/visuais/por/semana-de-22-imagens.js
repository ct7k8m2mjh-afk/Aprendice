/* Semana de Arte Moderna de 1922: o que era a norma academica (Pedro Americo, 1888) e o que a vanguarda europeia
   trouxe (Kirchner, expressionismo alemao, 1914 - o ambiente em que Anita Malfatti estudou em Berlim), com marcadores
   numerados nas pinturas; depois a sequencia 1917 (exposicao de Anita) -> 1922 (Semana). Obras de Anita e Di Cavalcanti
   ainda tem direito autoral no Brasil: por isso nao aparecem aqui. */
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
'Wc59dd23': [
'Por isso a resposta é A',
'Do quadro 1 para o 2 está a ruptura que Anita trouxe: cor livre, forma deformada.',
'Os modernistas queriam libertar a arte das normas acadêmicas europeias,',
'valorizando a cor, a originalidade e os temas nacionais.'
],
'Wdd4432d': [
'Por isso a resposta é B',
'A Semana de 1922 quis renovar a estética e a cultura do país:',
'romper com as tradições acadêmicas e defender a liberdade artística.',
'A C erra: o marco é a própria Semana (arte, música, literatura), não pintores alemães.'
]
};
VIS.def['semana-de-22-imagens'] = {
  tit: 'Da pintura acadêmica à vanguarda: o que a Semana de 22 recusou',
  fontes: [
    'Wikipedia (pt), Semana de Arte Moderna — https://pt.wikipedia.org/wiki/Semana_de_Arte_Moderna',
    'Wikimedia Commons, Pedro Américo, Independência ou Morte! (1888), domínio público — https://commons.wikimedia.org/wiki/File:Pedro_Am%C3%A9rico_-_Independ%C3%AAncia_ou_Morte_-_Google_Art_Project.jpg',
    'Wikimedia Commons, Ernst Ludwig Kirchner, Straßenszene (Friedrichstraße Berlin) (1914), Staatsgalerie Stuttgart, domínio público — https://commons.wikimedia.org/wiki/File:Kirchner_-_Stra%C3%9Fenszene_(Friedrichstra%C3%9Fe_Berlin)_(1914).jpg'
  ],
  tipo: 'anim', dur: 10.5,
  marcas: [[0, '1. Academia'], [3.5, '2. Vanguarda'], [7, '3. 1917 → 1922']],
  cred: 'Pinturas recortadas: Pedro Américo, Independência ou Morte! (1888), Museu Paulista, domínio público; Ernst Ludwig Kirchner, Cena de rua (Friedrichstraße, Berlim) (1914), Staatsgalerie Stuttgart, domínio público. Fotos via Wikimedia Commons.',
  nota: 'As questões se resolvem pelo texto; as imagens só mostram o contraste que a Semana encenou. Obras de Anita Malfatti e de Di Cavalcanti ainda têm direito autoral no Brasil e por isso não estão reproduzidas.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    var TF = 10.5;
    svg.setAttribute('viewBox', '0 0 640 350');
    var IW = 267, IH = 200;
    var fotos = [1, 2].map(function (i) {
      var g = el('g', {});
      el('image', { href: 'vis/semana-de-22-imagens-' + i + '.webp', x: 0, y: 0, width: IW, height: IH, preserveAspectRatio: 'xMidYMid slice' }, g);
      el('rect', { x: 0, y: 0, width: IW, height: IH, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, g);
      return g;
    });
    /* marcadores (coordenadas no recorte de 267 x 200) */
    var MK = [
      [[129, 156], [172, 31], [107, 53]],
      [[104, 40], [92, 133], [245, 72]]
    ];
    var NT = [
      ['Desenho exato: cavalos e corpos', 'com anatomia correta.', 'Cor fiel à natureza, luz suave,', 'perspectiva de janela.', 'Tema histórico e heroico,', 'cena montada como teatro.'],
      ['Rostos como máscaras, em cores', 'que não existem na pele.', 'Figuras alongadas e angulosas:', 'a forma é deformada de propósito.', 'Pincelada à vista e cor pura:', 'a cidade moderna, agitada.']
    ];
    var mk = [0, 1, 2].map(function (k) {
      var g = el('g', {});
      el('circle', { cx: 0, cy: 0, r: 12, style: 'fill:var(--ad-c);stroke:var(--folha);stroke-width:2.5' }, g);
      tx(0, 5, String(k + 1), 'font-size:14px;font-weight:700;fill:#17181C;text-anchor:middle', g);
      return g;
    });
    var notas = el('g', {});
    var NTt = [], NTn = [];
    for (var k = 0; k < 3; k++) {
      var gy = 30 + 58 * k;
      var c = el('circle', { cx: 314, cy: gy - 5, r: 11, style: 'fill:var(--ad-c)' }, notas);
      NTn.push(tx(314, gy, String(k + 1), 'font-size:14px;font-weight:700;fill:#17181C;text-anchor:middle', notas));
      NTt.push([tx(334, gy, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', notas), tx(334, gy + 20, '', 'font-size:15px;fill:var(--tinta)', notas)]);
    }
    var linha = el('g', {});
    var PASSOS = [['1917', 'Anita expõe em SP', 'cor e forma livres'], ['1917', 'Monteiro Lobato', 'ataca a mostra'], ['1922', 'Semana no Theatro', 'Municipal de SP']];
    var LX = [16, 224, 432];
    var lpb = PASSOS.map(function (p, i) {
      var g = el('g', {}, linha);
      el('rect', { x: LX[i], y: 152, width: 192, height: 54, rx: 10, style: 'fill:color-mix(in srgb,var(--ad-c) 14%,var(--folha));stroke:var(--ad-c);stroke-width:1.6' }, g);
      tx(LX[i] + 12, 172, p[0] + ' · ' + p[1], 'font-size:14px;font-weight:700;fill:var(--tinta)', g);
      tx(LX[i] + 12, 194, p[2], 'font-size:14px;fill:var(--tinta)', g);
      if (i < 2) el('path', { d: 'M' + (LX[i] + 194) + ' 179 h12 m-6 -5 l6 5 l-6 5', style: 'fill:none;stroke:var(--tinta);stroke-width:1.8' }, g);
      return g;
    });
    var r1 = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:var(--lapis)'), r2 = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:var(--lapis)');
    el('line', { x1: 16, x2: 624, y1: 214, y2: 214, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(20, 240, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)')];
    for (var j = 0; j < 4; j++) P.push(tx(20, 266 + 22 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. A norma acadêmica: copiar bem a natureza', 'Pedro Américo, Independência ou Morte! (1888): pintura de Academia.', 'Era esse o modelo de arte "correta" ensinado no Brasil:', 'desenho exato, cor natural e grandes temas da história.'],
      ['2. A vanguarda europeia: cor e forma livres', 'Kirchner, Cena de rua (Berlim, 1914): expressionismo alemão.', 'Anita estudou em Berlim (1910-1914) e depois em Nova York (1915-1916).', 'A cor exprime emoção, não imita; a forma se deforma de propósito.'],
      ['3. Da exposição de Anita à Semana de 1922', 'A mostra de Anita (1917) trouxe essa liberdade e foi atacada por Lobato.', 'Em fevereiro de 1922, a Semana reuniu arte, música e literatura', 'para romper com o academicismo e buscar uma arte moderna e brasileira.']
    ];
    var _desenha = function (t) {
      var f = t < 3.5 ? 0 : t < 7 ? 1 : 2, u;
      var Lt = TXT[f]; for (j = 0; j < 5; j++) P[j].textContent = Lt[j] || '';
      r1.textContent = ''; r2.textContent = '';
      if (f < 2) {
        fotos[f].setAttribute('transform', 'translate(16 4)'); fotos[f].style.opacity = '1'; fotos[1 - f].style.opacity = '0';
        notas.style.opacity = '1'; linha.style.opacity = '0';
        for (k = 0; k < 3; k++) {
          var a = ease((t - 3.5 * f - .4 - .8 * k) / .4);
          mk[k].setAttribute('transform', 'translate(' + (16 + MK[f][k][0]) + ' ' + (4 + MK[f][k][1]) + ') scale(' + (.6 + .4 * a).toFixed(2) + ')'); mk[k].style.opacity = a.toFixed(2);
          NTt[k][0].textContent = NT[f][2 * k]; NTt[k][1].textContent = NT[f][2 * k + 1];
          NTt[k][0].style.opacity = NTt[k][1].style.opacity = a.toFixed(2);
          NTn[k].style.opacity = a.toFixed(2); NTn[k].previousSibling.style.opacity = a.toFixed(2);
        }
      } else {
        u = ease((t - 7.1) / .8);
        var s = lerp(1, .6, u);
        fotos[0].setAttribute('transform', 'translate(' + lerp(16, 16, u) + ' 4) scale(' + s.toFixed(3) + ')'); fotos[0].style.opacity = '1';
        fotos[1].setAttribute('transform', 'translate(' + lerp(16, 224, u) + ' 4) scale(' + s.toFixed(3) + ')'); fotos[1].style.opacity = u.toFixed(2);
        notas.style.opacity = '0'; mk.forEach(function (m) { m.style.opacity = '0'; });
        linha.style.opacity = u.toFixed(2);
        lpb.forEach(function (g, i) { g.style.opacity = ease((t - 7.6 - .5 * i) / .4).toFixed(2); });
        if (u > .9) { r1.setAttribute('x', 16); r1.setAttribute('y', 142); r1.textContent = 'a norma (1888)'; r2.setAttribute('x', 224); r2.setAttribute('y', 142); r2.textContent = 'a vanguarda (1914)'; }
      }
    };
    return fimResposta(VIS.def['semana-de-22-imagens'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return TF - .01; }
    });
  }
};
VIS.liga('semana-de-22-imagens', ['Wc59dd23', 'Wdd4432d']);
