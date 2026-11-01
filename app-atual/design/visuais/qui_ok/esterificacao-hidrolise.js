/* Esterificacao de Fischer (acido etanoico + etanol), o nome do ester e a hidrolise do ester da questao
   aberta (corte na ligacao C(=O)-O, formulas dos produtos contadas no codigo). */
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
'P6bdd7ca': ['Por isso a resposta é E',
'Cortando o éster na ligação C(=O)–O e devolvendo o OH ao lado do C=O:',
'CH₃–CH(OH)–COOH, o ácido lático, C₃H₆O₃.'],
'P641df45': ['Por isso a resposta é E',
'O lado do C=O tem só um H: ácido metanoico (HCOOH). O lado do O é',
'CH₂–CH(CH₃)–CH₃: com o H de volta, isobutanol (2-metilpropan-1-ol).'],
'P656853a': ['Por isso a resposta é A',
'O ácido etanoico dá só o CH₃–C(=O); todo o resto é do álcool: o anel com',
'metila e isopropila (6 + 1 + 3 = 10 C) e o OH de volta: C₁₀H₂₀O.'],
'Pcd2372c': ['Por isso a resposta é A',
'Só o H do COOH virou CH₃: o ácido salicílico se esterificou com metanol',
'(X = H₃C–OH), e o OH do ácido com o H do álcool saem como água (Z).'],
'Pb1a88b4': ['Por isso a resposta é C',
'A água entra e quebra o éster do PVAc: é hidrólise. O oxigênio fica na cadeia',
'(vira o OH do PVA) e sai CH₃–COOH, o ácido acético: ácido carboxílico.'],
'W891012c': ['Por isso a resposta é E',
'“Etanoato” vem do ácido etanoico (2 C) e “de etila”, do etanol (2 C):',
'CH₃–COOH + HO–CH₂–CH₃ → CH₃–COO–CH₂–CH₃ + H₂O.']
};
VIS.def['esterificacao-hidrolise'] = {
  tit: 'Esterificação e hidrólise: montar e cortar um éster',
  fontes: ['OpenStax, Chemistry 2e, 20.3 Aldehydes, Ketones, Carboxylic Acids, and Esters (formação de ésteres) — https://openstax.org/books/chemistry-2e/pages/20-3-aldehydes-ketones-carboxylic-acids-and-esters', 'OpenStax, Organic Chemistry (McMurry), 21.3 Nucleophilic Acyl Substitution Reactions of Carboxylic Acids (esterificação de Fischer) e 21.6 Chemistry of Esters (hidrólise) — https://openstax.org/books/organic-chemistry/pages/21-6-chemistry-of-esters', 'Wikipedia (en), Fischer–Speier esterification — https://en.wikipedia.org/wiki/Fischer%E2%80%93Speier_esterification', 'Wikipedia (en), Ethyl lactate; Menthyl acetate; Methyl salicylate; Polyvinyl acetate — https://en.wikipedia.org/wiki/Ethyl_lactate'],
  tipo: 'anim', dur: 12,
  marcas: [[0, 'Esterificação'], [4.5, 'O nome'], [7.5, 'Hidrólise']],
  cred: 'Animação feita para o app (fórmulas condensadas). Fórmulas moleculares dos produtos contadas a partir dos átomos de cada pedaço.',
  nota: 'Ácido carboxílico + álcool ⇌ éster + água (catalisada por H⁺). O OH sai do ácido e o H sai do álcool. De trás para frente (hidrólise), corte o éster na ligação C(=O)–O: o lado do C=O vira o ácido e o lado do O vira o álcool.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var T1 = 4.5, T2 = 7.5, TF = 12;
    var ACI = '#b4442f', ALC = '#2b6cb0', AGUA = '#2b6cb0', SAI = '#c0392b', OK = '#2f8a5b';
    var LG = 'stroke:var(--tinta);stroke-width:2.2;fill:none;stroke-linecap:round';
    var AT = 'font-size:17px;font-weight:700;text-anchor:middle;fill:var(--tinta)';
    function larg(s) { var n = 0; for (var i = 0; i < s.length; i++) n += '₀₁₂₃₄₅₆₇₈₉⁺'.indexOf(s[i]) >= 0 ? .55 : s[i] === ' ' ? .4 : s[i] === '(' || s[i] === ')' ? .5 : 1; return n * 10.8; }
    /* cadeia condensada em g, a partir de x; tokens {l, s:[{l,d,b}], c}; devolve o x final */
    function cadeia(g, x, y, toks, cor, gap) {
      gap = gap || 18;
      toks.forEach(function (k, i) {
        var w = larg(k.l);
        if (i && !k.sem) { el('path', { d: 'M' + (x + 3) + ' ' + y + ' h' + (gap - 6), style: LG }, g); x += gap; }
        var cx = x + w / 2;
        tx(cx, y + 6, k.l, AT.replace('var(--tinta)', k.c || cor || 'var(--tinta)'), g);
        (k.s || []).forEach(function (s) {
          if (s.b === 2) el('path', { d: 'M' + (cx - 3.5) + ' ' + (y + s.d * 13) + ' V' + (y + s.d * 30) + ' M' + (cx + 3.5) + ' ' + (y + s.d * 13) + ' V' + (y + s.d * 30), style: LG }, g);
          else el('path', { d: 'M' + cx + ' ' + (y + s.d * 13) + ' V' + (y + s.d * 30), style: LG }, g);
          tx(cx, y + s.d * 42 + 6, s.l, AT.replace('var(--tinta)', s.c || k.c || cor || 'var(--tinta)'), g);
        });
        x += w;
      });
      return x;
    }
    function lig(g, x, y, gap) { el('path', { d: 'M' + (x + 3) + ' ' + y + ' h' + ((gap || 18) - 6), style: LG }, g); }
    var SUB = '₀₁₂₃₄₅₆₇₈₉';
    function sub(n) { return n === 1 ? '' : String(n).split('').map(function (d) { return SUB[+d]; }).join(''); }
    function form(c) { return 'C' + sub(c.C) + 'H' + sub(c.H) + 'O' + sub(c.O); }
    function soma(a, b) { return { C: a.C + b.C, H: a.H + b.H, O: a.O + b.O }; }
    var OH = { C: 0, H: 1, O: 1 }, HH = { C: 0, H: 1, O: 0 }, Oa = { C: 0, H: 0, O: 1 };
    /* ===== etapa 1: esterificacao do acido etanoico com etanol ===== */
    var g1 = el('g', {}), y1 = 92;
    var ac = el('g', {}, g1), acOH = el('g', {}, g1), alH = el('g', {}, g1), al = el('g', {}, g1);
    var xa = cadeia(ac, 40, y1, [{ l: 'CH₃' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }], ACI);
    lig(acOH, xa, y1); tx(xa + 18 + 12, y1 + 6, 'OH', AT.replace('var(--tinta)', SAI), acOH);
    tx(330, y1 + 6, '+', AT, g1);
    tx(380, y1 + 6, 'H', AT.replace('var(--tinta)', SAI), alH); lig(alH, 386, y1);
    var xl = cadeia(al, 404, y1, [{ l: 'O' }, { l: 'CH₂' }, { l: 'CH₃' }], ALC);
    var mais1 = g1.lastChild;
    var c1a = el('ellipse', { cx: xa + 30, cy: y1, rx: 24, ry: 17, style: 'fill:none;stroke:' + SAI + ';stroke-width:2;stroke-dasharray:4 3' }, g1);
    var c1b = el('circle', { cx: 380, cy: y1, r: 15, style: 'fill:none;stroke:' + SAI + ';stroke-width:2;stroke-dasharray:4 3' }, g1);
    var ag1 = tx(520, 176, 'H₂O', 'font-size:20px;font-weight:700;text-anchor:middle;fill:' + AGUA, g1);
    var rot1 = el('g', {}, g1);
    tx(40, 30, 'ácido etanoico', 'font-size:15px;font-weight:700;fill:' + ACI, rot1); tx(404, 30, 'etanol', 'font-size:15px;font-weight:700;fill:' + ALC, rot1);
    var res1 = el('g', {}, g1);
    tx(180, 176, 'etanoato de etila (éster)', 'font-size:16px;font-weight:700;text-anchor:middle;fill:' + OK, res1);
    tx(330, 206, 'H⁺ como catalisador · reação reversível (⇌)', 'font-size:14px;text-anchor:middle;fill:var(--lapis)', res1);
    var lig1 = el('path', { style: LG }, g1);
    /* ===== etapa 2: o nome ===== */
    var g2 = el('g', {}), y2 = 100;
    var e2a = el('g', {}, g2), e2b = el('g', {}, g2);
    var x2 = cadeia(e2a, 150, y2, [{ l: 'CH₃' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }], ACI);
    lig(g2, x2, y2); var x3 = cadeia(e2b, x2 + 18, y2, [{ l: 'O' }, { l: 'CH₂' }, { l: 'CH₃' }], ALC);
    el('path', { d: 'M150 132 v8 H' + x2 + ' v-8', style: 'fill:none;stroke:' + ACI + ';stroke-width:2' }, e2a);
    el('path', { d: 'M' + (x2 + 18) + ' 132 v8 H' + x3 + ' v-8', style: 'fill:none;stroke:' + ALC + ';stroke-width:2' }, e2b);
    var n2a = el('g', {}, g2), n2b = el('g', {}, g2);
    tx((150 + x2) / 2, 166, 'etanoato', 'font-size:18px;font-weight:700;text-anchor:middle;fill:' + ACI, n2a);
    tx((150 + x2) / 2, 190, 'do ácido etanoico', 'font-size:14px;text-anchor:middle;fill:' + ACI, n2a);
    tx((x2 + 18 + x3) / 2, 166, 'de etila', 'font-size:18px;font-weight:700;text-anchor:middle;fill:' + ALC, n2b);
    tx((x2 + 18 + x3) / 2, 190, 'do etanol', 'font-size:14px;text-anchor:middle;fill:' + ALC, n2b);
    /* ===== etapa 3: hidrolise do ester da questao ===== */
    var EST = {
      lactato: { n: 'lactato de etila', ac: [{ l: 'CH₃' }, { l: 'CH', s: [{ l: 'OH', d: 1 }] }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }], al: [{ l: 'CH₂' }, { l: 'CH₃' }], cA: { C: 3, H: 5, O: 2 }, cL: { C: 2, H: 5, O: 0 }, nA: 'ácido lático', nL: 'etanol' },
      formato: { n: 'flavorizante de framboesa', ac: [{ l: 'H' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }], al: [{ l: 'CH₂' }, { l: 'CH', s: [{ l: 'CH₃', d: 1 }] }, { l: 'CH₃' }], cA: { C: 1, H: 1, O: 1 }, cL: { C: 4, H: 9, O: 0 }, nA: 'ácido metanoico', nL: 'isobutanol' },
      mentila: { n: 'o monoterpeno (éster)', ac: [{ l: 'CH₃' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }], al: [{ l: 'C₁₀H₁₉ (anel)' }], cA: { C: 2, H: 3, O: 1 }, cL: { C: 10, H: 19, O: 0 }, nA: 'ácido etanoico', nL: 'o álcool (anel)' },
      salicilato: { n: 'salicilato de metila', ac: [{ l: 'HO–C₆H₄' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }], al: [{ l: 'CH₃' }], cA: { C: 7, H: 5, O: 2 }, cL: { C: 1, H: 3, O: 0 }, nA: 'ácido salicílico', nL: 'metanol (X)' },
      pvac: { n: 'PVAc (cada grupo lateral)', ac: [{ l: 'CH₃' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }], al: [{ l: 'cadeia' }], cA: { C: 2, H: 3, O: 1 }, cL: null, nA: 'ácido acético (X)', nL: 'PVA (fica a cadeia)' }
    };
    var QE = { P6bdd7ca: 'lactato', P641df45: 'formato', P656853a: 'mentila', Pcd2372c: 'salicilato', Pb1a88b4: 'pvac' };
    var es = EST[QE[qid] || 'lactato'];
    var g3 = el('g', {}), y3 = 96;
    tx(20, 24, 'Hidrólise: ' + es.n, 'font-size:16px;font-weight:700;fill:var(--tinta)', g3);
    var pA = el('g', {}, g3), pL = el('g', {}, g3), novoOH = el('g', {}, g3), novoH = el('g', {}, g3), ponte = el('g', {}, g3);
    var wA = 0; es.ac.forEach(function (k, i) { wA += larg(k.l) + (i ? 18 : 0); });
    var wL = larg('O') + 18; es.al.forEach(function (k) { wL += larg(k.l) + 18; });
    var x0 = 320 - (wA + 18 + wL) / 2;
    var xA = cadeia(pA, x0, y3, es.ac, ACI);
    lig(ponte, xA, y3);
    var xO = xA + 18; cadeia(pL, xO, y3, [{ l: 'O' }].concat(es.al), ALC);
    tx(xA + 30, y3 + 6, 'OH', AT.replace('var(--tinta)', SAI), novoOH); lig(novoOH, xA, y3);
    tx(xO - 28, y3 + 6, 'H', AT.replace('var(--tinta)', SAI), novoH); lig(novoH, xO - 20, y3, 20);
    var corte = el('path', { d: 'M' + (xA + 9) + ' ' + (y3 - 34) + ' V' + (y3 + 34), style: 'stroke:' + SAI + ';stroke-width:2.4;stroke-dasharray:6 4' }, g3);
    var ag3 = tx(xA + 44, y3 - 44, 'H₂O', 'font-size:18px;font-weight:700;text-anchor:middle;fill:' + AGUA, g3);
    var DX = 52, xEnd = x0 + wA + 18 + wL;
    function meio(a, b, w) { var c = (a + b) / 2; return Math.max(14 + w / 2, Math.min(626 - w / 2, c)); }
    var fA = tx(0, 190, '', 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + ACI, g3);
    var fL = tx(0, 190, '', 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + ALC, g3);
    var fAt = es.nA + ': ' + form(soma(es.cA, OH)), fLt = es.nL + (es.cL ? ': ' + form(soma(soma(es.cL, Oa), HH)) : '');
    fA.setAttribute('x', meio(x0 - DX, xA + 40 - DX, larg(fAt) * .82)); fL.setAttribute('x', meio(xO - 30 + DX, xEnd + DX, larg(fLt) * .82));
    /* ===== painel ===== */
    el('line', { x1: 12, x2: 628, y1: 218, y2: 218, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 242, '', 'font-size:16px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 267 + 23 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. Esterificação: ácido + álcool ⇌ éster + água', 'O ácido carboxílico perde o OH; o álcool perde o H do seu OH.', 'Os dois saem como H₂O, e o C=O do ácido se liga ao O do álcool.', 'Precisa de H⁺ como catalisador e é reversível (⇌).'],
      ['2. O nome diz de onde veio cada lado', 'Lado do C=O (veio do ácido): troca “-ico” por “-ato”: etanoato.', 'Lado do O (veio do álcool): vira “de ...ila”: de etila.', 'Etanoato de etila = ácido etanoico + etanol.'],
      ['3. Hidrólise: a água corta o éster de volta', 'A água quebra a ligação C(=O)–O. O lado do C=O ganha OH e vira', 'o ácido; o lado do O ganha H e vira o álcool. É assim que se acha', 'o ácido e o álcool de origem de qualquer éster.']
    ];
    var _desenha = function (t) {
      var f = t < T1 ? 0 : t < T2 ? 1 : 2;
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? 1 : 0);
      /* etapa 1 */
      var u = ease((t - 1.2) / 1.3), v = ease((t - 2.5) / .9);
      op(c1a, t > .5 && u < .03 ? 1 : 0); op(c1b, t > .5 && u < .03 ? 1 : 0);
      acOH.setAttribute('transform', 'translate(' + lerp(0, 480 - xa - 30, u).toFixed(1) + ' ' + lerp(0, 84, u).toFixed(1) + ')');
      alH.setAttribute('transform', 'translate(' + lerp(0, 506 - 380, u).toFixed(1) + ' ' + lerp(0, 84, u).toFixed(1) + ')');
      op(acOH, u < 1 ? 1 : 0); op(alH, u < 1 ? 1 : 0); op(ag1, u >= 1 ? 1 : 0); op(mais1, 1 - u); op(rot1, 1 - v);
      var dxl = lerp(0, xa + 18 - 404, v);
      al.setAttribute('transform', 'translate(' + dxl.toFixed(1) + ' 0)');
      lig1.setAttribute('d', 'M' + (xa + 3) + ' ' + y1 + ' h12'); op(lig1, v >= 1 ? 1 : 0); op(res1, v);
      /* etapa 2 */
      op(n2a, cl((t - T1 - .4) / .5)); op(n2b, cl((t - T1 - 1.3) / .5));
      /* etapa 3 */
      var w = ease((t - T2 - .4) / .9), s3 = ease((t - T2 - 1.4) / 1.1);
      ag3.setAttribute('y', lerp(y3 - 76, y3 - 44, w).toFixed(1)); op(ag3, t > T2 + .2 && s3 < .05 ? 1 : 0);
      op(corte, w > .9 && s3 < 1 ? 1 : 0); op(ponte, s3 < .02 ? 1 : 0);
      pA.setAttribute('transform', 'translate(' + lerp(0, -DX, s3).toFixed(1) + ' 0)');
      novoOH.setAttribute('transform', 'translate(' + lerp(0, -DX, s3).toFixed(1) + ' 0)');
      pL.setAttribute('transform', 'translate(' + lerp(0, DX, s3).toFixed(1) + ' 0)');
      novoH.setAttribute('transform', 'translate(' + lerp(0, DX, s3).toFixed(1) + ' 0)');
      op(novoOH, s3 > .5 ? 1 : 0); op(novoH, s3 > .5 ? 1 : 0);
      fA.textContent = s3 >= 1 ? fAt : ''; fL.textContent = s3 >= 1 ? fLt : '';
      var L = TXT[f];
      for (var k = 0; k < 4; k++) P[k].textContent = L[k] || '';
    };
    return fimResposta(VIS.def['esterificacao-hidrolise'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'W891012c' ? T2 - .01 : TF - .01; }
    });
  }
};
VIS.liga('esterificacao-hidrolise', ['P6bdd7ca', 'P641df45', 'P656853a', 'Pcd2372c', 'Pb1a88b4', 'W891012c']);
