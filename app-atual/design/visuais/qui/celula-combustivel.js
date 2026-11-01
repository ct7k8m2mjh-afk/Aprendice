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
'P57012ff': [
'Por isso a resposta é A',
'No polo positivo (cátodo) acontece a redução: quem reduz é o O₂.',
'O carbono vai de −2 (CH₃OH) a +4 (CO₂): perde 6 elétrons.',
'Cada mol de CO₂ formado envolve 6 mol de elétrons.'
]
};
VIS.def['celula-combustivel'] = {
  tit: 'Célula a combustível de metanol',
  fontes: ['OpenStax, Chemistry 2e, 17.5 Batteries and Fuel Cells — https://openstax.org/books/chemistry-2e/pages/17-5-batteries-and-fuel-cells', 'Wikipedia (en), Direct methanol fuel cell (semirreações no ânodo e no cátodo) — https://en.wikipedia.org/wiki/Direct_methanol_fuel_cell', 'IUPAC Gold Book, oxidation state — https://goldbook.iupac.org/terms/view/O04365'],
  tipo: 'anim', dur: 12,
  marcas: [[0, 'A célula'], [3, 'Polos'], [6, 'Nox do C'], [9, 'Conferência']],
  cred: 'Animação feita para o app (esquema de célula com membrana que conduz H⁺; fora de escala). Nox e balanço calculados no código.',
  nota: 'Célula a combustível é uma pilha alimentada sem parar: o combustível (H₂, metanol) se oxida no ânodo, polo negativo, e o O₂ se reduz no cátodo, polo positivo. Os elétrons passam pelo circuito externo; os íons atravessam o eletrólito.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function sg(n) { return (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n); }
    var OX = '#c0392b', RD = '#2b6cb0', EL = '#d4a017', HP = '#7a4fa0';
    svg.setAttribute('viewBox', '0 0 640 370');
    var D = 3;
    /* nox do C pela soma zero: H = +1, O = -2 */
    function noxC(c, h, o) { return -(h * 1 + o * -2) / c; }
    var nM = noxC(1, 4, 1), nC = noxC(1, 0, 2), ne = nC - nM;
    /* balanco da semirreacao do anodo: CH3OH + H2O -> CO2 + 6 H+ + 6 e- */
    var esq = { C: 1, H: 4 + 2, O: 1 + 1, q: 0 }, dir = { C: 1, H: ne, O: 2, q: ne * 1 - ne };
    /* ======== celula ======== */
    var cel = el('g', {});
    var AX = 186, CX = 454, TOP = 92, BOT = 210;
    el('rect', { x: 126, y: TOP, width: 388, height: BOT - TOP, rx: 8, style: 'fill:color-mix(in srgb,var(--ad-c) 4%,var(--folha));stroke:var(--tinta);stroke-width:2' }, cel);
    el('rect', { x: AX - 8, y: TOP, width: 16, height: BOT - TOP, style: 'fill:#5d6368' }, cel);
    el('rect', { x: CX - 8, y: TOP, width: 16, height: BOT - TOP, style: 'fill:#5d6368' }, cel);
    el('rect', { x: 306, y: TOP, width: 28, height: BOT - TOP, style: 'fill:color-mix(in srgb,' + HP + ' 18%,var(--folha));stroke:' + HP + ';stroke-width:1.2;stroke-dasharray:4 3' }, cel);
    tx(320, BOT - 8, 'membrana', 'font-size:14px;fill:' + HP + ';text-anchor:middle', cel);
    /* circuito externo */
    el('path', { d: 'M' + AX + ' ' + TOP + ' V46 H296 M344 46 H' + CX + ' V' + TOP, style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, cel);
    el('circle', { cx: 320, cy: 46, r: 22, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:2' }, cel);
    tx(320, 51, 'motor', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', cel);
    var ES = []; for (var k = 0; k < 6; k++) ES.push(el('circle', { r: 4.5, style: 'fill:' + EL + ';stroke:#8a6a00;stroke-width:1' }, cel));
    tx(232, 38, 'e⁻ →', 'font-size:15px;font-weight:700;fill:#8a6a00;text-anchor:middle', cel);
    /* polos */
    var polA = el('g', {}, cel), polC = el('g', {}, cel);
    tx(AX - 14, 70, 'ânodo (−)', 'font-size:15px;font-weight:700;fill:' + OX + ';text-anchor:end', polA);
    tx(AX - 14, 86, 'oxidação', 'font-size:14px;fill:' + OX + ';text-anchor:end', polA);
    tx(CX + 14, 70, 'cátodo (+)', 'font-size:15px;font-weight:700;fill:' + RD, polC);
    tx(CX + 14, 86, 'redução', 'font-size:14px;fill:' + RD, polC);
    /* entradas e saidas */
    function seta(x1, y1, x2, y2, cor, pai) { var a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a); return el('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x2 - 8 * c + 5 * s).toFixed(1) + ' ' + (y2 - 8 * s - 5 * c).toFixed(1) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - 8 * c - 5 * s).toFixed(1) + ' ' + (y2 - 8 * s + 5 * c).toFixed(1), style: 'fill:none;stroke:' + cor + ';stroke-width:2.2' }, pai); }
    seta(16, 140, 170, 140, 'var(--tinta)', cel); tx(16, 114, 'CH₃OH', 'font-size:15px;font-weight:700;fill:var(--tinta)', cel); tx(16, 131, '+ H₂O', 'font-size:15px;font-weight:700;fill:var(--tinta)', cel);
    seta(170, 190, 16, 190, 'var(--tinta)', cel); tx(16, 182, 'CO₂', 'font-size:15px;font-weight:700;fill:var(--tinta)', cel);
    seta(624, 140, 470, 140, 'var(--tinta)', cel); tx(624, 131, 'O₂', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:end', cel);
    seta(470, 190, 624, 190, 'var(--tinta)', cel); tx(624, 182, 'H₂O', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:end', cel);
    var HS = []; for (k = 0; k < 3; k++) HS.push(tx(0, 0, 'H⁺', 'font-size:15px;font-weight:700;fill:' + HP + ';text-anchor:middle', cel));
    tx(250, 112, 'CH₃OH', 'font-size:14px;fill:var(--lapis);text-anchor:middle', cel);
    tx(392, 112, 'O₂', 'font-size:14px;fill:var(--lapis);text-anchor:middle', cel);
    /* ======== semirreacoes (etapa 2) ======== */
    var sr = el('g', {});
    /* ======== nox (etapa 3) ======== */
    var nx = el('g', {});
    el('rect', { x: 8, y: 30, width: 624, height: 188, rx: 10, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1' }, nx);
    function molecula(x, y, nome, pai) {
      var g = el('g', {}, pai);
      if (nome === 'm') {   /* metanol: C tetraedrico com 3 H e OH */
        el('path', { d: 'M' + x + ' ' + y + ' h46 M' + x + ' ' + y + ' v-34 M' + x + ' ' + y + ' v34 M' + x + ' ' + y + ' h-34 M' + (x + 46) + ' ' + y + ' l24 -22', style: 'stroke:var(--tinta);stroke-width:2' }, g);
        tx(x, y + 6, 'C', 'font-size:18px;font-weight:700;fill:var(--tinta);text-anchor:middle;paint-order:stroke;stroke:var(--folha);stroke-width:8px', g);
        [[x, y - 40], [x, y + 50], [x - 42, y + 6]].forEach(function (p) { tx(p[0], p[1], 'H', 'font-size:16px;fill:var(--tinta);text-anchor:middle;paint-order:stroke;stroke:var(--folha);stroke-width:8px', g); });
        tx(x + 46, y + 6, 'O', 'font-size:18px;font-weight:700;fill:' + OX + ';text-anchor:middle;paint-order:stroke;stroke:var(--folha);stroke-width:8px', g);
        tx(x + 76, y - 22, 'H', 'font-size:16px;fill:var(--tinta);text-anchor:middle;paint-order:stroke;stroke:var(--folha);stroke-width:8px', g);
      } else {             /* CO2 linear, O=C=O */
        el('path', { d: 'M' + (x - 46) + ' ' + (y - 3) + ' H' + (x + 46) + ' M' + (x - 46) + ' ' + (y + 3) + ' H' + (x + 46), style: 'stroke:var(--tinta);stroke-width:2' }, g);
        tx(x, y + 6, 'C', 'font-size:18px;font-weight:700;fill:var(--tinta);text-anchor:middle;paint-order:stroke;stroke:var(--folha);stroke-width:8px', g);
        tx(x - 48, y + 6, 'O', 'font-size:18px;font-weight:700;fill:' + OX + ';text-anchor:middle;paint-order:stroke;stroke:var(--folha);stroke-width:8px', g);
        tx(x + 48, y + 6, 'O', 'font-size:18px;font-weight:700;fill:' + OX + ';text-anchor:middle;paint-order:stroke;stroke:var(--folha);stroke-width:8px', g);
      }
      return g;
    }
    tx(80, 56, 'CH₃OH', 'font-size:16px;font-weight:700;fill:var(--tinta);text-anchor:middle', nx);
    molecula(80, 118, 'm', nx);
    tx(80, 196, 'C: x + 4(+1) + (−2) = 0', 'font-size:14px;fill:var(--tinta);text-anchor:middle', nx);
    tx(80, 214, 'C = ' + sg(nM), 'font-size:15px;font-weight:700;fill:' + OX + ';text-anchor:middle', nx);
    tx(560, 56, 'CO₂', 'font-size:16px;font-weight:700;fill:var(--tinta);text-anchor:middle', nx);
    molecula(560, 118, 'c', nx);
    tx(560, 196, 'C: x + 2(−2) = 0', 'font-size:14px;fill:var(--tinta);text-anchor:middle', nx);
    tx(560, 214, 'C = ' + sg(nC), 'font-size:15px;font-weight:700;fill:' + RD + ';text-anchor:middle', nx);
    /* reta de nox */
    function XN(n) { return 190 + (n + 3) * 34; }
    el('line', { x1: XN(-3), x2: XN(5), y1: 120, y2: 120, style: 'stroke:var(--tinta);stroke-width:1.6' }, nx);
    for (var n = -3; n <= 5; n++) { el('line', { x1: XN(n), x2: XN(n), y1: 114, y2: 126, style: 'stroke:var(--tinta);stroke-width:1.4' }, nx); tx(XN(n), 144, sg(n), 'font-size:14px;fill:var(--tinta);text-anchor:middle', nx); }
    var PUL = []; for (k = 0; k < ne; k++) { var g = el('g', {}, nx); el('path', { d: 'M' + XN(nM + k) + ' 112 Q' + ((XN(nM + k) + XN(nM + k + 1)) / 2) + ' 88 ' + XN(nM + k + 1) + ' 112', style: 'fill:none;stroke:' + OX + ';stroke-width:2' }, g); tx((XN(nM + k) + XN(nM + k + 1)) / 2, 86, 'e⁻', 'font-size:14px;font-weight:700;fill:' + OX + ';text-anchor:middle', g); PUL.push(g); }
    var cont = tx(XN(1), 182, '', 'font-size:16px;font-weight:700;fill:var(--ad-t);text-anchor:middle', nx);
    /* ======== conferencia (etapa 4) ======== */
    var cf = el('g', {});
    el('rect', { x: 8, y: 30, width: 624, height: 188, rx: 10, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1' }, cf);
    tx(320, 70, 'CH₃OH + H₂O → CO₂ + ' + ne + ' H⁺ + ' + ne + ' e⁻', 'font-size:18px;font-weight:700;fill:' + OX + ';text-anchor:middle', cf);
    tx(320, 104, '(3/2) O₂ + ' + ne + ' H⁺ + ' + ne + ' e⁻ → 3 H₂O', 'font-size:18px;font-weight:700;fill:' + RD + ';text-anchor:middle', cf);
    el('line', { x1: 150, x2: 490, y1: 118, y2: 118, style: 'stroke:var(--tinta);stroke-width:1.4' }, cf);
    tx(320, 144, 'CH₃OH + (3/2) O₂ → CO₂ + 2 H₂O', 'font-size:18px;font-weight:700;fill:var(--tinta);text-anchor:middle', cf);
    var bal = ['C', 'H', 'O'].map(function (a) { return a + ' ' + esq[a] + ' = ' + dir[a]; }).join(' · ') + ' · carga ' + esq.q + ' = ' + (ne > 0 ? '+' + ne : ne) + ' − ' + ne;
    tx(320, 182, 'ânodo, conferindo: ' + bal, 'font-size:15px;fill:var(--tinta);text-anchor:middle', cf);
    tx(320, 206, 'os ' + ne + ' e⁻ que o ânodo solta são os ' + ne + ' e⁻ que o O₂ recebe no cátodo', 'font-size:15px;fill:var(--lapis);text-anchor:middle', cf);
    /* ======== painel ======== */
    el('line', { x1: 16, x2: 624, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.2' });
    var p0 = tx(16, 268, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)'), P = [292, 316, 340, 364].map(function (y) { return tx(16, y, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['Uma pilha que recebe combustível sem parar', 'Metanol e água entram de um lado; O₂ entra do outro.', 'Os elétrons passam pelo circuito externo (fazem o motor girar)', 'e os íons H⁺ atravessam a membrana. Saem CO₂ e H₂O.'],
      ['Quem fica em cada polo', 'O combustível se oxida e solta elétrons: é o ânodo, polo negativo.', 'O O₂ recebe os elétrons e se reduz: é o cátodo, polo positivo.', 'Elétrons saem do polo − e chegam ao polo +.'],
      ['Contando elétrons pelo nox do carbono', 'H = +1 e O = −2; a soma numa molécula neutra é zero.', 'No CH₃OH o C tem nox ' + sg(nM) + '; no CO₂, ' + sg(nC) + '.', 'Subiu ' + ne + ' unidades: cada C perde ' + ne + ' elétrons (oxidação).'],
      ['Conferindo pelas semirreações', 'No ânodo, cada CH₃OH vira 1 CO₂ e solta ' + ne + ' e⁻.', 'No cátodo, o O₂ recebe esses ' + ne + ' e⁻ junto com ' + ne + ' H⁺.', 'Logo, 1 mol de CO₂ formado envolve ' + ne + ' mol de elétrons.']
    ];
    var _desenha = function (t) {
      var i = Math.min(3, Math.floor(t / D)), u = t - i * D;
      op(nx, i === 2 ? 1 : 0); op(cf, i === 3 ? 1 : 0); op(cel, i < 2 ? 1 : 0);
      op(polA, i === 1 ? 1 : i === 0 ? .25 : 0); op(polC, i === 1 ? 1 : i === 0 ? .25 : 0);
      var path = [[AX, TOP], [AX, 46], [296, 46], [344, 46], [CX, 46], [CX, TOP]], L = [46, 110, 48, 110, 46], tot = 360;
      ES.forEach(function (e, j) {
        var d = ((t * 110 + j * tot / ES.length) % tot), k = 0; while (k < L.length - 1 && d > L[k]) { d -= L[k]; k++; }
        var a = path[k], b = path[k + 1], f = Math.min(1, d / L[k]);
        e.setAttribute('cx', (a[0] + (b[0] - a[0]) * f).toFixed(1)); e.setAttribute('cy', (a[1] + (b[1] - a[1]) * f).toFixed(1)); op(e, k === 2 ? 0 : 1);
      });
      HS.forEach(function (h, j) { var f = (t * .35 + j / 3) % 1; h.setAttribute('x', (214 + 212 * f).toFixed(1)); h.setAttribute('y', 140 + 18 * j); op(h, Math.sin(Math.PI * f)); });
      var nP = i === 2 ? Math.min(ne, Math.floor(cl((u - .4) / 2) * ne + (u > 2.4 ? 1 : 0))) : ne;
      PUL.forEach(function (p, k) { op(p, k < nP ? 1 : 0); });
      cont.textContent = nP > 0 ? sg(nM) + ' → ' + sg(nM + nP) + ': ' + nP + ' e⁻ perdido' + (nP > 1 ? 's' : '') : '';
      var Lx = TXT[i]; p0.textContent = Lx[0]; P.forEach(function (q, j) { q.textContent = Lx[j + 1] || ''; });
    };
    return fimResposta(VIS.def['celula-combustivel'], svg, _desenha, 4 * D, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function () { return 3 * D - .05; }
    });
  }
};
VIS.liga('celula-combustivel', ['P57012ff']);
