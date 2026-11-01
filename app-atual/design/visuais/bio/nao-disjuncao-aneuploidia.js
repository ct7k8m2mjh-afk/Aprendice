/* Não disjunção na meiose I x meiose II; aneuploidia x poliploidia */
VIS.def['nao-disjuncao-aneuploidia'] = {
  tit: 'Não disjunção: de onde vêm os gametas n+1 e n−1',
  tipo: 'anim', dur: 14.4,
  marcas: [[0, 'Meiose I'], [3, 'Meiose II'], [5, 'Fecundação'], [8, 'Aneu × poliploidia'], [12, 'Resposta']],
  fontes: ['OpenStax Biology 2e, 13.2 Chromosomal Basis of Inherited Disorders — https://openstax.org/books/biology-2e/pages/13-2-chromosomal-basis-of-inherited-disorders'],
  cred: 'Animação feita para o app (esquema fora de escala; mostra só o par de homólogos que sofre o erro).',
  nota: 'Na abelha, a rainha tem 2n = 32. Se um par não se separa, saem óvulos com 17 (n+1) e 15 (n−1) cromossomos. O zangão nasce de óvulo NÃO fecundado (partenogênese), então tem 17 ou 15 cromossomos, sem somar nada do pai.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var e = el('text', { x: x, y: y, style: st || '' }, pai); e.textContent = s; return e; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function seg(t, a, b) { return ease((t - a) / (b - a)); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function quebra(s, n) { var w = s.split(' '), L = [], c = ''; w.forEach(function (p) { if ((c + ' ' + p).trim().length > n) { L.push(c); c = p; } else c = (c + ' ' + p).trim(); }); if (c) L.push(c); return L; }
    svg.setAttribute('viewBox', '0 0 640 392');
    var PQ = {"P45ffe2b": "2n = 32: com a não disjunção saem óvulos com 17 e 15 cromossomos. O zangão vem de óvulo não fecundado: 15 e 17. Alternativa D.", "W17a2099": "A não disjunção pode ocorrer na meiose I ou na meiose II: alternativa B.", "Pe7e28aa": "Um só X e nenhum Y: sexo feminino e síndrome de Turner (45,X). Alternativa A.", "P0c046a1": "69 cromossomos em 23 trios: poliploide (3n), não aneuploide. Alternativa B."};
    var VERM = '#c0504d', AZUL = '#3d6fb6', VERDE = '#5b9a68', ERRO = '#b4442f', TINTA = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var GX = 262;
    function seta(x1, y1, x2, y2) {
      var a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a);
      el('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x2 - 7 * c + 4 * s).toFixed(1) + ' ' + (y2 - 7 * s - 4 * c).toFixed(1) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - 7 * c - 4 * s).toFixed(1) + ' ' + (y2 - 7 * s + 4 * c).toFixed(1), style: 'fill:none;stroke:var(--lapis);stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round' });
    }
    function celula(x, y, r) { el('circle', { cx: x, cy: y, r: r, style: 'fill:#fbeee6;stroke:#b98a7c;stroke-width:2' }); }
    function rod(cor, pai, h) { return el('rect', { width: 6, height: h || 24, rx: 3, style: 'fill:' + cor }, pai); }

    /* ---------- duas trilhas ---------- */
    var LY = [92, 262];
    tx(8, 17, 'Erro na meiose I: os homólogos vão juntos', 'font-size:14px;font-weight:700;' + TINTA);
    tx(8, 184, 'Erro na meiose II: as cromátides-irmãs vão juntas', 'font-size:14px;font-weight:700;' + TINTA);
    el('line', { x1: 8, x2: 318, y1: 168, y2: 168, style: 'stroke:var(--linha);stroke-width:1' });
    var rotG = [];
    LY.forEach(function (ly) {
      celula(52, ly, 32); seta(86, ly - 8, 124, ly - 30); seta(86, ly + 8, 124, ly + 30);
      celula(150, ly - 36, 24); celula(150, ly + 36, 24);
      seta(176, ly - 40, 238, ly - 54); seta(176, ly - 32, 238, ly - 19); seta(176, ly + 32, 238, ly + 19); seta(176, ly + 40, 238, ly + 54);
      [-54, -18, 18, 54].forEach(function (dy) { celula(GX, ly + dy, 16); rotG.push(tx(GX + 24, ly + dy + 5, '', 'font-size:14px;font-weight:700')); });
    });
    tx(52, 344, 'célula 2n', 'font-size:13px;text-anchor:middle;' + LAP);
    tx(150, 344, 'meiose I', 'font-size:13px;text-anchor:middle;' + LAP);
    tx(GX, 344, 'meiose II: gametas', 'font-size:13px;text-anchor:middle;' + LAP);
    var ROT = [['n+1', 1], ['n+1', 1], ['n−1', 1], ['n−1', 1], ['n+1', 1], ['n−1', 1], ['n', 0], ['n', 0]];

    /* cromatides: [cor, trilha, destino apos MI (dx, dy), destino apos MII (dx, dy)] */
    var C = [
      [VERM, 0, [-12, -36], [-4, -54]], [VERM, 0, [-6, -36], [-4, -18]], [AZUL, 0, [6, -36], [4, -54]], [AZUL, 0, [12, -36], [4, -18]],
      [VERM, 1, [-3, -36], [-4, -54]], [VERM, 1, [3, -36], [4, -54]], [AZUL, 1, [-3, 36], [0, 18]], [AZUL, 1, [3, 36], [0, 54]]
    ];
    var INI = [-15, -9, 9, 15];
    var R = C.map(function (c) { return rod(c[0]); });

    /* ---------- painel ---------- */
    var PX = 334;
    var pNome = tx(PX, 40, '', 'font-size:21px;font-weight:700;' + TINTA);
    var pL = [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return tx(PX, 70 + i * 20, '', 'font-size:14.5px;' + TINTA); });
    var FASES = [
      [0, 'Um par de homólogos', 'Cada homólogo já está duplicado (duas cromátides-irmãs). Vermelho: homólogo do pai; azul: da mãe.'],
      [1, 'Meiose I', 'Em cima, o par NÃO se separa: os dois homólogos vão para a mesma célula. Embaixo, a separação é normal.'],
      [3, 'Meiose II', 'Embaixo, as cromátides-irmãs de um cromossomo NÃO se separam. Erro na meiose I: os 4 gametas saem alterados. Erro na meiose II: 2 alterados e 2 normais.']
    ].map(function (f) { return [f[0], f[1], quebra(f[2], 38)]; });
    /* fecundacao */
    var gZ = el('g', {});
    function zigoto(x, y, cores, t1, t2, t3) {
      el('circle', { cx: x, cy: y, r: 30, style: 'fill:#fbeee6;stroke:#b98a7c;stroke-width:2' }, gZ);
      cores.forEach(function (c, i) { var r = rod(c, gZ, 22); r.setAttribute('x', x - cores.length * 5 + i * 10); r.setAttribute('y', y - 11); });
      tx(x + 42, y - 14, t1, 'font-size:14px;font-weight:700;fill:' + ERRO, gZ); tx(x + 42, y + 5, t2, 'font-size:14px;' + TINTA, gZ); tx(x + 42, y + 23, t3, 'font-size:13px;' + LAP, gZ);
    }
    tx(PX, 40, 'Fecundação', 'font-size:21px;font-weight:700;' + TINTA, gZ);
    tx(PX, 66, 'com um gameta normal (n), em verde:', 'font-size:14.5px;' + TINTA, gZ);
    zigoto(PX + 34, 128, [VERM, AZUL, VERDE], 'n+1 + n = 2n+1', 'trissomia', 'ex.: Down (47,XX,+21)');
    zigoto(PX + 34, 228, [VERDE], 'n−1 + n = 2n−1', 'monossomia', 'ex.: Turner (45,X)');
    tx(PX, 292, 'Sem o Y, o sexo é feminino: 45,X é', 'font-size:13.5px;' + LAP, gZ);
    tx(PX, 310, 'menina com síndrome de Turner.', 'font-size:13.5px;' + LAP, gZ);
    /* aneuploidia x poliploidia */
    var gI = el('g', {});
    tx(PX, 40, 'Aneuploidia × poliploidia', 'font-size:21px;font-weight:700;' + TINTA, gI);
    function idio(y, nums, t1, t2) {
      var x = PX;
      nums.forEach(function (n, k) {
        var h = [30, 24, 18][k];
        for (var i = 0; i < n; i++) { var r = rod(['#7a6aa8', '#c08a3e', '#4f8f9c'][k], gI, h); r.setAttribute('x', x + i * 9); r.setAttribute('y', y + 30 - h); }
        tx(x + (n * 9 - 3) / 2, y + 48, String(k + 1), 'font-size:13px;text-anchor:middle;' + LAP, gI);
        x += n * 9 + 16;
      });
      tx(PX + 120, y + 8, t1, 'font-size:14.5px;font-weight:700;' + TINTA, gI);
      t2.forEach(function (s, i) { tx(PX + 120, y + 27 + i * 18, s, 'font-size:13.5px;' + TINTA, gI); });
    }
    idio(66, [2, 2, 3], 'Aneuploidia: 2n+1', ['só um cromossomo', 'a mais (ou a menos)']);
    idio(160, [3, 3, 3], 'Poliploidia: 3n', ['o conjunto inteiro', 'repetido: trincas']);
    var gN = el('g', {}, gI);
    tx(PX, 262, 'Se n = 23, uma célula 3n tem 69', 'font-size:14px;' + TINTA, gN);
    tx(PX, 281, 'cromossomos: 23 trios de homólogos.', 'font-size:14px;' + TINTA, gN);
    tx(PX, 300, 'Isso é euploidia (múltiplo exato de n),', 'font-size:14px;' + TINTA, gN);
    tx(PX, 319, 'não trissomia de todos.', 'font-size:14px;' + TINTA, gN);

    function quebraF(s, n) { var w = s.split(' '), L = [], c = ''; w.forEach(function (p) { if ((c + ' ' + p).trim().length > n) { L.push(c); c = p; } else c = (c + ' ' + p).trim(); }); if (c) L.push(c); return L; }
    var FIMG = document.createElementNS('http://www.w3.org/2000/svg', 'g'), CARD = { x: 326, y: 8, w: 310, n: 36 };
    function cartao(c) {   /* cartao do tamanho do texto */
      while (FIMG.firstChild) FIMG.removeChild(FIMG.firstChild);
      var L = quebraF(PQ[qid] || '', c.n), h = 46 + L.length * 21;
      var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); [['x', c.x], ['y', c.y], ['width', c.w], ['height', h], ['rx', 12]].forEach(function (a) { r.setAttribute(a[0], a[1]); }); r.setAttribute('style', 'fill:var(--folha,#fff);stroke:var(--ad-c);stroke-width:1.5'); FIMG.appendChild(r);
      [['Por isso a resposta é', 'font-size:16px;font-weight:700;fill:var(--ad-t)']].concat(L.map(function (s) { return [s, 'font-size:15px;fill:var(--tinta)']; })).forEach(function (l, k) { var e = document.createElementNS('http://www.w3.org/2000/svg', 'text'); e.setAttribute('x', c.x + 14); e.setAttribute('y', c.y + 24 + k * 21 + (k ? 4 : 0)); e.setAttribute('style', l[1]); e.textContent = l[0]; FIMG.appendChild(e); });
    }
    var FRZ = { Pe7e28aa: 6.5, P45ffe2b: 4.95, W17a2099: 4.95 }[qid] || 11.999;
    cartao({ Pe7e28aa: { x: 326, y: 272, w: 310, n: 36 }, P0c046a1: { x: 326, y: 246, w: 310, n: 36 } }[qid] || CARD);
    svg.appendChild(FIMG);
    return function (t0) {
      var fim = PQ[qid] && t0 >= 12, t = fim ? FRZ : Math.min(t0, 11.999); FIMG.style.display = fim ? '' : 'none';
      gN.style.display = fim && qid === 'P0c046a1' ? 'none' : '';
      var m1 = seg(t, 1, 2.6), m2 = seg(t, 3, 4.6);
      R.forEach(function (r, i) {
        var c = C[i], ly = LY[c[1]], k = i % 4;
        var x = lerp(lerp(52 + INI[k], 150 + c[2][0], m1), GX + c[3][0], m2), y = lerp(lerp(ly, ly + c[2][1], m1), ly + c[3][1], m2);
        r.setAttribute('x', (x - 3).toFixed(1)); r.setAttribute('y', (y - 12).toFixed(1));
      });
      var oR = seg(t, 4.5, 5);
      rotG.forEach(function (e, i) { e.textContent = ROT[i][0]; e.style.fill = ROT[i][1] ? ERRO : 'var(--tinta)'; e.style.opacity = oR; });
      var f = FASES[0]; FASES.forEach(function (x) { if (t >= x[0]) f = x; });
      var oT = 1 - seg(t, 4.9, 5.2), oZ = t < 8 ? seg(t, 5.1, 5.5) : 1 - seg(t, 7.8, 8.1), oI = seg(t, 8.0, 8.4);
      pNome.textContent = f[1]; pNome.style.opacity = oT;
      pL.forEach(function (e, i) { var s = f[2][i] || ''; e.textContent = s; e.style.opacity = oT; });
      if (fim && FIMG.firstChild && qid !== 'Pe7e28aa' && qid !== 'P0c046a1') { pNome.textContent = ''; pL.forEach(function (e) { e.textContent = ''; }); }   /* o cartao substitui o texto do painel */
      gZ.style.opacity = oZ; gI.style.opacity = oI;
    };
  }
};
VIS.liga('nao-disjuncao-aneuploidia', ['P45ffe2b', 'W17a2099', 'Pe7e28aa', 'P0c046a1']);
