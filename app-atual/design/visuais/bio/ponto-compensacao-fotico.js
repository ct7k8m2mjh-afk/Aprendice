/* Fotossintese x respiracao: ponto de compensacao fotico (heliofila x umbrofila) e o saldo ao longo do dia. */
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
'P86c5db3': [
'Por isso a resposta é B',
'Heliófila: a mais alta ao sol e cai na sombra (barra 3).',
'Umbrófila: quase igual nos dois horários (2). Respiração:',
'constante e a mais baixa das que não mudam (1).'
],
'Pe5590d3': [
'Por isso a resposta é D',
'Entre X e Y a fotossíntese fica acima da respiração:',
'a planta produz mais matéria orgânica do que consome.'
],
'Pa99e300': [
'Por isso a resposta é A',
'Entre A e B a respiração vence e a planta gasta reserva;',
'a partir de B (ponto de compensação) a biomassa aumenta.'
],
'Pa8d1304': [
'Por isso a resposta é E',
'Em 22 de dezembro São Paulo tem 13h33 de luz e Macapá',
'cerca de 12 h; a respiração dura 24 h nos dois.'
]
};
VIS.def['ponto-compensacao-fotico'] = {
  tit: 'Fotossíntese × respiração: ponto de compensação',
  fontes: ['Wikipedia (en), Compensation point — https://en.wikipedia.org/wiki/Compensation_point', 'Frontiers in Plant Science (2023), Method for selecting ornamental species for different shading intensity (plantas de sombra têm ponto de compensação mais baixo) — https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2023.1271341/full'],
  tipo: 'anim', dur: 12,
  marcas: [[0, 'Intensidade da luz'], [6.5, 'Ao longo do dia']],
  cred: 'Animação feita para o app (curvas esquemáticas; eixo da luz comprimido para mostrar os dois pontos de compensação). Respiração considerada igual nas duas plantas, a temperatura constante.',
  nota: 'No ponto de compensação a fotossíntese iguala a respiração: o saldo é zero, mas os dois processos continuam. Abaixo dele a planta gasta reserva; acima, acumula matéria orgânica e cresce. A respiração acontece 24 horas por dia; a fotossíntese, só enquanto há luz.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var S = { fase: 'font-size:21px;font-weight:700;fill:var(--tinta)', sub: 'font-size:14px;fill:var(--tinta)', forte: 'font-size:14.5px;font-weight:700;fill:var(--tinta)', lab: 'font-size:13px;font-weight:600;fill:var(--lapis)', mini: 'font-size:13px;fill:var(--lapis)' };
    var HEL = '#d07a12', UMB = '#2f8a5b', RES = '#7a5a9a', GAN = '#2f8a5b', PER = '#b4442f';
    svg.setAttribute('viewBox', '0 0 640 350');
    var X0 = 48, W = 322, Y0 = 274, H = 212, R = .3;
    function Y(v) { return Y0 - H * v; }
    /* ---------- cena 1: taxa x intensidade luminosa ---------- */
    var c1 = el('g', {});
    var KH = .25, KU = .02, PU = .62;
    function ph(I) { return 1 - Math.exp(-I / KH); } function pu(I) { return PU * (1 - Math.exp(-I / KU)); }
    function XI(I) { return X0 + W * Math.sqrt(I); }
    var Ich = -KH * Math.log(1 - R), Icu = -KU * Math.log(1 - R / PU), Isat = .75, Isom = .07;
    el('path', { d: 'M' + X0 + ' 40 V' + Y0 + ' H' + (X0 + W + 10), style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' }, c1);
    tx(X0 - 8, 30, 'taxa', S.lab, c1); tx(X0 + W + 10, Y0 + 20, 'intensidade luminosa →', S.mini + ';text-anchor:end', c1);
    /* sombra e sol pleno no eixo */
    [[Isom, 'sombra'], [1, 'sol pleno']].forEach(function (s) { el('path', { d: 'M' + XI(s[0]) + ' ' + Y0 + ' v6', style: 'stroke:var(--tinta);stroke-width:1.5' }, c1); tx(XI(s[0]), Y0 + 38, s[1], 'font-size:13px;font-weight:700;fill:var(--tinta);text-anchor:middle', c1); });
    var area = el('path', { style: 'opacity:.2;fill:' + PER }, c1), area2 = el('path', { style: 'opacity:.2;fill:' + GAN }, c1);
    function curva(f) { var d = ''; for (var i = 0; i <= 160; i++) { var I = Math.pow(i / 160, 2); d += (i ? 'L' : 'M') + XI(I).toFixed(1) + ' ' + Y(f(I)).toFixed(1) + ' '; } return d; }
    el('line', { x1: X0, x2: X0 + W, y1: Y(R), y2: Y(R), style: 'stroke:' + RES + ';stroke-width:3' }, c1);
    el('path', { d: curva(pu), style: 'fill:none;stroke:' + UMB + ';stroke-width:3' }, c1);
    el('path', { d: curva(ph), style: 'fill:none;stroke:' + HEL + ';stroke-width:3' }, c1);
    tx(X0 + W, Y(R) + 18, 'respiração (igual nas duas)', 'font-size:13.5px;font-weight:700;fill:' + RES + ';text-anchor:end', c1);
    tx(X0 + W, Y(ph(1)) - 10, 'fotossíntese da heliófila (de sol)', 'font-size:13.5px;font-weight:700;fill:' + HEL + ';text-anchor:end', c1);
    tx(64, Y(PU) - 28, 'fotossíntese da', 'font-size:13.5px;font-weight:700;fill:' + UMB, c1); tx(64, Y(PU) - 11, 'umbrófila (de sombra)', 'font-size:13.5px;font-weight:700;fill:' + UMB, c1);
    /* pontos notaveis */
    function ponto(I, v, cor, nome, dx, dy, anc) { el('circle', { cx: XI(I), cy: Y(v), r: 5, style: 'fill:var(--folha);stroke:' + cor + ';stroke-width:2.5' }, c1); tx(XI(I) + dx, Y(v) + dy, nome, 'font-size:13px;font-weight:700;fill:' + cor + ';text-anchor:' + (anc || 'start'), c1); }
    ponto(Icu, R, UMB, 'PC', -8, -10, 'end');
    ponto(Ich, R, HEL, 'PC', 8, 20);
    ponto(Isat, ph(Isat), HEL, 'saturação', 0, 24, 'middle');
    var cur = el('line', { y1: 40, y2: Y0, style: 'stroke:var(--tinta);stroke-width:1.5;stroke-dasharray:4 4' }, c1);
    var mh = el('circle', { r: 6, style: 'fill:' + HEL + ';stroke:var(--folha);stroke-width:2' }, c1);
    var mu = el('circle', { r: 6, style: 'fill:' + UMB + ';stroke:var(--folha);stroke-width:2' }, c1);
    /* ---------- cena 2: ao longo do dia ---------- */
    var c2 = el('g', {});
    function XH(h) { return X0 + W * h / 24; }
    var PM = .9; function pd(h) { return h <= 6 || h >= 18 ? 0 : PM * Math.sin(Math.PI * (h - 6) / 12); }
    var hX = 6 + 12 * Math.asin(R / PM) / Math.PI, hY = 24 - hX;
    el('path', { d: 'M' + X0 + ' 40 V' + Y0 + ' H' + (X0 + W + 10), style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' }, c2);
    tx(X0 - 8, 30, 'taxa', S.lab, c2);
    [0, 6, 12, 18, 24].forEach(function (h) { tx(XH(h), Y0 + 18, h + 'h', 'font-size:13px;fill:var(--lapis);text-anchor:middle', c2); });
    var ganho = el('path', { style: 'fill:' + GAN + ';opacity:.2' }, c2);
    var dDia = ''; for (var i = 0; i <= 240; i++) { var h = i / 10; dDia += (i ? 'L' : 'M') + XH(h).toFixed(1) + ' ' + Y(pd(h)).toFixed(1) + ' '; }
    var cDia = el('path', { style: 'fill:none;stroke:' + HEL + ';stroke-width:3' }, c2);
    var rDia = el('line', { x1: X0, y1: Y(R), y2: Y(R), style: 'stroke:' + RES + ';stroke-width:3' }, c2);
    tx(XH(.3), Y(R) - 8, 'respiração', 'font-size:13.5px;font-weight:700;fill:' + RES, c2);
    tx(XH(12), Y(PM) - 10, 'fotossíntese', 'font-size:13.5px;font-weight:700;fill:' + HEL + ';text-anchor:middle', c2);
    var pX = el('g', {}, c2), pY = el('g', {}, c2);
    el('circle', { cx: XH(hX), cy: Y(R), r: 5, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:2.5' }, pX); tx(XH(hX) - 8, Y(R) - 8, 'X', S.forte + ';text-anchor:end', pX);
    el('circle', { cx: XH(hY), cy: Y(R), r: 5, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:2.5' }, pY); tx(XH(hY) + 8, Y(R) - 8, 'Y', S.forte, pY);
    var acum = tx(XH(12), Y(.55), 'acumula', 'font-size:13.5px;font-weight:700;fill:' + GAN + ';text-anchor:middle', c2);
    var noite1 = tx(XH(3), Y(.13), 'consome', 'font-size:13px;font-weight:700;fill:' + PER + ';text-anchor:middle', c2);
    var noite2 = tx(XH(21), Y(.13), 'consome', 'font-size:13px;font-weight:700;fill:' + PER + ';text-anchor:middle', c2);
    var cur2 = el('line', { y1: 40, y2: Y0, style: 'stroke:var(--tinta);stroke-width:1.5;stroke-dasharray:4 4' }, c2);
    /* barras de duracao (cena 2) */
    var gb = el('g', {}, c2), PX = 398, BW = 226;
    tx(PX, 186, 'Horas por dia de cada processo', S.lab, gb);
    [['respiração: 24 h, em todo lugar', 24, RES], ['luz em Macapá (equador): ~12 h', 12, HEL], ['luz em SP, 21 de junho: 10h39', 10.65, HEL], ['luz em SP, 22 de dezembro: 13h33', 13.55, HEL]].forEach(function (b, i) {
      var y = 208 + i * 34;
      tx(PX, y, b[0], 'font-size:13px;fill:var(--tinta)', gb);
      el('rect', { x: PX, y: y + 5, width: BW, height: 9, rx: 4.5, style: 'fill:color-mix(in srgb,var(--tinta) 8%,transparent)' }, gb);
      el('rect', { x: PX, y: y + 5, width: BW * b[1] / 24, height: 9, rx: 4.5, style: 'fill:' + b[2] }, gb);
    });
    /* painel */
    var px = 398;
    var fase = tx(px, 40, '', S.fase);
    var L = [0, 1, 2, 3, 4, 5, 6].map(function (i) { return tx(px, 66 + i * 19, '', S.sub); });
    var _desenha = function (t) {
      var c = t < 6.5;
      op(c1, c ? 1 : 0); op(c2, c ? 0 : 1);
      var P;
      if (c) {
        var u = ease(t / 5.6), I = u * u, x = XI(I);
        cur.setAttribute('x1', x.toFixed(1)); cur.setAttribute('x2', x.toFixed(1));
        mh.setAttribute('cx', x.toFixed(1)); mh.setAttribute('cy', Y(ph(I)).toFixed(1));
        mu.setAttribute('cx', x.toFixed(1)); mu.setAttribute('cy', Y(pu(I)).toFixed(1));
        /* area entre a fotossintese da heliofila e a respiracao, ate o cursor */
        function faixa(a, b) { if (b <= a) return 'M0 0'; var d = 'M' + XI(a).toFixed(1) + ' ' + Y(R) + ' '; for (var k = 0; k <= 60; k++) { var Ik = a + (b - a) * k / 60; d += 'L' + XI(Ik).toFixed(1) + ' ' + Y(ph(Ik)).toFixed(1) + ' '; } return d + 'L' + XI(b).toFixed(1) + ' ' + Y(R) + ' Z'; }
        area.setAttribute('d', faixa(0, Math.min(I, Ich))); area2.setAttribute('d', faixa(Ich, I));
        fase.textContent = 'Luz × fotossíntese';
        if (I < Icu) P = ['Pouca luz: nas duas plantas a', 'fotossíntese é menor que a', 'respiração. Elas gastam reserva.', '', 'PC = ponto de compensação:', 'fotossíntese = respiração.', ''];
        else if (I < Ich) P = ['A umbrófila já passou do seu PC', 'e acumula; a heliófila ainda está', 'abaixo do dela e gasta reserva.', 'É o caso da sombra: a heliófila', 'fica abaixo da respiração, e a', 'umbrófila quase não muda.', ''];
        else if (I < Isat) P = ['As duas acima do PC: fotossíntese', 'maior que respiração, sobra', 'matéria orgânica e a planta cresce.', 'A heliófila precisa de mais luz', 'para compensar, mas rende muito', 'mais ao sol.', ''];
        else P = ['Saturação: mais luz já não aumenta', 'a fotossíntese da heliófila. O saldo', 'continua positivo (ela segue', 'crescendo), só para de aumentar.', '', 'Ao sol pleno: heliófila > umbrófila', '> respiração.'];
      } else {
        var hh = cl((t - 6.7) / 3.6) * 24, x2 = XH(hh);
        var dd = ''; for (var j = 0; j <= 240 && j / 10 <= hh; j++) { var h2 = j / 10; dd += (j ? 'L' : 'M') + XH(h2).toFixed(1) + ' ' + Y(pd(h2)).toFixed(1) + ' '; }
        cDia.setAttribute('d', dd || 'M0 0'); rDia.setAttribute('x2', x2.toFixed(1));
        cur2.setAttribute('x1', x2.toFixed(1)); cur2.setAttribute('x2', x2.toFixed(1)); op(cur2, hh < 24 ? 1 : 0);
        var hg = Math.min(hh, hY), dg = '';
        if (hh > hX) { dg = 'M' + XH(hX).toFixed(1) + ' ' + Y(R); for (var q = hX; q <= hg; q += .1) dg += ' L' + XH(q).toFixed(1) + ' ' + Y(pd(q)).toFixed(1); dg += ' L' + XH(hg).toFixed(1) + ' ' + Y(R) + ' Z'; }
        ganho.setAttribute('d', dg || 'M0 0');
        op(pX, hh > hX ? 1 : 0); op(pY, hh > hY ? 1 : 0); op(acum, hh > 11 ? 1 : 0); op(noite1, hh > 3 ? 1 : 0); op(noite2, hh > 21 ? 1 : 0);
        op(gb, cl((t - 10.4) / .5));
        fase.textContent = 'Ao longo do dia';
        P = hh < hX ? ['Noite e começo da manhã: só', 'respiração, ou fotossíntese menor', 'que ela. A planta consome.', '', '', '', ''] :
          hh < hY ? ['Entre X e Y (pontos de compensação', 'da manhã e da tarde) a fotossíntese', 'supera a respiração: é aí que a', 'planta acumula matéria orgânica.', '', '', ''] :
            ['Depois de Y volta a consumir.', 'A respiração não para: dura 24 h.', 'Dia mais longo = mais horas de', 'fotossíntese, mesma respiração.', '', '', ''];
      }
      L.forEach(function (x, i) { x.textContent = P[i]; });
    };
    return fimResposta(VIS.def['ponto-compensacao-fotico'], svg, _desenha, 12, RESP, qid, { congela: function (q) { return q === 'P86c5db3' || q === 'Pa99e300' ? 6.3 : 11.99; } });
  }
};
VIS.liga('ponto-compensacao-fotico', ['P86c5db3', 'Pe5590d3', 'Pa99e300', 'Pa8d1304']);
