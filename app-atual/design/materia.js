/* ==== APRENDICE · design da materia (reescrito 29/10 — critica de design: 25 itens + 15 bugs) ==== */
(function () {
  if (window.__adDesign) return; window.__adDesign = 1;
  var MAT = String(KEY).split('.')[1];
  var NOME = { bio: 'Biologia', qui: 'Química', mat: 'Matemática', por: 'Português' }[MAT] || '';
  var raiz = document.documentElement, noShell = window.parent !== window;
  if (!raiz.lang) raiz.lang = 'pt-BR';   /* auditoria 31/10: leitor de tela e hifenizacao em portugues */
  raiz.classList.add('ad', 'm-' + MAT);
  if (noShell) raiz.classList.add('emshell');
  function g(id) { return document.getElementById(id); }
  function e(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lsG(k) { try { return localStorage.getItem(k); } catch (x) { return null; } }
  function lsS(k, v) { try { localStorage.setItem(k, v); } catch (x) { } }
  /* 30/10 (pedido do dono): questao respondida hoje nao volta nos treinos e exercicios do mesmo dia */
  function feitaHoje(id) { var t = tentativas(id); if (!t.length) return false; var d = new Date(); d.setHours(0, 0, 0, 0); return t[t.length - 1].ts >= d.getTime(); }
  window.adFeitaHoje = feitaHoje;
  if (typeof treinoDeHoje === 'function') {
    var _tdh = treinoDeHoje;
    treinoDeHoje = function (n) {
      n = n || 12; var r = _tdh(n + 40), l = r.lista.filter(function (id) { return !feitaHoje(id); }).slice(0, n);
      var rv = Math.min(r.revisao, l.filter(function (id) { var t = tentativas(id); return t.length && !t[t.length - 1].ok; }).length);
      return { lista: l, revisao: rv, novas: l.length - rv };
    };
  }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function svgUrl(s) { return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")'; }
  /* blocos (29/10, 3a rodada): cada secao (titulo + conteudo) num cartao branco com borda fina; o que fica DENTRO
     (pilulas, listas, chips) continua sem caixa propria. bloco() monta o HTML; emBloco() embrulha o que o app ja tem. */
  function bloco(tit, corpo, cls, extra) { return '<section class="ad-bloco' + (cls ? ' ' + cls : '') + '"' + (extra || '') + '>' + (tit ? '<h2 class="sec">' + tit + '</h2>' : '') + corpo + '</section>'; }
  function emBloco(el, cls) {
    if (!el || !el.parentNode || el.parentNode.classList.contains('ad-bloco')) return el && el.parentNode;
    var h = el.previousElementSibling, s = document.createElement('section'); s.className = 'ad-bloco' + (cls ? ' ' + cls : '');
    el.parentNode.insertBefore(s, h && h.tagName === 'H2' ? h : el);
    if (h && h.tagName === 'H2') s.appendChild(h);
    s.appendChild(el); return s;
  }
  /* qual tela esta aberta: o CSS usa para o modo foco (questao/simulado/resultado) */
  function poeVista(v) { raiz.setAttribute('data-v', v); }
  poeVista('inicio');

  /* ---------- tema: um so, escolhido na pagina principal (escuro por padrao) ---------- */
  function temaAd() { raiz.setAttribute('data-theme', lsG('ad-tema') || 'light'); }
  temaAd();
  /* auditoria 31/10: importar progresso MESCLA com o atual (antes substituia S.q inteiro: um backup antigo ou de outra
     materia apagava tudo) e so aceita questoes que existem nesta materia */
  var fImp = g('f-import');
  if (fImp) fImp.onchange = function (ev) {
    var f = ev.target.files && ev.target.files[0]; if (!f) return;
    var rd = new FileReader(), bt = g('b-import');
    rd.onload = function () {
      try {
        var r = JSON.parse(rd.result); if (!r || typeof r !== 'object' || !r.q || typeof r.q !== 'object') throw 0;
        var q2 = {}, n = 0; Object.keys(r.q).forEach(function (id) { if (POR[id] && r.q[id] && Array.isArray(r.q[id].tent)) { q2[id] = r.q[id]; n++; } });
        if (!n) { if (bt) bt.textContent = 'Este arquivo não é desta matéria'; return; }
        S.q = mesclaQ(S.q, q2); S.sims = mesclaSims(S.sims, r.sims || []);
        if (window.adFlashMescla && r.flash) S.flash = window.adFlashMescla(S.flash || {}, r.flash);
        if (r.flg) S.flg = Object.assign({}, r.flg, S.flg || {});
        salva(); location.reload();
      } catch (x) { if (bt) bt.textContent = 'Arquivo inválido'; }
    };
    rd.readAsText(f); ev.target.value = '';
  };
  addEventListener('storage', function (ev) { if (ev.key === 'ad-tema') temaAd(); });
  var bt = g('btema');
  if (bt) bt.addEventListener('click', function () { setTimeout(function () { lsS('ad-tema', raiz.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'); temaAd(); }, 0); });

  /* mascaras desenhadas (chevron, check, x, lampada) */
  var LAMP = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.8.6 1.1 1.4 1.1 2.2h5c0-.8.3-1.6 1.1-2.2A6 6 0 0 0 12 3z"/></svg>');
  var OK = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#06231A" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>');
  var XX = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2E0A12" stroke-width="3.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>');
  var OKM = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5 4.8 4.8L19.5 7"/></svg>');
  var XM = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>');
  var CHEV = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>');
  raiz.style.setProperty('--ad-lamp', LAMP); raiz.style.setProperty('--ad-ok', OK); raiz.style.setProperty('--ad-x', XX);
  raiz.style.setProperty('--ad-ok-m', OKM); raiz.style.setProperty('--ad-x-m', XM); raiz.style.setProperty('--ad-chev', CHEV);
  /* icones de interface: Lucide (lucide.dev, ISC License, Copyright (c) Lucide Icons and Contributors) —
     nenhum emoji nem simbolo de teclado faz papel de icone */
  var LUP = {
    play: '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>',
    pause: '<rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/>',
    denovo: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    esq: '<path d="m15 18-6-6 6-6"/>', dir: '<path d="m9 18 6-6-6-6"/>',
    cheia: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    sai: '<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', check: '<path d="M20 6 9 17l-5-5"/>',
    mais: '<path d="M5 12h14"/><path d="M12 5v14"/>', menos: '<path d="M5 12h14"/>',
    lupa: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/>',
    teclado: '<path d="M10 8h.01M12 12h.01M14 8h.01M16 12h.01M18 8h.01M6 8h.01M7 16h10M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/>',
    localizar: '<circle cx="12" cy="12" r="10"/><path d="M22 12h-4M6 12H2M12 6V2M12 22v-4"/>',
    eliminar: '<circle cx="12" cy="12" r="10"/><path d="m9 15 6-6"/>',
    calcular: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
    comparar: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
    concluir: '<path d="M20 6 9 17l-5-5"/>',
    tabela: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
    texto: '<path d="M17 6.1H3M21 12.1H3M15.1 18H3"/>'
  };
  function lu(n, cls) { return '<svg class="' + (cls || 'ic-ui') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + LUP[n] + '</svg>'; }
  function luM(n) { return svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + LUP[n] + '</svg>'); }
  ['localizar', 'eliminar', 'calcular', 'comparar', 'concluir'].forEach(function (k) { raiz.style.setProperty('--tp-' + k, luM(k)); });
  var IC_EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  var IC_BANCA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5 12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3.5 20h17"/></svg>';

  /* ---------- cabecalho + filtros por banca + faixa de temas ---------- */
  var MODLIST = Object.keys(TEORIA).filter(function (m) { return MODS[m]; }).sort();
  var GRUPOS = [{ id: 'todos', nome: 'Todos', f: function () { return true; } }];
  var porEsc = {}; BANCO.forEach(function (q) { if (q.tipo !== 'site') porEsc[q.escola] = (porEsc[q.escola] || 0) + 1; });
  ['São Camilo', 'Fuvest', 'Unesp'].forEach(function (u) { if (porEsc[u]) GRUPOS.push({ id: u, nome: u, f: function (q) { return q.tipo !== 'site' && q.escola === u; } }); });
  if (BANCO.some(function (q) { return q.tipo !== 'site' && ['São Camilo', 'Fuvest', 'Unesp'].indexOf(q.escola) < 0; }))
    GRUPOS.push({ id: 'outras', nome: 'Outras provas', f: function (q) { return q.tipo !== 'site' && ['São Camilo', 'Fuvest', 'Unesp'].indexOf(q.escola) < 0; } });
  if (BANCO.some(function (q) { return q.tipo === 'site'; })) GRUPOS.push({ id: 'listas', nome: 'Listas', f: function (q) { return q.tipo === 'site'; } });
  var FILTRO = lsG('ad-filtro-' + MAT) || 'todos';
  if (!GRUPOS.some(function (x) { return x.id === FILTRO; })) FILTRO = 'todos';
  function grupo() { return GRUPOS.filter(function (x) { return x.id === FILTRO; })[0]; }

  var wrap = document.querySelector('.wrap');
  var cab = document.createElement('div'); cab.id = 'ad-cab';
  /* o total de questoes fica na capa ("0 de 500 respondidas"): aqui so o que nao se repete */
  cab.innerHTML = '<div class="ad-tit"><div><h1>' + NOME + '</h1><div class="ad-n">' + MODLIST.length + ' temas · só questões reais, com a fonte</div></div></div>' +
    '<div class="ad-filtros" role="group" aria-label="Destacar questões por banca">' + GRUPOS.map(function (x) {
      var n = BANCO.filter(x.f).length;
      return '<button type="button" data-f="' + e(x.id) + '" aria-pressed="' + (x.id === FILTRO) + '" title="' + n + ' questões">' + e(x.nome) + (x.id === 'todos' ? '' : '<small>' + n + '</small>') + '</button>';
    }).join('') + '</div>';
  var faixa = document.createElement('nav'); faixa.id = 'ad-temas'; faixa.setAttribute('aria-label', 'Temas de ' + NOME);
  faixa.innerHTML = '<div class="ad-rolo">' + MODLIST.map(function (m) {
    return '<button type="button" class="ad-tema" data-mod="' + m + '" title="' + e(TEORIA[m].nome) + '"><span class="ad-ic">' + ICO.tema(m) + '</span><span>' + e(TEORIA[m].nome) + '</span></button>';
  }).join('') + '</div>';
  faixa.insertAdjacentHTML('beforeend', '<button type="button" class="ad-seta e" aria-label="Temas anteriores" hidden>' + ICO.ui.voltar + '</button><button type="button" class="ad-seta d" aria-label="Mais temas">' + ICO.ui.seta + '</button>');
  /* credito das ilustracoes realistas (Servier, CC BY 3.0) — so nas materias que usam desenhos dela */
  /* 30/10: os icones de conteudo de Portugues tambem usam desenhos da Servier; o de biomas (B09.6) usa os limites do IBGE */
  var CRED = { bio: 'Ilustrações: Servier Medical Art (CC BY 3.0) e desenhos do app · Mapa dos biomas: IBGE (2019)', qui: 'Ilustrações: Servier Medical Art (CC BY 3.0) e desenhos do app', mat: 'Ilustrações: feitas para o app', por: 'Ilustrações: desenhadas para o app, com elementos da Servier Medical Art (CC BY 3.0)' };
  faixa.insertAdjacentHTML('beforeend', '<p class="ad-cred">' + CRED[MAT] + '</p>');
  (function () { var pe = document.createElement('p'); pe.className = 'ad-cred-pe'; pe.textContent = CRED[MAT]; var vi = document.getElementById('v-inicio'); if (vi) vi.appendChild(pe); })();   /* v65: credito no rodape da pagina */
  wrap.insertBefore(faixa, wrap.firstChild); wrap.insertBefore(cab, faixa);
  document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><filter id="ad-rabisco" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="r"/><feDisplacementMap in="SourceGraphic" in2="r" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>');
  var rolo = faixa.querySelector('.ad-rolo'), setaE = faixa.querySelector('.ad-seta.e'), setaD = faixa.querySelector('.ad-seta.d');
  function setas() { setaE.hidden = rolo.scrollLeft < 8; setaD.hidden = rolo.scrollLeft + rolo.clientWidth >= rolo.scrollWidth - 8; faixa.classList.toggle('ad-fe', !setaE.hidden); faixa.classList.toggle('ad-fd', !setaD.hidden); }   /* v65: a borda so esmaece do lado em que ha mais temas */
  rolo.addEventListener('scroll', setas, { passive: true }); addEventListener('resize', setas); setTimeout(setas, 50);
  setaE.onclick = function () { rolo.scrollBy({ left: -rolo.clientWidth * .7 }); };
  setaD.onclick = function () { rolo.scrollBy({ left: rolo.clientWidth * .7 }); };

  var modAtual = null;
  function pintaFaixa() {
    var gr = grupo();
    faixa.querySelectorAll('.ad-tema').forEach(function (b) {
      var m = b.dataset.mod, l = MODS[m] || [], p = Math.round(domMod(m) * 100);
      if (p > 0 && p < 3) p = 3;   /* 1% ja aparece no anel */
      b.querySelector('.ad-ic').style.setProperty('--p', p); b.style.setProperty('--p', p);
      var n = l.filter(gr.f).length, bd = b.querySelector('b');
      if (FILTRO === 'todos') { if (bd) bd.remove(); b.classList.remove('ad-zero'); }
      else { if (!bd) { bd = document.createElement('b'); b.appendChild(bd); } bd.textContent = n; b.classList.toggle('ad-zero', !n); }
      if (m === modAtual) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
  }
  /* so rola a faixa na horizontal (antes o scrollIntoView rolava a pagina e cortava a faixa no topo) */
  function rolaParaAtual() {
    var a = faixa.querySelector('[aria-current="true"]'); if (!a || !rolo.clientWidth) return;
    var ar = a.getBoundingClientRect(), rr = rolo.getBoundingClientRect();
    rolo.scrollLeft += (ar.left + ar.width / 2) - (rr.left + rr.width / 2);
  }
  faixa.addEventListener('click', function (ev) { var b = ev.target.closest('.ad-tema'); if (b) abreModulo(b.dataset.mod); });
  /* Ctrl+K de dentro da materia abre a busca da pagina principal */
  document.addEventListener('keydown', function (ev) { if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'k' || ev.key === 'K') && noShell) { ev.preventDefault(); try { window.parent.postMessage({ ad: 'busca' }, '*'); } catch (x) { } } });
  cab.querySelector('.ad-filtros').addEventListener('click', function (ev) {
    var b = ev.target.closest('button[data-f]'); if (!b) return;
    FILTRO = b.dataset.f; lsS('ad-filtro-' + MAT, FILTRO);
    cab.querySelectorAll('.ad-filtros button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    pintaFaixa(); aplicaFiltro();
  });

  function aplicaFiltro() {
    var gr = grupo();
    document.querySelectorAll('#e-degraus .degrau[data-id], #e-extras .linha[data-id]').forEach(function (r) {
      var q = POR[r.dataset.id]; r.classList.toggle('ad-fora', FILTRO !== 'todos' && !!q && !gr.f(q));
    });
    var av = g('ad-filtro-aviso'), alvo = g('e-degraus');
    if (FILTRO === 'todos' || !alvo) { if (av) av.remove(); return; }
    if (!av) { av = document.createElement('p'); av.id = 'ad-filtro-aviso'; av.className = 'ad-filtro-aviso'; alvo.parentNode.insertBefore(av, alvo); }
    var n = (escadaDe(subAtual) || []).filter(gr.f).length;
    av.innerHTML = ICO.ui.alvo + '<span>Em destaque: <b>' + e(gr.nome) + '</b> — ' + n + (n === 1 ? ' degrau' : ' degraus') + ' desta escada. A ordem da escada não muda.</span>';
  }

  /* o tema abre a PAGINA DO MODULO (o que voce vai encontrar + Comecar); a definicao fica mais abaixo */
  function abreModulo(m) { return paginaModulo(m); }

  /* ---------- envolve as funcoes do app (mesma ideia da camada PC) ---------- */
  var _vai = vai;
  vai = function (v) {
    if (v !== 'questao') {
      try { if (typeof FL !== 'undefined' && FL && FL.tg && FL.tg.s && !FL.tg.__fim) FL.tg.s = null; } catch (z) { }
      try { ANIM.tok++; paraVivas(); } catch (z) { }
    }
    var r = _vai.apply(this, arguments);
    poeVista(v === 'questao' && ctx && ctx.sim ? 'simulado-q' : v);
    if (v !== 'questao') raiz.classList.remove('ad-resp');
    if (v === 'inicio' || v === 'simulado' || v === 'progresso' || v === 'estudar') modAtual = null;
    if (v === 'escada' && subAtual) modAtual = subAtual.split('.')[0];
    pintaFaixa(); if (v !== 'estudar') rolaParaAtual();
    if (noShell) try { window.parent.postMessage({ ad: 'vista', v: (v === 'questao' && ctx && ctx.sim) ? 'simulado' : v }, '*'); } catch (x) { }
    return r;
  };
  var _pm = pintaModulos;
  pintaModulos = function () {
    var r = _pm.apply(this, arguments);
    /* "Questoes": grade de temas; cada tema abre a pagina do modulo (nao ha mais lista de escadas para escolher) */
    var tm = g('tit-modulos'); if (tm) tm.textContent = 'Temas de ' + NOME;
    var alvo = g('modulos');
    if (alvo) {
      alvo.innerHTML = '<p class="ad-mods-sub">Escolha um tema. Na página dele, o botão <b>Começar</b> sorteia questões entre os conteúdos, da mais fácil à mais difícil.</p><div class="ad-bloco ad-bl-mods"><div class="ad-mods">' + MODLIST.map(function (m) {
        var l = MODS[m], rsp = l.filter(function (q) { return respondida(q.id); }).length, ns = subsDe([m]).length;
        return '<button type="button" class="ad-mc" data-mod="' + m + '">' + ICO.tema(m) + '<span class="t"><b>' + e(TEORIA[m].nome) + '</b><small>' + ns + (ns === 1 ? ' conteúdo' : ' conteúdos') + ' · ' + l.length + ' questões</small>' +
          '<span class="br"><i style="width:' + (100 * rsp / l.length).toFixed(1) + '%"></i></span><small class="n">' + rsp + ' de ' + l.length + ' respondidas</small></span>' + ICO.ui.seta + '</button>';
      }).join('') + '</div></div>';
      alvo.querySelectorAll('.ad-mc').forEach(function (b) { b.onclick = function () { paginaModulo(b.dataset.mod); }; });
    }
    var av = g('aviso-cobertura'); if (av) av.hidden = true;
    return r;
  };
  /* escada: rotulo do degrau = de onde veio (banca + ano); estado embaixo; teoria vira botao */
  var _pe = pintaEscada;
  pintaEscada = function (s) {
    var r = _pe.apply(this, arguments);
    var dg = escadaDe(s), es = g('e-sub'), venc = dg.filter(function (q) { return acertou(q.id); }).length;
    if (es) es.textContent = dg.length + (dg.length === 1 ? ' degrau' : ' degraus') + ', do mais fácil ao mais difícil · você venceu ' + venc + '.';
    var sm = document.querySelector('#e-teoria details.teoria-cx > summary'); if (sm) sm.textContent = 'Ver a teoria que estas questões cobram';
    var etx = g('e-teoria'), mdx = String(s).split('.')[0];
    if (etx && cartoesDe(mdx).length) {   /* a teoria da escada agora abre nos cartoes, no conteudo desta escada */
      etx.innerHTML = '<button type="button" class="btn sec ad-esc-teo">' + ICO.ui.livro + 'Ver a teoria deste conteúdo em cartões</button>';
      etx.firstChild.onclick = function () { abreTeoria(mdx, s); };
    }
    var ev0 = g('e-volta'), md0 = String(s).split('.')[0];
    if (ev0) { ev0.innerHTML = ICO.ui.voltar + e((TEORIA[md0] || {}).nome || 'Todos os temas'); ev0.onclick = function () { paginaModulo(md0); }; }
    var et = g('e-tit'); if (et) { var ei = et.querySelector('.ad-et-ic'); if (ei) ei.remove(); et.insertAdjacentHTML('afterbegin', ICO.tema(s, 'ic-tema ad-et-ic')); }
    document.querySelectorAll('#e-degraus .degrau[data-id]').forEach(function (b) {
      var q = POR[b.dataset.id]; if (!q) return;
      var t = tentativas(q.id), lb = b.querySelector('.inf b'), sl = b.querySelector('.inf small');
      var rot = q.tipo === 'site' ? (q.fonte || 'Lista de exercícios') : ((q.escola || '') + ' ' + (q.ano || '') + (q.n ? ' · q' + q.n : ''));
      var oque = String(q.conceito || '').trim();   /* 01/11: sem corte no texto; o CSS limita a 2 linhas */
      if (lb) lb.textContent = oque ? cap(oque) : rot.trim();
      if (sl) sl.textContent = (oque ? rot.trim() + ' · ' : '') + (acertou(q.id) ? 'Vencido' : (t.length ? 'Errou · tente de novo' : (b.classList.contains('agora') ? 'Próximo degrau' : 'Ainda não feito')));
      b.setAttribute('aria-label', 'Degrau ' + q.degrau + ': ' + (oque ? cap(oque) + ' · ' : '') + (sl ? sl.textContent : rot.trim()));
      if (lb && oque) lb.title = cap(oque);
    });
    modAtual = String(s).split('.')[0]; pintaFaixa(); aplicaFiltro(); return r;
  };
  /* capa da materia: uma linha de numeros no lugar de 3 quadros; o treino diz so a composicao */
  var _pi = pintaInicio;
  pintaInicio = function () {
    var r = _pi.apply(this, arguments);
    var resp = BANCO.filter(function (q) { return respondida(q.id); }).length, sub = g('i-sub'), tit = g('i-tit'), td = g('treino-dica');
    var tt = BANCO.flatMap(function (q) { return tentativas(q.id); }), tx = tt.length ? Math.round(100 * tt.filter(function (x) { return x.ok; }).length / tt.length) + '%' : '—';
    if (!resp) { if (tit) tit.textContent = 'Comece pelos fundamentos'; if (sub) sub.textContent = 'Questões reais em escadas: da mais fácil à mais difícil.'; }
    else { if (tit) tit.textContent = 'Siga de onde parou'; if (sub) sub.textContent = 'Ou faça o treino de hoje: seus erros voltam junto com degraus novos.'; }
    var capa = document.querySelector('#v-inicio .capa');
    if (capa) {
      var st = capa.querySelector('.ad-stat'); if (!st) { st = document.createElement('p'); st.className = 'ad-stat'; capa.insertBefore(st, sub ? sub.nextSibling : null); }
      st.innerHTML = '<b>' + resp + '</b> de ' + BANCO.length + ' respondidas · acerto <b>' + tx + '</b>';
      if (!capa.querySelector('.ad-arte')) { var a = document.createElement('div'); a.className = 'ad-arte'; a.innerHTML = ICO.ilu[MAT]('i'); capa.insertBefore(a, capa.firstChild); }
    }
    var btr = g('b-treino'); if (btr) btr.textContent = 'Treino de hoje';
    var bco = g('b-continuar'); if (bco) bco.textContent = 'Continuar de onde parei';
    if (td) { var tr = treinoDeHoje(12); td.textContent = !tr.lista.length ? 'Você já respondeu tudo.' : (tr.revisao ? tr.revisao + ' para rever · ' + tr.novas + (tr.novas === 1 ? ' nova' : ' novas') : tr.novas + (tr.novas === 1 ? ' questão nova' : ' questões novas')); }
    /* 30/10 (2a rodada): a CAPA da materia e' o Treino geral (antes "Siga de onde parou"). O "Continue de onde parou"
       fica so na pagina principal (ultima questao feita, de qualquer materia): aqui o botao some, mas o comando continua valendo. */
    if (capa && typeof FL !== 'undefined' && FL && FL.tg && FL.tg.tem()) {
      capa.classList.add('ad-tem-tg');
      if (tit) tit.textContent = 'Treino geral';
      if (sub) sub.textContent = 'O essencial de ' + NOME + ': questões reais de prova, frases para completar e flashcards, tudo misturado.';
      var st2 = capa.querySelector('.ad-stat'); if (st2) { st2.className = 'ad-stat ad-tg-nums'; st2.innerHTML = FL.tg.chips(); }
      var bg = g('ad-tg');
      if (!bg) { bg = document.createElement('button'); bg.type = 'button'; bg.id = 'ad-tg'; bg.className = 'btn ad-tg-bt'; capa.appendChild(bg); }
      var gd = FL.tg.guardada && FL.tg.guardada();
      bg.innerHTML = ICO.ui.alvo + (gd ? 'Continuar treino geral' : 'Começar treino geral'); bg.onclick = function () { FL.tg.comeca(); };
      var cp = g('ad-tg-comp'); if (!cp) { cp = document.createElement('p'); cp.id = 'ad-tg-comp'; cp.className = 'ad-tg-comp'; capa.appendChild(cp); }
      cp.textContent = gd ? 'Você parou no item ' + (gd.i + 1) + ' de ' + gd.it.length + '. ' : FL.tg.compo();
      if (gd) { var nv = document.createElement('button'); nv.type = 'button'; nv.className = 'ad-tg-novo'; nv.textContent = 'Começar outra rodada'; nv.onclick = function () { FL.tg.novo(); }; cp.appendChild(nv); }
      var arte = capa.querySelector('.ad-arte'); if (arte && !arte.dataset.tg) { arte.dataset.tg = '1'; arte.classList.add('ad-tg-arte'); arte.innerHTML = '<img class="ad-tg-capa" src="capa-tg.webp" alt="" decoding="async">'; }   /* 30/10: capa 3D renderizada para o app (sem animacao) */
    }
    pintaAreas(); emBloco(g('reforco'), 'ad-bl-ref');
    return r;
  };

  /* ---------- fundo da materia: poucos desenhos do tema, bem apagados, num canto ---------- */
  (function fundo() {
    var cor = { bio: '#56D364', qui: '#F45D9C', mat: '#2CCFD0', por: '#F7C548' }[MAT];
    var motivos = { qui: ['Q11', 'Q02', 'Q01', 'Q05'], bio: ['B05', 'B01', 'B09', 'B10'], mat: ['M10', 'M11', 'M05', 'M12'], por: ['P06', 'P07', 'P11', 'P01'] }[MAT] || [];
    var pos = [[880, 40, 230, -12], [1120, 300, 170, 14], [700, 360, 120, 8], [1040, 620, 150, -18]];
    var corpo = motivos.map(function (m, i) {
      var s = ICO.traco(m), p = pos[i], pro = /ic-pro/.test(s);
      var miolo = s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
      return '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[3] + ' ' + p[2] / 2 + ' ' + p[2] / 2 + ') scale(' + (p[2] / 48) + ')" fill="none"' + (pro ? '' : ' stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"') + '>' + miolo + '</g>';
    }).join('');
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" preserveAspectRatio="xMaxYMin slice" color="' + cor + '">' + corpo + '</svg>';
    raiz.style.setProperty('--ad-motivo', svgUrl(svg));
  })();

  /* ---------- treino de hoje: lista e vestibular intercalados no MESMO nivel ----------
     O nivel e' o da questao (dif 1-10, analisada uma a uma), nao a fama da banca: uma questao facil de
     vestibular entra no treino junto das faceis de lista. Ordem: faixa de dificuldade crescente; dentro
     da faixa, conteudo mais fraco primeiro; alterna lista/vestibular enquanto houver dos dois. */
  var FAIXA_N = function (d) { return d <= 2 ? 0 : d <= 4 ? 1 : d <= 6 ? 2 : 3; };
  treinoDeHoje = function (n) {
    n = n || 12;
    var erradas = vencidas().slice(0, 5);   /* revisoes vencidas (fila espacada) entram primeiro */
    var usadas = {}; erradas.forEach(function (q) { usadas[q.id] = 1; });
    var forca = {}; Object.keys(SUBS).forEach(function (s) { var t = taxa(SUBS[s]); forca[s] = t === null ? 50 : t; });
    var ordem = function (a, b) { return (FAIXA_N(a.dif) - FAIXA_N(b.dif)) || (forca[a.sub] - forca[b.sub]) || (a.dif - b.dif) || ((a.degrau || 99) - (b.degrau || 99)); };
    var livres = BANCO.filter(function (q) { return !respondida(q.id) && !usadas[q.id] && SUBS[q.sub]; });
    var site = livres.filter(function (q) { return q.tipo === 'site'; }).sort(ordem);
    var prova = livres.filter(function (q) { return q.tipo !== 'site'; }).sort(ordem);
    var novas = [], porSub = {}, vez = 0;
    function tira(pool, teto) {
      for (var i = 0; i < pool.length; i++) {
        var q = pool[i];
        if ((porSub[q.sub] || 0) >= 3) continue;
        if (teto != null && FAIXA_N(q.dif) > teto) return null;
        pool.splice(i, 1); porSub[q.sub] = (porSub[q.sub] || 0) + 1; return q;
      }
      return null;
    }
    while (erradas.length + novas.length < n && (site.length || prova.length)) {
      var fx = Math.min(site.length ? FAIXA_N(site[0].dif) : 9, prova.length ? FAIXA_N(prova[0].dif) : 9);
      var prim = vez % 2 ? prova : site, seg = vez % 2 ? site : prova;
      var q = tira(prim, fx) || tira(seg, fx) || tira(prim, null) || tira(seg, null);
      if (!q) break;
      novas.push(q); vez++;
    }
    novas.sort(function (a, b) { return FAIXA_N(a.dif) - FAIXA_N(b.dif); });
    return { lista: erradas.concat(novas).map(function (q) { return q.id; }), revisao: erradas.length, novas: novas.length,
             provas: novas.filter(function (q) { return q.tipo !== 'site'; }).length };
  };

  /* ==========================================================================================
     REVISAO ESPACADA (ideias de Anki, Medway, UWorld; estudo de Butler sobre erro com certeza)
     Cada questao errada — ou acertada no chute / com dica — entra numa fila com data:
     1 -> 3 -> 7 -> 16 -> 35 dias. Acertou a revisao com seguranca: avanca. Errou: volta a 1 dia.
     Tudo sai do historico de tentativas que ja existe (+ conf e dica, gravados daqui em diante).
     ========================================================================================== */
  var DIA = 864e5, PASSOS = [1, 3, 7, 16, 35];
  /* datas por DIA do calendario: errou hoje, volta amanha (a partir da meia-noite). So avanca de etapa
     quem acerta NA DATA ou depois dela; acerto antes da data (refazer na hora) nao conta como revisao. */
  function iniDia(ts) { var d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function emNDias(ts, n) { var d = new Date(iniDia(ts)); d.setDate(d.getDate() + n); return d.getTime(); }
  function filaDe(id) {
    var t = tentativas(id), est = null;
    t.forEach(function (x) {
      var fraco = !x.ok || x.conf === 'chute' || (x.dica || 0) > 0;
      if (fraco) est = { etapa: 0, vence: emNDias(x.ts, PASSOS[0]), certeza: !x.ok && x.conf === 'certeza', entrou: true };
      else if (est && x.ts >= est.vence) {
        var et = est.etapa + 1;
        est = et >= PASSOS.length ? null : { etapa: et, vence: emNDias(x.ts, PASSOS[et]), certeza: false, entrou: true };
      }
    });
    return est;
  }
  function jaEntrou(id) { return tentativas(id).some(function (x) { return !x.ok || x.conf === 'chute' || (x.dica || 0) > 0; }); }
  window.adFilaDe = filaDe;
  function vencidas(ate) {
    ate = ate || Date.now();
    return BANCO.filter(function (q) { var f = filaDe(q.id); return f && f.vence <= ate; })
      .sort(function (a, b) { return filaDe(a.id).vence - filaDe(b.id).vence; });
  }
  function emDias(ms) { var d = Math.round((iniDia(ms) - iniDia(Date.now())) / DIA); return d <= 0 ? 'hoje' : d === 1 ? 'amanhã' : 'em ' + d + ' dias'; }

  /* ---------- certeza (nada pre-marcado) + dica + tempo certo em cada resposta ---------- */
  var confAtual = null;
  function poeCerteza() {
    var bol = g('bolhas'); if (!bol || g('ad-conf') || g('b-prox') || bol.querySelector('.certo,.errado') || document.querySelector('#q-corpo .veredito')) return;
    var d = document.createElement('div'); d.id = 'ad-conf'; d.className = 'ad-conf'; d.setAttribute('role', 'radiogroup'); d.setAttribute('aria-label', 'Quanta certeza você tem (opcional)');
    d.innerHTML = '<span class="ad-conf-rot" title="Opcional. Erro com certeza e acerto no chute voltam mais cedo na revisão.">Certeza? <small>(opcional)</small></span>' + [['certeza', 'Certeza'], ['acho', 'Acho que sim'], ['chute', 'Chutei']].map(function (c) {
      return '<button type="button" role="radio" data-c="' + c[0] + '" aria-checked="' + (c[0] === confAtual) + '">' + c[1] + '</button>';
    }).join('');
    var ac = document.querySelector('#q-corpo .entra2 > .acoes');
    if (ac) { var an = ac.querySelector('.ad-ant'); ac.insertBefore(d, an ? an.nextSibling : ac.firstChild); } else bol.insertAdjacentElement('afterend', d);
    d.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-c]'); if (!b) return;
      confAtual = confAtual === b.dataset.c ? null : b.dataset.c;   /* clicar de novo desmarca */
      d.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-checked', String(x.dataset.c === confAtual)); });
    });
  }
  var _conf = confirma;
  confirma = function (q, letra) {
    var seg = Math.round((tAcum + (tPausado ? 0 : Date.now() - t0)) / 1000);   /* conserta: a pausa nao conta e o antes da pausa nao se perde */
    var nd = document.querySelectorAll('#dica-box .dica-nivel:not(.fim)').length, cf = confAtual;
    var r = _conf.apply(this, arguments);
    var x = S.q[q.id], u = x && x.tent[x.tent.length - 1];
    if (u) { u.seg = seg; u.conf = cf; u.dica = nd; salva(); }
    confAtual = null;
    var cx = g('ad-conf'); if (cx) cx.remove();
    setTimeout(function () { pintaVolta(q); }, 50);
    return r;
  };
  function pintaVolta(q) {
    var res = document.querySelector('#ad-painel .ad-aba[data-aba="res"]'); if (!res) { setTimeout(function () { pintaVolta(q); }, 200); return; }
    var v = g('ad-volta'); if (v) v.remove();
    var f = filaDe(q.id), t = tentativas(q.id), u = t[t.length - 1];
    v = document.createElement('div'); v.id = 'ad-volta'; v.className = 'ad-volta';
    /* o texto so afirma o que a pessoa disse: "com certeza" so quando ela marcou Certeza */
    v.innerHTML = ICO.ui.relogio + '<span>' + (f ? ((f.certeza ? '<b>Erro com certeza:</b> ' : '') + (f.certeza ? 'volta' : 'Volta') + ' para a sua revisão <b>' + emDias(f.vence) + '</b>' + (u && u.ok && (u.conf === 'chute' || u.dica) ? ' (acertou ' + (u.conf === 'chute' ? 'no chute' : 'com dica') + ')' : '') + '.')
      : (jaEntrou(q.id) ? 'Revisão completa: <b>saiu da fila</b>.' : (u && u.conf === 'certeza' ? 'Acertou com certeza: <b>não entra na revisão</b>.' : 'Acertou: <b>não entra na revisão</b>.'))) + '</span>';
    /* o veredito vem primeiro; a data de revisao logo abaixo dele */
    var vd = res.querySelector('.veredito'); if (vd && vd.parentNode) vd.parentNode.insertBefore(v, vd.nextSibling); else res.insertBefore(v, res.firstChild);
  }
  if (g('q-corpo') && window.MutationObserver) new MutationObserver(function () { if (!g('v-questao').hidden) { poeCerteza(); lupaPrint(); } }).observe(g('q-corpo'), { childList: true, subtree: true });

  /* ---------- riscar alternativas: Shift + letra ou clique direito ---------- */
  function risca(b) { if (!b || b.classList.contains('certo') || b.classList.contains('errado')) return; b.classList.toggle('riscada'); }
  document.addEventListener('click', function (ev) { var b = ev.target.closest && ev.target.closest('#bolhas .bolha'); if (b) b.classList.remove('riscada'); });
  document.addEventListener('contextmenu', function (ev) { var b = ev.target.closest && ev.target.closest('#bolhas .bolha'); if (b && !g('b-prox')) { ev.preventDefault(); risca(b); } });
  window.addEventListener('keydown', function (ev) {
    if (!ev.shiftKey || ev.ctrlKey || ev.metaKey || ev.altKey || g('v-questao').hidden) return;
    var amp = g('ad-amplia'); if (amp && !amp.hidden) return;
    var i = 'abcde'.indexOf((ev.key || '').toLowerCase()); if (i < 0) return;
    ev.preventDefault(); ev.stopImmediatePropagation(); risca(document.querySelectorAll('#bolhas .bolha')[i]);
  }, true);

  /* ---------- tela "Revisao": vencidas, proximos 7 dias, marcadas ---------- */
  var vRev = document.createElement('section'); vRev.id = 'v-revisao'; vRev.hidden = true;
  wrap.appendChild(vRev);
  /* telas novas (29/10, 2a rodada): pagina do modulo e teoria em cartoes */
  var vMod = document.createElement('section'); vMod.id = 'v-modulo'; vMod.hidden = true; wrap.appendChild(vMod);
  var vTeo = document.createElement('section'); vTeo.id = 'v-teoria'; vTeo.hidden = true; wrap.appendChild(vTeo);
  var EXTRAS = [vRev, vMod, vTeo];
  function abreExtra(sec, vista) {
    if (typeof tTimer !== 'undefined') clearInterval(tTimer);
    _vai('inicio');
    ['inicio', 'estudar', 'escada', 'questao', 'simulado', 'progresso'].forEach(function (x) { var s = g('v-' + x); if (s) s.hidden = true; });
    EXTRAS.forEach(function (x) { x.hidden = x !== sec; });
    poeVista(vista); raiz.classList.remove('ad-resp'); scrollTo(0, 0);
    if (noShell) try { window.parent.postMessage({ ad: 'vista', v: vista }, '*'); } catch (x) { }
  }
  function linhaQ(q, extra) {
    return '<button type="button" class="ad-lq" data-id="' + q.id + '">' + ICO.tema(q.sub) + '<span class="t"><b>' + e(cap(nomeSub(q.sub))) + '</b><small>' + e(selo(q)) + '</small></span><span class="x">' + extra + '</span>' + ICO.ui.seta + '</button>';
  }
  /* Revisao com duas abas: Questoes (fila de erros) e Flashcards (so quando a materia tem cartoes) */
  function abreRevisao(aba) {
    abreExtra(vRev, 'revisao'); modAtual = null; pintaFaixa();
    if (aba === 'flash' && typeof FL !== 'undefined' && FL.n) return FL.home();
    pintaRevQ();
  }
  function abasRev(qual) {
    if (typeof FL === 'undefined' || !FL.n) return '';
    var r = FL.resumo();
    return '<div class="ad-rev-abas" role="tablist" aria-label="Tipo de revisão">' +
      '<button type="button" role="tab" data-rab="q" aria-selected="' + (qual === 'q') + '">' + ICO.ui.revisao + '<span>Questões</span></button>' +
      '<button type="button" role="tab" data-rab="flash" aria-selected="' + (qual === 'flash') + '">' + ICO.ui.cartoes + '<span>Flashcards</span>' + (r.ven ? '<small class="num">' + r.ven + '</small>' : '') + '</button></div>';
  }
  vRev.addEventListener('click', function (ev) {
    var b = ev.target.closest('button[data-rab]'); if (!b || b.getAttribute('aria-selected') === 'true') return;
    if (b.dataset.rab === 'flash') FL.home(); else { pintaRevQ(); if (noShell) try { window.parent.postMessage({ ad: 'vista', v: 'revisao' }, '*'); } catch (z) { } }
    var nb = vRev.querySelector('button[data-rab="' + b.dataset.rab + '"]'); if (nb) nb.focus();
  });
  function pintaRevQ() {
    var ven = vencidas(), semana = BANCO.filter(function (q) { var f = filaDe(q.id); return f && f.vence > Date.now() && f.vence <= emNDias(Date.now(), 8); })
      .sort(function (a, b) { return filaDe(a.id).vence - filaDe(b.id).vence; });
    var marc = Object.keys(S.q).filter(function (id) { return S.q[id].rev && POR[id]; }).map(function (id) { return POR[id]; });
    vRev.innerHTML = abasRev('q') + '<div class="capa ad-rev-capa"><h1>Revisão</h1><p>Cada erro volta em 1, 3, 7, 16 e 35 dias até ficar firme. Acerto no chute ou com dica também volta.</p>' +
      (ven.length ? '<button class="btn" id="ad-rev-ja">Revisar agora · ' + ven.length + (ven.length === 1 ? ' questão' : ' questões') + '</button>' : '<p class="ad-ok-rev">' + ICO.ui.check + 'Nada vencido hoje.</p>') + '</div>' +
      /* auditoria 31/10: com tudo vazio, um aviso so (antes: capa + 3 cartoes vazios); 'Para revisar hoje' so aparece quando ha vencidas */
      (!ven.length && !semana.length && !marc.length ? '<p class="ad-rev-vazio">Quando você errar ou marcar uma questão, ela entra aqui e volta no dia certo.</p><div>' :
      (ven.length ? bloco('Para revisar hoje <small>' + ven.length + '</small>', '<div class="ad-lista">' + ven.slice(0, 40).map(function (q) { return linhaQ(q, filaDe(q.id).certeza ? '<em class="cert">erro com certeza</em>' : ''); }).join('') + '</div>') : '') +
      '<div class="ad-blocos2">' +
      bloco('Próximos 7 dias <small>' + semana.length + '</small>', '<div class="ad-lista">' + (semana.length ? semana.slice(0, 40).map(function (q) { return linhaQ(q, emDias(filaDe(q.id).vence)); }).join('') : '<div class="vazio">Nada programado para a semana.</div>') + '</div>') +
      bloco('Marcadas por você <small>' + marc.length + '</small>', '<div class="ad-lista">' + (marc.length ? marc.map(function (q) { return linhaQ(q, ''); }).join('') : '<div class="vazio">Use o marcador no canto de cima de cada questão.</div>') + '</div>')) + '</div>';
    var bj = g('ad-rev-ja'); if (bj) bj.onclick = function () { var l = ven.map(function (q) { return q.id; }); ctx = { lista: l, i: 0, revisao: true, t0: Date.now() }; abrirQuestao(l[0], ctx); };
    vRev.querySelectorAll('.ad-lq').forEach(function (b) { b.onclick = function () { ctx = null; abrirQuestao(b.dataset.id, null); }; });
  }
  var _vai2 = vai;
  vai = function (v) { EXTRAS.forEach(function (x) { x.hidden = true; }); return _vai2.apply(this, arguments); };

  /* ---------- tela de resultado (treino e simulado): quadradinhos numerados, sem legenda de cores ---------- */
  function resultado(c, titulo) {
    var ids = c.lista, quad = '', ok = 0, novos = 0, corrig = 0, voltam = {}, seg = 0, nseg = 0, errs = [], ajuda = 0;
    ids.forEach(function (id, i) {
      var t = tentativas(id).filter(function (x) { return x.ts >= c.t0; }), u = t[t.length - 1], nm = e(cap(nomeSub(POR[id].sub)));
      if (!u) { quad += '<button class="q vz" style="--i:' + i + '" data-id="' + id + '" title="Questão ' + (i + 1) + ' · não respondida · ' + nm + '">' + (i + 1) + '</button>'; return; }
      var ant = tentativas(id).filter(function (x) { return x.ts < c.t0; });
      if (u.ok) { ok++; if (!ant.length && POR[id].degrau) novos++; if (ant.some(function (x) { return !x.ok; })) corrig++; } else errs.push(id);
      var f = filaDe(id); if (f) { var k = emDias(f.vence); voltam[k] = (voltam[k] || 0) + 1; }
      seg += u.seg || 0; nseg++;
      var aj = u.conf === 'chute' || u.dica; if (aj) ajuda++;
      quad += '<button class="q ' + (u.ok ? 'ok' : 'er') + (aj ? ' ajuda' : '') + '" style="--i:' + i + '" data-id="' + id + '" title="Questão ' + (i + 1) + ' · ' + (u.ok ? 'acertou' : 'errou') + (aj ? (u.conf === 'chute' ? ' no chute' : ' com dica') : '') + ' · ' + nm + '" aria-label="Questão ' + (i + 1) + ', ' + (u.ok ? 'acertou' : 'errou') + '">' + (i + 1) + '</button>';
    });
    var nv = Object.keys(voltam).reduce(function (a, k) { return a + voltam[k]; }, 0), med = nseg ? Math.round(seg / nseg) : 0;
    corpo.classList.remove('ad-q'); raiz.classList.remove('ad-resp'); clearInterval(tTimer); poeVista('resultado');
    var cr = g('q-crono'), pz = g('q-pausa'); if (cr) cr.textContent = ''; if (pz) pz.hidden = true;
    corpo.innerHTML = '<div class="ad-res"><p class="ad-res-tit">' + titulo + '</p><div class="ad-placar"><b>' + ok + '</b><span>de ' + ids.length + '</span></div>' +
      '<div class="ad-quad">' + quad + '</div>' + (ajuda ? '<p class="ad-leg"><i></i>contorno âmbar: acertou no chute ou com dica</p>' : '') +
      '<ul class="ad-fatos"><li>' + ICO.ui.check + '<span><b>' + corrig + '</b> ' + (corrig === 1 ? 'erro antigo corrigido' : 'erros antigos corrigidos') + '</span></li>' +
      '<li>' + ICO.ui.escada + '<span><b>' + novos + '</b> ' + (novos === 1 ? 'degrau novo vencido' : 'degraus novos vencidos') + '</span></li>' +
      '<li>' + ICO.ui.relogio + '<span><b>' + nv + '</b> ' + (nv === 1 ? 'questão volta' : 'questões voltam') + ' para revisão' + (nv ? ' (' + Object.keys(voltam).map(function (k) { return k + ': ' + voltam[k]; }).join(' · ') + ')' : '') + '</span></li>' +
      '<li>' + ICO.ui.cronometro + '<span>tempo médio: <b>' + (med < 60 ? med + ' s' : Math.floor(med / 60) + ' min ' + (med % 60) + ' s') + '</b> por questão</span></li></ul>' +
      '<div class="ad-res-acoes">' + (errs.length ? '<button class="btn" id="ad-rever">Rever os ' + errs.length + (errs.length === 1 ? ' erro' : ' erros') + ' agora</button>' : '') +
      (c.sessao ? '<button class="btn sec" id="ad-res-mais">Mais questões de ' + e(c.sessao.nome) + '</button>' : '') +
      '<button class="btn sec" id="ad-res-ini">' + (c.sessao ? 'Voltar a ' + e(c.sessao.nome) : 'Voltar ao início') + '</button></div></div>';
    corpo.querySelectorAll('.ad-quad .q').forEach(function (b) { b.onclick = function () { ctx = { lista: ids, i: ids.indexOf(b.dataset.id), t0: Date.now() }; abrirQuestao(b.dataset.id, ctx); }; });
    var rv = g('ad-rever'); if (rv) rv.onclick = function () { ctx = { lista: errs, i: 0, revisao: true, t0: Date.now() }; abrirQuestao(errs[0], ctx); };
    g('ad-res-ini').onclick = function () { if (c.sessao) voltaSessao(c.sessao); else vai('inicio'); };
    var rm = g('ad-res-mais'); if (rm) rm.onclick = function () { comecaSessao(c.sessao); };
    var bt = document.querySelector('.ad-barq .n'); if (bt) bt.textContent = NOME;
    scrollTo(0, 0);
  }
  var _ft = fimTreino;
  fimTreino = function () { var c = ctx; var r = _ft.apply(this, arguments); if (c) resultado(c, c.sessao ? e(c.sessao.nome) : 'Treino de hoje'); return r; };
  var _fs = fimSimulado;
  fimSimulado = function () {
    var c = ctx; var r = _fs.apply(this, arguments);
    /* o tempo do simulado e a soma do tempo de responder cada questao (ler a resolucao nao conta) */
    try { if (c && S.sims && S.sims.length) { var sg = 0; c.lista.forEach(function (id) { var t = tentativas(id).filter(function (x) { return x.ts >= c.t0; }), u = t[t.length - 1]; if (u) sg += u.seg || 0; }); S.sims[S.sims.length - 1].seg = sg; salva(); } } catch (x) { }
    if (c) resultado(c, c.sim ? e(c.sim.nome) : 'Simulado'); return r;
  };
  /* revisao que termina tambem ganha resultado */
  var _px = proxima;
  proxima = function () {
    if (ctx && ctx.revisao && ctx.lista && ctx.i >= ctx.lista.length - 1) { var c = ctx; ctx = null; clearInterval(tTimer); resultado(c, 'Revisão'); return; }
    return _px.apply(this, arguments);
  };

  /* ---------- imagens do tema (banco revisado: <materia>/img/<tema>.json, carregado sob demanda) ---------- */
  var IMGP = {};
  function imagens(mod) {
    if (!IMGP[mod]) IMGP[mod] = fetch('img/' + mod + '.json').then(function (r) { if (!r.ok) throw 0; return r.json(); }).catch(function () { return []; });
    return IMGP[mod];
  }
  function galeria(alvo, mod, sub, max) {
    imagens(mod).then(function (lista) {
      var l = (lista || []).slice();
      if (sub) l.sort(function (a, b) { return (b.sub.indexOf(sub) >= 0) - (a.sub.indexOf(sub) >= 0); });
      if (!l.length || !alvo.isConnected) return;
      var lim = max ? l.slice(0, max) : l;
      alvo.innerHTML = '<h5 class="ad-gal-t">Imagens do tema <small>' + l.length + '</small></h5><div class="ad-gal">' + lim.map(function (x, i) {
        return '<button type="button" class="ad-gi' + (x.e === 'caderno' ? ' cad' : '') + '" data-i="' + i + '" title="' + e(x.t) + '"><img loading="lazy" alt="' + e(x.t) + '" src="' + x.u + '"><span>' + e(x.t) + '</span></button>';
      }).join('') + '</div>';
      alvo.querySelectorAll('.ad-gi').forEach(function (b) { b.onclick = function () { ampliaImg(lim, +b.dataset.i); }; });
    });
  }
  function ampliaImg(lista, i) {
    var cx = g('ad-amplia'), volta = document.activeElement;
    if (!cx) { cx = document.createElement('div'); cx.id = 'ad-amplia'; cx.setAttribute('role', 'dialog'); cx.setAttribute('aria-modal', 'true'); document.body.appendChild(cx); }
    function mostra() {
      var x = lista[i];
      cx.setAttribute('aria-label', x.t || 'Imagem do tema');
      cx.innerHTML = '<div class="ad-amp-caixa' + (lista.length < 2 ? ' um' : '') + '"><div class="ad-amp-topo"><b>' + e(x.t) + '</b><span>' + (i + 1) + ' / ' + lista.length + '</span><button type="button" class="f" aria-label="Fechar">' + lu('x') + '</button></div>' +
        '<div class="ad-amp-img' + (x.e === 'caderno' ? ' cad' : '') + (x.fit ? ' fit' : '') + '"><img alt="' + e(x.t) + '" src="' + x.u + '"' + (!x.fit && precisa(x) > Math.min(900, innerWidth - 84) ? ' style="width:' + precisa(x) + 'px;max-width:none"' : '') + '></div>' +
        '<div class="ad-amp-pe"><button type="button" class="a" aria-label="Anterior">' + lu('esq') + '</button><small>' + e(x.f || '') + (x.l ? ' · ' + e(x.l) : '') + '</small><button type="button" class="p" aria-label="Próxima">' + lu('dir') + '</button></div></div>';
      cx.querySelector('.f').onclick = fecha; cx.querySelector('.a').onclick = function () { i = (i - 1 + lista.length) % lista.length; mostra(); };
      cx.querySelector('.p').onclick = function () { i = (i + 1) % lista.length; mostra(); };
      cx.querySelector('.f').focus();
    }
    function fecha() { cx.hidden = true; document.removeEventListener('keydown', tecla, true); if (volta && volta.focus) try { volta.focus(); } catch (x) { } }
    function tecla(ev) { if (ev.key === 'Escape') { ev.stopImmediatePropagation(); fecha(); } if (ev.key === 'ArrowRight') { i = (i + 1) % lista.length; mostra(); } if (ev.key === 'ArrowLeft') { i = (i - 1 + lista.length) % lista.length; mostra(); } }
    cx.onclick = function (ev) { if (ev.target === cx) fecha(); };
    cx.hidden = false; mostra(); document.addEventListener('keydown', tecla, true);
  }
  window.adGaleria = galeria;

  /* ---------- simulados: botoes de verdade, agrupados, com icone, meta e chevron ---------- */
  var _ps = pintaSimulados;
  pintaSimulados = function () {
    var r = _ps.apply(this, arguments), alvo = g('lista-sim'); if (!alvo) return r;
    /* auditoria 31/10: o simulado das bancas da prova-alvo (São Camilo e Santa Casa) abre o grupo Por universidade */
    var uni = SIMS.filter(function (s) { return s.id === 'ssc'; }).concat(SIMS.filter(function (s) { return /^uni_/.test(s.id); })), obj = SIMS.filter(function (s) { return !/^uni_/.test(s.id) && s.id !== 'ssc'; });
    function linha(s) {
      var n = Math.min(s.n, s.f().length);
      /* 30/10: cada simulado com o seu desenho; por universidade, o selo com o nome da banca que aplica a prova */
      var uni = /^uni_/.test(s.id), banca = s.id === 'uni_Fuvest' ? 'Fuvest' : 'Vunesp', lg = uni && LOGOS[s.id.slice(4)];
      /* 01/11 (decisao do dono): simulado por universidade com o logo oficial (Wikimedia Commons); sem logo, o nome tipografado */
      var ic = lg ? '<img class="ad-sim-logo" src="' + lg + '" alt="' + e(s.id.slice(4)) + '">' : uni ? '<span class="ad-sim-tag">' + e(s.id.slice(4)).replace(' ', '<br>') + '</span>' : (ICO.sim(s.id) || ICO.ui.simulados);   /* 30/10 (critica): sem medalha/selo, so o nome tipografado */
      return '<button type="button" class="ad-sim' + (uni ? ' uni' : '') + '" data-sim="' + e(s.id) + '"' + (n ? '' : ' aria-disabled="true"') + '><span class="ic' + (/^<img/.test(ic) ? ' real' : '') + '">' + ic + '</span>' +
        '<span><b>' + e(s.nome) + '</b>' + (uni ? '<small class="bc">Prova aplicada pela ' + banca + '</small>' : '') + '<small>' + e(uni ? s.f().length + (s.f().length === 1 ? ' questão disponível' : ' questões disponíveis') : s.desc) + '</small></span><span class="m">' + (n ? n + (n === 1 ? ' questão' : ' questões') + ' · ~' + Math.max(2, n * 2) + ' min' : 'sem questões') + '</span>' + ICO.ui.seta + '</button>';
    }
    alvo.innerHTML = (uni.length ? '<h3 class="ad-simg">Por universidade</h3>' + uni.map(linha).join('') : '') + '<h3 class="ad-simg">Por objetivo</h3>' + obj.map(linha).join('');
    alvo.querySelectorAll('.ad-sim').forEach(function (b) {
      b.onclick = function () { var s = SIMS.filter(function (x) { return x.id === b.dataset.sim; })[0]; if (!s) return; if (s.f().length) iniciaSimulado(s); else alert2('Ainda não há questões para este simulado.'); };
    });
    var h2 = alvo.previousElementSibling; if (h2 && h2.tagName === 'H2') h2.textContent = 'Simulados com questões reais';
    emBloco(alvo); emBloco(g('hist-sim'));
    return r;
  };

  /* ---------- desempenho: com poucas respostas mostra o n, nao um veredito ---------- */
  function ha(ms) { var m = Math.round((Date.now() - ms) / 60000); return m < 1 ? 'agora' : m < 60 ? 'há ' + m + ' min' : m < 1440 ? 'há ' + Math.round(m / 60) + ' h' : 'há ' + Math.round(m / 1440) + (Math.round(m / 1440) === 1 ? ' dia' : ' dias'); }
  var _pp = pintaProgresso;
  pintaProgresso = function () {
    var r = _pp.apply(this, arguments), dd = g('desempenho');
    if (dd) {
      /* auditoria 31/10: sem nenhuma resposta, UM aviso com acao no topo (antes 'sem respostas' repetia 12 vezes) */
      var totResp = MODLIST.reduce(function (a, m) { return a + MODS[m].filter(function (q) { return respondida(q.id); }).length; }, 0);
      var vazio = totResp ? '' : '<div class="ad-vazio-desemp"><b>Ainda sem respostas em ' + e(NOME) + '.</b><span>O acerto de cada tema aparece aqui conforme você responde.</span><button type="button" class="btn" id="ad-dm-tg">' + ICO.ui.alvo + 'Começar treino geral</button></div>';
      dd.innerHTML = vazio + '<div class="ad-desemp">' + MODLIST.map(function (m, i) {
        var l = MODS[m], rsp = l.filter(function (q) { return respondida(q.id); }).length, tt = l.flatMap(function (q) { return tentativas(q.id); }), n = tt.length;
        var tx = n ? Math.round(100 * tt.filter(function (x) { return x.ok; }).length / n) : null, pouco = n < 5;
        var dir = !n ? '<strong class="pouco" aria-label="sem respostas">—</strong>' : (pouco ? '<strong class="pouco">' + n + (n === 1 ? ' resposta' : ' respostas') + '</strong>' : '<strong class="' + (tx < 50 ? 'baixo' : '') + '">' + tx + '%</strong>');
        return '<button type="button" class="ad-dm" style="--i:' + i + '" data-mod="' + m + '"><span class="top">' + ICO.tema(m) + '<b>' + e(TEORIA[m].nome) + '</b></span>' +
          '<span class="num"><span>' + rsp + ' de ' + l.length + ' feitas</span>' + dir + '</span>' +
          '<span class="br' + (pouco ? ' trac' : '') + '"><i style="width:' + Math.round(domMod(m) * 100) + '%"></i></span></button>';
      }).join('') + '</div>';
      dd.querySelectorAll('.ad-dm').forEach(function (b) { b.onclick = function () { abreModulo(b.dataset.mod); }; });
      var btg = g('ad-dm-tg'); if (btg) btg.onclick = function () { if (typeof FL !== 'undefined' && FL.tg && FL.tg.tem()) { vai('inicio'); FL.tg.comeca(); } else vai('estudar'); };
      /* Marcadas para revisao fica so na Revisao (aqui era repeticao) */
      var rv = g('revisar'); if (rv && rv.previousElementSibling && rv.previousElementSibling.tagName === 'H2') { rv.hidden = true; rv.previousElementSibling.hidden = true; }
      var h2 = dd.previousElementSibling; if (h2 && h2.tagName === 'H2') h2.textContent = 'Acerto por tema';
      emBloco(dd, 'ad-bl-desemp');
    }
    /* padroes de erro: n de erros e quando foi o ultimo, nao um "0%" solto */
    var pad = g('padroes');
    if (pad) {
      var ach = MODLIST.filter(function (m) { return (TEORIA[m] || {}).erro; }).map(function (m) {
        var tt = MODS[m].flatMap(function (q) { return tentativas(q.id); }), er = tt.filter(function (x) { return !x.ok; });
        return { m: m, n: tt.length, er: er.length, ult: er.length ? Math.max.apply(null, er.map(function (x) { return x.ts; })) : 0, tx: tt.length ? (tt.length - er.length) / tt.length : 1 };
      }).filter(function (x) { return x.er && x.tx < .65; }).sort(function (a, b) { return a.tx - b.tx; }).slice(0, 5);
      pad.innerHTML = ach.map(function (x) {
        return '<div class="ad-pad"><b>' + e(TEORIA[x.m].nome) + '</b><span>' + x.er + (x.er === 1 ? ' erro' : ' erros') + ' · último ' + ha(x.ult) + '</span><p>' + TEORIA[x.m].erro + '</p></div>';
      }).join('');
      pad.hidden = !ach.length; if (pad.previousElementSibling) pad.previousElementSibling.hidden = !ach.length;
      var bp = emBloco(pad); if (bp && bp.classList.contains('ad-bloco')) bp.hidden = !ach.length;
    }
    var ex = g('b-export'), box = ex && ex.closest('.painel');
    if (box && !box.closest('details.ad-dados')) {
      var dt = document.createElement('details'); dt.className = 'ad-dados'; dt.innerHTML = '<summary>Meus dados (baixar, importar, apagar)</summary><div></div>';
      box.parentNode.insertBefore(dt, box); dt.lastChild.appendChild(box);
    }
    return r;
  };

  /* ---------- questao: barra compacta, alternativas em linha, painel ---------- */
  var corpo = g('q-corpo'), abaAtual = 'res';
  function qAtual() { return window.__qAtual || null; }
  /* barra compacta: voltar · materia · "Questao 3 de 12 · Treino de hoje" · ? · cronometro · pausa */
  var nav2 = document.querySelector('#v-questao .nav2'), barq = null;
  if (nav2) {
    var qv = g('q-volta'); if (qv) { qv.innerHTML = ICO.ui.voltar + '<span>Voltar</span>'; }
    barq = document.createElement('div'); barq.className = 'ad-barq';
    barq.innerHTML = '<span class="g">' + ICO.glifo[MAT] + '</span><span class="n">' + NOME + '</span><span class="t" id="ad-qtit"></span><span class="p"><i id="ad-qbar"></i></span>';
    if (qv) qv.insertAdjacentElement('afterend', barq); else nav2.insertBefore(barq, nav2.firstChild);
    var aj = document.createElement('span'); aj.className = 'ad-ajuda'; aj.innerHTML = lu('teclado'); aj.setAttribute('role', 'img'); aj.tabIndex = 0;
    aj.title = 'Teclado: A–E escolhe · Enter confirma e avança · H dica · P pausa · Shift + letra risca uma alternativa';
    aj.setAttribute('aria-label', aj.title);
    var cr0 = g('q-crono'); nav2.insertBefore(aj, cr0 || null);
    var tl = document.createElement('button'); tl.type = 'button'; tl.className = 'ad-tela'; tl.id = 'ad-tela';
    tl.onclick = pedeTela; nav2.appendChild(tl); pintaTela();
    /* pausa com icone desenhado (o app escreve um glifo; trocamos a cada mudanca) */
    var pz0 = g('q-pausa');
    if (pz0 && window.MutationObserver) {
      var fazPausa = function () { var pa = pz0.classList.contains('pausado'); if (pz0.dataset.ic === String(pa)) return; pz0.dataset.ic = String(pa); pz0.innerHTML = lu(pa ? 'play' : 'pause'); pz0.title = pa ? 'Retomar (P)' : 'Pausar (P)'; };
      new MutationObserver(function () { if (!pz0.querySelector('svg')) pz0.dataset.ic = ''; fazPausa(); }).observe(pz0, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['class'] });
      fazPausa();
    }
  }
  /* ---------- tela cheia / modo foco: a questao vira o centro, o resto some ---------- */
  function pedeTela() {
    if (noShell) { try { window.parent.postMessage({ ad: 'tela' }, '*'); } catch (x) { } return; }
    poeFoco(!raiz.classList.contains('ad-foco'));
    try { if (raiz.classList.contains('ad-foco')) { if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () { }); } else if (document.fullscreenElement) document.exitFullscreen(); } catch (x) { }
  }
  function pintaTela() {
    var on = raiz.classList.contains('ad-foco');
    document.querySelectorAll('.ad-tela').forEach(function (b) { b.innerHTML = lu(on ? 'sai' : 'cheia') + '<span>' + (on ? 'Sair da tela cheia' : 'Tela cheia') + '</span>'; b.setAttribute('aria-pressed', String(on)); b.title = on ? 'Sair da tela cheia (Esc)' : 'Tela cheia: só a questão'; });
  }
  function poeFoco(v) { raiz.classList.toggle('ad-foco', !!v); pintaTela(); }
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape' || !raiz.classList.contains('ad-foco')) return;
    if (document.querySelector('[role="dialog"]:not([hidden]), #lupa:not([hidden])')) return;
    pedeTela();
  });
  /* o print ganha o icone de ampliar desenhado no lugar do glifo */
  /* proporcao do print (com o corte do rodape) para o modo foco dimensionar pela altura util */
  /* margens brancas laterais do print (medidas uma vez por imagem): tirá-las amplia o texto da fonte
     sem perder nada. Escuro = luminancia < 200 em pelo menos 2 linhas; folga de 1,2% de cada lado. */
  var APARA = {};
  function margensPrint(im) {
    var k = im.currentSrc || im.src; if (!k) return null;
    if (APARA[k]) return APARA[k];
    try {
      var W = 300, H = Math.max(1, Math.round(W * im.naturalHeight / im.naturalWidth)), cv = document.createElement('canvas');
      cv.width = W; cv.height = H; var cx = cv.getContext('2d'); cx.drawImage(im, 0, 0, W, H);
      var d = cx.getImageData(0, 0, W, H).data, col = new Array(W).fill(0);
      /* 01/11: limiar 236 (antes 200): os contornos cinza-claros das caixas de alternativa (~220) contavam como margem e eram cortados */
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) { var o = (y * W + x) * 4; if (d[o] * .299 + d[o + 1] * .587 + d[o + 2] * .114 < 236) col[x]++; }
      var a = 0, b = W - 1; while (a < W && col[a] < 2) a++; while (b > a && col[b] < 2) b--;
      var L = Math.max(0, a / W - .02), R = Math.max(0, (W - 1 - b) / W - .02);
      if (L < .015) L = 0; if (R < .015) R = 0;
      L = Math.min(L, .09); R = Math.min(R, .09);
      return (APARA[k] = { L: L, R: R, P: passoLinha(im) });
    } catch (x) { return (APARA[k] = { L: 0, R: 0 }); }
  }
  /* auditoria 31/10: altura de linha do TEXTO do print (px naturais). Os prints vem de fontes com escalas muito
     diferentes (scan do Objetivo ~28 px por linha, cadernos de Quimica ~10 px); com ela o print e' mostrado numa
     escala em que a letra fica perto de 16-17 px em qualquer fonte. Mediana da distancia entre inicios de linhas. */
  function passoLinha(im) {
    try {
      var nW = im.naturalWidth, W = Math.min(nW, 900), H = Math.max(1, Math.round(W * im.naturalHeight / nW));
      if (H > 4000) return 0;
      var cv = document.createElement('canvas'); cv.width = W; cv.height = H; var cx = cv.getContext('2d'); cx.drawImage(im, 0, 0, W, H);
      var d = cx.getImageData(0, 0, W, H).data, lim = Math.max(3, W * .012), ini = [], dentro = false, alt = [], a0 = 0;
      for (var y = 0; y < H; y++) {
        var c = 0; for (var x = 0; x < W; x += 2) { var o = (y * W + x) * 4; if (d[o] * .299 + d[o + 1] * .587 + d[o + 2] * .114 < 150) c += 2; }
        if (c >= lim && !dentro) { dentro = true; a0 = y; ini.push(y); } else if (c < lim && dentro) { dentro = false; alt.push(y - a0); }
      }
      if (ini.length < 4) return 0;
      var dif = []; for (var i = 1; i < ini.length; i++) dif.push(ini[i] - ini[i - 1]);
      alt.sort(function (p, q) { return p - q; }); var hMed = alt[alt.length >> 1] || 1;
      dif = dif.filter(function (v) { return v > hMed * 1.05 && v < hMed * 2.6; }).sort(function (p, q) { return p - q; });
      if (dif.length < 3) return 0;
      return dif[dif.length >> 1] * nW / W;
    } catch (z) { return 0; }
  }
  var MO_PRINT = [];
  function medePrint() {
    MO_PRINT = MO_PRINT.filter(function (x) { if (x[1].isConnected) return true; x[0].disconnect(); x[1].removeEventListener('load', medePrint); return false; });
    document.querySelectorAll('#q-corpo .print').forEach(function (pr) {
      var im = pr.querySelector('img'); if (!im) return;
      var ar = 0, m = /([\d.]+)\s*\/\s*([\d.]+)/.exec(im.style.aspectRatio || '');
      if (m && +m[2]) ar = m[1] / m[2]; else if (im.naturalWidth && im.naturalHeight) ar = im.naturalWidth / im.naturalHeight;
      var mg = !im.hidden && im.complete && im.naturalWidth ? margensPrint(im) : null;
      if (mg && (mg.L || mg.R)) {
        var u = 1 - mg.L - mg.R;
        pr.style.setProperty('--zx', (1 / u).toFixed(4)); pr.style.setProperty('--lx', (mg.L / u).toFixed(4)); pr.classList.add('ad-apara');
        ar *= u;   /* a caixa do print fica mais alta na mesma largura */
      }
      if (ar) { pr.__ar = ar; pr.__nw = im.naturalWidth * (mg ? 1 - mg.L - mg.R : 1); pr.__esc = mg && mg.P ? Math.max(.55, Math.min(1.9, 25 / mg.P)) : 1; }
      if (!im.__ar) {
        im.__ar = 1; im.addEventListener('load', medePrint);
        /* auditoria 31/10: o observador se desliga quando a questao sai da tela (antes ficava preso ao no antigo: ~550 nos retidos por questao) */
        if (window.MutationObserver) { var mo = new MutationObserver(function () { if (!im.isConnected) { mo.disconnect(); im.removeEventListener('load', medePrint); return; } medePrint(); }); mo.observe(im, { attributes: true, attributeFilter: ['style', 'src', 'hidden'] }); MO_PRINT.push([mo, im]); }
      }
    });
    ajustaPrint();
  }
  /* largura do print (P1/P2 da revisao final):
     - por padrao, toda a largura util da coluna;
     - se o print inteiro + letras + Confirmar cabem na altura da tela com o texto ainda legivel
       sem ficar menor que 90% do tamanho natural do print (letra da fonte ~14-15 px), ele estreita para caber sem rolar;
     - nunca passa de 1,3x o tamanho natural (na tela cheia a 1920 ficaria enorme e obrigaria a rolar);
     - senao fica na largura toda e a linha A-E + Confirmar gruda no pe da tela (sticky). */
  function ajustaPrint() {
    var e2 = document.querySelector('#q-corpo > .entra2'), pr = e2 && e2.querySelector(':scope > .print');
    if (!e2) return;
    var ac = [].filter.call(e2.querySelectorAll(':scope > .acoes'), function (x) { return !x.hidden && x.offsetParent !== null; }).pop();
    e2.style.setProperty('--ad-acH', (ac ? ac.offsetHeight : 0) + 'px');
    if (!pr || !pr.__ar || innerWidth <= 700) { e2.style.removeProperty('--ad-pw'); return; }
    var cs = getComputedStyle(e2), col = e2.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var bo = g('bolhas'), pe = pr.querySelector('.print-pe');
    /* 30/10 (painel de tecnologia): a altura da linha A-E + Confirmar depende da largura do print e vice-versa; usar a MAIOR
       altura ja vista nesta questao quebra o ciclo (antes oscilava ~14 vezes por segundo) */
    if (e2.__q !== pr) { e2.__q = pr; e2.__acMax = 0; e2.__boMax = 0; }
    e2.__acMax = Math.max(e2.__acMax || 0, ac ? ac.offsetHeight : 0); e2.__boMax = Math.max(e2.__boMax || 0, bo ? bo.offsetHeight : 0);
    var topo = pr.getBoundingClientRect().top + scrollY, baixo = (bo ? e2.__boMax + 14 : 0) + e2.__acMax + (pe ? pe.offsetHeight : 0) + 8;
    var nw = (pr.__nw || 900) * (pr.__esc || 1), cabe = (innerHeight - topo - baixo) * pr.__ar, piso = .9 * nw, alvo = Math.min(col, (pr.__esc && pr.__esc !== 1 ? 1.05 : 1.3) * nw);   /* auditoria 31/10: nw ja na escala de letra ~17 px */
    var pw = Math.round(cabe >= piso ? Math.min(cabe, alvo) : alvo);
    var velho = parseFloat(e2.style.getPropertyValue('--ad-pw')) || 0, novo = Math.max(320, pw);
    if (!velho || Math.abs(novo - velho) > 24) e2.style.setProperty('--ad-pw', novo + 'px');   /* sem tremer por poucos pixels */
    prende();
  }
  function prende() {
    var e2 = document.querySelector('#q-corpo > .entra2'), bo = g('bolhas'); if (!e2 || !bo) return;
    var r = bo.getBoundingClientRect(), acH = parseFloat(e2.style.getPropertyValue('--ad-acH')) || 0;
    e2.classList.toggle('ad-preso', r.bottom >= innerHeight - acH - 1 && r.top > 0);
  }
  addEventListener('resize', function () { ajustaPrint(); });
  addEventListener('scroll', prende, { passive: true });
  if (window.ResizeObserver) {
    var roQ = new ResizeObserver(function () { ajustaPrint(); });
    var vigia = function () { var e2 = document.querySelector('#q-corpo > .entra2'); if (e2 && !e2.__ro) { e2.__ro = 1; roQ.observe(e2); } };
    if (g('q-corpo') && window.MutationObserver) new MutationObserver(vigia).observe(g('q-corpo'), { childList: true });
  }
  function lupaPrint() {
    medePrint();
    document.querySelectorAll('.print-lupa:not([data-ic])').forEach(function (s) { s.dataset.ic = '1'; s.innerHTML = lu('lupa') + 'Ampliar'; });
    document.querySelectorAll('.print-tp:not([data-ic])').forEach(function (s) { s.dataset.ic = '1'; s.innerHTML = lu('tabela') + 'Tabela periódica'; });
    var bt = g('b-texto');
    if (bt && !bt.dataset.ic) {
      bt.dataset.ic = '1';
      var rot = function () { var cx = g('texto-box'), ab = cx && !cx.hidden; bt.innerHTML = lu('texto') + (ab ? 'Esconder o texto' : 'Ler a questão em texto'); bt.setAttribute('aria-expanded', String(!!ab)); };
      bt.addEventListener('click', rot); rot();
    }
  }
  /* em tela cheia fora da questao, um botao flutuante para sair */
  var flut = document.createElement('button'); flut.type = 'button'; flut.className = 'ad-tela ad-flut'; flut.onclick = pedeTela; document.body.appendChild(flut); pintaTela();
  [['lupa-menos', 'menos'], ['lupa-mais', 'mais'], ['lupa-fecha', 'x']].forEach(function (x) { var b = g(x[0]); if (b) b.innerHTML = lu(x[1]); });
  function pintaBarra() {
    var t = g('ad-qtit'), p = g('ad-qbar'); if (!t) return;
    var tot = ctx && ctx.lista ? ctx.lista.length : 0, i = ctx && ctx.lista ? ctx.i + 1 : 0;
    if (ctx && ctx.mx && typeof FL !== 'undefined' && FL.tg && FL.tg.s) { var ms = FL.tg.s; t.innerHTML = '<b>Treino geral</b> <span class="ad-tg-tipo k-q">Questões de prova</span> <b class="num">' + (ms.i + 1) + '</b> de <span class="num">' + ms.it.length + '</span>';   /* auditoria 31/10: mesmo rotulo e chip da barra dos cartoes */ if (p) p.style.width = (100 * (ms.i + 1) / ms.it.length).toFixed(1) + '%'; return; }
    var de = ctx && ctx.sessao ? ctx.sessao.nome : ctx && ctx.sim ? ctx.sim.nome : (ctx && ctx.treino ? 'Treino de hoje' : (ctx && ctx.revisao ? 'Revisão' : (ctx && ctx.origem ? 'Escada' : '')));
    /* 01/11: o print traz o numero da prova de origem ("QUESTAO 4"); a barra nao repete a palavra para nao haver dois numeros de questao */
    var esc = ctx && ctx.origem && !ctx.sessao && !ctx.sim && !ctx.treino && !ctx.revisao;
    if (esc) t.innerHTML = '<b>Escada</b>';   /* o numero do degrau ja esta no selo logo abaixo */
    else t.innerHTML = (de ? '<b>' + e(de) + '</b>' : '<b>Questões de prova</b>') + (tot ? ' · <b class="num">' + i + '</b> de <span class="num">' + tot + '</span>' : '');
    if (p) p.style.width = tot ? (100 * i / tot).toFixed(1) + '%' : '0';
  }
  function escolheAba(id) {
    abaAtual = id;
    var p = g('ad-painel'); if (!p) return;
    p.querySelectorAll('.ad-abas button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.aba === id)); b.tabIndex = b.dataset.aba === id ? 0 : -1; });
    p.querySelectorAll('.ad-aba').forEach(function (a) { a.hidden = a.dataset.aba !== id; });
    var c = p.querySelector('.ad-corpo'); if (c) c.scrollTop = 0;
  }
  function sobrescrito(h) { return String(h || '').replace(/\^\(([^()<>]{1,24})\)/g, '<sup>$1</sup>').replace(/\^([0-9a-zA-Z+−-]{1,6})/g, '<sup>$1</sup>'); }
  window.adSobrescrito = sobrescrito;
  /* aba Teoria da questao: primeiro os cartoes do conteudo da questao; o resto do tema fica a um clique */
  function teoriaHTML(q) {
    var t = TEORIA[q.modulo] || {}, cs = cartoesDe(q.modulo), meus = cs.filter(function (c) { return c.sub === q.sub; }), outros = cs.filter(function (c) { return c.sub !== q.sub; });
    return '<div class="ad-teo">' +
      (meus.length ? '<p class="ad-teo-rot">' + ICO.tema(q.sub) + '<span>Teoria desta questão · <b>' + e(cap(nomeSub(q.sub))) + '</b></span></p>' + meus.map(function (c) { return cartaoHTML(c, true); }).join('')
        : '<p class="ad-teo-rot">' + ICO.tema(q.modulo) + '<span>Teoria de <b>' + e(t.nome || q.modulo) + '</b></span></p>') +
      '<button type="button" class="btn sec ad-teo-tudo" data-teo="' + q.modulo + '" data-sub="' + q.sub + '">' + ICO.ui.livro + 'Ver toda a teoria de ' + e(t.nome || '') + (cs.length ? ' · ' + cs.length + ' cartões' : '') + '</button>' +
      (outros.length ? '<details class="ad-teo-mais"><summary>Outros conteúdos deste tema <small>' + outros.length + '</small></summary>' + outros.map(function (c) { return cartaoHTML(c, true, true); }).join('') + '</details>' : '') +
      resumoVelhoHTML(t) + '<div class="ad-gal-wrap" data-mod="' + q.modulo + '" data-sub="' + q.sub + '"></div></div>';
  }
  function relHTML(q) {
    var irmas = Object.keys(SUBS).filter(function (s) { return s.split('.')[0] === q.modulo && s !== q.sub; }).sort().slice(0, 4);
    if (!irmas.length) return '';
    return '<div class="ad-rel"><h5>Conteúdos relacionados</h5><div class="ad-rg">' + irmas.map(function (s) {
      return '<button type="button" data-sub="' + s + '" title="' + e(cap(nomeSub(s))) + ' — ' + Math.round(domSub(s) * 100) + '% da escada vencida">' + ICO.tema(s) + '<span>' + e(cap(nomeSub(s))) + '</span></button>';
    }).join('') + '</div></div>';
  }
  /* aba Fonte: lista de propriedades; o gabarito so aparece depois de responder */
  function fonteHTML(q) {
    var site = q.tipo === 'site', t = tentativas(q.id), resp = t.length > 0;
    var lin = [];
    lin.push(['Banca', site ? (q.fonte || 'Lista pública de exercícios') : (q.escola || '—') + (q.banca ? ' (banca ' + q.banca + ')' : '')]);
    if (!site && q.ano) lin.push(['Ano', q.ano + (q.fase ? ' · ' + q.fase : '')]);
    if (!site && q.n) lin.push(['Nº da questão', q.n]);
    lin.push(['Tipo', site ? 'Lista pública de exercícios' : 'Prova oficial']);
    lin.push(['Gabarito', resp ? '<b>' + e(q.gab) + '</b> <span class="tag">' + (site ? 'publicado na página' : 'gabarito oficial') + '</span>' : '<span style="color:var(--lapis)">aparece depois que você responder</span>']);
    if (resp) lin.push(['Suas tentativas', t.map(function (x) { return x.letra + (x.ok ? ' (acertou)' : ' (errou)'); }).join(' · ')]);
    return '<dl class="ad-props">' + lin.map(function (l) { return '<dt>' + l[0] + '</dt><dd>' + (l[0] === 'Gabarito' || l[0] === 'Banca' && false ? l[1] : (l[0] === 'Gabarito' ? l[1] : e(l[1]))) + '</dd>'; }).join('') + '</dl>' +
      (q.url ? '<a class="ad-orig" href="' + e(q.url) + '" target="_blank" rel="noopener">' + IC_EXT + (site ? 'Abrir a questão no site' : 'Abrir o caderno original') + '</a>' : '');
  }
  function pintaFonte(q) { var f = document.querySelector('#ad-painel .ad-aba[data-aba="fon"] .ad-fonte'); if (f) f.innerHTML = fonteHTML(q); }
  function marcada(q) { var x = est(q.id); return !!(x && x.rev); }
  function pintaMarca(q) {
    var b = g('ad-marca'); if (!b) return;
    var on = marcada(q); b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? 'Na sua lista de revisão — clique para tirar' : 'Revisar depois'); b.title = b.getAttribute('aria-label');
    b.innerHTML = on ? ICO.ui.revisaoCheia : ICO.ui.revisao;
    var r = g('ad-bx-rev'); if (r) r.querySelector('.ad-tx').innerHTML = '<b>' + (on ? 'Na sua lista de revisão' : 'Guardar esta questão') + '</b><small>' + (on ? 'clique para tirar' : 'aparece em Revisão') + '</small>';
  }
  function alternaMarca() { var r = g('b-rev'); var q = qAtual(); if (r && q) { r.click(); pintaMarca(q); } }
  /* dica: rotulo curto ("Dica 1/3") — o texto longo vira nome acessivel */
  function encurtaDica() {
    var bd = g('b-dica'); if (!bd || bd.dataset.curto === bd.textContent) return;
    var t = bd.textContent, m = /(\d+)\s+de\s+(\d+)/.exec(t);
    if (!m) { if (/carregando/.test(t)) { bd.dataset.curto = t; } return; }
    bd.setAttribute('aria-label', t + ' (tecla H)'); bd.title = t + ' (tecla H)';
    bd.innerHTML = 'Dica <small>' + m[1] + '/' + m[2] + '</small>';
    bd.dataset.curto = bd.textContent;
  }
  var obsDica = window.MutationObserver ? new MutationObserver(encurtaDica) : null;

  function arranja() {
    if (!corpo) return;
    var q = qAtual(), e2 = corpo.querySelector(':scope > .entra2');
    var meta = corpo.querySelector('.qmeta');
    if (!q || !e2 || !meta) { corpo.classList.remove('ad-q'); return; }
    corpo.classList.add('ad-q');
    if (meta.parentNode !== e2) e2.insertBefore(meta, e2.firstChild);
    pintaBarra();
    /* cabecalho do cartao: etiquetas + marcar (o "Questao i de n" foi para a barra) */
    if (!meta.querySelector('.ad-marca')) {
      var sb = document.createElement('span'); sb.className = 'tag'; sb.textContent = cap(nomeSub(q.sub)); meta.appendChild(sb);
      var mk = document.createElement('button'); mk.type = 'button'; mk.id = 'ad-marca'; mk.className = 'ad-marca'; mk.onclick = alternaMarca;
      meta.appendChild(mk); pintaMarca(q);
    }
    /* alternativas: so a letra (a tecla vai em aria-keyshortcuts) */
    corpo.querySelectorAll('#bolhas .bolha').forEach(function (b) {
      if (b.dataset.ad) return; b.dataset.ad = '1';
      var L = b.dataset.l; b.textContent = L;
      b.setAttribute('aria-label', 'Alternativa ' + L); b.setAttribute('aria-keyshortcuts', L);
    });
    /* acoes: anterior (icone) + certeza + dica + confirmar */
    var ac = e2.querySelector(':scope > .acoes');
    if (ac && !ac.querySelector('.ad-ant') && ctx && ctx.lista && ctx.i > 0 && !ctx.sim) {
      var an = document.createElement('button'); an.type = 'button'; an.className = 'ad-ant'; an.innerHTML = ICO.ui.voltar; an.setAttribute('aria-label', 'Questão anterior'); an.title = 'Questão anterior';
      an.onclick = function () { ctx.i--; clearInterval(tTimer); abrirQuestao(ctx.lista[ctx.i], ctx); };
      ac.insertBefore(an, ac.firstChild);
    }
    var bd = g('b-dica'); if (bd && ac && bd.parentNode !== ac && !ac.hidden) { var cf = g('b-conf'); ac.insertBefore(bd, cf || null); }
    if (bd && obsDica && !bd.__obs) { bd.__obs = 1; obsDica.observe(bd, { childList: true, characterData: true, subtree: true }); encurtaDica(); }
    var cfx = g('ad-conf'); if (cfx && ac && cfx.parentNode !== ac) { var an2 = ac.querySelector('.ad-ant'); ac.insertBefore(cfx, an2 ? an2.nextSibling : ac.firstChild); }
    /* painel da direita */
    var p = g('ad-painel');
    if (!p || p.dataset.q !== q.id) {
      if (p) p.remove();
      raiz.classList.remove('ad-resp');
      p = document.createElement('aside'); p.id = 'ad-painel'; p.dataset.q = q.id; p.setAttribute('aria-label', 'Resolução, teoria e fonte');
      p.innerHTML = '<div class="ad-abas" role="tablist"><button type="button" role="tab" data-aba="res">Resolução</button><button type="button" role="tab" data-aba="teo">Teoria</button><button type="button" role="tab" data-aba="fon">Fonte</button></div>' +
        '<div class="ad-corpo"><div class="ad-aba" role="tabpanel" data-aba="res"><div class="ad-trava">' + ICO.ui.lampada + '<div><b>A resolução abre quando você confirmar</b><p>Marque uma alternativa e confirme. Se travar, peça uma dica: ela mostra o caminho sem entregar a resposta.</p></div></div></div>' +
        '<div class="ad-aba" role="tabpanel" data-aba="teo" hidden>' + teoriaHTML(q) + '</div><div class="ad-aba" role="tabpanel" data-aba="fon" hidden><div class="ad-fonte"></div></div>' + relHTML(q) + '</div>';
      corpo.appendChild(p);
      pintaFonte(q);
      var gw = p.querySelector('.ad-gal-wrap'); if (gw) galeria(gw, gw.dataset.mod, gw.dataset.sub);
      p.querySelector('.ad-abas').addEventListener('click', function (ev) { var b = ev.target.closest('button[data-aba]'); if (b) escolheAba(b.dataset.aba); });
      p.querySelector('.ad-abas').addEventListener('keydown', function (ev) {
        var ids = ['res', 'teo', 'fon'], i = ids.indexOf(abaAtual), j = { ArrowRight: i + 1, ArrowLeft: i - 1 }[ev.key];
        if (j == null) return; ev.preventDefault(); j = (j + 3) % 3; escolheAba(ids[j]); p.querySelector('[data-aba="' + ids[j] + '"]').focus();
      });
      p.addEventListener('click', function (ev) {
        var b = ev.target.closest('.ad-rel button[data-sub]'); if (b) { clearInterval(tTimer); abrirSub(b.dataset.sub); return; }
        var tt = ev.target.closest('.ad-teo-tudo'); if (tt) { clearInterval(tTimer); abreTeoria(tt.dataset.teo, tt.dataset.sub); }
      });
      escolheAba('res');
    }
    var res = p.querySelector('.ad-aba[data-aba="res"]'), fon = p.querySelector('.ad-aba[data-aba="fon"]');
    var dbx = g('dica-box'); if (dbx && dbx.parentNode !== res) res.appendChild(dbx);
    ['b-texto', 'texto-box'].forEach(function (id) { var x = g(id); if (x && x.parentNode !== fon) fon.appendChild(x); });
    var fi = corpo.querySelector('details.ficha'); if (fi && fi.parentNode !== fon) fon.appendChild(fi);
    /* o que a confirmacao acrescenta: veredito/resolucao vao para o painel, os botoes ficam no cartao */
    [].slice.call(corpo.children).forEach(function (n) {
      if (n === e2 || n === p || n.id === 'ad-baixo') return;
      var acs = n.querySelector && n.querySelector(':scope > .acoes');
      if (acs) {
        acs.classList.add('ad-acoes2'); e2.appendChild(acs);
        if (ctx && ctx.lista && ctx.i > 0 && !ctx.sim && !acs.querySelector('.ad-ant')) {
          var a2 = document.createElement('button'); a2.type = 'button'; a2.className = 'ad-ant'; a2.innerHTML = ICO.ui.voltar; a2.setAttribute('aria-label', 'Questão anterior'); a2.title = 'Questão anterior';
          a2.onclick = function () { ctx.i--; clearInterval(tTimer); abrirQuestao(ctx.lista[ctx.i], ctx); };
          acs.insertBefore(a2, acs.firstChild);
        }
      }
      var tr = res.querySelector('.ad-trava'); if (tr) tr.remove();
      if (dbx) dbx.hidden = true;
      res.appendChild(n);
      if (n.querySelector && n.querySelector('.resolucao')) { raiz.classList.add('ad-resp'); pintaFonte(q); try { enxuga(q, n); } catch (x) { } poeFigura(q, n.querySelector('.resolucao')); }
      escolheAba('res');
      p.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    var btq = g('b-teoria'); if (btq && !btq.dataset.ad) { btq.dataset.ad = '1'; btq.onclick = function () { clearInterval(tTimer); abreTeoria(q.modulo, q.sub); }; }
    /* atalhos embaixo da questao */
    if (!g('ad-baixo') || g('ad-baixo').dataset.q !== q.id) {
      var vb = g('ad-baixo'); if (vb) vb.remove();
      var nd = (SUBS[q.sub] || []).filter(function (x) { return x.degrau; }).length;
      var bx = document.createElement('div'); bx.id = 'ad-baixo'; bx.dataset.q = q.id;
      function cart(tit, id, icg, b, s) { return '<div class="ad-bx"><h5>' + tit + '</h5><button type="button" id="' + id + '">' + icg + '<span class="ad-tx"><b>' + b + '</b><small>' + s + '</small></span>' + ICO.ui.seta + '</button></div>'; }
      bx.innerHTML = cart('Escada deste conteúdo', 'ad-bx-esc', ICO.tema(q.sub), e(cap(nomeSub(q.sub))), 'escada · ' + nd + (nd === 1 ? ' degrau' : ' degraus')) +
        cart('Teoria do tema', 'ad-bx-teo', ICO.tema(q.modulo), 'Teoria: ' + e((TEORIA[q.modulo] || {}).nome || ''), 'cartões: o que é, exemplo e caderno') +
        cart('Simulado rápido', 'ad-bx-sim', ICO.ui.simulados, 'Simulado rápido', '5 questões sorteadas, cronometrado') +
        cart('Revisão', 'ad-bx-rev', ICO.ui.revisao, '', '');
      corpo.appendChild(bx);
      g('ad-bx-esc').onclick = function () { clearInterval(tTimer); abrirSub(q.sub); };
      g('ad-bx-teo').onclick = function () { escolheAba('teo'); g('ad-painel').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };
      g('ad-bx-sim').onclick = function () { clearInterval(tTimer); iniciaSimulado(SIMS.filter(function (s) { return s.id === 's5'; })[0] || SIMS[0]); };
      g('ad-bx-rev').onclick = alternaMarca;
      var ir = g('ad-bx-rev').firstElementChild; if (ir) ir.style.color = 'var(--aviso)';
      pintaMarca(q);
    }
    ajustaPrint();
  }
  if (corpo && window.MutationObserver) new MutationObserver(arranja).observe(corpo, { childList: true });
  var _dq = desenhaQuestao;
  desenhaQuestao = function () {
    raiz.classList.remove('ad-resp');
    var r = _dq.apply(this, arguments); var q = qAtual();
    if (q) { modAtual = q.modulo; pintaFaixa(); poeVista(ctx && ctx.sim ? 'simulado-q' : 'questao'); pintaBarra(); }
    return r;
  };

  /* ==========================================================================================
     NAVEGACAO NOVA (29/10, pedido do dono): "nao precisa escolher tema por tema".
     Pagina do modulo = o que voce vai encontrar + COMECAR (sessao sortida entre os conteudos,
     em faixas de dificuldade crescentes, como numa prova). Areas de revisao no inicio da materia.
     Teoria em cartoes (D.teoria[mod].cartoes) e figura do conteudo no topo da resolucao.
     ========================================================================================== */
  var AREAS = (D.areas || []).filter(function (a) { return (a.mods || []).some(function (m) { return MODS[m]; }); });
  /* icone da area: o de um conteudo do 1o tema (o do tema ja aparece na lista "Temas desta area" ao lado) */
  function icArea(a) { return ICO.tema(a.mods[0]); }   /* 30/10: o realista do 1o modulo da area */
  var N_SESSAO = 12;
  var NOME_FX = ['Básico', 'Intermediário', 'Avançado', 'Vestibular'];
  function subsDe(mods) { return Object.keys(SUBS).filter(function (s) { return mods.indexOf(SUBS[s][0].modulo) >= 0; }).sort(); }
  function cartoesDe(m) { return ((TEORIA[m] || {}).cartoes || []).slice(); }
  function embaralha(l) { for (var i = l.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = l[i]; l[i] = l[j]; l[j] = x; } return l; }
  function ultTs(id) { var t = tentativas(id); return t.length ? t[t.length - 1].ts : 0; }

  /* monta a sessao: revisoes vencidas + nao respondidas; cotas por faixa (a mais baixa disponivel leva mais);
     dentro da faixa: embaralhado, alterna lista/vestibular e evita o mesmo conteudo duas vezes seguidas */
  function montaSessao(mods, n) {
    n = n || N_SESSAO;
    var pool = BANCO.filter(function (q) { return mods.indexOf(q.modulo) >= 0 && SUBS[q.sub] && !feitaHoje(q.id); });   /* 30/10: o que ja fez hoje nao volta hoje */
    var nsub = {}; pool.forEach(function (q) { nsub[q.sub] = 1; }); nsub = Object.keys(nsub).length || 1;
    var tetoSub = Math.max(2, Math.ceil(n / nsub));
    var ven = vencidas().filter(function (q) { return mods.indexOf(q.modulo) >= 0 && SUBS[q.sub] && !feitaHoje(q.id); }).slice(0, Math.max(2, Math.round(n / 3)));
    var usadas = {}; ven.forEach(function (q) { usadas[q.id] = 1; });
    var novas = embaralha(pool.filter(function (q) { return !respondida(q.id) && !usadas[q.id]; }));
    var reserva = [];
    if (novas.length + ven.length < n) {   /* acabaram as novas: as erradas primeiro, depois as mais antigas */
      reserva = pool.filter(function (q) { return respondida(q.id) && !usadas[q.id]; })
        .sort(function (a, b) { return (acertou(a.id) - acertou(b.id)) || (ultTs(a.id) - ultTs(b.id)); });
    }
    var porSub = {}; ven.forEach(function (q) { porSub[q.sub] = (porSub[q.sub] || 0) + 1; });
    var esc = [];
    /* pega em rodizio: a cada vez, do conteudo que menos apareceu ate agora (variedade dentro da mesma faixa) */
    function pega(lista, filtro, max, comTeto, umPorSub) {
      var local = {};
      while (max > 0 && esc.length + ven.length < n) {
        var melhor = null;
        for (var i = 0; i < lista.length; i++) {
          var q = lista[i]; if (usadas[q.id] || !filtro(q)) continue;
          if (comTeto && (porSub[q.sub] || 0) >= tetoSub) continue;
          if (umPorSub && local[q.sub]) continue;
          if (!melhor || (porSub[q.sub] || 0) < (porSub[melhor.sub] || 0)) melhor = q;
        }
        if (!melhor) return;
        usadas[melhor.id] = 1; local[melhor.sub] = 1; porSub[melhor.sub] = (porSub[melhor.sub] || 0) + 1; esc.push(melhor); max--;
      }
    }
    var fxs = novas.map(function (q) { return FAIXA_N(q.dif); }), f0 = fxs.length ? Math.min.apply(null, fxs) : 0;
    var vagas = n - ven.length, cota = [.4, .3, .2, .1];
    /* cada faixa leva no maximo 1 questao por conteudo nesta passada: a variedade vem antes da cota */
    cota.forEach(function (c, k) { pega(novas, function (q) { return FAIXA_N(q.dif) === f0 + k; }, Math.round(vagas * c), true, true); });
    for (var k2 = 0; k2 < 4; k2++) pega(novas, function (q) { return FAIXA_N(q.dif) === f0 + k2; }, n, true, true);
    pega(novas, function () { return true; }, n, true);        /* sobra de vaga: qualquer faixa, ainda variando o conteudo */
    pega(novas, function () { return true; }, n, false);
    pega(reserva, function () { return true; }, n, false);
    /* ordem final: faixas de dificuldade crescentes (como numa prova). Dentro da faixa: o proximo e o de menor
       nivel entre os que NAO repetem o conteudo anterior (empate sorteado, preferindo alternar lista/vestibular) */
    var todas = ven.concat(esc), grupos = {};
    todas.forEach(function (q) { var f = FAIXA_N(q.dif); (grupos[f] = grupos[f] || []).push(q); });
    var lista = [], ant = null, ant2 = null;
    Object.keys(grupos).map(Number).sort(function (a, b) { return a - b; }).forEach(function (f) {
      var gr = embaralha(grupos[f]);
      while (gr.length) {
        /* evita os 2 ultimos conteudos; se nao der, so o ultimo; se nem isso, qualquer um */
        var cand = gr.filter(function (q) { return (!ant || q.sub !== ant.sub) && (!ant2 || q.sub !== ant2.sub); });
        if (!cand.length) cand = gr.filter(function (q) { return !ant || q.sub !== ant.sub; });
        if (!cand.length) cand = gr;
        var querSite = ant ? ant.tipo !== 'site' : null;
        cand.sort(function (a, b) { return (a.dif - b.dif) || (querSite === null ? 0 : ((b.tipo === 'site') === querSite) - ((a.tipo === 'site') === querSite)); });
        ant2 = ant; ant = cand[0]; gr.splice(gr.indexOf(ant), 1); lista.push(ant);
      }
    });
    var subsN = {}; lista.forEach(function (q) { subsN[q.sub] = 1; });
    return { lista: lista.map(function (q) { return q.id; }), revisao: ven.length, novas: esc.filter(function (q) { return !respondida(q.id); }).length,
             nsubs: Object.keys(subsN).length, refazer: esc.filter(function (q) { return respondida(q.id); }).length };
  }
  function comecaSessao(sx, pronta) {
    var t = pronta || montaSessao(sx.mods, N_SESSAO);
    if (!t.lista.length) return;
    ctx = { lista: t.lista, i: 0, treino: { revisao: t.revisao }, t0: Date.now(), acertos: 0, sessao: sx };
    subAtual = null;
    abrirQuestao(t.lista[0], ctx);
  }
  function voltaSessao(sx) { if (sx.tipo === 'area') { vai('inicio'); escolheArea(sx.id, true); } else paginaModulo(sx.id); }
  var _aq = abrirQuestao;
  abrirQuestao = function (id, contexto) {
    var r = _aq.apply(this, arguments);
    var qv = g('q-volta');
    if (qv && ctx && ctx.sessao) { var sx = ctx.sessao; qv.onclick = function () { clearInterval(tTimer); voltaSessao(sx); }; }
    return r;
  };

  /* progresso por faixa de dificuldade (o caminho do facil ao dificil) */
  function faixasHTML(qs) {
    var fx = [0, 0, 0, 0], fr = [0, 0, 0, 0];
    qs.forEach(function (q) { var f = FAIXA_N(q.dif); fx[f]++; if (respondida(q.id)) fr[f]++; });
    return '<div class="ad-fx" role="list" aria-label="Progresso por faixa de dificuldade">' + fx.map(function (n, k) {
      if (!n) return '';
      return '<div class="ad-fx-i" role="listitem"><span class="r">' + NOME_FX[k] + '</span><span class="n num">' + fr[k] + ' de ' + n + '</span><span class="br"><i style="width:' + (100 * fr[k] / n).toFixed(1) + '%"></i></span></div>';
    }).join('') + '</div>';
  }
  function resumoSessao(t) {
    var p = [];
    p.push(t.lista.length + (t.lista.length === 1 ? ' questão' : ' questões') + ' de ' + t.nsubs + (t.nsubs === 1 ? ' conteúdo' : ' conteúdos'));
    if (t.revisao) p.push(t.revisao + (t.revisao === 1 ? ' revisão do dia' : ' revisões do dia'));
    p.push('do mais fácil ao mais difícil');
    return p.join(' · ');
  }
  function primeiraFrase(s) { s = String(s || ''); var m = /^(.+?[.!?])(\s|$)/.exec(s); return m ? m[1] : s; }

  /* ---------- pagina do modulo ---------- */
  function paginaModulo(m) {
    if (!MODS[m]) return;
    abreExtra(vMod, 'modulo'); modAtual = m; pintaFaixa(); rolaParaAtual();
    var T = TEORIA[m], qs = MODS[m], subs = subsDe([m]), cs = cartoesDe(m);
    var rsp = qs.filter(function (q) { return respondida(q.id); }).length, tt = qs.flatMap(function (q) { return tentativas(q.id); });
    var tx = tt.length ? Math.round(100 * tt.filter(function (x) { return x.ok; }).length / tt.length) + '%' : '—';
    var t = montaSessao([m], N_SESSAO), i = MODLIST.indexOf(m), prox = MODLIST[i + 1], antm = MODLIST[i - 1];
    var sx = { tipo: 'mod', id: m, nome: T.nome, mods: [m] };
    vMod.innerHTML = '<div class="ad-mp-topo"><button type="button" class="volta ad-mp-volta">' + ICO.ui.voltar + 'Todos os temas</button></div>' +
      '<div class="capa ad-mp-capa"><div class="ad-mp-cab"><span class="ad-mp-ic">' + ICO.tema(m) + '</span><div><p class="ad-mp-rot">Tema ' + (i + 1) + ' de ' + MODLIST.length + ' · ' + NOME + '</p><h1>' + e(T.nome) + '</h1>' +
      '<p class="ad-stat"><b>' + rsp + '</b> de ' + qs.length + ' respondidas · acerto <b>' + tx + '</b> · ' + subs.length + ' conteúdos</p></div></div>' +
      faixasHTML(qs) +
      '<div class="ad-mp-acoes">' + (t.lista.length ? '<button class="btn ad-comecar" id="ad-mp-comecar">' + ICO.ui.treino + 'Começar</button><p class="ad-mp-comp">' + resumoSessao(t) + '</p>'
        : '<p class="ad-mp-comp">Sem questões neste tema.</p>') +
      (cs.length ? '<button class="btn sec" id="ad-mp-teo">' + ICO.ui.livro + 'Teoria em cartões · ' + cs.length + '</button>' : '') + '</div></div>' +
      '<section class="ad-bloco ad-bl-enc"><h2 class="sec ad-mp-h">O que você vai encontrar <small>' + subs.length + ' conteúdos</small></h2><ul class="ad-enc">' + subs.map(function (s) {
        var c = cs.filter(function (x) { return x.sub === s; })[0], l = SUBS[s], r2 = l.filter(function (q) { return respondida(q.id); }).length;
        return '<li data-sub="' + s + '">' + ICO.tema(s) + '<span class="t"><b>' + e(cap(nomeSub(s))) + '</b><span>' + e(c ? primeiraFrase(c.oque) : (l.length + ' questões reais')) + '</span></span>' +
          '<span class="p"><span class="num">' + r2 + '/' + l.length + '</span><span class="br"><i style="width:' + (100 * r2 / l.length).toFixed(1) + '%"></i></span></span>' +
          '<button type="button" class="ad-enc-esc" data-sub="' + s + '" aria-label="Abrir a escada de ' + e(cap(nomeSub(s))) + '">Escada' + ICO.ui.seta + '</button></li>';
      }).join('') + '</ul>' +
      '<p class="ad-mp-pc"><button type="button" class="ad-link" id="ad-mp-porc" aria-expanded="false">Prefere escolher? Ver por conteúdo</button></p></section>' +
      '<nav class="ad-mp-viz" aria-label="Outros temas">' + (antm ? '<button type="button" data-mod="' + antm + '">' + ICO.ui.voltar + '<span><small>Tema anterior</small><b>' + e(TEORIA[antm].nome) + '</b></span></button>' : '<span></span>') +
      (prox ? '<button type="button" class="d" data-mod="' + prox + '"><span><small>Próximo tema</small><b>' + e(TEORIA[prox].nome) + '</b></span>' + ICO.ui.seta + '</button>' : '') + '</nav>';
    vMod.querySelector('.ad-mp-volta').onclick = function () { vai('estudar'); };
    var bc = g('ad-mp-comecar'); if (bc) bc.onclick = function () { comecaSessao(sx, t); };
    var bt = g('ad-mp-teo'); if (bt) bt.onclick = function () { abreTeoria(m); };
    var pc = g('ad-mp-porc'), ul = vMod.querySelector('.ad-enc');
    pc.onclick = function () { var on = !ul.classList.contains('porc'); ul.classList.toggle('porc', on); pc.setAttribute('aria-expanded', String(on)); pc.textContent = on ? 'Esconder a escolha por conteúdo' : 'Prefere escolher? Ver por conteúdo'; };
    ul.addEventListener('click', function (ev) { var b = ev.target.closest('.ad-enc-esc'); if (b) return abrirSub(b.dataset.sub); var li = ev.target.closest('li[data-sub]'); if (li && !ul.classList.contains('porc')) abrirSub(li.dataset.sub); });
    /* v66: a linha inteira abre a escada do conteudo (antes parecia lista navegavel mas nao era) */
    ul.querySelectorAll('li[data-sub]').forEach(function (li) { li.tabIndex = 0; li.setAttribute('role', 'link'); li.addEventListener('keydown', function (ev) { if ((ev.key === 'Enter' || ev.key === ' ') && !ul.classList.contains('porc')) { ev.preventDefault(); abrirSub(li.dataset.sub); } }); });
    vMod.querySelectorAll('.ad-mp-viz button[data-mod]').forEach(function (b) { b.onclick = function () { paginaModulo(b.dataset.mod); }; });
  }

  /* ---------- areas de revisao: sub-abas no inicio da materia ---------- */
  /* 30/10 (pedido do dono): sem abas nem "Revise por area". Todas as areas numa lista so: o nome da area pequeno,
     como titulo, e os temas dela embaixo, grandes. Cada area tem um "Treinar esta area" discreto ao lado do titulo. */
  function escolheArea(id, rola) {
    var el = g('ad-ar-g-' + id); if (rola && el) setTimeout(function () { el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 30);
  }
  function pintaAreas() {
    if (!AREAS.length) return;
    var vi = g('v-inicio'), capa = vi && vi.querySelector('.capa'); if (!capa) return;
    var s = g('ad-areas');
    if (!s) { s = document.createElement('section'); s.id = 'ad-areas'; s.className = 'ad-bloco'; s.setAttribute('aria-label', 'Temas de ' + NOME); capa.insertAdjacentElement('afterend', s); }
    var visto = {};   /* 30/10: cada tema aparece uma vez so (na 1a area em que esta) */
    /* auditoria 31/10: area 'de casa' quando a 1a area nao e' a certa (Diversidade dos seres vivos ficava em Saude e parasitologia) */
    var CASA = {B12: 'bevo'};
    s.innerHTML = AREAS.map(function (a) {
      var mods = a.mods.filter(function (m) { if (!MODS[m] || visto[m] || (CASA[m] && CASA[m] !== a.id)) return false; visto[m] = 1; return true; }); if (!mods.length) return '';
      /* 30/10 (pedido do dono): nao e' botao, e' um grafico de quanto ja respondeu em cada tema */
      return '<div class="ad-ar-g" id="ad-ar-g-' + a.id + '"><div class="ad-ar-gh"><h3>' + e(a.nome) + '</h3></div>' +
        '<div class="ad-ar-lista">' + mods.map(function (m) {
          var l = MODS[m], r2 = l.filter(function (q) { return respondida(q.id); }).length, pc = l.length ? Math.round(100 * r2 / l.length) : 0;
          return '<div class="ad-ar-m ad-ar-graf">' + ICO.tema(m) + '<span class="t"><b>' + e(TEORIA[m].nome) + '</b><span class="br" role="img" aria-label="' + pc + '% respondido"><i style="width:' + (100 * r2 / l.length).toFixed(1) + '%"></i></span><small>' + r2 + ' de ' + l.length + ' respondidas</small></span><span class="pc num">' + pc + '%</span></div>';
        }).join('') + '</div></div>';
    }).join('');
  }

  /* ---------- cartoes de teoria ---------- */
  var IC_AVISO = '<svg class="ic-ui" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  /* expoente escrito com ^ vira <sup> (16^(1/4), 16^0,25, a^m); **x** vira destaque na cor da materia */
  function supCartao(h) { return String(h).replace(/\^\(([^()<>]{1,24})\)/g, '<sup>$1</sup>').replace(/\^(−?[0-9a-zA-Z+]+(?:,[0-9]+)?)/g, '<sup>$1</sup>'); }
  function realce(s) { return supCartao(e(s)).replace(/\*\*(.+?)\*\*/g, '<strong class="ad-dest">$1</strong>'); }
  function cartaoHTML(c, compacto, comSub) {
    return '<article class="ad-cartao' + (compacto ? ' compacto' : '') + '" data-sub="' + e(c.sub) + '">' +
      '<header>' + (compacto && !comSub ? '' : '<span class="ad-c-ic">' + ICO.tema(c.sub) + '</span>') + '<div><h3>' + e(c.titulo) + '</h3>' + (comSub ? '<small>' + e(cap(nomeSub(c.sub))) + '</small>' : '') + '</div></header>' +
      (c.oque ? '<section class="o"><h4>O que é</h4><p>' + realce(c.oque) + '</p></section>' : '') +
      (c.identificar ? '<section class="i"><h4>Como identificar</h4><p>' + realce(c.identificar) + '</p></section>' : '') +
      (c.exemplo ? '<section class="x"><h4>Exemplo</h4><p>' + realce(c.exemplo) + '</p></section>' : '') +
      ((c.caderno || []).length ? '<section class="k"><h4>No caderno</h4><div class="ad-folha">' + c.caderno.map(function (l) { return '<div>' + supCartao(e(l)) + '</div>'; }).join('') + '</div></section>' : '') +
      (c.cuidado ? '<section class="c">' + IC_AVISO + '<div><h4>Cuidado</h4><p>' + realce(c.cuidado) + '</p></div></section>' : '') + '</article>';
  }
  function resumoVelhoHTML(t) {
    if (!t.resumo && !(t.formulas || []).length && !t.erro) return '';
    return '<details class="ad-teo-velho"><summary>Resumo do tema em texto corrido</summary>' + (t.resumo ? '<p>' + t.resumo + '</p>' : '') +
      ((t.formulas || []).length ? '<div class="form">' + t.formulas.map(function (f) { return '<div>' + sobrescrito(f) + '</div>'; }).join('') + '</div>' : '') +
      (t.erro ? '<div class="cuida"><b>Erro clássico</b>' + t.erro + '</div>' : '') + '</details>';
  }

  /* ---------- teoria do modulo: todos os cartoes, agrupados por conteudo ---------- */
  function abreTeoria(m, sub) {
    if (!TEORIA[m]) return;
    abreExtra(vTeo, 'teoria'); modAtual = m; pintaFaixa(); rolaParaAtual();
    var T = TEORIA[m], cs = cartoesDe(m), subs = subsDe([m]), ordem = [];
    subs.forEach(function (s) { if (cs.some(function (c) { return c.sub === s; })) ordem.push(s); });
    cs.forEach(function (c) { if (ordem.indexOf(c.sub) < 0) ordem.push(c.sub); });
    var i = MODLIST.indexOf(m), prox = MODLIST[i + 1];
    vTeo.innerHTML = '<div class="ad-mp-topo"><button type="button" class="volta ad-tp-volta">' + ICO.ui.voltar + e(T.nome) + '</button></div>' +
      '<div class="ad-tp-cab"><span class="ad-mp-ic">' + ICO.tema(m) + '</span><div><p class="ad-mp-rot">Teoria · ' + NOME + '</p><h1>' + e(T.nome) + '</h1><p class="ad-stat">' + cs.length + ' cartões em ' + ordem.length + ' conteúdos · o que é, como identificar, exemplo, caderno e cuidado</p></div>' +
      '<button class="btn" id="ad-tp-comecar">' + ICO.ui.treino + 'Praticar este tema</button></div>' +
      '<nav class="ad-tp-nav" aria-label="Conteúdos deste tema">' + ordem.map(function (s) { return '<button type="button" data-sub="' + s + '" title="' + e(cap(nomeSub(s))) + '">' + ICO.tema(s) + '<span>' + e(cap(nomeSub(s))) + '</span></button>'; }).join('') + '</nav>' +
      ordem.map(function (s) {
        var l = cs.filter(function (c) { return c.sub === s; });
        return '<section class="ad-tp-g" id="ad-tg-' + s.replace('.', '-') + '"><h2>' + ICO.tema(s) + '<span>' + e(cap(nomeSub(s))) + '</span><small>' + l.length + (l.length === 1 ? ' cartão' : ' cartões') + '</small></h2>' +
          '<div class="ad-tp-cartoes">' + l.map(function (c) { return cartaoHTML(c, false, false); }).join('') + '</div></section>';
      }).join('') +
      resumoVelhoHTML(T) + '<div class="ad-gal-wrap" id="ad-tp-gal"></div>' +
      (prox ? '<nav class="ad-mp-viz" aria-label="Próximo tema"><span></span><button type="button" class="d" data-mod="' + prox + '"><span><small>Teoria do próximo tema</small><b>' + e(TEORIA[prox].nome) + '</b></span>' + ICO.ui.seta + '</button></nav>' : '');
    vTeo.querySelector('.ad-tp-volta').onclick = function () { paginaModulo(m); };
    g('ad-tp-comecar').onclick = function () { comecaSessao({ tipo: 'mod', id: m, nome: T.nome, mods: [m] }); };
    var nav = vTeo.querySelector('.ad-tp-nav');
    function vaiPara(s) {
      var alvo = g('ad-tg-' + String(s).replace('.', '-')); if (!alvo) return;
      nav.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-current', String(b.dataset.sub === s)); });
      var y = alvo.getBoundingClientRect().top + scrollY - nav.offsetHeight - 16; scrollTo({ top: y, behavior: reduz ? 'auto' : 'smooth' });
    }
    nav.addEventListener('click', function (ev) { var b = ev.target.closest('button[data-sub]'); if (b) vaiPara(b.dataset.sub); });
    var pv = vTeo.querySelector('.ad-mp-viz button[data-mod]'); if (pv) pv.onclick = function () { abreTeoria(pv.dataset.mod); };
    galeria(g('ad-tp-gal'), m, sub || null);
    if (sub && ordem.indexOf(sub) >= 0) setTimeout(function () { vaiPara(sub); }, 60);
  }
  window.adTeoria = abreTeoria; window.adModulo = paginaModulo; window.adSessao = montaSessao;

  /* ---------- figura do conteudo no topo da resolucao (sempre em papel branco) ----------
     Rev. final P2-1: so aparece figura que CASA com a questao. O nucleo do titulo da figura (o nome, antes
     de ":" ou "("), sem as palavras do nome do conteudo e as comuns a quase todas as figuras, tem de
     aparecer INTEIRO no que a questao cobra, e cada palavra em pelo menos 2 destas 3 fontes: conceito,
     resposta e "pede"/"chave" da resolucao (uma mencao solta, como "sem depender do encefalo", nao basta). Enunciado,
     alternativas e analise das erradas nao contam (citam os distratores: Dalton numa questao de Thomson).
     Entre as que casam, ordena pelo resto do titulo (idf). Nenhuma casa: sem figura.
     P2-2: figura com letra pequena e' mostrada na largura que deixa a letra com >= 12 px; se nem a
     coluna nem a ampliada chegam a isso, ela nao e' usada. */
  var STOP = ' de da do das dos em no na nos nas com por para uns umas os as ao aos sua seu entre sobre como tipo tipos exemplo exemplos esquema figura figuras classificacao geral principais principal partes parte dois duas tres quatro cinco seis sete oito nove primeiro segundo ';
  function semAc(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function raizP(w) { w = w.replace(/oes$|aes$/, 'ao').replace(/s$/, ''); if (w.length > 4) w = w.replace(/[aeo]$/, ''); return w; }
  var NEG = { nao: 1, sem: 1, nem: 1, nunca: 1, jamais: 1, exceto: 1, dispensa: 1, independe: 1, independente: 1, confunda: 1, confundir: 1 };
  /* palavras com raiz; numero so com 2+ letras (CO2, NH3) ou ano (1904). Com neg=true, palavra ate 3
     depois de "nao/sem/nem..." nao conta ("sem depender do encefalo"); "nao disjuncao" e' nome de processo. */
  function palavras(s, neg) {
    var o = {}, ult = 99;
    semAc(s).replace(/\bnao[\s-]+disjunc/g, 'disjunc').split(/[^a-z0-9]+/).forEach(function (w) {
      ult++; if (neg && NEG[w]) { ult = 0; return; }
      var bom = /\d/.test(w) ? (/[a-z].*[a-z]/.test(w) || /^(1[5-9]|20)\d\d$/.test(w)) : w.length >= 4;
      if (bom && STOP.indexOf(' ' + w + ' ') < 0 && !(neg && ult <= 3)) o[raizP(w)] = 1;
    }); return o;
  }
  function temP(bag, w) { if (bag[w]) return true; if (w.length < 8) return false; for (var k in bag) if (k.length >= 8 && (k.indexOf(w) === 0 || w.indexOf(k) === 0)) return true; return false; }
  function txt(x) { return x == null ? '' : typeof x === 'string' ? x : Array.isArray(x) ? x.map(txt).join(' ') : typeof x === 'object' ? Object.keys(x).map(function (k) { return txt(x[k]); }).join(' ') : String(x); }
  function escolheFiguras(q, r, lista, dbg) {
    var cand = (lista || []).filter(function (x) { return (x.sub || []).indexOf(q.sub) >= 0; });
    if (!cand.length) return [];
    var geral = palavras(nomeSub(q.sub) + ' ' + ((TEORIA[q.modulo] || {}).nome || ''));
    function limpa(p) { Object.keys(p).forEach(function (w) { if (temP(geral, w)) delete p[w]; }); return p; }
    /* nucleo do titulo = antes de ":", " (" ou travessao (o nome da figura); o resto so ajuda a ordenar */
    var nuc0 = cand.map(function (x) { return palavras(String(x.t).split(/:|\s\(|\s[—–-]\s/)[0]); });
    var nuc = nuc0.map(function (p) { return limpa(Object.assign({}, p)); });
    /* nucleo em que a maior parte some (siglas, numeros: "Plantas C3, C4 e CAM") nao da' certeza */
    var CURTA = ' de da do das dos em no na nos nas com por para ao aos nao sem ';
    var bruto = cand.map(function (x) { var o = {}; semAc(String(x.t).split(/:|\s\(|\s[—–-]\s/)[0]).split(/[^a-z0-9]+/).forEach(function (w) {
      if (w && CURTA.indexOf(' ' + w + ' ') < 0 && !(/^[a-z]{1,2}$/.test(w)) && !(/^\d{1,3}$/.test(w))) o[w] = 1; }); return Object.keys(o).length; });
    var ws = cand.map(function (x) { return limpa(palavras(x.t)); });
    var df = {}; ws.forEach(function (p) { for (var w in p) df[w] = (df[w] || 0) + 1; });
    var N = cand.length, es = (r && r.essencial) || {};
    /* foco = o que a questao cobra (sem enunciado nem alternativas, que citam os distratores) */
    var fontes = [palavras(q.conceito, 1), palavras(txt(r && r.resposta), 1), palavras(txt(es.pede) + ' ' + txt(es.chave), 1)];
    var foco = {}; fontes.forEach(function (f) { for (var w in f) foco[w] = 1; });
    function firme(w) { return fontes.filter(function (f) { return temP(f, w); }).length >= 2; }   /* em 2 das 3 fontes */
    var corpo = palavras(txt(r && r.passos));
    var ok = cand.map(function (x, i) {
      var hw = Object.keys(nuc[i]).filter(function (w) { return !(N > 2 && df[w] > N / 2); });   /* palavra de quase todas nao distingue */
      /* todo o nucleo no foco (inclusive as palavras do nome do conteudo: "nao disjuncao NA MEIOSE"), as
         distintivas em 2 fontes, e nucleo de 1 palavra so ("Colesterol", "Etanol") tambem no conceito */
      var cobre = hw.length > 0 && hw.every(firme) && Object.keys(nuc0[i]).every(function (w) { return temP(foco, w); }) &&
        (Object.keys(nuc0[i]).length > 1 || hw.every(function (w) { return temP(fontes[0], w); })) &&
        Object.keys(nuc0[i]).length * 2 >= bruto[i];
      var s = 0, vw = [];
      for (var w in ws[i]) { if (N > 2 && df[w] > N / 2) continue; var idf = Math.log((N + 1) / df[w]); if (temP(foco, w)) { s += 3 * idf + 1; vw.push('F:' + w); } else if (temP(corpo, w)) { s += idf; vw.push('c:' + w); } }
      return { x: x, s: s, ok: cobre, pri: x.sub[0] === q.sub, i: i, vw: vw, hw: hw };
    }).filter(function (o) { return dbg || o.ok; });
    ok.sort(function (a, b) { return (b.ok - a.ok) || (b.s - a.s) || (b.pri - a.pri) || (a.x.sub.length - b.x.sub.length) || (a.i - b.i); });
    return dbg ? ok : ok.map(function (o) { return o.x; });
  }
  /* letra minima da figura (SVG): tamanho de fonte mais comum entre os menores x largura do viewBox */
  var LETRA = {};
  function letraFig(x) {
    if (LETRA[x.u] !== undefined) return LETRA[x.u];
    var r = null;
    try {
      var s = x.u.indexOf('base64,') > 0 ? atob(x.u.slice(x.u.indexOf('base64,') + 7)) : decodeURIComponent(x.u.slice(x.u.indexOf(',') + 1));
      var vb = /viewBox\s*=\s*["'][\d.\-]+[ ,]+[\d.\-]+[ ,]+([\d.]+)/.exec(s), wd = /<svg[^>]*\swidth\s*=\s*["']([\d.]+)/.exec(s);
      var W = vb ? +vb[1] : wd ? +wd[1] : 0, fs = [], m, re = /font-size\s*[:=]\s*["']?\s*([\d.]+)/g;
      while ((m = re.exec(s))) fs.push(+m[1]);
      if (W && fs.length) { fs.sort(function (a, b) { return a - b; }); r = { W: W, fs: fs[Math.floor(fs.length * .2)] }; }
    } catch (e) { r = null; }
    return (LETRA[x.u] = r);
  }
  function precisa(x) { var l = letraFig(x); return l ? Math.ceil(12 * l.W / l.fs) : 0; }   /* largura para letra de 12 px */
  /* ---------- visual da resolucao (30/10): animacao ou fotos reais escolhidas para a questao ---------- */
  %VIS%
  function poeVisual(q, alvo) {
    var ids = (typeof VIS !== 'undefined' && VIS.mapa[q.id]) || []; ids = ids.filter(function (k) { return VIS.def[k]; });
    var pai = alvo && alvo.parentNode; if (!ids.length || !pai) return false;
    if (pai.querySelector('.ad-vis')) return true;
    var V = VIS.def[ids[0]], f = document.createElement('figure'); f.className = 'ad-vis ad-fig';
    f.innerHTML = '<figcaption><b>Veja como funciona</b><span>' + e(V.tit) + '</span></figcaption><div class="ad-vis-palco"></div>' +
      (V.nota ? '<p class="ad-vis-nota">' + e(V.nota) + '</p>' : '') + '<p class="ad-vis-cred">' + e(V.cred || '') + '</p>' + ((V.fontes || []).length ? '<details class="ad-vis-fon"><summary>Fontes (' + V.fontes.length + ')</summary><ul>' + V.fontes.map(function (f) {
        var m = /^(.*?)\s+[—–-]\s+(https?:\/\/\S+)\s*$/.exec(String(f)); if (!m) return '<li>' + e(f) + '</li>';
        var dom = m[2].replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
        return '<li><a href="' + e(m[2]) + '" target="_blank" rel="noopener">' + e(m[1]) + '</a> <span>' + e(dom) + '</span></li>';
      }).join('') + '</ul></details>' : '');
    var essF = alvo.querySelector(':scope > .essencial'), ver = pai.querySelector(':scope > .veredito');
    if (essF) alvo.insertBefore(f, essF.nextSibling); else if (ver) pai.insertBefore(f, ver.nextSibling); else pai.insertBefore(f, alvo);   /* auditoria 31/10: figura DEPOIS do Em uma olhada (o resumo curto nao fica enterrado sob a animacao) */
    var palco = f.querySelector('.ad-vis-palco');
    if (V.tipo === 'galeria') {
      palco.classList.add('gal');
      palco.innerHTML = V.itens.map(function (it, i) {
        return '<figure class="ad-vis-it' + (it.contra ? ' contra' : '') + '"><button type="button" data-i="' + i + '" aria-label="Ampliar: ' + e(it.t) + '"><img loading="lazy" alt="' + e(it.t + ': ' + it.d) + '" src="' + it.src + '"></button>' +
          '<figcaption><b>' + e(it.t) + '</b>' + e(it.d) + '</figcaption></figure>';
      }).join('');
      var lista = V.itens.map(function (it) { return { u: it.src, t: it.t + ': ' + it.d }; });
      palco.querySelectorAll('button[data-i]').forEach(function (b) { b.onclick = function () { ampliaImg(lista, +b.dataset.i); }; });
      return true;
    }
    if (V.tipo === 'svg') {   /* esquema estatico: desenhado uma vez */
      var sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); sv.setAttribute('class', 'ad-vis-svg'); sv.setAttribute('role', 'img'); sv.setAttribute('aria-label', V.tit);
      palco.appendChild(sv); var dz = V.monta(sv, q.id); if (typeof dz === 'function') dz(0);
      return true;
    }
    /* animacao: o desenho e' funcao do tempo; play/pausa, linha do tempo com as fases e repetir */
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'ad-vis-svg'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', V.tit);
    palco.appendChild(svg);
    var desenha = V.monta(svg, q.id), dur = typeof V.dur === 'function' ? V.dur(q.id) : V.dur, MARC = typeof V.marcas === 'function' ? V.marcas(q.id) : V.marcas, tt = 0, toca = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches), ult = 0, raf = 0, visivel = true;
    var ctl = document.createElement('div'); ctl.className = 'ad-vis-ctl';
    ctl.innerHTML = '<button type="button" class="ad-vis-pp"></button><div class="ad-vis-linha"><input type="range" min="0" max="' + dur + '" step="0.01" value="0" aria-label="Linha do tempo">' +
      '<div class="ad-vis-marcas">' + (MARC || []).map(function (m) { return '<span style="left:' + (100 * m[0] / dur).toFixed(2) + '%">' + e(m[1]) + '</span>'; }).join('') + '</div></div>';
    palco.appendChild(ctl);
    /* 30/10: rotulos da linha do tempo nunca se encostam: o que encostaria desce para uma 2a linha */
    function arrumaMarcas() {
      var sp = [].slice.call(ctl.querySelectorAll('.ad-vis-marcas span')), fim = [-1e9, -1e9], dois = false;
      sp.forEach(function (x) { x.classList.remove('l2'); });
      sp.forEach(function (x) { var r = x.getBoundingClientRect(); if (!r.width) return; var l = r.left < fim[0] + 8 ? 1 : 0; if (l && r.left < fim[1] + 8) l = 0; if (l) { x.classList.add('l2'); dois = true; } fim[l] = r.right; });
      ctl.classList.toggle('ad-vis-2l', dois);
    }
    requestAnimationFrame(arrumaMarcas); setTimeout(arrumaMarcas, 400); if (document.fonts && document.fonts.ready) document.fonts.ready.then(arrumaMarcas);
    if (window.ResizeObserver) new ResizeObserver(function () { if (ctl.isConnected) arrumaMarcas(); }).observe(ctl); addEventListener('resize', function () { if (ctl.isConnected) arrumaMarcas(); });
    var pp = ctl.querySelector('.ad-vis-pp'), rg = ctl.querySelector('input');
    function rot() { pp.innerHTML = (toca ? '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>') + '<span>' + (toca ? 'Pausar' : 'Tocar') + '</span>'; }
    function quadro(ts) {
      raf = 0; if (!f.isConnected) return;
      if (toca && visivel) { if (ult) tt = (tt + (ts - ult) / 1000) % dur; ult = ts; raf = requestAnimationFrame(quadro); } else ult = 0;
      desenha(tt); rg.value = tt;
    }
    function liga() { if (!raf) raf = requestAnimationFrame(quadro); }
    pp.onclick = function () { toca = !toca; rot(); ult = 0; liga(); };
    rg.oninput = function () { toca = false; rot(); tt = +rg.value; desenha(tt); };
    if (window.IntersectionObserver) new IntersectionObserver(function (en) { visivel = en[0].isIntersecting; if (visivel) { ult = 0; liga(); arrumaMarcas(); } }).observe(f);
    /* 30/10: botao Ampliar: o mesmo visual (continua animando) abre grande, sobre a tela; Esc ou clique fora fecha */
    var amp = document.createElement('button'); amp.type = 'button'; amp.className = 'ad-vis-amp'; amp.innerHTML = lu('lupa') + '<span>Ampliar</span>'; ctl.appendChild(amp);
    var veu = null;
    var lugar = null;
    function fechaAmp() { f.classList.remove('ad-vis-grande'); if (lugar) { lugar.replaceWith(f); lugar = null; } if (veu) { veu.remove(); veu = null; } amp.querySelector('span').textContent = 'Ampliar'; document.removeEventListener('keydown', escAmp, true); setTimeout(arrumaMarcas, 50); }
    function escAmp(ev) { if (ev.key === 'Escape') { ev.stopImmediatePropagation(); fechaAmp(); } }
    amp.onclick = function () {
      if (f.classList.contains('ad-vis-grande')) return fechaAmp();
      veu = document.createElement('div'); veu.className = 'ad-vis-veu'; veu.onclick = fechaAmp; document.body.appendChild(veu);
      lugar = document.createElement('div'); lugar.style.height = f.offsetHeight + 'px'; f.replaceWith(lugar); document.body.appendChild(f);
      f.classList.add('ad-vis-grande'); amp.querySelector('span').textContent = 'Fechar'; document.addEventListener('keydown', escAmp, true); setTimeout(arrumaMarcas, 50);
    };
    rot(); desenha(toca ? 0 : 1.75); if (!toca) { tt = 1.75; rg.value = tt; } liga();
    return true;
  }
  function poeFigura(q, alvo) {
    var pai = alvo && alvo.parentNode; if (!pai || pai.querySelector('.ad-fig')) return;
    if (poeVisual(q, alvo)) return;
    Promise.all([imagens(q.modulo), typeof carregaRes === 'function' ? Promise.resolve(carregaRes(q.id)).catch(function () { return null; }) : null]).then(function (rr) {
      if (!alvo.isConnected || pai.querySelector('.ad-fig')) return;
      var l = escolheFiguras(q, rr[1], rr[0]);
      /* a ampliada mostra a figura na largura que deixa a letra com 12 px (rolando, se preciso); acima de
         1400 px nem assim da' para ler numa tela: essa figura nao entra */
      l = l.filter(function (x) { return precisa(x) <= 1400; });
      if (!l.length) return;
      var x = l[0], nec = precisa(x), f = document.createElement('figure'); f.className = 'ad-fig'; f.__nec = nec; f.__n = l.length;
      f.innerHTML = '<figcaption><b>Figura do conteúdo</b><button type="button" class="ad-fig-amp"></button></figcaption>' +
        '<button type="button" class="ad-fig-img' + (x.e === 'caderno' ? ' cad' : '') + '" aria-label="Ampliar: ' + e(x.t) + '"><img alt="' + e(x.t) + '" src="' + x.u + '"></button>' +
        '<p class="ad-fig-t">' + e(x.t) + '</p>';
      var im = f.querySelector('img');
      ajustaFig(f);
      im.addEventListener('load', function () { ajustaFig(f); });
      setTimeout(function () { ajustaFig(f); }, 450);   /* depois da transicao das colunas (o painel alarga ao responder) */
      /* rodada 6: a Resposta (e o "por que a sua nao serve") subiu para o topo; a figura entra logo depois deles,
         antes do "Em uma olhada". Sem o "Em uma olhada", fica onde ficava: logo abaixo do veredito */
      var essF = alvo.querySelector(':scope > .essencial'), ver = pai.querySelector(':scope > .veredito');
      if (essF) alvo.insertBefore(f, essF.nextSibling); else if (ver) pai.insertBefore(f, ver.nextSibling); else pai.insertBefore(f, alvo);   /* auditoria 31/10: figura DEPOIS do Em uma olhada (o resumo curto nao fica enterrado sob a animacao) */
      f.querySelector('.ad-fig-img').onclick = f.querySelector('.ad-fig-amp').onclick = function () { ampliaImg(l, 0); };
    });
  }
  window.adEscolheFiguras = escolheFiguras;
  /* tamanho da figura da resolucao: o padrao (ate 360 px de altura) se a letra ja fica >= 12 px; senao ela
     cresce ate a largura que deixa a letra legivel; se nem a coluna inteira basta, o botao vira "Ampliar para ler" */
  function ajustaFig(f) {
    var im = f.querySelector('.ad-fig-img img'), bt = f.querySelector('.ad-fig-amp'); if (!im || !bt) return;
    var nec = f.__nec, util = Math.max(160, f.clientWidth - 26);
    im.style.maxHeight = ''; im.style.width = ''; im.style.maxWidth = ''; im.style.margin = '';
    var dw = im.getBoundingClientRect().width;
    if (nec && dw && nec > dw + 1) { im.style.maxHeight = 'none'; im.style.width = Math.min(util, nec) + 'px'; im.style.maxWidth = '100%'; im.style.margin = '0 auto'; }
    var ler = nec > util + 1;
    bt.innerHTML = lu('lupa') + (ler ? 'Ampliar para ler' : (f.__n > 1 ? 'Ampliar · ' + f.__n + ' figuras' : 'Ampliar'));
    f.classList.toggle('ad-fig-ler', ler);
  }
  addEventListener('resize', function () { document.querySelectorAll('.ad-fig').forEach(ajustaFig); });

  /* ---------- RESOLUCAO MAIS DIRETA (rodada 6, design/AUDITORIA_RESOLUCOES.md secao 5a) ----------
     So apresentacao: nada sai dos dados e nada some de vez; o que recolhe abre com um clique.
     Ordem final dentro de .resolucao: Resposta -> por que a sua nao serve (errou) -> Observacao -> figura ->
     Em uma olhada -> Antes de tudo (recolhido) -> Passo a passo -> Confira -> Por que as outras (recolhido) -> Armadilha
     (so se nao repetir o "cuidado"). Facil (dif <= 3) e acertada: so Resposta + Em uma olhada; o resto atras de um botao. */
  function semAcento(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function palavrasC(s) { var o = {}; (semAcento(s).match(/[a-z0-9]{4,}/g) || []).forEach(function (w) { o[w] = 1; }); return o; }
  function nPal(s) { return String(s || '').split(/\s+/).filter(Boolean).length; }
  function blocoCom(r, sel) { return [].filter.call(r.children, function (b) { return b.classList.contains('bloco') && b.querySelector(sel); })[0] || null; }
  function recolhe(tit, meta, cls) {
    var d = document.createElement('details'); d.className = 'ad-rec' + (cls ? ' ' + cls : '');
    d.innerHTML = '<summary><span class="t">' + tit + '</span>' + (meta ? '<small>' + meta + '</small>' : '') + '</summary>';
    return d;
  }
  function botaoMais(txt, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = 'ad-mais' + (cls ? ' ' + cls : ''); b.textContent = txt; b.setAttribute('aria-expanded', 'false'); return b; }
  function plural(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }
  /* glossario sem duplicata: o termo da lista que ja vira toque/caixinha no proprio texto do "Antes" sai da lista
     (a definicao continua a um toque, no texto). Roda depois do dicionario, que marca no quadro seguinte. */
  function glossarioSemDuplo(an) {
    var tx = an.querySelector('p'), dl = an.querySelector('dl.simbolos'); if (!tx || !dl) return;
    var marcados = {};
    tx.querySelectorAll('.ad-dic, button.gl').forEach(function (s) { marcados[semAcento(s.textContent).trim()] = 1; });
    var vis = 0;
    dl.querySelectorAll('dt').forEach(function (dt) {
      var dd = dt.nextElementSibling, k = semAcento(dt.textContent).trim();
      var sai = !!marcados[k];
      dt.classList.toggle('ad-dup', sai); if (dd && dd.tagName === 'DD') dd.classList.toggle('ad-dup', sai);
      if (!sai) vis++;
    });
    dl.classList.toggle('ad-dup', !vis);
    var sm = an.closest('.bloco') && an.closest('.bloco').querySelector('details.ad-rec-antes > summary small, details.ad-rec-teo > summary small');
    if (sm && sm.dataset.base != null) sm.textContent = sm.dataset.base + (vis ? (sm.dataset.base ? ' · ' : '') + plural(vis, 'termo', 'termos') : '');
  }
  function enxuga(q, wrap) {
    var r = wrap.querySelector('.resolucao'); if (!r || r.dataset.enx) return; r.dataset.enx = '1';
    var ver = wrap.querySelector('.veredito'), ok = !!(ver && ver.classList.contains('v1'));
    var t = tentativas(q.id), letra = t.length ? t[t.length - 1].letra : null;
    var ess = r.querySelector(':scope > .essencial');
    var bResp = blocoCom(r, ':scope > .resp'), bAntes = blocoCom(r, ':scope > .antes'), bErr = blocoCom(r, ':scope > .errada');
    var bArm = blocoCom(r, '.armad'), alerta = r.querySelector(':scope > .alerta-box'), sua = wrap.querySelector('.sua-topo');
    /* 1 e 11: Resposta no topo; quem errou le em seguida por que a letra dele nao serve; a Observacao (de onde saem os dados) logo depois */
    [alerta, sua, bResp].forEach(function (x) { if (x) { x.classList.add('ad-topo'); r.insertBefore(x, r.firstChild); } });
    /* 2: Armadilha que repete o "cuidado" (>= 50% das palavras de conteudo do cuidado) fica recolhida atras de um link no proprio
       cuidado. Se a armadilha cita a letra que o aluno marcou, as duas ficam. */
    var cu = ess && ess.querySelector('.ess.cuidado p');
    if (bArm && cu) {
      var ar = bArm.querySelector('.armad'), b0 = ar.querySelector(':scope > b'), txa = ar.textContent.slice(b0 ? b0.textContent.length : 0);
      var pc = Object.keys(palavrasC(cu.textContent)), pa = palavrasC(txa), igual = pc.filter(function (w) { return pa[w]; }).length;
      var cit = /(?:alternativa|letra)\s+([A-E])\b|\(([A-E])\)/.exec(txa), citada = cit && (cit[1] || cit[2]);
      if (pc.length && igual / pc.length >= .5 && !(letra && citada === letra)) {
        bArm.hidden = true; bArm.classList.add('ad-arm-rep');
        var bm = botaoMais('Ver a armadilha completa', 'ad-mais-arm'); bm.setAttribute('aria-controls', 'ad-arm-' + q.id); bArm.id = 'ad-arm-' + q.id;
        cu.appendChild(document.createTextNode(' ')); cu.appendChild(bm);
        bm.onclick = function () {
          var abre = bArm.hidden;
          if (abre && ess.nextSibling !== bArm) ess.parentNode.insertBefore(bArm, ess.nextSibling);   /* aparece logo abaixo do cuidado */
          bArm.hidden = !abre; bm.setAttribute('aria-expanded', String(abre)); bm.textContent = abre ? 'Esconder a armadilha' : 'Ver a armadilha completa';
        };
      }
    }
    /* 3 e 12: "Antes de tudo" recolhido. Acertou: tudo fechado. Errou: as formulas ficam a vista e o texto + termos recolhem */
    if (bAntes) {
      var an = bAntes.querySelector(':scope > .antes'), h3 = bAntes.querySelector(':scope > h3');
      var fo = an.querySelector(':scope > .formula'), tx = an.querySelector(':scope > p'), dl = an.querySelector(':scope > dl.simbolos');
      var nf = fo ? fo.children.length : 0, nt = dl ? dl.querySelectorAll('dt').length : 0, d;
      if (ok || !fo) {
        var base = nf ? plural(nf, 'fórmula', 'fórmulas') : '';
        d = recolhe('Antes de tudo · teoria de base', base + (nt ? (base ? ' · ' : '') + plural(nt, 'termo', 'termos') : ''), 'ad-rec-antes');
        d.querySelector('small') && (d.querySelector('small').dataset.base = base);
        if (h3) h3.remove(); d.appendChild(an); bAntes.appendChild(d);
      } else if (tx || dl) {
        var base2 = tx ? 'texto' : '';
        d = recolhe('Teoria de base', base2 + (nt ? (base2 ? ' · ' : '') + plural(nt, 'termo', 'termos') : ''), 'ad-rec-teo');
        d.querySelector('small') && (d.querySelector('small').dataset.base = base2);
        if (tx) d.appendChild(tx); if (dl) d.appendChild(dl); an.appendChild(d);
      }
      bAntes.classList.add('ad-bl-antes');
      setTimeout(function () { glossarioSemDuplo(an); }, 60); setTimeout(function () { glossarioSemDuplo(an); }, 700);
    }
    /* 4: "Por que as outras" recolhido (quem errou ja leu a dele no topo) */
    if (bErr) {
      var hE = bErr.querySelector(':scope > h3'), tit = hE ? hE.textContent : 'Por que as outras não servem';
      var outras = [].filter.call(bErr.querySelectorAll(':scope > .errada'), function (x) { return !x.classList.contains('sua'); });
      if (outras.length) {
        var dE = recolhe(e(tit), sua || bErr.querySelector('.errada.sua') ? (outras.length === 1 ? 'ver a outra' : 'ver as outras ' + outras.length) : plural(outras.length, 'alternativa', 'alternativas'), 'ad-rec-err');
        outras.forEach(function (x) { dE.appendChild(x); });
        if (bErr.querySelector('.errada.sua')) bErr.appendChild(dE); else { if (hE) hE.remove(); bErr.appendChild(dE); }
      }
    }
    /* 7, 9, 10 e 8 (este no fatiamento do player): por passo */
    r.querySelectorAll('.passo').forEach(function (ps) {
      var c = ps.querySelector('.conta'), tp = ps.querySelector('.tipo'), pq = ps.querySelector('.porque');
      if (tp && /calcular$/.test(tp.getAttribute('aria-label') || '') && !(c && /[0-9₀-₉=]/.test(c.textContent))) tp.classList.add('ad-sem-chip');
      if (!c) ps.classList.add('ad-sem-conta');
      if (pq && nPal(pq.textContent) > 40) {
        pq.classList.add('ad-clamp');
        var bq = botaoMais('por quê, completo', 'ad-mais-pq'); pq.insertAdjacentElement('afterend', bq);
        bq.onclick = function () { var on = pq.classList.toggle('ad-clamp'); bq.setAttribute('aria-expanded', String(!on)); bq.textContent = on ? 'por quê, completo' : 'mostrar menos'; };
      }
    });
    /* 5: modo curto para questao facil acertada */
    if (ok && +q.dif <= 3 && ess && bResp) {
      var resto = document.createElement('div'); resto.className = 'ad-resto'; resto.hidden = true; resto.id = 'ad-resto-' + q.id;
      [].slice.call(r.children).forEach(function (x) { if (x !== ess && !x.classList.contains('ad-topo') && !x.classList.contains('aviso-box') && !x.classList.contains('ad-fig')) resto.appendChild(x); });
      var np = r.querySelectorAll('.passo').length + resto.querySelectorAll('.passo').length;
      var bc = document.createElement('button'); bc.type = 'button'; bc.className = 'ad-completa'; bc.setAttribute('aria-expanded', 'false'); bc.setAttribute('aria-controls', resto.id);
      var rot = function (on) { bc.innerHTML = '<span>' + (on ? 'Esconder a resolução completa' : 'Ver a resolução completa') + '</span><small>' + (on ? '' : plural(np, 'passo', 'passos') + ', teoria e alternativas') + '</small>'; };
      rot(false);
      bc.onclick = function () { var on = resto.hidden; resto.hidden = !on; bc.setAttribute('aria-expanded', String(on)); rot(on); };
      ess.insertAdjacentElement('afterend', bc); bc.insertAdjacentElement('afterend', resto);
      r.classList.add('ad-curta');
    }
  }

  /* ---------- FLASHCARDS (30/10, pedido do dono) ----------
     D.flash = [{id, mod, sub, tipo, frente, verso, essencial[], aceita[], erro_comum, peso}]. O aluno le a frente,
     ESCREVE a resposta com as palavras dele e corrige. Correcao: IA pela pagina principal (capacidade `sample`, que so
     o shell pode chamar; ponte {ia:'req'} / {ia:'res'}) ou, sem IA, comparacao local tolerante que so SUGERE — o aluno
     confirma vendo a resposta-modelo (Errei / Quase / Acertei) e sempre pode discordar.
     Revisao espacada por cartao (SM-2 simplificado): Acertei sobe um degrau (1, 3, 7, 16, 35, 80 dias); Quase volta
     amanha e desce um degrau; Errei volta hoje (e reaparece no fim da sessao). Estado no MESMO S da materia:
     S.flash[id] = {etapa, vence, hist:[{ts, v}]}, salvo por salva() (navegador + conta pela ponte db).
     Sem cartoes na materia (D.flash vazio): nada aparece. */
  /* cartoes COM IMAGEM (29/10): D.flash_img = [{id, mod, sub, img, frente, verso, essencial, aceita, erro_comum, peso, credito}];
     o SVG de cada um (design/flash_img/<m>/<img>) vem embutido pelo build, so os da propria materia. Entram no mesmo baralho:
     mesma correcao (IA ou local), mesma revisao espacada em S.flash, mesmas sessoes; a imagem fica grande acima da resposta. */
  var FLIMG = %FLIMG%, FLIMGU = {};
  var LOGOS = %LOGOS%;   /* logos das universidades nos simulados (design/logos/FONTES.md) */
  function flImgUrl(nome) { if (!FLIMG[nome]) return ''; if (!FLIMGU[nome]) FLIMGU[nome] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(FLIMG[nome]); return FLIMGU[nome]; }
  var FL = (function () {
    var CART = (Array.isArray(D.flash) ? D.flash : []).concat((Array.isArray(D.flash_img) ? D.flash_img : []).filter(function (c) { return c && c.img && FLIMG[c.img]; }).map(function (c) { return Object.assign({ tipo: 'imagem' }, c); }))
      .filter(function (c) { return c && c.id && c.frente && c.verso; });
    /* 30/10 (pedido do dono): "gostei / nao gostei" em cada flashcard. "Nao gostei" tira o cartao das proximas sessoes
       e guarda o tipo, para avaliar quais estilos de cartao funcionam. Fica em S.flg (sincroniza com a conta). */
    function flGosto(id) { return (S.flg && S.flg[id]) ? S.flg[id].g : 0; }
    CART = CART.filter(function (c) { return flGosto(c.id) !== -1; });
    /* 01/11 (pedido do dono, de novo): o voto fica DENTRO da resolucao, logo depois da resposta revelada e antes de
       "Como foi?", com a pergunta "Curtiu este cartao? Sim / Nao". Vale para flashcards e para as frases de completar.
       "Nao" tira das proximas sessoes; "Sim" e "Nao" ficam em S.flg com o tipo do item (para medir que estilo funciona). */
    window.adFlGosto = flGosto;
    /* 01/11: todo cartao mostra a fonte (regra do dono: material de estudo sempre com fonte) */
    function fonteCartao(c) {
      var f = String((c && c.fonte) || ''), mu = f.match(/https?:\/\/[^\s·]+/); if (!mu) return '';
      var u = mu[0], dom = u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      var obra = f.slice(0, mu.index).replace(/[\s—–·-]+$/, '').trim();   /* "Camões, soneto ... — https://..." */
      return '<p class="ad-fl-fonte">' + ICO.ui.livro + '<span>Fonte: ' + (obra ? e(obra) + ' · ' : '') + '<a href="' + e(u) + '" target="_blank" rel="noopener noreferrer">' + e(dom) + '</a></span></p>';
    }
    function poeGosto(c, lista, frase) {
      var res = g('ad-fl-res'); if (!res || !c || res.querySelector('.ad-fl-gosto')) return;
      var d = document.createElement('div'); d.className = 'ad-fl-gosto'; d.setAttribute('role', 'group');
      var nome = frase ? 'esta frase' : 'este cartão';
      d.setAttribute('aria-label', 'Curtiu ' + nome + '?');
      var IC_S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3Z"/><path d="M7 10l4-7a2.5 2.5 0 0 1 2.5 3L12.6 10H19a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 21H7"/></svg>';
      var IC_N = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 14V3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3Z"/><path d="M17 14l-4 7a2.5 2.5 0 0 1-2.5-3l.9-4H5a2 2 0 0 1-2-2.3l1.2-7A2 2 0 0 1 6.2 3H17"/></svg>';
      function pinta() {
        var v = flGosto(c.id);
        d.innerHTML = '<span class="r">Curtiu ' + nome + '?</span>' +
          '<span class="bt"><button type="button" data-g="1" aria-pressed="' + (v === 1) + '">' + IC_S + 'Sim</button>' +
          '<button type="button" data-g="-1" aria-pressed="' + (v === -1) + '">' + IC_N + 'Não</button></span>' +
          (v === -1 ? '<span class="ok">Não volta mais nas próximas sessões. <button type="button" class="desf">Desfazer</button></span>'
            : v === 1 ? '<span class="ok">Anotado. Vou trazer mais assim.</span>' : '<span class="ok dica">"Não" tira ' + (frase ? 'a frase' : 'o cartão') + ' das próximas sessões.</span>');
        d.querySelectorAll('[data-g]').forEach(function (b) { b.onclick = function () { marca(+b.dataset.g === flGosto(c.id) ? 0 : +b.dataset.g); }; });
        var u = d.querySelector('.desf'); if (u) u.onclick = function () { marca(0); };
      }
      function marca(v) {
        S.flg = S.flg || {};
        if (v) S.flg[c.id] = { g: v, tipo: frase ? 'completar' : (c.tipo || (c.img ? 'imagem' : 'conceito')), mod: c.mod || String(c.sub || '').split('.')[0] || '', ts: Date.now() }; else delete S.flg[c.id];
        var L = lista || CART, i = L.indexOf(c);
        if (v === -1 && i >= 0) L.splice(i, 1); else if (v !== -1 && i < 0) L.push(c);
        salva(); pinta();
      }
      pinta();
      var nt = res.querySelector('.ad-fl-nota'); if (nt) res.insertBefore(d, nt); else res.appendChild(d);
    }
    var NIMG = CART.filter(function (c) { return c.img; }).length;
    var API = { n: CART.length, home: function () { }, resumo: function () { return { ven: 0, nov: 0 }; } };
    window.adFlashMescla = function (a, b) { return mescla(a, b); };
    if (!CART.length) return API;
    var INTERV = [1, 3, 7, 16, 35, 80], N_SES = 20, MAX_HIST = 12;
    var TIPO = { conceito: 'Conceito', formula: 'Fórmula', identificar: 'Como identificar', comparar: 'Comparação', processo: 'Processo', exemplo: 'Exemplo', imagem: 'Com imagem' };
    var MODC = []; CART.forEach(function (c) { if (MODC.indexOf(c.mod) < 0) MODC.push(c.mod); }); MODC.sort();
    var AREASF = AREAS.map(function (a) { return { id: a.id, nome: a.nome, mods: a.mods.filter(function (m) { return MODC.indexOf(m) >= 0; }), a: a }; }).filter(function (a) { return a.mods.length; });
    var filtro = { area: lsG('ad-fl-area-' + MAT) || '', mod: lsG('ad-fl-mod-' + MAT) || '', img: NIMG && lsG('ad-fl-img-' + MAT) === '1' };
    if (filtro.area && !AREASF.some(function (a) { return a.id === filtro.area; })) filtro.area = '';
    if (filtro.mod && MODC.indexOf(filtro.mod) < 0) filtro.mod = '';
    window.adFlFiltroMod = function (m) { if (MODC.indexOf(m) < 0) return; filtro.mod = m; filtro.area = ''; lsS('ad-fl-mod-' + MAT, m); lsS('ad-fl-area-' + MAT, ''); };   /* auditoria 31/10: a busca abre os cartoes do tema */
    var vFla = document.createElement('section'); vFla.id = 'v-flash'; vFla.hidden = true; wrap.appendChild(vFla); EXTRAS.push(vFla);
    var ses = null, cur = null;
    var IA = { disp: false, n: 0, pend: {}, aviso: '' };

    /* ---- estado ---- */
    function rec(id) { var x = (S.flash || {})[id]; return x && x.hist && x.hist.length ? x : null; }
    function ultTsF(x) { return x && x.hist && x.hist.length ? x.hist[x.hist.length - 1].ts : 0; }
    function venceDe(c) { var x = rec(c.id); return x ? x.vence : null; }
    function proximo(x, v, ts) {
      var et = x ? x.etapa : null, k;
      if (v === 'e') return { etapa: -1, vence: ts };
      if (v === 'q') { k = et == null || et < 0 ? 0 : Math.max(0, et - 1); return { etapa: k, vence: emNDias(ts, 1) }; }
      k = et == null || et < 0 ? 0 : Math.min(et + 1, INTERV.length - 1);
      return { etapa: k, vence: emNDias(ts, INTERV[k]) };
    }
    function quandoV(v, x) {
      var agora = Date.now(), p = proximo(x, v, agora);
      if (v === 'e') return 'volta hoje';
      var d = Math.round((iniDia(p.vence) - iniDia(agora)) / DIA), t = d <= 1 ? 'volta amanhã' : 'volta em ' + d + ' dias';
      /* acertou um cartao novo (ou que voltou de um erro): tambem volta amanha, mas sobe de degrau — diz o proximo passo */
      if (v === 'a' && d <= 1 && p.etapa + 1 < INTERV.length) t += ', depois em ' + INTERV[p.etapa + 1] + ' dias';
      return t;
    }
    function marca(id, v, origem) {
      var agora = Date.now(), x = rec(id), p = proximo(x, v, agora);
      var h = (x ? x.hist : []).concat([origem ? { ts: agora, v: v, c: origem } : { ts: agora, v: v }]);
      if (h.length > MAX_HIST) h = h.slice(-MAX_HIST);
      if (!S.flash || typeof S.flash !== 'object') S.flash = {};
      S.flash[id] = { etapa: p.etapa, vence: p.vence, hist: h };
      salva();
    }
    /* uniao de dois aparelhos: vale o cartao respondido por ultimo; o historico junta os dois */
    function mescla(a, b) {
      a = a && typeof a === 'object' ? a : {}; b = b && typeof b === 'object' ? b : {};
      var out = {};
      Object.keys(a).concat(Object.keys(b)).forEach(function (id) {
        if (out[id]) return;
        var x = a[id], y = b[id];
        if (!x || !y) { out[id] = x || y; return; }
        var base = ultTsF(y) > ultTsF(x) ? y : x, porTs = {};
        (x.hist || []).concat(y.hist || []).forEach(function (t) { porTs[t.ts] = t; });
        out[id] = { etapa: base.etapa, vence: base.vence, hist: Object.keys(porTs).map(function (k) { return porTs[k]; }).sort(function (p, q) { return p.ts - q.ts; }).slice(-MAX_HIST) };
      });
      setTimeout(function () { if (!vRev.hidden && vRev.querySelector('.ad-fl-capa')) home(); }, 0);
      return out;
    }
    window.adFlashMescla = mescla;

    /* ---- filtros e contas ---- */
    function areaDe(id) { return AREASF.filter(function (a) { return a.id === id; })[0] || null; }
    function lista() {
      var ar = filtro.area ? areaDe(filtro.area) : null;
      return CART.filter(function (c) { return (!filtro.img || c.img) && (filtro.mod ? c.mod === filtro.mod : (!ar || ar.mods.indexOf(c.mod) >= 0)); });
    }
    function resumo(l) {
      l = l || CART; var agora = Date.now(), r = { ven: 0, nov: 0, firmes: 0, semana: 0, total: l.length };
      l.forEach(function (c) {
        var x = rec(c.id);
        if (!x) { r.nov++; return; }
        if (x.vence <= agora) r.ven++; else if (x.vence <= emNDias(agora, 8)) r.semana++;
        if (x.etapa >= 2) r.firmes++;
      });
      return r;
    }
    /* sessao: primeiro os vencidos (mais atrasados antes), depois novos — os que mais caem (peso 3) primeiro,
       alternando os temas; a ordem final intercala revisao e novo e evita dois do mesmo conteudo seguidos */
    function monta(l) {
      var agora = Date.now();
      var ven = l.filter(function (c) { var v = venceDe(c); return v != null && v <= agora; }).sort(function (a, b) { return venceDe(a) - venceDe(b); }).slice(0, N_SES);
      var nov = [], porP = {};
      l.forEach(function (c) { if (venceDe(c) == null) { var p = c.peso || 1; ((porP[p] = porP[p] || {})[c.mod] = porP[p][c.mod] || []).push(c); } });
      Object.keys(porP).map(Number).sort(function (a, b) { return b - a; }).forEach(function (p) {
        var g2 = porP[p], ms = Object.keys(g2).sort(), algum = true;
        while (algum) { algum = false; ms.forEach(function (m) { var c = g2[m].shift(); if (c) { nov.push(c); algum = true; } }); }
      });
      nov = nov.slice(0, N_SES - ven.length);
      var out = [], a = ven.slice(), b = nov.slice();
      while (a.length || b.length) {
        var fonte = !b.length ? a : (!a.length ? b : (out.length % 2 ? b : a));
        var ant = out[out.length - 1], j = 0;
        while (j < fonte.length - 1 && ant && fonte[j].sub === ant.sub) j++;
        out.push(fonte.splice(j, 1)[0]);
      }
      return { ids: out.map(function (c) { return c.id; }), ven: ven.length, nov: nov.length };
    }
    function compo(p) {
      var c = function (n) { return n + (n === 1 ? ' cartão' : ' cartões'); };
      if (!p.ven) return c(p.nov) + (p.nov === 1 ? ' novo' : ' novos');
      if (!p.nov) return c(p.ven) + ' para revisar';
      return c(p.ids.length) + ': ' + p.ven + ' para revisar · ' + p.nov + (p.nov === 1 ? ' novo' : ' novos');
    }
    function nomeMod(m) { return (TEORIA[m] || {}).nome || m; }
    function nomeS(s) { return typeof nomeSub === 'function' ? nomeSub(s) : s; }

    /* ---- tela inicial dos flashcards (aba da Revisao) ---- */
    function home() {
      ses = null; cur = null; MX.s = null; poeVista('revisao');
      if (noShell) try { window.parent.postMessage({ ad: 'vista', v: 'flash' }, '*'); } catch (z) { }
      var l = lista(), r = resumo(l), p = monta(l), rt = resumo();
      var ar = filtro.area ? areaDe(filtro.area) : null, modsV = (ar ? ar.mods : MODC).filter(function (m) { return !filtro.img || CART.some(function (c) { return c.img && c.mod === m; }); });
      var rotF = (filtro.mod ? nomeMod(filtro.mod) : (ar ? ar.nome : 'Todas as áreas')) + (filtro.img ? ' · com imagem' : '');
      vRev.innerHTML = abasRev('flash') +
        '<div class="capa ad-rev-capa ad-fl-capa"><div class="ad-fl-ct"><h1>Flashcards</h1>' +
        '<p>O que os vestibulares de Medicina mais cobram, um cartão por vez. Leia a pergunta, escreva a resposta com as suas palavras e corrija: vale a ideia, não a frase exata.</p></div>' +
        '<div class="ad-fl-nums" aria-label="' + e(rotF) + '"><div><b class="num">' + r.ven + '</b><span>para revisar hoje</span></div><div><b class="num">' + r.nov + '</b><span>' + (r.nov === 1 ? 'novo' : 'novos') + '</span></div><div><b class="num">' + r.firmes + '</b><span>firmes</span></div></div>' +
        (p.ids.length ? '<div class="ad-fl-go"><button class="btn ad-comecar" id="ad-fl-comecar">' + ICO.ui.cartoes + 'Começar</button><p class="ad-mp-comp">' + compo(p) + (filtro.area || filtro.mod || filtro.img ? ' · ' + e(rotF) : '') + '</p></div>'
          : '<p class="ad-ok-rev">' + ICO.ui.check + 'Tudo em dia aqui. ' + (r.semana ? r.semana + (r.semana === 1 ? ' cartão volta' : ' cartões voltam') + ' nos próximos 7 dias.' : 'Escolha outra área ou volte amanhã.') + '</p>') +
        '</div>' +
        '<section class="ad-bloco ad-bl-fla"><div class="ad-bl-cab"><h2 class="sec">Área <small>' + rt.total + ' cartões em ' + NOME + '</small></h2>' +
        (NIMG ? '<button type="button" class="ad-fl-img" data-fimg="1" aria-pressed="' + !!filtro.img + '">' + ICO.ui.imagem + '<span>Com imagem</span><small class="num">' + NIMG + '</small></button>' : '') + '</div>' +
        '<div class="ad-ar-abas ad-fl-areas" role="group" aria-label="Filtrar por área">' +
        '<button type="button" data-fa="" aria-pressed="' + (!filtro.area) + '">' + ICO.ui.cartoes + '<span>Todas</span></button>' +
        AREASF.map(function (a) { return '<button type="button" data-fa="' + a.id + '" aria-pressed="' + (filtro.area === a.id) + '">' + icArea(a.a) + '<span>' + e(a.nome) + '</span></button>'; }).join('') + '</div></section>' +
        '<section class="ad-bloco ad-bl-flt"><h2 class="sec">Tema <small>' + (filtro.mod ? 'só ' + e(nomeMod(filtro.mod)) : 'todos' + (ar ? ' da área' : '')) + (filtro.img ? ' · com imagem' : '') + '</small></h2>' +
        '<div class="ad-lista ad-fl-mods">' +
        '<button type="button" class="ad-fl-m" data-fm="" aria-pressed="' + (!filtro.mod) + '">' + ICO.ui.camadas + '<span class="t"><b>Todos os temas' + (ar ? ' da área' : '') + '</b><small>' + l.length + ' cartões</small></span></button>' +
        modsV.map(function (m) {
          var lm = CART.filter(function (c) { return c.mod === m && (!filtro.img || c.img); }), rm = resumo(lm);
          return '<button type="button" class="ad-fl-m" data-fm="' + m + '" aria-pressed="' + (filtro.mod === m) + '">' + ICO.tema(m) + '<span class="t"><b>' + e(nomeMod(m)) + '</b>' +
            '<span class="br"><i style="width:' + (100 * rm.firmes / lm.length).toFixed(1) + '%"></i></span>' +
            '<small>' + lm.length + (lm.length === 1 ? ' cartão' : ' cartões') + (rm.ven ? ' · <em>' + rm.ven + ' para revisar</em>' : '') + (rm.nov ? ' · ' + rm.nov + (rm.nov === 1 ? ' novo' : ' novos') : '') + ' · ' + rm.firmes + (rm.firmes === 1 ? ' firme' : ' firmes') + '</small></span></button>';
        }).join('') + '</div></section>';
      var bc = g('ad-fl-comecar'); if (bc) bc.onclick = function () { comeca(p); };
      vRev.querySelectorAll('[data-fa]').forEach(function (b) { b.onclick = function () { filtro.area = b.dataset.fa; filtro.mod = ''; lsS('ad-fl-area-' + MAT, filtro.area); lsS('ad-fl-mod-' + MAT, ''); home(); var nb = vRev.querySelector('[data-fa="' + filtro.area + '"]'); if (nb) nb.focus({ preventScroll: true }); }; });
      var bi = vRev.querySelector('[data-fimg]'); if (bi) bi.onclick = function () { filtro.img = !filtro.img; lsS('ad-fl-img-' + MAT, filtro.img ? '1' : ''); if (filtro.img && filtro.mod && !CART.some(function (c) { return c.img && c.mod === filtro.mod; })) { filtro.mod = ''; lsS('ad-fl-mod-' + MAT, ''); } home(); var nb = vRev.querySelector('[data-fimg]'); if (nb) nb.focus({ preventScroll: true }); };
      vRev.querySelectorAll('[data-fm]').forEach(function (b) { b.onclick = function () { filtro.mod = filtro.mod === b.dataset.fm ? '' : b.dataset.fm; lsS('ad-fl-mod-' + MAT, filtro.mod); home(); scrollTo({ top: 0, behavior: 'smooth' }); }; });
    }

    /* ---- sessao ---- */
    function comeca(p) {
      if (!p.ids.length) return home();
      ses = { ids: p.ids.slice(), i: 0, res: {}, ordem: [], voltou: {}, t0: Date.now(), novos: {} };
      p.ids.forEach(function (id) { if (!rec(id)) ses.novos[id] = 1; });
      abreExtra(vFla, 'flash');
      mostra();
    }
    function barra() {
      if (MX.s) return MX.barra();
      var n = ses.ids.length, i = Math.min(ses.i + 1, n);
      return '<div class="ad-fl-barra"><button type="button" class="volta ad-fl-sai">' + ICO.ui.voltar + '<span>Flashcards</span></button>' +
        '<span class="t">Cartão <b class="num">' + i + '</b> de <span class="num">' + n + '</span></span>' +
        '<span class="p" aria-hidden="true"><i style="width:' + (100 * ses.i / n).toFixed(1) + '%"></i></span></div>';
    }
    function mostra() {
      var id = ses.ids[ses.i], c = CART.filter(function (x) { return x.id === id; })[0];
      if (!c) { ses.i++; return ses.i < ses.ids.length ? mostra() : fim(); }
      var x = rec(id);
      cur = { c: c, resp: '', ver: null, fase: 'pergunta', n: 0 };
      vFla.innerHTML = barra() +
        '<article class="ad-fl-card" aria-labelledby="ad-fl-frente">' +
        '<div class="ad-fl-meta">' + ICO.tema(c.sub || c.mod) + '<span class="nm"><b>' + e(nomeMod(c.mod)) + '</b>' + (c.sub ? '<span>' + e(cap(nomeS(c.sub))) + '</span>' : '') + '</span>' +
        '<span class="tgs"><span class="tg">' + e(TIPO[c.tipo] || 'Conceito') + '</span>' + (x ? (ses.voltou[id] && ses.res[id] ? '<span class="tg er">De novo</span>' : '<span class="tg rv">Revisão</span>') : '<span class="tg nv">Novo</span>') + '</span></div>' +
        '<h2 id="ad-fl-frente" class="ad-fl-frente">' + e(c.frente) + '</h2>' +
        (c.img ? '<figure class="ad-fl-fig"><button type="button" class="ad-fl-zoom" aria-label="Ampliar a imagem"><img src="' + flImgUrl(c.img) + '" alt="Imagem do cartão: ' + e(c.frente) + '" draggable="false">' +
          '<span class="lupa" aria-hidden="true">' + lu('lupa') + '</span></button>' + (c.credito && !/Ilustra/.test(FLIMG[c.img] || '') ? '<figcaption>' + e(c.credito) + '</figcaption>' : '') + '</figure>' : '') +
        '<label class="ad-fl-lab" for="ad-fl-resp">' + ICO.ui.lapis + 'Sua resposta, com as suas palavras</label>' +
        '<textarea id="ad-fl-resp" rows="3" spellcheck="true" autocomplete="off" placeholder="Escreva aqui o que você lembra"></textarea>' +
        '<div class="ad-fl-acoes"><button type="button" class="btn" id="ad-fl-corr">' + ICO.ui.check + 'Corrigir</button>' +
        '<button type="button" class="btn sec" id="ad-fl-nao">Não sei: ver a resposta</button>' +
        '<span class="ad-fl-dica">Enter corrige · Shift + Enter pula linha</span></div>' +
        '<div id="ad-fl-res" aria-live="polite"></div></article>';
      var ta = g('ad-fl-resp');
      ta.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); corrige(false); } });
      ta.addEventListener('input', function () { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight + 2, 320) + 'px'; });
      g('ad-fl-corr').onclick = function () { corrige(false); };
      var bz = vFla.querySelector('.ad-fl-zoom'); if (bz) bz.onclick = function () { ampliaImg([{ t: nomeS(c.sub) ? cap(nomeS(c.sub)) : nomeMod(c.mod), u: flImgUrl(c.img), f: c.credito || '', l: '', fit: 1 }], 0); };
      g('ad-fl-nao').onclick = function () { corrige(true); };
      vFla.querySelector('.ad-fl-sai').onclick = sair;
      scrollTo(0, 0);
      try { ta.focus({ preventScroll: true }); } catch (z) { }
    }
    function sair() { if (MX.s) return MX.pausa(); if (ses && ses.ordem.length) fim(); else { abreRevisao('flash'); } }

    /* ---- correcao ---- */
    function corrige(naoSei) {
      if (!cur || cur.fase !== 'pergunta') return;
      var ta = g('ad-fl-resp'), resp = (ta.value || '').trim();
      if (!resp && !naoSei) { ta.focus(); ta.classList.add('ad-fl-vazio'); setTimeout(function () { ta.classList.remove('ad-fl-vazio'); }, 600); return; }
      cur.resp = naoSei ? '' : resp; cur.fase = 'corrigindo';
      ta.readOnly = true; vFla.querySelector('.ad-fl-acoes').hidden = true;
      if (naoSei) return revela({ veredito: 'errado', faltou: [], comentario: 'Sem problema: leia a resposta-modelo com calma. Este cartão volta ainda hoje, para você tentar de novo.' }, 'nao');
      if (IA.disp && noShell) return pedeIA();
      revela(local(cur.c, resp), 'local');
    }
    function pedeIA() {
      var n = ++IA.n, alvo = cur; alvo.n = n;
      g('ad-fl-res').innerHTML = '<div class="ad-fl-esp" role="status"><span class="ad-fl-pulso" aria-hidden="true"></span><span>Corrigindo a sua resposta…</span>' +
        '<button type="button" class="btn sec" id="ad-fl-semia">Corrigir sem IA</button></div>';
      g('ad-fl-semia').onclick = function () { delete IA.pend[n]; try { window.parent.postMessage({ ia: 'cancel', n: n }, '*'); } catch (z) { } if (cur === alvo) revela(local(alvo.c, alvo.resp), 'local'); };
      IA.pend[n] = function (m) {
        if (cur !== alvo || alvo.fase !== 'corrigindo') return;
        if (m.ok && m.r) return revela(m.r, 'ia');
        var cod = m.erro || 'upstream_error';
        if (cod === 'rate_limited') IA.aviso = 'A correção por IA atingiu o limite de uso agora. Usei a comparação automática: confira com a resposta-modelo e marque o resultado.';
        else if (/^(not_granted|sampling_disabled|not_declared|capability_disabled|capability_removed)$/.test(cod)) { IA.disp = false; IA.aviso = 'A correção por IA não está liberada nesta página. Usei a comparação automática: confira com a resposta-modelo e marque o resultado.'; }
        else IA.aviso = 'Não consegui falar com a IA agora. Usei a comparação automática: confira com a resposta-modelo e marque o resultado.';
        revela(local(alvo.c, alvo.resp), 'local');
      };
      try { window.parent.postMessage({ ia: 'req', n: n, resp: alvo.resp.slice(0, 2000), card: { frente: alvo.c.frente, verso: alvo.c.verso, essencial: alvo.c.essencial || [], aceita: alvo.c.aceita || [], erro_comum: alvo.c.erro_comum || '' } }, '*'); }
      catch (z) { delete IA.pend[n]; revela(local(alvo.c, alvo.resp), 'local'); }
    }
    var SUG = { certo: 'a', quase: 'q', errado: 'e' };
    var ICV = { certo: ICO.ui.check, quase: ICO.ui.tema, errado: ICO.ui.xis };
    function revela(r, origem) {
      if (!cur || cur.fase === 'revelado') return;
      cur.fase = 'revelado'; cur.ver = r.veredito; cur.origem = origem;
      var c = cur.c, x = rec(c.id), v = r.veredito, sug = SUG[v] || 'e';
      var tit = { certo: 'Certo', quase: 'Quase', errado: origem === 'nao' ? 'Resposta' : 'Ainda não' }[v];
      /* auditoria 31/10: resposta com hesitacao ("acho que...", "nao lembro bem") nao recebe "Acertei" pre-selecionado */
      if (v === 'certo' && /\b(acho|talvez|chutei|chute|esqueci|n[aã]o (lembro|sei|tenho certeza))\b/i.test(cur.resp || '')) { tit = 'Parece certo'; sug = 'q'; }
      var fonte = origem === 'ia' ? 'Correção por IA' : (origem === 'local' ? 'Comparação automática, sem IA: confira você' : '');
      var faltou = (r.faltou || []).filter(function (s) { return String(s).trim(); });
      var aviso = origem === 'local' && IA.aviso ? '<p class="ad-fl-aviso">' + ICO.ui.lampada + '<span>' + e(IA.aviso) + '</span></p>' : '';
      IA.aviso = '';
      g('ad-fl-res').innerHTML = aviso +
        '<div class="ad-fl-ver ' + v + (origem === 'nao' ? ' nao' : '') + '">' +
        '<p class="cab">' + ICV[v] + '<b>' + tit + '</b>' + (fonte ? '<small>' + fonte + '</small>' : '') + '</p>' +
        (r.comentario ? '<p class="com">' + e(r.comentario) + '</p>' : '') + '</div>' +
        '<div class="ad-fl-cmp">' +
        (cur.resp ? '<div class="sua"><h5>Sua resposta</h5><p>' + e(cur.resp) + '</p></div>' : '') +
        '<div class="mod"><h5>Resposta-modelo</h5><p>' + e(c.verso) + '</p></div></div>' +
        (c.exemplo ? '<div class="ad-fl-ex"><h5>Exemplo</h5><p>' + realce(c.exemplo) + '</p></div>' : '') +
        (faltou.length && v !== 'certo' ? '<div class="ad-fl-falta"><h5>O que faltou</h5><ul>' + faltou.map(function (s) { return '<li>' + e(cap(s)) + '</li>'; }).join('') + '</ul></div>' : '') +
        (c.erro_comum && v !== 'certo' ? '<p class="ad-fl-cuid"><b>Cuidado</b>' + e(c.erro_comum) + '</p>' : '') +
        fonteCartao(c) +
        '<div class="ad-fl-nota"><p class="pq">' + (origem === 'ia' ? 'Confirme o resultado. Discorda da correção? Escolha outro.' : 'Como foi? Você decide o resultado.') + '<small class="ad-fl-tec">Teclas 1, 2 e 3 também marcam.</small></p>' +
        '<div class="ad-fl-bts" role="group" aria-label="Resultado deste cartão">' +
        [['e', 'Errei'], ['q', 'Quase'], ['a', 'Acertei']].map(function (b) {
          return '<button type="button" class="ad-fl-b ' + b[0] + (b[0] === sug ? ' sug' : '') + '" data-nota="' + b[0] + '"><b>' + b[1] + '</b><small>' + quandoV(b[0], x) + '</small></button>';
        }).join('') + '</div></div>';
      g('ad-fl-res').querySelectorAll('[data-nota]').forEach(function (b) { b.onclick = function () { nota(b.dataset.nota); }; });
      try { if (cur && !cur.cz) poeGosto(cur.c); } catch (z) { }
      var bs = g('ad-fl-res').querySelector('.ad-fl-b.sug');
      if (bs) try { bs.focus({ preventScroll: true }); } catch (z) { }
      var vb = g('ad-fl-res').querySelector('.ad-fl-ver');
      if (vb && vb.getBoundingClientRect().bottom > innerHeight) vb.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    function nota(v) {
      if (!cur || cur.fase !== 'revelado') return;
      var id = cur.c.id, sugerido = SUG[cur.ver];
      marca(id, v, cur.origem === 'ia' ? (v === sugerido ? 'ia' : 'ia-mudou') : cur.origem);
      if (MX.s) { cur.fase = 'fim'; return MX.feito(v); }
      if (!(id in ses.res)) ses.ordem.push(id);
      ses.res[id] = v; cur.fase = 'fim';
      if (v === 'e' && !ses.voltou[id]) { ses.voltou[id] = 1; ses.ids.push(id); }
      ses.i++;
      if (ses.i >= ses.ids.length) fim(); else mostra();
    }
    /* atalhos fora do campo de texto: 1 Errei, 2 Quase, 3 Acertei */
    document.addEventListener('keydown', function (ev) {
      if (vFla.hidden || !cur || cur.fase !== 'revelado' || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      var t = ev.target; if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      var v = { '1': 'e', '2': 'q', '3': 'a' }[ev.key]; if (!v) return;
      ev.preventDefault(); nota(v);
    });

    /* ---- resultado da sessao ---- */
    function fim() {
      var ids = ses.ordem, n = { a: 0, q: 0, e: 0 }, novosOk = 0, volta = { hoje: 0, amanha: 0, depois: 0 };
      ids.forEach(function (id) {
        var v = ses.res[id]; n[v]++;
        if (ses.novos[id] && v === 'a') novosOk++;
        var x = rec(id); if (!x) return;
        var d = Math.round((iniDia(x.vence) - iniDia(Date.now())) / DIA);
        if (d <= 0) volta.hoje++; else if (d === 1) volta.amanha++; else volta.depois++;
      });
      var p = monta(lista());
      cur = null; poeVista('resultado-fl');
      vFla.innerHTML = '<div class="ad-res ad-fl-fim"><p class="ad-res-tit">Flashcards · ' + e(NOME) + '</p>' +
        '<h2 class="ad-res-n"><b class="num">' + n.a + '</b> de ' + ids.length + ' certos</h2>' +
        '<div class="ad-quad">' + ids.map(function (id, i) { var v = ses.res[id]; return '<span class="q ' + (v === 'a' ? 'ok' : v === 'q' ? 'qs' : 'er') + '" title="' + e((CART.filter(function (c) { return c.id === id; })[0] || {}).frente || '') + '">' + (i + 1) + '</span>'; }).join('') + '</div>' +
        '<ul class="ad-fatos">' +
        '<li>' + ICO.ui.check + '<span><b>' + n.a + '</b> acertei · <b>' + n.q + '</b> quase · <b>' + n.e + '</b> errei</span></li>' +
        (novosOk ? '<li>' + ICO.ui.cartoes + '<span><b>' + novosOk + '</b> ' + (novosOk === 1 ? 'cartão novo aprendido' : 'cartões novos aprendidos') + '</span></li>' : '') +
        '<li>' + ICO.ui.relogio + '<span>Voltam: ' + [[volta.hoje, 'hoje'], [volta.amanha, 'amanhã'], [volta.depois, 'nos próximos dias']].filter(function (x) { return x[0]; }).map(function (x) { return '<b>' + x[0] + '</b> ' + x[1]; }).join(' · ') + '</span></li></ul>' +
        '<div class="ad-res-acoes">' + (p.ids.length ? '<button class="btn" id="ad-fl-mais">' + ICO.ui.cartoes + 'Mais ' + p.ids.length + (p.ids.length === 1 ? ' cartão' : ' cartões') + '</button>' : '') +
        '<button class="btn sec" id="ad-fl-volta">' + ICO.ui.voltar + 'Voltar aos flashcards</button></div></div>';
      var bm = g('ad-fl-mais'); if (bm) bm.onclick = function () { comeca(monta(lista())); };
      g('ad-fl-volta').onclick = function () { abreRevisao('flash'); };
      ses = null; scrollTo(0, 0);
    }

    /* ---- comparacao local tolerante (sem IA): sugere, o aluno confirma ---- */
    var STOP = {};
    ('de do da dos das o os as um uma uns umas e ou que se em no na nos nas num numa para pra por pelo pela pelos pelas com sem ao aos ' +
     'a é eh igual ser sao sua seu suas seus isso esse essa este esta ele ela eles elas lhe muito como quando onde qual quais ja tambem so entao porque pois logo ha tem').split(' ').forEach(function (w) { STOP[w] = 1; });
    var NUMS = { zero: '0', um: '1', uma: '1', dois: '2', duas: '2', tres: '3', quatro: '4', cinco: '5', seis: '6', sete: '7', oito: '8', nove: '9', dez: '10', metade: '1 2', dobro: '2' };
    /* 01/11: leitura de numeros com valor (sinal, fracao, virgula decimal, milhar, %, pi). Sem isto, "-1" valia "1",
       "1/8" casava com "3/8" e "4,2" com "2,4", porque a comparacao era por palavras soltas. */
    function nums(s) {
      var t = ' ' + String(s || '').replace(/[º°]/g, ' ').replace(/−|–/g, '-').replace(/\bmenos\s+(?=\d)/gi, '-') + ' ';
      t = t.replace(/(\d)\.(\d{3})(?!\d)/g, '$1$2').replace(/(\d),(\d)/g, '$1.$2');
      var CALC = [];   /* valores ja calculados (potencias, notacao cientifica): nao voltam a virar texto */
      /* notacao cientifica: 3 · 10²³, 3x10^23, 3.10^23, 1,5 · 10⁻³ */
      var SUPM = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
      t = t.replace(/(\d+(?:[.,]\d+)?)\s*[x×·*.]\s*10\s*(?:\^\s*(-?\d+)|([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+))/g, function (m, a, e1, e2) {
        var e = e1 != null ? e1 : e2.split('').map(function (ch) { return SUPM[ch]; }).join('');
        return ' #' + (CALC.push(parseFloat(a.replace(',', '.')) * Math.pow(10, parseInt(e, 10))) - 1) + '# '; });
      /* potencia escrita com expoente: 3³ = 27 */
      var SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
      t = t.replace(/(\d+(?:\.\d+)?)\s*(⁻?)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, function (m, a, ng, e) { var n = 0; for (var i = 0; i < e.length; i++) n = n * 10 + SUP[e[i]]; if (ng) n = -n; return ' #' + (CALC.push(Math.pow(parseFloat(a), n)) - 1) + '# '; })
           .replace(/(\d+(?:\.\d+)?)\s*\^\s*(-?\d+)/g, function (m, a, e) { return ' #' + (CALC.push(Math.pow(parseFloat(a), parseInt(e, 10))) - 1) + '# '; });
      /* raiz: 2√3 e √12 sao o mesmo numero; "2 raiz de 3" e "2raiz3" tambem */
      t = t.replace(/\s*\braiz\s*(?:quadrada\s*)?(?:de\s*)?(?=\d)/gi, '√').replace(/(\d)raiz\s*(?:de\s*)?(?=\d)/gi, '$1√');
      t = t.replace(/(\d+(?:\.\d+)?)?\s*√\s*\(?\s*(\d+(?:\.\d+)?)\s*\)?/g, function (m, a, b) { return ' ' + ((a ? parseFloat(a) : 1) * Math.sqrt(parseFloat(b))).toFixed(9) + 'R '; });
      var out = [];
      t = t.replace(/(-?)\s*#(\d+)#/g, function (m, sg, k) { out.push({ v: (sg ? -1 : 1) * CALC[+k], pc: false, pi: false, dec: 99 }); return ' '; });
      var re = /([^\w.]|[a-z)\]])(\s*)([-+]?)\s*(\d+(?:\.\d+)?)(R)?(?:\s*\/\s*(\d+(?:\.\d+)?))?(?:\s*(%|pi\b|π))?/gi, m;
      while ((m = re.exec(t))) {
        var colado = /[a-z)\]]/i.test(m[1]) && !m[2];   /* letra/parentese logo antes, sem espaco */
        if (colado && !m[3]) continue;   /* digito colado em letra (Na2SO4, CH3): indice, nao numero */
        var v = parseFloat(m[4]); if (m[6]) { var d = parseFloat(m[6]); if (!d) continue; v = v / d; }
        var bin = /[a-z)\]]/i.test(m[1]);
        if (m[3] === '-') v = -v;
        if (bin && m[3] === '+') v = Math.abs(v);
        var suf = (m[7] || '').toLowerCase();
        out.push({ v: v, pc: suf === '%', pi: suf === 'pi' || suf === 'π', dec: m[5] ? 99 : ((m[4].split('.')[1] || '').length) });
        re.lastIndex = m.index + m[0].length;
      }
      return out;
    }
    function mesmoNum(a, b) {
      if (a.pi !== b.pi) return false;
      var eq = function (x, y) { return Math.abs(x - y) <= 1e-6 * Math.max(1, Math.abs(x)); };
      var dA = a.dec == null ? 99 : a.dec, dB = b.dec == null ? 99 : b.dec;
      if (a.pc === b.pc && Math.min(dA, dB) >= 1 && Math.min(dA, dB) <= 3 && Math.max(dA, dB) >= 5) { var r = Math.min(dA, dB); if (Math.abs(a.v - b.v) <= 0.5 * Math.pow(10, -r) + 1e-9) return true; }
      if (a.pc === b.pc) return eq(a.v, b.v);
      var p = a.pc ? a : b, q = a.pc ? b : a;   /* 25% = 0,25 = 25 (quem escreveu so o numero da porcentagem) */
      return eq(p.v / 100, q.v) || eq(p.v, q.v);
    }
    function contemNums(alvo, resp) { return alvo.every(function (x) { return resp.some(function (y) { return mesmoNum(x, y); }); }); }
    function norm(s) {
      s = String(s || '').replace(/[º°]/g, ' graus ').replace(/π/g, ' pi ').replace(/√/g, ' raiz ').replace(/(^|[\s(\[])-(?=[\dπ√(])/g, '$1 menos ');
      return s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
        .replace(/≠/g, ' diferente ').replace(/≥|>=/g, ' maior igual ').replace(/≤|<=/g, ' menor igual ').replace(/>/g, ' maior ').replace(/</g, ' menor ')
        .replace(/=/g, ' igual ').replace(/−|\s-\s/g, ' menos ').replace(/[·×*]/g, ' vezes ').replace(/\+/g, ' mais ').replace(/\^/g, ' elevado ').replace(/\//g, ' sobre ').replace(/→/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ').trim();
    }
    function toks(s, guardaLetra) {
      var l = norm(s).split(' ').filter(Boolean).map(function (w) { return NUMS[w] || w; }).join(' ').split(' ');
      var f = l.filter(function (w) { return !STOP[w] || (guardaLetra && w.length === 1); });
      return f.length ? f : l.filter(Boolean);
    }
    var DF = {}, NDOC = 0;
    CART.forEach(function (c) { NDOC++; var vis = {}; toks(c.frente + ' ' + c.verso + ' ' + (c.essencial || []).join(' ')).forEach(function (w) { if (!vis[w]) { vis[w] = 1; DF[w] = (DF[w] || 0) + 1; } }); });
    function peso(w) { return Math.log(1 + NDOC / (1 + (DF[w] || 0))); }
    function lev1(a, b) {   /* distancia de edicao <= 1, so no meio da palavra (01/11: no fim e no comeco muda o sentido em quimica) */
      if (a[0] !== b[0] || a.slice(-3) !== b.slice(-3)) return false;
      if (Math.abs(a.length - b.length) > 1) return false;
      var i = 0, j = 0, dif = 0;
      while (i < a.length && j < b.length) {
        if (a[i] === b[j]) { i++; j++; continue; }
        if (++dif > 1) return false;
        if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
      }
      return dif + (a.length - i) + (b.length - j) <= 1;
    }
    var OPOSTO = /^(a|an|des|in|im|ir|i|nao)(.+)$/;
    function oposto(w, k) { var m1 = OPOSTO.exec(w), m2 = OPOSTO.exec(k); return (m1 && m1[2] === k) || (m2 && m2[2] === w); }
    function casa(w, set) {
      if (set[w]) return true;
      for (var k in set) {
        if (oposto(w, k)) continue;
        if (w.length >= 5 && k.length >= 5 && lev1(w, k)) return true;
        if (Math.min(w.length, k.length) >= 4 && Math.abs(w.length - k.length) <= 2 && (k.indexOf(w) === 0 || w.indexOf(k) === 0)) return true;   /* plural: menor/menores */
        if (w.length >= 6 && k.length >= 6) { var p = 0; while (p < w.length && w[p] === k[p]) p++; if (p >= 6 && p >= 0.8 * Math.min(w.length, k.length)) return true; }
      }
      return false;
    }
    function cobre(frase, set) {
      var guarda = /[<>=≠≥≤^\/+·×0-9]/.test(frase), t = toks(frase, guarda), tot = 0, ok = 0;
      t.forEach(function (w) { var p2 = peso(w); tot += p2; if (casa(w, set)) ok += p2; });
      return tot ? ok / tot : 0;
    }
    /* "do hipotonico para o hipertonico": com as mesmas palavras na ordem trocada, a resposta diz o contrario */
    function invertida(frase, seq) {
      var m = norm(frase).match(/\b(?:de|do|da|dos|das)\s+(.+?)\s+(?:para|pra|pro|ao|a|ate)\s+(?:o\s+|a\s+|os\s+|as\s+)?(.+)$/);
      if (!m) return false;
      var x = toks(m[1])[0], y = toks(m[2])[0]; if (!x || !y || x === y) return false;
      var px = -1, py = -1;
      seq.forEach(function (w, i) { var u = {}; u[w] = 1; if (px < 0 && casa(x, u)) px = i; if (py < 0 && casa(y, u)) py = i; });
      return px >= 0 && py >= 0 && py < px;
    }
    function local(c, resp) {
      var seq = toks(resp, true), set = {}; seq.forEach(function (w) { set[w] = 1; });
      var ess = (c.essencial && c.essencial.length ? c.essencial : [c.verso]);
      var sc = ess.map(function (x) { return cobre(x, set); });
      var contra = ess.concat(c.aceita || []).some(function (x) { return invertida(x, seq); });
      (c.aceita || []).forEach(function (a) {
        if (cobre(a, set) < 0.75) return;
        var ta = toks(a), melhor = -1, mv = 0;
        ess.forEach(function (x, i) { var tx = {}; toks(x).forEach(function (w) { tx[w] = 1; }); var o = ta.filter(function (w) { return casa(w, tx); }).length; if (o > mv) { mv = o; melhor = i; } });
        if (melhor < 0) { if (ess.length === 1) melhor = 0; else ess.some(function (x, i) { if (sc[i] < 0.7) { melhor = i; return true; } return false; }); }
        if (melhor >= 0) sc[melhor] = 1;
      });
      if (cobre(c.verso, set) >= 0.8) sc = sc.map(function () { return 1; });   /* reproduziu a resposta-modelo */
      if (contra) sc = ess.map(function (x, i) { return invertida(x, seq) || ess.length === 1 ? 0 : sc[i]; });
      var cob = sc.map(function (s) { return s >= 0.7 ? 1 : s >= 0.34 ? 0.5 : 0; });
      var media = cob.reduce(function (a, b) { return a + b; }, 0) / cob.length;
      var faltou = ess.filter(function (x, i) { return cob[i] < 1; });
      var v = contra ? 'errado' : media === 1 ? 'certo' : media >= 0.4 ? 'quase' : 'errado';
      /* 01/11: se a resposta escrita tem numero, ele precisa bater com o numero esperado (essencial ou uma forma aceita) */
      var nR = nums(resp), numErr = false;
      /* expressao com variavel (inversa, funcao): compara a expressao inteira, nao numero a numero */
      var canon = function (x) { return String(x || '').toLowerCase().replace(/[−–]/g, '-').replace(/[·×*]/g, '').replace(/\s+/g, '').replace(/^.*=/, '').replace(/,/g, '.'); };
      var expr = ess.some(function (x) { return /\d/.test(x) && /(^|[^a-z])[xy]([^a-z]|$)/i.test(x) && /[-−+\/]/.test(x); });
      if (expr && /\d/.test(resp)) {
        var cr = canon(resp.replace(/\([^()]*[a-zà-ú]{3,}[^()]*\)/gi, '')), okE = ess.concat(c.aceita || []).some(function (x) { var cx = canon(x); return cx && (cx === cr || cr.indexOf(cx) === 0); });
        if (okE) v = 'certo'; else { v = 'errado'; numErr = true; }
        nR = [];
      }
      if (nR.length) {
        var nE = nums(ess.join(' ')), alvosN = [nE].concat((c.aceita || []).map(nums).filter(function (x) { return x.length && x.length >= nE.length; })).filter(function (x) { return x.length; });
        if (alvosN.length) {
          var conhecidos = [].concat.apply(nums(c.verso), alvosN);
          var bate = alvosN.some(function (x) { return contemNums(x, nR); });
          var sobra = nR.some(function (y) { return !conhecidos.some(function (x) { return mesmoNum(x, y); }); });
          var essNum = ess.every(function (x) { return norm(x).replace(/\d+|\b(pi|raiz|graus|menos|sobre|vezes|mais|elevado|igual|x|y)\b|\s/g, '').length <= 3; });
          var soBons = nR.every(function (y) { return conhecidos.some(function (x) { return mesmoNum(x, y); }); });
          if (!bate) { if (soBons) { if (v === 'certo' || v === 'errado') v = 'quase'; } else { v = 'errado'; numErr = true; } }
          else if (sobra) { if (v === 'certo') v = 'quase'; }
          else if (essNum) v = 'certo';   /* resposta numerica com o numero certo e nenhum numero a mais */
          else if (v === 'errado') v = 'quase';
        }
      }
      var com = numErr ? 'O número da sua resposta não confere com o da resposta-modelo. Compare e decida.' : contra ? 'Parece que a sua resposta inverte o sentido (de onde para onde). Compare com a resposta-modelo e decida.'
        : v === 'certo' ? 'Sua resposta traz as ideias essenciais. Confira com a resposta-modelo e confirme.'
        : v === 'quase' ? 'Sua resposta tem parte do essencial. Compare com a resposta-modelo: se você disse o mesmo com outras palavras, marque Acertei.'
        : 'Não encontrei as ideias essenciais na sua resposta. Compare com a resposta-modelo: se você disse o mesmo com outras palavras, marque Acertei.';
      return { veredito: v, faltou: faltou, comentario: com };
    }

    /* ---- ponte da IA: a pagina principal diz se a correcao por IA existe aqui e devolve as correcoes ---- */
    addEventListener('message', function (ev) {
      var m = ev.data; if (!m || ev.source !== window.parent || !m.ia) return;
      if (m.ia === 'disp') { IA.disp = !!m.v; return; }
      if (m.ia === 'res' && IA.pend[m.n]) { var f = IA.pend[m.n]; delete IA.pend[m.n]; f(m); }
    });
    if (noShell) try { window.parent.postMessage({ ia: 'oi' }, '*'); } catch (z) { }

    /* ==========================================================================================
       TREINO GERAL (30/10): o botao principal da materia. Mistura, sobre os temas que mais caem:
       - ABC: questoes REAIS do banco (prints), escolhidas por analista em D.essencial.abc
       - Completar a frase: frases tiradas dos cartoes de teoria revisados, uma lacuna (D.essencial.completar)
       - Flashcards: os mesmos do baralho (com e sem imagem)
       Tudo grava no progresso normal: questao em S.q (tentativas), cartao e lacuna em S.flash (revisao espacada).
       ========================================================================================== */
    var MX = { s: null }, N_MX = { q: 6, f: 5, c: 4 }, NOME_K = { q: 'Questões de prova', f: 'Flashcards', c: 'Completar a frase' };
    var ESS = D.essencial && typeof D.essencial === 'object' ? D.essencial : {};
    var ABC = (ESS.abc || []).filter(function (id, i, l) { return POR[id] && l.indexOf(id) === i; });
    var CZ = (ESS.completar || []).filter(function (c) { return c && c.id && c.resp && String(c.frase || '').split('___').length === 2 && !(window.adFlGosto && window.adFlGosto(c.id) === -1); });
    function czDe(id) { return CZ.filter(function (c) { return c.id === id; })[0]; }
    function ultV(id) { var x = rec(id); return x ? x.hist[x.hist.length - 1].v : null; }
    function contaMx() {
      var q = { n: ABC.length, f: 0, ok: 0 }, f = { n: CART.length, f: 0, ok: 0 }, c = { n: CZ.length, f: 0, ok: 0 };
      ABC.forEach(function (id) { if (respondida(id)) { q.f++; var t = tentativas(id); if (t.length && t[t.length - 1].ok) q.ok++; } });
      CART.forEach(function (x) { if (rec(x.id)) { f.f++; if (ultV(x.id) === 'a') f.ok++; } });
      CZ.forEach(function (x) { if (rec(x.id)) { c.f++; if (ultV(x.id) === 'a') c.ok++; } });
      return { q: q, f: f, c: c };
    }
    /* escolhe os itens de cada tipo: o que venceu na revisao, depois o que nunca viu, depois o mais fraco/antigo */
    function escolheQ(n) {
      var agora = Date.now(), set = {}; ABC.forEach(function (id) { if (!feitaHoje(id)) set[id] = 1; });
      var ven = vencidas().filter(function (q) { return set[q.id]; }).map(function (q) { return q.id; });
      var nov = embaralha(ABC.filter(function (id) { return !respondida(id) && ven.indexOf(id) < 0; }));
      var resto = ABC.filter(function (id) { return respondida(id) && !feitaHoje(id) && ven.indexOf(id) < 0; }).sort(function (a, b) {
        var ta = tentativas(a), tb = tentativas(b), oa = ta.length && ta[ta.length - 1].ok ? 1 : 0, ob = tb.length && tb[tb.length - 1].ok ? 1 : 0;
        return (oa - ob) || (ultTs(a) - ultTs(b));
      });
      return ven.concat(nov, resto).slice(0, n);
    }
    function escolheCart(l, n, pesoDe) {
      var agora = Date.now();
      var ven = l.filter(function (c) { var x = rec(c.id); return x && x.vence <= agora; }).sort(function (a, b) { return rec(a.id).vence - rec(b.id).vence; });
      var nov = embaralha(l.filter(function (c) { return !rec(c.id); })).sort(function (a, b) { return (pesoDe(b) - pesoDe(a)); });
      var resto = l.filter(function (c) { var x = rec(c.id); return x && x.vence > agora; }).sort(function (a, b) { var x = rec(a.id), y = rec(b.id); return (x.etapa - y.etapa) || (ultTsF(x) - ultTsF(y)); });
      return ven.concat(nov, resto).slice(0, n).map(function (c) { return c.id; });
    }
    function montaMx() {
      var nq = Math.min(N_MX.q, ABC.length), nf = Math.min(N_MX.f, CART.length), nc = Math.min(N_MX.c, CZ.length);
      var falta = (N_MX.q + N_MX.f + N_MX.c) - nq - nf - nc;   /* tipo sem itens: as vagas vao para os outros */
      while (falta > 0 && (nq < ABC.length || nf < CART.length || nc < CZ.length)) {
        if (nf < CART.length) { nf++; falta--; } if (falta > 0 && nq < ABC.length) { nq++; falta--; } if (falta > 0 && nc < CZ.length) { nc++; falta--; }
      }
      var fIds = escolheCart(CART, CART.length, function (c) { return c.peso || 1; }), nImg = 0, fSel = [];
      fIds.forEach(function (id) { if (fSel.length >= nf) return; var c = CART.filter(function (x) { return x.id === id; })[0]; if (c && c.img) { if (nImg >= 2) return; nImg++; } fSel.push(id); });
      var fila = { q: escolheQ(nq).sort(function (a, b) { return ((POR[a] || {}).dif || 5) - ((POR[b] || {}).dif || 5); }), f: fSel, c: escolheCart(CZ, nc, function () { return 1; }) };
      var tot = fila.q.length + fila.f.length + fila.c.length, it = [], ant = null, feitos = { q: 0, f: 0, c: 0 }, ini = { q: fila.q.length, f: fila.f.length, c: fila.c.length };
      while (it.length < tot) {   /* intercala: sempre o tipo mais "atrasado" na proporcao, sem repetir o anterior se der */
        var cand = ['q', 'f', 'c'].filter(function (k) { return fila[k].length; });
        var semRep = cand.filter(function (k) { return k !== ant; }); if (semRep.length) cand = semRep;
        cand.sort(function (a, b) { return (feitos[a] / ini[a]) - (feitos[b] / ini[b]) || ini[b] - ini[a]; });
        var k = cand[0]; it.push({ k: k, id: fila[k].shift() }); feitos[k]++; ant = k;
      }
      return it;
    }
    /* 30/10 (pedido do dono): sair do treino geral no meio e voltar depois retoma no MESMO item, com o mesmo progresso */
    var CH_TG = 'ad-tg-sessao-' + MAT;
    MX.salva = function () { if (MX.s && MX.s.i < MX.s.it.length) lsS(CH_TG, JSON.stringify(MX.s)); };
    /* auditoria 31/10: item que deixou de existir (questao removida numa atualizacao de conteudo) sai da sessao guardada;
       antes o Treino geral travava para sempre (abrirQuestao so retornava e a sessao nunca era apagada) */
    function itemOk(x) { return x && (x.k === 'q' ? !!POR[x.id] : x.k === 'f' ? CART.some(function (c) { return c.id === x.id; }) : x.k === 'c' ? !!czDe(x.id) : false); }
    MX.guardada = function () {
      try {
        var s = JSON.parse(lsG(CH_TG) || 'null'); if (!s || !s.it || !s.it.length || !(s.i < s.it.length)) return null;
        var feitos = s.it.slice(0, s.i), resto = s.it.slice(s.i).filter(itemOk);
        if (!resto.length) { MX.limpa(); return null; }
        s.it = feitos.concat(resto); return s;
      } catch (x) { return null; }
    };
    MX.limpa = function () { try { localStorage.removeItem(CH_TG); } catch (x) { } };
    MX.pausa = function () { MX.salva(); MX.s = null; ses = null; cur = null; ctx = null; vai('inicio'); };
    MX.comeca = function () {
      var g0 = MX.guardada(); if (g0) { MX.s = g0; MX.vai(); return; }
      var it = montaMx(); if (!it.length) return;
      MX.s = { it: it, i: 0, res: [], t0: Date.now() };
      MX.vai();
    };
    MX.novo = function () { MX.limpa(); MX.comeca(); };
    MX.barra = function () {
      var s = MX.s, n = s.it.length, k = s.it[s.i].k;
      return '<div class="ad-fl-barra ad-tg-barra"><button type="button" class="volta ad-fl-sai">' + ICO.ui.voltar + '<span>Treino geral</span></button>' +
        '<span class="t"><span class="ad-tg-tipo k-' + k + '">' + NOME_K[k] + '</span> <b class="num">' + (s.i + 1) + '</b> de <span class="num">' + n + '</span></span>' +
        '<span class="p" aria-hidden="true"><i style="width:' + (100 * s.i / n).toFixed(1) + '%"></i></span></div>';
    };
    function avisaTg() { if (noShell) setTimeout(function () { try { window.parent.postMessage({ ad: 'vista', v: 'tg' }, '*'); } catch (z) { } }, 0); }   /* o menu fica em "Treino geral" a sessao toda */
    MX.vai = function () {
      var s = MX.s; if (!s) return;
      if (s.i >= s.it.length) return MX.fim();
      MX.salva();
      var x = s.it[s.i]; if (!itemOk(x)) { s.it.splice(s.i, 1); return MX.vai(); } avisaTg();
      if (x.k === 'q') {
        subAtual = null; ctx = { lista: [x.id], i: 0, mx: true };
        abrirQuestao(x.id, ctx);
        return;
      }
      abreExtra(vFla, 'flash');
      if (x.k === 'f') { ses = { ids: [x.id], i: 0, res: {}, ordem: [], voltou: {}, t0: Date.now(), novos: {} }; return mostra(); }
      mostraCz(czDe(x.id));
    };
    MX.feito = function (v) {   /* v: 'a' acertou, 'q' quase, 'e' errou */
      var s = MX.s; if (!s) return;
      s.res[s.i] = v; s.i++;
      if (s.i >= s.it.length) MX.limpa(); else MX.salva();
      ses = null; MX.vai();
    };
    /* ---- completar a frase ---- */
    function mostraCz(c) {
      if (!c) return MX.feito('e');
      var x = rec(c.id), p = String(c.frase).split('___');
      cur = { c: c, resp: '', ver: null, fase: 'pergunta', n: 0, cz: true };
      var lar = Math.max(6, Math.min(26, String(c.resp).length + 3));
      vFla.innerHTML = MX.barra() +
        '<article class="ad-fl-card ad-cz-card" aria-labelledby="ad-cz-t">' +
        '<div class="ad-fl-meta">' + ICO.tema(c.sub || c.mod) + '<span class="nm"><b>' + e(nomeMod(c.mod)) + '</b>' + (c.sub ? '<span>' + e(cap(nomeS(c.sub))) + '</span>' : '') + '</span>' +
        '<span class="tgs"><span class="tg">Completar a frase</span>' + (x ? '<span class="tg rv">Revisão</span>' : '<span class="tg nv">Novo</span>') + '</span></div>' +
        '<p id="ad-cz-t" class="ad-cz-inst">Complete a lacuna:</p>' +
        '<p class="ad-cz-frase">' + realce(p[0]) + '<input id="ad-cz-in" class="ad-cz-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Palavra que completa a frase" style="width:' + lar + 'ch">' + realce(p[1]) + '</p>' +
        '<div class="ad-fl-acoes"><button type="button" class="btn" id="ad-cz-corr">' + ICO.ui.check + 'Corrigir</button>' +
        '<button type="button" class="btn sec" id="ad-cz-nao">Não sei: ver a resposta</button>' +
        '<span class="ad-fl-dica">Enter corrige</span></div>' +
        '<div id="ad-fl-res" aria-live="polite"></div></article>';
      var inp = g('ad-cz-in');
      inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' && !ev.isComposing) { ev.preventDefault(); corrigeCz(false); } });
      g('ad-cz-corr').onclick = function () { corrigeCz(false); };
      g('ad-cz-nao').onclick = function () { corrigeCz(true); };
      vFla.querySelector('.ad-fl-sai').onclick = sair;
      scrollTo(0, 0);
      try { inp.focus({ preventScroll: true }); } catch (z) { }
    }
    function igualSimples(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.;:!?,]+$/, ''); }
    function confereCz(c, r) {
      var alvos = [c.resp].concat(c.aceita || []), nr = norm(r), sr = igualSimples(r), quase = false;
      var ok = alvos.some(function (a) {
        if (igualSimples(a) === sr) return true;
        var na = norm(a); if (!na || !nr) return false;
        if (na === nr) return true;
        var nA = nums(a), nRr = nums(r);
        if (nA.length || nRr.length) {   /* 01/11: numero so vale se o valor for o mesmo (sem tolerancia de 1 letra nem plural) */
          if (nA.length && nA.length === nRr.length && contemNums(nA, nRr)) return true;
          return false;
        }
        var pa = na.replace(/(es|s)\b/g, ''), pr = nr.replace(/(es|s)\b/g, '');
        if (pa === pr) return true;
        if (na.length >= 6 && nr.length >= 6 && Math.abs(na.length - nr.length) <= 2 && (na.indexOf(nr) === 0 || nr.indexOf(na) === 0) && !/ /.test(na + nr)) return true;   /* inverte/inverter */
        if (na.length >= 5 && !/(^| )\S( |$)/.test(na) && !/(^| )\S( |$)/.test(nr) && lev1(na, nr)) return true;   /* 01/11: nada de 1 letra de tolerancia entre variaveis (b/a x c/a) */
        if (nr.length >= 4 && ((' ' + na + ' ').indexOf(' ' + nr + ' ') >= 0 || (' ' + nr + ' ').indexOf(' ' + na + ' ') >= 0)) quase = true;
        return false;
      });
      return ok ? 'certo' : quase ? 'quase' : 'errado';
    }
    function corrigeCz(naoSei) {
      if (!cur || !cur.cz || cur.fase !== 'pergunta') return;
      var c = cur.c, inp = g('ad-cz-in'), r = (inp.value || '').trim();
      if (!r && !naoSei) { inp.focus(); inp.classList.add('ad-fl-vazio'); setTimeout(function () { inp.classList.remove('ad-fl-vazio'); }, 600); return; }
      var v = naoSei ? 'errado' : confereCz(c, r);
      cur.resp = r; cur.fase = 'revelado'; cur.ver = v; cur.origem = naoSei ? 'nao' : 'local';
      inp.readOnly = true; inp.classList.add(v === 'certo' ? 'ok' : v === 'quase' ? 'qs' : 'er');
      vFla.querySelector('.ad-fl-acoes').hidden = true;
      var p = String(c.frase).split('___'), x = rec(c.id), sug = SUG[v];
      var tit = { certo: 'Certo', quase: 'Quase', errado: naoSei ? 'Resposta' : 'Ainda não' }[v];
      g('ad-fl-res').innerHTML = '<div class="ad-fl-ver ' + v + (naoSei ? ' nao' : '') + '"><p class="cab">' + ICV[v] + '<b>' + tit + '</b>' +
        (naoSei ? '' : '<small>Comparação automática: se você escreveu o mesmo com outra forma, marque Acertei</small>') + '</p></div>' +
        '<div class="ad-fl-cmp">' + (r ? '<div class="sua"><h5>Sua resposta</h5><p>' + e(r) + '</p></div>' : '') +
        '<div class="mod"><h5>Frase completa</h5><p>' + realce(p[0]) + '<strong class="ad-dest">' + e(c.resp) + '</strong>' + realce(p[1]) + '</p>' +
        ((c.aceita || []).length ? '<p class="ad-cz-ac">Também vale: ' + c.aceita.map(e).join(' · ') + '</p>' : '') + '</div></div>' +
        (/https?:\/\//.test(c.fonte || '') ? fonteCartao(c) : (c.fonte ? '<p class="ad-cz-fonte">' + ICO.ui.livro + '<span>Tirada da teoria em cartões: ' + e(cap(nomeS(c.sub))) + '</span></p>' : '')) +
        '<div class="ad-fl-nota"><p class="pq">Como foi? Você decide o resultado.<small class="ad-fl-tec">Teclas 1, 2 e 3 também marcam.</small></p>' +
        '<div class="ad-fl-bts" role="group" aria-label="Resultado desta frase">' +
        [['e', 'Errei'], ['q', 'Quase'], ['a', 'Acertei']].map(function (b) {
          return '<button type="button" class="ad-fl-b ' + b[0] + (b[0] === sug ? ' sug' : '') + '" data-nota="' + b[0] + '"><b>' + b[1] + '</b><small>' + quandoV(b[0], x) + '</small></button>';
        }).join('') + '</div></div>';
      g('ad-fl-res').querySelectorAll('[data-nota]').forEach(function (b) { b.onclick = function () { nota(b.dataset.nota); }; });
      try { if (cur && cur.cz) poeGosto(cur.c, CZ, true); } catch (z) { }
      var bs = g('ad-fl-res').querySelector('.ad-fl-b.sug'); if (bs) try { bs.focus({ preventScroll: true }); } catch (z) { }
      var vb = g('ad-fl-res').querySelector('.ad-fl-ver'); if (vb && vb.getBoundingClientRect().bottom > innerHeight) vb.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    /* ---- questao ABC dentro do treino: o fluxo normal da questao, com o "Proximo" voltando para ca ---- */
    var _pxMx = proxima;
    proxima = function () {
      if (ctx && ctx.mx && MX.s) {
        var id = ctx.lista[0], t = tentativas(id), ok = t.length && t[t.length - 1].ok;
        ctx = null; return MX.feito(ok ? 'a' : 'e');
      }
      return _pxMx.apply(this, arguments);
    };
    var _aqMx = abrirQuestao;
    abrirQuestao = function (id, contexto) {
      var r = _aqMx.apply(this, arguments);
      if (ctx && ctx.mx && MX.s) {
        var qc = g('q-cont'); if (qc) qc.textContent = 'Treino geral · ' + (MX.s.i + 1) + ' de ' + MX.s.it.length;
        var qv = g('q-volta'); if (qv) qv.onclick = function () { clearInterval(tTimer); MX.pausa(); };
      }
      return r;
    };
    (function () {   /* rotulo do botao depois de corrigir: "Proximo" em vez de "Terminar" */
      var qc = g('q-corpo'); if (!qc || !window.MutationObserver) return;
      new MutationObserver(function () {
        if (!(ctx && ctx.mx && MX.s)) return;
        var b = g('b-prox'); if (!b || b.dataset.mx) return;
        b.dataset.mx = '1'; b.textContent = MX.s.i < MX.s.it.length - 1 ? 'Próximo item' : 'Ver o resultado';
      }).observe(qc, { childList: true, subtree: true });
    })();
    MX.fim = function () {
      var s = MX.s; if (!s) return vai('inicio');
      MX.limpa(); MX.s = null; ses = null; cur = null; ctx = null;
      var feitos = s.res.map(function (v, i) { return { k: s.it[i].k, id: s.it[i].id, v: v }; }).filter(function (x) { return x.v; });
      if (!feitos.length) { vai('inicio'); return; }
      abreExtra(vFla, 'flash'); poeVista('resultado-fl'); avisaTg();
      var por = { q: [0, 0], f: [0, 0], c: [0, 0] }, ac = 0;
      feitos.forEach(function (x) { por[x.k][1]++; if (x.v === 'a') { por[x.k][0]++; ac++; } });
      var seg = Math.round((Date.now() - s.t0) / 1000);
      vFla.innerHTML = '<div class="ad-res ad-fl-fim"><p class="ad-res-tit">Treino geral · ' + e(NOME) + '</p>' +
        '<h2 class="ad-res-n' + (ac / feitos.length < .5 ? ' baixo' : '') + '"><b class="num">' + ac + '</b> de ' + feitos.length + ' certos</h2>' +
        '<p class="ad-res-leg"><span class="q ok"></span>acertou <span class="q qs"></span>quase <span class="q er"></span>errou · o que você errou volta na revisão; faça mais uma rodada para fixar.</p>' +
        '<div class="ad-quad">' + feitos.map(function (x, i) { return '<span class="q ' + (x.v === 'a' ? 'ok' : x.v === 'q' ? 'qs' : 'er') + '" title="' + NOME_K[x.k] + '">' + (i + 1) + '</span>'; }).join('') + '</div>' +
        '<ul class="ad-fatos">' + ['q', 'c', 'f'].filter(function (k) { return por[k][1]; }).map(function (k) {
          return '<li>' + (k === 'q' ? ICO.ui.questoes : k === 'f' ? ICO.ui.cartoes : ICO.ui.lapis) + '<span>' + NOME_K[k] + ': <b>' + por[k][0] + '</b> de ' + por[k][1] + '</span></li>';
        }).join('') +
        '<li>' + ICO.ui.relogio + '<span>Tempo: ' + Math.floor(seg / 60) + ' min ' + (seg % 60) + ' s · os erros voltam na revisão espaçada</span></li></ul>' +
        '<div class="ad-res-acoes"><button class="btn" id="ad-tg-mais">' + ICO.ui.alvo + 'Mais um treino geral</button>' +
        '<button class="btn sec" id="ad-tg-volta">' + ICO.ui.voltar + 'Voltar ao início</button></div></div>';
      g('ad-tg-mais').onclick = function () { MX.comeca(); };
      g('ad-tg-volta').onclick = function () { vai('inicio'); };
      scrollTo(0, 0);
    };
    /* ---- capa do inicio da materia: numeros de cada tipo, composicao da rodada e colagem dos temas ---- */
    MX.tem = function () { return !!(ABC.length || CZ.length); };
    MX.chips = function () {
      var n = contaMx(), col = function (k, rot, x) {
        return '<span class="ad-tg-n k-' + k + '"><i>' + rot + '</i><b class="num">' + x.f + '<small> de ' + x.n + '</small></b>' +
          '<span class="br" aria-hidden="true"><i style="width:' + (x.n ? (100 * x.f / x.n).toFixed(1) : 0) + '%"></i></span>' +
          '<small>' + (x.f ? x.ok + (x.ok === 1 ? ' acerto' : ' acertos') : '&nbsp;') + '</small></span>';
      };
      return col('q', 'Questões<span class="lg"> de prova</span>', n.q) + col('c', 'Completar<span class="lg"> a frase</span>', n.c) + col('f', 'Flashcards', n.f);
    };
    MX.compo = function () {
      var nq = Math.min(N_MX.q, ABC.length), nc = Math.min(N_MX.c, CZ.length), nf = Math.min(N_MX.f, CART.length);
      return (nq + nc + nf) + ' itens por rodada: ' + nq + ' questões, ' + nc + ' frases e ' + nf + ' flashcards';
    };
    /* colagem: os desenhos dos temas da materia espalhados, para dizer "varias coisas ao mesmo tempo" */
    MX.colagem = function () {
      /* 30/10 (3a rodada): os temas viram adesivos redondos que SAEM DO CENTRO EM ESPIRAL (angulo de ouro) e ficam
         flutuando de leve; no meio, o desenho principal da materia. Sem sombras soltas umas sobre as outras. */
      /* 30/10 (3a versao, pedido do dono): ESPALHADOS, sem disco branco nem moldura; tamanhos e giros diferentes, como
         objetos jogados na mesa. Cada um sai do centro e gira em espiral ate o seu lugar. */
      var ms = MODLIST.slice(0, 8), out = '';
      var POS = [[20, 26, 31, -9], [55, 14, 23, 7], [86, 30, 24, 11], [43, 55, 35, -4], [78, 66, 27, -12], [13, 72, 23, 8], [91, 90, 19, -7], [52, 90, 20, 13]];
      ms.forEach(function (m, i) {
        var p = POS[i]; if (!p) return;
        var ang = Math.atan2(p[1] - 50, p[0] - 50) - 2.2, mx = 50 + 18 * Math.cos(ang), my = 50 + 18 * Math.sin(ang);
        out += '<span class="ad-tg-ad" style="--x:' + p[0] + '%;--y:' + p[1] + '%;--mx:' + mx.toFixed(1) + '%;--my:' + my.toFixed(1) + '%;--t:' + p[2] + '%;--d:' + (80 + i * 70) + 'ms;--r:' + p[3] + 'deg" title="' + e(TEORIA[m].nome) + '"><i>' + ICO.tema(m) + '</i></span>';
      });
      return out;
    };
    API.tg = MX;

    API.home = home; API.resumo = function () { return resumo(); }; API.local = local;
    window.adFlashcards = API;   /* so leitura: contas e comparacao local (conferencia) */
    return API;
  })();
  /* o inicio pode ter sido pintado antes do bloco acima existir: repinta para o botao do Treino geral aparecer */
  try { if (g('v-inicio') && !g('v-inicio').hidden) pintaInicio(); } catch (z) { }

  /* ---------- 30/10 (painel de design): correcao de professor. Acertou: um circulo a mao em volta da letra certa
     (caneta da materia). Errou: um risco vermelho corta a letra marcada e, logo depois, a certa ganha o circulo. Sem tremor. ---------- */
  (function () {
    var CIRC = 'M10 30 C6 12 30 4 48 8 C64 12 66 34 50 42 C34 50 12 46 9 30 C8 24 12 18 18 14', RISCO = 'M8 40 Q30 22 56 10';
    function marca(b, tipo, atraso) {
      if (!b || b.querySelector('.ad-corr')) return;
      var sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); sv.setAttribute('class', 'ad-corr ' + tipo); sv.setAttribute('viewBox', '0 0 64 50'); sv.setAttribute('preserveAspectRatio', 'none'); sv.setAttribute('aria-hidden', 'true');
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', tipo === 'ok' ? CIRC : RISCO); sv.appendChild(p); b.appendChild(sv);
      if (reduz || !p.animate) return;
      var L = p.getTotalLength(); p.style.strokeDasharray = L + ' ' + (L + 2);
      p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: tipo === 'ok' ? 380 : 220, delay: atraso || 0, easing: tipo === 'ok' ? 'cubic-bezier(.35,.05,.45,1)' : 'ease-in', fill: 'both' });
    }
    new MutationObserver(function () {
      var bol = g('bolhas'); if (!bol) return;
      var er = bol.querySelector('.bolha.errado'), ok = bol.querySelector('.bolha.certo');
      if (er) marca(er, 'x', 0);
      if (ok) marca(ok, 'ok', er && !ok.querySelector('.ad-corr') ? 300 : 0);
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'], childList: true });
  })();
  /* ---------- 30/10 (painel/banca): questoes duplicadas sairam do banco; o progresso da copia apagada passa para a que ficou ---------- */
  (function () {
    var AL = D.alias || {}; if (!Object.keys(AL).length) return;
    function junta() {
      var mudou = false; if (!S || !S.q) return;
      Object.keys(AL).forEach(function (o) {
        var x = S.q[o]; if (!x) return; var n = AL[o], y = S.q[n] || (S.q[n] = { tent: [], rev: false }), ts = {};
        (y.tent || []).forEach(function (t) { ts[t.ts] = 1; });
        (x.tent || []).forEach(function (t) { if (!ts[t.ts]) y.tent.push(t); });
        y.tent.sort(function (a, b) { return a.ts - b.ts; }); y.rev = y.rev || x.rev; delete S.q[o]; mudou = true;
      });
      if (mudou) try { salva(); } catch (z) { }
    }
    junta(); setTimeout(junta, 4000); setTimeout(junta, 15000);
  })();
  /* simulado: sem repetidas e em ordem sorteada (a prova real nao vem do mais facil ao mais dificil) */
  if (typeof iniciaSimulado === 'function') {
    iniciaSimulado = function (s) {
      var vistos = {}, pool = s.f().filter(function (q) { var k = (q.escola || '') + '|' + String(q.ano || '') + '|' + (q.fase || '') + '|' + (q.n || q.id); if (vistos[k]) return false; vistos[k] = 1; return true; });
      var lista = embaralha(pool.slice()).slice(0, s.n).map(function (q) { return q.id; });
      if (!lista.length) return;
      ctx = { lista: lista, i: 0, sim: s, t0: Date.now(), respostas: {} };
      abrirQuestao(lista[0], ctx);
    };
  }
  /* ---------- comandos da pagina principal ---------- */
  addEventListener('message', function (ev) {
    var c = ev.data; if (!c || ev.source !== window.parent) return;
    if (c.ad === 'tema') return temaAd();
    if (c.ad === 'foco') return poeFoco(c.v);
    if (c.ad === 'visivel') {   /* auditoria 31/10: materia escondida na casca (iframe display:none nao muda document.hidden) */
      window.__adOculto = !c.v;
      try {
        var naQ = !g('v-questao').hidden;
        if (!c.v && naQ && !tPausado) { alternaPausa(); window.__adAutoPausa = true; }
        else if (c.v && window.__adAutoPausa) { window.__adAutoPausa = false; if (tPausado) alternaPausa(); }
      } catch (z) { }
      return;
    }
    if (c.ad !== 'ir') return;
    if (c.v !== 'tg') try { if (typeof FL !== 'undefined' && FL && FL.tg) FL.tg.s = null; } catch (z) { }
    var em = !g('v-questao').hidden;
    if (em && ['inicio', 'estudar', 'simulado', 'progresso', 'dados', 'revisao', 'flash', 'sub', 'mod', 'area'].indexOf(c.v) >= 0) clearInterval(tTimer);
    switch (c.v) {
      case 'inicio': case 'estudar': case 'simulado': case 'progresso': vai(c.v); break;
      case 'dados': vai('progresso'); setTimeout(function () { var x = g('b-export'); var dz = x && x.closest('details'); if (dz) dz.open = true; if (x) x.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 60); break;
      case 'revisao': abreRevisao(); break;
      case 'flash': if (c.mod && window.adFlFiltroMod) window.adFlFiltroMod(c.mod); abreRevisao('flash'); break;
      case 'treino': iniciaTreino(); break;
      case 'tg': vai('inicio'); if (typeof FL !== 'undefined' && FL.tg && FL.tg.tem()) FL.tg.comeca(); break;
      case 'continuar': if (c.id && POR[c.id]) { abrirQuestao(c.id, null); break; } var bc = g('b-continuar'); if (bc) bc.click(); break;   /* 01/11: o cartao da tela inicial diz qual degrau abre, e abre exatamente esse */
      case 'sub': if (SUBS[c.sub]) abrirSub(c.sub); break;
      case 'mod': abreModulo(c.mod); break;
      case 'area': vai('inicio'); escolheArea(c.id, true); break;
      case 'sim':
        var s = SIMS.filter(function (x) { return x.id === c.id; })[0] || SIMS[0];
        if (s.f().length) iniciaSimulado(s); else vai('simulado'); break;
    }
  });
  /* ---------- resolucao animada: o passo a passo "acontece" na frente do aluno ----------
     Cada passo entra por vez; a conta e escrita trecho a trecho (= , →) como num caderno,
     a explicacao aparece depois. Controles: pausar, voltar, avancar, velocidade, ver tudo. */
  var ANIM = { tok: 0, vel: 1 };
  try { ANIM.vel = +localStorage.getItem('ad-vel') || 1; } catch (x) { }
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function escH(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  /* rodada 6: em conta de uma linha com numero, o resultado (o trecho depois do ultimo =, → ou ≈) vem marcado */
  function fatia(conta, realca) {
    var lns = conta.split('\n');
    return lns.map(function (ln, li) {
      var partes = ln.split(/(?=\s(?:=|→|⇒|≈|≅|∴|⟹)\s)/);
      return '<span class="ad-ln">' + partes.map(function (s, k) {
        var h = sobrescrito(escH(s));
        if (realca && li === lns.length - 1 && k === partes.length - 1 && k > 0 && /^\s(?:=|→|≈)\s/.test(s)) {
          var m = /^(\s\S+\s)([\s\S]*)$/.exec(s);
          if (m && m[2].trim() && m[2].trim().length <= 36) h = sobrescrito(escH(m[1])) + '<mark class="ad-fim">' + sobrescrito(escH(m[2])) + '</mark>';
        }
        return '<span class="ad-tr">' + h + '</span>';
      }).join('') + '</span>';
    }).join('');
  }
  /* 30/10 (pedido do dono: mais fluida, nao so mais rapida): a escrita e' revelada continuamente (clip-path com easing suave,
     via Web Animations, em vez do steps(24) de maquina de escrever), cada trecho comeca quando o anterior esta em ~75%,
     um realce suave ("caneta") acompanha a ponta da escrita, e as pausas sao curtas e proporcionais ao texto.
     Ritmo base 1,2x mais rapido que antes (BASE); o botao de velocidade continua multiplicando por cima (0,75x a 2x). */
  var BASE = 1.2, SUAVE = 'cubic-bezier(.4,0,.2,1)';
  ANIM.vivas = [];
  function espera(ms, tok) { return new Promise(function (ok) { setTimeout(function () { ok(tok === ANIM.tok); }, ms / (ANIM.vel * BASE)); }); }
  function paraVivas() {
    ANIM.vivas.forEach(function (a) { try { a.cancel(); } catch (x) { } }); ANIM.vivas = [];
    document.querySelectorAll('.ad-caneta').forEach(function (c) { c.remove(); });
    document.querySelectorAll('.ad-tr.ad-escreve').forEach(function (t) { restaura(t); t.classList.remove('ad-escreve'); t.classList.add('ad-feito'); });
  }
  /* 30/10 (2a rodada, video do dono): escrita de verdade, letra por letra, com a ponta da caneta andando sobre o texto
     (quebra de linha incluida: a caneta desce para a linha seguinte), sem blocos nem faixa amarela durante a escrita.
     Depois que o passo esta escrito, o marca-texto passa por cima, tambem da esquerda para a direita, linha a linha.
     As letras viram <span> so durante a animacao; no fim o HTML original volta (dicionario e selecao continuam funcionando). */
  var ORIG = new WeakMap();
  function restaura(tr) { if (ORIG.has(tr)) { tr.innerHTML = ORIG.get(tr); ORIG.delete(tr); } }
  function letras(tr) {
    ORIG.set(tr, tr.innerHTML);
    var w = document.createTreeWalker(tr, NodeFilter.SHOW_TEXT), nos = [], n, out = [];
    while ((n = w.nextNode())) nos.push(n);
    nos.forEach(function (t) {
      var f = document.createDocumentFragment();
      Array.from(t.nodeValue).forEach(function (ch) { var sp = document.createElement('span'); sp.className = 'ad-ch'; sp.textContent = ch; f.appendChild(sp); out.push(sp); });
      t.parentNode.replaceChild(f, t);
    });
    return out;
  }
  function durTrecho(len) { return Math.max(380, Math.min(3400, 90 + len * 30)); }
  /* 30/10 (3a rodada: "como se fosse escrita a mao, nao digitada"): a tinta corre da esquerda para a direita em velocidade
     de caneta, cortando a letra ao meio enquanto ela e' tracada (cada letra e' revelada por um recorte que anda na largura dela,
     e a letra seguinte comeca exatamente quando a anterior termina: o traco e' continuo). Pausinha entre palavras (a caneta
     levanta), a ponta acompanha o traco e desce de linha. Nada de letra surgindo inteira de uma vez. */
  function escreveTrecho(tr, ms) {
    restaura(tr);
    tr.classList.remove('ad-feito'); tr.classList.add('ad-escreve');
    if (!tr.animate) { tr.classList.add('ad-feito'); tr.classList.remove('ad-escreve'); return; }
    var chs = letras(tr), n = chs.length; if (!n) { tr.classList.add('ad-feito'); return; }
    var conta = tr.closest('.conta'), rc = conta ? conta.getBoundingClientRect() : { left: 0, top: 0 };
    var rs = chs.map(function (sp) { return sp.getBoundingClientRect(); });
    var larg = rs.reduce(function (t, r) { return t + Math.max(r.width, 0); }, 0) || 1;
    var PAUSA = 55, nesp = chs.filter(function (sp) { return /\s/.test(sp.textContent); }).length;
    var tinta = Math.max(ms - nesp * PAUSA, ms * .6), v = larg / tinta, t = 0, kf = [], prev = null;
    chs.forEach(function (sp, i) {
      var r = rs[i], d = Math.max(r.width, 0) / v, esp = /\s/.test(sp.textContent);
      if (!esp && d > 0) {
        var a = sp.animate([{ clipPath: 'inset(-.45em calc(100% + .2em) -.45em -.1em)' }, { clipPath: 'inset(-.45em -.1em -.45em -.1em)' }],
          { duration: d, delay: t, easing: 'linear', fill: 'both' });
        ANIM.vivas.push(a);
      }
      if (conta && r.width) {
        var x0 = r.left - rc.left + conta.scrollLeft, y = r.top - rc.top + conta.scrollTop, x1 = x0 + r.width;
        if (prev && Math.abs(prev.y - y) > 4) kf.push({ t: t, x: x0 - 2, y: y, h: r.height });   /* desce de linha */
        kf.push({ t: t, x: x0, y: y, h: r.height }); kf.push({ t: t + d, x: x1, y: y, h: r.height });
        prev = { y: y };
      }
      t += d + (esp ? PAUSA : 0);
    });
    var tot = t;
    var fimT = setTimeout(function () { if (tr.classList.contains('ad-escreve')) { tr.classList.add('ad-feito'); tr.classList.remove('ad-escreve'); restaura(tr); } }, tot + 40);
    ANIM.vivas.push({ cancel: function () { clearTimeout(fimT); } });
    if (!conta || kf.length < 2) return;
    var cn = document.createElement('span'); cn.className = 'ad-caneta'; cn.setAttribute('aria-hidden', 'true');
    cn.style.height = Math.round(kf[0].h * 0.95) + 'px'; conta.appendChild(cn);
    var fr = kf.map(function (k, i) {
      var bob = (i % 2 ? -1 : 1) * 0.8;   /* leve sobe-desce da mao */
      return { transform: 'translate(' + k.x.toFixed(1) + 'px,' + (k.y + bob).toFixed(1) + 'px) rotate(18deg)', offset: Math.min(1, k.t / tot) };
    });
    for (var j = 1; j < fr.length; j++) if (fr[j].offset < fr[j - 1].offset) fr[j].offset = fr[j - 1].offset;
    fr[0].offset = 0; fr[fr.length - 1].offset = 1;
    var m = cn.animate(fr, { duration: tot, easing: 'linear', fill: 'both' });
    var o = cn.animate([{ opacity: 0 }, { opacity: .9, offset: .04 }, { opacity: .9, offset: .96 }, { opacity: 0 }], { duration: tot + 150, fill: 'forwards' });
    ANIM.vivas.push(m, o);
    o.onfinish = function () { cn.remove(); };
    return tot;
  }
  /* marca-texto: o que o passo tem de essencial (o resultado marcado; sem ele, a frase do caderno inteira) */
  function alvosMT(ps) {
    var f = ps.querySelectorAll('.conta mark.ad-fim'); if (f.length) return [].slice.call(f);
    return [].slice.call(ps.querySelectorAll('.conta:not(.bloco) .ad-tr'));
  }
  function passaMT(el, ms) {
    el.classList.add('ad-mt');
    if (!el.animate) { el.classList.add('ad-mt-ok'); return; }
    var a = el.animate([{ backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }], { duration: ms, easing: 'cubic-bezier(.45,.05,.4,1)', fill: 'forwards' });
    ANIM.vivas.push(a);
    a.onfinish = function () { el.classList.add('ad-mt-ok'); a.cancel(); };
  }
  /* ==========================================================================================
     TERMOS TROCANDO DE LADO (30/10, pedido do dono): quando um passo diz que algo "passa para o outro lado" (ou a conta
     tem "A → B" com duas igualdades), um quadrinho animado mostra a equacao de antes e cada termo VIAJANDO para o lugar
     novo; o sinal (ou o × / ÷) que vai junto troca no meio do caminho. Os termos que ficam escorregam para a posicao nova.
     ========================================================================================== */
  var RE_TOK = /\d{1,3}(?: \d{3})+(?:,\d+)?[a-zA-Zα-ωΔπ]*|\d+(?:,\d+)?[a-zA-Zα-ωΔπ]+[₀-₉²³]*|\d+(?:,\d+)?|[a-zA-Zα-ωΔπ√][a-zA-Zα-ωΔπ₀-₉ₐ-ₜ₊₋²³']*|[=+\-−×÷·\/()^²³<>≤≥]|\S/g;
  var OPS = /^[+\-−×÷·\/]$/;
  /* coeficiente colado na letra (7a, 3x²) vira dois tokens: o numero pode viajar sozinho (7a = 224 -> a = 224 ÷ 7);
     o '·' marca o par colado para desenhar sem espaco */
  function toks(eq) {
    var out = [];
    (String(eq).match(RE_TOK) || []).forEach(function (t) {
      if (t === '-') t = '−';
      var m = /^(\d+(?:,\d+)?)([a-zA-Zα-ωΔπ][\s\S]*)$/.exec(t);
      if (m) { out.push(m[1]); out.push('\u2060' + m[2]); } else out.push(t);
    });
    return out;
  }
  function limpa(t) { return String(t).replace(/^\u2060/, ''); }
  function lados(ts) { var i = ts.indexOf('='); return ts.map(function (t, k) { return k < i ? 0 : k > i ? 1 : -1; }); }
  function casaToks(A, B) {   /* B[j] -> indice em A (termos iguais), preferindo o mesmo lado e a ordem */
    var la = lados(A), lb = lados(B), usado = {}, m = {};
    B.forEach(function (t, j) {
      if (OPS.test(t) || t === '=' || /^[()]$/.test(t)) return;
      var cand = A.map(function (x, i) { return i; }).filter(function (i) { return A[i] === t && !usado[i]; });
      if (!cand.length) return;
      cand.sort(function (x, y) { return ((la[x] !== lb[j]) - (la[y] !== lb[j])) || Math.abs(x - j) - Math.abs(y - j); });
      usado[cand[0]] = 1; m[j] = cand[0];
    });
    var eqA = A.indexOf('='), eqB = B.indexOf('='); if (eqA >= 0 && eqB >= 0) m[eqB] = eqA;
    return m;
  }
  function trocaLado(a, b) {
    if (String(a).split('=').length !== 2 || String(b).split('=').length !== 2) return null;
    var A = toks(a), B = toks(b); if (A.length > 26 || B.length > 26) return null;
    var m = casaToks(A, B), la = lados(A), lb = lados(B), mov = [];
    /* troca de lado de verdade: os mesmos termos antes e depois (so muda lado/sinal); um 0 pode nascer ou sumir.
       Substituicao, distributiva ou conta feita no caminho (termo novo) nao entra. */
    var opnd = function (t) { return !(OPS.test(t) || t === '=' || /^[()\[\]{};:,]$/.test(t)); };
    var usadosA = {}; Object.keys(m).forEach(function (j) { usadosA[m[j]] = 1; });
    if (B.some(function (t, j) { return opnd(t) && m[j] == null && t !== '0'; })) return null;
    if (A.some(function (t, i) { return opnd(t) && !usadosA[i] && t !== '0'; })) return null;
    Object.keys(m).forEach(function (j) {
      j = +j; var i = m[j]; if (!(lb[j] >= 0 && la[i] >= 0 && la[i] !== lb[j])) return;
      /* so conta como "passou para o outro lado" se chega com sinal/operacao escrita (+2p, −50, ÷ 7), ou se era −x e virou
         o primeiro termo positivo de um lado com mais termos; um numero que so' coincide (x + 2 = 4 -> x = 2) nao entra */
      var opB = j > 0 && OPS.test(B[j - 1]), opA = i > 0 && OPS.test(A[i - 1]) ? A[i - 1] : '';
      var iniB = j === 0 || B[j - 1] === '=', ladoB = B.filter(function (x, k) { return lb[k] === lb[j] && !OPS.test(x); }).length;
      if (opB || (opA === '−' && iniB && ladoB > 1)) mov.push(j);
    });
    /* a letra colada no coeficiente viaja junto (e fica da mesma cor) */
    B.forEach(function (t, j) { if (/^\u2060/.test(t) && mov.indexOf(j - 1) >= 0 && m[j] != null && mov.indexOf(j) < 0) mov.push(j); });
    return mov.length ? { A: A, B: B, m: m, mov: mov } : null;
  }
  window.adTrocaLado = function (a, b) { var r = trocaLado(a, b); return r && { A: r.A.map(limpa), B: r.B.map(limpa), mov: r.mov.map(function (j) { return limpa(r.B[j]); }) }; };
  function segsEq(conta) { return String(conta || '').split(/\n|→|⇒/).map(function (x) { return x.trim(); }).filter(function (x) { return /=/.test(x); }); }
  var RE_PASSA = /passa(m)? para (o outro lado|a esquerda|a direita|o lado)|troca(m)? de lado|muda(m)? de lado|vai para o outro lado|atravessa/i;
  var RE_MEXE = /passa|vira|outro lado|isol|troca|muda de lado|atravess|leva|transp/i;
  function parDoPasso(ps, ant) {
    var c = ps.querySelector('.conta'); if (!c) return null;
    var sg = segsEq(c.textContent), txt = ps.textContent || '';
    if (!RE_MEXE.test(txt)) return null;   /* o proprio passo tem de falar em mover/isolar */
    for (var k = 0; k + 1 < sg.length; k++) { var r = trocaLado(sg[k], sg[k + 1]); if (r) return r; }
    if (ant && sg.length && RE_PASSA.test(txt)) { var sa = segsEq((ant.querySelector('.conta') || {}).textContent); if (sa.length) return trocaLado(sa[sa.length - 1], sg[0]); }
    return null;
  }
  function linhaToks(ts, cls) {
    return '<span class="ad-mv-l ' + cls + '">' + ts.map(function (t, i) { return '<span class="ad-mv-t' + (OPS.test(t) ? ' op' : '') + (/^\u2060/.test(t) ? ' cola' : '') + '" data-i="' + i + '">' + hwMini(limpa(t)) + '</span>'; }).join('') + '</span>';
  }
  function montaMov(ps, par) {
    var bx = document.createElement('div'); bx.className = 'ad-mov'; bx.setAttribute('aria-label', 'Animação: ' + par.A.join(' ') + ' vira ' + par.B.join(' '));
    bx.innerHTML = '<div class="ad-mv-palco">' + linhaToks(par.A, 'a') + linhaToks(par.B, 'b') + '</div>';
    bx.__par = par;
    var c = ps.querySelector('.conta'); c.parentNode.insertBefore(bx, c);
    return bx;
  }
  function vizinhoOp(T, i, antes) { var k = antes ? i - 1 : i + 1; return k >= 0 && k < T.length && OPS.test(T[k]) ? k : -1; }
  /* toca o movimento; devolve quando termina (ou na hora, sem animacao) */
  function tocaMov(bx, tok) {
    var par = bx.__par, pal = bx.querySelector('.ad-mv-palco'), la = pal.querySelector('.ad-mv-l.a'), lb = pal.querySelector('.ad-mv-l.b');
    (bx.__vivas || []).forEach(function (x) { try { x.cancel(); } catch (z) { } }); bx.__vivas = [];
    var ta = la.children, tb = lb.children;
    [].forEach.call(tb, function (x) { x.innerHTML = hwMini(limpa(par.B[+x.dataset.i])); x.classList.remove('mv', 'pop'); });
    if (reduz || !bx.animate) { bx.classList.add('fim'); return Promise.resolve(true); }
    bx.classList.remove('fim'); bx.classList.add('rodando');
    var vel = ANIM.vel * BASE, T0 = 700 / vel, DUR = 1500 / vel, pr = pal.getBoundingClientRect();
    var ra = [].map.call(ta, function (x) { return x.getBoundingClientRect(); }), rb = [].map.call(tb, function (x) { return x.getBoundingClientRect(); });
    var origem = {};   /* indice em B -> indice em A de onde sai */
    Object.keys(par.m).forEach(function (j) { origem[j] = par.m[j]; });
    var movidos = {}; par.mov.forEach(function (j) { movidos[j] = 1; });
    /* o sinal/operador que acompanha o termo que muda de lado */
    var sinal = {};
    par.mov.forEach(function (j) {
      var ob = vizinhoOp(par.B, j, true), ia = par.m[j], oa = vizinhoOp(par.A, ia, true); if (oa < 0) oa = vizinhoOp(par.A, ia, false);
      var impl = (ia + 1 < par.A.length && /^\u2060/.test(par.A[ia + 1])) || /^[×÷·\/]$/.test(par.B[ob] || '') ? '×' : '+';
      if (ob >= 0 && origem[ob] == null) { origem[ob] = oa >= 0 ? oa : null; sinal[ob] = { de: oa >= 0 ? par.A[oa] : impl, para: par.B[ob], j: j }; }
    });
    var vivas = bx.__vivas;
    /* a linha de antes aparece; os que vao mudar de lado ganham cor */
    la.style.opacity = 1; lb.style.opacity = 1;
    [].forEach.call(ta, function (x) { x.style.opacity = 1; x.classList.toggle('vai', par.mov.some(function (j) { return par.m[j] === +x.dataset.i; })); });
    [].forEach.call(tb, function (x) { x.style.opacity = 0; });
    [].forEach.call(tb, function (x) {
      var j = +x.dataset.i, o = origem[j], r1 = rb[j];
      if (o == null || o === undefined) {   /* nao veio de lugar nenhum: aparece no fim */
        if (sinal[j]) { /* sinal que nasce (antes nao havia sinal escrito: era +) */
          var rj = ra[par.m[sinal[j].j]];
          var dx0 = rj.left - 14 - r1.left, dy0 = rj.top - r1.top;
          x.innerHTML = hwMini(sinal[j].de); x.classList.add('mv');
          vivas.push(x.animate([{ opacity: 0, transform: 'translate(' + dx0 + 'px,' + dy0 + 'px)' }, { opacity: 1, offset: .15, transform: 'translate(' + dx0 + 'px,' + dy0 + 'px)' },
            { opacity: 1, transform: 'translate(' + (dx0 / 2) + 'px,' + (dy0 / 2 - 34) + 'px)', offset: .55 }, { opacity: 1, transform: 'none' }], { duration: DUR, delay: T0, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'both' }));
          (function (x, txt) { var t = setTimeout(function () { x.innerHTML = hwMini(txt); x.classList.add('pop'); }, T0 + DUR * .5); vivas.push({ cancel: function () { clearTimeout(t); } }); })(x, sinal[j].para);
        } else vivas.push(x.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380 / vel, delay: T0 + DUR * .75, fill: 'both' }));
        return;
      }
      var r0 = ra[o], dx = r0.left - r1.left, dy = r0.top - r1.top, vai = movidos[j] || sinal[j];
      if (vai) x.classList.add('mv');
      /* 30/10: todo termo passa POR CIMA do "=" em arco (o "=" e' a ancora), um de cada vez (250 ms entre eles) */
      var ordem = vai ? Math.max(0, par.mov.indexOf(sinal[j] ? sinal[j].j : j)) : 0, alto = -(30 + ordem * 14);
      var kf = vai ? [{ opacity: 1, transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { opacity: 1, transform: 'translate(' + (dx * .5) + 'px,' + (dy * .5 + alto) + 'px)', offset: .5 }, { opacity: 1, transform: 'none' }]
        : [{ opacity: 1, transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { opacity: 1, transform: 'none' }];
      vivas.push(x.animate(kf, { duration: DUR, delay: T0 + ordem * 250, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }));
      if (sinal[j] && sinal[j].de !== sinal[j].para) {   /* o sinal troca no meio do caminho */
        x.innerHTML = hwMini(sinal[j].de);
        (function (x, txt) { var t = setTimeout(function () { x.innerHTML = hwMini(txt); x.classList.add('pop'); }, T0 + DUR * .5); vivas.push({ cancel: function () { clearTimeout(t); } }); })(x, sinal[j].para);
      }
    });
    /* a linha de antes some quando o movimento comeca (os termos "saem" dela) */
    vivas.push(la.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160 / vel, delay: T0, fill: 'both' }));
    vivas.forEach(function (a) { ANIM.vivas.push(a); });   /* "Pausar" tambem pausa o termo trocando de lado */
    return new Promise(function (ok) {
      var t = setTimeout(function () { bx.classList.remove('rodando'); bx.classList.add('fim'); ok(tok == null || tok === ANIM.tok); }, T0 + DUR + 450 / vel);
      vivas.push({ cancel: function () { clearTimeout(t); ok(false); } });
    });
  }
  /* ==========================================================================================
     ESCRITA A MAO DE VERDADE (30/10, 3a rodada; pedido: "sem caneta, sem barra; a letra desenhada, fluida, com voltas, como
     alguem escrevendo num iPad"). As contas de matematica e quimica sao DESENHADAS com uma fonte de traco unico (EMS Felix,
     SIL OFL; pontos suavizados em curvas no build): cada traco de cada letra e' percorrido na ordem, numa velocidade de mao,
     com a pausinha de quem levanta a caneta entre letras e entre palavras. Depois o marca-texto passa no resultado.
     Sem fonte (biologia, portugues): a conta fica em texto, sem animacao.
     ========================================================================================== */
  var HW = %HW%, HW_EM = 24;
  function hwTexto(t) {   /* texto da conta -> [{c, k:''|'sup'|'sub'}] (x^2, x^(n+1) viram expoente) */
    var out = [], s = String(t || '').replace(/\r/g, ''), i = 0;
    while (i < s.length) {
      var c = s[i];
      if (c === '^') {
        var m = /^\^\(([^()]{1,24})\)/.exec(s.slice(i)) || /^\^([0-9a-zA-Z+−-]{1,6})/.exec(s.slice(i));
        if (m) { Array.from(m[1]).forEach(function (x) { out.push({ c: x === '-' ? '−' : x, k: 'sup' }); }); i += m[0].length; continue; }
      }
      var gl = HW.g[c];
      if (gl && gl[1] === 'sup') out.push({ c: gl[0], k: 'sup' });
      else if (gl && gl[1] === 'sub') out.push({ c: gl[0], k: 'sub' });
      else out.push({ c: c, k: '' });
      i++;
    }
    return out;
  }
  function hwAdv(it) { var gl = HW.g[it.c], a = gl && gl !== 0 ? gl[0] : 560; return a * (it.k ? .62 : 1); }
  /* quebra em linhas pela largura (palavra inteira desce; palavra maior que a linha e' cortada) */
  function hwLinhas(cs, larg) {
    var px = HW_EM / 1000, linhas = [], cur = [], w = 0, pal = [], wp = 0;
    function fechaPal() { if (!pal.length) return; if (w + wp > larg && cur.length) { linhas.push(cur); cur = []; w = 0; while (cur.length && cur[0].c === ' ') cur.shift(); } pal.forEach(function (x) { cur.push(x); }); w += wp; pal = []; wp = 0; }
    cs.forEach(function (it) {
      if (it.c === '\n') { fechaPal(); linhas.push(cur); cur = []; w = 0; return; }
      var a = hwAdv(it) * px;
      if (it.c === ' ') { fechaPal(); if (cur.length) { cur.push(it); w += a; } return; }
      if (wp + a > larg && pal.length) { fechaPal(); }
      pal.push(it); wp += a;
    });
    fechaPal(); if (cur.length || !linhas.length) linhas.push(cur);
    return linhas;
  }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function hwEl(n, at) { var x = document.createElementNS(SVGNS, n); for (var k in at) x.setAttribute(k, at[k]); return x; }
  /* um token (termo da troca de lado) desenhado com a mesma mao da conta, estatico, como HTML <svg> */
  function hwMini(t) {
    if (!HW) return sobrescrito(escH(t));
    var cs = hwTexto(t), px = HW_EM / 1000, x = 0, out = '';
    cs.forEach(function (it) {
      var gl = HW.g[it.c], a = hwAdv(it) * px, s2 = px * (it.k ? .62 : 1), dy = it.k === 'sup' ? -HW_EM * .36 : it.k === 'sub' ? HW_EM * .16 : 0;
      if (gl && gl !== 0 && typeof gl[1] !== 'string' && gl[1].length !== undefined) out += '<g transform="translate(' + x.toFixed(1) + ' ' + (HW_EM * .95 + dy).toFixed(1) + ') scale(' + s2.toFixed(4) + ' ' + (-s2).toFixed(4) + ')" stroke-width="' + (1.85 / s2).toFixed(1) + '">' + gl[1].map(function (d) { return '<path d="' + d + '"/>'; }).join('') + '</g>';
      else if (it.c !== ' ') out += '<text x="' + x.toFixed(1) + '" y="' + (HW_EM * .95 + dy).toFixed(1) + '" font-size="' + (HW_EM * .78).toFixed(1) + '" class="ad-hw-fb" fill="currentColor" stroke="none">' + escH(it.c) + '</text>';
      x += a;
    });
    var W = Math.max(6, x + 2);
    return '<svg class="ad-hwm" width="' + W.toFixed(1) + '" height="' + (HW_EM * 1.3).toFixed(1) + '" viewBox="0 0 ' + W.toFixed(1) + ' ' + (HW_EM * 1.3).toFixed(1) + '" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + out + '</svg>';
  }
  /* desenha a conta (estatica ou animada); devolve a duracao da escrita em ms (0 = estatica) */
  function hwConta(conta, animar, tok) {
    if (!HW) return 0;
    var texto = conta.__hwTxt != null ? conta.__hwTxt : (conta.__hwTxt = conta.textContent);
    var st = getComputedStyle(conta), larg = Math.max(160, conta.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight) - 4);
    var txt2 = texto.replace(/(^|[=(→×÷·]\s*)[−-]\s+(?=[\d\w(])/g, '$1−');   /* menos de sinal colado no numero: "= −2p", nao "= − 2p" */
    var cs = hwTexto(txt2), linhas = hwLinhas(cs, larg), px = HW_EM / 1000, LH = HW_EM * 1.5, topo = HW_EM * .82;
    /* a mao nao e' carimbo: cada letra sai um pouco diferente (semente fixa por conta, igual a cada visita) */
    var semente = 0; for (var si = 0; si < texto.length; si++) semente = (semente * 31 + texto.charCodeAt(si)) >>> 0;
    function rnd() { semente = (semente * 1664525 + 1013904223) >>> 0; return semente / 4294967296 - .5; }
    /* palavras (3+ letras, sem numero) sao prosa: a mao corre mais rapido nelas que nos numeros */
    var prosa = {}; (function () { var ini = -1; cs.forEach(function (it, i) { var l = /[a-zà-ú]/i.test(it.c) && !it.k; if (l && ini < 0) ini = i; if (!l || i === cs.length - 1) { var fim = l ? i + 1 : i; if (ini >= 0 && fim - ini >= 3) for (var k = ini; k < fim; k++) prosa[k] = 1; ini = -1; } }); })();
    var W = larg, H = Math.ceil(linhas.length * LH + HW_EM * .3);
    var svg = hwEl('svg', { 'class': 'ad-hw', width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true' });
    var gm = hwEl('g', { 'class': 'ad-hw-mt' }), gt = hwEl('g', { 'class': 'ad-hw-tinta', fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    svg.appendChild(gm); svg.appendChild(gt);
    /* resultado marcado: o trecho depois do ultimo =, → ou ≈ da ultima linha (curto e com numero) */
    var ult = texto.split('\n').pop(), mm = /^(.*\s(?:=|→|≈)\s)(\S[^=→≈]{0,36})$/.exec(ult), iniMarca = -1;
    if (mm && /^[−-]?\s?[\d.,  ]+\s?(?:[a-zA-Zµ%°²³/]{0,6})$/.test(mm[2].trim()) && texto.indexOf('\n') < 0) iniMarca = cs.length - hwTexto(mm[2]).length;
    var tracos = [], marcas = [], idx = 0;
    linhas.forEach(function (ln, li) {
      var x = 0, base = topo + li * LH;
      ln.forEach(function (it) {
        var a = hwAdv(it) * px, gl = HW.g[it.c], s = px * (it.k ? .62 : 1), dy = it.k === 'sup' ? -HW_EM * .36 : it.k === 'sub' ? HW_EM * .16 : 0;
        if (iniMarca >= 0 && idx >= iniMarca && it.c !== ' ') marcas.push({ x: x, w: a, y: base, li: li });
        if (it.c !== ' ') {
          if (gl && gl !== 0 && gl[1] && gl[1].length !== undefined && typeof gl[1] !== 'string') {
            var jx = rnd() * .8, jy = rnd() * 1, jr = rnd() * 2.4, js = 1 + rnd() * .04;
            var g = hwEl('g', { transform: 'translate(' + (x + jx).toFixed(1) + ' ' + (base + dy + jy).toFixed(1) + ') rotate(' + jr.toFixed(2) + ') scale(' + (s * js).toFixed(4) + ' ' + (-s * js).toFixed(4) + ')', 'stroke-width': (1.85 / s).toFixed(1) });
            gl[1].forEach(function (d) { var p = hwEl('path', { d: d }); g.appendChild(p); tracos.push({ el: p, s: s, letra: idx, ch: it.c, prosa: !!prosa[idx], v: 1 + rnd() * .3 }); });
            gt.appendChild(g);
          } else {   /* simbolo sem traco: escrito com a fonte do caderno */
            var tx = hwEl('text', { x: x.toFixed(1), y: (base + dy).toFixed(1), 'font-size': (HW_EM * (it.k ? .62 : 1) * .78).toFixed(1), 'class': 'ad-hw-fb', fill: 'currentColor', stroke: 'none' });
            tx.textContent = it.c; gt.appendChild(tx); tracos.push({ el: tx, fb: true, letra: idx });
          }
        } else tracos.push({ esp: true, letra: idx });
        x += a; idx++;
      });
      idx += 0;
    });
    /* faixas do marca-texto (uma por linha) */
    var porL = {}; marcas.forEach(function (m) { var r = porL[m.li] || (porL[m.li] = { x0: m.x, x1: m.x + m.w, y: m.y }); r.x0 = Math.min(r.x0, m.x); r.x1 = Math.max(r.x1, m.x + m.w); });
    var faixas = Object.keys(porL).map(function (k) { var r = porL[k]; var f = hwEl('rect', { x: (r.x0 - 3).toFixed(1), y: (r.y - HW_EM * .34).toFixed(1), width: (r.x1 - r.x0 + 6).toFixed(1), height: (HW_EM * .46).toFixed(1), rx: 4, 'class': 'ad-hw-faixa' }); gm.appendChild(f); return f; });
    var sr = conta.querySelector('.ad-sr') || null;
    conta.innerHTML = ''; var spn = document.createElement('span'); spn.className = 'ad-sr'; spn.textContent = texto; conta.appendChild(spn); conta.appendChild(svg);
    conta.classList.add('ad-hwc'); conta.__hwLarg = conta.clientWidth;
    if (!animar || reduz || !svg.animate) return 0;
    /* tempo de cada traco: comprimento / velocidade da mao; levanta a caneta entre tracos, letras e palavras */
    var K = ANIM.vel * BASE, V = .32 * K, t = 140, ultLetra = -1, vivas = ANIM.vivas, ultProsa = false;
    var corT = getComputedStyle(conta).color, corM = 'color-mix(in srgb,' + corT + ' 62%,#4b6bff)';
    tracos.forEach(function (tr) {
      if (tr.esp) { t += (ultProsa ? 70 : 170) / K; return; }
      if (tr.letra !== ultLetra) {
        t += (ultLetra < 0 ? 0 : (tr.prosa ? 30 : 70)) / K; ultLetra = tr.letra; ultProsa = tr.prosa;
        if (tr.ch === '=' || tr.ch === '→' || tr.ch === '⇌') t += 240 / K;   /* a pausa de quem pensa antes de concluir */
      } else t += (tr.prosa ? 14 : 40) / K;
      if (tr.fb) { vivas.push(tr.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay: t, fill: 'both' })); t += 140 / K; return; }
      var L = tr.el.getTotalLength(), Lpx = L * tr.s, d = Math.max(tr.prosa ? 22 : 45, Lpx / (V * tr.v * (tr.prosa ? 2.4 : 1)));
      tr.el.style.strokeDasharray = L + ' ' + (L + 2);
      vivas.push(tr.el.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: d, delay: t, easing: 'cubic-bezier(.35,.05,.45,1)', fill: 'both' }));
      vivas.push(tr.el.animate([{ stroke: corM }, { stroke: corM, offset: .4 }, { stroke: corT }], { duration: d + 600, delay: t, easing: 'ease-out', fill: 'backwards' }));   /* tinta que seca */
      t += d;
    });
    var tMarca = t + 160;
    faixas.forEach(function (f, i) {
      f.style.transformOrigin = f.getAttribute('x') + 'px 0px'; f.style.transformBox = 'view-box';
      vivas.push(f.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 420 / (ANIM.vel * BASE), delay: tMarca + i * 380, easing: 'cubic-bezier(.45,.05,.4,1)', fill: 'both' }));
    });
    return tMarca + (faixas.length ? faixas.length * 380 + 120 : 0);
  }
  /* redesenha (sem animar) quando a largura muda */
  var hwRedim = 0;
  addEventListener('resize', function () {
    clearTimeout(hwRedim); hwRedim = setTimeout(function () {
      document.querySelectorAll('.conta.ad-hwc').forEach(function (c) { if (c.closest('.ad-tocando') || !c.offsetParent || c.clientWidth === c.__hwLarg) return; hwConta(c, false); });
    }, 160);
  });

  /* ==========================================================================================
     RESOLUCAO: "Assistir resolucao" (so matematica; quimica so quando a resolucao tem equacao). Um botao; ao clicar, os
     passos acontecem um por um (titulo, termo trocando de lado, conta escrita a mao, marca-texto, explicacao). No fim
     tudo se junta num QUADRO SO, e o botao some: rever, so quando a questao voltar. Biologia e portugues: passos fixos.
     ========================================================================================== */
  function preparaAnim(bl) {
    if (bl.dataset.anim) return; bl.dataset.anim = '1';
    var passos = [].slice.call(bl.querySelectorAll('.passo')); if (!passos.length) return;
    var contas = passos.map(function (ps) { return ps.querySelector('.conta'); });
    var temEq = contas.some(function (c) { return c && /[=→⇌]/.test(c.textContent); });
    var anima = HW && (MAT === 'mat' || (MAT === 'qui' && temEq));
    if (!anima) { bl.classList.add('ad-fixo'); return; }
    passos.forEach(function (ps, k) { if (ps.querySelector('.ad-mov')) return; try { var par = parDoPasso(ps, passos[k - 1]); if (par) montaMov(ps, par); } catch (z) { } });
    bl.classList.add('ad-res-anim');
    var cta = document.createElement('div'); cta.className = 'ad-assistir';
    cta.innerHTML = '<button type="button" class="btn ad-ass-bt">' + lu('play') + 'Assistir resolução</button>' +
      '<span class="ad-ass-txt">' + plural(passos.length, 'passo', 'passos') + ', escritos à mão na sua frente</span>' +
      '<button type="button" class="ad-link ad-ass-direto">Ver sem animação</button>';
    var h3 = bl.querySelector('h3'); (h3 || bl.firstChild).insertAdjacentElement(h3 ? 'afterend' : 'beforebegin', cta);
    bl.classList.add('ad-espera');
    var tok = null, pausado = false, retoma = null;
    function quadro() {   /* tudo junto, um quadro so, sem botao de rever */
      ANIM.tok++; paraVivas();
      bl.classList.remove('ad-espera', 'ad-tocando'); bl.classList.add('ad-quadro');
      var bar = bl.querySelector('.ad-play2'); if (bar) bar.remove(); cta.remove();
      passos.forEach(function (ps) {
        ps.classList.remove('ad-oculto', 'ad-atual'); ps.querySelectorAll('.ad-pos').forEach(function (x) { x.classList.add('ad-feito'); });
        var c = ps.querySelector('.conta'); if (c) { c.style.visibility = ''; hwConta(c, false); }
        var mv = ps.querySelector('.ad-mov'); if (mv) mv.classList.remove('ad-mov-on');
      });
    }
    function espera2(ms, t) { return new Promise(function (ok) { var fim = Date.now() + ms; (function tic() { if (t !== ANIM.tok) return ok(false); if (pausado) { var resta = Math.max(0, fim - Date.now()); retoma = function () { fim = Date.now() + resta; tic(); }; return; } var r = fim - Date.now(); if (r <= 0) return ok(true); setTimeout(tic, Math.min(r, 120)); })(); }); }
    async function toca() {
      var t = ++ANIM.tok; paraVivas();
      bl.classList.remove('ad-espera'); bl.classList.add('ad-tocando'); cta.remove();
      var bar = document.createElement('div'); bar.className = 'ad-play2';
      var rotV = function () { return String(ANIM.vel).replace('.', ',') + '×'; };
      bar.innerHTML = '<button type="button" data-a="pausa">' + lu('pause') + 'Pausar</button><button type="button" data-a="vel" title="Velocidade da escrita">' + rotV() + '</button><span class="pp"></span><button type="button" data-a="pula">Pular para o quadro final</button>';
      var h3b = bl.querySelector('h3'); (h3b || bl.firstChild).insertAdjacentElement(h3b ? 'afterend' : 'beforebegin', bar);
      bar.onclick = function (ev) {
        var b = ev.target.closest('button'); if (!b) return;
        if (b.dataset.a === 'pula') return quadro();
        if (b.dataset.a === 'vel') { ANIM.vel = ANIM.vel === 1 ? 1.5 : ANIM.vel === 1.5 ? 2 : ANIM.vel === 2 ? .75 : 1; try { localStorage.setItem('ad-vel', ANIM.vel); } catch (z) { } b.textContent = rotV(); return; }
        pausado = !pausado; b.innerHTML = pausado ? lu('play') + 'Continuar' : lu('pause') + 'Pausar';
        ANIM.vivas.forEach(function (a) { try { if (a.pause) { pausado ? a.pause() : a.play(); } } catch (z) { } });
        if (!pausado && retoma) { var f = retoma; retoma = null; f(); }
      };
      passos.forEach(function (ps) { ps.classList.add('ad-oculto'); ps.classList.remove('ad-atual'); });
      for (var i = 0; i < passos.length; i++) {
        var ps = passos[i]; bar.querySelector('.pp').textContent = 'Passo ' + (i + 1) + ' de ' + passos.length;
        var pos = [].slice.call(ps.querySelectorAll('.figura,.porque,.tipo')); pos.forEach(function (x) { x.classList.add('ad-pos'); x.classList.remove('ad-feito'); });
        var c = ps.querySelector('.conta'); if (c) { c.style.visibility = 'hidden'; }
        ps.classList.remove('ad-oculto'); ps.classList.add('ad-atual');
        try { ps.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (z) { }
        if (!await espera2(380 / (ANIM.vel * BASE), t)) return;
        var mv = ps.querySelector('.ad-mov');
        if (mv) {
          mv.classList.add('ad-mov-on'); if (!await tocaMov(mv, t)) return; if (!await espera2(450, t)) return;
          /* o movimento ja foi visto: o quadrinho sai e a conta e' escrita a mao no lugar (sem repetir a equacao) */
          if (mv.animate) { var sa = mv.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }); ANIM.vivas.push(sa); if (!await espera2(270, t)) return; }
          mv.classList.remove('ad-mov-on');
        }
        if (c) { c.style.visibility = ''; var d = hwConta(c, true, t); if (!await espera2(d + 200, t)) return; }
        pos.forEach(function (x) { x.classList.add('ad-feito'); });
        var txt = pos.reduce(function (s2, x) { return s2 + (x.textContent || '').length; }, 0);
        if (!await espera2((pos.length ? Math.max(900, Math.min(3200, 400 + txt * 22)) : 500) / (ANIM.vel * BASE), t)) return;
        ps.classList.remove('ad-atual');
      }
      if (t === ANIM.tok) quadro();
    }
    cta.querySelector('.ad-ass-bt').onclick = toca;
    cta.querySelector('.ad-ass-direto').onclick = quadro;
  }
  new MutationObserver(function () {
    document.querySelectorAll('.passo').forEach(function (ps) {
      var bl = ps.closest('.bloco'); if (bl && !bl.dataset.anim && bl.offsetParent !== null) preparaAnim(bl);
    });
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });

  new MutationObserver(function () {
    document.querySelectorAll('#q-corpo .qmeta > .tag:not([title])').forEach(function (t) { t.title = t.textContent; });
    document.querySelectorAll('#ad-painel .veredito:not([tabindex])').forEach(function (v) { v.setAttribute('tabindex', '-1'); v.setAttribute('role', 'status'); if (document.activeElement === document.body || !document.activeElement) try { v.focus({ preventScroll: true }); } catch (z) { } });   /* auditoria 31/10: o resultado e' anunciado e o foco nao cai no body */
    document.querySelectorAll('#ad-painel .resolucao .resp:not([data-mt])').forEach(function (r) { r.dataset.mt = '1'; if ((r.textContent || '').trim().length > 70) r.classList.add('longa'); r.innerHTML = '<span class="resp-mt">' + r.innerHTML + '</span>'; });
  }).observe(document.body, { childList: true, subtree: true });
  /* ---------- simbolos antigos (glifos de teclado) dos botoes ocultos do app avulso: saem do DOM (rev. final P3-5) ---------- */
  var GLIFO = /[✕▣⏱▤◎⇄⤢⤡∑⊘☆★⏸▶]/g;
  function limpaGlifos() {
    document.querySelectorAll('nav.bot em').forEach(function (el) { if (el.textContent) el.textContent = ''; });   /* so continham o glifo */
    document.querySelectorAll('#bfull, #sair-foco, #b-rev').forEach(function (el) {
      [].slice.call(el.childNodes).forEach(function (n) { if (n.nodeType === 3 && GLIFO.test(n.nodeValue)) { GLIFO.lastIndex = 0; n.nodeValue = n.nodeValue.replace(GLIFO, '').replace(/^\s+/, ''); } GLIFO.lastIndex = 0; });
    });
  }
  limpaGlifos();
  var lgPend = 0;
  new MutationObserver(function () { if (lgPend) return; lgPend = 1; requestAnimationFrame(function () { lgPend = 0; limpaGlifos(); }); }).observe(document.body, { childList: true, subtree: true, characterData: true });

  /* ---------- Quimica: formulas com subscrito em todo texto nosso (rev. final P2-6) ----------
     Os dados guardam formulas em ASCII (CO2, CHCl3, C12H22O11). Aqui so vira subscrito o que e' formula:
     uma sequencia de simbolos de elemento REAIS (e parenteses), com pelo menos um numero, isolada (sem
     letra/numero colado antes ou depois). O coeficiente na frente (2H2O) fica normal. Nao mexe em:
     carga (Fe3+, HCO3- no fim), isotopo/numeracao com 1 simbolo e 2+ algarismos (C14, U235),
     SN1/SN2/E1/E2 (mecanismos) e vitaminas (B5, B12). T entra so para P1V1/T1 = P2V2/T2 ficar uniforme. */
  if (MAT === 'qui') (function () {
    var EL = 'He Li Be Ne Na Mg Al Si Cl Ar Ca Sc Ti Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa Np Pu Am Cm Bk Cf Es Fm Md No Lr H B C N O F P S K V Y I W U T'.split(' ').join('|');
    var U = '(?:(?:' + EL + ')\\d*|\\((?:(?:' + EL + ')\\d*)+\\)\\d*)';
    var RE = new RegExp('(^|[^A-Za-zÀ-ÿ0-9_])(\\d*)(' + U + '+)(?=$|[^A-Za-zÀ-ÿ0-9_])', 'g');
    var SUB = '₀₁₂₃₄₅₆₇₈₉', NAO = /^(?:SN[12]|E[12]|B\d+)$/, SO1 = new RegExp('^(?:' + EL + ')\\d{2,}$');
    function conv(s) {
      if (!/[A-Z][a-z]?\)?\d/.test(s)) return s;
      return s.replace(RE, function (m, pre, co, f, off) {
        if (!/\d/.test(f) || NAO.test(f) || SO1.test(f)) return m;
        var fim = off + m.length, a = s.charAt(fim), b = s.charAt(fim + 1);
        if (a === '+' && /\d$/.test(f)) return m;                       /* Fe3+ e' carga (com ⁺ ja escrito, o numero e' subscrito: NH4⁺) */
        if ('-−–'.indexOf(a) >= 0 && a && !/[A-Za-z(\[0-9]/.test(b) && /\d$/.test(f)) return m;   /* HCO3- no fim */
        return pre + co + f.replace(/\d/g, function (d) { return SUB[+d]; });
      });
    }
    var FORA = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1, CODE: 1, NOSCRIPT: 1 };
    function passa(raiz) {
      if (!raiz) return;
      if (raiz.nodeType === 3) { if (raiz.parentNode && !FORA[raiz.parentNode.nodeName]) { var v = conv(raiz.nodeValue); if (v !== raiz.nodeValue) raiz.nodeValue = v; } return; }
      if (raiz.nodeType !== 1 || FORA[raiz.nodeName] || raiz.isContentEditable) return;
      var tw = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { var p = n.parentNode; return p && !FORA[p.nodeName] && !p.isContentEditable && /[A-Z][a-z]?\)?\d/.test(n.nodeValue) ? 1 : 3; } }), n, l = [];
      while ((n = tw.nextNode())) l.push(n);
      l.forEach(function (n) { var v = conv(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; });
    }
    window.adFormula = conv;
    passa(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) { if (m.type === 'characterData') passa(m.target); else m.addedNodes.forEach(passa); });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  })();

  /* ---------- DICIONARIO "passe o mouse" (estilo Kindle; 30/10) ----------
     D.dic = [{termo, formas[], def, origem?, exemplo?, fonte}] por materia. Marca, no TEXTO de ensino exibido (resolucao,
     "Em uma olhada", passos, teoria/cartoes, flashcards verso e "Cuidado"), a 1a ocorrencia de cada termo por bloco, com
     sublinhado pontilhado. Casamento por palavra inteira; forma com maiuscula = maiuscula exata (siglas: PA nao casa "pa"),
     forma toda minuscula = sem diferenciar caixa; acentos exatos (NFC), mas algarismo casa com o subscrito (NH3 = NH₃) e
     + com ⁺. Forma mais longa vence sobreposicao. So nos nos de TEXTO: nunca atributo, <img>, src base64, formula
     (<code>, .conta, .formula, caderno), botao ou titulo da interface. O glossario antigo do app (button.gl) sai onde o
     termo existe aqui. Caixinha: mouse (abre em ~250 ms, tolerancia para levar o mouse ate ela), toque (abre; tocar fora
     fecha), teclado (foco abre, Esc fecha; aria-describedby). */
  (function () {
    var DIC = (typeof D !== 'undefined' && Array.isArray(D.dic)) ? D.dic.filter(function (x) { return x && x.termo && x.def; }) : [];
    if (!DIC.length || !window.MutationObserver) return;
    var SUBD = '₀₁₂₃₄₅₆₇₈₉';
    function rxForma(f) {
      return String(f).normalize('NFC').split('').map(function (ch) {
        if (/[0-9]/.test(ch)) return '[' + ch + SUBD[+ch] + ']';
        var k = SUBD.indexOf(ch); if (k >= 0) return '[' + k + ch + ']';
        if (ch === '+' || ch === '⁺') return '[+⁺]';
        if (ch === ' ') return '[\\s\\u00a0]+';
        return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');   /* modo u: - e / nao se escapam fora de [] */
      }).join('');
    }
    /* contexto em que o termo NAO se aplica (anotado pelos revisores do dicionario) */
    var NAO = { Kc: /criosc|molal|1,86/i };   /* testado no texto da zona inteira (a resolucao toda) */
    /* termo de palavra comum que so vale no sentido tecnico: o bloco precisa ter um sinal do assunto */
    var SO = {
      'combinação': /combinat|C\s*\(|C_?\d|escolh|ordem (não )?importa|agrupament|comiss|subconjunt|fatorial|n!|maneiras|modos de/i,
      moda: /mediana|média|frequ[eê]n|dados|amostra|\brol\b|aparece mais|estat/i
    };
    var visto = {}, sens = [], insens = [];
    DIC.forEach(function (d, i) {
      var fs = (d.formas || []).slice(); if (fs.indexOf(d.termo) < 0) fs.push(d.termo);
      fs.forEach(function (f) {
        f = String(f || '').trim(); if (f.length < 2 || visto[f]) return; visto[f] = 1;
        (/[A-ZÀ-ÖØ-Þ]/.test(f) ? sens : insens).push({ f: f, i: i });
      });
    });
    function monta(l, fl) {
      if (!l.length) return null;
      l.sort(function (a, b) { return b.f.length - a.f.length; });
      return new RegExp('(?<![\\p{L}\\p{N}_]|\\p{L}-)(?:' + l.map(function (x) { return '(' + rxForma(x.f) + ')'; }).join('|') + ')(?![\\p{L}\\p{N}_]|-\\p{L})', fl);
    }
    var RS = monta(sens, 'gu'), RI = monta(insens, 'giu');
    function achados(txt) {   /* [{a, b, i}] sem sobreposicao; a mais longa vence */
      var c = [];
      [[RS, sens], [RI, insens]].forEach(function (p) {
        var re = p[0], l = p[1]; if (!re) return; re.lastIndex = 0; var m;
        while ((m = re.exec(txt))) {
          var k = 1; while (k < m.length && m[k] === undefined) k++;
          c.push({ a: m.index, b: m.index + m[0].length, i: l[k - 1].i });
          if (!m[0].length) re.lastIndex++;
        }
      });
      c.sort(function (x, y) { return (y.b - y.a) - (x.b - x.a) || x.a - y.a; });
      var ok = [];
      c.forEach(function (x) { if (!ok.some(function (y) { return x.a < y.b && y.a < x.b; })) ok.push(x); });
      return ok.sort(function (x, y) { return x.a - y.a; });
    }
    /* onde marca (texto de ensino) e onde nunca marca */
    var ZONA = '#q-corpo .resolucao, #q-corpo .veredito .oque, .ad-cartao, .ad-teo-velho, .ad-fl-cmp .mod, .ad-fl-cuid, .ad-fl-ex, .ad-dic-zona';
    var FORA = 'code, pre, kbd, samp, button, a, input, textarea, select, option, label, svg, math, img, figure, script, style, ' +
      'h1, h2, h3, h4, h5, h6, summary, [contenteditable], [aria-hidden="true"], .conta, .formula, .ad-folha, .ad-play, .tipo, .nn, ' +
      '.ess-r, .marca, .L, .gl, .ad-dic, .ad-dic-caixa, .simbolos dt, .armad > b:first-child, .ad-fl-cuid > b:first-child, .alerta-box > b:first-child';
    var BLOCO = 'p, li, dd, dt, td, th, blockquote, figcaption, .resp, .checa, .armad, .alerta-box, .ad-fl-cuid, .oque, .errada > div';
    function semGlossarioDuplo(z) {   /* termo nos dois: fica so o novo */
      z.querySelectorAll('button.gl').forEach(function (b) {
        var t = b.textContent, a = achados(t);
        if (a.length && a[0].a === 0 && a[0].b === t.length) b.replaceWith(document.createTextNode(t));
      });
      try { z.normalize(); } catch (x) { }
    }
    function marcaZona(z) {
      semGlossarioDuplo(z);
      var tw = document.createTreeWalker(z, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) { var p = n.parentElement; return p && n.nodeValue.trim().length > 1 && !p.closest(FORA) ? 1 : 3; }
      }), n, nos = [];
      while ((n = tw.nextNode())) nos.push(n);
      var porBloco = new Map();
      nos.forEach(function (n) {
        var bl = n.parentElement.closest(BLOCO) || z;
        if (!z.contains(bl)) bl = z;
        var vis = porBloco.get(bl);
        if (!vis) { vis = {}; bl.querySelectorAll('.ad-dic').forEach(function (s) { vis[s.dataset.dic] = 1; }); porBloco.set(bl, vis); }
        var txt = n.nodeValue, l = achados(txt).filter(function (x) {
          if (vis[x.i]) return false;
          var t = DIC[x.i].termo, r = NAO[t], so = SO[t]; if (r && r.test(z.textContent)) return false;
          if (so && !so.test(bl.textContent)) return false;
          vis[x.i] = 1; return true;
        });
        if (!l.length) return;
        var fr = document.createDocumentFragment(), pos = 0;
        l.forEach(function (x) {
          if (x.a > pos) fr.appendChild(document.createTextNode(txt.slice(pos, x.a)));
          var s = document.createElement('span'); s.className = 'ad-dic'; s.tabIndex = 0; s.dataset.dic = x.i;
          s.setAttribute('role', 'button'); s.setAttribute('aria-haspopup', 'true'); s.setAttribute('aria-expanded', 'false');
          s.textContent = txt.slice(x.a, x.b); fr.appendChild(s); pos = x.b;
        });
        if (pos < txt.length) fr.appendChild(document.createTextNode(txt.slice(pos)));
        n.parentNode.replaceChild(fr, n);
      });
    }
    function varre() {
      document.querySelectorAll(ZONA).forEach(function (z) {
        if (z.parentElement && z.parentElement.closest(ZONA)) return;   /* zona dentro de zona: a de fora cuida */
        var tam = z.textContent.length; if (z.__dic === tam) return;
        marcaZona(z); z.__dic = z.textContent.length;
      });
    }
    window.adDicAchados = function (t) { return achados(String(t)).map(function (x) { return [String(t).slice(x.a, x.b), DIC[x.i].termo]; }); };
    window.adDicVarre = varre;
    var pend = 0;
    new MutationObserver(function () { if (pend) return; pend = 1; requestAnimationFrame(function () { pend = 0; varre(); }); })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
    varre();

    /* ---- a caixinha ---- */
    var cx = document.createElement('div'); cx.className = 'ad-dic-caixa'; cx.id = 'ad-dic-caixa'; cx.setAttribute('role', 'tooltip'); cx.hidden = true;
    document.body.appendChild(cx);
    var alvo = null, tAbre = 0, tFecha = 0, ultToque = 0, porToque = false;   /* porToque: tocar de novo no mesmo termo fecha */
    function conteudo(d) {
      return '<b class="t">' + e(d.termo) + '</b>' +
        '<p><span class="r">O que é</span>' + e(d.def) + '</p>' +
        (d.origem ? '<p class="o"><span class="r">Origem</span>' + e(d.origem) + '</p>' : '') +
        (d.exemplo ? '<p class="x"><span class="r">Exemplo</span>' + e(d.exemplo) + '</p>' : '') + '<i class="seta" aria-hidden="true"></i>';
    }
    function posiciona(px) {
      if (!alvo || cx.hidden) return;
      var rs = [].slice.call(alvo.getClientRects()), r = rs[0] || alvo.getBoundingClientRect();
      if (px != null && rs.length > 1) rs.forEach(function (q) { if (px >= q.left && px <= q.right) r = q; });
      var W = innerWidth, H = innerHeight, m = 8, w = cx.offsetWidth, h = cx.offsetHeight;
      var cxm = (r.left + r.right) / 2, x = Math.max(m, Math.min(W - m - w, cxm - w / 2));
      var baixo = r.bottom + 10 + h <= H - m || r.top - 10 - h < m, y = baixo ? r.bottom + 10 : r.top - 10 - h;
      cx.style.left = Math.round(x) + 'px'; cx.style.top = Math.round(y) + 'px';
      cx.classList.toggle('cima', !baixo);
      cx.style.setProperty('--sx', Math.round(Math.max(14, Math.min(w - 14, cxm - x))) + 'px');
    }
    function abre(s, px) {
      clearTimeout(tAbre); clearTimeout(tFecha);
      var d = DIC[+s.dataset.dic]; if (!d) return; porToque = false;
      if (alvo && alvo !== s) { alvo.removeAttribute('aria-describedby'); alvo.setAttribute('aria-expanded', 'false'); alvo.classList.remove('on'); }
      alvo = s; cx.innerHTML = conteudo(d); cx.hidden = false;
      s.setAttribute('aria-describedby', 'ad-dic-caixa'); s.setAttribute('aria-expanded', 'true'); s.classList.add('on');
      posiciona(px);
      cx.classList.remove('vis'); void cx.offsetWidth; cx.classList.add('vis');
    }
    function fecha() {
      clearTimeout(tAbre); clearTimeout(tFecha);
      if (alvo) { alvo.removeAttribute('aria-describedby'); alvo.setAttribute('aria-expanded', 'false'); alvo.classList.remove('on'); }
      alvo = null; cx.hidden = true; cx.classList.remove('vis');
    }
    function fechaLogo() { clearTimeout(tFecha); tFecha = setTimeout(fecha, 220); }
    document.addEventListener('pointerdown', function (ev) { if (ev.pointerType !== 'mouse') ultToque = Date.now(); }, true);
    document.addEventListener('mouseover', function (ev) {
      if (Date.now() - ultToque < 800) return;   /* toque gera mouseover falso: no toque quem abre e' o clique */
      var s = ev.target.closest && ev.target.closest('.ad-dic');
      if (s) { clearTimeout(tFecha); if (s === alvo) return; clearTimeout(tAbre); var px = ev.clientX; tAbre = setTimeout(function () { abre(s, px); }, 250); return; }
      if (ev.target.closest && ev.target.closest('.ad-dic-caixa')) { clearTimeout(tFecha); return; }
    });
    document.addEventListener('mouseout', function (ev) {
      var s = ev.target.closest && (ev.target.closest('.ad-dic') || ev.target.closest('.ad-dic-caixa')); if (!s) return;
      var p = ev.relatedTarget; if (p && p.closest && (p.closest('.ad-dic-caixa') || (alvo && p.closest('.ad-dic') === alvo))) return;
      clearTimeout(tAbre); if (alvo && document.activeElement !== alvo) fechaLogo();
    });
    document.addEventListener('click', function (ev) {
      var s = ev.target.closest && ev.target.closest('.ad-dic');
      if (s) { ev.preventDefault(); ev.stopPropagation(); var toque = Date.now() - ultToque < 800; if (s === alvo && toque && porToque) fecha(); else { abre(s, ev.clientX); porToque = toque; } return; }
      if (alvo && !(ev.target.closest && ev.target.closest('.ad-dic-caixa'))) fecha();
    }, true);
    document.addEventListener('focusin', function (ev) { var s = ev.target.closest && ev.target.closest('.ad-dic'); if (s && Date.now() - ultToque > 800 && s !== alvo) abre(s); });   /* no toque quem abre e' o clique */
    document.addEventListener('focusout', function (ev) { if (ev.target === alvo) fechaLogo(); });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && alvo) { ev.stopPropagation(); fecha(); return; }
      if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList && ev.target.classList.contains('ad-dic')) { ev.preventDefault(); if (ev.target === alvo) fecha(); else abre(ev.target); }
    }, true);
    var rp = 0;
    function reposiciona() { if (!alvo || rp) return; rp = 1; requestAnimationFrame(function () { rp = 0; if (alvo && !document.contains(alvo)) return fecha(); posiciona(); }); }
    addEventListener('scroll', reposiciona, true); addEventListener('resize', reposiciona);
  })();
  /* ---------- 30/10 (pedido do dono): relogio do TEMPO TOTAL da sessao, ao lado do cronometro da questao.
     Conta enquanto ha questao, simulado, treino geral ou flashcard na tela (nao conta pausado nem com a aba escondida).
     Ao sair, avisa o tempo total; nas telas de resultado, escreve o total no proprio resultado. ---------- */
  (function () {
    var acum = 0, ult = 0, ativa = false, fora = 0, fmt = function (ms) { var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); s = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : String(m).padStart(2, '0')) + ':' + String(s).padStart(2, '0'); };
    var ext = function (ms) { var s = Math.round(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); s = s % 60; return (h ? h + ' h ' : '') + (h || m ? m + ' min ' : '') + (h ? '' : s + ' s'); };
    function cartao() { var c = document.querySelector('.ad-fl-card'); return !!(c && c.offsetParent); }
    function pratica() { var v = raiz.getAttribute('data-v'); return v === 'questao' || v === 'simulado-q' || cartao(); }
    function pausado() { var v = raiz.getAttribute('data-v'); try { return (v === 'questao' || v === 'simulado-q') && tPausado; } catch (x) { return false; } }
    function toast(m) {
      var t = g('ad-toast'); if (!t) { t = document.createElement('div'); t.id = 'ad-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
      t.innerHTML = '<span>' + m + '</span><button type="button" aria-label="Fechar">' + lu('x') + '</button>'; t.hidden = false;
      t.querySelector('button').onclick = function () { t.hidden = true; };
      clearTimeout(t.__h); t.__h = setTimeout(function () { t.hidden = true; }, 9000);
    }
    function encerra() {
      if (!ativa) return; ativa = false;
      if (acum >= 15000) {
        try { S.sessoes = (S.sessoes || []).slice(-199); S.sessoes.push({ ts: Date.now(), seg: Math.round(acum / 1000) }); salva(); } catch (x) { }
        var r = document.querySelector('.ad-res');
        if (r && r.offsetParent && !r.querySelector('.ad-res-total')) { var p = document.createElement('p'); p.className = 'ad-res-total'; p.innerHTML = 'Tempo total desta sessão: <b>' + ext(acum) + '</b>'; var pl = r.querySelector('.ad-placar'); (pl || r.firstChild).insertAdjacentElement('afterend', p); }
        else {
          var msg = 'Sessão encerrada. Tempo total: <b>' + ext(acum) + '</b>';
          /* fora da materia (saiu pela barra lateral do app), o aviso aparece no app principal */
          if (noShell) { try { window.parent.postMessage({ ad: 'toast', txt: 'Sessão encerrada. Tempo total: ', b: ext(acum) }, '*'); } catch (x) { } } else toast(msg);
        }
      }
      acum = 0;
    }
    function pinta() {
      var txt = fmt(acum);
      var cr = g('q-crono');
      if (cr && cr.parentNode) {
        var t = g('ad-total');
        if (!t) { t = document.createElement('span'); t.id = 'ad-total'; t.className = 'cronometro ad-total'; t.title = 'Tempo total da sessão: todas as questões e cartões até agora'; }
        if (t.nextSibling !== cr) cr.parentNode.insertBefore(t, cr);
        t.innerHTML = '<small>total</small> ' + txt; t.hidden = !ativa;
      }
      document.querySelectorAll('.ad-fl-barra').forEach(function (b) {
        var x = b.querySelector('.ad-tot'); if (!x) { x = document.createElement('span'); x.className = 'ad-tot'; x.title = 'Tempo total da sessão'; b.appendChild(x); }
        x.innerHTML = '<small>total</small> ' + txt;
      });
    }
    function tick() {
      var agora = Date.now(), dt = ult ? Math.min(agora - ult, 5000) : 0; ult = agora;
      var v = raiz.getAttribute('data-v');
      if (pratica()) {
        if (!ativa) { ativa = true; acum = 0; }
        fora = 0;
        if (!pausado() && !document.hidden && !window.__adOculto) acum += dt;
      } else if (ativa) {
        if (v === 'resultado' || v === 'resultado-fl') encerra();
        else { fora += dt; if (fora > 4000) encerra(); }
      }
      pinta();
    }
    setInterval(tick, 1000);
  })();
  pintaFaixa();
  if (!g('v-inicio').hidden) pintaInicio();
  /* ---------- auditoria 31/10: armazenamento e varias abas ----------
     1) se gravar no navegador falhar (bloqueado/cheio), avisa uma vez e a casca troca o selo "Progresso salvo";
     2) outra aba gravou: mescla aqui ANTES da proxima gravacao desta aba (antes a ultima aba a gravar apagava as respostas da outra) */
  var semSalvarAvisado = false;
  window.adAvisaSemSalvar = function () {
    if (noShell) try { window.parent.postMessage({ ad: 'semsalvar' }, '*'); } catch (x) { }
    if (semSalvarAvisado) return; semSalvarAvisado = true;
    var t = g('ad-toast'); if (!t) { t = document.createElement('div'); t.id = 'ad-toast'; t.setAttribute('role', 'alert'); document.body.appendChild(t); }
    t.innerHTML = '<span><b>O navegador não está guardando seu progresso.</b> Libere o armazenamento do site (ou saia da janela anônima) para não perder as respostas.</span><button type="button" aria-label="Fechar">' + lu('x') + '</button>';
    t.hidden = false; t.querySelector('button').onclick = function () { t.hidden = true; };
  };
  addEventListener('storage', function (ev) {
    if (ev.key !== KEY || !ev.newValue) return;
    try {
      var r = JSON.parse(ev.newValue) || {};
      S.q = mesclaQ(S.q, r.q || {});
      Object.keys(r.q || {}).forEach(function (id) { if (S.q[id]) S.q[id].rev = !!r.q[id].rev; });   /* marcar/desmarcar: vale o da aba que gravou */
      S.sims = mesclaSims(S.sims, r.sims || []);
      if (window.adFlashMescla && r.flash) S.flash = window.adFlashMescla(S.flash || {}, r.flash);
      if (r.flg) S.flg = Object.assign({}, S.flg || {}, r.flg);
      if (r.sessoes) { var vs = {}; (S.sessoes || []).concat(r.sessoes).forEach(function (x) { vs[x.ts] = x; }); S.sessoes = Object.keys(vs).map(function (k) { return vs[k]; }).sort(function (a, b) { return a.ts - b.ts; }).slice(-200); }
      if (!g('v-inicio').hidden) pintaInicio();
    } catch (x) { }
  });
  var revela = function () { requestAnimationFrame(function () { raiz.classList.add('ad-pronto'); if (noShell) try { window.parent.postMessage({ ad: 'pronto' }, '*'); } catch (x) { } }); };
  /* auditoria 31/10: a pagina aparece com os icones ja no lugar (pacote ic.json); se demorar, aparece em 2,5 s e os icones entram quando chegarem */
  var jaRev = false, rv1 = function () { if (!jaRev) { jaRev = true; revela(); } };
  (ICO.pacote ? ICO.pacote.then(rv1, rv1) : rv1()); setTimeout(rv1, 2500);
})();
/* ==== fim design ==== */
