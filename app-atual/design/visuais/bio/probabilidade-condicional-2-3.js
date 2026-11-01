/* Por que o irmão/irmã saudável de um afetado tem 2/3 de chance de ser portador; montagem da conta */
VIS.def['probabilidade-condicional-2-3'] = {
  tit: 'Por que 2/3, e como montar a conta do risco',
  tipo: 'anim', dur: 12,
  marcas: [[0, 'Aa × Aa'], [2.2, 'Riscar aa'], [4.4, 'Parceiro'], [6.4, 'Multiplicar'], [9, 'Outra família']],
  fontes: ['OpenStax Biology 2e, 12.2 Characteristics and Traits (quadro de Punnett, probabilidades) — https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits'],
  cred: 'Animação feita para o app (herança autossômica recessiva).',
  nota: 'O 2/3 só vale para quem é filho de pais Aa e sabidamente não é afetado. Filho de um afetado (aa) recebe a com certeza: se é saudável, é Aa com probabilidade 1. Para quem entra de fora da família, usa-se a frequência de portadores da população.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var e = el('text', { x: x, y: y, style: st || '' }, pai); e.textContent = s; return e; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function seg(t, a, b) { return ease((t - a) / (b - a)); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function quebra(s, n) { var w = s.split(' '), L = [], c = ''; w.forEach(function (p) { if ((c + ' ' + p).trim().length > n) { L.push(c); c = p; } else c = (c + ' ' + p).trim(); }); if (c) L.push(c); return L; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var PQ = {"P6bbd922": "III-2 é Aa com certeza (mãe aa), III-3 é Aa com 1/50: 1 × 1/50 × 1/4 = 1/200. Alternativa B.", "P0032661": "A irmã saudável é Aa com 2/3 e o parceiro com 1/50; a chance de a criança ter AME (aa, o que a questão chama de portadora) é 2/3 × 1/50 × 1/4 = 1/300. Alternativa D."};
    var TINTA = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)', ERRO = '#b4442f', MID = 'text-anchor:middle;';

    /* ---------- quadro Aa x Aa ---------- */
    var GX = 40, GY = 46, W = 62, H = 44;
    tx(GX + W / 2, GY - 8, 'A', 'font-size:15px;font-weight:700;' + MID + LAP); tx(GX + W * 1.5, GY - 8, 'a', 'font-size:15px;font-weight:700;' + MID + LAP);
    tx(GX - 12, GY + H / 2 + 5, 'A', 'font-size:15px;font-weight:700;' + MID + LAP); tx(GX - 12, GY + H * 1.5 + 5, 'a', 'font-size:15px;font-weight:700;' + MID + LAP);
    tx(GX + W, 20, 'pais Aa × Aa', 'font-size:14px;font-weight:700;' + MID + TINTA);
    var casas = [['AA', 0, 0], ['Aa', 1, 0], ['Aa', 0, 1], ['aa', 1, 1]].map(function (c, i) {
      var x = GX + c[1] * W, y = GY + c[2] * H;
      var r = el('rect', { x: x, y: y, width: W, height: H, style: 'stroke:var(--lapis);stroke-width:1.3' });
      var e = tx(x + W / 2, y + H / 2 + 7, c[0], 'font-size:19px;font-weight:700;' + MID);
      return [r, e, c[0]];
    });
    var xa = GX + W, ya = GY + H;
    var risco = el('path', { d: 'M' + (xa + 8) + ' ' + (ya + 8) + ' L' + (xa + W - 8) + ' ' + (ya + H - 8) + ' M' + (xa + W - 8) + ' ' + (ya + 8) + ' L' + (xa + 8) + ' ' + (ya + H - 8), style: 'stroke:' + ERRO + ';stroke-width:3;stroke-linecap:round' });
    var fr1 = tx(GX + W, GY + 2 * H + 24, '', 'font-size:15px;font-weight:700;' + MID + TINTA);

    /* ---------- populacao: 1 em 50 ---------- */
    var gP = el('g', {});
    tx(300, 20, 'parceiro de fora da família', 'font-size:14px;font-weight:700;' + MID + TINTA, gP);
    for (var i = 0; i < 50; i++) {
      var cx = 222 + (i % 10) * 17, cy = 42 + Math.floor(i / 10) * 17;
      el('circle', { cx: cx, cy: cy, r: 6.5, style: 'fill:' + (i === 23 ? 'var(--ad-c)' : 'color-mix(in srgb,var(--tinta) 15%,transparent)') }, gP);
    }
    tx(300, 146, '1 em cada 50 é Aa: 1/50', 'font-size:15px;font-weight:700;' + MID + 'fill:var(--ad-t)', gP);

    /* ---------- fichas da multiplicacao ---------- */
    function linhaFichas(y, rot, vals, legs, res) {
      var g = el('g', {});
      tx(14, y - 12, rot, 'font-size:14px;font-weight:700;' + TINTA, g);
      var fichas = vals.map(function (v, k) {
        var gg = el('g', {}, g), x = 14 + k * 86;
        el('rect', { x: x, y: y, width: 62, height: 34, rx: 17, style: 'fill:' + (k === 0 ? 'color-mix(in srgb,var(--ad-c) 24%,transparent)' : 'color-mix(in srgb,var(--tinta) 8%,transparent)') }, gg);
        tx(x + 31, y + 23, v, 'font-size:17px;font-weight:700;' + MID + (k === 0 ? 'fill:var(--ad-t)' : TINTA), gg);
        tx(x + 31, y + 52, legs[k], 'font-size:13px;' + MID + LAP, gg);
        if (k < 2) tx(x + 74, y + 23, '×', 'font-size:17px;' + MID + LAP, gg);
        return gg;
      });
      var igual = el('g', {}, g); tx(274, y + 24, '=', 'font-size:20px;' + MID + LAP, igual); tx(326, y + 25, res, 'font-size:22px;font-weight:700;' + MID + TINTA, igual);
      return [g, fichas, igual];
    }
    var L1 = linhaFichas(206, 'Irmã saudável de um afetado (AME)', ['2/3', '1/50', '1/4'], ['ela Aa', 'ele Aa', 'filho aa'], '1/300');
    var L2 = linhaFichas(290, 'Filha de mãe afetada (aa)', ['1', '1/50', '1/4'], ['ela Aa', 'ele Aa', 'filho aa'], '1/200');

    /* ---------- painel ---------- */
    var PX = 410;
    var pNome = tx(PX, 36, '', 'font-size:18px;font-weight:700;' + TINTA);
    var pL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (k) { return tx(PX, 64 + k * 20, '', 'font-size:14.5px;' + TINTA); });
    var ETAPAS = [
      [0, '1. Pais Aa × Aa', 'Cada filho tem 1/4 de chance de ser AA, 2/4 de ser Aa e 1/4 de ser aa (afetado).'],
      [2.2, '2. Ela é saudável', 'Já sabemos que a irmã não é afetada: a casa aa sai da conta. Sobram 3 casas igualmente prováveis, e 2 delas são Aa. Logo, P(ela ser Aa) = 2/3, e não 1/2.'],
      [4.4, '3. O parceiro de fora', 'Ninguém da família dele é conhecido: usa-se a frequência da população. Se 1 em 50 é portador, P(ele ser Aa) = 1/50.'],
      [6.4, '4. Multiplicar', 'Para o filho ser aa, as três coisas precisam acontecer juntas: ela Aa, ele Aa e o sorteio dar aa (1/4). Regra do "e": multiplicar. 2/3 × 1/50 × 1/4 = 2/600 = 1/300.'],
      [9, '5. Outra família', 'Se a mulher é filha de mãe aa, ela recebeu um a com certeza. Saudável, é Aa com probabilidade 1, sem o 2/3. 1 × 1/50 × 1/4 = 1/200.'],
      [10.8, 'Por isso a resposta é', PQ[qid] || 'Irmã saudável de afetado: 1/300 (AME). Filha de mãe afetada: 1/200. O sexo do bebê não entra na conta: a herança é autossômica.']
    ].map(function (e) { return [e[0], e[1], quebra(e[2], 30)]; });

    return function (t) {
      /* quadro */
      casas.forEach(function (c, i) {
        var on = seg(t, .3 + i * .35, .6 + i * .35), aa = c[2] === 'aa', apaga = aa ? seg(t, 2.3, 2.8) : 0;
        var cor = c[2] === 'Aa' ? 'var(--ad-c)' : 'var(--tinta)';
        c[0].style.fill = 'color-mix(in srgb,' + cor + ' ' + Math.round((c[2] === 'Aa' ? 24 : 8) * on * (1 - apaga * .5)) + '%,transparent)';
        c[1].style.fill = aa && apaga > .5 ? 'var(--lapis)' : c[2] === 'Aa' ? 'var(--ad-t)' : 'var(--tinta)';
        c[1].style.opacity = .25 + .75 * on;
      });
      risco.style.opacity = seg(t, 2.3, 2.8);
      fr1.textContent = t < 1.7 ? '' : t < 2.3 ? '1/4 AA · 2/4 Aa · 1/4 aa' : 'sobram 3: P(Aa) = 2/3';
      fr1.style.fill = t >= 2.3 ? 'var(--ad-t)' : 'var(--tinta)';
      gP.style.opacity = seg(t, 4.4, 4.9);
      /* fichas: deslizam para o lugar */
      [[L1, 6.4], [L2, 9]].forEach(function (L) {
        var t0 = L[1];
        L[0][0].style.opacity = seg(t, t0, t0 + .3);
        L[0][1].forEach(function (f, k) { var u = seg(t, t0 + .2 + k * .4, t0 + .6 + k * .4); f.style.opacity = u; f.setAttribute('transform', 'translate(0 ' + (20 * (1 - u)).toFixed(1) + ')'); });
        L[0][2].style.opacity = seg(t, t0 + 1.5, t0 + 1.9);
      });
      var E = ETAPAS[0]; ETAPAS.forEach(function (x) { if (t >= x[0]) E = x; });
      pNome.textContent = E[1]; pL.forEach(function (e, k) { e.textContent = E[2][k] || ''; });
    };
  }
};
VIS.liga('probabilidade-condicional-2-3', ['P6bbd922', 'P0032661']);
