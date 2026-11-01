VIS.def['vacina-soro-memoria'] = {
  tit: 'Memória imunológica e a diferença entre vacina e soro',
  fontes: ['OpenStax Biology 2e, 42.2 Adaptive Immune Response — https://openstax.org/books/biology-2e/pages/42-2-adaptive-immune-response', 'OpenStax Microbiology, 18.5 Vaccines — https://openstax.org/books/microbiology/pages/18-5-vaccines'],
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app (curvas esquemáticas, sem escala).',
  marcas: [[0, '1º contato'], [3.2, '2º contato'], [7.2, 'Vacina × soro']],
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var TXT = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var C1 = '#2f7fbf', C2 = '#c2410c';

    /* ============ cena A: resposta primaria x secundaria ============ */
    var A = el('g', {});
    var X0 = 62, X1 = 372, Y0 = 286, YT = 70;
    el('line', { x1: X0, x2: X0, y1: YT - 6, y2: Y0, style: 'stroke:var(--tinta);stroke-width:1.5' }, A);
    el('line', { x1: X0, x2: X1, y1: Y0, y2: Y0, style: 'stroke:var(--tinta);stroke-width:1.5' }, A);
    tx({ x: X0 - 6, y: YT - 16, style: 'font-size:13.5px;font-weight:600;' + LAP }, 'anticorpos no sangue', A);
    tx({ x: X1, y: Y0 + 20, 'text-anchor': 'end', style: 'font-size:13px;' + LAP }, 'tempo', A);
    /* exposicoes */
    var E1 = 84, E2 = 228;
    function seta(x, txt1, txt2) {
      var g = el('g', { style: 'opacity:0' }, A);
      el('path', { d: 'M' + x + ' ' + (Y0 + 30) + ' V' + (Y0 + 6) + ' m-6 8 l6 -8 l6 8', style: 'fill:none;stroke:var(--ad-t);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round' }, g);
      tx({ x: x, y: Y0 + 46, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;fill:var(--ad-t)' }, txt1, g);
      tx({ x: x, y: Y0 + 62, 'text-anchor': 'middle', style: 'font-size:13px;' + LAP }, txt2, g);
      return g;
    }
    var s1 = seta(E1, '1º contato', 'com o antígeno'), s2 = seta(E2, '2º contato', 'mesmo antígeno');
    function ab(x) {   /* curva: primaria baixa e atrasada; secundaria rapida e alta */
      var y = 0, u;
      if (x > E1 + 22) { u = (x - E1 - 22) / 34; y += 44 * (u < 1 ? ease(u) : Math.exp(-(x - E1 - 56) / 55)); }
      if (x > E2 + 6) { u = (x - E2 - 6) / 20; y += 196 * (u < 1 ? ease(u) : Math.exp(-(x - E2 - 26) / 120)); }
      return y;
    }
    var curva = el('path', { style: 'fill:none;stroke:var(--ad-c);stroke-width:3.5;stroke-linejoin:round' }, A);
    var area = el('path', { style: 'fill:var(--ad-c);opacity:.12' }, A);
    var rot1 = el('g', { style: 'opacity:0' }, A);
    tx({ x: E1 + 46, y: Y0 - 64, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;' + TXT }, 'primária', rot1);
    tx({ x: E1 + 46, y: Y0 - 48, 'text-anchor': 'middle', style: 'font-size:13px;' + LAP }, 'lenta e baixa', rot1);
    var rot2 = el('g', { style: 'opacity:0' }, A);
    tx({ x: E2 + 34, y: YT - 2, 'text-anchor': 'start', style: 'font-size:13.5px;font-weight:700;' + TXT }, 'secundária', rot2);
    tx({ x: E2 + 34, y: YT + 14, 'text-anchor': 'start', style: 'font-size:13px;' + LAP }, 'rápida e intensa', rot2);
    /* celulas de memoria */
    var mem = [];
    for (var i = 0; i < 5; i++) mem.push(el('circle', { cx: 122 + i * 14, cy: Y0 - 118, r: 5, style: 'fill:' + C1 + ';opacity:0' }, A));
    var memT = tx({ x: 114, y: Y0 - 132, style: 'font-size:13px;font-weight:600;fill:' + C1 + ';opacity:0' }, 'células de memória', A);
    /* painel */
    var PX = 404;
    var fase = tx({ x: PX, y: 64, style: 'font-size:22px;font-weight:700;' + TXT }, '', A);
    var L = [];
    for (i = 0; i < 7; i++) L.push(tx({ x: PX, y: 94 + i * 21, style: 'font-size:14.5px;' + TXT }, '', A));

    /* ============ cena B: vacina x soro ============ */
    var B = el('g', {});
    function coluna(x, cor, titulo, sub, tipo, linhas) {
      var g = el('g', {}, B);
      tx({ x: x, y: 30, style: 'font-size:21px;font-weight:700;fill:' + cor }, titulo, g);
      tx({ x: x, y: 50, style: 'font-size:14px;' + LAP }, sub, g);
      var gx0 = x + 4, gx1 = x + 270, gy0 = 150, gyt = 70;
      el('line', { x1: gx0, x2: gx0, y1: gyt, y2: gy0, style: 'stroke:var(--tinta);stroke-width:1.2' }, g);
      el('line', { x1: gx0, x2: gx1, y1: gy0, y2: gy0, style: 'stroke:var(--tinta);stroke-width:1.2' }, g);
      tx({ x: gx0 + 8, y: gyt + 4, style: 'font-size:13px;' + LAP }, 'anticorpos', g);
      tx({ x: gx1, y: gy0 + 17, 'text-anchor': 'end', style: 'font-size:13px;' + LAP }, 'tempo', g);
      el('path', { d: 'M' + gx0 + ' ' + (gy0 + 22) + ' V' + (gy0 + 5) + ' m-5 7 l5 -7 l5 7', style: 'fill:none;stroke:' + cor + ';stroke-width:2.2' }, g);
      tx({ x: gx0 + 10, y: gy0 + 17, style: 'font-size:13px;font-weight:600;fill:' + cor }, 'aplicação', g);
      var c = el('path', { style: 'fill:none;stroke:' + cor + ';stroke-width:3' }, g);
      var nota = tx({ style: 'font-size:13px;font-weight:600;fill:' + cor }, '', g);
      linhas.forEach(function (l, i) {
        var t = tx({ x: x, y: 196 + i * 21, style: 'font-size:14.5px;' + TXT }, '', g);
        l.forEach(function (p) { var s = el('tspan', p[1] ? { style: 'font-weight:700' } : {}, t); s.textContent = p[0]; });
      });
      return function (u) {   /* desenha a curva ate a fracao u */
        var d = '', n = 60;
        for (var k = 0; k <= n; k++) {
          var f = k / n * u, xx = gx0 + 2 + f * (gx1 - gx0 - 6), y;
          if (tipo === 'v') { var w = (f - .22) / .3; y = f < .22 ? 0 : 52 * (w < 1 ? ease(w) : 1 - .25 * (f - .52) / .48); }
          else { y = 66 * Math.exp(-f / .32) * (f < .03 ? f / .03 : 1); }
          d += (k ? 'L' : 'M') + xx.toFixed(1) + ' ' + (gy0 - 1 - y).toFixed(1) + ' ';
        }
        c.setAttribute('d', d);
        if (u > .98) {
          if (tipo === 'v') { nota.setAttribute('x', gx0 + 96); nota.setAttribute('y', gy0 - 70); nota.textContent = 'demora, mas fica memória'; }
          else { nota.setAttribute('x', gx0 + 46); nota.setAttribute('y', gy0 - 52); nota.textContent = 'na hora, mas some em semanas'; }
        } else nota.textContent = '';
      };
    }
    var cv = coluna(18, C1, 'Vacina', 'para pessoa saudável, antes do contato', 'v', [
      [['contém '], ['antígeno', 1], [' (agente morto,']],
      [['atenuado ou um pedaço dele)']],
      [['o próprio corpo faz o anticorpo:']],
      [['imunização '], ['ativa', 1], [' e '], ['preventiva', 1]]
    ]);
    var cs = coluna(338, C2, 'Soro', 'para quem já foi exposto (ex.: picada)', 's', [
      [['contém '], ['anticorpos prontos', 1], [' (do']],
      [['plasma de cavalo, por exemplo)']],
      [['age na hora, sem memória:']],
      [['imunização '], ['passiva', 1], [' e '], ['curativa', 1]]
    ]);
    el('line', { x1: 320, x2: 320, y1: 14, y2: 274, style: 'stroke:var(--linha);stroke-width:1.5' }, B);
    tx({ x: 18, y: 304, style: 'font-size:14px;' + TXT }, 'Vacina de vírus vivo atenuado (febre amarela, Qdenga) não vai para imunodeprimidos:', B);
    tx({ x: 18, y: 323, style: 'font-size:14px;' + TXT }, 'sem defesa suficiente, o vírus atenuado se multiplica demais e pode causar a doença.', B);
    tx({ x: 18, y: 342, style: 'font-size:14px;' + LAP }, 'Contra bactéria já instalada (como a da leptospirose), o tratamento é antibiótico.', B);

    var TA = 7, TB = 7.2;
    return function (t) {
      var aA = t < TA ? 1 : t < TA + .3 ? 1 - (t - TA) / .3 : 0;
      var aB = t < TB ? 0 : t < TB + .4 ? (t - TB) / .4 : t > 11.8 ? 1 - (t - 11.8) / .2 : 1;
      A.style.opacity = aA.toFixed(2); B.style.opacity = aB.toFixed(2);
      A.style.display = aA <= 0 ? 'none' : ''; B.style.display = aB <= 0 ? 'none' : '';
      if (aA > 0) {
        var tt = Math.min(t, TA);
        /* a curva avanca no tempo do grafico: x(t) */
        var xs = tt < .4 ? X0 + 4 : tt < 2.8 ? X0 + 4 + (190 - X0 - 4) * ease((tt - .4) / 2.4) : tt < 3.4 ? 190 + 40 * (tt - 2.8) / .6 : tt < 6 ? 230 + (X1 - 6 - 230) * ease((tt - 3.4) / 2.6) : X1 - 6;
        var d = '', n = 90;
        for (var k = 0; k <= n; k++) { var x = X0 + 2 + (xs - X0 - 2) * k / n; d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + (Y0 - 1 - ab(x)).toFixed(1) + ' '; }
        curva.setAttribute('d', d);
        area.setAttribute('d', d + 'L' + xs.toFixed(1) + ' ' + Y0 + ' L' + (X0 + 2) + ' ' + Y0 + 'Z');
        s1.style.opacity = tt > .1 ? 1 : 0; s2.style.opacity = tt > 3 ? 1 : 0;
        rot1.style.opacity = xs > 150 ? 1 : 0; rot2.style.opacity = xs > 262 ? 1 : 0;
        mem.forEach(function (m, i) { m.style.opacity = tt > 1.9 + i * .15 ? 1 : 0; });
        memT.style.opacity = tt > 1.9 ? 1 : 0;
        var F;
        if (tt < 1.9) F = ['1º contato', 'o antígeno chega (vacina, ou', 'o veneno injetado no cavalo)', '', 'poucos linfócitos B o reconhecem:', 'precisam ser selecionados e se', 'multiplicar; isso leva dias'];
        else if (tt < 3.1) F = ['Resposta primária', 'pouco anticorpo, e tarde', '', 'parte dos linfócitos ativados vira', 'célula de memória e fica no', 'corpo por meses ou anos', ''];
        else F = ['Resposta secundária', 'as células de memória já', 'reconhecem o antígeno: mais', 'anticorpo, e muito mais cedo', '', '*por isso o cavalo produz mais', '*soro na 2ª inoculação'];
        fase.textContent = F[0];
        for (k = 0; k < 7; k++) { var sx = F[k + 1] || '', b = sx.charAt(0) === '*'; L[k].textContent = b ? sx.slice(1) : sx; L[k].style.fontWeight = b ? '700' : '400'; }
      }
      if (aB > 0) {
        var u = ease((t - TB - .2) / 2.2);
        cv(Math.max(.001, u)); cs(Math.max(.001, u));
      }
    };
  }
};
VIS.liga('vacina-soro-memoria', ['P023b4d8', 'Wf90045d', 'P03bc2b3', 'W74692b9', 'P9c08290', 'W1980a38']);

/* etapa final: "Por isso a resposta é..." da questão aberta */
(function () {
  var V = VIS.def['vacina-soro-memoria'], m0 = V.monta, D0 = V.dur, R = {"P023b4d8": ["B", "Na 2ª inoculação do veneno o cavalo faz resposta secundária", "(células de memória): mais anticorpo, logo mais soro."], "Wf90045d": ["C", "Na 2ª injeção as células de memória já reconhecem a toxina:", "a antitoxina sai mais rápido (e em maior quantidade)."], "P03bc2b3": ["C", "Vacina leva antígenos do agente e induz resposta ativa em", "pessoas saudáveis; a cobertura cai com os movimentos antivacina."], "W74692b9": ["B", "Febre amarela: vacina (prevenção). Picada de cobra: soro", "(anticorpo pronto). Leptospirose (bactéria): antibiótico."], "P9c08290": ["E", "A vacina da febre amarela tem vírus vivo atenuado: em quem", "tem a imunidade debilitada, ele se multiplica e causa a doença."], "W1980a38": ["E", "Vacina contém antígenos (fragmentos do agente) e faz o", "próprio corpo produzir anticorpos: imunização ativa."]};
  V.dur = D0 + 2.6; V.marcas = V.marcas.concat([[D0, 'Resposta']]);
  V.monta = function (svg, qid) {
    var d = m0(svg, qid), NS = 'http://www.w3.org/2000/svg', r = R[qid];
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    var g = el('g', { style: 'display:none' });
    el('rect', { x: 0, y: 0, width: 640, height: 360, style: 'fill:var(--folha);opacity:.86' }, g);
    el('rect', { x: 36, y: 92, width: 568, height: 168, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, g);
    var t0 = el('text', { x: 60, y: 128, style: 'font-size:15px;font-weight:600;fill:var(--lapis)' }, g);
    var t1 = el('text', { x: 60, y: 162, style: 'font-size:23px;font-weight:700;fill:var(--ad-t)' }, g);
    var t2 = el('text', { x: 60, y: 202, style: 'font-size:15.5px;fill:var(--tinta)' }, g);
    var t3 = el('text', { x: 60, y: 226, style: 'font-size:15.5px;fill:var(--tinta)' }, g);
    t0.textContent = r ? 'Por isso, a resposta é' : 'Resumo';
    if (r) { t1.textContent = r[0]; t2.textContent = r[1]; t3.textContent = r[2] || ''; }
    return function (t) {
      if (t < D0) { g.style.display = 'none'; d(t); return; }
      d(D0 - .35); svg.style.opacity = 1; g.style.display = r ? '' : 'none';
      g.style.opacity = Math.min(1, (t - D0) / .3).toFixed(2);
    };
  };
})();
