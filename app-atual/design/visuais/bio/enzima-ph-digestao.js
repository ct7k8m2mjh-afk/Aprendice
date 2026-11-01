/* Atividade das enzimas digestivas x pH: o pH percorre o eixo e o painel diz onde estamos e quem trabalha. */
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
  'Pd3667f7': ['Por isso a resposta é C', 'Na Fuvest, a curva que cai perto de pH 7 (a III) é o amido', 'digerido pela amilase salivar, na boca.'],
  'Wd82acd3': ['Por isso a resposta é A', 'Sem HCl a pepsina não é ativada e não age; quem sofre', 'é a digestão da proteína, ou seja, a carne.']
};
VIS.def['enzima-ph-digestao'] = {
  tit: 'Cada enzima digestiva trabalha numa faixa própria de pH',
  fontes: ['OpenStax, Biology 2e, 6.5 Enzymes (sítio ativo, especificidade, desnaturação por pH) — https://openstax.org/books/biology-2e/pages/6-5-enzymes', 'OpenStax, Biology 2e, 34.3 Digestive System Processes (amilase salivar, pepsina, tripsina, lipase pancreática, maltase) — https://openstax.org/books/biology-2e/pages/34-3-digestive-system-processes'],
  tipo: 'anim', dur: 12,
  marcas: [[.8, 'pH 2'], [3.6, 'pH 7'], [5.5, 'pH 8'], [7.6, 'Cada enzima, um substrato']],
  cred: 'Animação feita para o app. Curvas esquemáticas (altura de cada pico igualada); pH ótimo aproximado: pepsina ~2, amilase salivar ~7, enzimas do pâncreas ~8.',
  nota: 'Fora da sua faixa a enzima perde a forma do sítio ativo e para de agir: a pepsina só trabalha no ácido do estômago, a amilase da saliva perto do neutro e as enzimas do pâncreas no meio alcalino do intestino. Na questão da São Camilo, X age sobre maltose: é a maltase, também ativa perto do neutro.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var S = { fase: 'font-size:24px;font-weight:700;fill:var(--tinta)', sub: 'font-size:14.5px;fill:var(--tinta)', forte: 'font-size:15px;font-weight:700;fill:var(--tinta)', lab: 'font-size:14px;font-weight:600;fill:var(--lapis)', mini: 'font-size:13px;fill:var(--lapis)' };
    svg.setAttribute('viewBox', '0 0 640 350');
    var X0 = 46, KX = 28.2, Y0 = 244, H = 184;
    function X(ph) { return X0 + KX * ph; } function Y(a) { return Y0 - H * a; }
    var E = [
      { n: 'pepsina', mu: 2, sg: .75, cor: '#b4442f' },
      { n: 'amilase salivar', mu: 6.8, sg: .7, cor: '#c98a12' },
      { n: 'enzimas do pâncreas', mu: 8, sg: .75, cor: '#3f7fbf' }
    ];
    function at(e, ph) { var z = (ph - e.mu) / e.sg; return Math.exp(-z * z / 2); }
    /* faixas dos orgaos (fundo) */
    [[1.5, 3.5, 'estômago', 290], [6.4, 7.4, 'boca', 290], [7.6, 8.6, 'intestino delgado', 312]].forEach(function (o) {
      el('rect', { x: X(o[0]), y: 52, width: KX * (o[1] - o[0]), height: Y0 - 52, style: 'fill:color-mix(in srgb,var(--tinta) 5%,transparent)' });
      el('rect', { x: X(o[0]), y: o[3] - 13, width: KX * (o[1] - o[0]), height: 4, rx: 2, style: 'fill:var(--lapis);opacity:.55' });
      tx(X((o[0] + o[1]) / 2), o[3] + 6, o[2], S.mini + ';text-anchor:middle');
    });
    /* eixos */
    el('path', { d: 'M' + X0 + ' 40 V' + Y0 + ' H' + X(11.2), style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' });
    for (var p = 0; p <= 11; p++) {
      el('line', { x1: X(p), x2: X(p), y1: Y0, y2: Y0 + 5, style: 'stroke:var(--tinta);stroke-width:1.2' });
      if (p % 1 === 0) tx(X(p), Y0 + 21, p, 'font-size:13px;fill:var(--lapis);text-anchor:middle');
    }
    tx(X(11) + 6, Y0 + 36, 'pH', S.lab);
    tx(X0 - 6, 30, 'atividade', S.lab + ';text-anchor:start');
    tx(X(0.2), Y0 + 36, 'ácido', S.mini); tx(X(11), Y0 + 36, 'básico', S.mini + ';text-anchor:end');
    /* curvas */
    E.forEach(function (e) {
      var d = '';
      for (var i = 0; i <= 220; i++) { var ph = i * 11 / 220; d += (i ? 'L' : 'M') + X(ph).toFixed(1) + ' ' + Y(at(e, ph)).toFixed(1) + ' '; }
      el('path', { d: d, style: 'fill:none;stroke:' + e.cor + ';stroke-width:3' });
    });
    /* rotulos das curvas */
    tx(X(2) + 14, 62, 'pepsina', 'font-size:14px;font-weight:700;fill:#b4442f');
    tx(X(6.8) - 10, 46, 'amilase', 'font-size:14px;font-weight:700;fill:#c98a12;text-anchor:end');
    tx(X(6.8) - 10, 62, 'salivar', 'font-size:14px;font-weight:700;fill:#c98a12;text-anchor:end');
    tx(X(8) + 10, 46, 'enzimas', 'font-size:14px;font-weight:700;fill:#3f7fbf');
    tx(X(8) + 10, 62, 'do pâncreas', 'font-size:14px;font-weight:700;fill:#3f7fbf');
    /* cursor de pH */
    var cur = el('line', { y1: 40, y2: Y0, style: 'stroke:var(--tinta);stroke-width:2;stroke-dasharray:5 4' });
    var mark = el('path', { d: 'M0 0 l-7 -11 h14 Z', style: 'fill:var(--tinta)' });   /* marcador do pH no eixo */
    var pts = E.map(function (e) { return el('circle', { r: 7, style: 'fill:' + e.cor + ';stroke:var(--folha);stroke-width:2' }); });
    /* painel */
    var px = 396;
    var fase = tx(px, 44, '', S.fase), org = tx(px, 70, '', S.forte);
    var L = [tx(px, 96, '', S.sub), tx(px, 115, '', S.sub), tx(px, 134, '', S.sub), tx(px, 153, '', S.sub), tx(px, 172, '', S.sub)];
    var barras = E.map(function (e, i) {
      var y = 214 + i * 36;
      tx(px, y, e.n, S.mini);
      el('rect', { x: px, y: y + 6, width: 220, height: 11, rx: 5.5, style: 'fill:color-mix(in srgb,var(--tinta) 9%,transparent)' });
      return el('rect', { x: px, y: y + 6, height: 11, rx: 5.5, style: 'fill:' + e.cor });
    });
    /* trajetoria do pH no tempo: para nos pH tipicos de cada orgao */
    var K = [[0, 1], [.8, 2], [2.4, 2], [3.6, 6.8], [5, 6.8], [5.5, 8], [6.8, 8], [7.6, 10], [12, 10]];
    function phDe(t) {
      for (var i = 1; i < K.length; i++) if (t <= K[i][0]) { var a = K[i - 1], b = K[i], u = (t - a[0]) / (b[0] - a[0] || 1); return a[1] + (b[1] - a[1]) * ease(u); }
      return K[K.length - 1][1];
    }
    /* ================= etapa final: especificidade (encaixe sitio ativo-substrato) ================= */
    var g1 = el('g', {}); Array.prototype.slice.call(svg.childNodes).forEach(function (k) { if (k !== g1) g1.appendChild(k); });
    var g2 = el('g', {});
    function hexD(cx, cy, r) { var d = ''; for (var i = 0; i < 6; i++) { var a = Math.PI / 3 * i; d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1) + ' '; } return d + 'Z'; }
    var EX = 236, EY = 176;
    el('ellipse', { cx: EX, cy: EY, rx: 96, ry: 70, style: 'fill:#cfe5d6;stroke:#2f8a5b;stroke-width:2.2' }, g2);
    el('path', { d: hexD(EX - 78, EY, 18) + hexD(EX - 44, EY, 18), style: 'fill:var(--folha);stroke:#2f8a5b;stroke-width:2' }, g2);
    tx(EX + 10, EY + 6, 'maltase (X)', 'font-size:15px;font-weight:700;fill:#1f6b43', g2);
    tx(EX - 61, EY + 86, 'sítio ativo', 'font-size:13px;font-weight:700;fill:#1f6b43;text-anchor:middle', g2);
    var mal = el('g', {}, g2);
    var hA = el('path', { d: hexD(-17, 0, 14), style: 'fill:#e3b04b;stroke:#9a7220;stroke-width:1.6' }, mal), hB = el('path', { d: hexD(17, 0, 14), style: 'fill:#e3b04b;stroke:#9a7220;stroke-width:1.6' }, mal);
    var malT = tx(0, -24, 'maltose', 'font-size:13.5px;font-weight:700;fill:#9a7220;text-anchor:middle', mal);
    var gl1 = el('g', {}, g2), gl2 = el('g', {}, g2);
    [gl1, gl2].forEach(function (g) { el('path', { d: hexD(0, 0, 14), style: 'fill:#e3b04b;stroke:#9a7220;stroke-width:1.6' }, g); tx(0, 32, 'glicose', 'font-size:13px;font-weight:700;fill:#9a7220;text-anchor:middle', g); });
    var prot = el('g', {}, g2);
    ['#b4442f', '#3f7fbf', '#8a5a9e', '#2f8a5b', '#c98a12'].forEach(function (c, i) { el('circle', { cx: i * 15 - 30, cy: 0, r: 7, style: 'fill:' + c }, prot); });
    tx(0, -16, 'proteína', 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', prot);
    var nao = el('g', {}, g2); el('path', { d: 'M-8 -8 l16 16 m0 -16 l-16 16', style: 'stroke:#b4442f;stroke-width:3.4;stroke-linecap:round' }, nao); tx(0, -16, 'não encaixa', 'font-size:13.5px;font-weight:700;fill:#b4442f;text-anchor:middle', nao);
    var q2 = tx(396, 40, 'Cada enzima, um substrato', 'font-size:20px;font-weight:700;fill:var(--tinta)', g2);
    var QL = [0, 1, 2].map(function (i) { return tx(396, 66 + i * 19, '', 'font-size:14px;fill:var(--tinta)', g2); });
    var TB = el('g', {}, g2);
    tx(396, 142, 'Os tubos da questão (37 °C):', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', TB);
    [['maltose + X, pH 7 → glicose', 1], ['maltose + X, pH 2 → nada', 0], ['proteína + Y, pH 2 → peptídeos', 1], ['proteína + Y, pH 8 → nada', 0], ['gordura + Z, pH 8 → ác. graxos', 1], ['gordura + Z, pH 7 → nada', 0]].forEach(function (r, i) {
      tx(396, 162 + i * 18, (i + 1) + '. ' + r[0], 'font-size:13px;fill:' + (r[1] ? 'var(--tinta)' : 'var(--lapis)'), TB);
    });
    var R1 = tx(396, 290, '', 'font-size:14.5px;font-weight:700;fill:#2f8a5b', g2), R2 = tx(396, 309, '', 'font-size:14.5px;font-weight:700;fill:#2f8a5b', g2), R3 = tx(396, 328, '', 'font-size:14px;fill:var(--tinta)', g2);
    var _desenha = function (t) {
      var esp = t >= 7.6; op(g1, esp ? 0 : 1); op(g2, esp ? 1 : 0);
      if (esp) {
        var u1 = ease((t - 7.8) / 1.1), u2 = ease((t - 9.1) / .8), u3 = ease((t - 10) / .9);
        mal.setAttribute('transform', 'translate(' + lerp(60, EX - 61, u1).toFixed(1) + ' ' + EY + ')'); op(mal, u2 < .05 ? 1 : 0); op(malT, u1 < .6 ? 1 : 0);
        gl1.setAttribute('transform', 'translate(' + lerp(EX - 78, 70, u2).toFixed(1) + ' ' + lerp(EY, 96, u2).toFixed(1) + ')');
        gl2.setAttribute('transform', 'translate(' + lerp(EX - 44, 76, u2).toFixed(1) + ' ' + lerp(EY, 250, u2).toFixed(1) + ')');
        var gf = u2 > .05 ? 1 - cl((t - 9.8) / .3) : 0; op(gl1, gf); op(gl2, gf);
        prot.setAttribute('transform', 'translate(' + lerp(30, 104, u3).toFixed(1) + ' ' + EY + ')'); op(prot, t > 9.9 ? 1 : 0);
        nao.setAttribute('transform', 'translate(104 ' + (EY - 44) + ')'); op(nao, u3 > .95 ? 1 : 0);
        var Q = t < 9.1 ? ['O sítio ativo tem uma forma: só', 'a maltose encaixa na maltase.', ''] : t < 10 ? ['Encaixou: a maltase quebra a', 'maltose em 2 glicoses.', ''] : ['A proteína não encaixa na maltase:', 'quem a quebra é a pepsina (Y).', 'E fora do pH próprio, nada age.'];
        QL.forEach(function (x, i) { x.textContent = Q[i]; });
        op(TB, cl((t - 10.4) / .4));
        R1.textContent = t > 10.8 ? 'Por isso, na questão dos tubos,' : ''; R2.textContent = t > 10.8 ? 'a resposta é D: enzimas específicas.' : ''; R3.textContent = '';
        return;
      }
      var ph = phDe(t), xc = X(ph);
      var A = E.map(function (e) { return at(e, ph); });
      mark.setAttribute('transform', 'translate(' + xc.toFixed(1) + ' ' + (Y0 - 1) + ')'); cur.setAttribute('x1', xc.toFixed(1)); cur.setAttribute('x2', xc.toFixed(1)); cur.setAttribute('y1', Math.min(Y0 - 4, Y(Math.max.apply(null, A)) - 2).toFixed(1));   /* a linha so vai ate a curva mais alta: nao corta os rotulos */
      pts.forEach(function (c, i) { c.setAttribute('cx', xc.toFixed(1)); c.setAttribute('cy', Y(A[i]).toFixed(1)); c.style.opacity = A[i] > .04 ? 1 : 0; });
      barras.forEach(function (b, i) { b.setAttribute('width', Math.max(0, 220 * A[i]).toFixed(1)); });
      fase.textContent = 'pH ' + ph.toFixed(1).replace('.', ',');
      var o, l;
      if (ph < 3.6) { o = 'Estômago: ácido (HCl)'; l = ['O HCl transforma o pepsinogênio', 'em pepsina e a mantém ativa:', 'começa a digestão das proteínas.', 'A amilase da saliva é inativada.', '']; }
      else if (ph < 6.2) { o = 'Faixa sem enzima no ótimo'; l = ['Ácido demais para a amilase,', 'pouco ácido para a pepsina:', 'nenhuma das curvas está alta.', '', '']; }
      else if (ph < 7.4) { o = 'Boca: saliva, quase neutro'; l = ['A amilase salivar quebra amido', 'em maltose: a digestão dos', 'carboidratos começa na boca.', 'A pepsina não age aqui.', '']; }
      else if (ph < 9) { o = 'Intestino delgado: alcalino'; l = ['O bicarbonato do pâncreas neutraliza', 'o ácido. Tripsina (proteína), lipase', '(gordura) e amilase pancreática', '(amido) agem aqui. A bile só', 'emulsiona a gordura: não é enzima.']; }
      else { o = 'Alcalino demais'; l = ['Longe do pH ótimo de todas:', 'as três curvas caem.', '', '', '']; }
      org.textContent = o; L.forEach(function (x, i) { x.textContent = l[i]; });
    };
    var def = VIS.def['enzima-ph-digestao'];
    def.__marcas = [[.8, 'pH 2'], [3.6, 'pH 7'], [5.5, 'pH 8']];
    if (qid === 'P051777a') { def.dur = 12; def.marcas = def.__marcas.concat([[7.6, 'Cada enzima, um substrato']]); return _desenha; }   /* tubos: etapa da especificidade */
    return fimResposta(def, svg, _desenha, 7.6, RESP, qid, { congela: function (q) { return q === 'Wd82acd3' ? 1.6 : 4.3; } });
  }
};
VIS.liga('enzima-ph-digestao', ['Pd3667f7', 'Wd82acd3', 'P051777a']);
