/* Carbono quiral: modelo 3D tetraedrico (acido latico), imagem no espelho nao sobreponivel, ligantes iguais
   (propan-2-ol) e a varredura da molecula da questao aberta, com 2^n isomeros opticos. */
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
'P4fac166': ['Por isso a resposta é E',
'Só o C ligado a H, NH₂, COO⁻ e CH₂CH₂COOH tem 4 ligantes diferentes.',
'As pontas fazem C=O e os dois do meio são CH₂: 1 carbono quiral.'],
'Pc08c785': ['Por isso a resposta é C',
'Caem 4 C de dupla, 3 CH₂ e 2 CH₃. Sobra o CH do anel ligado a H, isopropenila',
'e a dois braços de anel diferentes (a dupla fica perto num, longe no outro): 1.'],
'Pf41093f': ['Por isso a resposta é C',
'C* no CH do OH e no CH do N; o CHCℓ₂ tem dois Cℓ iguais e não conta.',
'2 carbonos assimétricos → 2² = 4 isômeros ópticos.'],
'W86ba3f3': ['Por isso a resposta é D',
'Em CH₃CH(OH)COOH o C do meio liga H, OH, CH₃ e COOH: é quiral.',
'Nas outras, o C livre é CH₂ (dois H iguais) ou faz C=O.'],
'Pec30d0b': ['Por isso a resposta é E',
'No ácido 2-hidroxibutanoico o C2 liga H, OH, CH₂CH₃ e COOH: é quiral.',
'Só molécula quiral desvia a luz polarizada (tem atividade óptica).'],
'Wf8d93d6': ['Por isso a resposta é D',
'No 3-metil-hexano o C3 liga H, CH₃, C₂H₅ e C₃H₇: quatro diferentes.',
'Pentano, 2-metilpentano e 2,3-dimetilbutano repetem H ou CH₃.'],
'W2854669': ['Por isso a resposta é E',
'A cadeia não tem C=C (não há geométrica), mas o C do meio liga',
'H, NH₂, CH₃ e CH₂–C₆H₅: é quiral, então a isomeria é óptica.'],
'P5f8d622': ['Por isso a resposta é E',
'O C central liga H, CH₃, NH–CH₃ e CH₂–C₆H₅: é quiral. As duas figuras',
'são imagens no espelho que não se sobrepõem: isômeros ópticos.'],
'P4fce0dc': ['Por isso a resposta é D',
'Os 2 C* (assimétricos) dão isômeros ópticos. O C* do CH₃ se liga a um NH',
'entre dois C, sem C=O ao lado: amina. A amida (NH–CHO) está no anel.']
};
VIS.def['carbono-quiral-enantiomeros-3d'] = {
  tit: 'Carbono quiral: a molécula e sua imagem no espelho',
  fontes: ['OpenStax, Organic Chemistry (McMurry), 5.1 Enantiomers and the Tetrahedral Carbon e 5.2 The Reason for Handedness in Molecules: Chirality — https://openstax.org/books/organic-chemistry/pages/5-2-the-reason-for-handedness-in-molecules-chirality', 'OpenStax, Organic Chemistry (McMurry), 5.5 Diastereomers (2ⁿ estereoisômeros para n centros) — https://openstax.org/books/organic-chemistry/pages/5-5-diastereomers', 'IUPAC Gold Book, chirality centre — https://goldbook.iupac.org/terms/view/C01060', 'Wikipedia (en), Lactic acid; Limonene; Chloramphenicol — https://en.wikipedia.org/wiki/Chloramphenicol'],
  tipo: 'anim', dur: 15,
  marcas: [[0, 'C*'], [3, 'Espelho'], [7, '2 iguais'], [10, 'Varredura']],
  cred: 'Animação feita para o app. Modelo 3D com ângulos de tetraedro (109,5°); cunha = ligação para a frente, tracejado = para trás.',
  nota: 'Carbono quiral (assimétrico, C*) é o carbono saturado preso a quatro grupos diferentes. A molécula e sua imagem no espelho não se sobrepõem: são enantiômeros, que desviam a luz polarizada para lados opostos. Com n carbonos quirais diferentes há 2ⁿ isômeros ópticos.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var T1 = 3, T2 = 7, T3 = 10, TF = 15;
    var VERDE = '#1f7a4d', CINZA = '#8a8a8a';
    /* ---------- modelo 3D do carbono tetraedrico ---------- */
    var cs = -1 / 3, sn = Math.sqrt(8) / 3;   /* 109,47 graus entre as ligacoes */
    var DIR = [[0, 1, 0], [sn, cs, 0], [sn * Math.cos(2 * Math.PI / 3), cs, sn * Math.sin(2 * Math.PI / 3)], [sn * Math.cos(4 * Math.PI / 3), cs, sn * Math.sin(4 * Math.PI / 3)]];
    var COR = { 'COOH': '#b06a1a', 'OH': '#c0392b', 'CH₃': '#2b6cb0', 'H': '#d9d9d9' };
    var TAU = 0.32, F0 = 0.5;   /* vista: topo no plano, uma cunha embaixo e dois tracejados nos lados */
    function modelo(ligs, pai) {
      var g = el('g', {}, pai), M = { g: g, L: [] };
      ligs.forEach(function (lab) {
        var o = { lab: lab };
        o.w = el('path', { style: 'fill:var(--tinta);stroke:none' }, g);
        o.d = el('line', { style: 'stroke:var(--tinta);stroke-width:2.6;stroke-dasharray:3 4' }, g);
        o.s = el('line', { style: 'stroke:var(--tinta);stroke-width:2.6' }, g);
        o.p = el('g', {}, g);
        var w = 14 + 9.2 * lab.length;
        o.r = el('rect', { x: -w / 2, y: -14, width: w, height: 28, rx: 14, style: 'fill:' + COR[lab] + ';stroke:var(--folha);stroke-width:2' }, o.p);
        tx(0, 6, lab, 'font-size:16px;font-weight:700;text-anchor:middle;fill:' + (lab === 'H' ? '#333' : '#fff'), o.p);
        M.L.push(o);
      });
      M.c = el('g', {}, g);
      el('circle', { r: 15, style: 'fill:#4a4a4a;stroke:var(--folha);stroke-width:2' }, M.c);
      tx(0, 6, 'C', 'font-size:16px;font-weight:700;text-anchor:middle;fill:#fff', M.c);
      return M;
    }
    /* espelho: x -> -x; depois gira phi em torno do eixo vertical e inclina TAU para ver de cima */
    function pos(M, cx, cy, phi, esp, BL) {
      var P = [];
      M.L.forEach(function (o, i) {
        var v = DIR[i], x = esp ? -v[0] : v[0], y = v[1], z = v[2];
        var x1 = x * Math.cos(phi) + z * Math.sin(phi), z1 = -x * Math.sin(phi) + z * Math.cos(phi);
        var y2 = y * Math.cos(TAU) - z1 * Math.sin(TAU), z2 = y * Math.sin(TAU) + z1 * Math.cos(TAU);
        var s = 1 + .16 * z2;
        P.push({ o: o, X: cx + BL * x1 * s, Y: cy - BL * y2 * s, z: z2, s: s });
      });
      M.c.setAttribute('transform', 'translate(' + cx + ' ' + cy + ')');
      P.sort(function (a, b) { return a.z - b.z; });
      var tras = P.filter(function (p) { return p.z < 0; }), frente = P.filter(function (p) { return p.z >= 0; });
      tras.forEach(function (p) { M.g.appendChild(p.o.w); M.g.appendChild(p.o.d); M.g.appendChild(p.o.s); M.g.appendChild(p.o.p); });
      M.g.appendChild(M.c);
      frente.forEach(function (p) { M.g.appendChild(p.o.w); M.g.appendChild(p.o.d); M.g.appendChild(p.o.s); M.g.appendChild(p.o.p); });
      P.forEach(function (p) {
        var o = p.o, dx = p.X - cx, dy = p.Y - cy, m = Math.hypot(dx, dy) || 1, nx = -dy / m, ny = dx / m;
        var tipo = p.z > .3 ? 'w' : p.z < -.3 ? 'd' : 's';
        var k = 7.5 * p.s;
        o.w.setAttribute('d', 'M' + cx + ' ' + cy + ' L' + (p.X + nx * k).toFixed(1) + ' ' + (p.Y + ny * k).toFixed(1) + ' L' + (p.X - nx * k).toFixed(1) + ' ' + (p.Y - ny * k).toFixed(1) + ' Z');
        [o.d, o.s].forEach(function (l) { l.setAttribute('x1', cx); l.setAttribute('y1', cy); l.setAttribute('x2', p.X.toFixed(1)); l.setAttribute('y2', p.Y.toFixed(1)); });
        op(o.w, tipo === 'w' ? 1 : 0); op(o.d, tipo === 'd' ? 1 : 0); op(o.s, tipo === 's' ? 1 : 0);
        o.p.setAttribute('transform', 'translate(' + p.X.toFixed(1) + ' ' + p.Y.toFixed(1) + ') scale(' + p.s.toFixed(3) + ')');
      });
    }
    var g3d = el('g', {});
    var espL = el('g', {}, g3d);
    el('line', { x1: 320, x2: 320, y1: 16, y2: 192, style: 'stroke:#7aa6c2;stroke-width:3;stroke-dasharray:8 5' }, espL);
    tx(320, 208, 'espelho', 'font-size:14px;font-weight:700;fill:#4f7f9c;text-anchor:middle', espL);
    var LAT = ['COOH', 'CH₃', 'OH', 'H'], PROP = ['OH', 'H', 'CH₃', 'CH₃'];
    var mA = modelo(LAT, g3d), mB = modelo(LAT, g3d), pA = modelo(PROP, g3d), pB = modelo(PROP, g3d);
    var nomeA = tx(150, 24, '', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g3d);
    var nomeB = tx(490, 24, '', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g3d);
    var veredito = tx(490, 208, '', 'font-size:15px;font-weight:700;text-anchor:middle', g3d);
    var dicaA = tx(150, 208, '', 'font-size:14px;fill:var(--lapis);text-anchor:middle', g3d);
    /* ---------- varredura (2D) ---------- */
    var MOL = {
      cloranfenicol: { nome: 'cloranfenicol', tk: [{ l: 'O₂N–C₆H₄', t: 'anel' }, { l: 'CH', t: 'C*', s: [{ l: 'OH', d: -1 }] }, { l: 'CH', t: 'C*', s: [{ l: 'CH₂OH', d: 1, t: '2 H' }] }, { l: 'NH' }, { l: 'C', t: 'C=O', s: [{ l: 'O', d: -1, dbl: 1 }] }, { l: 'CHCℓ₂', t: '2 Cℓ' }] },
      glutamato: { nome: 'glutamato monossódico', tk: [{ l: 'HOOC', t: 'C=O' }, { l: 'CH₂', t: '2 H' }, { l: 'CH₂', t: '2 H' }, { l: 'CH', t: 'C*', s: [{ l: 'NH₂', d: 1 }] }, { l: 'COO⁻ Na⁺', t: 'C=O' }] },
      latico: { nome: 'CH₃CH(OH)COOH (alternativa D)', tk: [{ l: 'CH₃', t: '3 H' }, { l: 'CH', t: 'C*', s: [{ l: 'OH', d: -1 }] }, { l: 'COOH', t: 'C=O' }] },
      hidroxibut: { nome: 'ácido 2-hidroxibutanoico', tk: [{ l: 'CH₃', t: '3 H' }, { l: 'CH₂', t: '2 H' }, { l: 'CH', t: 'C*', s: [{ l: 'OH', d: -1 }] }, { l: 'COOH', t: 'C=O' }] },
      metilhexano: { nome: '3-metil-hexano', tk: [{ l: 'CH₃', t: '3 H' }, { l: 'CH₂', t: '2 H' }, { l: 'CH', t: 'C*', s: [{ l: 'CH₃', d: 1, t: '3 H' }] }, { l: 'CH₂', t: '2 H' }, { l: 'CH₂', t: '2 H' }, { l: 'CH₃', t: '3 H' }] },
      anfetamina: { nome: 'anfetamina', tk: [{ l: 'C₆H₅', t: 'anel' }, { l: 'CH₂', t: '2 H' }, { l: 'CH', t: 'C*', s: [{ l: 'NH₂', d: 1 }] }, { l: 'CH₃', t: '3 H' }] },
      metanfetamina: { nome: 'metanfetamina', tk: [{ l: 'C₆H₅', t: 'anel' }, { l: 'CH₂', t: '2 H' }, { l: 'CH', t: 'C*', s: [{ l: 'NH–CH₃', d: 1, t: '3 H' }] }, { l: 'CH₃', t: '3 H' }] },
      formoterol: { nome: 'formoterol (Ar = anel com OH e NH–CHO)', tk: [{ l: 'Ar', t: 'anel' }, { l: 'CH', t: 'C*', s: [{ l: 'OH', d: -1 }] }, { l: 'CH₂', t: '2 H' }, { l: 'NH', t: 'amina' }, { l: 'CH', t: 'C*', s: [{ l: 'CH₃', d: 1, t: '3 H' }] }, { l: 'CH₂', t: '2 H' }, { l: 'Ar′', t: 'anel' }] },
      limoneno: { nome: 'limoneno', anel: true }
    };
    var QM = { P4fac166: 'glutamato', Pc08c785: 'limoneno', Pf41093f: 'cloranfenicol', W86ba3f3: 'latico', Pec30d0b: 'hidroxibut', Wf8d93d6: 'metilhexano', W2854669: 'anfetamina', P5f8d622: 'metanfetamina', P4fce0dc: 'formoterol' };
    var mol = MOL[QM[qid] || 'cloranfenicol'];
    var g2d = el('g', {});
    tx(20, 26, 'Varredura: ' + mol.nome, 'font-size:16px;font-weight:700;fill:var(--tinta)', g2d);
    function larg(s) { var n = 0; for (var i = 0; i < s.length; i++) n += '₀₁₂₃₄₅₆₇₈₉⁺⁻′'.indexOf(s[i]) >= 0 ? .55 : s[i] === ' ' ? .45 : 1; return n * 10.8; }
    var AT = 'font-size:17px;font-weight:700;fill:var(--tinta);text-anchor:middle';
    var LG = 'stroke:var(--tinta);stroke-width:2;fill:none';
    var alvos = [];   /* {x,y,tag,tx,ty} na ordem da varredura */
    function pilula(x, y, s) {
      var g = el('g', {}, g2d), w = larg(s) * .86 + 16, ok = s === 'C*', inf = s === 'amina';
      var cor = ok ? VERDE : inf ? '#8a5a9e' : CINZA;
      el('rect', { x: x - w / 2, y: y - 12, width: w, height: 24, rx: 12, style: 'fill:color-mix(in srgb,' + cor + (ok ? ' 18%' : ' 10%') + ',var(--folha));stroke:' + cor + ';stroke-width:' + (ok ? 2 : 1.4) }, g);
      tx(x, y + 5, s, 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + cor, g);
      return g;
    }
    if (!mol.anel) {
      var yc = 100, gap = 30, ws = mol.tk.map(function (k) { return larg(k.l) / 2 + 4; });
      var tot = 0; ws.forEach(function (w, i) { tot += 2 * w + (i ? gap : 0); });
      var x = 320 - tot / 2, xs = [];
      ws.forEach(function (w, i) { if (i) x += gap; x += w; xs.push(x); x += w; });
      mol.tk.forEach(function (k, i) {
        var X = xs[i];
        tx(X, yc + 6, k.l, AT, g2d);
        if (i) el('path', { d: 'M' + (xs[i - 1] + ws[i - 1] + 2) + ' ' + yc + ' H' + (X - ws[i] - 2), style: LG }, g2d);
        var lado = (k.s || []).some(function (s) { return s.d < 0; }) ? 1 : -1;   /* rotulo acima, a menos que haja grupo em cima */
        (k.s || []).forEach(function (s) {
          var d = s.d, y1 = yc + d * 13, y2 = yc + d * 37, ys = yc + d * 50 + 6;
          if (s.dbl) el('path', { d: 'M' + (X - 3.5) + ' ' + y1 + ' V' + y2 + ' M' + (X + 3.5) + ' ' + y1 + ' V' + y2, style: LG }, g2d);
          else el('path', { d: 'M' + X + ' ' + y1 + ' V' + y2, style: LG }, g2d);
          tx(X, ys, s.l, AT, g2d);
          s.X = X; s.Y = ys - 6;
        });
        if (k.t) alvos.push({ x: X, y: yc, t: k.t, px: X, py: yc + lado * 40, w: ws[i] });
        (k.s || []).forEach(function (s) { if (s.t) alvos.push({ x: s.X, y: s.Y, t: s.t, px: s.X, py: s.Y + s.d * 32, w: larg(s.l) / 2 }); });
      });
    } else {
      /* limoneno: anel de 6 com C1=C2, CH3 em C1 e isopropenila em C4 (rotulos explicitos) */
      var cx0 = 270, cy0 = 92, R = 60, V = [];
      for (var i = 0; i < 6; i++) { var a = Math.PI - i * Math.PI / 3; V.push([cx0 + R * Math.cos(a), cy0 - R * Math.sin(a)]); }
      var LAB = ['C', 'CH', 'CH₂', 'CH', 'CH₂', 'CH₂'], TAG = ['dupla', 'dupla', '2 H', 'C*', '2 H', '2 H'];
      function lig(a, b, ra, rb, dbl, dentro) {
        var dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy), ux = dx / m, uy = dy / m;
        var p = [a[0] + ux * ra, a[1] + uy * ra], q = [b[0] - ux * rb, b[1] - uy * rb];
        el('path', { d: 'M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ' L' + q[0].toFixed(1) + ' ' + q[1].toFixed(1), style: LG }, g2d);
        if (dbl) { var nx = -uy * 5.5, ny = ux * 5.5; if (dentro && ((cx0 - (p[0] + q[0]) / 2) * nx + (cy0 - (p[1] + q[1]) / 2) * ny) < 0) { nx = -nx; ny = -ny; }
          el('path', { d: 'M' + (p[0] + nx + ux * 4).toFixed(1) + ' ' + (p[1] + ny + uy * 4).toFixed(1) + ' L' + (q[0] + nx - ux * 4).toFixed(1) + ' ' + (q[1] + ny - uy * 4).toFixed(1), style: LG }, g2d); }
      }
      var RR = [10, 13, 15, 13, 15, 15];
      for (var j = 0; j < 6; j++) lig(V[j], V[(j + 1) % 6], RR[j], RR[(j + 1) % 6], j === 0, true);
      V.forEach(function (v, j) { tx(v[0], v[1] + 6, LAB[j], AT, g2d); });
      var C7 = [V[0][0] - 64, V[0][1]], C8 = [V[3][0] + 62, V[3][1]], C9 = [C8[0] + 31, C8[1] - 54], C10 = [C8[0] + 31, C8[1] + 54];
      lig(V[0], C7, 10, 18); lig(V[3], C8, 13, 10); lig(C8, C9, 10, 14, true); lig(C8, C10, 10, 14);
      tx(C7[0], C7[1] + 6, 'CH₃', AT, g2d); tx(C8[0], C8[1] + 6, 'C', AT, g2d); tx(C9[0], C9[1] + 6, 'CH₂', AT, g2d); tx(C10[0], C10[1] + 6, 'CH₃', AT, g2d);
      var OFF = [[-32, -24], [0, -30], [0, -30], [16, -24], [0, 32], [0, 32]];
      V.forEach(function (v, j) { alvos.push({ x: v[0], y: v[1], t: TAG[j], px: v[0] + OFF[j][0], py: v[1] + OFF[j][1] }); });
      alvos.push({ x: C7[0], y: C7[1], t: '3 H', px: C7[0], py: C7[1] + 34, w: 18 });
      alvos.push({ x: C8[0], y: C8[1], t: 'dupla', px: C8[0] - 24, py: C8[1] + 36 });
      alvos.push({ x: C9[0], y: C9[1], t: 'dupla', px: C9[0] + 56, py: C9[1], w: 18 });
      alvos.push({ x: C10[0], y: C10[1], t: '3 H', px: C10[0] + 50, py: C10[1], w: 18 });
      /* o C4 (C*) por ultimo, para o aluno ver o teste dos dois bracos */
      var c4 = alvos.splice(3, 1)[0]; alvos.push(c4);
    }
    var pills = alvos.map(function (a) { return pilula(a.px, a.py, a.t); });
    var lupa = el('ellipse', { rx: 21, ry: 19, style: 'fill:none;stroke:' + VERDE + ';stroke-width:2.5' }, g2d);
    var nC = alvos.filter(function (a) { return a.t === 'C*'; }).length;
    var cont = tx(20, 211, '', 'font-size:16px;font-weight:700;fill:' + VERDE, g2d);
    /* ---------- painel ---------- */
    el('line', { x1: 12, x2: 628, y1: 218, y2: 218, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 242, '', 'font-size:16px;font-weight:700;fill:var(--tinta)')];
    for (var j2 = 0; j2 < 3; j2++) P.push(tx(14, 267 + 23 * j2, '', 'font-size:15px;fill:var(--tinta)'));
    var SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    var TXT = [
      ['1. Carbono quiral (C*)', 'No ácido lático, o C central liga H, OH, CH₃ e COOH: quatro', 'grupos diferentes. Esse C é quiral (assimétrico) e se marca C*.', 'Cunha = ligação para a frente; tracejado = para trás.'],
      ['2. A imagem no espelho', 'O espelho inverte a molécula. Girando a imagem, COOH e CH₃', 'coincidem, mas OH e H ficam trocados: não se sobrepõem (como as mãos).', 'São enantiômeros (isômeros ópticos): desviam a luz para lados opostos.'],
      ['3. Dois ligantes iguais: não é quiral', 'No propan-2-ol o C liga dois CH₃: a imagem girada coincide com', 'a original, e não existe isômero óptico.', 'Por isso CH₂, CH₃ e C de dupla (só 3 ligantes) nunca são C*.'],
      ['4. Varredura: carbono por carbono', 'Risque C de dupla (C=O, C=C, anel) e C com 2 ou 3 ligantes iguais.', 'O que sobra com 4 ligantes diferentes é C*.', 'n carbonos C* diferentes dão 2ⁿ isômeros ópticos.']
    ];
    var _desenha = function (t) {
      var f = t < T1 ? 0 : t < T2 ? 1 : t < T3 ? 2 : 3;
      op(g3d, f < 3 ? 1 : 0); op(g2d, f === 3 ? 1 : 0);
      var lat = f < 2, cA = f === 0 ? 320 : 150;
      op(mA.g, lat && f < 3 ? 1 : 0); op(mB.g, f === 1 ? cl((t - T1 - .2) / .6) : 0);
      op(pA.g, f === 2 ? 1 : 0); op(pB.g, f === 2 ? cl((t - T2 - .1) / .5) : 0);
      op(espL, f === 1 || f === 2 ? 1 : 0);
      if (f === 0) { pos(mA, 320, 112, F0 + 2 * Math.PI * ease(t / (T1 - .3)), false, 66); nomeA.setAttribute('x', 320); nomeA.textContent = 'ácido lático: C ligado a 4 grupos diferentes'; nomeB.textContent = ''; }
      else if (f === 1) {
        pos(mA, 150, 112, F0, false, 66);
        var r = ease((t - T1 - 1.1) / 1.4);
        pos(mB, 490, 112, -F0 + (Math.PI + 2 * F0) * r, true, 66);   /* comeca como reflexo exato e termina na mesma vista da molecula */
        nomeA.setAttribute('x', 150); nomeA.textContent = 'molécula'; nomeB.textContent = r < .02 ? 'imagem no espelho' : r < 1 ? 'girando a imagem…' : 'imagem girada';
      } else if (f === 2) {
        pos(pA, 150, 112, F0, false, 66);
        var r2 = ease((t - T2 - .7) / 1.2);
        pos(pB, 490, 112, -F0 + (Math.PI + 2 * F0) * r2, true, 66);
        nomeA.setAttribute('x', 150); nomeA.textContent = 'propan-2-ol'; nomeB.textContent = r2 < .02 ? 'imagem no espelho' : r2 < 1 ? 'girando a imagem…' : 'imagem girada';
      }
      var fimRot = f === 1 ? t > T1 + 2.6 : f === 2 ? t > T2 + 2 : false;
      veredito.textContent = !fimRot ? '' : f === 1 ? 'OH e H trocados: não se sobrepõe' : 'coincide: não é quiral';
      veredito.style.fill = f === 1 ? '#c0392b' : VERDE;
      dicaA.textContent = f === 1 ? 'OH na frente, H atrás' : f === 2 ? 'dois CH₃ iguais' : '';
      /* varredura */
      var u = cl((t - T3 - .3) / (TF - T3 - 1.2)), k = Math.min(alvos.length - 1, Math.floor(u * alvos.length)), feitos = u >= 1 ? alvos.length : k;
      pills.forEach(function (p, i) { op(p, i < feitos || (i === k && u * alvos.length - k > .45) ? 1 : 0); });
      var a = alvos[k]; lupa.setAttribute('cx', a.x); lupa.setAttribute('cy', a.y); lupa.setAttribute('rx', Math.max(21, (a.w || 12) + 9)); op(lupa, f === 3 && u < 1 ? 1 : 0);
      var achados = 0; alvos.forEach(function (al, i) { if (al.t === 'C*' && i < feitos) achados++; });
      cont.textContent = u < 1 ? 'C* encontrados até agora: ' + achados : nC + (nC === 1 ? ' carbono quiral' : ' carbonos quirais') + '  →  2' + SUP[nC] + ' = ' + Math.pow(2, nC) + ' isômeros ópticos';
      var L = TXT[f];
      for (var j = 0; j < 4; j++) P[j].textContent = L[j] || '';
    };
    return fimResposta(VIS.def['carbono-quiral-enantiomeros-3d'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function () { return TF - .01; }
    });
  }
};
VIS.liga('carbono-quiral-enantiomeros-3d', ['P4fac166', 'Pc08c785', 'Pf41093f', 'W86ba3f3', 'Pec30d0b', 'Wf8d93d6', 'W2854669', 'P5f8d622', 'P4fce0dc']);
