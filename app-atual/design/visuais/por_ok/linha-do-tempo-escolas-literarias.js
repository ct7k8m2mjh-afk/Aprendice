/* Linha do tempo das escolas literarias no Brasil (marcos de Bosi): cada etapa acende a(s) escola(s), mostra 3 marcas
   e a seta "reage a" ate a escola recusada. Situa e contrasta; nao substitui a leitura do texto da questao. */
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
'P525dea4': [
'Por isso a resposta é E',
'Regras tiradas dos clássicos gregos e romanos, razão, clareza e ordem,',
'séculos XVII e XVIII e oposição ao Romantismo: é o Neoclassicismo',
'(no Brasil, o Arcadismo).'
],
'Pf9fe85d': [
'Por isso a resposta é A',
'Conflito entre razão e fé, céu e terra, e o gosto pelo que muda e passa:',
'são as marcas do homem barroco, do século XVII.'
],
'P01c6437': [
'Por isso a resposta é D',
'Cláudio Manuel da Costa é árcade de Minas Gerais, no ciclo do ouro.',
'Montes que viram vales e fontes que somem são obra da mineração:',
'extrativismo mineral.'
],
'P1622b5e': [
'Por isso a resposta é E',
'Contra as regras eternas do Classicismo, o novo movimento põe a',
'autoexpressão sincera e espontânea do poeta: é o Romantismo.'
],
'P2e54cc9': [
'Por isso a resposta é A',
'Primado da emoção, liberdade fora das regras e subjetivismo contra',
'o racionalismo neoclássico: é a estética romântica.'
],
'P565d893': [
'Por isso a resposta é D',
'Recusa de regras e modelos, liberdade criadora, individualismo e',
'natureza como projeção do eu: é o Romantismo.'
],
'Pe42a343': [
'Por isso a resposta é E',
'O indivíduo como medida, o artista que sofre e tem uma missão e a arte',
'que deve sempre se renovar são noções criadas pelo Romantismo.'
],
'P03b83d2': [
'Por isso a resposta é A',
'O Romantismo exaltava o sentimento; o Realismo, que reage a ele,',
'analisa e critica o caráter e a sociedade: Romantismo e Realismo.'
],
'P386ed83': [
'Por isso a resposta é C',
'Positivismo, herança + meio + momento, narrador que relata como',
'cientista e determinismo do meio: é o Naturalismo.'
],
'P0f73f90': [
'Por isso a resposta é A',
'Culto da forma, temas universais, impassibilidade e atitude descritiva,',
'longe do realismo social: é o movimento parnasiano.'
],
'P38c3a6c': [
'Por isso a resposta é E',
'Precisão formal, arte pela arte, impessoalidade, formas tradicionais',
'e reação aos excessos do Romantismo: são os parnasianos.'
],
'Pc786f71': [
'Por isso a resposta é C',
'Menos sentimentalismo, modelo francês, escrita plástica e culto',
'da língua pura e clássica: é o Parnasianismo.'
],
'P283d8a4': [
'Por isso a resposta é C',
'Descrição rígida e precisa, ligada à ciência do século XIX: Realismo,',
'Parnasianismo e Naturalismo. A reação do vago e do inefável: Simbolismo.'
],
'P4466b34': [
'Por isso a resposta é D',
'Musicalidade, repetições, aliterações e imagens em profusão',
'são marcas do Simbolismo.'
],
'P6b1dc44': [
'Por isso a resposta é E',
'Verso livre, fala do dia a dia e assunto miúdo recusam a poesia de forma',
'fixa e língua culta que dominou as décadas antes de 1930: a parnasiana.'
],
'Pd9e25bd': [
'Por isso a resposta é C',
'Vanguardas francesas e italianas, civilização mecânica, cidades e o',
'primitivo brasileiro: é o Modernismo, posterior às vanguardas.'
],
'W512797d': [
'Por isso a resposta é A',
'Futurismo e Surrealismo são vanguardas do século XX: só o Modernismo,',
'que veio depois delas, pôde recebê-las.'
],
'P0202589': [
'Por isso a resposta é C',
'Erudição, arcaísmos e prestígio acadêmico eram traços da poesia parnasiana,',
'a que dominava as letras quando Oswald escreveu o manifesto (1924).'
]
};
VIS.def['linha-do-tempo-escolas-literarias'] = {
  tit: 'Escolas literárias: quando vieram e contra quem reagiram',
  fontes: [
    'Alfredo Bosi, História concisa da literatura brasileira (São Paulo: Cultrix) — marcos e características de cada período',
    'Wikipedia (pt), Barroco no Brasil — https://pt.wikipedia.org/wiki/Barroco_no_Brasil',
    'Wikipedia (pt), Arcadismo no Brasil — https://pt.wikipedia.org/wiki/Arcadismo_no_Brasil',
    'Wikipedia (pt), Romantismo no Brasil — https://pt.wikipedia.org/wiki/Romantismo_no_Brasil',
    'Wikipedia (pt), Realismo no Brasil — https://pt.wikipedia.org/wiki/Realismo_no_Brasil',
    'Wikipedia (pt), Simbolismo no Brasil — https://pt.wikipedia.org/wiki/Simbolismo_no_Brasil',
    'Wikipedia (pt), Semana de Arte Moderna — https://pt.wikipedia.org/wiki/Semana_de_Arte_Moderna'
  ],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. Barroco'], [3, '2. Romantismo'], [6, '3. Realismo'], [9, '4. Simbolismo']],
  cred: 'Diagrama feito para o app. Linha do tempo fora de escala: cada faixa começa no marco da escola no Brasil.',
  nota: 'Serve para situar e contrastar: a resposta sai do texto da questão, e a linha do tempo ajuda a dar nome ao que o texto descreve. Neoclassicismo = Arcadismo. Realismo, Naturalismo e Parnasianismo convivem no fim do século XIX.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    var TF = 12;
    svg.setAttribute('viewBox', '0 0 640 350');
    var E = [
      { ano: '1601', n: 'Barroco', c: '#8a5a9e' }, { ano: '1768', n: 'Arcadismo', c: '#3f8a4a' }, { ano: '1836', n: 'Romantismo', c: '#c0392b' },
      { ano: '1881', n: 'Realismo, Naturalismo', c: '#2b6cb0' }, { ano: '1882', n: 'Parnasianismo', c: '#9a7220' }, { ano: '1893', n: 'Simbolismo', c: '#6b5ca5' },
      { ano: '1902', n: 'Pré-Modernismo', c: '#6f737d' }, { ano: '1922', n: 'Modernismo', c: '#b4442f' }
    ];
    var RY0 = 14, RH = 24.2, RX = 16, RW = 214;
    var linhas = E.map(function (e, i) {
      var y = RY0 + RH * i, g = el('g', {});
      var r = el('rect', { x: RX, y: y, width: RW, height: 20, rx: 6, style: 'fill:color-mix(in srgb,' + e.c + ' 10%,var(--folha));stroke:' + e.c + ';stroke-width:1.2' }, g);
      el('rect', { x: RX, y: y, width: 6, height: 20, rx: 3, style: 'fill:' + e.c }, g);
      tx(RX + 12, y + 15, e.ano, 'font-size:14px;font-weight:700;fill:var(--lapis)', g);
      var nm = tx(RX + 54, y + 15, e.n, 'font-size:14px;font-weight:600;fill:var(--tinta)', g);
      return { g: g, r: r, nm: nm, y: y + 10 };
    });
    var setas = el('g', {});
    var cards = el('g', {});
    el('line', { x1: 16, x2: 624, y1: 214, y2: 214, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(20, 240, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)')];
    for (var j = 0; j < 4; j++) P.push(tx(20, 266 + 22 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var C = {
      0: ['Barroco · séc. XVII', 'Conflito fé × razão, céu × terra, espírito × corpo.', 'Antíteses, paradoxos, linguagem rebuscada.', 'Tudo passa: obsessão com o tempo e a morte.'],
      1: ['Arcadismo (Neoclassicismo) · séc. XVIII', 'Minas do ciclo do ouro; Cláudio, Gonzaga.', 'Razão, clareza e imitação dos clássicos.', 'Pastores e campo ideal: locus amoenus, carpe diem.'],
      2: ['Romantismo · 1836', 'Emoção e subjetividade acima da razão; o "eu" no centro.', 'Liberdade: recusa regras, modelos e gêneros fixos.', 'Natureza como espelho do eu; nacionalismo e indianismo;', 'a 2.ª geração cultiva o tédio e a morte (mal do século).'],
      3: ['Realismo e Naturalismo · 1881', 'Objetividade, análise do caráter e crítica social.', 'Naturalismo: determinismo de herança, meio e momento.', 'O narrador observa como num relatório.'],
      4: ['Parnasianismo · 1882', 'Culto da forma: soneto, métrica e rima rica.', 'Arte pela arte, impassibilidade, descrição.', 'Temas clássicos, língua erudita, modelo francês.'],
      5: ['Simbolismo · 1893', 'Musicalidade: aliterações, repetições.', 'Sinestesia; o vago, o inefável, o espiritual.', 'Reage à ciência e à descrição objetiva.'],
      7: ['Modernismo · 1922', 'Vanguardas europeias: futurismo, cubismo, surrealismo.', 'Verso livre, fala do dia a dia, humor (poema-piada).', 'Cidade, máquina e o primitivo brasileiro.']
    };
    function card(i, y, h) {
      var e = E[i], L = C[i], g = el('g', {}, cards);
      el('rect', { x: 246, y: y, width: 378, height: h, rx: 10, style: 'fill:color-mix(in srgb,' + e.c + ' 8%,var(--folha));stroke:' + e.c + ';stroke-width:1.6' }, g);
      tx(258, y + 22, L[0], 'font-size:16px;font-weight:700;fill:' + e.c, g);
      L.slice(1).forEach(function (s, k) { tx(258, y + 44 + 19.5 * k, s, 'font-size:14px;fill:var(--tinta)', g); });
      return g;
    }
    function seta(de, para, u) {   /* curva a direita da coluna: de -> para (escola recusada) */
      var y1 = linhas[de].y, y2 = linhas[para].y, x = RX + RW, b = x + 12 + 3 * Math.abs(de - para);
      var p = el('path', { d: 'M' + x + ' ' + y1 + ' C' + b + ' ' + y1 + ' ' + b + ' ' + y2 + ' ' + (x + 2) + ' ' + y2 + ' m7 -5 l-7 5 l7 5', style: 'fill:none;stroke:var(--tinta);stroke-width:1.8;opacity:' + u.toFixed(2) }, setas);
      return p;
    }
    var ETAPA = [
      { on: [0, 1], cards: [0, 1], setas: [[1, 0]] },
      { on: [2], cards: [2], setas: [[2, 1]] },
      { on: [3, 4], cards: [3, 4], setas: [[3, 2], [4, 2]] },
      { on: [5, 7], cards: [5, 7], setas: [[5, 4], [7, 4]] }
    ];
    var TXT = [
      ['1. Barroco (séc. XVII) e Arcadismo (séc. XVIII)', 'Barroco: marco em 1601 (Prosopopeia); na Bahia, Gregório de Matos.', 'Arcadismo: marco em 1768 (Obras, de Cláudio Manuel da Costa).', 'Ele reage ao rebuscamento barroco com a simplicidade dos clássicos.'],
      ['2. Romantismo (1836): a emoção contra as regras', 'Marco: Suspiros poéticos e saudades, de Gonçalves de Magalhães.', 'Reage ao Classicismo/Arcadismo: troca a razão, a ordem e os modelos', 'pela expressão livre e sincera do eu.'],
      ['3. Fim do século XIX: ciência e forma', 'Prosa: Realismo (Memórias póstumas) e Naturalismo (O mulato), 1881.', 'Poesia: Parnasianismo (Fanfarras, 1882). Todos reagem ao Romantismo:', 'contra a idealização, a análise; contra o derramamento, a forma.'],
      ['4. Simbolismo (1893) e Modernismo (1922)', 'Simbolismo (Missal e Broquéis): o vago contra a descrição exata.', 'Pré-Modernismo: 1902 (Os sertões). Modernismo: Semana de 1922.', 'Ele recusa a poesia parnasiana, acadêmica, que ainda dominava.']
    ];
    var _desenha = function (t) {
      var f = t < 3 ? 0 : t < 6 ? 1 : t < 9 ? 2 : 3, et = ETAPA[f], u = ease((t - 3 * f - .3) / .7), w = ease((t - 3 * f - 1) / .6);
      linhas.forEach(function (l, i) {
        var on = et.on.indexOf(i) >= 0;
        l.g.style.opacity = on ? '1' : '.45';
        l.r.style.strokeWidth = on ? '2.4' : '1.2';
        l.nm.style.fontWeight = on ? '700' : '600';
      });
      while (setas.firstChild) setas.removeChild(setas.firstChild);
      while (cards.firstChild) cards.removeChild(cards.firstChild);
      et.setas.forEach(function (s) { seta(s[0], s[1], w); });
      if (et.cards.length === 1) card(et.cards[0], 10, 196).style.opacity = u.toFixed(2);
      else { card(et.cards[0], 8, 96).style.opacity = u.toFixed(2); card(et.cards[1], 110, 96).style.opacity = ease((t - 3 * f - .7) / .7).toFixed(2); }
      var Lt = TXT[f]; for (j = 0; j < 5; j++) P[j].textContent = Lt[j] || '';
    };
    var CG = {};
    ['P525dea4', 'Pf9fe85d', 'P01c6437'].forEach(function (q) { CG[q] = 2.95; });
    ['P1622b5e', 'P2e54cc9', 'P565d893', 'Pe42a343'].forEach(function (q) { CG[q] = 5.95; });
    ['P03b83d2', 'P386ed83', 'P0f73f90', 'P38c3a6c', 'Pc786f71'].forEach(function (q) { CG[q] = 8.95; });
    ['P283d8a4', 'P4466b34', 'P6b1dc44', 'Pd9e25bd', 'W512797d', 'P0202589'].forEach(function (q) { CG[q] = 11.95; });
    return fimResposta(VIS.def['linha-do-tempo-escolas-literarias'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] || TF - .01; }
    });
  }
};
VIS.liga('linha-do-tempo-escolas-literarias', ['P525dea4', 'Pf9fe85d', 'P01c6437', 'P1622b5e', 'P2e54cc9', 'P565d893', 'Pe42a343', 'P03b83d2', 'P386ed83', 'P0f73f90', 'P283d8a4', 'P38c3a6c', 'P4466b34', 'P6b1dc44', 'Pc786f71', 'Pd9e25bd', 'W512797d', 'P0202589']);
