/* Abertura e fechamento do estomato: K+ entra -> agua entra por osmose -> celulas-guarda turgidas -> ostiolo abre;
   K+ sai -> agua sai -> flacidas -> fecha. Transpiracao estomatica x cuticular. Questoes W94aca00 e Wc40fe33. */
/* etapa final "Resposta" (variante lateral): o cartao ocupa a coluna de texto da direita e o desenho da
   esquerda fica inteiro, congelado no quadro que decide a questao. R[qid] = ['Por isso a resposta é X', linhas curtas...] */
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
  'W94aca00': ['Por isso a resposta é A', 'Sai K⁺ da célula-guarda', 'e a água sai junto, por', 'osmose.', '', 'Flácidas, as células-', 'guarda se encostam:', 'o estômato FECHA.'],
  'Wc40fe33': ['Por isso a resposta é C', 'A folha transpira pelos', 'estômatos (a maior', 'parte, regulável) e', 'pela cutícula (pouco,', 'sem controle).', '', 'Hidatódio solta água', 'líquida: é gutação.']
};
VIS.def['estomato-abertura'] = {
  tit: 'Como o estômato abre e fecha',
  fontes: [
    'OpenStax, Biology 2e, 30.5 Transport of Water and Solutes in Plants (estômatos, células-guarda, K⁺ e água, transpiração, cutícula) — https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants',
    'Wikipedia (en), Guard cell (entrada de K⁺ → água por osmose → turgor → abertura; saída de K⁺ e fechamento; ácido abscísico) — https://en.wikipedia.org/wiki/Guard_cell',
    'Wikipedia (en), Transpiration (estomática e cuticular; gutação é outro fenômeno) — https://en.wikipedia.org/wiki/Transpiration'
  ],
  tipo: 'anim', dur: 16,
  marcas: [[0, 'Foto'], [4, 'Abre'], [8, 'Fecha'], [12, 'Transpiração']],
  cred: 'Foto real de microscópio óptico (400×), recortada: "Stomata of Tradescantia spathacea leaves.jpg", Trương Minh Khải, CC BY 4.0, via Wikimedia Commons. Esquemas feitos para o app (fora de escala).',
  nota: 'Primeiro se move o soluto (K⁺), depois a água vai atrás por osmose. Cheias, as células-guarda se curvam e abrem o ostíolo; murchas, se encostam e fecham.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0.001 ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var KC = '#7a4fa8', AG = '#2b8fc4', VD = '#4f8a3c';
    var TX = 440, tT = tx(TX, 40, '', 'font-size:19px;font-weight:700;fill:var(--tinta)'), tL = [];
    for (var i = 0; i < 9; i++) tL.push(tx(TX, 70 + i * 21, '', 'font-size:14px;fill:var(--tinta)'));
    var sep = el('line', { x1: 424, x2: 424, y1: 20, y2: 330, style: 'stroke:var(--linha);stroke-width:1.2' });

    /* ===== 1. foto ===== */
    var PX = 14, PY = 26, PW = 396, PH = 297;
    var G1 = el('g', {});
    var defs = el('defs', {}, G1), cp = el('clipPath', { id: 'esto-clip' }, defs);
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10 }, cp);
    el('image', { href: 'vis/estomato-abertura-1.webp', x: PX, y: PY, width: PW, height: PH, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#esto-clip)' }, G1);
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, G1);
    tx(PX, PY + PH + 18, 'epiderme de folha de Tradescantia spathacea, 400×', 'font-size:13px;fill:var(--lapis)', G1);
    var MK = [0, 1, 2].map(function (i) {
      var g = el('g', {}, G1);
      el('circle', { r: 12, style: 'fill:#fff;stroke:var(--ad-c);stroke-width:3' }, g);
      tx(0, 5, String(i + 1), 'font-size:14px;font-weight:800;fill:#14532d;text-anchor:middle', g);
      return g;
    });
    var MP = [[246, 268], [318, 238], [410, 300]];

    /* ===== 2 e 3. esquema das celulas-guarda (vista de cima) ===== */
    var G2 = el('g', {});
    var cx = 210, cy = 150, H = 76;
    /* celulas vizinhas da epiderme */
    var viz = 'M40 40 L120 34 L130 96 L60 112 Z M40 120 L120 106 L118 198 L44 206 Z M44 214 L118 206 L132 262 L50 272 Z M300 34 L380 40 L380 112 L290 96 Z M302 106 L380 120 L376 206 L302 198 Z M302 206 L376 214 L370 272 L288 262 Z M140 30 L280 30 L272 66 L148 66 Z M148 236 L272 236 L280 272 L140 272 Z';
    el('path', { d: viz, style: 'fill:#eef3e6;stroke:#a9b99a;stroke-width:1.4;stroke-linejoin:round' }, G2);
    tx(210, 53, 'vizinha', 'font-size:13px;fill:var(--lapis);text-anchor:middle', G2);
    var poro = el('path', { style: 'fill:#3a3a3a' }, G2);
    var gl = el('path', { style: 'fill:#9cc47a;stroke:#3f6b2a;stroke-width:1.6' }, G2), gr = el('path', { style: 'fill:#9cc47a;stroke:#3f6b2a;stroke-width:1.6' }, G2);
    var wl = el('path', { style: 'fill:none;stroke:#2f5220;stroke-width:5;stroke-linecap:round' }, G2), wr = el('path', { style: 'fill:none;stroke:#2f5220;stroke-width:5;stroke-linecap:round' }, G2);
    var cloro = []; for (i = 0; i < 8; i++) cloro.push(el('ellipse', { rx: 5, ry: 3.2, style: 'fill:#3f8a2a' }, G2));
    var ions = [], agua = [];
    for (i = 0; i < 6; i++) {
      var g = el('g', {}, G2); el('circle', { r: 10, style: 'fill:' + KC }, g); tx(0, 4.5, 'K⁺', 'font-size:12px;font-weight:700;fill:#fff;text-anchor:middle', g); ions.push(g);
      var a = el('path', { d: 'M0 -9 C5 -2 7 2 7 5 A7 7 0 0 1 -7 5 C-7 2 -5 -2 0 -9 Z', style: 'fill:' + AG }, G2); agua.push(a);
    }
    var lbGC = tx(16, 26, 'célula-guarda', 'font-size:13.5px;font-weight:700;fill:#2f5220', G2);
    var lnGC = el('path', { d: 'M70 30 C110 60 130 96 150 120', style: 'fill:none;stroke:var(--tinta);stroke-width:1' }, G2);
    var lbOst = tx(cx, 300, 'ostíolo', 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', G2);
    var lnOst = el('path', { d: 'M' + cx + ' 286 V' + (cy + 20), style: 'stroke:var(--tinta);stroke-width:1' }, G2);
    var est = tx(cx, 326, '', 'font-size:15px;font-weight:700;text-anchor:middle', G2);
    var lbP = tx(296, 160, '', 'font-size:13px;font-weight:700;fill:#2f5220', G2), lbP2 = tx(296, 176, '', 'font-size:13px;fill:var(--lapis)', G2);
    function guarda(a) {
      var Wo = 56 + 6 * a, gi = 1 + 12 * a, top = cy - H, bot = cy + H;
      gl.setAttribute('d', 'M' + cx + ' ' + top + ' Q' + (cx - 2 * Wo) + ' ' + cy + ' ' + cx + ' ' + bot + ' Q' + (cx - 2 * gi) + ' ' + cy + ' ' + cx + ' ' + top + ' Z');
      gr.setAttribute('d', 'M' + cx + ' ' + top + ' Q' + (cx + 2 * Wo) + ' ' + cy + ' ' + cx + ' ' + bot + ' Q' + (cx + 2 * gi) + ' ' + cy + ' ' + cx + ' ' + top + ' Z');
      wl.setAttribute('d', 'M' + cx + ' ' + (top + 14) + ' Q' + (cx - 2 * gi - 1) + ' ' + cy + ' ' + cx + ' ' + (bot - 14));
      wr.setAttribute('d', 'M' + cx + ' ' + (top + 14) + ' Q' + (cx + 2 * gi + 1) + ' ' + cy + ' ' + cx + ' ' + (bot - 14));
      poro.setAttribute('d', 'M' + cx + ' ' + top + ' Q' + (cx - 2 * gi) + ' ' + cy + ' ' + cx + ' ' + bot + ' Q' + (cx + 2 * gi) + ' ' + cy + ' ' + cx + ' ' + top + ' Z');
      var cor = 'fill:' + 'color-mix(in srgb,#9cc47a ' + Math.round(55 + 45 * a) + '%,#d9d2b0);stroke:#3f6b2a;stroke-width:1.6';
      gl.setAttribute('style', cor); gr.setAttribute('style', cor);
      cloro.forEach(function (c, i) {
        var s = i < 4 ? -1 : 1, k = i % 4, yy = cy - 45 + k * 30, half = (Wo + gi) / 2;
        var xin = cx + s * (gi * (1 - Math.pow((yy - cy) / H, 2)) * 1.0 + (Wo - gi) * .5 * (1 - Math.pow((yy - cy) / H, 2)));
        c.setAttribute('cx', xin.toFixed(1)); c.setAttribute('cy', yy.toFixed(1));
      });
    }
    var dentro = [[cx - 40, cy - 40], [cx - 44, cy + 6], [cx - 38, cy + 44], [cx + 40, cy - 40], [cx + 44, cy + 6], [cx + 38, cy + 44]];
    var fora = [[80, 70], [70, 160], [84, 240], [340, 70], [350, 160], [336, 240]];

    /* ===== 4. corte da folha: transpiracao ===== */
    var G4 = el('g', {});
    var lx0 = 24, lx1 = 408;
    el('rect', { x: lx0, y: 54, width: lx1 - lx0, height: 5, style: 'fill:#e3c45a' }, G4);
    for (var x = lx0; x + 32 <= lx1; x += 32) el('rect', { x: x, y: 59, width: 32, height: 22, style: 'fill:#f3f6ec;stroke:#a9b99a;stroke-width:1.2' }, G4);
    for (x = lx0 + 4; x < lx1 - 10; x += 20) el('rect', { x: x, y: 84, width: 16, height: 54, rx: 7, style: 'fill:#b7d79b;stroke:#6f9a54;stroke-width:1.2' }, G4);
    [[44, 158], [84, 172], [126, 156], [170, 176], [214, 160], [300, 160], [340, 176], [382, 158], [64, 200], [110, 206], [150, 198], [300, 202], [350, 204], [392, 196]].forEach(function (q) { el('ellipse', { cx: q[0], cy: q[1], rx: 16, ry: 12, style: 'fill:#cfe3bb;stroke:#6f9a54;stroke-width:1.2' }, G4); });
    for (x = lx0; x + 32 <= lx1; x += 32) { if (x > 214 && x < 280) continue; el('rect', { x: x, y: 222, width: 32, height: 22, style: 'fill:#f3f6ec;stroke:#a9b99a;stroke-width:1.2' }, G4); }
    el('rect', { x: lx0, y: 244, width: 249 - lx0, height: 5, style: 'fill:#e3c45a' }, G4);
    el('rect', { x: 255, y: 244, width: lx1 - 255, height: 5, style: 'fill:#e3c45a' }, G4);
    el('ellipse', { cx: 238, cy: 233, rx: 11, ry: 11, style: 'fill:#9cc47a;stroke:#3f6b2a;stroke-width:1.4' }, G4);
    el('ellipse', { cx: 266, cy: 233, rx: 11, ry: 11, style: 'fill:#9cc47a;stroke:#3f6b2a;stroke-width:1.4' }, G4);
    el('ellipse', { cx: 252, cy: 202, rx: 24, ry: 14, style: 'fill:#fbfdf8;stroke:#a9b99a;stroke-width:1' }, G4);
    tx(160, 48, 'cutícula (cera)', 'font-size:13px;font-weight:700;fill:#9a7b12', G4);
    tx(lx0, 48, 'epiderme superior', 'font-size:13px;fill:var(--lapis)', G4);
    tx(lx0, 268, 'estômato na epiderme inferior', 'font-size:13px;fill:var(--lapis)', G4);
    var vap = [];
    for (i = 0; i < 6; i++) vap.push(el('path', { d: 'M0 0 c-5 6 5 10 0 16 c-5 6 5 10 0 16', style: 'fill:none;stroke:' + AG + ';stroke-width:2.6;stroke-linecap:round' }, G4));
    var vapC = [];
    for (i = 0; i < 2; i++) vapC.push(el('path', { d: 'M0 0 c-4 -5 4 -8 0 -13 c-4 -5 4 -8 0 -13', style: 'fill:none;stroke:' + AG + ';stroke-width:1.4;stroke-linecap:round;opacity:.7' }, G4));
    tx(226, 292, 'pelo estômato: a maior parte', 'font-size:13.5px;font-weight:700;fill:#1f6f99;text-anchor:end', G4);
    tx(226, 308, '(regulável: abre e fecha)', 'font-size:13px;fill:var(--lapis);text-anchor:end', G4);
    tx(24, 22, 'pela cutícula: pouco, sem controle', 'font-size:13.5px;font-weight:700;fill:#1f6f99', G4);

    var TXT = [
      ['O estômato real', 'Epiderme de folha ao', 'microscópio óptico.', '1 célula-guarda: uma de', '   cada lado, com cloroplastos', '2 ostíolo: a fenda entre', '   as duas células-guarda', '3 célula vizinha da epiderme'],
      ['Abrindo', '1 Com luz e água, a célula-', '   guarda acumula K⁺ (gasta', '   ATP).', '2 Mais soluto dentro: a água', '   entra por osmose.', '3 Cheias (túrgidas), as duas', '   se curvam e se afastam:', '   o ostíolo ABRE.'],
      ['Fechando', 'Falta água na folha (o ácido', 'abscísico dá o sinal):', '1 o K⁺ sai para as vizinhas;', '2 a água sai junto, por', '   osmose;', '3 murchas (flácidas), as', '   células-guarda se encostam:', '   o ostíolo FECHA.'],
      ['Por onde sai o vapor', 'Transpiração = perda de', 'vapor de água pelas folhas.', 'Estomática: a maior parte', '(cerca de 90%), regulável.', 'Cuticular: um pouco passa', 'pela cera, sem controle.', 'Água líquida pelo hidatódio', 'é gutação, outra coisa.']
    ];
    var T = [0, 4, 8, 12];
    return fimLado(VIS.def['estomato-abertura'], svg, function (t) {
      var k = t < 4 ? 0 : t < 8 ? 1 : t < 12 ? 2 : 3, u = t - T[k];
      tT.textContent = TXT[k][0];
      tL.forEach(function (e, i) { var s = TXT[k][i + 1] || ''; e.textContent = s; e.style.fontWeight = /^\d |ABRE|FECHA/.test(s) ? '700' : '400'; });
      vis(G1, k === 0 ? 1 : 0); vis(G2, k === 1 || k === 2 ? 1 : 0); vis(G4, k === 3 ? 1 : 0);
      if (k === 0) MK.forEach(function (m, i) {
        var p = MP[i]; if (!p) { vis(m, 0); return; }
        vis(m, cl((u - .2 - i * .4) / .25)); m.setAttribute('transform', 'translate(' + (PX + p[0] * PW / 640).toFixed(1) + ' ' + (PY + p[1] * PH / 480).toFixed(1) + ')');
      });
      if (k === 1 || k === 2) {
        var abre = k === 1;
        var uK = ease((u - .3) / 1.0), uA = ease((u - 1.3) / 1.0), uG = ease((u - 2.0) / 1.0);
        var a = abre ? uG : 1 - uG;
        guarda(a);
        ions.forEach(function (g, i) {
          var p0 = abre ? fora[i] : dentro[i], p1 = abre ? dentro[i] : fora[i];
          g.setAttribute('transform', 'translate(' + lerp(p0[0], p1[0], uK).toFixed(1) + ' ' + lerp(p0[1], p1[1], uK).toFixed(1) + ')');
        });
        agua.forEach(function (d, i) {
          var p0 = abre ? fora[i] : dentro[i], p1 = abre ? dentro[i] : fora[i], ox = i < 3 ? 14 : -14;
          d.setAttribute('transform', 'translate(' + (lerp(p0[0], p1[0], uA) + ox).toFixed(1) + ' ' + (lerp(p0[1], p1[1], uA) + 16).toFixed(1) + ')');
          vis(d, u > 1.2 ? 1 : 0);
        });
        est.textContent = a > .5 ? 'túrgidas: ostíolo ABERTO' : 'flácidas: ostíolo FECHADO';
        est.style.fill = a > .5 ? '#2f5220' : '#8a5a12';
        lbP.textContent = u < 1.2 ? (abre ? 'K⁺ entra' : 'K⁺ sai') : (abre ? 'água entra' : 'água sai');
        lbP.textContent += u < 1.2 ? (abre ? ' (gasta ATP)' : ' para as vizinhas') : ' (osmose)';
        lbP.style.fill = u < 1.2 ? KC : AG;
        lbP.setAttribute('x', 404); lbP.setAttribute('y', 22); lbP.style.textAnchor = 'end'; vis(lbP2, 0);
      }
      if (k === 3) {
        vap.forEach(function (v, i) { var w = ((u * .6 + i / 6) % 1); v.setAttribute('transform', 'translate(' + (238 + (i % 3) * 14) + ' ' + (252 + 50 * w).toFixed(1) + ')'); v.style.opacity = (Math.sin(Math.PI * w)).toFixed(2); });
        vapC.forEach(function (v, i) { var w = ((u * .4 + i / 2) % 1); v.setAttribute('transform', 'translate(' + (300 + i * 70) + ' ' + (52 - 14 * w).toFixed(1) + ')'); v.style.opacity = (.8 * Math.sin(Math.PI * w)).toFixed(2); });
      }
    }, 16, RESP, qid, { congela: function (q) { return q === 'W94aca00' ? 11.9 : 15.9; } });
  }
};
VIS.liga('estomato-abertura', ['W94aca00', 'Wc40fe33']);
