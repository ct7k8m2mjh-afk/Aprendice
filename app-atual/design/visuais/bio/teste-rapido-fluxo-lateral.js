VIS.def['teste-rapido-fluxo-lateral'] = {
  tit: 'Autoteste de antígeno: por que a linha T só aparece quando há vírus',
  fontes: ['Lateral flow test (Wikipedia) — https://en.wikipedia.org/wiki/Lateral_flow_test', 'OpenStax Microbiology, 18.1 Overview of Specific Adaptive Immunity — https://openstax.org/books/microbiology/pages/18-1-overview-of-specific-adaptive-immunity'],
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app (esquema fora de escala; moléculas muito ampliadas).',
  marcas: [[0, 'Amostra com vírus (positivo)'], [6, 'Amostra sem vírus (negativo)']],
  nota: 'Na linha T estão presos anticorpos anti-Sars-CoV-2: eles só seguram o anticorpo colorido quando há antígeno do vírus no meio, formando um "sanduíche". A linha C prende o anticorpo colorido de qualquer jeito: ela só prova que a amostra correu pela fita.',
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var TXT = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var OURO = '#b8304f', AG = '#2e8b57', FT = '#3d6fa8', FC = '#7a5aa8';
    var X0 = 40, X1 = 600, XT = 330, XC = 440, XM = 214, XA = 528;
    /* ---------- fita vista de fora ---------- */
    var segs = [[X0, 128, '#ece3cf', 'amostra'], [128, XM, '#f1d9de', 'anticorpo marcado'], [XM, XA, '#f7f5ef', 'membrana de nitrocelulose'], [XA, X1, '#e6e0d2', 'absorvente']];
    segs.forEach(function (s) {
      el('rect', { x: s[0], y: 32, width: s[1] - s[0], height: 24, style: 'fill:' + s[2] + ';stroke:#b9ad92;stroke-width:1' });
      tx({ x: (s[0] + s[1]) / 2, y: 24, 'text-anchor': 'middle', style: 'font-size:13px;' + LAP }, s[3]);
    });
    var linT = el('rect', { x: XT - 4, y: 32, width: 8, height: 24, style: 'fill:' + OURO + ';opacity:0' });
    var linC = el('rect', { x: XC - 4, y: 32, width: 8, height: 24, style: 'fill:' + OURO + ';opacity:0' });
    tx({ x: XT, y: 74, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;' + TXT }, 'T');
    tx({ x: XC, y: 74, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;' + TXT }, 'C');
    var molhado = el('rect', { x: X0, y: 32, height: 24, style: 'fill:#5b9bd5;opacity:.18' });
    var resT = tx({ x: X1, y: 74, 'text-anchor': 'end', style: 'font-size:14px;font-weight:700' }, '');
    /* ---------- ampliacao ---------- */
    var BY0 = 96, BY1 = 248;
    el('rect', { x: X0, y: BY0, width: X1 - X0, height: BY1 - BY0, rx: 8, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' });
    var frente = el('rect', { x: X0, y: BY0, height: BY1 - BY0, rx: 8, style: 'fill:#5b9bd5;opacity:.12' });
    [128, XM, XA].forEach(function (x) { el('line', { x1: x, x2: x, y1: BY0, y2: BY1, style: 'stroke:var(--linha);stroke-width:1;stroke-dasharray:4 4' }); });
    var cab = tx({ x: X0 + 8, y: 89, style: 'font-size:13.5px;font-weight:700;fill:var(--ad-t)' }, '');
    var LAN = [132, 156, 180, 204, 228];
    /* formas */
    function Y(pai, dir, cor, ouro) {
      var g = el('g', {}, pai);
      el('path', { d: 'M' + (-dir * 10) + ' 0 H0 L' + (dir * 7) + ' -6 M0 0 L' + (dir * 7) + ' 6', style: 'fill:none;stroke:' + cor + ';stroke-width:3;stroke-linecap:round;stroke-linejoin:round' }, g);
      if (ouro) el('circle', { cx: -dir * 6, cy: -7, r: 5, style: 'fill:' + OURO }, g);
      return g;
    }
    function antigeno(pai) {
      var g = el('g', {}, pai), d = '';
      for (var k = 0; k < 6; k++) { var a = k * Math.PI / 3; d += 'M' + (5 * Math.cos(a)).toFixed(1) + ' ' + (5 * Math.sin(a)).toFixed(1) + ' L' + (8.5 * Math.cos(a)).toFixed(1) + ' ' + (8.5 * Math.sin(a)).toFixed(1) + ' '; }
      el('path', { d: d, style: 'stroke:' + AG + ';stroke-width:2;stroke-linecap:round' }, g);
      el('circle', { r: 5.5, style: 'fill:' + AG }, g);
      return g;
    }
    /* anticorpos fixos nas linhas (bracos voltados para a corrente) */
    LAN.forEach(function (y) { Y(el('g', { transform: 'translate(' + (XT + 12) + ' ' + y + ')' }), -1, FT, false); });
    LAN.forEach(function (y) { Y(el('g', { transform: 'translate(' + (XC + 12) + ' ' + y + ')' }), -1, FC, false); });
    el('line', { x1: XT + 22, x2: XT + 22, y1: BY0 + 22, y2: BY1 - 10, style: 'stroke:' + FT + ';stroke-width:3' });
    el('line', { x1: XC + 22, x2: XC + 22, y1: BY0 + 22, y2: BY1 - 10, style: 'stroke:' + FC + ';stroke-width:3' });
    /* rotulos da ampliacao */
    var rAg = tx({ x: 84, y: 116, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;fill:' + AG }, 'antígeno');
    tx({ x: 171, y: 116, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;fill:' + OURO }, 'anticorpo + ouro');
    el('line', { x1: XT + 22, x2: XT + 22, y1: BY1, y2: 262, style: 'stroke:var(--lapis);stroke-width:1.2' });
    tx({ x: XT + 26, y: 274, 'text-anchor': 'end', style: 'font-size:13.5px;' + TXT }, 'linha T: anticorpos anti-vírus fixos', null);
    el('line', { x1: XC + 22, x2: XC + 22, y1: BY1, y2: 280, style: 'stroke:var(--lapis);stroke-width:1.2' });
    tx({ x: X1, y: 293, 'text-anchor': 'end', style: 'font-size:13.5px;' + TXT }, 'linha C: anticorpos anti-anticorpo (prendem a cauda)', null);
    var f1 = tx({ x: X0, y: 320, style: 'font-size:14.5px;font-weight:700;' + TXT }, ''), f2 = tx({ x: X0, y: 340, style: 'font-size:14.5px;' + TXT }, '');
    /* particulas */
    var ags = [], cjA = [], cjB = [];
    LAN.forEach(function (y, i) {
      var a = el('g', {}); antigeno(a); ags.push({ g: a, x0: 62 + (i % 2) * 22 + (i % 3) * 6, y: y });
      var c = el('g', {}); Y(c, 1, '#8a5a66', true); cjA.push({ g: c, x0: 194, y: y });
      var d = el('g', {}); Y(d, 1, '#8a5a66', true); cjB.push({ g: d, x0: 158, y: y });
    });
    var V = 100, VF = 112;
    function xf(u) { return Math.min(X1, X0 + VF * u); }
    function tChega(x) { return (x - X0) / VF; }
    function pos(o, x, y) { o.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y + ')'); }
    var XCP = XC - 17;   /* na linha C o anticorpo marcado e' preso pela cauda (Fc): ele chega virado */
    function posC(o, x, y) { var a = 180 * Math.min(1, Math.max(0, (x - (XCP - 60)) / 50)); o.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y + ') rotate(' + a.toFixed(1) + ')'); }
    return function (t) {
      var neg = t >= 6, u = neg ? t - 6 : t;
      var fade = u < .25 ? u / .25 : u > 5.75 ? 0 : 1;
      var xfu = xf(u);
      molhado.setAttribute('width', (xfu - X0).toFixed(1)); frente.setAttribute('width', (xfu - X0).toFixed(1));
      cab.textContent = neg ? 'Por dentro, ampliado — amostra SEM vírus' : 'Por dentro, ampliado — amostra COM vírus';
      var nT = 0, nC = 0, k;
      /* antigenos */
      ags.forEach(function (a) { a.g.style.display = neg ? 'none' : ''; });
      rAg.textContent = neg ? '' : 'antígeno';
      /* conjugados da coluna A: no positivo, o antigeno encosta, contorna e se liga aos bracos; no negativo, so a corrente */
      cjA.forEach(function (c, i) {
        var x;
        if (!neg) {
          var a = ags[i], ts = tChega(a.x0), ua = ts + (c.x0 - 18 - a.x0) / V, ub = ua + .35;
          x = u < ub ? c.x0 : c.x0 + V * (u - ub);
          if (x >= XT - 21) { x = XT - 21; nT++; }
          pos(c, x, c.y);
          if (u < ua) a.g.setAttribute('transform', 'translate(' + (a.x0 + V * Math.max(0, u - ts)).toFixed(1) + ' ' + c.y + ')');
          else if (u < ub) { var w = (u - ua) / .35; a.g.setAttribute('transform', 'translate(' + (c.x0 - 18 + 33 * w).toFixed(1) + ' ' + (c.y - 13 * Math.sin(Math.PI * w)).toFixed(1) + ')'); }
          else a.g.setAttribute('transform', 'translate(' + (x + 15).toFixed(1) + ' ' + c.y + ')');
        } else {
          var ts2 = tChega(c.x0) + .15; x = c.x0 + V * Math.max(0, u - ts2);
          if (x >= XCP) { x = XCP; nC++; }
          posC(c, x, c.y);
        }
      });
      /* conjugados da coluna B: livres */
      cjB.forEach(function (c) {
        var ts = tChega(c.x0) + .15, x = c.x0 + V * Math.max(0, u - ts);
        var alvo = neg ? XA + 20 + (c.y % 3) * 8 : XCP;
        if (x >= alvo) { x = alvo; if (!neg) nC++; }
        if (neg) pos(c, x, c.y); else posC(c, x, c.y);
      });
      linT.style.opacity = (nT / 5).toFixed(2); linC.style.opacity = (nC / 5).toFixed(2);
      svg.style.opacity = fade.toFixed(2);
      if (u > 4.1) { resT.textContent = neg ? 'só C: negativo' : 'C e T: positivo'; resT.style.fill = neg ? 'var(--tinta)' : OURO; } else resT.textContent = '';
      var F;
      if (u < 1.2) F = ['A amostra pinga e corre pela fita (capilaridade)', neg ? 'sem vírus, não há antígeno nenhum no líquido' : 'o líquido traz antígenos (proteínas) do vírus'];
      else if (u < 2.65) F = ['O líquido solta os anticorpos marcados com ouro', neg ? 'eles seguem soltos: não há antígeno para segurar' : 'cada um agarra um antígeno e os dois seguem juntos'];
      else if (u < 3.85) F = neg ? ['Na linha T, nada é preso', 'os anticorpos fixos só prendem o antígeno, e ele não veio'] : ['Na linha T, os anticorpos fixos agarram o antígeno', 'antígeno no meio, ouro preso: a linha T fica colorida'];
      else F = ['Na linha C, o anticorpo marcado que sobrou é preso', neg ? 'linha C colore: o teste funcionou; resultado negativo' : 'Por isso: na linha T ficam anticorpos anti-vírus fixos'];
      f1.textContent = F[0]; f2.textContent = F[1];
    };
  }
};
VIS.liga('teste-rapido-fluxo-lateral', ['P5ee2557']);

/* etapa final: "Por isso a resposta é..." da questão aberta */
(function () {
  var V = VIS.def['teste-rapido-fluxo-lateral'], m0 = V.monta, D0 = V.dur, R = {"P5ee2557": ["B — anticorpos anti-Sars-CoV-2", "Fixos na linha T, eles capturam o antígeno viral da amostra,", "que já veio preso ao anticorpo colorido: a linha aparece."]};
  V.dur = D0 + 2.6; V.marcas = V.marcas.concat([[D0, 'Resposta']]);
  V.monta = function (svg, qid) {
    var d = m0(svg, qid), NS = 'http://www.w3.org/2000/svg', r = R[qid];
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    var g = el('g', { style: 'display:none' });
    el('rect', { x: 0, y: 0, width: 640, height: 360, style: 'fill:var(--folha);opacity:.86' }, g);
    el('rect', { x: 36, y: 92, width: 568, height: 168, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, g);
    var t0 = el('text', { x: 60, y: 128, style: 'font-size:15px;font-weight:600;fill:var(--lapis)' }, g);
    var t1 = el('text', { x: 60, y: 162, style: 'font-size:23px;font-weight:700;fill:var(--ad-t)' }, g);
    var t2 = el('text', { x: 60, y: 202, style: 'font-size:15.5px;fill:var(--tinta)' }, g);
    var t3 = el('text', { x: 60, y: 226, style: 'font-size:15.5px;fill:var(--tinta)' }, g);
    t0.textContent = r ? 'Por isso, a resposta é' : 'Resumo';
    if (r) { t1.textContent = r[0]; t2.textContent = r[1]; t3.textContent = r[2] || ''; }
    return function (t) {
      if (t < D0) { g.style.display = 'none'; d(t); return; }
      d(5.65); svg.style.opacity = 1; g.style.display = r ? '' : 'none';
      g.style.opacity = Math.min(1, (t - D0) / .3).toFixed(2);
    };
  };
})();
