VIS.def['imunidade-de-rebanho'] = {
  tit: 'Imunidade coletiva: a vacinação de muitos protege quem não pode tomar a vacina',
  fontes: ['Imunidade de grupo (Wikipédia) — https://pt.wikipedia.org/wiki/Imunidade_de_grupo', 'OpenStax Microbiology, 18.5 Vaccines — https://openstax.org/books/microbiology/pages/18-5-vaccines'],
  tipo: 'anim', dur: 11,
  cred: 'Simulação feita para o app: mesma população, mesmo caso inicial, só muda a cobertura vacinal (esquema; números ilustrativos).',
  marcas: [[0, 'Início'], [1.25, 'Transmissão'], [4.5, 'Cobertura baixa'], [7.8, 'Cobertura alta']],
  nota: 'Os 6 contornos laranja são as mesmas pessoas nos dois lados: gente que não pode receber vacina de vírus atenuado (imunodeprimidos, gestantes). Ninguém passa imunidade a elas; elas ficam protegidas porque, com a cobertura alta, o vírus encontra poucas pessoas para infectar e as cadeias de transmissão param. Na dengue, quem leva o vírus de uma pessoa a outra é o mosquito: menos gente infectada, menos mosquito infectado.',
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 392');
    var TXT = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var VAC = '#3b7cc4', INF = '#d23c2a', REC = '#d9a59c', NVC = '#e07b00';
    /* ---- simulacao deterministica (sementes escolhidas) ---- */
    var C = 12, R = 9, s = 211;
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    var NV = [[2, 1], [9, 2], [1, 6], [6, 7], [10, 6], [4, 3]], IDX = [5, 4];
    function grade(cob) {
      var g = [];
      for (var y = 0; y < R; y++) for (var x = 0; x < C; x++) {
        var nv = NV.some(function (p) { return p[0] === x && p[1] === y; }), ix = x === IDX[0] && y === IDX[1];
        g.push({ x: x, y: y, nv: nv, vac: !nv && !ix && rnd() < cob, inf: -1 });
      }
      return g;
    }
    function roda(g) {
      var T = g.map(function () { return rnd(); });
      g[IDX[1] * C + IDX[0]].inf = 0;
      for (var st = 0; st < 16; st++) g.forEach(function (c) {
        if (c.inf >= 0 && c.inf <= st && st - c.inf < 2) [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
          var nx = c.x + d[0], ny = c.y + d[1]; if (nx < 0 || ny < 0 || nx >= C || ny >= R) return;
          var n = g[ny * C + nx]; if (!n.vac && n.inf < 0 && T[ny * C + nx] < .8) n.inf = st + 1;
        });
      });
      return g;
    }
    var GL = roda(grade(.3)), GR = roda(grade(.85));
    /* ---- desenho ---- */
    var DX = 22, DY = 23, Y0 = 72;
    function pessoa(pai, cx, cy) {
      var g = el('g', {}, pai);
      var cab = el('circle', { cx: cx, cy: cy - 5, r: 3.6 }, g);
      var corpo = el('path', { d: 'M' + (cx - 6.5) + ' ' + (cy + 8) + ' Q' + (cx - 6.5) + ' ' + (cy - .5) + ' ' + cx + ' ' + (cy - .5) + ' Q' + (cx + 6.5) + ' ' + (cy - .5) + ' ' + (cx + 6.5) + ' ' + (cy + 8) + 'Z' }, g);
      return [cab, corpo];
    }
    function lado(G, x0, titulo, sub) {
      tx({ x: x0, y: 24, style: 'font-size:17px;font-weight:700;' + TXT }, titulo);
      tx({ x: x0, y: 43, style: 'font-size:13.5px;' + LAP }, sub);
      var cont = tx({ x: x0, y: 62, style: 'font-size:13.5px;font-weight:700;' + TXT }, '');
      G.forEach(function (c) {
        var cx = x0 + 11 + c.x * DX, cy = Y0 + c.y * DY + 4;
        c.f = pessoa(svg, cx, cy);
        if (c.nv) c.anel = el('circle', { cx: cx, cy: cy + 1, r: 11, style: 'fill:none;stroke:' + NVC + ';stroke-width:2.2' });
      });
      return cont;
    }
    function nv(G) { return G.filter(function (c) { return c.vac; }).length; }
    var cL = lado(GL, 26, 'Cobertura baixa', nv(GL) + ' de ' + GL.length + ' pessoas vacinadas');
    var cR = lado(GR, 346, 'Cobertura alta', nv(GR) + ' de ' + GR.length + ' pessoas vacinadas');
    el('line', { x1: 320, x2: 320, y1: 8, y2: 284, style: 'stroke:var(--linha);stroke-width:1.5' });
    /* chave */
    var KY = 300, kx = 26;
    [['vacinado', VAC, 0], ['sem vacina', 'none', 0], ['infectado agora', INF, 0], ['já se infectou', REC, 0], ['não pode se vacinar', 'none', 1]].forEach(function (k) {
      var f = pessoa(svg, kx + 7, KY - 4);
      f.forEach(function (e) { e.setAttribute('style', k[1] === 'none' ? 'fill:none;stroke:var(--lapis);stroke-width:1.3' : 'fill:' + k[1]); });
      if (k[2]) el('circle', { cx: kx + 7, cy: KY - 3, r: 11, style: 'fill:none;stroke:' + NVC + ';stroke-width:2.2' });
      var t = tx({ x: kx + 22, y: KY + 1, style: 'font-size:13px;' + TXT }, k[0]);
      kx += 22 + t.getComputedTextLength() + 20;
    });
    var f1 = tx({ x: 26, y: 334, style: 'font-size:16px;font-weight:700;' + TXT }, ''), f2 = tx({ x: 26, y: 356, style: 'font-size:14.5px;' + TXT }, ''), f3 = tx({ x: 26, y: 376, style: 'font-size:14.5px;' + TXT }, '');
    var PASSO = .65, T0 = .6;
    function estilo(c, st) {
      var cor, linha = false;
      if (c.vac) cor = VAC;
      else if (c.inf >= 0 && st >= c.inf && st < c.inf + 2) cor = INF;
      else if (c.inf >= 0 && st >= c.inf + 2) cor = REC;
      else linha = true;
      var css = linha ? 'fill:none;stroke:var(--lapis);stroke-width:1.3' : 'fill:' + cor;
      c.f[0].setAttribute('style', css); c.f[1].setAttribute('style', css);
    }
    return function (t) {
      var st = t < T0 ? -1 : Math.floor((t - T0) / PASSO);
      var nL = 0, nR = 0, vL = 0, vR = 0;
      GL.forEach(function (c) { estilo(c, st); if (c.inf >= 0 && c.inf <= st) { nL++; if (c.nv) vL++; } });
      GR.forEach(function (c) { estilo(c, st); if (c.inf >= 0 && c.inf <= st) { nR++; if (c.nv) vR++; } });
      if (st < 0) { GL[IDX[1] * C + IDX[0]].f.forEach(function (e) { e.setAttribute('style', 'fill:' + INF); }); GR[IDX[1] * C + IDX[0]].f.forEach(function (e) { e.setAttribute('style', 'fill:' + INF); }); nL = nR = 1; }
      cL.textContent = 'já se infectaram: ' + nL + ' · laranja atingidos: ' + vL + ' de 6';
      cR.textContent = 'já se infectaram: ' + nR + ' · laranja atingidos: ' + vR + ' de 6';
      var F = t < 1.25 ? ['Mesmo caso inicial nas duas cidades', 'os contornos laranja não podem tomar vacina de vírus atenuado', ''] :
        t < 4.5 ? ['Cada infectado passa o vírus a vizinhos sem imunidade', 'vacinado é barreira: a cadeia de transmissão para nele', ''] :
        t < 7.8 ? ['Cobertura baixa: o vírus chega aos laranja', 'à esquerda, a cadeia segue de vizinho em vizinho até eles', ''] :
        ['Cobertura alta: as cadeias morrem cedo', 'ninguém transfere imunidade aos laranja (A e E erradas);', 'na dengue, menos gente infectada = menos mosquito infectado (B errada)'];
      f1.textContent = F[0]; f2.textContent = F[1]; f3.textContent = F[2];
    };
  }
};
VIS.liga('imunidade-de-rebanho', ['P540c9e2']);

/* etapa final: "Por isso a resposta é..." da questão aberta */
(function () {
  var V = VIS.def['imunidade-de-rebanho'], m0 = V.monta, D0 = V.dur, R = {"P540c9e2": ["D", "Com cobertura vacinal alta, o vírus encontra poucas pessoas", "para infectar: as chances de epidemia diminuem."]};
  V.dur = D0 + 2.6; V.marcas = V.marcas.concat([[D0, 'Resposta']]);
  V.monta = function (svg, qid) {
    var d = m0(svg, qid), NS = 'http://www.w3.org/2000/svg', r = R[qid];
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    var g = el('g', { style: 'display:none' });
    el('rect', { x: 0, y: 0, width: 640, height: 400, style: 'fill:var(--folha);opacity:.86' }, g);
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
