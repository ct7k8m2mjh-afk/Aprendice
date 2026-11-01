/* Epistasia vista como via bioquimica em etapas: onde o gene epistatico trava a via */
VIS.def['epistasia-via-pigmento'] = {
  tit: 'Epistasia: um gene trava a via e o outro gene deixa de aparecer',
  tipo: 'anim', dur: 17.5,
  marcas: [[0, 'Rato (recessiva)'], [5, 'Bombaim (hh)'], [10, 'Cavalo (dominante)'], [15, 'Resposta']],
  fontes: [
    'OpenStax Biology 2e, 12.3 Laws of Inheritance (epistasia) — https://openstax.org/books/biology-2e/pages/12-3-laws-of-inheritance',
    'OpenStax Anatomy and Physiology 2e, 18.6 Blood Typing — https://openstax.org/books/anatomy-and-physiology-2e/pages/18-6-blood-typing'
  ],
  cred: 'Animação feita para o app (esquema simplificado das vias).',
  nota: 'Epistasia não é dano ao gene que some: o gene hipostático (de outro loco) está intacto, mas não se manifesta porque o gene epistático trava a via.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var VERM = '#c0392b';
    var titulo = tx({ x: 16, y: 32, 'class': 'v-fase' }), sub = tx({ x: 16, y: 58, 'class': 'v-sub' });
    /* ---------- pecas reutilizaveis ---------- */
    function caixa(g, x, y, w, l1, l2) {
      var r = el('rect', { x: x, y: y, width: w, height: 54, rx: 10, style: 'fill:color-mix(in srgb,var(--tinta) 6%,transparent);stroke:var(--linha);stroke-width:1.5' }, g);
      tx({ x: x + w / 2, y: y + (l2 ? 23 : 32), 'text-anchor': 'middle', 'class': 'v-rot' }, l1, g);
      if (l2) tx({ x: x + w / 2, y: y + 42, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, l2, g);
      return r;
    }
    function seta(g, x1, x2, y, l1, l2) {
      el('path', { d: 'M' + x1 + ' ' + y + ' H' + (x2 - 2) + ' m-9 -7 l9 7 l-9 7', style: 'fill:none;stroke:var(--tinta);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round' }, g);
      tx({ x: (x1 + x2) / 2, y: y - 16, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:600;fill:var(--ad-t)' }, l1, g);
      if (l2) tx({ x: (x1 + x2) / 2, y: y + 29, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, l2, g);
    }
    function amostra(g, x, y, cor, l1, l2, l3) {
      var r = el('rect', { x: x, y: y, width: 34, height: 34, rx: 8, style: 'fill:' + cor + ';stroke:color-mix(in srgb,var(--tinta) 35%,transparent);stroke-width:1.5' }, g);
      tx({ x: x + 44, y: y + 14, 'class': 'v-rot' }, l1, g);
      tx({ x: x + 44, y: y + 32, style: 'font-size:13px;fill:var(--lapis)' }, l2, g);
      var t3 = l3 ? tx({ x: x + 44, y: y + 50, style: 'font-size:13px;font-weight:700;fill:var(--tinta)' }, l3, g) : null;
      return { r: r, g: g };
    }
    function hemacia(g, cx, cy, marca) {
      el('circle', { cx: cx, cy: cy, r: 26, style: 'fill:#c8463d;stroke:#8e2a23;stroke-width:2' }, g);
      el('circle', { cx: cx, cy: cy, r: 12, style: 'fill:#d9655b' }, g);
      if (marca) for (var k = 0; k < 8; k++) {
        var a = k * Math.PI / 4, x = cx + 31 * Math.cos(a), y = cy + 31 * Math.sin(a);
        el('rect', { x: x - 4, y: y - 4, width: 8, height: 8, rx: 1.5, transform: 'rotate(' + (a * 180 / Math.PI + 45) + ' ' + x + ' ' + y + ')', style: 'fill:#f2c94c;stroke:#9a7a12;stroke-width:1' }, g);
      }
    }
    /* trava (bloqueio) sobre uma seta */
    function trava(g, x, y, rot) {
      var gg = el('g', {}, g);
      el('path', { d: 'M' + (x - 9) + ' ' + (y - 9) + ' L' + (x + 9) + ' ' + (y + 9) + ' M' + (x + 9) + ' ' + (y - 9) + ' L' + (x - 9) + ' ' + (y + 9), style: 'fill:none;stroke:' + VERM + ';stroke-width:5;stroke-linecap:round' }, gg);
      tx({ x: x, y: y + 50, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:' + VERM }, rot, gg);
      return gg;
    }
    var YV = 104, YS = YV + 27;   /* via: topo das caixas e altura das setas */
    /* ---------- cena 1: rato ---------- */
    var c1 = el('g', {});
    caixa(c1, 16, YV, 120, 'Precursor', '(incolor)');
    seta(c1, 138, 218, YS, 'enzima', '(alelo A)');
    caixa(c1, 220, YV, 160, 'Pigmento', '');
    seta(c1, 382, 442, YS, '', '');
    caixa(c1, 444, YV, 180, 'Gene B decide a cor', 'B_ cinza · bb preto');
    var tr1 = trava(c1, 178, YS, 'aa: sem enzima');
    var a1 = [amostra(c1, 16, 236, '#8f8f8a', 'Cinza', 'A_B_', '9/16'), amostra(c1, 222, 236, '#26231f', 'Preto', 'A_bb', '3/16'), amostra(c1, 428, 236, '#f5f0e6', 'Albino', 'aa (B_ ou bb)', '4/16')];
    tx({ x: 16, y: 222, 'class': 'v-lab' }, 'AaBb × AaBb  →  9 : 3 : 4', c1);
    var b1 = tx({ x: 16, y: 334, 'class': 'v-sub forte' }, '', c1);
    /* ---------- cena 2: Bombaim ---------- */
    var c2 = el('g', {});
    caixa(c2, 16, YV, 120, 'Substância', 'precursora');
    seta(c2, 138, 218, YS, 'enzima', '(alelo H)');
    caixa(c2, 220, YV, 160, 'Antígeno H', '');
    seta(c2, 382, 442, YS, 'enzima', '(Iᴬ ou Iᴮ)');
    caixa(c2, 444, YV, 180, 'Antígeno A ou B', 'ii: H fica como está (O)');
    var tr2 = trava(c2, 178, YS, 'hh: sem enzima');
    var gH1 = el('g', {}, c2), gH2 = el('g', {}, c2);
    hemacia(gH1, 52, 270, true);
    tx({ x: 98, y: 258, 'class': 'v-rot' }, 'O comum: tem antígeno H', gH1);
    tx({ x: 98, y: 278, style: 'font-size:13px;fill:var(--lapis)' }, '(quadradinhos amarelos)', gH1);
    hemacia(gH2, 52, 270, false);
    tx({ x: 98, y: 258, 'class': 'v-rot' }, 'Bombaim (hh): sem H, sem A e sem B,', gH2);
    tx({ x: 98, y: 278, 'class': 'v-rot' }, 'mesmo que tenha Iᴬ ou Iᴮ. Parece O.', gH2);
    var b2 = tx({ x: 16, y: 334, 'class': 'v-sub forte' }, '', c2);
    /* ---------- cena 3: cavalo ---------- */
    var c3 = el('g', {});
    caixa(c3, 16, YV, 120, 'Precursor', '(incolor)');
    seta(c3, 138, 218, YS, 'enzimas', '');
    caixa(c3, 220, YV, 160, 'Pigmento', 'B_ preto · bb marrom');
    seta(c3, 382, 442, YS, '', '');
    caixa(c3, 444, YV, 180, 'Cor no pelo', '');
    var tr3 = el('g', {}, c3);
    el('path', { d: 'M412 90 V' + (YS - 9) + ' M400 ' + (YS - 9) + ' H424', style: 'fill:none;stroke:' + VERM + ';stroke-width:4;stroke-linecap:round' }, tr3);
    tx({ x: 412, y: 82, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:' + VERM }, 'W presente: barra a cor', tr3);
    tx({ x: 16, y: 222, 'class': 'v-lab' }, 'Égua WwBb × cavalo marrom wwbb  →  2 : 1 : 1', c3);
    var a3 = [amostra(c3, 16, 236, '#f6f3ec', 'Branco', 'Ww _ _', '1/2'), amostra(c3, 222, 236, '#26231f', 'Preto', 'wwBb', '1/4'), amostra(c3, 428, 236, '#6e4326', 'Marrom', 'wwbb', '1/4')];
    var b3 = tx({ x: 16, y: 334, 'class': 'v-sub forte' }, '', c3);
    /* ---------- fluxo: bolinhas andando pela via ---------- */
    var bol = [];
    for (var i = 0; i < 6; i++) bol.push(el('circle', { r: 6, cy: YS, style: 'stroke:var(--folha);stroke-width:1.5' }));
    function corDe(x, cena) {
      if (x < 218) return '#d8d2c4';                       /* precursor incolor */
      if (cena === 2) return x < 442 ? '#f2c94c' : '#e08a2e';
      return cena === 1 ? '#5c5a55' : '#3b2a1e';
    }
    var desenha0 = function (t) {
      var cena = t < 5 ? 1 : t < 10 ? 2 : 3, tl = t - (cena - 1) * 5, trav = tl >= 2.5;
      c1.style.display = cena === 1 ? '' : 'none'; c2.style.display = cena === 2 ? '' : 'none'; c3.style.display = cena === 3 ? '' : 'none';
      var limite = 600;
      if (cena === 1) {
        titulo.textContent = 'Rato: epistasia recessiva';
        sub.textContent = trav ? 'aa trava a primeira etapa: não há pigmento nenhum.' : 'Com A (A_), a via funciona e o gene B decide a cor.';
        tr1.style.opacity = trav ? 1 : 0;
        a1.forEach(function (a, k) { a.r.style.opacity = 1; a.r.style.strokeWidth = (trav ? k === 2 : k < 2) ? 4 : 1.5; });
        b1.textContent = trav ? 'aa é epistático: esconde o efeito do gene B.' : 'Preto precisa de bb E de pelo menos um A: A_bb.';
        if (trav) limite = 172;
      } else if (cena === 2) {
        titulo.textContent = 'Fenótipo Bombaim: epistasia recessiva';
        sub.textContent = trav ? 'hh trava a primeira etapa: não se forma antígeno H.' : 'O antígeno H é a matéria-prima dos antígenos A e B.';
        tr2.style.opacity = trav ? 1 : 0;
        gH1.style.display = trav ? 'none' : ''; gH2.style.display = trav ? '' : 'none';
        b2.textContent = trav ? 'O Bombaim produz anti-H: só recebe sangue Bombaim.' : 'Sangue O comum tem muito antígeno H nas hemácias.';
        if (trav) limite = 172;
      } else {
        titulo.textContent = 'Cavalo: epistasia dominante';
        sub.textContent = trav ? 'Basta um W (W_): a cor não se manifesta. Pelo branco.' : 'ww: nada barra a via; B_ dá preto e bb dá marrom.';
        tr3.style.opacity = trav ? 1 : .18;
        a3.forEach(function (a, k) { a.r.style.strokeWidth = (trav ? k === 0 : k > 0) ? 4 : 1.5; });
        b3.textContent = trav ? 'Metade da prole é Ww: branca, seja B_ ou bb.' : 'Metade é ww: wwBb preto (1/4) e wwbb marrom (1/4).';
        if (trav) limite = 404;
      }
      /* bolinhas: entram pela esquerda e seguem ate o fim da via ou ate a trava */
      var x0 = 60, x1 = 560;
      bol.forEach(function (b, k) {
        var u = ((tl * 0.42 + k / 6) % 1), x = x0 + (x1 - x0) * u, op = 1;
        if (x > limite) { x = limite; op = 0; }
        else if (x > limite - 40 && limite < 600) op = (limite - x) / 40;
        /* esconde as bolinhas dentro das caixas (aparecem so nas setas e na entrada) */
        var dentro = (x > 138 && x < 218) || (x > 382 && x < 442);
        b.setAttribute('cx', x.toFixed(1));
        b.style.fill = corDe(x, cena);
        b.style.opacity = dentro ? op.toFixed(2) : 0;
      });
    };
    /* etapa final: so a resposta da questao aberta (qid) */
    var RESP = {"W1ec0025": {"s": [0.1, 2.4], "c": 0, "t": "Resposta A: AAbb e Aabb", "b": "Preto exige bb E um A: A_bb (aabb é albino)."}, "Weac4700": {"s": [2.6, 4.9], "c": 0, "t": "Resposta D", "b": "Um gene impede a ação de outro gene, que não é seu alelo."}, "P795d91f": {"s": [7.6, 9.9], "c": 1, "t": "Resposta D", "b": "O Bombaim faz anti-H: aglutina o sangue O comum."}, "P2b8819d": {"s": [12.6, 14.9], "c": 2, "t": "Resposta D: 2 : 1 : 1", "b": "1/2 branco (Ww), 1/4 preto, 1/4 marrom."}}, R = RESP[qid];
    return function (t) {
      if (t < 15 || !R) { desenha0(Math.min(t, 15 - .01)); return; }
      desenha0(R.s[0] + ((t - 15) % (R.s[1] - R.s[0])));
      titulo.textContent = R.t;
      [b1, b2, b3][R.c].textContent = R.b;
    };
  }
};
VIS.liga('epistasia-via-pigmento', ['P2b8819d', 'W1ec0025', 'P795d91f', 'Weac4700']);
