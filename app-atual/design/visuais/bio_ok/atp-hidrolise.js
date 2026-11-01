/* ATP (adenina + ribose + 3 fosfatos), hidrolise em ADP + Pi + energia, uso da energia e ciclo ATP/ADP. */
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
'W6cab280': [
'Por isso a resposta é A',
'A água solta o último dos três fosfatos: sobram dois presos à',
'adenosina (ADP, adenosina difosfato) e sai um íon fosfato (Pᵢ),',
'liberando energia livre. AMP exigiria perder dois fosfatos.'
]
};
VIS.def['atp-hidrolise'] = {
  tit: 'Hidrólise do ATP: ATP + H₂O → ADP + Pᵢ + energia',
  fontes: ['OpenStax, Biology 2e, 6.4 ATP: Adenosine Triphosphate — https://openstax.org/books/biology-2e/pages/6-4-atp-adenosine-triphosphate', 'Khan Academy, ATP and reaction coupling — https://www.khanacademy.org/science/biology/energy-and-enzymes/atp-reaction-coupling/a/atp-and-reaction-coupling', 'Wikipedia (en), ATP hydrolysis — https://en.wikipedia.org/wiki/ATP_hydrolysis'],
  tipo: 'anim', dur: 13.8,
  marcas: [[0, 'ATP'], [3.4, 'Hidrólise'], [7, 'Trabalho'], [10.4, 'Ciclo ATP/ADP']],
  cred: 'Animação feita para o app (esquema fora de escala; Pᵢ = fosfato inorgânico, o íon fosfato).',
  nota: 'O ATP é a "moeda" de energia da célula: a hidrólise do fosfato da ponta libera energia livre que a célula acopla a trabalhos (contração, transporte ativo, síntese). A respiração celular usa a energia dos alimentos para juntar de novo ADP + Pᵢ em ATP.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
    var ADE = '#2b6cb0', RIB = '#2f855a', FOS = '#c47a12', ENE = '#d4a017', AGU = '#2b6cb0';
    svg.setAttribute('viewBox', '0 0 640 350');
    var T = [0, 3.4, 7, 10.4], TF = 13.8;
    function poli(pts, cor, pai) { return el('path', { d: 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L') + ' Z', style: 'fill:color-mix(in srgb,' + cor + ' 16%,var(--folha));stroke:' + cor + ';stroke-width:2;stroke-linejoin:round' }, pai); }
    function reg(cx, cy, r, n, a0) { var p = []; for (var i = 0; i < n; i++) { var a = a0 + i * 2 * Math.PI / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return p; }

    /* ---------- molecula (etapas 1 e 2) ---------- */
    var gM = el('g', {});
    var hex = reg(90, 104, 24, 6, -Math.PI / 2);
    poli(hex, ADE, gM);
    poli([[110.8, 92], [110.8, 116], [133.6, 123.4], [147.7, 104], [133.6, 84.6]], ADE, gM);
    tx(118, 152, 'adenina', 'font-size:14px;font-weight:700;fill:' + ADE + ';text-anchor:middle', gM);
    poli(reg(198, 132, 24, 5, -Math.PI / 2), RIB, gM);
    el('path', { d: 'M147.7 104 L175 124 M220.8 124.6 L263 112', style: 'stroke:var(--tinta);stroke-width:2' }, gM);
    tx(198, 170, 'ribose', 'font-size:14px;font-weight:700;fill:' + RIB + ';text-anchor:middle', gM);
    var PX = [285, 355, 425], fos = [];
    el('path', { d: 'M307 110 H333', style: 'stroke:var(--tinta);stroke-width:2.4' }, gM);
    var lig3 = el('path', { d: 'M377 110 H403', style: 'stroke:var(--tinta);stroke-width:2.4' }, gM);
    PX.forEach(function (x, i) {
      var g = el('g', {}, gM);
      el('circle', { cx: 0, cy: 0, r: 22, style: 'fill:color-mix(in srgb,' + FOS + ' 22%,var(--folha));stroke:' + FOS + ';stroke-width:2' }, g);
      tx(0, 6, 'P', 'font-size:17px;font-weight:700;fill:#8a560b;text-anchor:middle', g);
      mv(g, x, 110); fos.push(g);
    });
    var pi = tx(0, 0, 'íon fosfato (Pᵢ)', 'font-size:14px;font-weight:700;fill:#8a560b;text-anchor:middle');
    var brA = el('g', {}, gM);
    el('path', { d: 'M62 62 V52 H222 V62', style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, brA);
    tx(142, 40, 'adenosina', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', brA);
    var brT = el('g', {}, gM), brD = el('g', {}, gM);
    el('path', { d: 'M262 76 V66 H448 V76', style: 'fill:none;stroke:' + FOS + ';stroke-width:1.5' }, brT);
    tx(355, 54, 'trifosfato (3 P)', 'font-size:15px;font-weight:700;fill:#8a560b;text-anchor:middle', brT);
    el('path', { d: 'M262 76 V66 H378 V76', style: 'fill:none;stroke:' + FOS + ';stroke-width:1.5' }, brD);
    tx(320, 54, 'difosfato (2 P)', 'font-size:15px;font-weight:700;fill:#8a560b;text-anchor:middle', brD);
    var nomeM = tx(560, 72, 'ATP', 'font-size:28px;font-weight:700;fill:var(--tinta);text-anchor:middle', gM);
    var agua = tx(0, 0, 'H₂O', 'font-size:17px;font-weight:700;fill:' + AGU + ';text-anchor:middle', gM);
    var raio = el('g', {}, gM);
    for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; el('path', { d: 'M' + (408 + 11 * Math.cos(a)).toFixed(1) + ' ' + (110 + 11 * Math.sin(a)).toFixed(1) + ' L' + (408 + 25 * Math.cos(a)).toFixed(1) + ' ' + (110 + 25 * Math.sin(a)).toFixed(1), style: 'stroke:' + ENE + ';stroke-width:3;stroke-linecap:round' }, raio); }
    var eneT = tx(392, 166, 'energia liberada', 'font-size:14px;font-weight:700;fill:#9a7212;text-anchor:middle', gM);
    var eq = el('g', {}, gM);
    el('rect', { x: 120, y: 178, width: 400, height: 28, rx: 8, style: 'fill:color-mix(in srgb,var(--ad-c) 10%,var(--folha))' }, eq);
    tx(320, 198, 'ATP + H₂O → ADP + Pᵢ + energia', 'font-size:16px;font-weight:700;fill:var(--tinta);text-anchor:middle', eq);

    /* ---------- etapa 3: trabalho ---------- */
    var g3 = el('g', {});
    el('circle', { cx: 120, cy: 110, r: 46, style: 'fill:color-mix(in srgb,' + ENE + ' 18%,var(--folha));stroke:' + ENE + ';stroke-width:2' }, g3);
    tx(120, 106, 'energia', 'font-size:15px;font-weight:700;fill:#8a6a0f;text-anchor:middle', g3);
    tx(120, 124, 'do ATP', 'font-size:14px;fill:#8a6a0f;text-anchor:middle', g3);
    var USOS = [['contração muscular', 'proteínas do músculo deslizam', 40], ['transporte ativo', 'bombas levam íons contra o gradiente', 110], ['síntese de moléculas', 'montar proteínas, DNA, glicogênio', 180]];
    var usoG = USOS.map(function (u) {
      var g = el('g', {}, g3);
      el('path', { d: 'M168 110 Q210 110 ' + 246 + ' ' + u[2] + ' m-8 -5 l8 5 l-8 5', style: 'fill:none;stroke:' + ENE + ';stroke-width:2' }, g);
      el('rect', { x: 254, y: u[2] - 26, width: 370, height: 50, rx: 10, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' }, g);
      tx(270, u[2] - 5, u[0], 'font-size:15px;font-weight:700;fill:var(--tinta)', g);
      tx(270, u[2] + 14, u[1], 'font-size:13.5px;fill:var(--lapis)', g);
      return g;
    });

    /* ---------- etapa 4: ciclo ---------- */
    var g4 = el('g', {});
    el('rect', { x: 262, y: 18, width: 116, height: 40, rx: 10, style: 'fill:color-mix(in srgb,' + FOS + ' 18%,var(--folha));stroke:' + FOS + ';stroke-width:2' }, g4);
    tx(320, 45, 'ATP', 'font-size:20px;font-weight:700;fill:#8a560b;text-anchor:middle', g4);
    el('rect', { x: 248, y: 152, width: 144, height: 40, rx: 10, style: 'fill:color-mix(in srgb,' + FOS + ' 10%,var(--folha));stroke:' + FOS + ';stroke-width:2' }, g4);
    tx(320, 179, 'ADP + Pᵢ', 'font-size:20px;font-weight:700;fill:#8a560b;text-anchor:middle', g4);
    el('path', { d: 'M384 40 C470 50 470 160 398 170 m4 -10 l-4 10 l10 3', style: 'fill:none;stroke:' + ENE + ';stroke-width:3' }, g4);
    el('path', { d: 'M242 172 C170 160 170 50 256 40 m-10 -4 l10 4 l-8 7', style: 'fill:none;stroke:#2f855a;stroke-width:3' }, g4);
    tx(470, 92, 'hidrólise:', 'font-size:14.5px;font-weight:700;fill:#9a7212', g4);
    tx(470, 110, 'libera energia', 'font-size:14px;fill:var(--tinta)', g4);
    tx(470, 128, 'para o trabalho', 'font-size:14px;fill:var(--tinta)', g4);
    tx(170, 92, 'síntese de ATP:', 'font-size:14.5px;font-weight:700;fill:#2f855a;text-anchor:end', g4);
    tx(170, 110, 'gasta energia vinda', 'font-size:14px;fill:var(--tinta);text-anchor:end', g4);
    tx(170, 128, 'da respiração celular', 'font-size:14px;fill:var(--tinta);text-anchor:end', g4);
    var bolaC = el('circle', { r: 7, style: 'fill:' + FOS }, g4);

    /* ---------- painel ---------- */
    el('line', { x1: 12, x2: 628, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 240, '', 'font-size:15px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 265 + 23 * j, '', 'font-size:14.5px;fill:var(--tinta)'));
    var TXT = [
      ['1. O que é o ATP', 'Adenosina trifosfato: uma adenina e uma ribose (juntas, a adenosina)', 'presas a uma fileira de três fosfatos.', 'É um nucleotídeo, parente dos que formam o RNA.'],
      ['2. Hidrólise: a água solta o último fosfato', 'Uma molécula de água rompe a ligação do fosfato da ponta.', 'Ficam dois fosfatos presos: ADP (adenosina difosfato).', 'Sai um íon fosfato (Pᵢ) e é liberada energia livre.'],
      ['3. Para que serve essa energia', 'A célula acopla a hidrólise do ATP a trabalhos que sozinhos', 'não aconteceriam: contrair o músculo, bombear íons contra o gradiente', '(transporte ativo) e montar moléculas grandes.'],
      ['4. O ciclo ATP ⇄ ADP', 'O ADP + Pᵢ voltam a formar ATP com energia da respiração celular', '(glicólise, Krebs e cadeia respiratória). Assim o mesmo "estoque"', 'de ATP é gasto e refeito o tempo todo.']
    ];
    var _desenha = function (t) {
      var f = t < T[1] ? 0 : t < T[2] ? 1 : t < T[3] ? 2 : 3;
      op(gM, f < 2 ? 1 : 0); op(g3, f === 2 ? cl((t - T[2]) / .4) : 0); op(g4, f === 3 ? cl((t - T[3]) / .4) : 0);
      /* etapa 1: monta */
      fos.forEach(function (g, i) { op(g, cl((t - .5 - .35 * i) / .3)); });
      op(brA, cl((t - 1.5) / .4)); op(brT, f === 0 ? cl((t - 1.9) / .4) : 0);
      /* etapa 2: agua chega, ligacao rompe, P sai */
      var ua = ease((t - T[1] - .2) / 1), uq = ease((t - T[1] - 1.4) / 1.2);
      agua.setAttribute('x', 392); agua.setAttribute('y', lerp(200, 150, ua).toFixed(1));
      op(agua, f === 1 && t < T[1] + 1.5 ? cl((t - T[1]) / .3) : 0);
      op(lig3, f === 0 || t < T[1] + 1.3 ? 1 : 0);
      mv(fos[2], lerp(425, 520, f === 1 ? uq : 0), lerp(110, 118, f === 1 ? uq : 0));
      pi.setAttribute('x', 520); pi.setAttribute('y', 160); op(pi, f === 1 && uq > .95 ? 1 : 0);
      var ur = f === 1 ? cl((t - T[1] - 1.3) / .5) : 0; op(raio, ur > 0 && ur < 1 ? 1 - ur * .3 : f === 1 && t > T[1] + 1.8 ? .7 : 0);
      op(eneT, f === 1 && t > T[1] + 1.6 ? 1 : 0);
      op(brD, f === 1 && t > T[1] + 2.2 ? 1 : 0);
      nomeM.textContent = f === 1 && t > T[1] + 2.2 ? 'ADP + Pᵢ' : 'ATP';
      nomeM.setAttribute('x', f === 1 && t > T[1] + 2.2 ? 560 : 540); nomeM.setAttribute('y', f === 1 && t > T[1] + 2.2 ? 60 : 72);
      nomeM.style.fontSize = f === 1 && t > T[1] + 2.2 ? '22px' : '28px';
      op(eq, f === 1 && t > T[1] + 2.4 ? 1 : 0);
      /* etapa 3 */
      usoG.forEach(function (g, i) { op(g, cl((t - T[2] - .3 - .5 * i) / .4)); });
      /* etapa 4: bolinha girando no ciclo */
      var w = ((t - T[3]) / 2.4) % 1, ang = -Math.PI / 2 + w * 2 * Math.PI;
      bolaC.setAttribute('cx', (320 + 130 * Math.cos(ang)).toFixed(1)); bolaC.setAttribute('cy', (105 + 70 * Math.sin(ang)).toFixed(1));
      op(bolaC, f === 3 ? 1 : 0);
      var L = TXT[f];
      for (var j = 0; j < 4; j++) P[j].textContent = L[j];
    };
    return fimResposta(VIS.def['atp-hidrolise'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return T[2] - .2; }
    });
  }
};
VIS.liga('atp-hidrolise', ['W6cab280']);
