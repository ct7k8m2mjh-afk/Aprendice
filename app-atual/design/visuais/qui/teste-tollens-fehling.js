/* Testes de Tollens (espelho de prata) e Fehling (Cu2O vermelho-tijolo) com fotos reais do Commons:
   o aldeido se oxida a acido e o metal se reduz (Nox calculado); a cetona nao reage. */
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
'P1462198': ['Por isso a resposta é B',
'A prata vai de +1 a 0 (espelho): ganha elétron, se reduz. Quem cedeu o',
'elétron se oxidou: o aldeído, que virou o ácido R–COOH do esquema.'],
'P382532c': ['Por isso a resposta é C',
'X é o CHO do aldeído, que vira COOH. O cobre vai de +2 (Cu²⁺, azul) a',
'+1 (Cu₂O, vermelho-tijolo): ganha elétron, sofre redução.']
};
VIS.def['teste-tollens-fehling'] = {
  tit: 'Tollens e Fehling: o aldeído se oxida, o metal se reduz',
  fontes: ['OpenStax, Organic Chemistry (McMurry), 19.3 Oxidation of Aldehydes and Ketones (Tollens; cetonas não reagem) — https://openstax.org/books/organic-chemistry/pages/19-3-oxidation-of-aldehydes-and-ketones', 'Wikipedia (en), Tollens’ reagent — https://en.wikipedia.org/wiki/Tollens%27_reagent', 'Wikipedia (en), Fehling’s solution (Cu²⁺ azul → Cu₂O vermelho-tijolo) — https://en.wikipedia.org/wiki/Fehling%27s_solution', 'OpenStax, Chemistry 2e, 4.2 Classifying Chemical Reactions (número de oxidação) — https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions'],
  tipo: 'anim', dur: 11.5,
  marcas: [[0, 'Tollens'], [4, 'Fehling'], [8, 'Só aldeído']],
  cred: 'Fotos (recortadas), Wikimedia Commons: “Tollensprobe” (espelho de prata dentro do tubo), Tmv23, CC BY-SA 3.0; “Mise en evidence du glucose dans le miel avec la liqueur de Fehling”, Robinamadiadrien-lfv, CC BY-SA 4.0. Esquemas feitos para o app.',
  nota: 'Nos dois testes o aldeído (R–CHO) é oxidado a ácido carboxílico (em meio básico, sai como carboxilato) e o metal do reagente é reduzido: Ag⁺ vira prata metálica (espelho) no Tollens; Cu²⁺ (azul) vira Cu₂O (vermelho-tijolo) no Fehling. A cetona não tem H no C=O e não reage.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function sinal(n) { return (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var T1 = 4, T2 = 8, TF = 11.5;
    var AG = '#6f7b86', CU = '#2b6cb0', TIJ = '#b4442f', OXI = '#8a5a9e', OK = '#2f8a5b';
    var noxAg = 1, noxAg0 = 0, noxCu = 2, noxCuO = (0 - (-2)) / 2;   /* Cu2O: 2·Cu + (−2) = 0 */
    var FW = 236, FH = 177, FX = 14, FY = 20;
    function foto(src, leg) {
      var g = el('g', {});
      el('image', { href: src, x: FX, y: FY, width: FW, height: FH, preserveAspectRatio: 'xMidYMid slice' }, g);
      el('rect', { x: FX, y: FY, width: FW, height: FH, rx: 6, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, g);
      tx(FX, FY + FH + 18, leg, 'font-size:14px;fill:var(--lapis)', g);
      return g;
    }
    var f1 = foto('vis/teste-tollens-fehling-1.webp', '1: espelho de prata no vidro'), f2 = foto('vis/teste-tollens-fehling-2.webp', '1: Cu²⁺ azul · 2: Cu₂O (mel aquecido)');
    /* marcadores numerados nas fotos */
    function marca(pai, x, y, n) { var g = el('g', {}, pai); el('circle', { cx: x, cy: y, r: 12, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, g); tx(x, y + 5, n, 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--ad-t)', g); return g; }
    var MK1 = [[150, 112, '1']], MK2 = [[54, 94, '1'], [214, 112, '2']];
    var m1 = MK1.map(function (m) { return marca(f1, m[0], m[1], m[2]); }), m2 = MK2.map(function (m) { return marca(f2, m[0], m[1], m[2]); });
    var R = 272, M = 'font-size:15px;fill:var(--tinta)';
    function linha(pai, y, a, b, c, cor) { tx(R, y, a, 'font-size:17px;font-weight:700;fill:var(--tinta)', pai); tx(R + 120, y, '→', 'font-size:17px;font-weight:700;fill:var(--tinta)', pai); tx(R + 150, y, b, 'font-size:17px;font-weight:700;fill:var(--tinta)', pai); if (c) tx(R, y + 22, c, 'font-size:15px;font-weight:700;fill:' + cor, pai); }
    var e1 = el('g', {});
    tx(R, 32, 'Tollens: Ag(NH₃)₂⁺ em meio básico', 'font-size:15px;font-weight:700;fill:var(--lapis)', e1);
    linha(e1, 66, 'R–CHO', 'R–COOH', 'aldeído perde elétrons: oxidação', OXI);
    linha(e1, 130, 'Ag⁺ (' + sinal(noxAg) + ')', 'Ag (' + noxAg0 + ')', 'ganha ' + (noxAg - noxAg0) + ' e⁻: redução', AG);
    tx(R, 186, '1 = espelho de prata na parede do tubo', 'font-size:14px;fill:var(--lapis)', e1);
    var e2 = el('g', {});
    tx(R, 32, 'Fehling: Cu²⁺ complexado, azul', 'font-size:15px;font-weight:700;fill:var(--lapis)', e2);
    linha(e2, 66, 'R–CHO', 'R–COOH', 'aldeído perde elétrons: oxidação', OXI);
    linha(e2, 130, 'Cu²⁺ (' + sinal(noxCu) + ')', 'Cu₂O (Cu ' + sinal(noxCuO) + ')', 'ganha ' + (noxCu - noxCuO) + ' e⁻: redução', TIJ);
    tx(R, 186, 'no Cu₂O: 2·Cu + (−2) = 0, então Cu = ' + sinal(noxCuO), 'font-size:14px;fill:var(--lapis)', e2);
    /* etapa 3: aldeido x cetona */
    var e3 = el('g', {});
    var LG = 'stroke:var(--tinta);stroke-width:2.2;fill:none';
    function carbonila(x, y, dir, cor, n, v1, v2) {
      var g = el('g', {}, e3);
      tx(x - 46, y + 6, 'R', 'font-size:18px;font-weight:700;text-anchor:middle;fill:var(--tinta)', g);
      el('path', { d: 'M' + (x - 36) + ' ' + y + ' H' + (x - 10) + ' M' + (x + 10) + ' ' + y + ' H' + (x + 36) + ' M' + (x - 3.5) + ' ' + (y - 12) + ' V' + (y - 30) + ' M' + (x + 3.5) + ' ' + (y - 12) + ' V' + (y - 30), style: LG }, g);
      tx(x, y + 6, 'C', 'font-size:18px;font-weight:700;text-anchor:middle;fill:var(--tinta)', g);
      tx(x, y - 36, 'O', 'font-size:18px;font-weight:700;text-anchor:middle;fill:var(--tinta)', g);
      tx(x + 48, y + 6, dir, 'font-size:18px;font-weight:700;text-anchor:middle;fill:' + cor, g);
      tx(x, y + 40, n, 'font-size:16px;font-weight:700;text-anchor:middle;fill:' + cor, g);
      tx(x, y + 62, v1, 'font-size:14px;text-anchor:middle;fill:var(--tinta)', g);
      tx(x, y + 82, v2, 'font-size:14px;text-anchor:middle;fill:var(--tinta)', g);
      return g;
    }
    carbonila(160, 96, 'H', OK, 'aldeído: H no C=O', 'o H vira OH: R–COOH', 'Tollens e Fehling positivos');
    carbonila(470, 96, 'R′', TIJ, 'cetona: C=O entre dois C', 'sem H para trocar', 'testes negativos');
    el('line', { x1: 320, x2: 320, y1: 30, y2: 200, style: 'stroke:var(--linha);stroke-width:1.5' }, e3);
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 222, y2: 222, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 246, '', 'font-size:16px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 271 + 23 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. Tollens: espelho de prata', 'Aquecido com um aldeído, o Ag⁺ do reagente (Nox +1) ganha elétron e vira', 'prata metálica (Nox 0), que forra o vidro como um espelho.', 'Quem cedeu o elétron foi o aldeído: ele se oxida a ácido carboxílico.'],
      ['2. Fehling: de azul a vermelho-tijolo', 'O Cu²⁺ (Nox +2) deixa a solução azul. O aldeído (como o da glicose)', 'cede elétrons, e o cobre cai para +1 no Cu₂O, um sólido vermelho-tijolo.', 'Cobre: redução. Aldeído: oxidação a ácido.'],
      ['3. Por que só o aldeído?', 'O aldeído tem um H preso ao C=O, que é trocado por OH na oxidação.', 'A cetona tem o C=O entre dois carbonos, sem esse H: oxidá-la exigiria', 'quebrar a cadeia, e os testes suaves não fazem isso. Fica sem espelho.']
    ];
    var _desenha = function (t) {
      var f = t < T1 ? 0 : t < T2 ? 1 : 2;
      op(f1, f === 0 ? 1 : 0); op(f2, f === 1 ? 1 : 0);
      op(e1, f === 0 ? cl((t - .3) / .4) : 0); op(e2, f === 1 ? cl((t - T1 - .3) / .4) : 0); op(e3, f === 2 ? cl((t - T2) / .4) : 0);
      m1.forEach(function (m, i) { op(m, cl((t - 1 - .5 * i) / .3)); }); m2.forEach(function (m, i) { op(m, cl((t - T1 - 1 - .5 * i) / .3)); });
      var L = TXT[f];
      for (var k = 0; k < 4; k++) P[k].textContent = L[k] || '';
    };
    return fimResposta(VIS.def['teste-tollens-fehling'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'P1462198' ? T1 - .01 : T2 - .01; }
    });
  }
};
VIS.liga('teste-tollens-fehling', ['P1462198', 'P382532c']);
