VIS.def['resistencia-bacteriana-selecao'] = {
  tit: 'Resistência a antibiótico: a mutação vem antes, o remédio só seleciona',
  tipo: 'anim', dur: 12, cred: 'Animação feita para o app (esquema fora de escala; o número de bactérias é ilustrativo).',
  fontes: ['CDC, About Antimicrobial Resistance (o remédio mata os sensíveis; os resistentes sobrevivem, se multiplicam e passam genes de resistência) — https://www.cdc.gov/antimicrobial-resistance/about/index.html'],
  marcas: [[0, 'Mutações ao acaso'], [3, 'Antibiótico'], [5.6, 'Multiplicação'], [9, 'Nova dose']],
  nota: 'O antibiótico não cria a resistência: as mutações surgem ao acaso, com ou sem remédio. O uso prolongado e repetido só elimina as sensíveis e deixa as resistentes se multiplicarem (seleção natural).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var CX = 172, CY = 180, R = 150;
    var T1 = 3, T2 = 5.6, T3 = 9, FIM = 12;
    /* placa de cultura */
    el('circle', { cx: CX, cy: CY, r: R + 6, style: 'fill:none;stroke:var(--linha);stroke-width:3' });
    var meio = el('circle', { cx: CX, cy: CY, r: R, style: 'fill:#f6efd9;stroke:#d8cba3;stroke-width:1.5' });
    var droga = el('circle', { cx: CX, cy: CY, r: R, style: 'fill:#4f8fc6;opacity:0' });
    var drogaT = tx({ x: CX, y: CY + R - 14, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:600;fill:#1f5f99;opacity:0' }, 'antibiótico no meio');
    /* posicoes (grade com leve desvio, deterministica) */
    var sem = 7; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    var P = [];
    for (var gx = -4; gx <= 4; gx++) for (var gy = -4; gy <= 4; gy++) {
      var x = gx * 31 + (rnd() - .5) * 12, y = gy * 30 + (rnd() - .5) * 12;
      if (x * x + y * y < 124 * 124 && !(y > 100)) P.push({ x: CX + x, y: CY + y - 6, a: Math.floor(rnd() * 180), ini: rnd() < .72 });
    }
    /* 4 resistentes iniciais, espalhadas; momento da mutacao */
    var mut = [[-62, -58, .5], [70, -30, 1.1], [-30, 60, 1.7], [58, 70, 2.3]], res0 = [];
    mut.forEach(function (m) {
      var best = -1, bd = 1e9;
      P.forEach(function (p, i) { if (!p.ini || p.r0) return; var d = Math.pow(p.x - CX - m[0], 2) + Math.pow(p.y - CY - m[1], 2); if (d < bd) { bd = d; best = i; } });
      P[best].r0 = true; P[best].tm = m[2]; res0.push(P[best]);
    });
    var dmax = 0;
    P.forEach(function (p) {
      var d = 1e9; res0.forEach(function (r) { d = Math.min(d, Math.hypot(p.x - r.x, p.y - r.y)); }); p.d = d; dmax = Math.max(dmax, d);
      p.tn = p.r0 ? 0 : T2 + .3 + 2.9 * d / dmax;   /* quando uma descendente resistente ocupa o lugar */
      p.tk = T1 + .2 + 1.9 * ((p.x - CX + 130) / 260);   /* morte das sensiveis: frente do antibiotico */
      p.g = el('g', {});
      p.b = el('rect', { x: -12, y: -5.5, width: 24, height: 11, rx: 5.5 }, p.g);
    });
    var anel = el('circle', { r: 17, style: 'fill:none;stroke:#b4442f;stroke-width:2.5;opacity:0' });
    var anelT = tx({ style: 'font-size:14px;font-weight:700;fill:#b4442f;opacity:0', 'text-anchor': 'middle' }, 'mutação');
    /* painel */
    var px = 356;
    var fase = tx({ 'class': 'v-fase', x: px, y: 40 }), f2 = tx({ 'class': 'v-sub', x: px, y: 64 }), f3 = tx({ 'class': 'v-sub', x: px, y: 83 });
    /* legenda no desenho do painel: contagem */
    var cy0 = 112;
    el('rect', { x: px, y: cy0 - 11, width: 20, height: 10, rx: 5, style: 'fill:#9cc59a;stroke:#5f8f5c;stroke-width:1.2' });
    var cS = tx({ 'class': 'v-sub', x: px + 28, y: cy0 });
    el('rect', { x: px + 140, y: cy0 - 11, width: 20, height: 10, rx: 5, style: 'fill:#c8603e;stroke:#8e3a20;stroke-width:1.2' });
    var cR = tx({ 'class': 'v-sub', x: px + 168, y: cy0 });
    /* grafico */
    var gx0 = px + 8, gy0 = 262, gw = 262, gh = 112;
    tx({ 'class': 'v-lab', x: px, y: 140 }, 'Nº de bactérias na placa');
    el('line', { x1: gx0, y1: gy0, x2: gx0 + gw, y2: gy0, style: 'stroke:var(--lapis);stroke-width:1.5' });
    el('line', { x1: gx0, y1: gy0, x2: gx0, y2: gy0 - gh, style: 'stroke:var(--lapis);stroke-width:1.5' });
    tx({ x: gx0 + gw, y: gy0 + 18, 'text-anchor': 'end', style: 'font-size:13px;fill:var(--lapis)' }, 'tempo');
    function ax(t) { return gx0 + gw * t / FIM; }
    [[T1, '1ª dose'], [T3, '2ª dose']].forEach(function (m) {
      el('line', { x1: ax(m[0]), x2: ax(m[0]), y1: gy0, y2: gy0 - gh, style: 'stroke:#4f8fc6;stroke-width:1.5;stroke-dasharray:4 4' });
      tx({ x: ax(m[0]) + 4, y: gy0 - gh + 12, style: 'font-size:13px;font-weight:600;fill:#1f5f99' }, m[1]);
    });
    function N(t) {   /* total vivo, de 0 a 1 */
      var s = 0, r = 0; P.forEach(function (p) { var v = estado(p, t); if (v.vivo) { if (v.res) r++; else s++; } }); return [s, r];
    }
    var curva = el('path', { style: 'fill:none;stroke:var(--ad-c);stroke-width:3;stroke-linejoin:round' });
    var ponto = el('circle', { r: 5, style: 'fill:var(--tinta)' });
    var b1 = tx({ 'class': 'v-sub', x: px, y: 296 }), b2 = tx({ 'class': 'v-sub', x: px, y: 315 }), b3 = tx({ 'class': 'v-sub forte', x: px, y: 334 });
    function estado(p, t) {
      if (p.r0) return { vivo: true, res: t >= p.tm, nova: 0 };
      if (p.ini && t < p.tk) return { vivo: true, res: false };
      if (p.ini && t < p.tk + .6) return { vivo: false, morre: (t - p.tk) / .6, res: false };
      if (t >= p.tn) return { vivo: true, res: true, nova: Math.min(1, (t - p.tn) / .45) };
      return { vivo: false, res: false, sumiu: p.ini };
    }
    var NMAX = P.length, pts = [];
    for (var k = 0; k <= 120; k++) { var tt = FIM * k / 120, c = N(tt); pts.push([tt, (c[0] + c[1]) / NMAX]); }
    return function (t) {
      var cs = 0, cr = 0;
      P.forEach(function (p) {
        var v = estado(p, t), s = 1, op = 1, f, st;
        if (v.vivo) {
          if (v.res) { f = '#c8603e'; st = '#8e3a20'; if (v.nova !== undefined && v.nova < 1 && !p.r0) s = .35 + .65 * v.nova; cr++; }
          else { f = '#9cc59a'; st = '#5f8f5c'; cs++; }
          p.b.setAttribute('style', 'fill:' + f + ';stroke:' + st + ';stroke-width:1.4');
        } else if (v.morre !== undefined) {
          s = 1 + .25 * v.morre; op = 1 - v.morre;
          p.b.setAttribute('style', 'fill:none;stroke:#7d7d7d;stroke-width:1.4;stroke-dasharray:3 3');
        } else op = 0;
        p.g.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + p.a + ') scale(' + s.toFixed(2) + ')');
        p.g.style.opacity = op.toFixed(2);
      });
      /* anel de mutacao */
      var am = null; res0.forEach(function (r) { if (t >= r.tm - .05 && t < r.tm + .55) am = r; });
      if (am && t < T1) {
        var u = (t - am.tm + .05) / .6; anel.setAttribute('cx', am.x); anel.setAttribute('cy', am.y); anel.setAttribute('r', (13 + 8 * u).toFixed(1));
        anel.style.opacity = (1 - u).toFixed(2); anelT.setAttribute('x', am.x); anelT.setAttribute('y', am.y - 22); anelT.style.opacity = (1 - u * .6).toFixed(2);
      } else { anel.style.opacity = 0; anelT.style.opacity = 0; }
      /* antibiotico */
      var dz = 0;
      if (t >= T1 && t < T2) dz = Math.min(1, (t - T1) / .5); else if (t >= T2 && t < T3) dz = Math.max(0, 1 - (t - T2) / .8); else if (t >= T3) dz = Math.min(1, (t - T3) / .5);
      droga.style.opacity = (.16 * dz).toFixed(3); drogaT.style.opacity = dz.toFixed(2);
      var nome, s1, s2, L;
      if (t < T1) { nome = 'Antes do remédio'; s1 = 'mutações surgem ao acaso, sem'; s2 = 'antibiótico: algumas já resistem'; L = ['A variação já existe na', 'população antes de qualquer', 'contato com o antibiótico.']; }
      else if (t < T2) { nome = 'Antibiótico aplicado'; s1 = 'as sensíveis morrem;'; s2 = 'as resistentes sobrevivem'; L = ['O remédio não muda o DNA', 'de ninguém: ele só elimina', 'quem não era resistente.']; }
      else if (t < T3) { nome = 'Multiplicação'; s1 = 'as sobreviventes se dividem e'; s2 = 'passam o gene às descendentes'; L = ['A população volta a crescer,', 'agora só com resistentes', '(descendentes das sobreviventes).']; }
      else { nome = 'Nova dose'; s1 = 'o mesmo antibiótico já não mata:'; s2 = 'a população é resistente'; L = ['Uso repetido ou prolongado', 'de vários antibióticos seleciona', 'multirresistentes: as "superbactérias".']; }
      fase.textContent = nome; f2.textContent = s1; f3.textContent = s2;
      var PR = { P999b3de: ['Mutação ao acaso + exposição', 'prolongada ao remédio = seleção.', 'Por isso a resposta é C.'], W1125f49: ['O remédio só escolhe quem já', 'era resistente: seleção natural.', 'Por isso a resposta é B.'], Wc3a0965: ['O antibiótico não altera o DNA:', 'seleciona genes de resistência.', 'Por isso a resposta é E.'], Wb390f93: ['Superbactéria = multirresistente,', 'resiste a vários antibióticos.', 'Por isso a resposta é C.'] }[qid];
      if (PR && t >= 10.4) { nome = 'Por isso'; L = PR; fase.textContent = nome; }
      b1.textContent = L[0]; b2.textContent = L[1]; b3.textContent = L[2];
      cS.textContent = 'sensíveis: ' + cs; cR.textContent = 'resistentes: ' + cr;
      var d = ''; for (var k = 0; k < pts.length && pts[k][0] <= t + 1e-6; k++) d += (k ? 'L' : 'M') + ax(pts[k][0]).toFixed(1) + ' ' + (gy0 - 10 - (gh - 34) * pts[k][1]).toFixed(1) + ' ';
      var cn = (cs + cr) / NMAX, yy = gy0 - 10 - (gh - 34) * cn;
      d += (d ? 'L' : 'M') + ax(t).toFixed(1) + ' ' + yy.toFixed(1);
      curva.setAttribute('d', d); ponto.setAttribute('cx', ax(t).toFixed(1)); ponto.setAttribute('cy', yy.toFixed(1));
    };
  }
};
VIS.liga('resistencia-bacteriana-selecao', ['P999b3de', 'W1125f49', 'Wc3a0965', 'Wb390f93']);
