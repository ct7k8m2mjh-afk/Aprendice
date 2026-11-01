/* etapa final "Resposta": congela o desenho no quadro que decide e mostra o porque da questao aberta (qid).
   R[qid] = ['Por isso a resposta é X', 'linha', ...]. Sem entrada para o qid, o visual fica como era. */
function fimResposta(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 3.2); def.marcas.push([TF, opc.marca || 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var g = el('g', {});
  Array.prototype.slice.call(svg.childNodes).forEach(function (k) { if (k !== g && k.nodeName !== 'defs') g.appendChild(k); });
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var n = r.length - 1, w = opc.w || 560, h = opc.h || 62 + 22 * n, x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  if (opc.base) { h = Math.max(h, opc.hmin || 0); y = vb[3] - h - 4; }
  if (y + h > vb[3] - 3) y = vb[3] - h - 3;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 20, y: y + 33, style: 'font-size:19px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  r.slice(1).forEach(function (s, i) { var t = el('text', { x: x + 20, y: y + 61 + 22 * i, style: 'font-size:15px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;   /* quadro congelado na etapa Resposta */
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .16 : 1; c.style.opacity = on ? 1 : 0;
    (opc.oculta || []).forEach(function (o) { o.style.visibility = on ? 'hidden' : 'visible'; });
  };
}
var RESP = {
'P6357fd4': ['Por isso a resposta é B', 'Primeiro NaCl: só o Ag⁺ precipita (AgCl); o Cu²⁺ fica (CuCl₂ é solúvel).', 'Filtra. No filtrado, NaOH precipita o Cu²⁺ como Cu(OH)₂.', 'Com NaOH primeiro, os dois precipitariam juntos (C e D erram).'],
'Pd43e13d': ['Por isso a resposta é E', 'A que dissolveu é de sódio e não borbulhou: sulfato de sódio.', 'A insolúvel é de bário e borbulhou com HCl (CO₂): carbonato de bário.'],
'P4f729f4': ['Por isso a resposta é E', 'Carbonato de soda (Na₂CO₃) + ácido muriático (HCl) solta CO₂,', 'o gás do efeito estufa e da fotossíntese: o antigo "ar fixo".']
};
VIS.def['precipitacao-seletiva-efervescencia'] = {
  tit: 'Precipitar um íon de cada vez; carbonato borbulha com ácido',
  fontes: ['OpenStax, Chemistry 2e, 4.2 Classifying Chemical Reactions (precipitação, regras de solubilidade) — https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions', 'OpenStax, Chemistry 2e, 15.1 Precipitation and Dissolution (precipitação seletiva) — https://openstax.org/books/chemistry-2e/pages/15-1-precipitation-and-dissolution', 'Wikipedia (en), Silver chloride; Copper(II) hydroxide; Barium carbonate — https://en.wikipedia.org/wiki/Barium_carbonate'],
  tipo: 'anim', dur: 16.5,
  marcas: [[0, 'NaCl'], [5.5, 'Filtra+NaOH'], [11, 'Carbonato']],
  cred: 'Animação feita para o app (esquema; cores aproximadas: AgCl branco, Cu(OH)₂ azul-claro, Cu²⁺ em solução azul).',
  nota: 'Para separar dois cátions, use primeiro um reagente que precipite só um deles, filtre e depois precipite o outro no filtrado. Carbonato com ácido forte libera CO₂ (efervescência); sulfato não.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var CU = '#5aa5d6', CUp = '#9fd0ee', AGC = '#f4f4f4', VD = '#1f8a70', VM = '#b4442f', AZ = '#2b6cb0';
    var C = 'text-anchor:middle';
    svg.setAttribute('viewBox', '0 0 640 410');
    var uid = 'p' + Math.random().toString(36).slice(2, 8), defs = el('defs', {});
    function tubo(pai, cx, yt, yb, w, id) {
      var r = w / 2, d = 'M' + (cx - r) + ' ' + yt + ' V' + (yb - r) + ' A' + r + ' ' + r + ' 0 0 0 ' + (cx + r) + ' ' + (yb - r) + ' V' + yt;
      var cp = el('clipPath', { id: uid + id }, defs); el('path', { d: d + ' Z' }, cp);
      var g = el('g', { 'clip-path': 'url(#' + uid + id + ')' }, pai);
      var o = { g: g, liq: el('rect', { x: cx - r, width: w, y: yt + 30, height: yb - yt, style: 'fill:' + CU }, g), pre: el('rect', { x: cx - r, width: w, style: 'fill:' + AGC }, g) };
      el('path', { d: d, style: 'fill:none;stroke:var(--lapis);stroke-width:2.2' }, pai);
      el('line', { x1: cx - r - 5, x2: cx + r + 5, y1: yt, y2: yt, style: 'stroke:var(--lapis);stroke-width:2.2' }, pai);
      return o;
    }
    function conta(pai, x, y, s, cor) { var g = el('g', {}, pai); el('path', { d: 'M' + (x - 9) + ' ' + (y - 46) + ' h18 v24 l-6 14 v8 h-6 v-8 l-6 -14 z', style: 'fill:color-mix(in srgb,' + cor + ' 30%,var(--folha));stroke:var(--lapis);stroke-width:1.5' }, g); tx(x + 16, y - 30, s, 'font-size:15px;font-weight:700;fill:var(--tinta)', g); return g; }
    /* ---------- etapas 1 e 2 ---------- */
    var g12 = el('g', {});
    var T1 = tubo(g12, 80, 70, 230, 64, 'a'), T2 = tubo(g12, 330, 70, 230, 64, 'b');
    var lab1 = tx(80, 252, 'tubo 1', 'font-size:14px;fill:var(--lapis);' + C, g12), lab2 = tx(330, 252, 'filtrado', 'font-size:14px;fill:var(--lapis);' + C, g12);
    var ions1 = el('g', {}, g12);
    [['Ag⁺', 64, 140], ['Cu²⁺', 96, 168], ['Ag⁺', 92, 120], ['Cu²⁺', 66, 196]].forEach(function (a) { tx(a[1], a[2], a[0], 'font-size:14px;font-weight:700;fill:#173b57;' + C, ions1); });
    var ions2 = el('g', {}, g12);
    [['Cu²⁺', 316, 150], ['Cu²⁺', 346, 186]].forEach(function (a) { tx(a[1], a[2], a[0], 'font-size:14px;font-weight:700;fill:#173b57;' + C, ions2); });
    var gota1 = conta(g12, 80, 58, 'NaCl', '#999'), gota2 = conta(g12, 330, 58, 'NaOH', '#999');
    var pin = [el('circle', { r: 4, style: 'fill:#ccc;stroke:#888' }, g12), el('circle', { r: 4, style: 'fill:#ccc;stroke:#888' }, g12)];
    /* filtro */
    var fil = el('g', {}, g12);
    el('path', { d: 'M168 92 L232 92 L206 140 V178 M194 178 V140 Z', style: 'fill:none;stroke:var(--lapis);stroke-width:2' }, fil);
    el('path', { d: 'M174 96 L226 96 L200 136 Z', style: 'fill:color-mix(in srgb,#e9e4d6 70%,var(--folha));stroke:#b8ad8f;stroke-width:1.2' }, fil);
    var resid = el('path', { d: 'M190 126 L210 126 L200 136 Z', style: 'fill:' + AGC + ';stroke:#999;stroke-width:1' }, fil);
    tx(200, 82, 'filtro', 'font-size:14px;fill:var(--lapis);' + C, fil);
    var setaF = el('path', { d: 'M206 182 C230 200 270 196 294 180 m-10 -2 l10 2 l-4 9', style: 'fill:none;stroke:var(--lapis);stroke-width:1.8' }, fil);
    var agL = tx(118, 226, 'AgCl(s)', 'font-size:14px;font-weight:700;fill:var(--tinta)', g12);
    var cuL = tx(294, 224, 'Cu(OH)₂(s)', 'font-size:14px;font-weight:700;fill:#3d7fa8;text-anchor:end', g12);
    var agF = tx(240, 132, 'AgCl', 'font-size:14px;font-weight:700;fill:var(--tinta)', g12);
    var eq1 = tx(14, 30, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', g12);
    var eq2 = tx(14, 50, '', 'font-size:14px;fill:var(--lapis)', g12);
    /* tabela de solubilidade */
    var tb = el('g', {}, g12), TX = 432, TY = 92;
    tx(TX, TY - 16, 'dissolve em água?', 'font-size:14px;font-weight:700;fill:var(--tinta)', tb);
    ['Na⁺', 'Cu²⁺', 'Ag⁺'].forEach(function (s, i) { tx(TX + 78 + i * 50, TY + 10, s, 'font-size:14px;font-weight:700;fill:var(--tinta);' + C, tb); });
    var TABV = [['NO₃⁻', 1, 1, 1], ['Cl⁻', 1, 1, 0], ['OH⁻', 1, 0, 0]];
    var cel = {};
    TABV.forEach(function (r, j) {
      var y = TY + 20 + j * 34; tx(TX, y + 22, r[0], 'font-size:14px;font-weight:700;fill:var(--tinta)', tb);
      for (var i = 0; i < 3; i++) { var c = r[i + 1] ? VD : VM, g = el('g', {}, tb);
        el('rect', { x: TX + 56 + i * 50, y: y, width: 44, height: 30, rx: 5, style: 'fill:color-mix(in srgb,' + c + ' 14%,var(--folha));stroke:' + c + ';stroke-width:1.2' }, g);
        tx(TX + 78 + i * 50, y + 21, r[i + 1] ? 'sim' : 'não', 'font-size:14px;font-weight:700;fill:' + c + ';' + C, g); cel[j + '' + i] = g; }
    });
    var hl = el('rect', { width: 154, height: 34, rx: 6, style: 'fill:none;stroke:var(--tinta);stroke-width:2.2' }, tb);
    var aviso = tx(TX - 6, 236, '', 'font-size:14px;fill:var(--tinta)', g12);
    var aviso2 = tx(TX - 6, 254, '', 'font-size:14px;fill:var(--tinta)', g12);
    /* ---------- etapa 3 ---------- */
    var g3 = el('g', {});
    var A = tubo(g3, 80, 70, 220, 60, 'c'), Bt = tubo(g3, 236, 70, 220, 60, 'd');
    A.liq.setAttribute('style', 'fill:#dceaf6'); Bt.liq.setAttribute('style', 'fill:#dceaf6'); A.pre.setAttribute('height', 0);
    Bt.pre.setAttribute('style', 'fill:#fbfbfb;stroke:#7a7a7a;stroke-width:1.4'); 
    [[80, 'Na₂SO₄', ' dissolveu', VD], [236, 'BaCO₃', ' não dissolveu', VM]].forEach(function (a) { var t0 = tx(a[0], 242, '', 'font-size:15px;font-weight:700;fill:var(--tinta);' + C, g3);
      var s1 = el('tspan', {}, t0); s1.textContent = a[1]; var s2 = el('tspan', { style: 'fill:' + a[3] }, t0); s2.textContent = ' ·' + a[2]; });
    
    var hc = [conta(g3, 80, 62, 'HCl', '#999'), conta(g3, 236, 62, 'HCl', '#999')];
    var semG = tx(80, 262, '+ HCl: nada', 'font-size:14px;fill:var(--tinta);' + C, g3), comG = tx(236, 262, '+ HCl: bolhas de CO₂', 'font-size:14px;font-weight:700;fill:' + AZ + ';' + C, g3);
    var bol = []; for (var i = 0; i < 9; i++) bol.push(el('circle', { r: 3 + (i % 3), style: 'fill:none;stroke:' + AZ + ';stroke-width:1.6' }, g3));
    var eqb = el('g', {}, g3), EX = 330;
    el('rect', { x: EX, y: 46, width: 298, height: 180, rx: 10, style: 'fill:color-mix(in srgb,' + AZ + ' 5%,var(--folha));stroke:var(--linha);stroke-width:1.2' }, eqb);
    [['BaCO₃(s) + 2 HCl(aq) →', 700], ['BaCl₂(aq) + H₂O(l) + CO₂(g)', 400], ['Na₂CO₃ + 2 HCl →', 700], ['2 NaCl + H₂O + CO₂(g)', 400], ['CO₂: o antigo "ar fixo" (J. Black)', 400], ['Na₂SO₄ + HCl: sem gás', 700]].forEach(function (l, i) {
      tx(EX + 14, 72 + i * 26 + (i > 1 ? 8 : 0) + (i > 4 ? 6 : 0), l[0], 'font-size:15px;font-weight:' + l[1] + ';fill:' + (i === 4 ? AZ : 'var(--tinta)'), eqb);
    });
    /* ---------- painel ---------- */
    el('line', { x1: 14, x2: 626, y1: 272, y2: 272, style: 'stroke:var(--linha);stroke-width:1.5' });
    var L0 = tx(18, 298, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)');
    var Ls = [0, 1, 2].map(function (i) { return tx(18, 326 + 24 * i, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['1. Primeiro o reagente que precipita só um', 'A solução tem Ag⁺ e Cu²⁺. Com Cl⁻ (NaCl), só a prata forma sólido:', 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s), branco. CuCl₂ é solúvel: o Cu²⁺ continua', 'dissolvido (por isso o líquido segue azul).'],
      ['2. Filtra e precipita o outro', 'O filtro segura o AgCl. No filtrado só resta Cu²⁺; com OH⁻ (NaOH):', 'Cu²⁺(aq) + 2 OH⁻(aq) → Cu(OH)₂(s), azul. Cada íon saiu separado.', 'Com NaOH primeiro, os dois precipitariam juntos.'],
      ['3. Carbonato + ácido: efervescência', 'Sais de sódio dissolvem; sulfato e carbonato de bário não.', 'Ácido forte transforma carbonato em H₂CO₃, que se decompõe:', 'sai CO₂ (bolhas). Sulfato com ácido não solta gás.']
    ];
    var _desenha = function (t) {
      var f = t < 5.5 ? 0 : t < 11 ? 1 : 2;
      op(g12, f < 2 ? 1 : 0); op(g3, f === 2 ? 1 : 0);
      if (f < 2) {
        /* tubo 1 */
        var p1 = ease((t - 1.6) / 2.2);   /* precipitado de AgCl */
        var esv = f === 1 ? ease((t - 5.8) / 1.6) : 0;   /* tubo 1 esvazia no filtro */
        var top1 = lerp(100, 210, esv);
        T1.liq.setAttribute('y', top1.toFixed(1)); T1.liq.setAttribute('height', (240 - top1).toFixed(1)); op(T1.liq, 1 - esv);
        var hp = 18 * p1 * (1 - esv); T1.pre.setAttribute('y', (230 - hp).toFixed(1)); T1.pre.setAttribute('height', hp.toFixed(1)); T1.pre.setAttribute('style', 'fill:#fbfbfb;stroke:#6f6f6f;stroke-width:1.6');
        op(ions1, (1 - esv) * 1); ions1.childNodes[0].style.opacity = 1 - p1; ions1.childNodes[2].style.opacity = 1 - p1;
        op(gota1, f === 0 ? cl((t - .3) / .4) * (1 - cl((t - 4.6) / .5)) : 0);
        var gd = (t - .9) % .5 / .5; pin[0].setAttribute('cx', 80); pin[0].setAttribute('cy', (64 + 40 * gd).toFixed(1)); op(pin[0], f === 0 && t > .9 && t < 2.6 ? 1 : 0);
        op(fil, f === 1 ? 1 : .25); op(resid, f === 1 ? esv : 0); op(setaF, f === 1 ? cl((t - 6.6) / .4) : 0);
        /* tubo 2 */
        var ench = f === 1 ? ease((t - 6.6) / 1.4) : 0, p2 = f === 1 ? ease((t - 8.4) / 1.8) : 0;
        var top2 = lerp(230, 110, ench);
        T2.liq.setAttribute('y', top2.toFixed(1)); T2.liq.setAttribute('height', (240 - top2).toFixed(1)); T2.liq.setAttribute('style', 'fill:' + (p2 > .5 ? 'color-mix(in srgb,' + CU + ' ' + Math.round(100 - 80 * p2) + '%,#eef4f8)' : CU));
        var hp2 = 22 * p2; T2.pre.setAttribute('y', (230 - hp2).toFixed(1)); T2.pre.setAttribute('height', hp2.toFixed(1)); T2.pre.setAttribute('style', 'fill:' + CUp + ';stroke:#5a8fb0;stroke-width:1');
        op(ions2, ench * (1 - p2)); op(lab2, f === 1 ? 1 : .3);
        op(gota2, f === 1 ? cl((t - 7.9) / .4) : 0);
        var gd2 = (t - 8.2) % .5 / .5; pin[1].setAttribute('cx', 330); pin[1].setAttribute('cy', (64 + 44 * gd2).toFixed(1)); op(pin[1], f === 1 && t > 8.2 && t < 9.8 ? 1 : 0);
        /* destaque na tabela e equacao */
        var lin = f === 0 ? 1 : 2; hl.setAttribute('x', TX + 53); hl.setAttribute('y', TY + 18 + lin * 34);
        op(hl, f === 0 ? cl((t - 1.2) / .4) : cl((t - 8) / .4));
        eq1.setAttribute('x', f === 0 ? 150 : 14); eq2.setAttribute('x', f === 0 ? 150 : 14);
        eq1.textContent = f === 0 ? 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)' : 'Cu²⁺(aq) + 2 OH⁻(aq) → Cu(OH)₂(s)';
        eq2.textContent = f === 0 ? 'o Cu²⁺ não precipita com Cl⁻' : 'no filtrado só havia Cu²⁺';
        op(eq1, f === 0 ? cl((t - 2.2) / .4) : cl((t - 9) / .4)); op(eq2, f === 0 ? cl((t - 2.6) / .4) : cl((t - 9.4) / .4));
        aviso.textContent = f === 0 ? 'Cl⁻: só o Ag⁺ precipita' : 'OH⁻ precipitaria Cu²⁺ e Ag⁺:'; aviso2.textContent = f === 0 ? '' : 'por isso ele vem depois';
        op(aviso, f === 0 ? cl((t - 3) / .4) : cl((t - 9.6) / .4)); op(aviso2, cl((t - 9.6) / .4));
        lab1.textContent = esv > .5 ? 'tubo 1 (vazio)' : 'tubo 1';
        op(agL, cl((t - 2.6) / .4) * (1 - esv)); op(cuL, cl((t - 9.4) / .4)); op(agF, f === 1 ? esv : 0);
      }
      if (f === 2) {
        A.liq.setAttribute('y', 110); A.liq.setAttribute('height', 130);
        Bt.liq.setAttribute('y', 110); Bt.liq.setAttribute('height', 130);
        var gas = ease((t - 12.6) / 2.4);
        var hB = 20 * (1 - .55 * gas); Bt.pre.setAttribute('y', (220 - hB).toFixed(1)); Bt.pre.setAttribute('height', hB.toFixed(1));
        hc.forEach(function (g) { op(g, cl((t - 11.4) / .4)); });
        bol.forEach(function (b, i) { var w = ((t - 12.6) * .9 + i / bol.length) % 1; b.setAttribute('cx', (236 + ((i * 37) % 36) - 18).toFixed(1)); b.setAttribute('cy', (212 - 100 * w).toFixed(1)); op(b, t > 12.6 ? Math.sin(Math.PI * w) : 0); });
        op(semG, cl((t - 12.8) / .4)); op(comG, cl((t - 12.8) / .4)); op(eqb, cl((t - 13.2) / .5));
      }
      var T = TXT[f]; L0.textContent = T[0]; Ls.forEach(function (o, i) { o.textContent = T[i + 1] || ''; });
    };
    var FR = { P6357fd4: 10.95, Pd43e13d: 16.45, P4f729f4: 16.45 };
    return fimResposta(VIS.def['precipitacao-seletiva-efervescencia'], svg, _desenha, 16.5, RESP, qid, { semEsmaecer: true, y: 278, oculta: [L0].concat(Ls), x: 8, w: 624, dt: 3.6, congela: function (q) { return FR[q] || 16.45; } });
  }
};
VIS.liga('precipitacao-seletiva-efervescencia', ['P6357fd4', 'Pd43e13d', 'P4f729f4']);
