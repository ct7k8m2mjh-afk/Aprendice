/* Deriva genetica: sorteio das frequencias alelicas a cada geracao (simulacao Wright-Fisher com 10 x 500 individuos),
   efeito fundador (poucos colonizam) e gargalo (catastrofe que mata ao acaso). Lote bio 9. */
/* etapa final "Resposta": congela o desenho no quadro que decide a questao aberta (qid) e mostra o porque.
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
  var n = r.length - 1, w = opc.w || 540, h = opc.h || 66 + 23 * n, x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
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
/* utilitarios de desenho */
function kit(svg) {
  var NS = 'http://www.w3.org/2000/svg', K = {};
  K.el = function (n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; };
  K.tx = function (x, y, s, st, pai) { var t = K.el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s || ''; return t; };
  K.cl = function (u) { return u < 0 ? 0 : u > 1 ? 1 : u; };
  K.ease = function (u) { u = K.cl(u); return u * u * (3 - 2 * u); };
  K.lerp = function (a, b, u) { return a + (b - a) * u; };
  K.op = function (o, v) { o.style.opacity = (+v).toFixed(2); o.style.display = v <= 0.001 ? 'none' : ''; };
  K.seta = function (pai, x1, y1, x2, y2, cor, w, extra) {
    var a = Math.atan2(y2 - y1, x2 - x1), h = 9;
    return K.el('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x2 - h * Math.cos(a - .45)).toFixed(1) + ' ' + (y2 - h * Math.sin(a - .45)).toFixed(1) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - h * Math.cos(a + .45)).toFixed(1) + ' ' + (y2 - h * Math.sin(a + .45)).toFixed(1), style: 'fill:none;stroke:' + (cor || 'var(--lapis)') + ';stroke-width:' + (w || 2.2) + ';stroke-linecap:round;stroke-linejoin:round' + (extra || '') }, pai);
  };
  /* painel de texto embaixo: titulo + ate 2 linhas */
  K.painel = function (y0) {
    y0 = y0 || 282;
    K.el('line', { x1: 14, x2: 626, y1: y0, y2: y0, style: 'stroke:var(--linha);stroke-width:1.5' });
    var a = K.tx(16, y0 + 22, '', 'font-size:16.5px;font-weight:700;fill:var(--ad-t)');
    var b = K.tx(16, y0 + 43, '', 'font-size:14.5px;fill:var(--tinta)');
    var c = K.tx(16, y0 + 63, '', 'font-size:14.5px;fill:var(--tinta)');
    return function (L) { a.textContent = L[0]; b.textContent = L[1] || ''; c.textContent = L[2] || ''; };
  };
  K.etapa = function (t, M) { var i = 0; for (var k = 0; k < M.length; k++) if (t >= M[k]) i = k; return i; };
  return K;
}
var RESP = {
'W53a94d6': ['Por isso a resposta é D',
  'Deriva é a mudança da frequência dos alelos por puro',
  'sorteio, sem finalidade e sem vantagem: é forte na',
  'população pequena e quase some na grande.'],
'Wffc3d5d': ['Por isso a resposta é D',
  'Poucos indivíduos fundam uma população nova e levam só',
  'uma amostra dos alelos, nas proporções que o acaso deu:',
  'é o efeito fundador (um tipo de deriva).'],
'Webae9a5': ['Por isso a resposta é E',
  'IV certa: poucos emigrantes fundando população nova é o',
  'efeito fundador. II certa: migração (fluxo gênico) mantém',
  'as populações parecidas. I erra (mutação não tem propósito)',
  'e III erra (a seleção altera a frequência dos genes).'],
'P24f9856': ['Por isso a resposta é B',
  'Texto 2: o incêndio matou ao acaso, sem escolher pela cor:',
  'é oscilação gênica (deriva), num gargalo. Texto 1 põe',
  'finalidade (Lamarck); texto 3 é seleção natural (Darwin).']
};
VIS.def['deriva-genetica-simulacao'] = {
  tit: 'Deriva genética: as frequências mudam por sorteio',
  fontes: ['OpenStax, Biology 2e, 19.2 Population Genetics, Genetic Drift (efeito do acaso maior em populações pequenas; efeito gargalo; efeito fundador) — https://openstax.org/books/biology-2e/pages/19-2-population-genetics',
    'Wikipedia (en), Genetic drift (modelo de Wright-Fisher; fixação e perda de alelos) — https://en.wikipedia.org/wiki/Genetic_drift',
    'Wikipedia (en), Founder effect — https://en.wikipedia.org/wiki/Founder_effect'],
  tipo: 'anim', dur: 12.4,
  marcas: [[0, '1. Pequena'], [3, '2. Grande'], [5.8, '3. Fundador'], [9, '4. Gargalo']],
  cred: 'Animação feita para o app. As linhas são simulações reais por sorteio (modelo de Wright-Fisher), começando com 50% do alelo A: 5 populações de 10 indivíduos e 5 de 500.',
  nota: 'Seleção natural: a característica é a causa de sobreviver. Deriva: a sobrevivência é sorteada e a característica vai junto, de carona. Quanto menor a população, mais forte o sorteio.',
  monta: function (svg, qid) {
    var K = kit(svg), el = K.el, tx = K.tx, cl = K.cl, ease = K.ease, lerp = K.lerp, op = K.op;
    svg.setAttribute('viewBox', '0 0 640 354');
    var M = [0, 3, 5.8, 9], TF = 12.4;
    var AZ = '#2b6cb0', LA = '#d0621f', AA = '#2f8f8a', Aa = '#7a4fa0';   /* AA/Aa: alelos A e a na cena do fundador */
    var PEQ = [[0.5,0.45,0.45,0.5,0.75,0.85,0.85,0.7,0.8,0.9,0.9,0.85,0.8,0.75,0.75,0.7,0.85,0.8,0.9,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],[0.5,0.6,0.45,0.6,0.55,0.65,0.75,0.75,0.6,0.45,0.25,0.3,0.3,0.1,0.1,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.5,0.4,0.3,0.2,0.2,0.05,0.1,0.15,0.3,0.25,0.3,0.25,0.25,0.35,0.45,0.35,0.35,0.45,0.55,0.5,0.65,0.6,0.75,0.75,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],[0.5,0.55,0.8,0.7,0.75,0.6,0.65,0.8,0.85,0.8,0.75,0.6,0.55,0.45,0.6,0.6,0.7,0.7,0.55,0.65,0.85,0.7,0.65,0.5,0.55,0.5,0.55,0.5,0.25,0.2,0.15,0.1,0.15,0.1,0.15,0.3,0.2,0.35,0.45,0.4,0.35],[0.5,0.6,0.6,0.7,0.5,0.55,0.45,0.5,0.45,0.55,0.5,0.45,0.4,0.25,0.25,0.2,0.3,0.4,0.25,0.1,0.1,0.1,0.05,0.05,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]];
    var GRA = [[0.5,0.48,0.49,0.5,0.49,0.45,0.44,0.42,0.43,0.41,0.41,0.39,0.42,0.42,0.42,0.41,0.4,0.39,0.41,0.42,0.41,0.39,0.37,0.39,0.37,0.38,0.39,0.39,0.4,0.39,0.38,0.39,0.38,0.35,0.35,0.37,0.37,0.35,0.37,0.33,0.35],[0.5,0.47,0.48,0.47,0.5,0.53,0.54,0.56,0.55,0.57,0.59,0.56,0.56,0.56,0.55,0.54,0.52,0.53,0.52,0.53,0.52,0.55,0.55,0.56,0.58,0.56,0.55,0.56,0.58,0.57,0.58,0.59,0.6,0.6,0.59,0.59,0.58,0.59,0.59,0.64,0.64],[0.5,0.49,0.47,0.47,0.45,0.46,0.44,0.42,0.43,0.43,0.45,0.48,0.48,0.48,0.47,0.47,0.47,0.51,0.51,0.51,0.52,0.52,0.52,0.5,0.49,0.47,0.46,0.44,0.46,0.48,0.49,0.5,0.5,0.48,0.5,0.48,0.46,0.48,0.46,0.46,0.48],[0.5,0.51,0.48,0.48,0.45,0.43,0.41,0.39,0.41,0.43,0.44,0.43,0.43,0.44,0.41,0.44,0.46,0.49,0.48,0.5,0.49,0.48,0.51,0.5,0.49,0.48,0.5,0.53,0.54,0.52,0.52,0.51,0.52,0.54,0.55,0.55,0.57,0.56,0.56,0.56,0.56],[0.5,0.52,0.53,0.54,0.54,0.54,0.54,0.51,0.48,0.47,0.49,0.49,0.5,0.49,0.5,0.5,0.48,0.48,0.48,0.49,0.49,0.51,0.48,0.46,0.44,0.46,0.44,0.47,0.47,0.47,0.47,0.47,0.49,0.5,0.5,0.52,0.5,0.49,0.54,0.53,0.54]];
    /* ===== cena A: graficos ===== */
    var A = el('g', {});
    function graf(x0, tit, sub, dados, cor) {
      var g = el('g', {}, A), W = 250, Y0 = 236, H = 180;
      tx(x0 + W / 2, 22, tit, 'font-size:15px;font-weight:700;fill:' + cor + ';text-anchor:middle', g);
      el('path', { d: 'M' + x0 + ' ' + (Y0 - H) + ' V' + Y0 + ' H' + (x0 + W), style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, g);
      el('line', { x1: x0, x2: x0 + W, y1: Y0 - H / 2, y2: Y0 - H / 2, style: 'stroke:var(--linha);stroke-width:1;stroke-dasharray:3 3' }, g);
      tx(x0 - 6, Y0 - H + 5, '100%', 'font-size:13px;fill:var(--lapis);text-anchor:end', g);
      tx(x0 - 6, Y0 - H / 2 + 5, '50%', 'font-size:13px;fill:var(--lapis);text-anchor:end', g);
      tx(x0 - 6, Y0 + 5, '0%', 'font-size:13px;fill:var(--lapis);text-anchor:end', g);
      tx(x0 + W, Y0 + 18, sub, 'font-size:13px;fill:var(--lapis);text-anchor:end', g);
      g.linhas = dados.map(function () { return el('path', { style: 'fill:none;stroke:' + cor + ';stroke-width:2.4;stroke-linejoin:round;opacity:.85' }, g); });
      g.d = function (ate) {
        dados.forEach(function (s, i) { var p = ''; for (var k = 0; k <= ate; k++) p += (k ? 'L' : 'M') + (x0 + W * k / 40).toFixed(1) + ' ' + (Y0 - H * s[k]).toFixed(1) + ' '; g.linhas[i].setAttribute('d', p); });
      };
      g.x0 = x0; g.W = W; g.Y0 = Y0; g.H = H;
      return g;
    }
    tx(14, 22, 'alelo A', 'font-size:13px;font-weight:700;fill:var(--tinta)', A);
    var gP = graf(64, '10 indivíduos', 'gerações → 40', PEQ, LA), gG = graf(372, '500 indivíduos', 'gerações → 40', GRA, AZ);
    var fx1 = tx(gP.x0 + 160, gP.Y0 - gP.H - 6, 'fixado (100%)', 'font-size:13px;font-weight:700;fill:' + LA, A);
    var fx0 = tx(gP.x0 + 160, gP.Y0 - 6, 'perdido (0%)', 'font-size:13px;font-weight:700;fill:' + LA, A);
    var gT = tx(gG.x0 + 125, gG.Y0 - gG.H / 2 - 50, 'fica perto de 50%', 'font-size:13px;font-weight:700;fill:' + AZ + ';text-anchor:middle', A);
    /* ===== pontos (cenas B e C) ===== */
    var sem = 5; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    function nuvem(n, cx, cy, rx, ry, ja) { var j0 = ja ? ja.length : 0, r = (ja || []).slice(), k = 0, dm = 17; while (r.length < n + j0) { if (++k % 4000 === 0) dm -= 1; var a = rnd() * 6.283, d = Math.sqrt(rnd()), p = [cx + rx * d * Math.cos(a), cy + ry * d * Math.sin(a)]; if (r.every(function (q) { return Math.hypot(q[0] - p[0], q[1] - p[1]) >= dm; })) r.push(p); } return r.slice(j0); }   /* espacamento >= 17 (cede so se nao couber) */
    function bola(pai, p, cor) { return el('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 7, style: 'fill:' + cor + ';stroke:var(--folha);stroke-width:1.5' }, pai); }
    /* cena B: efeito fundador */
    var B = el('g', {});
    el('rect', { x: 300, y: 30, width: 70, height: 230, style: 'fill:color-mix(in srgb,#8fc0e8 30%,var(--folha))' }, B);
    tx(335, 150, 'mar', 'font-size:13px;fill:#2f6fa8;text-anchor:middle', B);
    el('ellipse', { cx: 160, cy: 150, rx: 132, ry: 96, style: 'fill:color-mix(in srgb,#b0a070 16%,var(--folha));stroke:#9a8a5a;stroke-width:1.6' }, B);
    el('ellipse', { cx: 500, cy: 150, rx: 112, ry: 86, style: 'fill:color-mix(in srgb,#b0a070 16%,var(--folha));stroke:#9a8a5a;stroke-width:1.6' }, B);
    tx(160, 30, 'população original', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', B);
    tx(500, 30, 'ilha nova', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', B);
    var pO = nuvem(40, 160, 150, 112, 78), corO = pO.map(function (p, i) { return i % 2 ? AA : Aa; });
    pO.forEach(function (p, i) { bola(B, p, corO[i]); });
    var fundI = [1, 4, 6, 8, 10];   /* 1 alelo A (impar) e 4 alelo a (pares) */
    var fund = fundI.map(function (i) { return bola(B, pO[i], corO[i]); });
    var destF = nuvem(5, 500, 150, 40, 30);
    var pI = nuvem(30, 500, 150, 92, 68, destF), ilha = pI.map(function (p, i) { return bola(B, p, i % 5 === 0 ? AA : Aa); });
    var fTo = tx(160, 272, 'alelo a (roxo) = 50%', 'font-size:14px;font-weight:700;fill:' + Aa + ';text-anchor:middle', B);
    var fTi = tx(500, 272, 'alelo a (roxo) = 80%', 'font-size:14px;font-weight:700;fill:' + Aa + ';text-anchor:middle', B);
    /* cena C: gargalo */
    var C = el('g', {});
    var pC = nuvem(40, 200, 150, 170, 92), escura = pC.map(function (p, i) { return i % 4 === 1; });
    var CIN = '#a9a9a9', ESC = '#3a3a3a';
    var fogo = el('rect', { x: 20, y: 46, width: 362, height: 210, rx: 20, style: 'fill:#e0702a;fill-opacity:.22' }, C);
    var bC = pC.map(function (p, i) { return bola(C, p, escura[i] ? ESC : CIN); });
    var fogoT = tx(200, 40, 'incêndio: morte ao acaso', 'font-size:14px;font-weight:700;fill:#c4562a;text-anchor:middle', C);
    var pR = nuvem(40, 520, 150, 100, 92), bR = pR.map(function (p) { return bola(C, p, ESC); });
    K.seta(C, 392, 150, 410, 150, 'var(--lapis)', 2.4);
    var cA = tx(200, 22, 'antes: 25% escuros', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', C);
    var cB = tx(520, 22, 'depois: 100% escuros', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', C);
    var cB2 = tx(520, 272, 'a cor não foi a causa', 'font-size:13.5px;font-weight:700;fill:#b4442f;text-anchor:middle', C);
    var painel = K.painel();
    var _desenha = function (t) {
      var e = K.etapa(t, M);
      op(A, t < 5.6 ? 1 : 1 - cl((t - 5.6) / .2)); op(B, e === 2 ? cl((t - 5.8) / .3) : 0); op(C, e === 3 ? cl((t - 9) / .3) : 0);
      gP.d(Math.round(40 * (e === 0 ? ease((t - .2) / 2.5) : 1))); gG.d(Math.round(40 * (e === 0 ? 0 : e === 1 ? ease((t - 3.1) / 2.2) : 1)));
      op(gG, e >= 1 ? 1 : .35); op(fx1, e === 0 && t > 2 || e > 0 ? 1 : 0); op(fx0, e === 0 && t > 2 || e > 0 ? 1 : 0); op(gT, e >= 1 && t > 4.8 ? 1 : 0);
      /* fundador */
      var u = ease((t - 6.4) / 1.3);
      fund.forEach(function (f, k) { var p0 = pO[fundI[k]], p1 = destF[k]; f.setAttribute('cx', lerp(p0[0], p1[0], u).toFixed(1)); f.setAttribute('cy', lerp(p0[1], p1[1], u).toFixed(1)); f.style.stroke = u > 0 ? '#222' : 'var(--folha)'; });
      ilha.forEach(function (b, k) { op(b, cl((t - 7.9 - k * .02) / .3)); });
      op(fTi, t > 8.3 ? 1 : 0);
      /* gargalo */
      bC.forEach(function (b, k) { op(b, escura[k] ? 1 : 1 - cl((t - 9.9 - k * .01) / .5)); });
      op(fogo, t > 9.5 && t < 10.9 ? 1 : 0); op(fogoT, t > 9.5 ? 1 : 0);
      bR.forEach(function (b, k) { op(b, cl((t - 11 - k * .015) / .3)); });
      op(cB, t > 11.3 ? 1 : 0); op(cB2, t > 11.4 ? 1 : 0);
      var L;
      if (e === 0) L = ['1. Deriva: a frequência muda por sorteio', 'Cada geração herda uma amostra ao acaso dos alelos da anterior. Com só 10', 'indivíduos o sorteio pesa: o alelo A sobe e desce e pode fixar (100%) ou sumir (0%).'];
      else if (e === 1) L = ['2. Na população grande quase não muda', 'Com 500 indivíduos os sorteios se compensam e a frequência fica perto de 50%.', 'Deriva é mudança aleatória da frequência alélica, forte em populações pequenas.'];
      else if (e === 2) L = ['3. Efeito fundador: poucos colonizam', '5 indivíduos chegam a uma ilha levando, por acaso, 80% do alelo a (roxo).', 'A nova população nasce com frequências diferentes da original.'];
      else L = ['4. Gargalo: uma catástrofe sorteia quem fica', 'O incêndio matou 30 dos 40, sem escolher pela cor. Por acaso os 10 que', 'sobraram eram escuros: a cor virou 100% sem dar vantagem nenhuma.'];
      painel(L);
    };
    return fimResposta(VIS.def['deriva-genetica-simulacao'], svg, _desenha, TF, RESP, qid, { congela: function (q) {
      return { W53a94d6: 5.5, Wffc3d5d: 8.8, Webae9a5: 8.8, P24f9856: 12.3 }[q] || TF - .001; } });
  }
};
VIS.liga('deriva-genetica-simulacao', ['W53a94d6', 'Wffc3d5d', 'Webae9a5', 'P24f9856']);
