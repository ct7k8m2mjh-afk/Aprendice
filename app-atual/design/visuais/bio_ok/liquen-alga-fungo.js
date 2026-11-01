/* Liquen = fungo + alga (ou cianobacteria): quem faz o que, o corte real do talo, os soredios e o papel de pioneiro.
   Abre com a orelha-de-pau esverdeada (fungo + algas por cima: dois seres). Questoes P21f2bab, W820afd5, Wc708f88. */
/* etapa final "Resposta" (variante lateral): o cartao ocupa a coluna de texto da direita e o desenho da
   esquerda fica inteiro, congelado no quadro que decide a questao. */
function fimLado(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 3.2); def.marcas.push([TF, 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var x = opc.x || 430, w = vb[2] - x - 6, y = opc.y || 14, h = Math.min(vb[3] - y - 10, 91 + 21 * (r.length - 1));
  var c = el('g', {});
  el('rect', { x: x - 4, y: 0, width: vb[2] - x + 4, height: vb[3], style: 'fill:var(--folha)' }, c);
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var m = r[0].match(/^(.*?)\s*(é .*)$/) || [0, r[0], ''];
  el('text', { x: x + 16, y: y + 30, style: 'font-size:15px;font-weight:600;fill:var(--lapis)' }, c).textContent = m[1];
  el('text', { x: x + 16, y: y + 60, style: 'font-size:24px;font-weight:700;fill:var(--ad-t)' }, c).textContent = m[2];
  r.slice(1).forEach(function (s, i) { el('text', { x: x + 16, y: y + 94 + 21 * i, style: 'font-size:14px;fill:var(--tinta)' }, c).textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    c.style.opacity = on ? Math.min(1, (t - TF) / .3).toFixed(2) : 0; c.style.display = on ? '' : 'none';
  };
}
var RESP = {
  'P21f2bab': ['Por isso a resposta é C', 'Ricardo: são dois seres.', 'O fungo da orelha-de-pau', 'é heterótrofo (fungo não', 'faz fotossíntese); as', 'algas por cima são', 'autótrofas e dão o verde.', '', 'Musgo é planta, não fungo', '+ alga. E no líquen quem', 'dá o açúcar é a alga.'],
  'W820afd5': ['Por isso a resposta é D', 'A alga faz fotossíntese:', 'alimento para os dois.', '', 'O fungo retém água e', 'sais e prende o líquen.', 'Assim ele vive em lugar', 'seco, até em rocha nua.'],
  'Wc708f88': ['Por isso a resposta é B', 'Algas envolvidas por', 'hifas de fungo, sorédios', 'que levam os dois sócios', 'juntos, e papel de', 'pioneiro na rocha nua:', 'é o líquen.']
};
VIS.def['liquen-alga-fungo'] = {
  tit: 'Líquen: um fungo e uma alga vivendo como um só',
  fontes: [
    'OpenStax, Biology 2e, 24.4 Ecology of Fungi (líquens: o fotobionte faz fotossíntese, o fungo dá proteção, água e sais; pioneiros em rocha nua; sorédios) — https://openstax.org/books/biology-2e/pages/24-4-ecology-of-fungi',
    'Wikipedia (en), Lichen (córtex, camada de algas, medula, rizinas; sorédios com algas envoltas por hifas) — https://en.wikipedia.org/wiki/Lichen',
    'Wikipedia (en), Soredium — https://en.wikipedia.org/wiki/Soredium',
    'Wikipedia (en), Trametes (orelhas-de-pau; T. gibbosa costuma ficar verde por algas que crescem sobre ela) — https://en.wikipedia.org/wiki/Trametes_gibbosa'
  ],
  tipo: 'anim', dur: 19,
  marcas: [[0, 'Orelha verde'], [4.6, 'Corte'], [9.4, 'A troca'], [14.2, 'Sorédios']],
  cred: 'Fotos do Wikimedia Commons, recortadas: 1 "Beech bracket fungus in Burnham Beeches - geograph.org.uk - 278639.jpg", David Hawgood, CC BY-SA 2.0; 2 "Asco1003.jpg" (corte transversal do líquen Physcia, microscópio óptico), Jon Houseman, CC BY-SA 3.0; 3 "A lichen - Ramalina farinacea - geograph.org.uk - 1073623.jpg", Lairich Rig, CC BY-SA 2.0. Esquemas feitos para o app, fora de escala.',
  nota: 'Fungo nunca faz fotossíntese. No líquen, a alga (ou cianobactéria) produz o alimento e o fungo segura água e sais, prende o conjunto e protege a alga. Juntos colonizam rocha nua: são pioneiros.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0.001 ? '' : 'none'; }
    function p(d, st, pai) { return el('path', { d: d, style: st }, pai); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var ALG = '#4f9a3c', HIF = '#9a8a72', AGU = '#2b8fc4', ACU = '#c98a12';
    var TX = 440, tT = tx(TX, 40, '', 'font-size:19px;font-weight:700;fill:var(--tinta)'), tL = [];
    for (var i = 0; i < 10; i++) tL.push(tx(TX, 70 + i * 21, '', 'font-size:14px;fill:var(--tinta)'));
    el('line', { x1: 424, x2: 424, y1: 20, y2: 330, style: 'stroke:var(--linha);stroke-width:1.2' });
    var defs = el('defs', {}), nclip = 0;
    function foto(pai, src, x, y, w, h) {
      var id = 'liq-cp-' + (++nclip), cp = el('clipPath', { id: id }, defs); el('rect', { x: x, y: y, width: w, height: h, rx: 10 }, cp);
      el('image', { href: src, x: x, y: y, width: w, height: h, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#' + id + ')' }, pai);
      el('rect', { x: x, y: y, width: w, height: h, rx: 10, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, pai);
    }
    function marcas(pai, x, y, w, h, pts) {
      return pts.map(function (q, i) {
        var g = el('g', { transform: 'translate(' + (x + q[0] * w / 640).toFixed(1) + ' ' + (y + q[1] * h / 480).toFixed(1) + ')' }, pai);
        el('circle', { r: 12, style: 'fill:#fff;stroke:var(--ad-c);stroke-width:3' }, g);
        tx(0, 5, String(i + 1), 'font-size:14px;font-weight:800;fill:#14532d;text-anchor:middle', g);
        return g;
      });
    }
    var PX = 14, PY = 26, PW = 396, PH = 297;
    /* ===== 1. orelha-de-pau esverdeada ===== */
    var G1 = el('g', {});
    foto(G1, 'vis/liquen-alga-fungo-1.webp', PX, PY, PW, PH);
    tx(PX, PY + PH + 18, 'orelha-de-pau num tronco morto de faia (Inglaterra)', 'font-size:13px;fill:var(--lapis)', G1);
    var M1 = marcas(G1, PX, PY, PW, PH, [[440, 130], [190, 282]]);
    /* ===== 2. corte do liquen ===== */
    var G2 = el('g', {});
    foto(G2, 'vis/liquen-alga-fungo-2.webp', PX, PY, PW, PH);
    tx(PX, PY + PH + 18, 'corte do líquen Physcia ao microscópio (corado)', 'font-size:13px;fill:var(--lapis)', G2);
    var M2 = marcas(G2, PX, PY, PW, PH, [[344, 106], [470, 142], [300, 250], [400, 382]]);
    /* ===== 3. a troca ===== */
    var G3 = el('g', {});
    var hif = '';
    for (i = 0; i < 9; i++) { var yy = 52 + i * 15; hif += 'M40 ' + yy + ' C120 ' + (yy - 10) + ' 200 ' + (yy + 12) + ' 300 ' + (yy - 4) + ' S380 ' + (yy + 6) + ' 404 ' + yy + ' '; }
    p(hif, 'fill:none;stroke:' + HIF + ';stroke-width:5;stroke-linecap:round;opacity:.75', G3);
    var algs = [[110, 96], [150, 112], [196, 92], [240, 116], [286, 98], [330, 110], [130, 140], [264, 142], [354, 138]];
    algs.forEach(function (q) { el('circle', { cx: q[0], cy: q[1], r: 11, style: 'fill:' + ALG + ';stroke:#2f6b22;stroke-width:1.5' }, G3); el('circle', { cx: q[0] - 3, cy: q[1] - 3, r: 3, style: 'fill:#9fd38a' }, G3); });
    tx(30, 34, 'fungo: hifas (fios)', 'font-size:13.5px;font-weight:700;fill:#6b5c44', G3);
    tx(404, 34, 'alga: células verdes', 'font-size:13.5px;font-weight:700;fill:#2f6b22;text-anchor:end', G3);
    var acu = [], agu = [];
    for (i = 0; i < 4; i++) { acu.push(el('rect', { width: 9, height: 9, rx: 2, style: 'fill:' + ACU }, G3)); agu.push(el('path', { d: 'M0 -7 C4 -2 5 1 5 4 A5 5 0 0 1 -5 4 C-5 1 -4 -2 0 -7 Z', style: 'fill:' + AGU }, G3)); }
    var L3a = tx(30, 206, 'alga → fungo: açúcares da fotossíntese', 'font-size:14px;font-weight:700;fill:' + ACU, G3);
    var L3b = tx(30, 226, 'fungo → alga: água, sais minerais, abrigo', 'font-size:14px;font-weight:700;fill:' + AGU, G3);
    var R3 = el('g', {}, G3);
    p('M20 334 L40 300 L90 290 L150 302 L210 286 L280 298 L340 288 L404 304 L404 334 Z', 'fill:#a8a29a;stroke:#7a746c;stroke-width:1.5', R3);
    p('M60 293 Q80 287 100 290 M170 297 Q190 290 214 287 Q240 285 262 293 M300 292 Q324 285 350 289', 'fill:none;stroke:#b9b25a;stroke-width:6;stroke-linecap:round', R3);
    tx(30, 256, 'Na rocha nua, o líquen gruda, segura água e', 'font-size:13.5px;fill:var(--tinta)', R3);
    tx(30, 274, 'começa a esfarelar a rocha: é o primeiro a chegar.', 'font-size:13.5px;fill:var(--tinta)', R3);
    /* ===== 4. soredios ===== */
    var G4 = el('g', {});
    foto(G4, 'vis/liquen-alga-fungo-3.webp', PX, PY, 220, 165);
    tx(PX, PY + 165 + 16, 'Ramalina farinacea num galho', 'font-size:13px;fill:var(--lapis)', G4);
    function soredio(pai, x, y, s) {
      var g = el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + s + ')' }, pai);
      [[-7, -5], [6, -6], [0, 6], [-9, 7], [9, 6]].forEach(function (q) { el('circle', { cx: q[0], cy: q[1], r: 6, style: 'fill:' + ALG + ';stroke:#2f6b22;stroke-width:1' }, g); });
      p('M-16 0 C-10 -18 10 -18 16 -2 C18 12 4 20 -8 16 C-18 12 -20 4 -16 0 M-14 -6 C-2 -2 4 -10 14 -8 M-12 10 C0 4 8 14 14 6', 'fill:none;stroke:' + HIF + ';stroke-width:2.6;stroke-linecap:round', g);
      return g;
    }
    soredio(G4, 290, 70, 1.6);
    tx(326, 62, 'sorédio:', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', G4);
    tx(326, 78, 'algas + hifas', 'font-size:13px;fill:var(--lapis)', G4);
    var voo = soredio(G4, 0, 0, 1);
    var vento = p('M250 140 C290 130 330 150 380 136 M260 160 C300 150 340 170 390 156', 'fill:none;stroke:var(--lapis);stroke-width:1.4;stroke-dasharray:5 5', G4);
    tx(300, 186, 'o vento leva', 'font-size:13px;fill:var(--lapis)', G4);
    p('M20 330 L40 290 L110 280 L190 294 L260 276 L330 288 L404 280 L404 330 Z', 'fill:#a8a29a;stroke:#7a746c;stroke-width:1.5', G4);
    var novo = p('M300 284 Q320 274 344 276 Q362 278 372 286', 'fill:none;stroke:#b9b25a;stroke-width:7;stroke-linecap:round', G4);
    tx(30, 244, 'cai na rocha já com os dois sócios', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', G4);
    var novoT = tx(30, 264, 'e forma um novo líquen', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', G4);

    var TXT = [
      ['Orelha-de-pau verde?', 'Fungo não tem clorofila:', 'é sempre heterótrofo.', '1 fungo (orelha-de-pau):', '   decompõe a madeira morta', '2 o verde são ALGAS que', '   crescem na superfície', '   úmida: são autótrofas.', 'São dois seres, não um,', 'e não precisa ser líquen.'],
      ['O líquen por dentro', '1 córtex: hifas do fungo', '   bem juntas (proteção)', '2 camada de algas: as', '   bolinhas vermelhas da', '   faixa de cima (corante)', '3 medula: hifas frouxas,', '   seguram água e ar', '4 rizinas: hifas que', '   prendem no substrato'],
      ['Quem faz o quê', 'A alga (ou cianobactéria)', 'faz fotossíntese e passa', 'açúcar ao fungo.', 'O fungo absorve e retém', 'água e sais, prende o', 'líquen e protege a alga', 'de secar.', 'Por isso vivem até em', 'rocha nua e lugar seco.'],
      ['Sorédios e pioneirismo', 'O líquen solta sorédios:', 'poucas algas envolvidas', 'por hifas. Cada um leva', 'os dois sócios juntos.', '', 'Na rocha nua, o líquen', 'chega primeiro e começa a', 'formar solo: é pioneiro', 'da sucessão primária.']
    ];
    var T = [0, 4.6, 9.4, 14.2];
    return fimLado(VIS.def['liquen-alga-fungo'], svg, function (t) {
      var k = t < 4.6 ? 0 : t < 9.4 ? 1 : t < 14.2 ? 2 : 3, u = t - T[k];
      tT.textContent = TXT[k][0];
      tL.forEach(function (e, i) { var s = TXT[k][i + 1] || ''; e.textContent = s; e.style.fontWeight = /^\d |São dois|ALGAS/.test(s) ? '700' : '400'; });
      vis(G1, k === 0 ? 1 : 0); vis(G2, k === 1 ? 1 : 0); vis(G3, k === 2 ? 1 : 0); vis(G4, k === 3 ? 1 : 0);
      if (k === 0) M1.forEach(function (m, i) { vis(m, cl((u - .4 - i * .9) / .3)); });
      if (k === 1) M2.forEach(function (m, i) { vis(m, cl((u - .3 - i * .55) / .3)); });
      if (k === 2) {
        acu.forEach(function (a, i) { var w = ((u * .55 + i / 4) % 1), x0 = 120 + i * 70; a.setAttribute('x', (x0 - 4).toFixed(1)); a.setAttribute('y', (lerp(100, 166, w) - 4).toFixed(1)); vis(a, Math.sin(Math.PI * w)); });
        agu.forEach(function (a, i) { var w = ((u * .55 + i / 4 + .5) % 1), x0 = 150 + i * 70; a.setAttribute('transform', 'translate(' + x0 + ' ' + lerp(176, 112, w).toFixed(1) + ')'); vis(a, Math.sin(Math.PI * w)); });
        vis(L3a, cl((u - .3) / .4)); vis(L3b, cl((u - .9) / .4)); vis(R3, cl((u - 1.6) / .4));
      }
      if (k === 3) {
        var w = ease((u - .4) / 2);
        voo.setAttribute('transform', 'translate(' + lerp(250, 336, w).toFixed(1) + ' ' + (lerp(120, 270, w) - 30 * Math.sin(Math.PI * w)).toFixed(1) + ')');
        vis(voo, u > .4 && u < 2.5 ? 1 : 0); vis(novo, cl((u - 2.4) / .4)); vis(novoT, cl((u - 2.4) / .4));
      }
    }, 19, RESP, qid, { congela: function (q) { return q === 'P21f2bab' ? 4.5 : q === 'W820afd5' ? 14.1 : 18.9; } });
  }
};
VIS.liga('liquen-alga-fungo', ['P21f2bab', 'W820afd5', 'Wc708f88']);
