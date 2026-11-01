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
'P2493c19': [
'Por isso a resposta é A',
'A água passa de B (pura) para A (solução) e o nível de A sobe.',
'Para quando o peso da coluna mais alta empurra a água de volta com a',
'mesma força: equilíbrio de pressões. As concentrações não se igualam.'
],
'P6d7b8ac': [
'Por isso a resposta é E',
'Pressão osmótica depende do número de partículas: NaCl 0,15 mol/L',
'dá 0,30 mol/L de íons. KCl 0,15 mol/L também dá 0,30 mol/L.',
'Glicose e sacarose dão 0,15; Na₂SO₄ 0,45; Al₂(SO₄)₃ 0,75.'
],
'Pf3393ca': [
'Por isso a resposta é B',
'Isotônica: volume constante (curva 2). Hipotônica: a água entra',
'e a hemácia incha (curva 1, sobe). Hipertônica: a água sai',
'e ela murcha (curva 3, desce).'
],
'Wb95f5e4': [
'Por isso a resposta é E',
'A água entra na planta pela haste: vai do meio menos concentrado',
'(a água do vaso, hipotônica) para o mais concentrado',
'(a seiva da planta, hipertônica).'
],
'Wf3b30ac': [
'Por isso a resposta é A',
'Soro isotônico, charque (o sal desidrata os micróbios), subida da',
'água nas plantas e peixe marinho em água doce: todos envolvem osmose.',
'Tingir roupa depende da afinidade do corante pela fibra: não é osmose.'
]
};
VIS.def['osmose-tubo-u-hemacia'] = {
  tit: 'Osmose: a água vai para o lado mais concentrado',
  fontes: ['OpenStax, Chemistry 2e, 11.4 Colligative Properties (osmose e pressão osmótica, Π = iMRT) — https://openstax.org/books/chemistry-2e/pages/11-4-colligative-properties', 'OpenStax, Biology 2e, 5.2 Passive Transport (tonicidade, hemácias) — https://openstax.org/books/biology-2e/pages/5-2-passive-transport'],
  tipo: 'anim', dur: 12,
  marcas: [[0, 'Tubo em U'], [3, 'Partículas'], [6, 'Hemácias'], [9, 'Plantas']],
  cred: 'Animação feita para o app (esquema fora de escala). Pressões osmóticas calculadas no código com Π = i·M·R·T (R = 0,082 atm·L/(mol·K), 37 °C).',
  nota: 'Na osmose só o solvente (água) atravessa a membrana semipermeável, sempre do meio menos concentrado para o mais concentrado. A pressão osmótica é a pressão que precisa ser feita para impedir essa passagem, e cresce com o número de partículas dissolvidas.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function vg(v, d) { return v.toFixed(d).replace('.', ','); }
    var AG = '#2b7bbf', SO = '#c97a1a', HEM = '#c0392b';
    svg.setAttribute('viewBox', '0 0 640 370');
    var D = 3;
    var sem = 4; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    function seta(pai, cor) { return el('path', { style: 'fill:none;stroke:' + (cor || AG) + ';stroke-width:2.6;stroke-linecap:round' }, pai); }
    function setaD(x1, y1, x2, y2) { var a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a); return 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x2 - 8 * c + 5 * s).toFixed(1) + ' ' + (y2 - 8 * s - 5 * c).toFixed(1) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - 8 * c - 5 * s).toFixed(1) + ' ' + (y2 - 8 * s + 5 * c).toFixed(1); }
    /* ===== cena 1: tubo em U ===== */
    var c1 = el('g', {});
    var LA = [100, 160], LB = [300, 360], YB0 = 160, YB1 = 196, XM = 230;
    var liqA = el('path', { style: 'fill:color-mix(in srgb,' + SO + ' 22%,var(--folha))' }, c1), liqB = el('path', { style: 'fill:color-mix(in srgb,' + AG + ' 22%,var(--folha))' }, c1);
    el('path', { d: 'M' + LA[0] + ' 30 V' + YB1 + ' H' + LB[1] + ' V30 M' + LA[1] + ' 30 V' + YB0 + ' H' + LB[0] + ' V30', style: 'fill:none;stroke:var(--tinta);stroke-width:2.2' }, c1);
    el('line', { x1: XM, x2: XM, y1: YB0 - 4, y2: YB1 + 4, style: 'stroke:#7a4fa0;stroke-width:3;stroke-dasharray:4 3' }, c1);
    tx(XM, YB1 + 20, 'membrana', 'font-size:14px;fill:#7a4fa0;text-anchor:middle', c1);
    tx(130, 22, 'A', 'font-size:16px;font-weight:700;fill:' + SO + ';text-anchor:middle', c1); tx(330, 22, 'B', 'font-size:16px;font-weight:700;fill:' + AG + ';text-anchor:middle', c1);
    var DOT = []; for (var k = 0; k < 16; k++) DOT.push({ c: el('circle', { r: 4.2, style: 'fill:' + SO }, c1), u: rnd(), v: rnd(), b: k < 4 });
    var SA = [seta(c1), seta(c1)];
    var nA = el('line', { x1: LA[0] - 6, x2: LA[1] + 6, style: 'stroke:' + SO + ';stroke-width:2' }, c1), nB = el('line', { x1: LB[0] - 6, x2: LB[1] + 6, style: 'stroke:' + AG + ';stroke-width:2' }, c1);
    var dh = el('g', {}, c1), dhL = el('path', { style: 'fill:none;stroke:var(--ad-c);stroke-width:2' }, dh), dhT = tx(0, 0, 'Δh', 'font-size:15px;font-weight:700;fill:var(--ad-t)', dh);
    var R1 = [tx(400, 52, 'A: água + soluto que não', 'font-size:14px;fill:var(--tinta)', c1), tx(400, 70, 'atravessa a membrana', 'font-size:14px;fill:var(--tinta)', c1), tx(400, 96, 'B: água pura', 'font-size:14px;fill:var(--tinta)', c1),
      tx(400, 132, '', 'font-size:14px;font-weight:700;fill:var(--ad-t)', c1), tx(400, 150, '', 'font-size:14px;fill:var(--tinta)', c1), tx(400, 168, '', 'font-size:14px;fill:var(--tinta)', c1), tx(400, 186, '', 'font-size:14px;fill:var(--tinta)', c1)];
    /* ===== cena 2: pressao osmotica por particulas ===== */
    var c2 = el('g', {});
    var R = 0.082, T = 310, M = 0.15;
    var SL = [['glicose', 1], ['NaCl (soro)', 2], ['KCl', 2], ['Na₂SO₄', 3], ['Al₂(SO₄)₃', 5]];
    tx(16, 30, 'Π = i · M · R · T   (todas a 0,15 mol/L e 37 °C)', 'font-size:15px;font-weight:700;fill:var(--tinta)', c2);
    var PB = SL.map(function (s, k) {
      var g = el('g', {}, c2), pi = s[1] * M * R * T, w = pi * 9, y = 52 + 32 * k;
      tx(130, y + 17, s[0], 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:end', g);
      el('rect', { x: 140, y: y, width: w, height: 22, rx: 4, style: 'fill:color-mix(in srgb,' + SO + ' 30%,var(--folha));stroke:' + SO + ';stroke-width:1.4' }, g);
      tx(148 + w, y + 17, 'i = ' + s[1] + ': ' + vg(s[1] * M, 2) + ' mol/L → Π ≈ ' + vg(pi, 1) + ' atm', 'font-size:14px;fill:var(--tinta)', g);
      return g;
    });
    var igu = el('path', { d: 'M136 ' + (52 + 32 + 11) + ' h-4 v32 h4', style: 'fill:none;stroke:var(--ad-c);stroke-width:2' }, c2);
    /* ===== cena 3: hemacias ===== */
    var c3 = el('g', {});
    var MEI = [{ x: 90, n: 'hipotônico', s: 1 }, { x: 250, n: 'isotônico', s: 0 }, { x: 410, n: 'hipertônico', s: -1 }];
    MEI.forEach(function (m) {
      m.g = el('g', {}, c3);
      tx(m.x, 30, m.n, 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', m.g);
      m.hem = el('path', { style: 'fill:#e0645a;stroke:' + HEM + ';stroke-width:2' }, m.g);
      m.t = tx(m.x, 140, '', 'font-size:14px;fill:var(--tinta);text-anchor:middle', m.g);
      m.sA = seta(m.g); m.sB = seta(m.g);
    });
    function hemPath(cx, cy, rx, ry, cren) { var d = ''; for (var k = 0; k <= 72; k++) { var a = k / 72 * 2 * Math.PI, f = 1 + cren * Math.max(0, Math.cos(14 * a)); d += (k ? 'L' : 'M') + (cx + rx * f * Math.cos(a)).toFixed(1) + ' ' + (cy + ry * f * Math.sin(a)).toFixed(1) + ' '; } return d + 'Z'; }
    /* grafico volume x tempo */
    var VX0 = 500, VX1 = 590, VY0 = 200, VYm = 130;
    el('path', { d: 'M' + VX0 + ' 60 V' + VY0 + ' H' + VX1, style: 'fill:none;stroke:var(--tinta);stroke-width:1.4' }, c3);
    tx(VX0, 50, 'volume', 'font-size:14px;fill:var(--lapis)', c3); tx(VX1, VY0 + 16, 'tempo', 'font-size:14px;fill:var(--lapis);text-anchor:end', c3);
    var CV = MEI.map(function (m) { return { p: el('path', { style: 'fill:none;stroke:' + HEM + ';stroke-width:2.6' }, c3), t: tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + HEM, c3), s: m.s }; });
    /* ===== cena 4: plantas e alimentos ===== */
    var c4 = el('g', {});
    el('path', { d: 'M60 110 L70 210 H150 L160 110', style: 'fill:color-mix(in srgb,' + AG + ' 15%,var(--folha));stroke:var(--tinta);stroke-width:2' }, c4);
    el('path', { d: 'M110 214 V40', style: 'fill:none;stroke:#3f7d2c;stroke-width:5' }, c4);
    el('ellipse', { cx: 110, cy: 38, rx: 24, ry: 16, style: 'fill:#d6538a' }, c4);
    el('path', { d: 'M110 120 q-30 -10 -40 -34 q30 4 40 34 Z', style: 'fill:#4f9a3a' }, c4);
    var sobe = [seta(c4), seta(c4)];
    tx(180, 70, 'planta: seiva mais concentrada', 'font-size:14px;font-weight:700;fill:#3f7d2c', c4); tx(180, 88, '(hipertônica)', 'font-size:14px;fill:#3f7d2c', c4);
    tx(180, 186, 'água do vaso: menos', 'font-size:14px;font-weight:700;fill:' + AG, c4); tx(180, 204, 'concentrada (hipotônica)', 'font-size:14px;fill:' + AG, c4);
    tx(180, 130, '→ a água entra e sobe', 'font-size:14px;font-weight:700;fill:var(--tinta)', c4);
    el('line', { x1: 410, x2: 410, y1: 30, y2: 214, style: 'stroke:var(--linha);stroke-width:1.2' }, c4);
    var LS = [['É osmose:', 1], ['soro isotônico na veia', 0], ['charque: o sal tira água', 0], ['dos micróbios', 0], ['peixe do mar em água doce', 0], ['Não é osmose:', 1], ['tingir tecido (afinidade', 0], ['do corante pela fibra)', 0]];
    LS.forEach(function (l, k) { tx(424, 48 + 22 * k + (k >= 5 ? 10 : 0), l[0], 'font-size:14px;' + (l[1] ? 'font-weight:700;fill:var(--ad-t)' : 'fill:var(--tinta)'), c4); });
    /* ===== painel ===== */
    el('line', { x1: 16, x2: 624, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.2' });
    var p0 = tx(16, 268, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)'), P = [292, 316, 340, 364].map(function (y) { return tx(16, y, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['Tubo em U com membrana semipermeável', 'Só a água atravessa: passa de B (pura) para A (solução) e A sobe.', 'A coluna mais alta pesa mais e empurra água de volta. Quando os dois', 'fluxos se igualam, o nível para: Δh mede a pressão osmótica.'],
      ['Mais partículas, maior pressão osmótica', 'Π = i·M·R·T: i é o número de partículas que cada fórmula solta.', 'NaCl e KCl na mesma concentração soltam 2 íons cada: mesma Π', '(soluções isosmóticas). Glicose solta 1; Na₂SO₄, 3; Al₂(SO₄)₃, 5.'],
      ['Hemácia em três meios', 'Hipotônico (menos concentrado fora): água entra, ela incha e pode romper.', 'Isotônico: entra = sai, volume constante (soro fisiológico).', 'Hipertônico (mais concentrado fora): água sai, ela murcha.'],
      ['Plantas e alimentos', 'A seiva da planta é mais concentrada que a água do vaso:', 'a água entra pela haste cortada e sobe pelos vasos.', 'O sal do charque puxa água dos micróbios por osmose.']
    ];
    var _desenha = function (t) {
      var i = Math.min(3, Math.floor(t / D)), u = t - i * D;
      op(c1, i === 0 ? 1 : 0); op(c2, i === 1 ? 1 : 0); op(c3, i === 2 ? 1 : 0); op(c4, i === 3 ? 1 : 0);
      /* tubo */
      var s = ease((u - .3) / 2.2), hA = 90 - 34 * s, hB = 90 + 34 * s;
      liqA.setAttribute('d', 'M' + LA[0] + ' ' + hA.toFixed(1) + ' H' + LA[1] + ' V' + YB0 + ' H' + XM + ' V' + YB1 + ' H' + LA[0] + ' Z');
      liqB.setAttribute('d', 'M' + LB[0] + ' ' + hB.toFixed(1) + ' H' + LB[1] + ' V' + YB1 + ' H' + XM + ' V' + YB0 + ' H' + LB[0] + ' Z');
      nA.setAttribute('y1', hA.toFixed(1)); nA.setAttribute('y2', hA.toFixed(1)); nB.setAttribute('y1', hB.toFixed(1)); nB.setAttribute('y2', hB.toFixed(1));
      DOT.forEach(function (d) { var x, y; if (d.b) { x = LA[1] + 6 + (XM - LA[1] - 14) * d.u; y = YB0 + 8 + (YB1 - YB0 - 16) * d.v; } else { x = LA[0] + 8 + (LA[1] - LA[0] - 16) * d.u; y = hA + 8 + (YB0 - hA - 4) * d.v; } d.c.setAttribute('cx', x.toFixed(1)); d.c.setAttribute('cy', y.toFixed(1)); });
      var fl = (t * 1.2) % 1;
      SA[0].setAttribute('d', setaD(XM + 30 - 14 * fl, 178, XM - 12 - 14 * fl, 178)); op(SA[0], i === 0 ? 1 : 0);
      SA[1].setAttribute('d', setaD(XM - 30 + 14 * fl, 190, XM + 12 + 14 * fl, 190)); op(SA[1], i === 0 && s >= .95 ? .9 : 0);
      SA[1].style.stroke = 'var(--lapis)';
      dhL.setAttribute('d', 'M' + (LA[0] - 14) + ' ' + hA.toFixed(1) + ' h-8 V' + hB.toFixed(1) + ' h8'); dhT.setAttribute('x', LA[0] - 50); dhT.setAttribute('y', ((hA + hB) / 2 + 5).toFixed(1)); op(dh, s > .3 ? 1 : 0);
      var fim = s >= .95;
      R1[3].textContent = fim ? 'Parou: fluxos iguais' : 'Água: B → A'; R1[4].textContent = fim ? 'a pressão da coluna A' : 'o nível de A sobe'; R1[5].textContent = fim ? 'iguala a pressão osmótica.' : 'e o de B desce'; R1[6].textContent = fim ? 'A continua mais concentrado.' : '';
      /* particulas */
      PB.forEach(function (b, k) { op(b, cl((u - .2 - .35 * k) / .3)); }); op(igu, cl((u - 1.4) / .3));
      /* hemacias */
      var s3 = ease((u - .2) / 2.2);
      MEI.forEach(function (m) {
        var v = 1 + .3 * m.s * s3, rx = 34 * v, ry = m.s > 0 ? 26 * v + 6 * s3 : 26 * v;
        m.hem.setAttribute('d', hemPath(m.x, 80, rx, ry, m.s < 0 ? .1 * s3 : 0));
        m.t.textContent = m.s > 0 ? 'água entra: incha' : m.s < 0 ? 'água sai: murcha' : 'entra = sai';
        var a = (t * 1.1) % 1;
        if (m.s > 0) { m.sA.setAttribute('d', setaD(m.x - 70 + 8 * a, 80, m.x - 46 + 8 * a, 80)); m.sB.setAttribute('d', setaD(m.x + 70 - 8 * a, 80, m.x + 46 - 8 * a, 80)); }
        else if (m.s < 0) { m.sA.setAttribute('d', setaD(m.x - 36 - 8 * a, 80, m.x - 60 - 8 * a, 80)); m.sB.setAttribute('d', setaD(m.x + 36 + 8 * a, 80, m.x + 60 + 8 * a, 80)); }
        else { m.sA.setAttribute('d', setaD(m.x - 66, 74, m.x - 44, 74)); m.sB.setAttribute('d', setaD(m.x - 44, 88, m.x - 66, 88)); }
      });
      CV.forEach(function (c, k) {
        var d = '', n = 40, xe = VX0 + (VX1 - VX0 - 20) * cl((u - .2) / 2.2);
        for (var j = 0; j <= n; j++) { var x = VX0 + (xe - VX0) * j / n, f = (x - VX0) / (VX1 - VX0 - 20), y = VYm - c.s * 46 * (1 - Math.exp(-3 * f)); d += (j ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) + ' '; }
        c.p.setAttribute('d', d); var yl = VYm - c.s * 46 * (1 - Math.exp(-3 * (xe - VX0) / (VX1 - VX0 - 20)));
        c.t.setAttribute('x', (xe + 4).toFixed(1)); c.t.setAttribute('y', (yl + 5).toFixed(1)); c.t.textContent = xe > VX0 + 10 ? (c.s > 0 ? 'hipo' : c.s < 0 ? 'hiper' : 'iso') : '';
      });
      sobe.forEach(function (sx, k) { var a = (t * .8 + k / 2) % 1; sx.setAttribute('d', setaD(118, 200 - 70 * a, 118, 178 - 70 * a)); op(sx, i === 3 ? Math.sin(Math.PI * a) : 0); });
      var Lx = TXT[i]; p0.textContent = Lx[0]; P.forEach(function (q, j) { q.textContent = Lx[j + 1] || ''; });
    };
    var CG = { 'P2493c19': D - .05, 'P6d7b8ac': 2 * D - .05, 'Pf3393ca': 3 * D - .05, 'Wb95f5e4': 4 * D - .05, 'Wf3b30ac': 4 * D - .05 };
    return fimResposta(VIS.def['osmose-tubo-u-hemacia'], svg, _desenha, 4 * D, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] !== undefined ? CG[q] : 4 * D - .05; }
    });
  }
};
VIS.liga('osmose-tubo-u-hemacia', ['P2493c19', 'P6d7b8ac', 'Pf3393ca', 'Wb95f5e4', 'Wf3b30ac']);
