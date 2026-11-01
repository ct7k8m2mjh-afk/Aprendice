VIS.def['ciclo-carbono-isotopos'] = {
  tit: 'Ciclo do carbono: queimar fóssil põe no ar carbono antigo, sem ¹⁴C',
  fontes: ['OpenStax Biology 2e, 46.3 Biogeochemical Cycles — https://openstax.org/books/biology-2e/pages/46-3-biogeochemical-cycles', 'Suess effect (Wikipedia; queda de ¹⁴C/¹²C pela queima de fósseis) — https://en.wikipedia.org/wiki/Suess_effect'],
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app (esquema fora de escala; no ar real há só cerca de 1 átomo de ¹⁴C para cada trilhão de ¹²C: aqui a proporção foi exagerada para ficar visível).',
  marcas: [[0, 'Ciclo natural'], [3.8, 'Queima de fóssil'], [8.2, 'Floresta madura']],
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var TXT = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var C12 = '#6b7280', C14 = '#e07b00', VERDE = '#2e8b57', AZUL = '#2f7fbf', FOS = '#3b3226';
    /* reservatorios */
    el('rect', { x: 14, y: 12, width: 384, height: 96, rx: 12, style: 'fill:color-mix(in srgb,#5b9bd5 10%,transparent);stroke:#8db6dc;stroke-width:1.5' });
    tx({ x: 26, y: 32, style: 'font-size:14px;font-weight:700;' + TXT }, 'ATMOSFERA: CO₂');
    var n14 = tx({ x: 386, y: 32, 'text-anchor': 'end', style: 'font-size:13px;' + LAP }, 'nêutron + ¹⁴N → ¹⁴C (alta atmosfera)');
    el('rect', { x: 14, y: 168, width: 168, height: 62, rx: 12, style: 'fill:color-mix(in srgb,' + VERDE + ' 12%,transparent);stroke:' + VERDE + ';stroke-width:1.5' });
    tx({ x: 26, y: 192, style: 'font-size:14px;font-weight:700;fill:' + VERDE }, 'Seres vivos');
    tx({ x: 26, y: 210, style: 'font-size:13px;' + TXT }, 'plantas, animais,');
    tx({ x: 26, y: 225, style: 'font-size:13px;' + TXT }, 'decompositores');
    el('rect', { x: 196, y: 168, width: 108, height: 62, rx: 12, style: 'fill:color-mix(in srgb,' + AZUL + ' 14%,transparent);stroke:' + AZUL + ';stroke-width:1.5' });
    tx({ x: 208, y: 192, style: 'font-size:14px;font-weight:700;fill:' + AZUL }, 'Oceano');
    tx({ x: 208, y: 210, style: 'font-size:13px;' + TXT }, 'CO₂ dissolvido');
    el('rect', { x: 14, y: 282, width: 384, height: 54, rx: 12, style: 'fill:#4a3f33;stroke:#2c241b;stroke-width:1.5' });
    tx({ x: 26, y: 304, style: 'font-size:14px;font-weight:700;fill:#f3eadb' }, 'Combustíveis fósseis (subsolo)');
    tx({ x: 26, y: 324, style: 'font-size:13px;fill:#e2d6c2' }, 'milhões de anos: o ¹⁴C já decaiu todo');
    /* setas de fluxo */
    function seta(d, cor, w) { return el('path', { d: d, style: 'fill:none;stroke:' + cor + ';stroke-width:' + (w || 3) + ';stroke-linecap:round;stroke-linejoin:round' }); }
    var sFot = seta('M44 112 V164 m-7 -9 l7 9 l7 -9', VERDE), sRes = seta('M150 164 V112 m-7 9 l7 -9 l7 9', '#8a5a2b');
    tx({ x: 52, y: 142, style: 'font-size:13px;font-weight:600;fill:' + VERDE }, 'fotossíntese');
    var lR = tx({ x: 158, y: 142, style: 'font-size:13px;font-weight:600;fill:#8a5a2b' }, 'respiração');
    var sOc = seta('M238 112 V164 m-7 -9 l7 9 l7 -9 M266 164 V112 m-7 9 l7 -9 l7 9', AZUL, 2.5);
    var sQ = seta('M352 280 V114 m-10 12 l10 -12 l10 12', '#c2410c', 6);
    var lQ = tx({ x: 360, y: 168, 'text-anchor': 'start', style: 'font-size:13.5px;font-weight:700;fill:#c2410c' }, 'queima');
    /* atomos no ar */
    var POS = [], s = 5;
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    for (var r = 0; r < 4; r++) for (var c = 0; c < 17; c++) POS.push([30 + c * 21 + (r % 2) * 10, 48 + r * 15]);
    var ordem = POS.map(function (p, i) { return [rnd(), i]; }).sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return x[1]; });
    var dots = ordem.map(function (i, k) {
      var is14 = k < 40 && k % 10 === 3;
      return { el: el('circle', { cx: POS[i][0], cy: POS[i][1], r: is14 ? 5 : 4, style: 'fill:' + (is14 ? C14 : C12) }), k: k };
    });
    /* particulas viajando */
    var vQ = []; for (var i = 0; i < 4; i++) vQ.push(el('circle', { r: 4, cx: 352, style: 'fill:' + C12 }));
    var vF = el('circle', { r: 4, cx: 44, style: 'fill:' + C14 }), vR = el('circle', { r: 4, cx: 150, style: 'fill:' + C12 });
    /* painel */
    var PX = 418;
    var fase = tx({ x: PX, y: 30, style: 'font-size:20px;font-weight:700;' + TXT });
    var L = []; for (i = 0; i < 6; i++) L.push(tx({ x: PX, y: 54 + i * 19, style: 'font-size:14px;' + TXT }));
    /* medidor */
    var MY = 196;
    var gM = el('g', {});
    tx({ x: PX, y: MY, style: 'font-size:13.5px;font-weight:700;' + TXT }, 'No ar (esquema):', gM);
    el('circle', { cx: PX + 6, cy: MY + 16, r: 5, style: 'fill:' + C14 }, gM);
    var m14 = tx({ x: PX + 16, y: MY + 21, style: 'font-size:13.5px;' + TXT }, '', gM);
    el('circle', { cx: PX + 6, cy: MY + 36, r: 4, style: 'fill:' + C12 }, gM);
    var m12 = tx({ x: PX + 16, y: MY + 41, style: 'font-size:13.5px;' + TXT }, '', gM);
    el('rect', { x: PX, y: MY + 54, width: 200, height: 14, rx: 7, style: 'fill:color-mix(in srgb,var(--tinta) 9%,transparent)' }, gM);
    var barra = el('rect', { x: PX, y: MY + 54, height: 14, rx: 7, style: 'fill:' + C14 }, gM);
    var mR = tx({ x: PX, y: MY + 88, style: 'font-size:13.5px;font-weight:700;' + TXT }, '', gM);
    var mR2 = tx({ x: PX, y: MY + 106, style: 'font-size:13.5px;font-weight:700;' + TXT }, '', gM);
    var mR3 = tx({ x: PX, y: MY + 124, style: 'font-size:13.5px;' + LAP }, '', gM);
    var eq = tx({ x: 98, y: 252, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;fill:' + VERDE }, 'CO₂ que entra ≈ CO₂ que sai');
    var TQ0 = 4.2, TQ1 = 7.6;
    return function (t) {
      var nAdd = t < TQ0 ? 0 : Math.min(24, Math.floor(24 * (t - TQ0) / (TQ1 - TQ0)));
      if (t >= TQ1) nAdd = 24;
      dots.forEach(function (d) { d.el.style.display = d.k < 40 + nAdd ? '' : 'none'; });
      var queima = t >= 3.8 && t < 8.1;
      sQ.style.opacity = t < 3.8 ? 0 : queima ? 1 : .35; lQ.style.opacity = t < 3.8 ? 0 : 1;
      vQ.forEach(function (v, i) {
        var u = ((t - TQ0) * 1.4 + i * .25) % 1;
        if (t < TQ0 || t > TQ1) { v.style.display = 'none'; return; }
        v.style.display = ''; v.setAttribute('cy', (278 - 160 * u).toFixed(1));
      });
      var ciclo = (t * .9) % 1;
      vF.setAttribute('cy', (114 + 48 * ciclo).toFixed(1)); vF.style.fill = Math.floor(t * .9) % 4 === 0 ? C14 : C12; vR.setAttribute('cy', (162 - 48 * ciclo).toFixed(1));
      var mad = t >= 8.2;
      sFot.style.strokeWidth = sRes.style.strokeWidth = mad ? 5 : 3;
      var tot = 40 + nAdd, frac = 4 / tot;
      m14.textContent = '¹⁴C: 4 átomos (não aumenta)';
      m12.textContent = '¹²C: ' + (tot - 4) + ' átomos';
      barra.setAttribute('width', (200 * frac / .1).toFixed(1));
      mR.textContent = '¹⁴C/¹²C: 1 para ' + (Math.round((tot - 4) / 4 * 10) / 10).toString().replace('.', ',');
      mR2.textContent = nAdd ? 'a razão ¹²C/¹⁴C aumentou' : 'razão constante: o ¹⁴C que';
      mR3.textContent = nAdd ? '(¹⁴C/¹²C caiu)' : 'decai é reposto na atmosfera';
      var F;
      if (t < 3.8) F = ['Ciclo natural', 'fotossíntese tira CO₂ do ar;', 'respiração e decomposição', 'devolvem; o ¹⁴C formado no ar', 'repõe o que decai, e a', 'proporção fica estável'];
      else if (t < 8.2) F = ['Queima de fóssil', 'carbono guardado há milhões de', 'anos volta ao ar como CO₂:', 'o CO₂ do ar aumenta, e esse', 'carbono é quase só ¹²C (o ¹⁴C', 'decaiu: meia-vida de 5.700 anos)'];
      else F = ['Floresta madura', 'fotossíntese ≈ respiração das', 'plantas + decomposição:', 'saldo de O₂ perto de zero.', 'Não é o "pulmão do mundo";', 'como o pulmão, ela libera CO₂'];
      fase.textContent = F[0];
      for (var k = 0; k < 6; k++) L[k].textContent = F[k + 1] || '';
      
      gM.style.opacity = mad ? .35 : 1; eq.style.opacity = mad ? 1 : 0;
    };
  }
};
VIS.liga('ciclo-carbono-isotopos', ['Paa70e00', 'W81929df', 'P9738104']);

/* etapa final: "Por isso a resposta é..." da questão aberta */
(function () {
  var V = VIS.def['ciclo-carbono-isotopos'], m0 = V.monta, D0 = V.dur, R = {"Paa70e00": ["D", "O fóssil não tem ¹⁴C (decaiu em milhões de anos): a queima", "só adiciona ¹²C, e a razão ¹²C/¹⁴C do ar aumenta."], "W81929df": ["D", "A queima leva para a atmosfera o carbono que estava", "guardado no subsolo: aumenta o carbono do ar."], "P9738104": ["B", "A floresta madura libera CO₂ (como o pulmão) e consome quase", "todo o O₂ que produz; o Pantanal regula água e substâncias."]};
  V.dur = D0 + 2.6; V.marcas = V.marcas.concat([[D0, 'Resposta']]);
  V.monta = function (svg, qid) {
    var d = m0(svg, qid), NS = 'http://www.w3.org/2000/svg', r = R[qid];
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    var g = el('g', { style: 'display:none' });
    el('rect', { x: 0, y: 0, width: 640, height: 360, style: 'fill:var(--folha);opacity:.86' }, g);
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
