/* Transporte pela membrana: difusao simples, difusao facilitada (canal e carreadora), osmose (aquaporina)
   e bomba de Na+/K+ (3 Na+ para fora, 2 K+ para dentro, 1 ATP). Etapa final: sem ATP so o passivo continua. */
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
  'W222501c': ['Por isso a resposta é D', 'Difusão, difusão facilitada e osmose vão a favor do gradiente e continuam mesmo sem ATP.', 'Bomba de Na⁺/K⁺, fagocitose e exocitose gastam energia.'],
  'W92db283': ['Por isso a resposta é C', 'Ativo é o transporte contra o gradiente, como o da bomba de Na⁺/K⁺: ele só acontece quebrando ATP.', 'A e B descrevem o passivo.'],
  'W233dfdf': ['Por isso a resposta é E', 'Sem ATP a bomba para e as diferenças de concentração somem.', 'Quem mantém a diferença é o transporte ativo, que gasta energia.', 'O mesmo vale para a bomba de Ca²⁺.']
};
VIS.def['transporte-membrana-passivo-ativo'] = {
  tit: 'Passivo segue o gradiente; ativo gasta ATP para ir contra ele',
  fontes: ['OpenStax, Biology 2e, 5.2 Passive Transport — https://openstax.org/books/biology-2e/pages/5-2-passive-transport', 'OpenStax, Biology 2e, 5.3 Active Transport — https://openstax.org/books/biology-2e/pages/5-3-active-transport', 'Wikipedia (en), Sodium–potassium pump — https://en.wikipedia.org/wiki/Sodium%E2%80%93potassium_pump'],
  tipo: 'anim', dur: 18,
  marcas: [[0, 'Simples'], [3.6, 'Facilitada'], [7.2, 'Osmose'], [10.8, 'Bomba Na⁺/K⁺'], [14.4, 'Sem ATP']],
  cred: 'Animação feita para o app (esquema fora de escala; as barras mostram a concentração de cada íon fora e dentro da célula).',
  nota: 'Passivo (difusão simples, facilitada e osmose) só depende da diferença de concentração e não gasta ATP. Ativo (bomba de Na⁺/K⁺) leva o soluto contra o gradiente e para quando falta ATP.',
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
    var O2 = '#c0392b', CO2 = '#6b6b6b', NA = '#d9822b', K = '#7b4fa8', AG = '#2f7fc1', GL = '#c9a227', PROT = '#5f86b3', BOM = '#6d5aa8';
    var MT = 150, MB = 190, YT = 64, YB = 278;
    var S = [70, 140, 205, 268, 335];
    tx(10, 44, 'meio externo', 'font-size:13px;font-weight:600;fill:var(--lapis)');
    tx(10, 286, 'citosol', 'font-size:13px;font-weight:600;fill:var(--lapis)');
    /* bicamada */
    var gM = el('g', {});
    function livre(x) { return !(x > 122 && x < 158) && !(x > 183 && x < 227) && !(x > 249 && x < 287) && !(x > 299 && x < 371); }
    for (var x = 12; x <= 380; x += 9) {
      if (!livre(x)) continue;
      [[MT + 5, 1], [MB - 5, -1]].forEach(function (p) {
        el('path', { d: 'M' + (x - 1.6) + ' ' + (p[0] + 4 * p[1]) + ' v' + (13 * p[1]) + ' M' + (x + 1.6) + ' ' + (p[0] + 4 * p[1]) + ' v' + (13 * p[1]), style: 'stroke:#c4ab7a;stroke-width:1.3;fill:none' }, gM);
        el('circle', { cx: x, cy: p[0], r: 4.3, style: 'fill:#ecc77d;stroke:#b8892e;stroke-width:1' }, gM);
      });
    }
    /* proteinas */
    function prot(x0, w, cor) { return el('rect', { x: x0, y: MT - 12, width: w, height: MB - MT + 24, rx: 8, style: 'fill:color-mix(in srgb,' + cor + ' 30%,var(--folha));stroke:' + cor + ';stroke-width:1.8' }); }
    var pCan = [prot(124, 13, PROT), prot(143, 13, PROT)];
    var pCar = prot(185, 40, PROT);
    var bolso = el('rect', { x: 196, width: 18, height: 22, rx: 6, style: 'fill:var(--folha);stroke:' + PROT + ';stroke-width:1.4' });
    var pAq = [prot(251, 12, AG), prot(273, 12, AG)];
    var pB = prot(301, 68, BOM);
    var cav = el('rect', { x: 323, width: 24, height: 30, rx: 7, style: 'fill:var(--folha);stroke:' + BOM + ';stroke-width:1.4' });
    var fosf = el('g', {}); el('circle', { r: 9, style: 'fill:#e6b33b;stroke:#9a7220;stroke-width:1.2' }, fosf); tx(0, 4.5, 'P', 'font-size:13px;font-weight:800;fill:#5a4210;text-anchor:middle', fosf);
    var xB = el('g', {}); el('path', { d: 'M318 140 L352 200 M352 140 L318 200', style: 'stroke:#b4442f;stroke-width:4;stroke-linecap:round' }, xB);
    /* selos numerados */
    var selos = S.map(function (sx, i) { var g = el('g', {}); mv(g, sx, 298); var c = el('circle', { r: 10.5, style: 'stroke:var(--ad-c);stroke-width:2' }, g); var n = tx(0, 5, String(i + 1), 'font-size:13px;font-weight:800;text-anchor:middle', g); return { g: g, c: c, n: n }; });
    /* moleculas */
    function mol(cor, raio, n) { var g = el('g', {}); for (var i = 0; i < n; i++) el('circle', { cx: (i - (n - 1) / 2) * raio * 1.5, r: raio, style: 'fill:' + cor }, g); return g; }
    var mO2 = [0, 1, 2].map(function () { return mol(O2, 5.2, 2); });
    var mCO2 = [0, 1].map(function () { return mol(CO2, 4.4, 3); });
    var mK1 = [0, 1, 2].map(function () { return mol(K, 6.2, 1); });
    var mGl = [0, 1].map(function () { var g = el('g', {}); el('path', { d: 'M-9 0 L-4.5 -7.8 L4.5 -7.8 L9 0 L4.5 7.8 L-4.5 7.8 Z', style: 'fill:' + GL + ';stroke:#8a6d12;stroke-width:1' }, g); return g; });
    var mH2O = [0, 1, 2, 3].map(function () { return mol(AG, 4.4, 1); });
    var sol = el('g', {});
    [[240, 220], [292, 232], [258, 252], [300, 262], [238, 270], [280, 212], [262, 96]].forEach(function (p) { el('rect', { x: p[0] - 4, y: p[1] - 4, width: 8, height: 8, rx: 2, style: 'fill:#9b9b9b' }, sol); });
    var naB = [0, 1, 2].map(function () { return mol(NA, 5.2, 1); });
    var kB = [0, 1].map(function () { return mol(K, 5.2, 1); });
    var atp = el('g', {}); el('rect', { x: -19, y: -10, width: 38, height: 20, rx: 10, style: 'fill:color-mix(in srgb,#9a7220 22%,var(--folha));stroke:#9a7220;stroke-width:1.3' }, atp);
    var atpT = tx(0, 4.5, 'ATP', 'font-size:13px;font-weight:800;fill:#7a5a14;text-anchor:middle', atp);
    var chipB = tx(335, 112, '', 'font-size:13px;font-weight:700;fill:' + BOM + ';text-anchor:middle');
    var chipB2 = tx(318, 238, '', 'font-size:13px;font-weight:700;fill:' + BOM + ';text-anchor:end');
    /* medidores de concentracao */
    function medidor(x0, nome, cor) {
      tx(x0, 334, nome, 'font-size:14px;font-weight:800;fill:' + cor);
      tx(x0 + 30, 325, 'fora', 'font-size:13px;fill:var(--lapis)'); tx(x0 + 30, 344, 'dentro', 'font-size:13px;fill:var(--lapis)');
      el('rect', { x: x0 + 76, y: 316, width: 84, height: 10, rx: 3, style: 'fill:color-mix(in srgb,' + cor + ' 10%,var(--folha));stroke:var(--linha)' });
      el('rect', { x: x0 + 76, y: 335, width: 84, height: 10, rx: 3, style: 'fill:color-mix(in srgb,' + cor + ' 10%,var(--folha));stroke:var(--linha)' });
      return [el('rect', { x: x0 + 76, y: 316, height: 10, rx: 3, style: 'fill:' + cor }), el('rect', { x: x0 + 76, y: 335, height: 10, rx: 3, style: 'fill:' + cor })];
    }
    var bNa = medidor(8, 'Na⁺', NA), bK = medidor(200, 'K⁺', K);
    /* painel */
    var gP = el('g', {});
    var pT = tx(400, 40, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', gP);
    var pL = []; for (var i = 0; i < 10; i++) pL.push(tx(400, 68 + 20 * i, '', 'font-size:14px;fill:var(--tinta)', gP));
    var E = [
      { t0: 0, tit: '1 · Difusão simples', s: 'O₂ (vermelho) e CO₂ (cinza) são pequenos e apolares: passam direto pela bicamada de fosfolipídios. Cada um vai do lado onde está mais concentrado para onde está menos (a favor do gradiente), sem gastar ATP.' },
      { t0: 2.8, tit: '2 e 3 · Difusão facilitada', s: 'Íons (K⁺, roxo) e glicose (amarelo) não cruzam a bicamada. Passam por proteínas: o canal (2) é um túnel; a carreadora (3) muda de forma. Ainda a favor do gradiente e sem ATP: a proteína só abre caminho.' },
      { t0: 5.6, tit: '4 · Osmose', s: 'É a difusão da água. Ela cruza a membrana, mais rápido pela aquaporina (4), indo do lado com menos soluto (quadradinhos) para o lado com mais soluto. Também é passiva: sem ATP.' },
      { t0: 8.2, tit: '5 · Bomba de Na⁺/K⁺', s: 'Transporte ativo: contra o gradiente. A cada ATP quebrado (ATP → ADP + P), a bomba põe 3 Na⁺ para fora e 2 K⁺ para dentro. Por isso há muito mais Na⁺ fora e muito mais K⁺ dentro (barras).' },
      { t0: 11.4, tit: 'E se faltar ATP?', s: 'A bomba para. Difusão, facilitada e osmose continuam, porque só dependem da diferença de concentração. Os íons vazam a favor do gradiente e as diferenças de Na⁺ e K⁺ se desfazem.' }
    ];
    E.forEach(function (e) { e.L = quebra(e.s, 30); });
    function fluxo(o, xc, t, per, off, desce, larg) {
      var w = ((t / per + off) % 1 + 1) % 1, y = desce ? lerp(YT, YB, w) : lerp(YB, YT, w);
      mv(o, xc + (larg || 0) * Math.sin(w * 6.28 + off * 9), y); return Math.min(1, Math.sin(Math.PI * w) * 2.2);
    }
    var _desenha = function (t) {
      var f = t < 2.8 ? 0 : t < 5.6 ? 1 : t < 8.2 ? 2 : t < 11.4 ? 3 : 4;
      var e = E[f]; pT.textContent = e.tit; pL.forEach(function (l, i) { l.textContent = e.L[i] || ''; });
      var sem = f === 4;
      var at = [f === 0 || sem, f === 1 || sem, f === 1 || sem, f === 2 || sem, f === 3];
      selos.forEach(function (s, i) { var on = at[i]; s.c.style.fill = on ? 'var(--ad-c)' : 'var(--folha)'; s.n.style.fill = on ? '#fff' : 'var(--ad-t)'; op(s.g, on || f === 4 && i === 4 ? 1 : .45); });
      pCan.concat(pAq).forEach(function (p) { op(p, .45); }); op(pCar, .45); op(bolso, .45); op(pB, f === 3 ? 1 : .45);
      if (at[1]) pCan.forEach(function (p) { op(p, 1); });
      if (at[2]) { op(pCar, 1); op(bolso, 1); }
      if (at[3]) pAq.forEach(function (p) { op(p, 1); });
      /* 1 difusao simples */
      mO2.forEach(function (m, i) { var a = fluxo(m, S[0] - 6, t, 1.9, i / 3, true, 5); op(m, at[0] ? a : 0); });
      mCO2.forEach(function (m, i) { var a = fluxo(m, S[0] + 8, t, 2.2, i / 2 + .2, false, 4); op(m, at[0] ? a : 0); });
      /* 2 canal: K+ sai (mais K+ dentro) */
      mK1.forEach(function (m, i) { var a = fluxo(m, S[1], t, 1.7, i / 3, false, 0); op(m, at[1] ? a : 0); });
      /* 3 carreadora: glicose entra, o bolso muda de lado */
      var wc = ((t / 1.6) % 1 + 1) % 1, by = wc < .35 ? MT - 4 : wc < .6 ? lerp(MT - 4, MB - 18, ease((wc - .35) / .25)) : MB - 18;
      bolso.setAttribute('y', (at[2] ? by : MT + 9).toFixed(1));
      mGl.forEach(function (m, i) {
        if (i === 0) { var yy = wc < .35 ? lerp(YT + 20, MT + 7, wc / .35) : wc < .6 ? by + 11 : lerp(MB - 7, YB - 10, (wc - .6) / .4); mv(m, S[2], yy); op(m, at[2] ? 1 : 0); }
        else { mv(m, S[2] + 22, YT + 22 + 6 * Math.sin(t * 2)); op(m, at[2] ? .9 : 0); }
      });
      /* 4 osmose */
      op(sol, f === 2 ? 1 : 0);
      mH2O.forEach(function (m, i) { var a = fluxo(m, S[3], t, 1.5, i / 4, true, 0); op(m, at[3] ? a : 0); });
      /* 5 bomba */
      var u = f === 3 ? cl((t - 8.2) / 3.2) : f === 4 ? 0 : 0;
      var aberta = u < .38 ? 0 : u < .46 ? ease((u - .38) / .08) : u < .74 ? 1 : u < .82 ? 1 - ease((u - .74) / .08) : 0; /* 0 = aberta para dentro, 1 = para fora */
      cav.setAttribute('y', lerp(MB - 6, MT - 24, aberta).toFixed(1)); op(cav, f === 3 ? 1 : .45);
      var sitio = lerp(MB - 4, MT + 6, aberta) - 2;
      naB.forEach(function (m, i) {
        var dx = (i - 1) * 7, y;
        if (u < .18) y = lerp(262 - 8 * i, sitio, ease(u / .18));
        else if (u < .46) y = sitio;
        else y = lerp(sitio, 70 + 10 * i, ease((u - .46) / .14));
        mv(m, S[4] + dx + (u >= .46 ? (i - 1) * 14 * ease((u - .46) / .14) : 0), y); op(m, f === 3 ? (u > .62 ? 1 - cl((u - .62) / .06) : 1) : 0);
      });
      kB.forEach(function (m, i) {
        var dx = (i - .5) * 9, y;
        if (u < .5) y = 64 + 12 * i; else if (u < .66) y = lerp(64 + 12 * i, sitio, ease((u - .5) / .16)); else if (u < .84) y = sitio; else y = lerp(sitio, 262 - 10 * i, ease((u - .84) / .14));
        mv(m, S[4] + dx, y); op(m, f === 3 ? (u < .5 ? cl((u - .4) / .1) : 1) : 0);
      });
      var ua = cl((u - .2) / .14);
      mv(atp, lerp(395, S[4] + 26, ease(ua)), lerp(250, 208, ease(ua)) + (u > .34 ? 38 * cl((u - .34) / .1) : 0));
      atpT.textContent = u > .34 ? 'ADP' : 'ATP'; op(atp, f === 3 && u > .2 ? (u > .44 ? 1 - cl((u - .44) / .08) : 1) : 0);
      mv(fosf, S[4] + 26, lerp(MB - 6, MT + 8, aberta)); op(fosf, f === 3 && u > .34 && u < .8 ? 1 : 0);
      op(xB, sem ? cl((t - 11.6) / .3) : 0);
      chipB.textContent = f === 3 ? (u > .46 && u < .6 ? '3 Na⁺ para fora' : u >= .6 ? '2 K⁺ para dentro' : '') : sem ? 'sem ATP: parada' : '';
      chipB2.textContent = f === 3 && u > .3 && u < .5 ? 'ATP → ADP + P' : '';
      chipB.setAttribute('y', sem ? 226 : 112);
      /* barras */
      var v = sem ? ease((t - 11.8) / 1.8) : 0;
      bNa[0].setAttribute('width', lerp(80, 46, v).toFixed(1)); bNa[1].setAttribute('width', lerp(8, 42, v).toFixed(1));
      bK[0].setAttribute('width', lerp(6, 42, v).toFixed(1)); bK[1].setAttribute('width', lerp(80, 46, v).toFixed(1));
    };
    /* mais tempo de leitura: cada etapa dura 3.6 s; o desenho foi feito na escala antiga e e remapeado */
    var _O = [0, 2.8, 5.6, 8.2, 11.4, 14], _N = [0.0, 3.6, 7.2, 10.8, 14.4, 18.0];
    function _map(t, A, B) { for (var i = A.length - 2; i >= 0; i--) if (t >= A[i]) return B[i] + (Math.min(t, A[i + 1]) - A[i]) * (B[i + 1] - B[i]) / (A[i + 1] - A[i]); return t; }
    var _d0 = _desenha; _desenha = function (t) { _d0(_map(t, _N, _O)); };
    function _fix(o) { var c = o.congela; if (c) o.congela = function (q) { return _map(c(q), _O, _N); }; return o; }
    return fimResposta(VIS.def['transporte-membrana-passivo-ativo'], svg, _desenha, 18, RESP, qid, _fix({ x: 390, y: 14, w: 244, quebra: 28, semEsmaecer: true, esconde: gP, congela: function (q) { return q === 'W92db283' ? 9.45 : 13.9; } }));
  }
};
VIS.liga('transporte-membrana-passivo-ativo', ['W222501c', 'W92db283', 'W233dfdf']);
