/* Nucleolo: transcreve o RNA ribossomico e monta as subunidades do ribossomo, que saem pelos poros e se juntam
   no citoplasma para traduzir o RNAm. Bloquear a transcricao no nucleolo (oxaliplatina) derruba a sintese de proteinas. */
function quebra(s, n) { var p = s.split(' '), L = [], a = ''; p.forEach(function (w) { if (a && (a + ' ' + w).length > n) { L.push(a); a = w; } else a = a ? a + ' ' + w : w; }); if (a) L.push(a); return L; }
/* etapa final "Resposta" (padrao de bio_ok/fermentacao-x-respiracao.js): congela o quadro que decide a questao aberta.
   Aqui o cartao ocupa o lugar do painel de texto (opc.esconde) e o desenho fica visivel ao lado. */
function fimResposta(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 3.2); def.marcas.push([TF, opc.marca || 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var g = el('g', {});
  Array.prototype.slice.call(svg.childNodes).forEach(function (k) { if (k !== g && k.nodeName !== 'defs') g.appendChild(k); });
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var L = []; r.slice(1).forEach(function (s) { L = L.concat(opc.quebra ? quebra(s, opc.quebra) : [s]); });
  var lh = 22, w = opc.w || 520, h = 78 + lh * (L.length - 1), x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 16, y: y + 31, style: 'font-size:17px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  L.forEach(function (s, i) { var t = el('text', { x: x + 16, y: y + 58 + lh * i, style: 'font-size:14.5px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
    if (opc.esconde) opc.esconde.style.opacity = on ? 0 : 1;
  };
}
var RESP = {
  'Pb84f3bb': ['Por isso a resposta é C', 'Sem transcrição no nucléolo não se formam subunidades do ribossomo. Com menos ribossomos no citoplasma, a síntese de proteínas cai e a célula cancerosa morre.']
};
VIS.def['nucleolo-ribossomos'] = {
  tit: 'O nucléolo fabrica os ribossomos',
  fontes: ['OpenStax, Biology 2e, 4.3 Eukaryotic Cells (The Nucleus, Nucleolus, Ribosomes) — https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells', 'OpenStax, Biology 2e, 15.5 Ribosomes and Protein Synthesis — https://openstax.org/books/biology-2e/pages/15-5-ribosomes-and-protein-synthesis', 'Wikipedia (en), Nucleolus — https://en.wikipedia.org/wiki/Nucleolus'],
  tipo: 'anim', dur: 18,
  marcas: [[0, 'Nucléolo'], [3.6, 'rRNA'], [7.2, 'Poros'], [10.8, 'Tradução'], [14.4, 'Bloqueio']],
  cred: 'Animação feita para o app (esquema fora de escala).',
  nota: 'O nucléolo não tem membrana: é a região do núcleo onde o RNA ribossômico (rRNA) é transcrito e se junta a proteínas, formando as duas subunidades do ribossomo. Elas saem pelos poros e só se unem no citoplasma, sobre um RNAm.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var NUC = '#7d6aa8', RR = '#c0392b', PR = '#2f7a6a', SG = '#4a5a8a', SP = '#8796c8', RM = '#2f6db5', AA = '#d9822b';
    var B = 'font-size:13.5px;font-weight:700;', N = 'font-size:13px;';
    var NX = 132, NY = 178, NR = 112;
    el('rect', { x: 8, y: 30, width: 374, height: 300, rx: 24, style: 'fill:color-mix(in srgb,#e9d8b8 26%,var(--folha))' });
    tx(372, 52, 'citoplasma', 'font-size:13px;font-weight:600;text-anchor:end;fill:var(--lapis)');
    el('circle', { cx: NX, cy: NY, r: NR, style: 'fill:color-mix(in srgb,' + NUC + ' 10%,var(--folha))' });
    var poros = [-50, -15, 20, 55];
    function env(r) { var d = ''; var a0 = -180; poros.concat([180]).forEach(function (p) { var a1 = p - 4; d += arc(r, a0, a1); a0 = p + 4; }); return d; }
    function arc(r, a0, a1) { var q0 = a0 * Math.PI / 180, q1 = a1 * Math.PI / 180; return 'M' + (NX + r * Math.cos(q0)).toFixed(1) + ' ' + (NY + r * Math.sin(q0)).toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + (NX + r * Math.cos(q1)).toFixed(1) + ' ' + (NY + r * Math.sin(q1)).toFixed(1) + ' '; }
    el('path', { d: env(NR) + env(NR - 6), style: 'fill:none;stroke:' + NUC + ';stroke-width:2.4' });
    tx(NX - 60, NY - 78, 'núcleo', B + 'fill:#5d4c88');
    var cro = el('path', { d: 'M40 150 c20 -30 40 30 60 0 s40 30 50 10 M50 240 c18 -20 30 20 50 0 s30 20 60 -10 M160 90 c10 20 -12 30 4 50', style: 'fill:none;stroke:' + NUC + ';stroke-width:1.6;opacity:.6' });
    var nuc = el('path', { d: 'M108 160 C100 132 140 118 162 132 C186 146 184 182 168 196 C150 214 116 208 108 190 C102 178 112 172 108 160 Z', style: 'fill:color-mix(in srgb,' + NUC + ' 55%,var(--folha))' });
    var nucL = el('g', {}); el('path', { d: 'M140 208 L134 234', style: 'stroke:var(--lapis);stroke-width:1.2' }, nucL);
    tx(132, 250, 'nucléolo', B + 'text-anchor:middle;fill:#5d4c88', nucL); tx(132, 266, '(sem membrana)', N + 'font-weight:600;text-anchor:middle;fill:#5d4c88', nucL);
    var xBl = el('path', { d: 'M114 136 L176 204 M176 136 L114 204', style: 'stroke:#b4442f;stroke-width:6;stroke-linecap:round' });
    /* rRNA saindo, proteinas entrando, subunidades */
    var rr = []; for (var i = 0; i < 4; i++) rr.push(el('path', { d: 'M0 0 c4 -6 8 6 12 0 s8 6 12 0', style: 'fill:none;stroke:' + RR + ';stroke-width:2.4' }));
    var pr = []; for (i = 0; i < 5; i++) pr.push(el('circle', { r: 3.4, style: 'fill:' + PR }));
    function sub(big) { var g = el('g', {}); el('ellipse', { rx: big ? 15 : 11, ry: big ? 10 : 7, style: 'fill:' + (big ? SG : SP) + ';stroke:#2a3350;stroke-width:1' }, g); return g; }
    var SU = [[true, 0], [false, 0], [true, 1], [false, 1]].map(function (k) { var g = sub(k[0]); g._b = k[0]; g._i = k[1]; return g; });
    var lb1 = tx(0, 0, '', B + 'fill:' + RR), lb2 = tx(0, 0, '', B + 'fill:' + PR), lb3 = tx(0, 0, '', B + 'fill:' + SG);
    /* traducao no citoplasma */
    var RMY = 250;
    var mrna = el('path', { d: 'M262 ' + RMY + ' H376', style: 'stroke:' + RM + ';stroke-width:3' });
    var mrL = tx(300, RMY + 22, 'RNAm', B + 'fill:' + RM);
    var ribo = el('g', {}); el('ellipse', { cx: 0, cy: -12, rx: 16, ry: 11, style: 'fill:' + SG + ';stroke:#2a3350;stroke-width:1' }, ribo); el('ellipse', { cx: 0, cy: 6, rx: 12, ry: 7, style: 'fill:' + SP + ';stroke:#2a3350;stroke-width:1' }, ribo);
    var cadeia = []; for (i = 0; i < 9; i++) cadeia.push(el('circle', { r: 4, style: 'fill:' + AA + ';stroke:#fff;stroke-width:1' }));
    var trL = tx(0, 0, '', B + 'fill:' + AA);
    var gameOver = tx(195, 316, '', 'font-size:14px;font-weight:800;text-anchor:middle;fill:#b4442f');
    /* painel */
    var gT = el('g', {});
    var pT = tx(400, 40, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', gT);
    var pL = []; for (var j = 0; j < 10; j++) pL.push(tx(400, 68 + 20 * j, '', 'font-size:14px;fill:var(--tinta)', gT));
    var E = [
      { tit: '1 · Nucléolo', s: 'O nucléolo é a região mais escura do núcleo. Não tem membrana: é onde ficam os genes do RNA ribossômico (rRNA), copiados sem parar quando a célula fabrica muita proteína.' },
      { tit: '2 · rRNA + proteínas', s: 'No nucléolo o rRNA é transcrito (vermelho) e se junta a proteínas ribossômicas que vieram do citoplasma (verde). Assim se montam as duas subunidades do ribossomo: a maior e a menor.' },
      { tit: '3 · Saída pelos poros', s: 'As subunidades prontas saem do núcleo pelos poros da carioteca, cada uma por si. Só no citoplasma elas vão se juntar.' },
      { tit: '4 · Tradução', s: 'No citoplasma, uma subunidade menor e uma maior se encaixam num RNAm e formam o ribossomo completo, que lê os códons e liga os aminoácidos: nasce a proteína.' },
      { tit: '5 · Nucléolo bloqueado', s: 'Um remédio que impede a transcrição no nucléolo corta a fonte de rRNA: não se formam subunidades novas. Os ribossomos antigos se desgastam, a síntese de proteínas cai e a célula, que se divide muito, morre.' }
    ];
    E.forEach(function (e) { e.L = quebra(e.s, 30); });
    var _desenha = function (t) {
      var f = t < 2.5 ? 0 : t < 5 ? 1 : t < 7.5 ? 2 : t < 10 ? 3 : 4;
      pT.textContent = E[f].tit; pL.forEach(function (l, i) { l.textContent = E[f].L[i] || ''; });
      var u = cl((t - [0, 2.5, 5, 7.5, 10][f]) / 2.5);
      op(nucL, f === 0 ? cl(u / .2) : f === 4 ? 1 : .0);
      op(xBl, f === 4 ? cl((u - .1) / .15) : 0);
      /* rRNA */
      rr.forEach(function (r, i) { var a = (i * 90 + 20) * Math.PI / 180, d = f === 1 ? ease((u - i * .08) / .4) * 22 : 0; mv(r, 135 + (18 + d) * Math.cos(a) - 12, 168 + (18 + d) * Math.sin(a) * .7); op(r, f === 1 ? cl((u - i * .08) / .1) * (u < .75 ? 1 : 1 - cl((u - .75) / .1)) : 0); });
      pr.forEach(function (c, i) { var p0 = [262 + i * 18, 100 + (i % 2) * 30], p1 = [150 + (i % 3) * 6, 150 + i * 6], s = ease((u - .05 - i * .05) / .5); var via = [NX + NR * Math.cos(-15 * Math.PI / 180), NY + NR * Math.sin(-15 * Math.PI / 180)]; var x = s < .5 ? lerp(p0[0], via[0], s * 2) : lerp(via[0], p1[0], s * 2 - 1), y = s < .5 ? lerp(p0[1], via[1], s * 2) : lerp(via[1], p1[1], s * 2 - 1); c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); op(c, f === 1 ? (u < .75 ? 1 : 1 - cl((u - .75) / .1)) : 0); });
      /* subunidades */
      SU.forEach(function (g) {
        var x0 = 136 + (g._b ? -12 : 14), y0 = 168 + g._i * 22 - 10, por = (g._i ? 20 : -15) * Math.PI / 180;
        var px = NX + NR * Math.cos(por), py = NY + NR * Math.sin(por), ox = px + (g._b ? 40 : 24), oy = py + (g._b ? -10 : 20);
        var x, y, o;
        if (f === 1) { x = x0; y = y0; o = cl((u - .7) / .15); }
        else if (f === 2) { var s1 = ease((u - g._i * .15 - (g._b ? 0 : .1)) / .6); x = lerp(x0, px, Math.min(1, s1 * 1.6)); y = lerp(y0, py, Math.min(1, s1 * 1.6)); if (s1 > .62) { x = lerp(px, ox, (s1 - .62) / .38); y = lerp(py, oy, (s1 - .62) / .38); } o = 1; }
        else if (f === 3) { var j = ease(u / .15); x = lerp(ox, 300, j); y = lerp(oy, g._b ? 234 : 252, j); o = g._i === 0 ? 1 - cl(u / .2) : 1 - cl((u - .12) / .05); }
        else if (f === 4) { x = ox; y = oy; o = 0; }
        else { x = x0; y = y0; o = 0; }
        mv(g, x, y); op(g, o);
      });
      lb1.textContent = f === 1 ? 'rRNA' : ''; lb1.setAttribute('x', 190); lb1.setAttribute('y', 130);
      lb2.textContent = f === 1 && u < .7 ? 'proteínas ribossômicas' : ''; lb2.setAttribute('x', 232); lb2.setAttribute('y', 88);
      lb3.textContent = f === 1 && u > .7 ? 'subunidades' : f === 2 ? 'saem pelos poros' : ''; lb3.setAttribute('x', f === 2 ? 252 : 176); lb3.setAttribute('y', f === 2 ? 112 : 230);
      /* traducao */
      var tr = f === 3 ? 1 : f === 4 ? 1 - cl((u - .35) / .35) : 0;
      op(mrna, f >= 3 ? 1 : 0); op(mrL, f >= 3 ? 1 : 0);
      var rx = f === 3 ? lerp(300, 358, ease((u - .15) / .85)) : f === 4 ? 358 : 300;
      mv(ribo, rx, RMY - 4); op(ribo, f === 3 ? cl(u / .15) : f === 4 ? tr : 0);
      var nA = f === 3 ? Math.floor(9 * cl((u - .15) / .85)) : f === 4 ? 9 : 0;
      cadeia.forEach(function (c, i) { c.setAttribute('cx', (rx - 4 - i * 7).toFixed(1)); c.setAttribute('cy', (RMY - 30 - 9 * Math.sin(i * .9)).toFixed(1)); op(c, i < nA ? (f === 4 ? tr : 1) : 0); });
      trL.textContent = f === 3 && u > .3 ? 'proteína' : f === 4 && u > .5 ? 'quase sem proteína nova' : ''; trL.setAttribute('x', f === 4 ? 372 : 330); trL.setAttribute('y', f === 4 ? 292 : 190); trL.style.textAnchor = f === 4 ? 'end' : 'middle';
      gameOver.textContent = f === 4 && u > .75 ? 'sem ribossomos novos → sem proteína → a célula morre' : '';
      op(nuc, f === 4 ? 1 - .5 * cl((u - .1) / .2) : 1);
    };
    /* mais tempo de leitura: cada etapa dura 3.6 s; o desenho foi feito na escala antiga e e remapeado */
    var _O = [0, 2.5, 5, 7.5, 10, 12.5], _N = [0.0, 3.6, 7.2, 10.8, 14.4, 18.0];
    function _map(t, A, B) { for (var i = A.length - 2; i >= 0; i--) if (t >= A[i]) return B[i] + (Math.min(t, A[i + 1]) - A[i]) * (B[i + 1] - B[i]) / (A[i + 1] - A[i]); return t; }
    var _d0 = _desenha; _desenha = function (t) { _d0(_map(t, _N, _O)); };
    function _fix(o) { var c = o.congela; if (c) o.congela = function (q) { return _map(c(q), _O, _N); }; return o; }
    return fimResposta(VIS.def['nucleolo-ribossomos'], svg, _desenha, 18, RESP, qid, _fix({ x: 390, y: 14, w: 244, quebra: 28, semEsmaecer: true, esconde: gT, congela: function () { return 12.4; } }));
  }
};
VIS.liga('nucleolo-ribossomos', ['Pb84f3bb']);
