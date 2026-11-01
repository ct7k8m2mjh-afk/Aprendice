/* Curva de dissociacao da hemoglobina (sigmoide) e efeito Bohr */
VIS.def['curva-hemoglobina-bohr'] = {
  tit: 'Curva de dissociação da hemoglobina e efeito Bohr',
  tipo: 'anim', dur: 13.5,
  marcas: [[0, 'Curva normal'], [3.5, 'Tecido ativo: efeito Bohr'], [8, 'Pulmão'], [11, 'Resposta']],
  fontes: [
    'OpenStax Anatomy and Physiology 2e, 22.5 Transport of Gases (curva de dissociação, efeito Bohr) — https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases'
  ],
  cred: 'Animação feita para o app. Curva calculada pela equação de Hill (P50 ≈ 27 mmHg, n ≈ 2,7); valores típicos de repouso.',
  nota: 'Lado esquerdo do coração (veias pulmonares, átrio e ventrículo esquerdos, aorta): sangue no alto da curva. Lado direito (cavas, átrio e ventrículo direitos, artéria pulmonar) e órgãos como músculo e fígado: sangue na parte íngreme, já descarregado.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var VERM = '#d2433b', AZ = '#5e6fa8';
    var X0 = 64, X1 = 364, Y0 = 290, Y1 = 30;
    function gx(p) { return X0 + (X1 - X0) * p / 120; }
    function gy(s) { return Y0 - (Y0 - Y1) * s / 100; }
    function sat(p, p50) { var a = Math.pow(p / p50, 2.7); return 100 * a / (1 + a); }
    /* eixos e grade */
    for (var s = 0; s <= 100; s += 25) {
      el('line', { x1: X0, x2: X1, y1: gy(s), y2: gy(s), style: 'stroke:var(--linha);stroke-width:1' });
      tx({ x: X0 - 8, y: gy(s) + 5, 'text-anchor': 'end', style: 'font-size:13px;fill:var(--lapis)' }, s + '%');
    }
    for (var p = 0; p <= 120; p += 20) tx({ x: gx(p), y: Y0 + 20, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, p);
    el('path', { d: 'M' + X0 + ' ' + Y1 + ' V' + Y0 + ' H' + X1, style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' });
    tx({ x: (X0 + X1) / 2, y: Y0 + 42, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:600;fill:var(--tinta)' }, 'PO₂ (mmHg)');
    tx({ x: 16, y: 18, style: 'font-size:13px;font-weight:600;fill:var(--tinta)' }, 'Saturação da hemoglobina');
    /* linhas de referencia: tecidos ~40 e pulmao ~100 */
    el('line', { x1: gx(40), x2: gx(40), y1: Y1 + 10, y2: Y0, style: 'stroke:var(--lapis);stroke-width:1.5;stroke-dasharray:5 4' });
    el('line', { x1: gx(100), x2: gx(100), y1: Y1 + 10, y2: Y0, style: 'stroke:var(--lapis);stroke-width:1.5;stroke-dasharray:5 4' });
    tx({ x: gx(40) + 6, y: Y0 - 10, style: 'font-size:13px;font-weight:600;fill:var(--lapis)' }, 'tecidos');
    tx({ x: gx(100) - 6, y: Y0 - 10, 'text-anchor': 'end', style: 'font-size:13px;font-weight:600;fill:var(--lapis)' }, 'pulmão');
    /* curvas */
    var cNormal = el('path', { style: 'fill:none;stroke:var(--lapis);stroke-width:2;stroke-dasharray:6 5' });
    var cAtual = el('path', { style: 'fill:none;stroke:var(--ad-c);stroke-width:3.5;stroke-linecap:round' });
    function curva(p50) { var d = ''; for (var k = 0; k <= 120; k++) { var pp = Math.max(.01, k); d += (k ? 'L' : 'M') + gx(pp).toFixed(1) + ' ' + gy(sat(pp, p50)).toFixed(1) + ' '; } return d; }
    cNormal.setAttribute('d', curva(26.8));
    var tNormal = tx({ x: gx(62), y: gy(sat(62, 26.8)) - 10, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, 'normal');
    /* pontos */
    var pArt = el('circle', { r: 7, cx: gx(100), style: 'fill:' + VERM + ';stroke:var(--folha);stroke-width:2' });
    var pVen = el('circle', { r: 7, cx: gx(40), style: 'fill:' + AZ + ';stroke:var(--folha);stroke-width:2' });
    var lArt1 = tx({ x: gx(100), y: 20, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;fill:' + VERM }, 'arterial ≈ 97%');
    var lVen1 = tx({ x: gx(40) + 14, style: 'font-size:13px;font-weight:700;fill:' + AZ });
    var chave = el('path', { style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' });
    var chaveT = tx({ style: 'font-size:13px;font-weight:600;fill:var(--tinta)' });
    /* painel */
    var PX = 394;
    var fase = tx({ x: PX, y: 40, 'class': 'v-fase' });
    var L = []; for (var i = 0; i < 5; i++) L.push(tx({ x: PX, y: 68 + i * 20, 'class': 'v-sub' }));
    var eq = el('g', {});
    el('rect', { x: PX - 6, y: 186, width: 240, height: 92, rx: 10, style: 'fill:color-mix(in srgb,var(--tinta) 5%,transparent)' }, eq);
    tx({ x: PX + 114, y: 214, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:600;fill:var(--tinta)' }, 'HbH⁺ + O₂  ⇌  HbO₂ + H⁺', eq);
    var setaEq = el('path', { style: 'fill:none;stroke:var(--ad-t);stroke-width:3;stroke-linecap:round;stroke-linejoin:round' }, eq);
    var eqT = tx({ x: PX + 114, y: 266, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:600;fill:var(--ad-t)' }, '', eq);
    var rodape = tx({ x: PX, y: 308, 'class': 'v-sub forte' }), rodape2 = tx({ x: PX, y: 328, 'class': 'v-sub forte' });
    function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); }
    var desenha0 = function (t) {
      var b = t < 3.5 ? 0 : t < 5 ? ease((t - 3.5) / 1.5) : t < 8 ? 1 : 1 - ease((t - 8) / 1.5);
      var p50 = 26.8 + 9.5 * b;
      cAtual.setAttribute('d', curva(p50));
      cNormal.style.opacity = tNormal.style.opacity = b > .05 ? 1 : 0;
      var sA = sat(100, 26.8), sV = sat(40, p50);   /* o sangue carrega no pulmao (curva normal) e descarrega no tecido */
      pArt.setAttribute('cy', gy(sA).toFixed(1));
      pVen.setAttribute('cy', gy(sV).toFixed(1));
      lArt1.textContent = 'arterial ≈ ' + Math.round(sA) + '%';
      lVen1.setAttribute('y', (gy(sV) + 5).toFixed(1));
      lVen1.textContent = 'venoso ≈ ' + Math.round(sV) + '%';
      /* chave: quanto O2 a hemoglobina entregou entre o pulmao e o tecido */
      var xc = gx(40) - 14;
      chave.setAttribute('d', 'M' + (xc + 6) + ' ' + gy(sA) + ' H' + xc + ' V' + gy(sV) + ' H' + (xc + 6));
      chaveT.setAttribute('x', xc - 6); chaveT.setAttribute('y', ((gy(sA) + gy(sV)) / 2 + 5).toFixed(1)); chaveT.setAttribute('text-anchor', 'end');
      chaveT.textContent = 'cede ' + (Math.round(sA) - Math.round(sV)) + '%';
      var nome, l;
      if (t < 3.5) {
        nome = 'Curva em S'; l = ['No pulmão (PO₂ ≈ 100) a Hb sai', 'quase saturada. Nos tecidos', '(PO₂ ≈ 40) cai na parte íngreme', 'e solta O₂.', ''];
        setaEq.setAttribute('d', ''); eqT.textContent = 'equilíbrio de repouso';
        rodape.textContent = ''; rodape2.textContent = '';
      } else if (t < 8) {
        nome = 'Efeito Bohr'; l = ['Tecido ativo: mais CO₂ e H⁺', '(pH menor); o calor ajuda.', 'A curva vai para a DIREITA:', 'na mesma PO₂, a Hb segura', 'menos O₂ e entrega mais.'];
        setaEq.setAttribute('d', 'M' + (PX + 190) + ' 236 H' + (PX + 40) + ' m10 -7 l-10 7 l10 7');
        eqT.textContent = 'mais H⁺: desloca para a esquerda';
        rodape.textContent = 'Nos tecidos: favorece HbH⁺'; rodape2.textContent = '(forma protonada) e solta O₂.';
      } else {
        nome = 'No pulmão'; l = ['O CO₂ sai, o H⁺ cai e a curva', 'volta para a esquerda:', 'a Hb pega O₂ com facilidade.', '', ''];
        setaEq.setAttribute('d', 'M' + (PX + 40) + ' 236 H' + (PX + 190) + ' m-10 -7 l10 7 l-10 7');
        eqT.textContent = 'menos H⁺: desloca para a direita';
        rodape.textContent = 'No pulmão: favorece HbO₂.'; rodape2.textContent = '';
      }
      fase.textContent = nome;
      for (var k = 0; k < 5; k++) L[k].textContent = l[k];
    };
    /* etapa final: so a resposta da questao aberta (qid) */
    var RESP = {"P75373c7": {"s": [6, 7.9], "a": "Nos tecidos o CO₂ gera H⁺:", "b": "favorece HbH⁺ (resposta D)."}, "Pf1de617": {"s": [1, 3.4], "a": "X ≈ 98%: ventrículo esquerdo;", "b": "Y ≈ 71%: fígado (resposta D)."}}, R = RESP[qid];
    return function (t) {
      if (t < 11 || !R) { desenha0(Math.min(t, 11 - .01)); return; }
      desenha0(R.s[0] + ((t - 11) % (R.s[1] - R.s[0])));
      fase.textContent = 'Resposta D';
      rodape.textContent = R.a; rodape2.textContent = R.b;
    };
  }
};
VIS.liga('curva-hemoglobina-bohr', ['P75373c7', 'Pf1de617']);
