/* Orgaos homologos (membro anterior de humano, golfinho, morcego e ave: mesmos ossos, mesma origem) x analogos
   (asa de inseto sem ossos x asa de vertebrado) e convergencia (golfinho x tubarao). Lote bio 9. */
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
'W295d3f2': ['Por isso a resposta é B',
  'Asa de morcego: ossos do braço e da mão. Asa de inseto:',
  'expansão da parede do corpo, sem osso. Mesma função,',
  'origem diferente = órgãos análogos.'],
'W5d07126': ['Por isso a resposta é A',
  'Nadadeira do golfinho e asa do morcego têm os mesmos',
  'ossos (úmero, rádio, ulna, carpos, falanges): mesma origem,',
  'funções diferentes = órgãos homólogos.'],
'W45b76a9': ['Por isso a resposta é A',
  'Golfinho (mamífero) e tubarão (peixe cartilaginoso) são',
  'parentes distantes; a vida na água selecionou formas',
  'parecidas nos dois: evolução convergente.'],
'Wbda6568': ['Por isso a resposta é D',
  'I e II estão certas. III erra: asa de inseto (sem osso) e',
  'asa de ave (membro com ossos) têm origens diferentes,',
  'então são análogas, não homólogas.'],
'Wea6948d': ['Por isso a resposta é D',
  'Asa de ave e asa de morcego são o mesmo membro anterior',
  'de vertebrado: mesmos ossos, herdados de um ancestral',
  'comum. Os outros pares misturam grupos sem essa herança.']
};
VIS.def['homologia-analogia'] = {
  tit: 'Homólogos têm a mesma origem; análogos, só a mesma função',
  fontes: ['OpenStax, Biology 2e, 18.1 Understanding Evolution, Evidence of Evolution: Anatomy and Embryology (estruturas homólogas: ossos do membro anterior de humano, cão, ave e baleia; semelhanças por evolução convergente, como as asas de insetos e de aves) — https://openstax.org/books/biology-2e/pages/18-1-understanding-evolution',
    'Wikipedia (en), Homology (biology) — https://en.wikipedia.org/wiki/Homology_(biology)',
    'Wikipedia (en), Convergent evolution (golfinhos e tubarões, formas hidrodinâmicas parecidas) — https://en.wikipedia.org/wiki/Convergent_evolution'],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. Ossos'], [3, '2. Homólogos'], [6, '3. Análogos'], [9, '4. Golfinho']],
  cred: 'Animação feita para o app (esquemas fora de escala; ossos simplificados).',
  nota: 'Homologia = mesma origem (herança de um ancestral comum), mesmo com funções diferentes. Analogia = mesma função com origens diferentes. Convergência é o processo que produz analogias; divergência é o que produz homólogos com funções diferentes.',
  monta: function (svg, qid) {
    var K = kit(svg), el = K.el, tx = K.tx, cl = K.cl, ease = K.ease, lerp = K.lerp, op = K.op;
    svg.setAttribute('viewBox', '0 0 640 354');
    var M = [0, 3, 6, 9], TF = 12;
    var U = '#c0504d', RU = '#d99a2b', CP = '#3f7fbf', FL = '#4f9a4f', PELE = 'color-mix(in srgb,#9aa0a6 18%,var(--folha))', PL = '#9aa0a6';
    function os(pai, x1, y1, x2, y2, w, c) { return el('line', { x1: x1, y1: y1, x2: x2, y2: y2, style: 'stroke:' + c + ';stroke-width:' + w + ';stroke-linecap:round' }, pai); }
    function carpos(pai, x, y, n) { for (var k = 0; k < n; k++) el('circle', { cx: x - (n - 1) * 3.5 + k * 7, cy: y + (k % 2) * 4, r: 3.6, style: 'fill:' + CP }, pai); }
    function dedo(pai, x0, y0, x1, y1, n, w) { for (var k = 0; k < n; k++) { var a = k / n, b = (k + .8) / n; os(pai, lerp(x0, x1, a), lerp(y0, y1, a), lerp(x0, x1, b), lerp(y0, y1, b), w, FL); } }
    function humano(pai, cx, y) {
      os(pai, cx, y, cx, y + 68, 9, U); os(pai, cx - 5, y + 76, cx - 8, y + 132, 5, RU); os(pai, cx + 5, y + 76, cx + 7, y + 132, 5, RU);
      carpos(pai, cx, y + 140, 4);
      [[-20, 0], [-10, 2], [0, 4], [10, 2], [19, -6]].forEach(function (d, k) { dedo(pai, cx + d[0] * .3, y + 150, cx + d[0], y + 196 + d[1] - (k === 4 ? 14 : 0), k === 4 ? 2 : 3, 3.4); });
    }
    function golfinho(pai, cx, y) {
      el('path', { d: 'M' + (cx - 16) + ' ' + (y - 4) + ' C' + (cx - 34) + ' ' + (y + 60) + ' ' + (cx - 30) + ' ' + (y + 150) + ' ' + (cx + 4) + ' ' + (y + 196) + ' C' + (cx + 34) + ' ' + (y + 140) + ' ' + (cx + 30) + ' ' + (y + 40) + ' ' + (cx + 16) + ' ' + (y - 4) + ' Z', style: 'fill:' + PELE + ';stroke:' + PL + ';stroke-width:1.5' }, pai);
      os(pai, cx, y + 4, cx, y + 34, 13, U); os(pai, cx - 6, y + 42, cx - 7, y + 66, 8, RU); os(pai, cx + 6, y + 42, cx + 7, y + 66, 8, RU);
      carpos(pai, cx, y + 74, 4);
      [[-15, 132], [-6, 180], [2, 188], [10, 172], [16, 140]].forEach(function (d) { dedo(pai, cx + d[0] * .5, y + 86, cx + d[0], y + d[1], 6, 3.6); });
    }
    function morcego(pai, cx, y) {
      el('path', { d: 'M' + cx + ' ' + y + ' L' + (cx - 34) + ' ' + (y + 132) + ' L' + (cx - 78) + ' ' + (y + 204) + ' Q' + (cx - 52) + ' ' + (y + 196) + ' ' + (cx - 38) + ' ' + (y + 212) + ' Q' + (cx - 20) + ' ' + (y + 196) + ' ' + (cx - 2) + ' ' + (y + 206) + ' Q' + (cx + 10) + ' ' + (y + 186) + ' ' + (cx + 30) + ' ' + (y + 188) + ' Q' + (cx + 22) + ' ' + (y + 120) + ' ' + (cx + 10) + ' ' + y + ' Z', style: 'fill:' + PELE + ';stroke:' + PL + ';stroke-width:1.5' }, pai);
      os(pai, cx, y, cx - 8, y + 48, 8, U); os(pai, cx - 10, y + 56, cx - 32, y + 124, 5, RU); os(pai, cx - 4, y + 58, cx - 22, y + 112, 2.4, RU);
      carpos(pai, cx - 34, y + 132, 3);
      dedo(pai, cx - 38, y + 134, cx - 46, y + 146, 2, 3);
      [[-78, 204], [-38, 212], [-2, 206], [30, 188]].forEach(function (d) { dedo(pai, cx - 34, y + 140, cx + d[0], y + d[1], 4, 2.6); });
    }
    function ave(pai, cx, y) {
      el('path', { d: 'M' + (cx + 2) + ' ' + y + ' L' + (cx + 4) + ' ' + (y + 214) + ' Q' + (cx + 30) + ' ' + (y + 196) + ' ' + (cx + 46) + ' ' + (y + 150) + ' Q' + (cx + 44) + ' ' + (y + 70) + ' ' + (cx + 22) + ' ' + (y + 6) + ' Z', style: 'fill:' + PELE + ';stroke:' + PL + ';stroke-width:1.5' }, pai);
      [0, 1, 2, 3, 4].forEach(function (k) { el('path', { d: 'M' + (cx + 6) + ' ' + (y + 120 + k * 20) + ' L' + (cx + 40 - k * 4) + ' ' + (y + 150 + k * 13), style: 'fill:none;stroke:' + PL + ';stroke-width:1.2' }, pai); });
      tx(cx + 24, y + 60, 'penas', 'font-size:13px;fill:var(--lapis);text-anchor:middle', pai);
      os(pai, cx, y, cx, y + 60, 9, U); os(pai, cx - 4, y + 68, cx - 6, y + 128, 5, RU); os(pai, cx + 5, y + 68, cx + 7, y + 128, 3.4, RU);
      carpos(pai, cx, y + 136, 2);
      os(pai, cx, y + 146, cx, y + 186, 6, FL); dedo(pai, cx, y + 190, cx + 2, y + 212, 2, 3.4); dedo(pai, cx - 4, y + 148, cx - 12, y + 162, 1, 3); dedo(pai, cx + 4, y + 186, cx + 10, y + 198, 1, 3);
    }
    /* ===== cena A: quatro membros ===== */
    var A = el('g', {});
    var COL = [{ x: 76, n: 'Humano', f: 'braço: pegar', d: humano }, { x: 236, n: 'Golfinho', f: 'nadadeira: nadar', d: golfinho }, { x: 410, n: 'Morcego', f: 'asa: voar', d: morcego }, { x: 568, n: 'Ave', f: 'asa: voar', d: ave }];
    COL.forEach(function (c, i) {
      c.g = el('g', {}, A);
      tx(c.x, 22, c.n, 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', c.g);
      c.d(c.g, c.x, 40);
      tx(c.x, 272, c.f, 'font-size:13.5px;font-weight:600;fill:var(--lapis);text-anchor:middle', c.g);
    });
    var rot = el('g', {}, A);
    [['úmero', 74, U], ['rádio e ulna', 144, RU], ['carpos', 184, CP], ['falanges', 226, FL]].forEach(function (r) {
      tx(104, r[1], r[0], 'font-size:13px;font-weight:700;fill:' + r[2], rot);
    });
    /* ===== cena B: analogos ===== */
    var B = el('g', {});
    var ins = el('g', {}, B);
    el('path', { d: 'M110 120 C70 40 20 40 26 90 C30 120 80 128 110 126 Z', style: 'fill:color-mix(in srgb,#8fb8d8 25%,var(--folha));stroke:#5f8fb0;stroke-width:1.6' }, ins);
    el('path', { d: 'M110 132 C60 140 30 190 56 200 C80 208 104 160 112 138 Z', style: 'fill:color-mix(in srgb,#8fb8d8 25%,var(--folha));stroke:#5f8fb0;stroke-width:1.6' }, ins);
    ['M108 124 C80 90 50 66 34 70', 'M108 124 C84 104 56 96 30 100', 'M110 136 C90 160 70 182 60 194'].forEach(function (d) { el('path', { d: d, style: 'fill:none;stroke:#5f8fb0;stroke-width:1' }, ins); });
    el('ellipse', { cx: 80, cy: 130, rx: 28, ry: 8, style: 'fill:#9a7a4a' }, ins); el('ellipse', { cx: 120, cy: 128, rx: 16, ry: 10, style: 'fill:#7a5a3a' }, ins); el('circle', { cx: 143, cy: 128, r: 7, style: 'fill:#5a4a3a' }, ins);
    tx(100, 22, 'Inseto', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', B);
    tx(100, 236, 'expansão da parede', 'font-size:13.5px;font-weight:700;fill:#b4442f;text-anchor:middle', B);
    tx(100, 254, 'do corpo, SEM ossos', 'font-size:13.5px;font-weight:700;fill:#b4442f;text-anchor:middle', B);
    var mb = el('g', { transform: 'translate(0 0)' }, B); morcego(mb, 330, 40); tx(320, 22, 'Morcego', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', B);
    var av = el('g', {}, B); ave(av, 520, 40); tx(530, 22, 'Ave', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', B);
    tx(425, 274, 'membro anterior COM os mesmos ossos', 'font-size:13.5px;font-weight:700;fill:#2f7a34;text-anchor:middle', B);
    el('line', { x1: 214, x2: 214, y1: 20, y2: 262, style: 'stroke:var(--linha);stroke-width:1.5;stroke-dasharray:5 4' }, B);
    /* ===== cena C: convergencia ===== */
    var C = el('g', {});
    function corpo(pai, y, tub) {
      el('path', { d: (tub ? 'M60 ' + y + ' C110 ' + (y - 34) : 'M48 ' + (y + 1) + ' L72 ' + (y - 4) + ' C84 ' + (y - 32)) + ' 300 ' + (y - 36) + ' 420 ' + (y - 6) + ' C440 ' + (y - 2) + ' 440 ' + (y + 8) + ' 420 ' + (y + 12) + ' C300 ' + (y + 36) + ' 110 ' + (y + 30) + (tub ? ' 60 ' + y : ' 72 ' + (y + 8) + ' L48 ' + (y + 4)) + ' Z', style: 'fill:' + (tub ? 'color-mix(in srgb,#6a7a8a 30%,var(--folha))' : 'color-mix(in srgb,#5a7aa8 30%,var(--folha))') + ';stroke:' + (tub ? '#4a5a6a' : '#3a5a88') + ';stroke-width:2' }, pai);
      el('path', { d: 'M230 ' + (y - 26) + ' L262 ' + (y - 58) + ' L290 ' + (y - 28), style: 'fill:' + (tub ? 'color-mix(in srgb,#6a7a8a 30%,var(--folha))' : 'color-mix(in srgb,#5a7aa8 30%,var(--folha))') + ';stroke:' + (tub ? '#4a5a6a' : '#3a5a88') + ';stroke-width:2' }, pai);
      el('path', { d: 'M150 ' + (y + 18) + ' L176 ' + (y + 44) + ' L196 ' + (y + 22), style: 'fill:none;stroke:' + (tub ? '#4a5a6a' : '#3a5a88') + ';stroke-width:2' }, pai);
      if (tub) {
        el('path', { d: 'M420 ' + (y + 2) + ' L470 ' + (y - 40) + ' L456 ' + (y + 4) + ' L478 ' + (y + 30) + ' Z', style: 'fill:color-mix(in srgb,#6a7a8a 30%,var(--folha));stroke:#4a5a6a;stroke-width:2' }, pai);
        for (var k = 0; k < 4; k++) el('line', { x1: 112 + k * 8, y1: y - 8, x2: 108 + k * 8, y2: y + 10, style: 'stroke:#4a5a6a;stroke-width:1.6' }, pai);
      } else {
        el('path', { d: 'M420 ' + (y + 2) + ' C450 ' + (y - 4) + ' 470 ' + (y - 6) + ' 482 ' + (y - 10) + ' L478 ' + (y + 2) + ' L482 ' + (y + 14) + ' C470 ' + (y + 10) + ' 450 ' + (y + 8) + ' 420 ' + (y + 4) + ' Z', style: 'fill:color-mix(in srgb,#5a7aa8 30%,var(--folha));stroke:#3a5a88;stroke-width:2' }, pai);
        el('ellipse', { cx: 96, cy: y - 14, rx: 5, ry: 3, style: 'fill:#3a5a88' }, pai);
      }
      el('circle', { cx: 86, cy: y - 2, r: 3, style: 'fill:#222' }, pai);
    }
    corpo(C, 82, false); corpo(C, 206, true);
    tx(500, 68, 'Golfinho', 'font-size:15px;font-weight:700;fill:#3a5a88', C); tx(500, 86, 'mamífero: pulmão,', 'font-size:13px;fill:var(--tinta)', C); tx(500, 102, 'respira o ar', 'font-size:13px;fill:var(--tinta)', C);
    tx(500, 192, 'Tubarão', 'font-size:15px;font-weight:700;fill:#4a5a6a', C); tx(500, 210, 'peixe cartilaginoso:', 'font-size:13px;fill:var(--tinta)', C); tx(500, 226, 'brânquias', 'font-size:13px;fill:var(--tinta)', C);
    tx(250, 141, 'parentes distantes · corpo de torpedo e nadadeiras parecidos', 'font-size:13.5px;font-weight:700;fill:var(--ad-t);text-anchor:middle;paint-order:stroke;stroke:var(--folha);stroke-width:4px', C);
    var painel = K.painel();
    var _desenha = function (t) {
      var e = K.etapa(t, M);
      op(A, e <= 1 ? 1 : 0); op(B, e === 2 ? cl((t - 6) / .3) : 0); op(C, e === 3 ? cl((t - 9) / .3) : 0);
      COL.forEach(function (c, i) { op(c.g, i < 2 ? 1 : e === 1 ? cl((t - 3.2 - (i - 2) * .5) / .4) : .12); });
      op(rot, e === 0 ? 1 : .6);
      var L;
      if (e === 0) L = ['1. Braço e nadadeira: os mesmos ossos', 'Por fora são diferentes. Por dentro têm, na mesma ordem: úmero, rádio e ulna,', 'carpos e falanges. Cada cor é um mesmo osso.'];
      else if (e === 1) L = ['2. Homólogos: mesma origem, função livre', 'Morcego e ave têm o mesmo plano: todos herdaram o membro anterior de um', 'ancestral comum. Funções diferentes não desfazem a homologia (divergência).'];
      else if (e === 2) L = ['3. Análogos: mesma função, origem diferente', 'Asa de inseto e asa de morcego (ou de ave) servem para voar, mas a do inseto', 'não tem osso nenhum: é outra construção. São órgãos análogos.'];
      else L = ['4. Convergência: parecidos sem parentesco próximo', 'Golfinho e tubarão vêm de linhagens separadas há centenas de milhões de anos.', 'A água selecionou formas parecidas nos dois: evolução convergente (analogia).'];
      painel(L);
    };
    return fimResposta(VIS.def['homologia-analogia'], svg, _desenha, TF, RESP, qid, { congela: function (q) {
      return { W295d3f2: 8.9, W5d07126: 5.9, W45b76a9: 11.9, Wbda6568: 8.9, Wea6948d: 5.9 }[q] || TF - .001; } });
  }
};
VIS.liga('homologia-analogia', ['W295d3f2', 'W5d07126', 'W45b76a9', 'Wbda6568', 'Wea6948d']);
