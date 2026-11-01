VIS.def['especiacao-alopatrica'] = {
  tit: 'Especiação alopátrica: da barreira ao isolamento reprodutivo',
  tipo: 'anim', dur: 12, cred: 'Animação feita para o app (esquema fora de escala: o processo real leva milhares de gerações). As cores representam diferenças hereditárias.',
  fontes: ['OpenStax Biology 2e, 18.2 Formation of New Species (especiação alopátrica e simpátrica; híbridos) — https://openstax.org/books/biology-2e/pages/18-2-formation-of-new-species'],
  marcas: [[0, 'Uma população'], [2.4, 'Barreira'], [4, 'Divergência'], [8.2, 'Reencontro']],
  nota: 'Isolamento geográfico (a barreira) vem primeiro; especiação só existe quando surge o isolamento reprodutivo. Se, ao se reencontrarem, ainda gerarem híbridos férteis (como as raposas do cerrado e dos pampas), o isolamento reprodutivo ainda não se completou. Na especiação simpátrica não há barreira geográfica.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function mix(a, b, u) { return [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * u); }); }
    function rgb(c) { return 'rgb(' + c.join(',') + ')'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var TB = 2.4, TD = 4, TR = 8.2;
    var L = 14, R = 396, TOP = 52, BOT = 300, MID = 205, BW = 26;
    /* terreno */
    el('rect', { x: L, y: TOP, width: R - L, height: BOT - TOP, rx: 12, style: 'fill:#eef0dc;stroke:#cfd3ad;stroke-width:1.5' });
    /* barreira: rio */
    var rio = el('path', { style: 'fill:#8fb8d8;stroke:#5f93bd;stroke-width:1.5' });
    var rioT = tx({ x: MID, y: 40, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:#2f6fa8' });
    /* fluxo genico */
    var fluxo = el('path', { d: 'M150 324 H260 m-10 -7 l10 7 l-10 7 M150 324 m10 -7 l-10 7 l10 7', style: 'fill:none;stroke:var(--ad-t);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round' });
    var fluxoX = el('path', { d: 'M193 312 l24 24 M217 312 l-24 24', style: 'fill:none;stroke:#b4442f;stroke-width:3.5;stroke-linecap:round' });
    var fluxoT = tx({ x: 270, y: 329, style: 'font-size:14px;font-weight:600;fill:var(--ad-t)' });
    var fluxoT0 = tx({ x: 140, y: 329, 'text-anchor': 'end', style: 'font-size:14px;font-weight:600;fill:var(--ad-t)' });
    /* individuos */
    var sem = 11; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    var ANC = [138, 150, 96], CE = [58, 104, 168], CD = [196, 98, 50], P = [];
    for (var i = 0; i < 34; i++) {
      var lado = i < 17 ? -1 : 1;
      var bx = lado < 0 ? L + 22 + rnd() * (MID - BW / 2 - L - 44) : MID + BW / 2 + 22 + rnd() * (R - MID - BW / 2 - 44);
      var o = { lado: lado, bx: bx, by: TOP + 22 + rnd() * (BOT - TOP - 44), ax: 26 + rnd() * 40, ay: 8 + rnd() * 14, w: .6 + rnd() * .8, f: rnd() * 6.28, tc: TD + .3 + rnd() * 3.4, l: (rnd() - .5) * 26 };
      o.c = el('circle', { r: 7.5, style: 'stroke:rgba(0,0,0,.35);stroke-width:1' });
      P.push(o);
    }
    /* par que se reencontra */
    var pE = P[3], pD = P[20];
    var cruz = el('path', { style: 'fill:none;stroke:#b4442f;stroke-width:3.5;stroke-linecap:round' });
    var HALO = ';paint-order:stroke;stroke:#eef0dc;stroke-width:5px;stroke-linejoin:round';
    var cruzT = tx({ x: MID, y: TOP + 92, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:#b4442f' + HALO });
    var cruzT2 = tx({ x: MID, y: TOP + 109, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:#b4442f' + HALO });
    /* painel */
    var px = 420;
    var fase = tx({ x: px, y: 40, style: 'font-size:20px;font-weight:700;fill:var(--tinta)' });
    var s = [0, 1, 2, 3].map(function (k) { return tx({ 'class': 'v-sub', x: px, y: 66 + k * 19 }); });
    tx({ 'class': 'v-lab', x: px, y: 168 }, 'Diferença genética acumulada');
    el('rect', { x: px, y: 178, width: 206, height: 14, rx: 7, style: 'fill:color-mix(in srgb,var(--tinta) 9%,transparent)' });
    var bar = el('rect', { x: px, y: 178, height: 14, rx: 7, style: 'fill:var(--ad-c)' });
    var lim = px + 206 * .72;
    el('line', { x1: lim, x2: lim, y1: 172, y2: 198, style: 'stroke:#b4442f;stroke-width:2;stroke-dasharray:4 3' });
    tx({ x: lim, y: 216, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:600;fill:#b4442f' }, 'isolamento reprodutivo');
    var b = [0, 1, 2, 3, 4].map(function (k) { return tx({ 'class': 'v-sub' + (k >= 3 ? ' forte' : ''), x: px, y: 252 + k * 19 }); });
    function rioPath(u) {   /* rio surge de cima para baixo */
      var yb = TOP + (BOT - TOP) * u, d = 'M' + (MID - BW / 2) + ' ' + TOP;
      for (var y = TOP; y <= yb; y += 12) d += ' L' + (MID - BW / 2 + 5 * Math.sin(y / 18)).toFixed(1) + ' ' + y;
      d += ' L' + (MID + BW / 2 + 5 * Math.sin(yb / 18)).toFixed(1) + ' ' + yb.toFixed(1);
      for (y = Math.floor((yb - TOP) / 12) * 12 + TOP; y >= TOP; y -= 12) d += ' L' + (MID + BW / 2 + 5 * Math.sin(y / 18)).toFixed(1) + ' ' + y;
      return d + 'Z';
    }
    return function (t) {
      var MANT = ['Pd3e2281', 'W09e1df0', 'P95b2a5f', 'P078cbff'].indexOf(qid) >= 0, RAPQ = qid === 'P36d0b87', RAP = RAPQ && t >= 10.4, RAPC = RAPQ && t >= TR;
      var ub = ease((t - TB) / 1.2), ufim = MANT ? 0 : ease((t - TR) / .8), barreira = ub * (1 - ufim);
      rio.setAttribute('d', rioPath(ub)); rio.style.opacity = ub > .01 ? (1 - ufim).toFixed(2) : 0;
      rioT.textContent = t >= TB && (t < TR + .8 || MANT) ? 'barreira geográfica' : '';
      var div = cl((t - TD) / (TR - TD - .3));
      P.forEach(function (o) {
        var livre = 1 - barreira;
        var x = o.bx + o.ax * Math.sin(o.w * t + o.f) * .5 - o.lado * 80 * (1 - ub) * (.5 + .5 * Math.sin(o.w * .9 * t + o.f * 2)), y = o.by + o.ay * Math.cos(o.w * .8 * t + o.f);
        var lo = o.lado < 0 ? L + 12 : MID + BW / 2 + 12, hi = o.lado < 0 ? MID - BW / 2 - 12 : R - 12;
        var xc = Math.max(lo, Math.min(hi, x));
        x = x + (xc - x) * (1 - livre);
        if (t >= TR) { x += o.lado * -1 * 34 * ufim * (.5 + .5 * Math.sin(o.f)); }
        x = Math.max(L + 10, Math.min(R - 10, x));
        if ((o === pE || o === pD) && t >= TR + .4 && !MANT) {
          var u = ease((t - TR - .4) / 1.2), alvo = o === pE ? MID - 22 : MID + 22;
          x = x + (alvo - x) * u; y = y + (TOP + 126 - y) * u;
        }
        o.c.setAttribute('cx', x.toFixed(1)); o.c.setAttribute('cy', y.toFixed(1));
        var k = ease((t - o.tc) / .7), alvoC = o.lado < 0 ? CE : CD, c = mix(ANC, alvoC, k);
        c = c.map(function (v) { return Math.max(0, Math.min(255, Math.round(v + o.l * (1 - k * .5)))); });
        o.c.style.fill = rgb(c);
      });
      var ux = MANT ? 0 : ease((t - TR - 1.7) / .4);
      cruz.setAttribute('d', 'M' + (MID - 6) + ' ' + (TOP + 120) + ' l12 12 M' + (MID + 6) + ' ' + (TOP + 120) + ' l-12 12'); cruz.style.opacity = RAPC ? 0 : ux.toFixed(2);
      cruzT.textContent = ux > 0 ? (RAPC ? 'cruzam e geram' : 'não cruzam ou o') : ''; cruzT2.textContent = ux > 0 ? (RAPC ? 'híbridos férteis' : 'híbrido é estéril') : '';
      cruzT.style.fill = cruzT2.style.fill = RAPC ? 'var(--ad-t)' : '';
      cruzT.style.opacity = cruzT2.style.opacity = ux.toFixed(2);
      fluxo.style.opacity = t < TR ? 1 : ufim < 1 ? .4 : .4;
      fluxoX.style.opacity = RAPC ? 0 : barreira.toFixed(2);
      fluxoT0.textContent = 'fluxo gênico';
      fluxoT.textContent = t < TB ? 'livre' : (t < TR || MANT) ? 'cortado' : RAPC ? 'volta' : 'não volta';
      if (qid === 'P36d0b87') div = Math.min(div, .7);
      bar.setAttribute('width', (206 * div * .92).toFixed(1));
      var nome, A, B;
      if (t < TB) { nome = 'Uma população'; A = ['os indivíduos cruzam entre si', 'em toda a área: o fluxo', 'gênico espalha qualquer', 'novidade e dilui diferenças']; B = ['A seleção natural age, mas sem', 'barreira não há especiação', 'alopátrica (o mundo sem ilhas', 'de Dawkins).']; }
      else if (t < TD) { nome = 'Isolamento geográfico'; A = ['um rio, uma montanha, a lama', 'de Mariana ou um "mar de', 'floresta" separa a população', 'em duas: o fluxo gênico para']; B = ['Isso ainda NÃO é especiação:', 'é só a separação física,', 'a primeira etapa.', '']; }
      else if (t < TR) { nome = 'Divergência'; A = ['de cada lado surgem mutações', 'diferentes e agem seleção', 'e deriva próprias; as', 'diferenças se acumulam']; B = ['Nada se mistura entre os', 'lados, então as diferenças', 'não se diluem.', '']; }
      else { nome = 'Reencontro'; A = ['a barreira some, mas as', 'diferenças já impedem a', 'reprodução: isolamento', 'reprodutivo']; B = ['Agora são duas espécies.', 'Híbridos férteis (as raposas)', 'mostram isolamento reprodutivo', 'incompleto: especiação', 'não concluída.']; }
      var PR = { P36d0b87: ['Raposas ainda geram híbridos', 'férteis: a barreira não levou', 'a isolamento reprodutivo.', '', 'Por isso a resposta é B.'], Pd3e2281: ['Topos isolados pelo "mar de', 'floresta" são como ilhas: sem', 'fluxo gênico, surgem espécies', 'endêmicas.', 'Por isso a resposta é A.'], P9b6eb37: ['Sem barreiras, a seleção', 'natural age, mas não há', 'especiação alopátrica.', '', 'Por isso a resposta é E.'], P95b2a5f: ['Rios separados = sem fluxo', 'gênico: as populações', 'divergem (especiação', 'alopátrica).', 'Por isso a resposta é D.'], Pb6f000c: ['Grupos com fluxo gênico', 'intenso (N, O e P) seguem', 'uma só espécie.', '', 'Por isso a resposta é E.'], P078cbff: ['B e C só viram espécies se', 'o fluxo gênico continuar', 'interrompido.', '', 'Por isso a resposta é D.'], W09e1df0: ['Barreira que separa a', 'população = isolamento', 'geográfico (1ª etapa).', '', 'Por isso a resposta é C.'], Wdc3b19a: ['Alopátrica depende de', 'barreira geográfica;', 'simpátrica, não.', '', 'Por isso a resposta é D.'], W8eec239: ['A frase falsa diz que a', 'alopátrica não depende de', 'isolamento geográfico.', '', 'Por isso a resposta é D.'] }[qid];
      if (PR && t >= 10.4) { nome = 'Por isso'; B = PR; }
      if (MANT && t >= TR) { nome = 'Divergência'; A = ['de cada lado surgem mutações', 'diferentes e agem seleção', 'e deriva próprias; as', 'diferenças se acumulam']; if (!(PR && t >= 10.4)) B = ['A barreira continua: sem', 'fluxo gênico, as diferenças', 'seguem se acumulando.', '', '']; }
      if (qid === 'P36d0b87' && t >= TR && !RAP) B = ['Se a diferença não chegou ao', 'limite, os grupos voltam a', 'cruzar quando se reencontram.', '', ''];
      if (RAPC) { nome = RAP ? 'Por isso' : 'Reencontro'; A = ['a barreira some e os dois', 'grupos voltam a cruzar:', 'isolamento reprodutivo', 'incompleto']; }
      fase.textContent = nome; s.forEach(function (e, k) { e.textContent = A[k]; }); b.forEach(function (e, k) { e.textContent = B[k] || ''; if (PR && t >= 10.4) { var p = /^Por isso/.test(e.textContent); e.style.fontWeight = p ? 700 : 400; e.style.fill = p ? 'var(--ad-t)' : ''; } else { e.style.fontWeight = ''; e.style.fill = ''; } });
    };
  }
};
VIS.liga('especiacao-alopatrica', ['P36d0b87', 'Pd3e2281', 'P9b6eb37', 'P95b2a5f', 'Pb6f000c', 'P078cbff', 'W09e1df0', 'Wdc3b19a', 'W8eec239']);
