const D = JSON.parse(document.getElementById('dados').textContent);
const BANCO = D.banco, TEORIA = D.teoria;
const POR = {}; BANCO.forEach(q => POR[q.id] = q);
const MODS = {};
BANCO.forEach(q => { (MODS[q.modulo] = MODS[q.modulo] || []).push(q); });
const SUBS = {};
BANCO.forEach(q => { (SUBS[q.sub] = SUBS[q.sub] || []).push(q); });
Object.values(SUBS).forEach(l => l.sort((a, b) => a.dif - b.dif));
const NOMESUB = D.nomesub || {};
const KEY = 'saocamilo.por.v1';
// (havia aqui um carregaImagens() que buscava 'img/<id>.json' — pasta que não existe neste
//  aplicativo. Ninguém o chamava: os prints vêm dentro dos pacotes de res/. Removido.)
const $ = s => document.querySelector(s);

let S = { q: {}, ult: null, sims: [], tema: null };
try { const r = localStorage.getItem(KEY); if (r) S = Object.assign(S, JSON.parse(r)); } catch (e) { }
const salvaLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); window.__adSalvoOk = true; return true; } catch (e) { window.__adSalvoOk = false; try { if (window.adAvisaSemSalvar) window.adAvisaSemSalvar(); } catch (x) { } return false; } };
const salva = () => { salvaLocal(); agendaSync(); };

/* ---------- progresso salvo fora do navegador ---------- */
let DB = null, UID = null, DL = null, syncTimer = null, syncEstado = 'local';
function mesclaQ(a, b) {
  const out = {}, ids = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  ids.forEach(id => {
    const x = (a || {})[id], y = (b || {})[id];
    if (!x) { out[id] = y; return; }
    if (!y) { out[id] = x; return; }
    const porTs = {};
    (x.tent || []).concat(y.tent || []).forEach(t => { porTs[t.ts] = t; });
    out[id] = { tent: Object.values(porTs).sort((p, q) => p.ts - q.ts), rev: !!(x.rev || y.rev) };
  });
  return out;
}
function mesclaSims(a, b) {
  const porTs = {};
  (a || []).concat(b || []).forEach(x => { porTs[x.ts] = x; });
  return Object.values(porTs).sort((p, q) => p.ts - q.ts);
}
function refProgresso() { return DB && UID ? DB.doc('data/users/' + UID + '/prog_' + String(KEY).split('.')[1]) : null; }
async function escreveRemoto() {
  const ref = refProgresso(); if (!ref) return;
  try { await ref.set({ q: S.q, sims: S.sims || [], flash: S.flash || {}, flg: S.flg || {}, sessoes: (S.sessoes || []).slice(-200), atualizado: Date.now() }); syncEstado = 'conta'; }
  catch (e) { syncEstado = e && e.code === 'invalid_argument' ? 'semPermissao' : 'erro'; }
  pintaSync();
}
function agendaSync() {
  if (!refProgresso()) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(escreveRemoto, 1500);
}
function pintaSync() {
  const txt = {
    conta: 'Progresso salvo na sua conta: ele volta em qualquer aparelho em que você abrir esta página, mesmo se limpar o navegador.',
    local: 'Progresso salvo só neste navegador. Se limpar os dados do navegador ou trocar de aparelho, ele se perde — use o botão de baixar, em Progresso.',
    semPermissao: 'Não consegui salvar na sua conta (esta visualização não tem permissão de escrita). Seu progresso está salvo neste navegador.',
    erro: 'Falha ao salvar na sua conta agora. Seu progresso continua salvo neste navegador e eu tento de novo na próxima resposta.'
  }[syncEstado] || '';
  const a = document.getElementById('sync'); if (a) a.textContent = txt;
  const b = document.getElementById('sync2'); if (b) b.textContent = txt;
}
(async function iniciaCapacidades() {
  try {
    const temUse = !!(window.claude && window.claude.use);
    let [db, user, dl] = !temUse ? [null, null, null] : await Promise.all([
      claude.use('db').catch(() => null),
      claude.use('user').catch(() => null),
      claude.use('downloads').catch(() => null)
    ]);
    if (!(db && user) && window.parent !== window) {
      /* ponte: a pagina principal guarda o progresso na conta */
      const pend = {}; let seq = 0;
      addEventListener('message', ev => { const m = ev.data; if (ev.origin === location.origin && ev.source === parent && m && m.ponte === 'res' && pend[m.n]) { pend[m.n](m); delete pend[m.n]; } });
      const chama = (op, caminho, dados) => new Promise((ok, no) => {
        const n = ++seq; const t = setTimeout(() => { delete pend[n]; no({ code: 'timeout' }); }, 8000);
        pend[n] = m => { clearTimeout(t); m.erro ? no({ code: m.erro }) : ok(m); };
        parent.postMessage({ ponte: 'req', n, op, caminho, dados }, location.origin && location.origin !== 'null' ? location.origin : '*');
      });
      try {
        await chama('oi');
        db = { doc: c => ({ get: async () => { const m = await chama('get', c); return { exists: m.existe, data: () => m.dados }; }, set: d => chama('set', c, d), delete: () => chama('del', c) }) };
        user = { id: async () => 'eu' };
      } catch (e) { }
    }
    DL = dl || null;
    const bex = document.getElementById('b-export');
    if (bex && !DL) bex.textContent = 'Copiar meu progresso (sem download aqui)';
    if (db && user) {
      const id = await user.id().catch(() => null);
      if (id) {
        DB = db; UID = id;
        const snap = await refProgresso().get().catch(() => null);
        if (snap && snap.exists) {
          const r = snap.data() || {};
          S.q = mesclaQ(S.q, r.q); S.sims = mesclaSims(S.sims, r.sims);
          S.flash = window.adFlashMescla ? window.adFlashMescla(S.flash, r.flash) : Object.assign({}, r.flash || {}, S.flash || {}); S.flg = Object.assign({}, r.flg || {}, S.flg || {}); if (r.sessoes) { const vs = {}; (S.sessoes || []).concat(r.sessoes).forEach(x => { vs[x.ts] = x; }); S.sessoes = Object.values(vs).sort((a, b) => a.ts - b.ts).slice(-200); }
          salvaLocal();
          const v = ['inicio', 'estudar', 'escada', 'simulado', 'progresso'].find(x => !document.getElementById('v-' + x).hidden);
          if (v === 'inicio') pintaInicio(); else if (v === 'progresso') pintaProgresso();
          else if (v === 'escada' && subAtual) pintaEscada(subAtual); else if (v === 'estudar') pintaModulos();
        }
        /* legado v20: o progresso de todas as materias ia para um documento so (.../progresso) */
        try { const lg = await DB.doc('data/users/' + UID + '/progresso').get(); if (lg && lg.exists) { const r2 = lg.data() || {}, q2 = {}; Object.keys(r2.q || {}).forEach(k => { if (POR[k]) q2[k] = r2.q[k]; }); if (Object.keys(q2).length) { S.q = mesclaQ(S.q, q2); salvaLocal(); } } } catch (e) { }
        syncEstado = 'conta';
        await escreveRemoto();
      }
    }
  } catch (e) { syncEstado = 'erro'; }
  pintaSync();
})();

/* ---------- tema ---------- */
const aplicaTema = () => S.tema ? document.documentElement.setAttribute('data-theme', S.tema) : document.documentElement.removeAttribute('data-theme');
aplicaTema();
$('#btema').onclick = () => {
  const esc = S.tema ? S.tema === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  S.tema = esc ? 'light' : 'dark'; aplicaTema(); salva();
};

/* ---------- estatística ---------- */
const est = id => S.q[id] || null;
const tentativas = id => (est(id) ? est(id).tent : []);
const acertou = id => tentativas(id).some(t => t.ok);
const respondida = id => tentativas(id).length > 0;
function taxa(lista) {
  const t = lista.flatMap(q => tentativas(q.id));
  return t.length ? Math.round(100 * t.filter(x => x.ok).length / t.length) : null;
}
const domSub = s => { const l = (SUBS[s] || []).filter(q => q.degrau); return l.length ? l.filter(q => acertou(q.id)).length / l.length : 0; };
const domMod = m => { const l = MODS[m] || []; return l.length ? l.filter(q => acertou(q.id)).length / l.length : 0; };
const nomeSub = s => NOMESUB[s] || s;
const FAIXA = d => d <= 2 ? ['Iniciante', 'dif1'] : d <= 4 ? ['Intermediário', 'dif2'] : d === 5 ? ['Avançado', 'dif3'] : d === 6 ? ['Vestibular', 'dif4'] : ['Vestibular+', 'dif4'];
const rotuloDif = d => d <= 2 ? ['Iniciante', 'dif1'] : d <= 4 ? ['Intermediário', 'dif2'] : d <= 5 ? ['Avançado', 'dif3'] : d === 6 ? ['Vestibular', 'dif4'] : ['Vestibular+', 'dif4'];

/* ---------- navegação ---------- */
let ctx = null;   // {lista:[ids], i, origem, sim}
function vai(v) {
  if (typeof fechaLupa === 'function') fechaLupa();
  ['inicio', 'estudar', 'escada', 'questao', 'simulado', 'progresso'].forEach(x => { const e = document.getElementById('v-' + x); if (e) e.hidden = x !== v; });
  document.querySelectorAll('nav.bot button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  scrollTo(0, 0);
  if (v === 'inicio') pintaInicio();
  if (v === 'estudar') pintaModulos();
  if (v === 'simulado') pintaSimulados();
  if (v === 'progresso') pintaProgresso();
}
document.querySelectorAll('nav.bot button').forEach(b => b.onclick = () => {
  if (b.dataset.v === 'questao') return;
  vai(b.dataset.v);
});

/* ---------- tela inicial ---------- */
function pintaInicio() {
  const resp = BANCO.filter(q => respondida(q.id)).length;
  const tudo = BANCO.flatMap(q => tentativas(q.id));
  $('#k-q').textContent = BANCO.length;
  $('#k-resp').textContent = resp;
  $('#k-acerto').textContent = tudo.length ? Math.round(100 * tudo.filter(t => t.ok).length / tudo.length) + '%' : '—';
  const subs = Object.keys(SUBS);
  $('#k-sub').textContent = subs.length;
  $('#k-conc').textContent = subs.filter(s => domSub(s) >= 0.8).length;
  const fracos = subs.filter(s => { const t = taxa(SUBS[s]); return t !== null && t < 60; });
  $('#k-ref').textContent = fracos.length;
  if (!resp) {
    $('#i-tit').textContent = 'Comece pelos fundamentos';
    $('#i-sub').textContent = BANCO.length + ' questões reais, organizadas em escadas por conteúdo, da mais fácil para a mais difícil. Parte vem de listas públicas de exercícios, parte de provas de vestibular. Nenhuma foi inventada aqui, e cada uma traz o link da fonte. Suba um degrau por vez.';
  } else {
    const t = Math.round(100 * tudo.filter(x => x.ok).length / tudo.length);
    $('#i-tit').textContent = resp + ' de ' + BANCO.length + ' questões feitas';
    $('#i-sub').textContent = 'Acerto de ' + t + '%. ' + (fracos.length ? 'Os conteúdos abaixo são os que mais te derrubaram.' : 'Nenhum conteúdo abaixo de 60% de acerto até agora.');
  }
  const td = $('#treino-dica');
  if (td) {
    const t = treinoDeHoje(12);
    td.textContent = !t.lista.length
      ? 'Banco todo respondido — use o simulado ou refaça as marcadas.'
      : (t.revisao
          ? t.revisao + ' questões que você errou + ' + t.novas + ' novas, escolhidas nos conteúdos em que você está mais fraco.'
          : t.novas + ' questões novas, começando pelos degraus mais baixos dos conteúdos que você ainda não tocou.');
  }
  const ref = $('#reforco'); ref.innerHTML = '';
  const ordem = fracos.map(s => [s, taxa(SUBS[s])]).sort((a, b) => a[1] - b[1]).slice(0, 6);
  if (!ordem.length) ref.innerHTML = '<div class="vazio"><b>Sem dados ainda</b>Responda algumas questões e os conteúdos fracos aparecem aqui.</div>';
  ordem.forEach(([s, t]) => {
    const d = document.createElement('div'); d.className = 'linha';
    d.innerHTML = '<span class="bolinha b-err"></span><span class="nm">' + nomeSub(s) + '</span><span class="mono" style="color:var(--errado)">' + t + '%</span>';
    d.style.cursor = 'pointer'; d.onclick = () => abrirSub(s);
    ref.appendChild(d);
  });
  const pr = {}; BANCO.forEach(q => { if (q.tipo === 'site') return; const k = q.escola + ' ' + q.ano; pr[k] = (pr[k] || 0) + 1; });
  const pe = {}; BANCO.forEach(q => { if (q.tipo === 'site') return; pe[q.escola] = (pe[q.escola] || 0) + 1; });
  $('#procedencia').innerHTML = Object.entries(pe).sort((a, b) => b[1] - a[1]).map(([e, n]) =>
    '<div class="linha"><span class="nm">' + e + '</span><span class="mono">' + n + (n === 1 ? ' questão' : ' questões') + '</span></div>').join('');
}
$('#b-continuar').onclick = () => {
  if (S.ult && POR[S.ult]) return abrirQuestao(S.ult, null);
  // mesmo motivo do filtro em treinoDeHoje: "continuar" tem de cair numa escada, nao numa
  // questao solta de degrau 0. Se todas as de escada ja' foram respondidas, ai' sim o resto serve.
  const prox = BANCO.filter(q => q.degrau).sort((a, b) => a.dif - b.dif).find(q => !respondida(q.id))
             || BANCO.slice().sort((a, b) => a.dif - b.dif).find(q => !respondida(q.id));
  if (prox) abrirQuestao(prox.id, null); else vai('estudar');
};

/* ---------- estudar ---------- */
function pintaModulos() {
  const alvo = $('#modulos'); alvo.innerHTML = '';
  const tm = document.getElementById('tit-modulos');
  if (tm) tm.textContent = 'Português · ' + Object.keys(TEORIA).filter(m => MODS[m]).length + ' módulos';
  Object.keys(TEORIA).filter(m => MODS[m]).sort().forEach(m => {
    const info = TEORIA[m], qs = MODS[m], d = domMod(m);
    const det = document.createElement('details'); det.className = 'painel mod';
    const sum = document.createElement('summary');
    sum.innerHTML = '<span class="nm">' + info.nome + '<small>' + m + ' · ' + qs.length + (qs.length === 1 ? ' questão real' : ' questões reais') + '</small></span>' +
      '<span class="prog"><i style="width:' + (d * 100) + '%"></i></span><span class="pc">' + Math.round(d * 100) + '%</span>';
    det.appendChild(sum);
    const corpo = document.createElement('div'); corpo.className = 'corpo';
    const subs = [...new Set(qs.map(q => q.sub))].sort();
    corpo.innerHTML =
      '<div class="teoria"><p>' + info.resumo + '</p></div>' +
      '<div class="form">' + info.formulas.map(f => '<div>' + f + '</div>').join('') + '</div>' +
      '<div class="cuida"><b>Erro clássico</b>' + info.erro + '</div>' +
      subs.map(s => {
        const l = SUBS[s], deg = l.filter(q => q.degrau), feitas = deg.filter(q => acertou(q.id)).length;
        const falta = deg.length < 10 ? '<span class="falta">' + deg.length + (deg.length === 1 ? ' degrau só' : ' degraus') + '</span>' : '';
        return '<button class="sub" data-sub="' + s + '"><span class="t">' + nomeSub(s) + '</span>' + falta +
          '<span class="q">' + feitas + '/' + deg.length + '</span></button>';
      }).join('');
    corpo.querySelectorAll('[data-sub]').forEach(b => b.onclick = () => abrirSub(b.dataset.sub));
    det.appendChild(corpo); alvo.appendChild(det);
  });
  const completos = Object.keys(SUBS).filter(s => SUBS[s].filter(q => q.degrau).length >= 10).length;
  $('#aviso-cobertura').innerHTML = 'Cada conteúdo é uma escada: a questão mais fácil primeiro, a mais difícil por último. ' +
    'A ordem vem de comparar as questões do conteúdo umas com as outras, não de palpite isolado. ' +
    '<b>' + completos + '</b> conteúdos já têm 10 degraus ou mais; os outros mostram quantos têm hoje. ' +
    'Nenhum degrau foi preenchido com questão inventada: cada uma já estava publicada antes — em lista pública de exercícios ou em caderno de prova — com o gabarito publicado junto e o print da fonte aqui dentro.';
}
let subAtual = null;
function abrirSub(s) { subAtual = s; vai('escada'); pintaEscada(s); }
function escadaDe(s) {
  return (SUBS[s] || []).filter(q => q.degrau).sort((a, b) => a.degrau - b.degrau);
}
function extrasDe(s) { return (SUBS[s] || []).filter(q => !q.degrau).sort((a, b) => a.dif - b.dif); }
function pintaEscada(s) {
  const deg = escadaDe(s), ext = extrasDe(s);
  const feitos = deg.filter(q => acertou(q.id)).length;
  const prox = deg.find(q => !acertou(q.id));
  $('#e-tit').textContent = nomeSub(s).charAt(0).toUpperCase() + nomeSub(s).slice(1);
  const nSite = deg.filter(q => q.tipo === 'site').length;
  const nProva = deg.length - nSite;
  // A ordem dos degraus e' por dificuldade, nao por procedencia: numa escada mista a questao de
  // prova pode estar no meio e a de lista em cima. Por isso aqui so' se diz QUANTAS sao de cada
  // origem — dizer "as de baixo" seria desmentido pela propria lista logo abaixo.
  const composicao = (nSite && nProva)
    ? ' ' + nSite + (nSite === 1 ? ' degrau vem' : ' degraus vêm') + ' de lista pública de exercícios e ' +
      nProva + (nProva === 1 ? ' de prova de vestibular' : ' de provas de vestibular') +
      ' — o selo de cada degrau diz qual é qual, e cada questão traz o link da fonte.'
    : (nSite ? ' Todos vêm de listas públicas de exercícios, com o link da fonte em cada questão.'
             : ' Todos vêm de prova de vestibular, com o caderno original em cada questão.');
  $('#e-sub').textContent = (deg.length >= 10
    ? deg.length + ' degraus, da questão mais fácil deste conteúdo até a mais difícil. Você venceu ' + feitos + '.'
    : 'Este conteúdo tem ' + deg.length + (deg.length === 1 ? ' degrau só hoje' : ' degraus hoje') + ', do mais fácil para o mais difícil. Você venceu ' + feitos + '. Nenhuma lacuna foi preenchida com questão inventada.') + composicao;
  $('#e-volta').onclick = () => vai('estudar');
  const mod = TEORIA[s.split('.')[0]] || {};
  const cx = $('#e-teoria');
  if (cx) cx.innerHTML = mod.resumo
    ? '<details class="teoria-cx"><summary>a teoria que estas questões cobram</summary>' +
      '<p>' + mod.resumo + '</p>' +
      ((mod.formulas || []).length ? '<div class="formula">' +
        mod.formulas.map(f => '<code>' + f + '</code>').join('') + '</div>' : '') +
      '</details>'
    : '';
  const barra = '<div class="escadabar">' + deg.map(q => {
    const t = tentativas(q.id);
    const cl = acertou(q.id) ? 'ok' : (t.length ? 'er' : (prox && q.id === prox.id ? 'at' : ''));
    return '<i class="' + cl + '"></i>';
  }).join('') + '</div>';
  $('#e-degraus').innerHTML = barra + deg.map(q => {
    const [fx, cls] = FAIXA(q.dif);
    const t = tentativas(q.id);
    const est2 = acertou(q.id) ? 'feito' : (t.length ? 'errou' : '');
    const agora = prox && q.id === prox.id ? ' agora' : '';
    return '<button class="degrau ' + est2 + agora + '" data-id="' + q.id + '">' +
      '<span class="num">' + q.degrau + '</span>' +
      '<span class="inf"><b>' + (acertou(q.id) ? 'Vencido' : (t.length ? 'Tente de novo' : 'Degrau ' + q.degrau)) + '</b>' +
      '<small>' + esc(selo(q)) + '</small></span>' +   // nao ha campo 'tempo' em questao nenhuma deste banco
      '<span class="faixa ' + cls + '">' + fx + '</span></button>';
  }).join('');
  $('#e-degraus').querySelectorAll('[data-id]').forEach(b => b.onclick = () => {
    const lista = deg.map(q => q.id);
    ctx = { lista, i: lista.indexOf(b.dataset.id), origem: s };
    abrirQuestao(b.dataset.id, ctx);
  });
  $('#e-extras').innerHTML = ext.length
    ? '<h2 class="sec">Mais ' + ext.length + ' questões deste conteúdo, fora da escada</h2>' +
      '<div class="painel">' + ext.map(q => '<div class="linha" data-id="' + q.id + '" style="cursor:pointer">' +
        '<span class="bolinha ' + (acertou(q.id) ? 'b-ok' : (tentativas(q.id).length ? 'b-err' : '')) + '"></span>' +
        '<span class="nm">' + esc(selo(q)) + '</span>' +
        '<span class="mono">nível ' + q.dif + '</span></div>').join('') + '</div>'
    : '';
  $('#e-extras').querySelectorAll('[data-id]').forEach(b => b.onclick = () => {
    const lista = ext.map(q => q.id);
    ctx = { lista, i: lista.indexOf(b.dataset.id), origem: s };
    abrirQuestao(b.dataset.id, ctx);
  });
}

/* ---------- questão ---------- */
let t0 = 0, tTimer = null, tAcum = 0, tPausado = false;
function pintaCrono() {
  const s = Math.floor((tAcum + (tPausado ? 0 : Date.now() - t0)) / 1000);
  $('#q-crono').textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}
function iniciaCrono() {
  tAcum = 0; tPausado = false; t0 = Date.now();
  clearInterval(tTimer); tTimer = setInterval(pintaCrono, 1000); pintaCrono();
  const b = $('#q-pausa');
  if (b) { b.hidden = false; b.textContent = '⏸'; b.classList.remove('pausado'); b.setAttribute('aria-label', 'pausar'); b.onclick = alternaPausa; }
}
function alternaPausa() {
  if (tPausado) { t0 = Date.now(); tPausado = false; clearInterval(tTimer); tTimer = setInterval(pintaCrono, 1000); }
  else { tAcum += Date.now() - t0; tPausado = true; clearInterval(tTimer); }
  const b = $('#q-pausa');
  if (b) { b.textContent = tPausado ? '▶' : '⏸'; b.classList.toggle('pausado', tPausado); b.setAttribute('aria-label', tPausado ? 'retomar' : 'pausar'); }
  pintaCrono();
}
function abrirQuestao(id, contexto) {
  ctx = contexto || ctx;
  const q = POR[id]; if (!q) return;
  S.ult = id; salva();
  vai('questao');
  $('#q-cont').textContent = ctx && ctx.lista ? (ctx.i + 1) + ' de ' + ctx.lista.length : '';
  $('#q-volta').onclick = () => { clearInterval(tTimer); if (ctx && ctx.sim) return vai('simulado'); if (subAtual) { vai('escada'); pintaEscada(subAtual); } else vai('estudar'); };
  iniciaCrono();
  desenhaQuestao(q, null);
}
function alternativasHTML(q, marcada, corrigida) {
  return 'ABCDE'.split('').map(L => {
    const conteudo = q.tipo === 'imagem'
      ? '<img src="' + q.imgalts[L].src + '" alt="alternativa ' + L + '">'
      : (q.alts[L] || '');
    let cls = 'alt';
    if (corrigida) { if (L === q.gab) cls += ' certo'; else if (L === marcada) cls += ' errado'; }
    else if (L === marcada) cls += ' sel';
    return '<button class="' + cls + '" data-l="' + L + '"><span class="bol">' + L + '</span><span class="co">' + conteudo + '</span></button>';
  }).join('');
}
function selo(q) {
  if (q.tipo === 'site') return q.fonte || 'lista de exercícios';
  return (q.escola || '') + ' ' + (q.ano || '') + (q.n ? ' · questão ' + q.n : '');
}
function origem(q) {
  // de onde a questao veio: prova oficial ou lista publica de exercicios
  if (q.tipo === 'site') {
    const f = q.fonte || 'lista pública de exercícios';
    return { selo: f, legenda: 'Questão de uma lista pública de exercícios (' + f + '), ' +
             'com o gabarito publicado na própria página e a conta refeita e conferida aqui. ',
             link: q.url, rotulo: 'abrir a questão no site' };
  }
  const nq = q.n ? ', questão ' + q.n : '';
  const fase = q.fase ? ' (' + q.fase + ')' : '';
  return { selo: q.escola + ' ' + q.ano,
           legenda: 'Prova oficial ' + q.escola + ' ' + q.ano + fase + nq +
                    (q.banca ? ', banca ' + q.banca : '') + '. ',
           link: q.url, rotulo: 'abrir o caderno em PDF' };
}
async function desenhaQuestao(q, marcada) {
  if (typeof fechaLupa === 'function') fechaLupa();
  printAtual = null;          // o print da questao anterior nao abre mais
  const [rot, cls] = rotuloDif(q.dif);
  const h = tentativas(q.id);
  const corpo = $('#q-corpo');
  const temPrint = true;
  const o = origem(q);
  // o print vem dentro do pacote do conteudo (base64), nao como arquivo solto
  const prova = '<div class="print">' +
    '<div class="carregando" id="q-print-espera">carregando a questão…</div>' +
    '<img id="q-print" hidden decoding="async" ' +
    'alt="' + esc(q.tipo === 'site' ? 'questão de ' + o.selo : (q.n ? 'questão ' + q.n + ' da prova ' : 'questão da prova ') + q.escola + ' ' + q.ano) +
    ', como ela aparece na fonte">' +
    '<div class="print-pe">' + esc(o.selo + (q.tipo === 'site' || !q.n ? '' : ' · questão ' + q.n)) + '</div></div>';
  corpo.innerHTML =
    '<div class="qmeta entra">' +
    (q.degrau ? '<span class="tag dif ' + FAIXA(q.dif)[1] + '">Degrau ' + q.degrau + ' de ' + ((SUBS[q.sub] || []).filter(x => x.degrau).length || 10) + ' · ' + FAIXA(q.dif)[0] + '</span>'
              : '<span class="tag dif ' + cls + '">' + rot + '</span>') +
    '<span class="tag">' + esc(o.selo + (q.tipo !== 'site' && q.n ? ' · nº ' + q.n + ' na prova' : '')) + '</span>' +
    '</div>' +   // a etiqueta "~N min" saiu: le um campo 'tempo' que o banco nao tem
    '<div class="entra2">' + prova +
    (q.nota_fonte ? '<div class="nota-fonte">' + esc(q.nota_fonte) + '</div>' : '') +
    '<div class="bolhas" id="bolhas">' + 'ABCDE'.split('').map(L =>
      '<button class="bolha" data-l="' + L + '">' + L + '</button>').join('') + '</div>' +
    '<div class="acoes"><button class="btn" id="b-conf">Confirmar resposta</button>' +
    '<button class="btn sec" style="margin-top:0" id="b-rev">' + (est(q.id) && est(q.id).rev ? '★ na revisão' : '☆ revisar depois') + '</button></div>' +
    (q.pista ? '<button class="b-pista" id="b-pista">não sei por onde começar · ver uma pista</button>' +
      '<div class="pista-box" id="pista-box" hidden><b>Pista</b>' + esc(q.pista) + '</div>' : '') +
    (temPrint && q.enun ? '<button class="texto-toggle" id="b-texto">＋ ler a questão em texto</button>' +
      '<div class="texto-box" id="texto-box" hidden>' + esc(q.enun) +
      'ABCDE'.split('').map(L => '<div class="alt-t"><b>' + L + ')</b> ' + esc((q.alts || {})[L]) + '</div>').join('') + '</div>' : '') +
    '<details class="ficha"><summary>de onde vem esta questão' + (h.length ? ' · suas tentativas' : '') + '</summary>' +
    '<div class="fonte">' + esc(o.legenda) +
    (o.link ? '<a href="' + o.link + '" target="_blank" rel="noopener">' + o.rotulo + '</a>' : '') +
    (h.length ? '<br>Suas tentativas: ' + h.map(t => (t.ok ? '✔' : '✘') + t.letra).join(' · ') : '') +
    '</div></details></div>';
  let sel = marcada;
  corpo.querySelectorAll('#bolhas .bolha').forEach(b => b.onclick = () => {
    sel = b.dataset.l;
    corpo.querySelectorAll('#bolhas .bolha').forEach(x => x.classList.toggle('sel', x.dataset.l === sel));
  });
  $('#b-conf').onclick = () => { if (!sel) { $('#b-conf').textContent = 'Escolha uma letra primeiro (A–E)'; return; } confirma(q, sel); };
  $('#b-rev').onclick = () => {
    const e = S.q[q.id] = S.q[q.id] || { tent: [], rev: false };
    e.rev = !e.rev; salva(); $('#b-rev').textContent = e.rev ? '★ na revisão' : '☆ revisar depois';
  };
  const bt = document.getElementById('b-texto');
  if (bt) bt.onclick = () => {
    const cx = $('#texto-box'); cx.hidden = !cx.hidden;
    bt.textContent = (cx.hidden ? '＋' : '－') + ' ler a questão em texto';
  };
  carregaRes(q.id).then(r => {
    const img = document.getElementById('q-print');
    const esp = document.getElementById('q-print-espera');
    if (!img || !r || !r.img) { if (esp) esp.textContent = 'não consegui carregar o print desta questão'; return; }
    img.onload = () => {
      const corte = aparaRodapeDaFonte(img, q);
      img.hidden = false; if (esp) esp.remove();
      ligaPrintAmpliavel(img, q, o, corte);
    };
    img.onerror = () => { if (esp) esp.textContent = 'não consegui carregar o print desta questão'; };
    img.src = r.img;
  }).catch(() => {
    const esp = document.getElementById('q-print-espera');
    if (esp) esp.textContent = 'não consegui carregar o print desta questão';
  });
  const bpi = document.getElementById('b-pista');
  if (bpi) bpi.onclick = () => { $('#pista-box').hidden = false; bpi.hidden = true; };
}

/* O print das questões de lista pública traz, no rodapé, o botão do próprio site —
   "VER JUSTIFICATIVA" (degradê ciano-rosa, à esquerda) ou "Ver resposta" (azul, à direita).
   Conferido pixel a pixel nos prints deste banco: o degradê vem do Brasil Escola e o azul do
   Mundo Educação — e nao o contrario, como dizia a primeira versao deste comentario. Na imagem
   ele não faz nada: o aluno toca e não acontece coisa alguma, e ainda oferece um atalho para o
   gabarito, que é exatamente o que esta tela segura até ele responder.
   Em vez de cortar um número fixo de pixels (que variava de 39 a 81 conforme o print e chegava
   a comer a borda da última alternativa), aqui a faixa colorida do botão é MEDIDA na própria
   imagem e o corte para no topo dela. Conferido em TODOS os prints de lista deste banco: todos
   têm exatamente uma faixa colorida embaixo, de 27 a 37 px de altura e 90 a 138 px de largura,
   e abaixo dela só há margem branca. Se a medida não bater com esse formato — faixa alta demais,
   larga demais, longe demais do pé, ou canvas indisponível — o print fica inteiro.
   Devolve a altura cortada (ou 0), que a questão ampliada reusa para cortar igual. */
function aparaRodapeDaFonte(img, q) {
  if (!q || q.tipo !== 'site') return 0;
  const W = img.naturalWidth, H = img.naturalHeight;
  if (!W || H < 200) return 0;
  const faixa = Math.min(160, H >> 1);
  let topo;
  try {
    const c = document.createElement('canvas');
    c.width = W; c.height = faixa;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, H - faixa, W, faixa, 0, 0, W, faixa);
    const px = g.getImageData(0, 0, W, faixa).data;
    // Por linha: cor cheia (acha a faixa), cor fraca (acha a borda anti-serrilhada dela),
    // e tinta escura (o texto preto do enunciado e das alternativas — o botão nunca cai aqui,
    // porque o ciano e o rosa dele têm componente máxima 232).
    const col = new Int32Array(faixa), fra = new Int32Array(faixa), esc = new Int32Array(faixa);
    for (let y = 0; y < faixa; y++) {
      let n = 0, f = 0, e = 0, o = y * W * 4;
      for (let x = 0; x < W; x++, o += 4) {
        const r = px[o], v = px[o + 1], b = px[o + 2];
        const mx = r > v ? (r > b ? r : b) : (v > b ? v : b);
        const mn = r < v ? (r < b ? r : b) : (v < b ? v : b);
        if (mx - mn > 60) n++; else if (mx - mn > 18) f++;
        if (mx < 150) e++;
      }
      col[y] = n; fra[y] = n + f; esc[y] = e;
    }
    // 1. a faixa colorida mais baixa
    let base = -1;
    for (let y = faixa - 1; y >= 0; y--) { if (col[y] > 25) { base = y; break; } }
    if (base < 0) return 0;
    topo = base;
    while (topo - 1 >= 0 && col[topo - 1] > 25) topo--;
    // 2. onde ela começa e termina na horizontal (serve de trava e, já agora, de máscara)
    let xmin = W, xmax = -1;
    for (let y = topo; y <= base; y++) {
      let o = y * W * 4;
      for (let x = 0; x < W; x++, o += 4) {
        const r = px[o], v = px[o + 1], b = px[o + 2];
        const mx = r > v ? (r > b ? r : b) : (v > b ? v : b);
        const mn = r < v ? (r < b ? r : b) : (v < b ? v : b);
        if (mx - mn > 60) { if (x < xmin) xmin = x; if (x > xmax) xmax = x; }
      }
    }
    if (xmax < 0) return 0;
    if (xmax - xmin + 1 > W * 0.4) return 0;   // larga demais: é figura, não botão
    // 3. a faixa cheia tem 1 a 2 linhas de borda anti-serrilhada por cima. Sem cortá-las elas
    //    vazam como um fio de cor na borda do print: a imagem é desenhada em escala fracionária
    //    (0,40 no celular) e meia linha da origem vira uma linha inteira na tela.
    let halo = 0;
    while (topo - 1 - halo >= 0 && halo < 8 && fra[topo - 1 - halo] > 0) halo++;
    topo -= halo;
    // 4. o corte não pode atravessar o texto do aluno. Num print de português o botão encosta
    //    na última alternativa e o corte passava pelo rabo do "p" e do "g" de "silepse de
    //    gênero". Aqui só conta a tinta escura FORA das colunas do botão: dentro delas o escuro
    //    é o anti-serrilhado da própria legenda branca do botão, e contá-lo faria o corte descer
    //    até embaixo da faixa — ou seja, deixaria o botão inteiro na tela.
    const e0 = Math.max(0, xmin - 6), e1 = Math.min(W - 1, xmax + 6);
    const tintaFora = (y) => {
      let n = 0, o = y * W * 4;
      for (let x = 0; x < W; x++, o += 4) {
        if (x >= e0 && x <= e1) continue;
        const r = px[o], v = px[o + 1], b = px[o + 2];
        const mx = r > v ? (r > b ? r : b) : (v > b ? v : b);
        if (mx < 150 && ++n >= 2) return true;
      }
      return false;
    };
    while (topo < base && tintaFora(topo)) topo++;
    // 5. travas: se a medida não tem o formato de botão, o print fica inteiro
    if (base - topo + 1 > 48) return 0;        // faixa alta demais: é figura, não botão
    if (faixa - topo > 120) return 0;          // longe demais do pé da imagem
  } catch (e) { return 0; }                    // sem canvas: print inteiro, como estava
  const novoH = H - faixa + topo;
  if (novoH < H * 0.4) return 0;
  aplicaCorte(img, W, novoH);
  // o corte encosta na última alternativa; esta folga devolve a margem branca que o botão ocupava
  img.style.marginBottom = '10px';
  return novoH;
}
// O corte e' feito pela CAIXA da imagem, nao recortando os pixels: a proporcao fica menor que a
// natural e o object-fit/position corta o pe'. Vale igual na tela da questao e na ampliada.
function aplicaCorte(img, W, novoH) {
  img.style.aspectRatio = W + ' / ' + novoH;
  img.style.height = 'auto';
  img.style.objectFit = 'cover';
  img.style.objectPosition = 'top';
}

/* ---------- a questão ampliada ---------- */
// No celular de 390 px o print de 900 e' desenhado com ~356: o enunciado da fonte cai para algo
// em torno de 6 px de CSS, e e' A leitura principal do aplicativo. Tocar no print abre esta
// camada, que rola e amplia ate' 4x, com teclado tambem. Ela usa a MESMA imagem e o MESMO corte
// do rodape do site; nada da resolucao nem do gabarito entra aqui.
const ZOOMS = [1, 1.5, 2, 3, 4];
let lupaZ = 0, lupaVolta = null, printAtual = null;
function elLupa() { return document.getElementById('lupa'); }
function abreLupa() {
  const L = elLupa();
  if (!L || !printAtual) return;
  const im = document.getElementById('lupa-img'), rolo = document.getElementById('lupa-rolo');
  document.getElementById('lupa-tit').textContent = printAtual.selo;
  im.removeAttribute('style');
  im.alt = printAtual.alt;
  im.src = printAtual.src;
  if (printAtual.corte) aplicaCorte(im, printAtual.largura, printAtual.corte);
  lupaVolta = document.activeElement;
  L.hidden = false;
  document.documentElement.classList.add('lupa-aberta');
  lupaZ = 0; aplicaZoom();
  rolo.scrollTop = 0; rolo.scrollLeft = 0; rolo.focus();
}
function fechaLupa() {
  const L = elLupa();
  if (!L || L.hidden) return;
  L.hidden = true;
  document.documentElement.classList.remove('lupa-aberta');
  document.getElementById('lupa-img').removeAttribute('src');
  if (lupaVolta && lupaVolta.focus) lupaVolta.focus();
  lupaVolta = null;
}
function aplicaZoom() {
  const z = ZOOMS[lupaZ], pap = document.querySelector('#lupa .lupa-papel');
  const rolo = document.getElementById('lupa-rolo');
  // "na tela" = o print inteiro na largura util, sem passar dos 900 px que ele tem de verdade
  // (em janela larga, esticar alem disso so' borraria). Os niveis acima multiplicam essa base.
  if (pap && rolo) {
    const base = Math.min(rolo.clientWidth - 22, 900);
    pap.style.width = Math.round(Math.max(200, base) * z) + 'px';
  }
  const n = document.getElementById('lupa-nivel');
  if (n) n.textContent = lupaZ === 0 ? 'na tela' : String(z).replace('.', ',') + '×';
  const bm = document.getElementById('lupa-menos'), bp = document.getElementById('lupa-mais');
  if (bm) bm.disabled = lupaZ === 0;
  if (bp) bp.disabled = lupaZ === ZOOMS.length - 1;
}
function mudaZoom(d) {
  const antes = lupaZ;
  lupaZ = Math.max(0, Math.min(ZOOMS.length - 1, lupaZ + d));
  if (lupaZ === antes) return;
  const rolo = document.getElementById('lupa-rolo');
  // mantem o meio do que o aluno estava vendo no meio depois de ampliar — mas so' na horizontal
  // quando ele JA' estava rolando de lado. Se o print ainda cabia na largura, ampliar e centralizar
  // jogaria a margem esquerda para fora, e e' por ela que se comeca a ler.
  const cabia = rolo.scrollWidth <= rolo.clientWidth + 1;
  const fx = rolo.scrollWidth ? (rolo.scrollLeft + rolo.clientWidth / 2) / rolo.scrollWidth : .5;
  const fy = rolo.scrollHeight ? (rolo.scrollTop + rolo.clientHeight / 2) / rolo.scrollHeight : 0;
  aplicaZoom();
  requestAnimationFrame(() => {
    rolo.scrollLeft = cabia ? 0 : fx * rolo.scrollWidth - rolo.clientWidth / 2;
    rolo.scrollTop = fy * rolo.scrollHeight - rolo.clientHeight / 2;
  });
}
(function ligaLupa() {
  const L = elLupa(); if (!L) return;
  document.getElementById('lupa-fecha').onclick = fechaLupa;
  document.getElementById('lupa-mais').onclick = () => mudaZoom(1);
  document.getElementById('lupa-menos').onclick = () => mudaZoom(-1);
  document.getElementById('lupa-rolo').ondblclick = () => mudaZoom(lupaZ === ZOOMS.length - 1 ? -lupaZ : 1);
  // girar o aparelho muda a largura util: o "na tela" tem de acompanhar
  addEventListener('resize', () => { if (!L.hidden) aplicaZoom(); });
  L.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); fechaLupa(); return; }
    if (e.key === '+' || e.key === '=') { e.preventDefault(); mudaZoom(1); return; }
    if (e.key === '-' || e.key === '_') { e.preventDefault(); mudaZoom(-1); return; }
    if (e.key === '0') { e.preventDefault(); lupaZ = 0; aplicaZoom(); return; }
    if (e.key !== 'Tab') return;
    // o foco nao sai da camada enquanto ela esta aberta
    const foc = [document.getElementById('lupa-menos'), document.getElementById('lupa-mais'),
                 document.getElementById('lupa-fecha'), document.getElementById('lupa-rolo')]
                .filter(b => b && !b.disabled);
    const i = foc.indexOf(document.activeElement);
    const prox = e.shiftKey ? (i <= 0 ? foc.length - 1 : i - 1) : (i === foc.length - 1 ? 0 : i + 1);
    e.preventDefault(); foc[prox].focus();
  });
})();
// faz do print um alvo de toque e de teclado, so' depois que a imagem apareceu
function ligaPrintAmpliavel(img, q, o, corte) {
  printAtual = { src: img.src, alt: img.alt, largura: img.naturalWidth, corte: corte,
                 selo: o.selo + (q.tipo === 'site' || !q.n ? '' : ' · questão ' + q.n) };
  const cx = img.closest('.print'); if (!cx) return;
  cx.tabIndex = 0;
  cx.setAttribute('role', 'button');
  cx.setAttribute('aria-label', 'ampliar esta questão em tela cheia, para ler melhor');
  cx.onclick = abreLupa;
  cx.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); abreLupa(); }
  };
  const pe = cx.querySelector('.print-pe');
  if (pe && !pe.querySelector('.print-lupa')) {
    const d = document.createElement('span');
    d.className = 'print-lupa'; d.textContent = '⤢ ampliar'; d.setAttribute('aria-hidden', 'true');
    pe.insertBefore(d, pe.firstChild);
  }
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const RES = {};
const PACOTES = {};
async function carregaRes(id) {
  if (RES[id]) return RES[id];
  const q = POR[id]; if (!q) throw new Error('questão desconhecida');
  const nome = q.sub;
  if (!PACOTES[nome]) {
    PACOTES[nome] = fetch('res/' + nome + '.json', { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error('res ' + r.status); return r.json(); })
      .then(p => { Object.assign(RES, p); return p; });
  }
  await PACOTES[nome];
  if (!RES[id]) throw new Error('resolução ausente');
  return RES[id];
}

/* ---------- resolução v2: antes · passos · resposta · conferência · erradas · armadilha ---------- */

/* ---------- forma nova: "Em uma olhada", tipo do passo, figura, glossario ----------
   Base: dual coding (Paivio; Mayer). O sinal visual entra onde CODIFICA informacao -- o
   tipo de raciocinio do passo, a figura que mostra estrutura espacial/processo -- e nunca
   como enfeite. Tudo e' opcional nos dados: resolucao sem esses campos renderiza como antes. */
const GLOSS = D.glossario || {};
const TIPOS = {
  localizar: ['◎', 'localizar'], eliminar: ['⊘', 'eliminar'], calcular: ['∑', 'calcular'],
  comparar: ['⇄', 'comparar'], concluir: ['✓', 'concluir']
};
function chipTipo(t) {
  const d = TIPOS[String(t || '').toLowerCase()];
  return d ? '<span class="tipo" aria-label="tipo do passo: ' + d[1] + '"><i>' + d[0] + '</i>' + d[1] + '</span>' : '';
}
// SVG escrito pelos professores, nao pelo aluno: ainda assim, nada executavel entra.
function svgSeguro(s) {
  s = String(s || '');
  if (!/^\s*<svg[\s>]/i.test(s)) return '';
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');
  s = s.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  s = s.replace(/(href|xlink:href)\s*=\s*("javascript:[^"]*"|'javascript:[^']*')/gi, '');
  s = s.replace(/<(iframe|object|embed|link|meta|style)[\s\S]*?>/gi, '');
  return s;
}
function blocoFigura(f) {
  if (!f || !f.svg) return '';
  const svg = svgSeguro(f.svg);
  if (!svg) return '';
  return '<figure class="figura">' + svg + (f.legenda ? '<figcaption>' + esc(f.legenda) + '</figcaption>' : '') + '</figure>';
}
// Glossario ao toque: so' em texto corrido de ensino (porque/antes), nunca dentro de citacao.
const GLOSS_RE = (() => {
  const ks = Object.keys(GLOSS).filter(k => k.length > 2).sort((a, b) => b.length - a.length);
  if (!ks.length) return null;
  return new RegExp('(^|[^\\p{L}])(' + ks.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?=[^\\p{L}]|$)', 'giu');
})();
function comGlossario(txt) {
  const h = esc(txt);
  if (!GLOSS_RE) return h;
  const visto = new Set();
  return h.replace(GLOSS_RE, (m, pre, termo) => {
    const k = termo.toLowerCase();
    if (visto.has(k)) return m;           // so' a primeira ocorrencia vira toque
    visto.add(k);
    return pre + '<button type="button" class="gl" data-t="' + esc(k) + '">' + termo + '</button>';
  });
}
function abreGlossario(k) {
  const def = GLOSS[k] || GLOSS[Object.keys(GLOSS).find(x => x.toLowerCase() === k)];
  if (!def) return;
  let s = document.getElementById('gl-sheet');
  if (!s) {
    s = document.createElement('div'); s.id = 'gl-sheet'; s.className = 'gl-sheet'; s.setAttribute('role', 'dialog');
    s.innerHTML = '<div class="gl-caixa"><b id="gl-t"></b><p id="gl-d"></p><button type="button" class="gl-fecha">fechar</button></div>';
    document.body.appendChild(s);
    s.addEventListener('click', e => { if (e.target === s || e.target.classList.contains('gl-fecha')) s.hidden = true; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') s.hidden = true; });
  }
  document.getElementById('gl-t').textContent = k;
  document.getElementById('gl-d').textContent = typeof def === 'string' ? def : (def.def || def.texto || '');
  s.hidden = false;
}
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('button.gl');
  if (b) abreGlossario(b.getAttribute('data-t'));
});
function blocoEssencial(r) {
  const e = r.essencial;
  if (!e || !(e.pede || e.chave || e.cuidado)) return '';
  const linha = (cls, rot, txt) => txt ? '<div class="ess ' + cls + '"><span class="ess-r">' + rot + '</span><p>' + comGlossario(txt) + '</p></div>' : '';
  return '<div class="bloco essencial"><h3>Em uma olhada</h3>' +
    linha('pede', 'pede', e.pede) + linha('chave', 'decide', e.chave) + linha('cuidado', 'cuidado', e.cuidado) + '</div>';
}

function montaResolucao(q, letra, ok) {
  const r = q.r;
  if (!r) {   // segurança: questão ainda sem resolução nova
    const antigo = q.tipo === 'imagem'
      ? '<p style="margin:0;font-size:17px;line-height:1.6">' + (q.expl && q.expl.correta || '') + '</p>'
      : '<ol class="passos">' + (q.passos || []).map(p => '<li>' + esc(p) + '</li>').join('') + '</ol>';
    return '<div class="bloco"><h3>Como se resolve</h3>' + antigo + '</div>' +
      (q.armadilha ? '<div class="bloco"><div class="armad"><b>A armadilha</b>' + esc(q.armadilha) + '</div></div>' : '');
  }
  let h = blocoEssencial(r);

  if (r.antes && (r.antes.texto || (r.antes.formulas || []).length)) {
    h += '<div class="bloco"><h3>Antes de tudo</h3><div class="antes">' +
      (r.antes.texto ? '<p>' + comGlossario(r.antes.texto) + '</p>' : '') +
      ((r.antes.formulas || []).length
        ? '<div class="formula">' + r.antes.formulas.map(f => '<code>' + esc(f) + '</code>').join('') + '</div>' : '') +
      ((r.antes.simbolos || []).length
        ? '<dl class="simbolos">' + r.antes.simbolos.map(p =>
            '<dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd>').join('') + '</dl>' : '') +
      '</div></div>';
  }

  h += '<div class="bloco"><h3>Passo a passo</h3>' +
    (r.passos || []).map((p, i) =>
      '<div class="passo"><div class="nn">' + (i + 1) + '</div><div>' +
      '<p class="faz">' + esc(p.faz) + chipTipo(p.tipo) + '</p>' +
      (p.conta ? '<p class="conta' + (String(p.conta).indexOf('\n') >= 0 ? ' bloco' : '') + '">' + esc(p.conta) + '</p>' : '') +
      blocoFigura(p.figura) +
      (p.porque ? '<p class="porque">' + comGlossario(p.porque) + '</p>' : '') +
      '</div></div>').join('') + '</div>';

  if (r.resposta) h += '<div class="bloco"><h3>Resposta</h3><div class="resp">' + esc(r.resposta) + '</div></div>';
  if (r.checagem) h += '<div class="bloco"><h3>Confira você mesmo</h3><p class="checa">' + esc(r.checagem) + '</p></div>';

  const er = r.erradas || {};
  const letras = 'ABCDE'.split('').filter(L => L !== q.gab && er[L]);
  if (letras.length) {
    const ordem = (!ok && er[letra]) ? [letra].concat(letras.filter(L => L !== letra)) : letras;
    h += '<div class="bloco"><h3>Por que as outras não servem</h3>' +
      ordem.map(L => {
        const sua = (!ok && L === letra);
        return '<div class="errada' + (sua ? ' sua' : '') + '"><div class="L">' + L + '</div><div>' +
          (sua ? '<span class="marca">você marcou esta</span>' : '') +
          '<p>' + esc(er[L]) + '</p></div></div>';
      }).join('') + '</div>';
  }

  if (r.armadilha || q.armadilha)
    h += '<div class="bloco"><div class="armad"><b>A armadilha</b>' + esc(r.armadilha || q.armadilha) + '</div></div>';
  if (r.alerta)
    h += '<div class="alerta-box"><b>Observação sobre esta questão:</b> ' + esc(r.alerta) + '</div>';
  return h;
}

async function confirma(q, letra) {
  clearInterval(tTimer);
  const ok = letra === q.gab;
  const e = S.q[q.id] = S.q[q.id] || { tent: [], rev: false };
  e.tent.push({ letra, ok, ts: Date.now(), seg: Math.round((Date.now() - t0) / 1000) });
  salva();
  if (ctx && ctx.sim) { ctx.respostas = ctx.respostas || {}; ctx.respostas[q.id] = ok; }
  const corpo = $('#q-corpo');
  corpo.querySelectorAll('#bolhas .bolha').forEach(b => {
    const L = b.dataset.l; b.classList.remove('sel');
    if (L === q.gab) b.classList.add('certo');
    else if (L === letra) b.classList.add('errado');
    else b.classList.add('apaga');
    b.onclick = null;
  });
  const acoes = corpo.querySelector('.acoes'); if (acoes) acoes.hidden = true;
  const bp = document.getElementById('b-pista'); if (bp) bp.hidden = true;
  const pb = document.getElementById('pista-box'); if (pb) pb.hidden = true;
  const espera = document.createElement('div');
  espera.className = 'veredito entra ' + (ok ? 'v1' : 'v0');
  espera.innerHTML = '<b>' + (ok ? 'Correto.' : 'Incorreto.') + '</b>' + (q.tipo === 'site' ? 'Gabarito da página' : 'Gabarito oficial') + ': <b style="display:inline">' + q.gab + '</b>.';
  corpo.appendChild(espera);
  espera.scrollIntoView({ behavior: 'smooth', block: 'start' });
  try { q.r = await carregaRes(q.id); } catch (err) { q.r = q.r || null; }
  espera.remove();
  const erradas = e.tent.filter(t => !t.ok).length;
  const bloco = document.createElement('div');
  bloco.innerHTML =
    '<div class="veredito entra ' + (ok ? 'v1' : 'v0') + '"><b>' + (ok ? 'Correto.' : 'Incorreto.') + '</b>' +
    (q.tipo === 'site' ? 'Gabarito da página' : 'Gabarito oficial') + ': <b style="display:inline">' + q.gab + '</b>.' +
    (q.conceito ? '<span class="oque">' + esc(q.conceito) + '</span>' : '') + '</div>' +
    '<div class="resolucao entra2">' + montaResolucao(q, letra, ok) +
    (erradas >= 2 ? '<div class="aviso-box" style="margin-top:18px"><b>Você já errou esta questão ' + erradas + ' vezes.</b> ' +
      'Volte à teoria de ' + TEORIA[q.modulo].nome + ' antes de tentar de novo.</div>' : '') +
    '</div>' +
    '<div class="acoes"><button class="btn" id="b-prox">' + (ctx && ctx.lista && ctx.i < ctx.lista.length - 1 ? 'Próxima questão' : 'Terminar') + '</button>' +
    '<button class="btn sec" style="margin-top:0" id="b-refaz">Refazer esta questão</button></div>' +
    (!ok ? '<button class="btn sec" id="b-teoria">Revisar a teoria de ' + ((TEORIA[q.modulo]||{}).nome || q.modulo) + '</button>' : '');
  corpo.appendChild(bloco);
  $('#b-refaz').onclick = () => { iniciaCrono(); desenhaQuestao(q, null); scrollTo(0, 0); };
  $('#b-prox').onclick = proxima;
  const bt = document.getElementById('b-teoria');
  if (bt) bt.onclick = () => { vai('estudar'); setTimeout(() => { const d = document.querySelectorAll('#modulos details')[Object.keys(TEORIA).filter(m => MODS[m]).sort().indexOf(q.modulo)]; if (d) { d.open = true; d.scrollIntoView({ block: 'center' }); } }, 60); };
  bloco.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function proxima() {
  if (ctx && ctx.lista && ctx.i < ctx.lista.length - 1) { ctx.i++; abrirQuestao(ctx.lista[ctx.i], ctx); return; }
  if (ctx && ctx.sim) return fimSimulado();
  if (ctx && ctx.treino) return fimTreino();
  if (ctx && ctx.origem) {
    vai('escada'); pintaEscada(ctx.origem); return;
  }
  if (false) {
    const l = SUBS[ctx.origem], ac = l.filter(q => acertou(q.id)).length;
    $('#q-corpo').innerHTML = '<div class="vazio"><b>Conteúdo concluído</b>Você acertou ' + ac + ' das ' + l.length +
      ' questões de ' + nomeSub(ctx.origem) + '.</div><button class="btn" id="b-volta2">Escolher outro conteúdo</button>';
    $('#b-volta2').onclick = () => vai('estudar');
    return;
  }
  vai('estudar');
}

/* ---------- simulados ---------- */
// Quais módulos mais caem: contado nas questões de prova DESTE banco, não escolhido a dedo.
// (Antes havia aqui uma lista de módulos de matemática, herdada da versão anterior do arquivo:
//  o simulado ficava com 0 questões e a descrição falava de combinatória e geometria.)
const MAIS_COBRADOS = Object.keys(MODS)
  .map(m => [m, MODS[m].filter(q => q.tipo === 'prova').length])
  .sort((a, b) => b[1] - a[1]).slice(0, 4).map(x => x[0]);
const NOMES_COBRADOS = (() => {
  const n = MAIS_COBRADOS.map(m => (TEORIA[m] || {}).nome || m);
  return n.length > 1 ? n.slice(0, -1).join(', ') + ' e ' + n[n.length - 1] : (n[0] || '');
})();
// As bancas proximas da prova do aluno, SO' as que existem neste banco: em portugues, por
// exemplo, nao ha nenhuma questao da Sao Camilo, e anunciar o nome dela seria mentir na tela.
const BANCAS_PROX = ['São Camilo', 'Santa Casa'].filter(b => BANCO.some(q => (q.escola || '').indexOf(b) >= 0));
const RE_PROX = new RegExp(BANCAS_PROX.map(b => b.split(' ').pop()).join('|') || '(?!)');
const N_PROX = BANCO.filter(q => RE_PROX.test(q.escola || '')).length;
const SIMS = [
  { id: 's5', nome: 'Simulado rápido', desc: '5 questões sorteadas de todo o banco', n: 5, f: () => BANCO },
  { id: 'sdif', nome: 'Só as difíceis', desc: 'Nível 6 para cima: o padrão das provas de medicina', n: 8, f: () => BANCO.filter(q => q.dif >= 6) },
  { id: 'srec', nome: 'Conteúdos mais recorrentes', desc: 'Os que mais caíram nas provas deste banco: ' + NOMES_COBRADOS, n: 10, f: () => BANCO.filter(q => MAIS_COBRADOS.includes(q.modulo)) },
  { id: 'serr', nome: 'Revisão dos meus erros', desc: 'Só o que você errou alguma vez', n: 10, f: () => BANCO.filter(q => tentativas(q.id).some(t => !t.ok)) },
  { id: 'ssc', nome: BANCAS_PROX.join(' e ') || 'Bancas mais próximas',
    desc: (BANCAS_PROX.length > 1 ? 'As bancas mais próximas da sua prova que estão'
                                   : 'A banca mais próxima da sua prova que está') +
          ' neste banco: ' + N_PROX + (N_PROX === 1 ? ' questão' : ' questões'),
    n: 10, f: () => BANCO.filter(q => RE_PROX.test(q.escola || '')) }
];
// Simulado por universidade: so' as que tem questao nesta materia; ate' 30 por simulado.
['São Camilo', 'Fuvest', 'Unesp'].forEach(u => {
  const pool = BANCO.filter(q => (q.escola || '') === u);
  if (pool.length) SIMS.push({ id: 'uni_' + u, nome: 'Simulado ' + u,
    desc: 'Só questões de ' + u + ' nesta matéria: ' + pool.length + (pool.length === 1 ? ' questão' : ' questões') + ' (até 30 por vez)',
    n: 30, f: () => pool });
});
function pintaSimulados() {
  const alvo = $('#lista-sim'); alvo.innerHTML = '';
  SIMS.forEach(s => {
    const pool = s.f();
    const d = document.createElement('div'); d.className = 'linha'; d.style.cursor = 'pointer';
    d.innerHTML = '<span class="nm"><b class="disp">' + s.nome + '</b><br><span class="dica">' + s.desc + '</span></span>' +
      '<span class="mono">' + Math.min(s.n, pool.length) + ' q</span>';
    d.onclick = () => pool.length ? iniciaSimulado(s) : alert2('Ainda não há questões para este simulado.');
    alvo.appendChild(d);
  });
  const h = $('#hist-sim');
  h.innerHTML = (S.sims || []).length ? S.sims.slice(-10).reverse().map(x =>
    '<div class="linha"><span class="nm">' + x.nome + '</span><span class="mono">' + x.acertos + '/' + x.total +
    ' · ' + Math.round(x.seg / 60) + ' min</span></div>').join('')
    : '<div class="vazio"><b>Nenhum simulado ainda</b>Escolha um acima: o tempo é cronometrado.</div>';
}
function alert2(m) { const h = $('#hist-sim'); if (h) h.innerHTML = '<div class="vazio">' + m + '</div>'; }
function iniciaSimulado(s) {
  const pool = s.f().slice();
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[pool[i], pool[j]] = [pool[j], pool[i]]; }
  const lista = pool.slice(0, s.n).sort((a, b) => a.dif - b.dif).map(q => q.id);
  ctx = { lista, i: 0, sim: s, t0: Date.now(), respostas: {} };
  abrirQuestao(lista[0], ctx);
}
/* ---------- treino de hoje: a direção do dia ---------- */
function treinoDeHoje(n) {
  n = n || 12;
  const ultima = id => { const t = tentativas(id); return t.length ? t[t.length - 1] : null; };
  const erradas = BANCO.filter(q => { const u = ultima(q.id); return u && !u.ok; })
    .sort((a, b) => {
      const ta = tentativas(a.id), tb = tentativas(b.id);
      return (tb.filter(x => !x.ok).length - ta.filter(x => !x.ok).length) ||
             (ultima(a.id).ts - ultima(b.id).ts);
    }).slice(0, 4);
  const usadas = new Set(erradas.map(q => q.id));
  const forca = {};
  Object.keys(SUBS).forEach(s => { const t = taxa(SUBS[s]); forca[s] = (t === null ? 50 : t); });
  // So' entra questao QUE ESTA NUMA ESCADA. O banco guarda tambem as que sobraram de fora
  // (degrau 0) -- questoes boas, conferidas, que nao couberam em nenhum dos dez degraus.
  // Sem este filtro, a ordenacao por (a.degrau - b.degrau) punha o 0 ANTES do 1 e o "Treino
  // de hoje" servia justamente essas: num perfil novo, 12 de 12 questoes vinham de fora da
  // escada, enquanto a tela prometia "comecando pelos degraus mais baixos". E como as barras
  // de progresso so' contam degrau, o aluno respondia e nada andava.
  const pend = BANCO.filter(q => q.degrau && !respondida(q.id) && !usadas.has(q.id))
    .sort((a, b) => (forca[a.sub] - forca[b.sub]) || (a.degrau - b.degrau) || (a.dif - b.dif));
  const novas = [], porSub = {};
  for (const q of pend) {
    porSub[q.sub] = porSub[q.sub] || 0;
    if (porSub[q.sub] >= 3) continue;
    porSub[q.sub]++; novas.push(q);
    if (erradas.length + novas.length >= n) break;
  }
  return { lista: erradas.concat(novas).map(q => q.id), revisao: erradas.length, novas: novas.length };
}
function iniciaTreino() {
  const t = treinoDeHoje(12);
  if (!t.lista.length) { $('#i-sub').textContent = 'Você já respondeu todas as questões do banco. Use o simulado ou refaça as marcadas.'; return; }
  ctx = { lista: t.lista, i: 0, treino: t, t0: Date.now(), acertos: 0 };
  abrirQuestao(t.lista[0], ctx);
}
function fimTreino() {
  const t = ctx.treino, total = ctx.lista.length;
  const ac = ctx.lista.filter(id => { const h = tentativas(id); return h.length && h[h.length - 1].ok; }).length;
  const seg = Math.round((Date.now() - ctx.t0) / 1000);
  $('#q-corpo').innerHTML =
    '<div class="vazio"><b>' + ac + ' de ' + total + ' no treino de hoje</b>' +
    (t.revisao ? t.revisao + ' eram questões que você tinha errado antes. ' : '') +
    'Tempo: ' + Math.floor(seg / 60) + ' min ' + (seg % 60) + ' s.</div>' +
    '<button class="btn" id="b-tr2">Fazer mais um treino</button>' +
    '<button class="btn sec" id="b-tr3">Voltar ao início</button>';
  ctx = null;
  $('#b-tr2').onclick = iniciaTreino;
  $('#b-tr3').onclick = () => vai('inicio');
}

function fimSimulado() {
  const r = ctx.respostas || {}, total = ctx.lista.length;
  const acertos = Object.values(r).filter(Boolean).length;
  const seg = Math.round((Date.now() - ctx.t0) / 1000);
  S.sims = S.sims || []; S.sims.push({ nome: ctx.sim.nome, acertos, total, seg, ts: Date.now() }); salva();
  $('#q-corpo').innerHTML = '<div class="vazio"><b>' + acertos + ' de ' + total + ' no simulado</b>' +
    'Tempo total: ' + Math.floor(seg / 60) + ' min ' + (seg % 60) + ' s — média de ' + Math.round(seg / total) + ' s por questão.</div>' +
    '<button class="btn" id="b-sim2">Voltar aos simulados</button>';
  $('#b-sim2').onclick = () => vai('simulado');
  ctx = null;
}
$('#b-simulado5').onclick = () => iniciaSimulado(SIMS[0]);
$('#b-treino').onclick = iniciaTreino;

/* ---------- progresso ---------- */
function pintaProgresso() {
  pintaSync();
  const dd = $('#desempenho'); dd.innerHTML = '';
  Object.keys(MODS).sort().forEach(m => {
    const t = taxa(MODS[m]), d = domMod(m), nome = (TEORIA[m] || {}).nome || m;
    const el = document.createElement('div'); el.className = 'linha';
    el.innerHTML = '<span class="nm">' + nome + '<br><span class="dica">' + MODS[m].filter(q => respondida(q.id)).length + ' de ' + MODS[m].length + ' respondidas</span></span>' +
      '<span class="prog"><i style="width:' + (d * 100) + '%"></i></span><span class="pc">' + (t === null ? '—' : t + '%') + '</span>';
    dd.appendChild(el);
  });
  const pad = $('#padroes'); pad.innerHTML = '';
  // O padrão de erro de cada módulo é o "erro clássico" que a teoria do próprio módulo descreve —
  // nada escrito à parte aqui. (Esta lista era de matemática: M03 porcentagem, M09 semelhança de
  // triângulos, M06 logaritmo. Como não existe módulo M neste banco, o painel nunca mostrava nada.)
  const regras = Object.keys(MODS).sort()
    .filter(m => (TEORIA[m] || {}).erro)
    .map(m => [m, (TEORIA[m] || {}).nome || m, TEORIA[m].erro]);
  const achados = regras.filter(([m]) => { const t = taxa(MODS[m] || []); return t !== null && t < 65; })
    .sort((a, b) => taxa(MODS[a[0]]) - taxa(MODS[b[0]])).slice(0, 5);
  pad.innerHTML = achados.length ? achados.map(([m, nome, dica]) =>
    '<div class="linha"><span class="nm"><b class="disp">' + nome + '</b><br><span class="dica">' + dica + '</span></span>' +
    '<span class="mono" style="color:var(--errado)">' + taxa(MODS[m]) + '%</span></div>').join('')
    : '<div class="vazio"><b>Nenhum padrão de erro detectado</b>Ou você está indo bem, ou ainda há poucas respostas registradas.</div>';
  const rev = $('#revisar');
  const marcadas = Object.keys(S.q).filter(id => S.q[id].rev && POR[id]);
  rev.innerHTML = marcadas.length ? marcadas.map(id => {
    const q = POR[id];
    return '<div class="linha" data-id="' + id + '" style="cursor:pointer"><span class="bolinha b-rev"></span>' +
      '<span class="nm">' + esc(selo(q)) + '<br><span class="dica">' + nomeSub(q.sub) + '</span></span>' +
      '<span class="mono">nível ' + q.dif + '</span></div>';
  }).join('') : '<div class="vazio"><b>Nada marcado</b>Use o marcador no canto de cima de cada questão (ou o cartão Revisão, embaixo dela).</div>';
  rev.querySelectorAll('[data-id]').forEach(e => e.onclick = () => abrirQuestao(e.dataset.id, null));
}
$('#b-export').onclick = async () => {
  const b = $('#b-export'), txt = JSON.stringify(S);
  const voltar = t => setTimeout(() => b.textContent = t, 4500);
  if (DL) {
    b.textContent = 'Preparando o arquivo…';
    try {
      await DL.save({ filename: 'progresso-por-saocamilo.json', data: txt });
      b.textContent = 'Arquivo salvo'; voltar('Baixar meu progresso (.json)'); return;
    } catch (e) {
      const c = e && e.code;
      if (c === 'declined') { b.textContent = 'Você cancelou o download'; voltar('Baixar meu progresso (.json)'); return; }
      b.textContent = 'Download indisponível aqui — copiando o texto';
    }
  }
  try {
    await navigator.clipboard.writeText(txt);
    b.textContent = 'Progresso copiado — cole num arquivo de texto'; voltar('Baixar meu progresso (.json)');
  } catch (e) {
    b.textContent = 'Selecione e copie o texto abaixo'; mostraTexto(txt);
  }
};
function mostraTexto(t) {
  const ta = document.createElement('textarea'); ta.value = t; ta.style.cssText = 'width:100%;height:120px;margin-top:8px';
  $('#b-export').after(ta); ta.select();
}
$('#b-import').onclick = () => $('#f-import').click();
$('#f-import').onchange = ev => {
  const f = ev.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { try { S = Object.assign(S, JSON.parse(r.result)); salva(); location.reload(); } catch (e) { $('#b-import').textContent = 'Arquivo inválido'; } };
  r.readAsText(f);
};
$('#b-zerar').onclick = async () => {
  const b = $('#b-zerar');
  if (b.dataset.c !== '1') { b.dataset.c = '1'; b.textContent = 'Tem certeza? Clique de novo para apagar'; setTimeout(() => { b.dataset.c = ''; b.textContent = 'Apagar meu progresso'; }, 5000); return; }
  S = { q: {}, ult: null, sims: [], tema: S.tema }; salvaLocal(); try { localStorage.removeItem('ad-tg-sessao-' + String(KEY).split('.')[1]); } catch (e) { }
  const ref = refProgresso();
  if (ref) { try { await ref.delete(); } catch (e) { } }
  location.reload();
};
function gravaAgora() {
  salvaLocal();
  clearTimeout(syncTimer);
  if (refProgresso()) escreveRemoto();
}
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') gravaAgora(); });
addEventListener('pagehide', gravaAgora);
addEventListener('beforeunload', () => { salvaLocal(); });

/* ---------- tela cheia (com plano B para iPad/iPhone) ---------- */
const docEl = document.documentElement;
function emTelaCheia() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}
function podeTelaCheia() {
  return !!(docEl.requestFullscreen || docEl.webkitRequestFullscreen);
}
function pintaBotaoTela() {
  const b = $('#bfull');
  const ativo = emTelaCheia() || docEl.classList.contains('foco');
  b.textContent = ativo ? '⤡' : '⤢';
  b.setAttribute('aria-label', ativo ? 'Sair da tela cheia' : 'Tela cheia');
}
function entraFoco() { docEl.classList.add('foco'); pintaBotaoTela(); }
function saiFoco() { docEl.classList.remove('foco'); pintaBotaoTela(); }
async function alternaTela() {
  if (emTelaCheia()) {
    try { await (document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen()); } catch (e) { }
    saiFoco(); return;
  }
  if (docEl.classList.contains('foco')) { saiFoco(); return; }
  if (podeTelaCheia()) {
    try {
      await (docEl.requestFullscreen ? docEl.requestFullscreen({ navigationUI: 'hide' }) : docEl.webkitRequestFullscreen());
      pintaBotaoTela();
      return;
    } catch (e) { /* o visualizador recusou: cai no modo foco */ }
  }
  entraFoco();
}
$('#bfull').onclick = alternaTela;
$('#sair-foco').onclick = () => { if (emTelaCheia()) alternaTela(); else saiFoco(); };
addEventListener('fullscreenchange', pintaBotaoTela);
addEventListener('webkitfullscreenchange', pintaBotaoTela);
addEventListener('keydown', e => { if (e.key === 'Escape' && docEl.classList.contains('foco')) saiFoco(); });
pintaBotaoTela();

(function avisoTela() {
  const p = $('#aviso-tela'); if (!p) return;
  const soltaNaSafari = /tela\.html$/.test(location.pathname);
  const dentroDeMoldura = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  if (soltaNaSafari) {
    p.innerHTML = 'Pagina solta, fora do aplicativo do Claude. Toque em <b>\u2922</b> no topo para tela cheia, ou em ' +
      '<b>compartilhar \u2192 Adicionar a Tela de In\u00edcio</b>: a\u00ed ele abre como aplicativo, sem barra nenhuma. ' +
      'Aqui o progresso fica salvo neste navegador.';
    return;
  }
  if (dentroDeMoldura) {
    p.innerHTML = 'O visualizador do Claude n\u00e3o deixa a p\u00e1gina ocupar a tela toda. O bot\u00e3o <b>\u2922</b> no topo esconde o ' +
      'cabe\u00e7alho e usa toda a \u00e1rea dispon\u00edvel aqui dentro. ' +
      '<a href="tela.html" target="_blank" rel="noopener"><b>Abrir em tela cheia de verdade</b></a> \u2014 abre fora do aplicativo, ' +
      'e l\u00e1 d\u00e1 para adicionar \u00e0 Tela de In\u00edcio.';
  } else if (podeTelaCheia()) {
    p.innerHTML = 'Toque em <b>\u2922</b> no topo para usar a tela cheia.';
  }
})();

pintaInicio();

/* ==== camada PC 27/10: atalhos de teclado + Continuar em destaque ==== */
(function(){
  if (window.__camadaPC) return; window.__camadaPC = 1;
  function visivel(e){ return !!e && e.offsetParent !== null && !e.disabled; }
  var volta = document.getElementById('q-volta');
  if (volta && !document.querySelector('.atalhos-pc')) {
    var s = document.createElement('span'); s.className = 'atalhos-pc';
    s.textContent = 'teclado: A–E escolhe · Enter confirma/avança · H dica · P pausa';
    volta.insertAdjacentElement('afterend', s);
  }
  document.addEventListener('keydown', function(ev){
    if (ev.ctrlKey || ev.metaKey || ev.altKey || ev.repeat) return;
    var t = ev.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    var vq = document.getElementById('v-questao');
    if (!vq || vq.hidden) return;
    if (document.querySelector('[role="dialog"]:not([hidden])')) return;
    var k = ev.key || '';
    var prox = document.getElementById('b-prox'), conf = document.getElementById('b-conf');
    var i = k.length === 1 ? 'abcde'.indexOf(k.toLowerCase()) : -1;
    if (i < 0 && k.length === 1) i = '12345'.indexOf(k);
    if (i >= 0) {
      if (visivel(prox)) return;                 /* ja respondeu: letras nao mudam nada */
      var b = document.querySelectorAll('#bolhas .bolha')[i];
      if (visivel(b)) { ev.preventDefault(); b.click(); b.focus({preventScroll:true}); }
      return;
    }
    if (k === 'Enter') {
      /* critique 29/10: botao clicado dentro da questao (revisar depois, dica, texto) nao rouba o Enter:
         antes, Enter depois de "revisar depois" DESMARCAVA a revisao e nao confirmava nada */
      var naQuestao = t && t.tagName === 'BUTTON' && t.closest && t.closest('#q-corpo');
      if (t && /^(BUTTON|A|SUMMARY)$/.test(t.tagName) && !naQuestao
          && t.id !== 'b-conf' && t.id !== 'b-prox') return;   /* deixa o Enter nativo dos botoes de fora (voltar, pausa, menu) */
      var alvo = visivel(prox) ? prox : (visivel(conf) ? conf : null);
      if (alvo) { ev.preventDefault(); alvo.click(); }
      return;
    }
    if (k === 'h' || k === 'H') {
      var bdk = document.getElementById('b-dica');
      if (visivel(bdk)) { ev.preventDefault(); bdk.click(); }
      return;
    }
    if (k === 'p' || k === 'P') {
      var pz = document.getElementById('q-pausa');
      if (visivel(pz)) { ev.preventDefault(); pz.click(); }
    }
  });
  /* mini-escada ao lado de "Degrau N de M" (refeita a cada questao desenhada) */
  function miniEscada(){
    var tag = document.querySelector('#q-corpo .qmeta .tag.dif');
    if (!tag) return;
    var viz = tag.nextElementSibling;
    if (viz && viz.classList.contains('mini-escada')) return;
    var m = /Degrau\s+(\d+)\s+de\s+(\d+)/.exec(tag.textContent || '');
    if (!m) return;
    var n = +m[1], tot = +m[2];
    if (tot < 2 || tot > 14 || n < 1 || n > tot) return;
    var s = document.createElement('span'); s.className = 'mini-escada'; s.setAttribute('aria-hidden', 'true');
    for (var i = 1; i <= tot; i++) {
      var d = document.createElement('i');
      d.style.height = (4 + Math.round(12 * i / tot)) + 'px';
      if (i < n) d.className = 'ja'; else if (i === n) d.className = 'aqui';
      s.appendChild(d);
    }
    tag.insertAdjacentElement('afterend', s);
  }
  /* escada de dicas: estrategica -> conceitual -> procedimental -> "agora e com voce" (nunca entrega a letra) */
  /* optimize 29/10 (1/2): um pacote res/ que falhou (rede caiu) nao fica envenenado em PACOTES:
     o proximo pedido tenta de novo, em vez de "nao consegui carregar" ate recarregar a pagina */
  if (typeof carregaRes === 'function' && typeof PACOTES === 'object' && typeof POR === 'object') {
    var _cr = carregaRes;
    carregaRes = function (id) {
      return _cr.apply(this, arguments).catch(function (e) {
        var q = POR[id], p = q && PACOTES[q.sub];
        if (p) p.then(null, function () { if (PACOTES[q.sub] === p) delete PACOTES[q.sub]; });
        throw e;
      });
    };
  }
  /* optimize 29/10 (2/2): enquanto o aluno resolve esta questao, baixa em segundo plano o pacote
     da PROXIMA da lista (treino/simulado). So' depois do pacote atual, e no ocioso. */
  var ocioso = window.requestIdleCallback || function (f) { return setTimeout(f, 300); };
  function preBaixa(q) {
    try {
      var nid = ctx && ctx.lista && ctx.lista[ctx.i + 1], nq = nid && POR[nid];
      if (!nq || RES[nid] || PACOTES[nq.sub]) return;          /* ja na memoria ou a caminho */
      Promise.resolve(carregaRes(q.id)).catch(function () {}).then(function () {
        ocioso(function () { carregaRes(nid).catch(function () {}); }, { timeout: 3000 });
      });
    } catch (e) {}
  }
  if (typeof desenhaQuestao === 'function') {
    var _dq = desenhaQuestao;
    desenhaQuestao = function (q) { window.__qAtual = q; var r = _dq.apply(this, arguments); preBaixa(q); return r; };
  }
  function niveisDica(q, r) {
    /* nunca usa chave, cuidado, armadilha nem resposta: todos podem entregar a conclusao */
    var e = r.essencial || {}, P = r.passos || [], L = [];
    if (e.pede) L.push(['o que a questão pede', e.pede]);
    var pis = r.pista || q.pista;
    if (pis) L.push(['onde olhar primeiro', pis]);
    if (P[0] && P[0].faz) L.push(['por onde começar', 'Comece assim: ' + String(P[0].faz).replace(/\.\s*$/, '') + '. O resto do caminho é seu.']);
    L = L.map(function (x, i) { return ['Dica ' + (i + 1) + ' · ' + x[0], x[1]]; });
    /* critique 29/10: o fecho nao conta como dica (antes gastava um clique e o "4 de 4" prometia conteudo) */
    L.push(['Agora é com você', 'Diga para si mesmo qual é o primeiro passo e por quê. Depois marque a alternativa e confirme: a resolução completa abre em seguida.', 'fim']);
    return L;
  }
  function montaDicas() {
    var corpo = document.getElementById('q-corpo'), q = window.__qAtual;
    if (!corpo || !q) return;
    var prox = document.getElementById('b-prox'), bd = document.getElementById('b-dica');
    if (prox && prox.offsetParent !== null) { if (bd) bd.hidden = true; return; }
    if (bd && bd.dataset.q === q.id) return;
    var acoes = corpo.querySelector('.entra2 > .acoes');
    if (!acoes) return;
    ['b-pista', 'pista-box', 'b-dica', 'dica-box'].forEach(function (id) { var x = document.getElementById(id); if (x) x.remove(); });
    bd = document.createElement('button'); bd.type = 'button'; bd.id = 'b-dica'; bd.className = 'b-pista'; bd.dataset.q = q.id;
    var caixa = document.createElement('div'); caixa.id = 'dica-box'; caixa.className = 'dica-box'; caixa.hidden = true;
    caixa.setAttribute('aria-live', 'polite');
    /* critique 29/10: caixa ANTES do botao: a dica nova nasce logo acima do botao que a pediu,
       em vez de empilhar abaixo dele e sair da tela (em 1366x768 a 4a caia em y=745) */
    acoes.insertAdjacentElement('afterend', caixa); caixa.insertAdjacentElement('afterend', bd);
    var niveis = null, vistos = 0;
    function reais() { return niveis ? niveis.filter(function (x) { return x[2] !== 'fim'; }).length : 3; }
    function rotulo() {
      var tot = reais();
      if (niveis && vistos >= tot) { bd.hidden = true; return; }
      bd.textContent = vistos === 0 ? 'não sei por onde começar · dica 1 de ' + tot : 'mais uma dica · ' + (vistos + 1) + ' de ' + tot;
    }
    function poe(n) {
      var d = document.createElement('div'), b = document.createElement('b'), p = document.createElement('p');
      d.className = 'dica-nivel' + (n[2] === 'fim' ? ' fim' : ''); b.textContent = n[0]; p.textContent = n[1];
      d.appendChild(b); d.appendChild(p); caixa.appendChild(d); return d;
    }
    function mostra() {
      if (vistos >= reais()) return;
      var d = poe(niveis[vistos]); vistos++; caixa.hidden = false;
      if (vistos === reais() && niveis[vistos] && niveis[vistos][2] === 'fim') d = poe(niveis[vistos]);
      rotulo();
      (bd.hidden ? d : bd).scrollIntoView({ block: 'nearest', behavior: 'smooth' });   /* o botao, ou o fecho, fica a vista */
    }
    rotulo();
    bd.onclick = function () {
      if (niveis) return mostra();
      bd.disabled = true; bd.textContent = 'carregando a dica…';
      Promise.resolve(typeof carregaRes === 'function' ? carregaRes(q.id) : null)
        .catch(function () { return null; })
        .then(function (r) { niveis = niveisDica(q, r || {}); bd.disabled = false; mostra(); });
    };
  }
  /* critique 29/10: quem errou le PRIMEIRO por que a letra dele nao serve (antes: ~2.600 px abaixo do veredito) */
  function realcaErro() {
    var corpo = document.getElementById('q-corpo');
    if (!corpo || corpo.querySelector('.sua-topo')) return;
    var sua = corpo.querySelector('.resolucao .errada.sua'), ver = corpo.querySelector('.resolucao') && corpo.querySelector('.veredito.v0');
    if (!sua || !ver) return;
    var L = ((sua.querySelector('.L') || {}).textContent || '').trim();
    var tn = ver.childNodes[1];
    if (L && tn && tn.nodeType === 3) tn.textContent = 'Você marcou ' + L + ' · ' + tn.textContent;
    var box = document.createElement('div'); box.className = 'bloco sua-topo';
    var h = document.createElement('h3'); h.textContent = 'Por que a alternativa ' + L + ' não serve';
    box.appendChild(h); box.appendChild(sua);
    ver.insertAdjacentElement('afterend', box);
  }
  function aoDesenhar() { miniEscada(); montaDicas(); realcaErro(); }
  var qc = document.getElementById('q-corpo');
  if (qc && window.MutationObserver) new MutationObserver(aoDesenhar).observe(qc, {childList:true});
  aoDesenhar();
  /* impeccable/audit 29/10: estado das bolhas e da secao atual para leitor de tela; menu do topo
     entra no Tab logo depois do cabecalho, na mesma ordem em que aparece na tela */
  function estadoBolhas(){
    document.querySelectorAll('#bolhas .bolha').forEach(function(b){
      b.setAttribute('aria-pressed', b.classList.contains('sel') ? 'true' : 'false');
    });
  }
  if (qc) { qc.addEventListener('click', estadoBolhas); new MutationObserver(estadoBolhas).observe(qc, {childList:true}); estadoBolhas(); }
  var nb = document.querySelector('nav.bot'), ht = document.querySelector('header.top');
  if (nb && ht) {
    nb.setAttribute('aria-label', 'Seções');
    var ancora = document.getElementById('sair-foco') || ht;
    if (ancora.nextElementSibling !== nb) ancora.insertAdjacentElement('afterend', nb);
    var atual = function(){ nb.querySelectorAll('button').forEach(function(b){
      if (b.classList.contains('on')) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); }); };
    atual(); new MutationObserver(atual).observe(nb, {subtree:true, attributes:true, attributeFilter:['class']});
  }
  /* icone de tema desenhado (o glifo ◐ saia torto conforme a fonte do Windows) */
  var bt = document.getElementById('btema');
  if (bt) bt.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor"/></svg>';
  function promove(){
    var r = document.getElementById('k-resp'), c = document.getElementById('b-continuar'), tr = document.getElementById('b-treino');
    if (!r || !c || !tr) return;
    var n = parseInt((r.textContent || '').replace(/\D/g, ''), 10) || 0;
    if (n > 0) { c.classList.remove('sec'); tr.classList.add('sec'); }
    else { c.classList.add('sec'); tr.classList.remove('sec'); }
  }
  promove();
  var kr = document.getElementById('k-resp');
  if (kr && window.MutationObserver) new MutationObserver(promove).observe(kr, {childList:true, characterData:true, subtree:true});
  /* critique 29/10: escolher a letra apaga o aviso "escolha uma letra primeiro" (antes ele ficava, contradizendo a bolha marcada) */
  document.addEventListener('click', function (ev) {
    if (!ev.target.closest || !ev.target.closest('#bolhas .bolha')) return;
    var c = document.getElementById('b-conf');
    if (c && c.textContent !== 'Confirmar resposta') c.textContent = 'Confirmar resposta';
  }, true);
  /* critique 29/10: questao aberta da lista "Marcadas para revisao" tinha o contexto velho
     ("1 de 7", Proxima seguia a escada antiga, voltar caia na escada). Agora percorre as marcadas e volta ao Progresso. */
  document.addEventListener('click', function (ev) {
    var l = ev.target.closest && ev.target.closest('#revisar [data-id]');
    if (!l) return;
    ev.stopPropagation(); ev.preventDefault();
    var ids = [].map.call(document.querySelectorAll('#revisar [data-id]'), function (x) { return x.dataset.id; });
    ctx = { lista: ids, i: ids.indexOf(l.dataset.id), revisao: true };
    abrirQuestao(l.dataset.id, ctx);
    var v = document.getElementById('q-volta');
    if (v) v.onclick = function () { clearInterval(tTimer); vai('progresso'); };
  }, true);
  if (typeof proxima === 'function') {
    var _px = proxima;
    proxima = function () {
      if (ctx && ctx.revisao && ctx.i >= ctx.lista.length - 1) { ctx = null; return vai('progresso'); }
      var r = _px.apply(this, arguments);
      if (ctx && ctx.revisao) { var v = document.getElementById('q-volta'); if (v) v.onclick = function () { clearInterval(tTimer); vai('progresso'); }; }
      return r;
    };
  }
  /* critique 29/10: "Continuar de onde parei" reabria a ULTIMA questao mesmo ja respondida; agora abre o proximo degrau nao vencido dela */
  var bc = document.getElementById('b-continuar');
  if (bc) bc.addEventListener('click', function (ev) {
    var q = S.ult && POR[S.ult];
    if (!q || !respondida(q.id) || !q.sub) return;          /* nao respondida: comportamento antigo (reabre) */
    var deg = escadaDe(q.sub), prox = deg.filter(function (x) { return !acertou(x.id); })[0];
    if (!prox) return;                                       /* escada vencida: deixa o app escolher a proxima */
    ev.stopImmediatePropagation();
    var lista = deg.map(function (x) { return x.id; });
    subAtual = q.sub; ctx = { lista: lista, i: lista.indexOf(prox.id), origem: q.sub };
    abrirQuestao(prox.id, ctx);
  }, true);
  /* critique 29/10: a prova-alvo vem primeiro: simulados por universidade (Sao Camilo, Fuvest, Unesp) no topo */
  if (typeof SIMS !== 'undefined' && SIMS.splice) {
    var uni = SIMS.filter(function (s) { return /^uni_/.test(s.id); });
    var resto = SIMS.filter(function (s) { return !/^uni_/.test(s.id); });
    SIMS.splice.apply(SIMS, [0, SIMS.length].concat(uni, resto));
  }
})();
/* ==== fim camada PC ==== */

/* ==== AD-JS inicio ==== */
/* ==== APRENDICE · icones desenhados (traco 2,2 · duotone) ====
   Revisao 29/10/2026: parte dos icones vem de bibliotecas abertas, adaptadas ao formato deste arquivo
   (traco em currentColor/degrade, preenchimento duotone F/F4). Lista das trocas: design/ICONES_REVISAO.md
   - Lucide (lucide.dev) - ISC License. Copyright (c) 2026 Lucide Icons and Contributors.
     Usados: brain (B08), trees (B09), book-open-text (P01), link (P04), message-circle + sparkle (P06).
   - Tabler Icons (tabler.io) - MIT License. Copyright (c) 2020-2026 Pawel Kuna.
     Usados: butterfly (B12), ballpen (P12).
   - Phosphor Icons (phosphoricons.com) - MIT License. Copyright (c) 2023 Phosphor Icons.
     Usado: book-open, peso duotone (glifo de Portugues).
   Permission to use, copy, modify, and/or distribute these icons for any purpose with or without fee is hereby
   granted, provided the copyright notices and permission notices above are kept (textos completos: ISC e MIT). */
var ICO = (function () {
  var F = ' fill="currentColor" fill-opacity=".2"', F4 = ' fill="currentColor" fill-opacity=".42"', FC = ' fill="currentColor"';
  function sv(vb, corpo, cls) {
    return '<svg class="' + (cls || 'ic') + '" viewBox="' + vb + '" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + corpo + '</svg>';
  }
  function txt(x, y, s, t, extra) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + s + '" text-anchor="middle" fill="currentColor" stroke="none" ' + (extra || 'font-family="Georgia,Cambria,serif" font-style="italic"') + '>' + t + '</text>';
  }
  /* icones de bibliotecas de grade 24 (Lucide/Tabler) ampliados para 48: traco 1,1 x 2 = 2,2, igual aos demais */
  function L(c) { return '<g transform="scale(2)" stroke-width="1.1">' + c + '</g>'; }
  /* ---------- temas (modulos), 48x48 ----------
     Regra: o degrade #ad-grad usa a caixa de cada traco; traco 100% horizontal ou vertical sozinho some no app.
     Por isso linhas retas isoladas levam um "toque" de .02 (ex.: M10 16h28M38 15.99v.02). */
  var M = {
    /* MATEMATICA */
    M01: '<rect x="6" y="6" width="36" height="36" rx="8"' + F + '/><path d="M24 9v30M9 24h30" stroke-opacity=".35"/><path d="M15 11v9M10.5 15.5h9M28.5 15.5h9M11.5 29l8 8M19.5 29l-8 8M28.5 33h9"/><circle cx="33" cy="29" r="1.3"' + FC + '/><circle cx="33" cy="37" r="1.3"' + FC + '/>',
    M02: '<path d="M24 8v31M16 40h16M8 14h32"/><path d="M8 14 3.5 26M8 14l4.5 12M40 14l-4.5 12M40 14l4.5 12"/><path d="M2.5 26a5.5 3.6 0 0 0 11 0z"' + F4 + '/><path d="M34.5 26a5.5 3.6 0 0 0 11 0z"' + F4 + '/><circle cx="24" cy="8" r="2.2"' + FC + '/>',
    M03: '<circle cx="15" cy="15" r="6"' + F4 + '/><circle cx="33" cy="33" r="6"' + F4 + '/><path d="M37 9 11 39"/>',
    M04: '<path d="M8 6v34h34" stroke-opacity=".45"/><path d="M11 35 41 13"/><path d="M11 15l30 20"/><circle cx="24.4" cy="24" r="3.4"' + FC + '/>',
    M05: '<path d="M8 6v34h34" stroke-opacity=".55"/><path d="M5 9l3-3 3 3M39 37l3 3-3 3" stroke-opacity=".55"/><path d="M13 10q11 40 22 0"/><path d="M13 10q11 40 22 0v30H13z"' + F + ' stroke="none"/><path d="M10 37 40 15" stroke-opacity=".75"/>',
    M06: '<path d="M8 6v34h34" stroke-opacity=".55"/><path d="M8 40 41 7" stroke-dasharray="2.5 3.5" stroke-opacity=".45"/><path d="M9 35.5C21 34.5 28 28 32 7"/><path d="M12.5 39C13.5 27 20 20 41 16" stroke-opacity=".7"/><circle cx="8" cy="35.5" r="1.9"' + FC + ' stroke="none"/><circle cx="12.5" cy="40" r="1.9"' + FC + ' stroke="none"/>',
    M07: '<rect x="7" y="30" width="7" height="11" rx="1.5"' + FC + ' fill-opacity=".45" stroke="none"/><rect x="16.5" y="23" width="7" height="18" rx="1.5"' + FC + ' fill-opacity=".62" stroke="none"/><rect x="26" y="15" width="7" height="26" rx="1.5"' + FC + ' fill-opacity=".8" stroke="none"/><rect x="35.5" y="7" width="7" height="34" rx="1.5"' + FC + ' stroke="none"/>',
    M08: '<path d="M8 38 16 12h18l8 26z"' + F + '/><path d="M16 12v26M15.99 38h.02" stroke-dasharray="3 3.2" stroke-opacity=".7"/><path d="M16 33h4.5v5"/>',
    M09: '<path d="M8 40h32L8 10z"' + F + '/><path d="M8 34h6v6"/><path d="M31 40a9 9 0 0 0 2.4-6.2" /><circle cx="8" cy="10" r="2"' + FC + '/>',
    M10: '<path d="M4 24h40M44 23.99v.02" stroke-opacity=".35"/><path d="M4 24c4-14 9-17 10-17s6 3 10 17 9 17 10 17 6-3 10-17"/>',
    M11: '<path d="M24 6l16 8-16 8-16-8z"' + F4 + '/><path d="M8 14l16 8v20L8 34z"' + F + '/><path d="M40 14 24 22v20l16-8z"' + F + ' fill-opacity=".3"/>',
    M12: '<path d="M5 24h38M24 5v38" stroke-opacity=".5"/><path d="M40 21l3 3-3 3M21 8l3-3 3 3" stroke-opacity=".5"/><circle cx="29" cy="19" r="10"' + F + '/><circle cx="29" cy="19" r="2.2"' + FC + '/>',
    M13: '<path d="M24 6l16 8-16 8-16-8z"' + F4 + '/><path d="M8 14l16 8v20L8 34z"' + F + '/><path d="M40 14 24 22v20l16-8z"' + F + ' fill-opacity=".3"/><ellipse cx="24" cy="14" rx="2.6" ry="1.5"' + FC + ' stroke="none"/><circle cx="13" cy="23" r="1.8"' + FC + ' stroke="none"/><circle cx="19" cy="33" r="1.8"' + FC + ' stroke="none"/><circle cx="29" cy="25.5" r="1.8"' + FC + ' stroke="none"/><circle cx="32" cy="29" r="1.8"' + FC + ' stroke="none"/><circle cx="35" cy="32.5" r="1.8"' + FC + ' stroke="none"/>',
    M14: '<path d="M5 41h38M43 40.99v.02" stroke-opacity=".5"/><rect x="7" y="27" width="6" height="14"' + FC + ' fill-opacity=".5" stroke="none"/><rect x="14" y="17" width="6" height="24"' + FC + ' fill-opacity=".75" stroke="none"/><rect x="21" y="8" width="6" height="33"' + FC + ' stroke="none"/><rect x="28" y="15" width="6" height="26"' + FC + ' fill-opacity=".75" stroke="none"/><rect x="35" y="24" width="6" height="17"' + FC + ' fill-opacity=".5" stroke="none"/>',
    M15: '<path d="M13 7H8v34h5M35 7h5v34h-5"/>' + txt(18.5, 21, 10, '1', 'font-family="ui-monospace,Consolas,monospace"') + txt(29.5, 21, 10, '0', 'font-family="ui-monospace,Consolas,monospace"') + txt(18.5, 35, 10, '1', 'font-family="ui-monospace,Consolas,monospace"') + txt(29.5, 35, 10, '1', 'font-family="ui-monospace,Consolas,monospace"'),
    M16: txt(20, 34, 26, 'x') + txt(33, 20, 14, '2', 'font-family="Georgia,Cambria,serif"'),
    M17: '<rect x="16" y="4" width="16" height="9" rx="2.5"' + F4 + '/><path d="M24 13v4M23.99 17h.02"/><path d="M24 17l8 7-8 7-8-7z"' + F + '/><path d="M16 24H9v9M32 24h7v9"/><rect x="3" y="33" width="12" height="9" rx="2.5"' + F + '/><rect x="33" y="33" width="12" height="9" rx="2.5"' + F + '/>',
    /* BIOLOGIA */
    B01: '<path d="M24 6c11 0 19 6 19 17s-8 19-19 19S5 35 5 24 13 6 24 6z"' + F + '/><circle cx="21" cy="23" r="7"' + F4 + '/><circle cx="22.5" cy="21.5" r="1.8"' + FC + '/><ellipse cx="34" cy="31" rx="4.6" ry="2.4" transform="rotate(-30 34 31)"' + F4 + '/><path d="M11 15q3-3 6 0M12 32q2.5 2.5 5 0" stroke-opacity=".7"/>',
    B02: '<path d="M30.5 16.6A14 14 0 1 1 17.5 16.6L24 24z"' + F + '/><path d="M17.5 5h13L24 12.4z"' + F4 + '/>',
    B03: '<ellipse cx="24" cy="24" rx="19" ry="11" transform="rotate(-24 24 24)"' + F + '/><path d="M10 31c3-9 5 3 8-5s5 3 8-6 5 3 8-6 4 2 5-1" transform="rotate(-2 24 24)"/>',
    B04: '<path d="M24 15.5a10 10 0 1 0 0 17 10 10 0 1 0 0-17z"' + F + '/><path d="M24 15.5c-1.6 3-1.6 14 0 17" stroke-opacity=".6"/><circle cx="15" cy="24" r="3.6"' + F4 + '/><circle cx="33" cy="24" r="3.6"' + F4 + '/><path d="M4 24h3M41 24h3M44 23.99v.02" stroke-dasharray="1 3"/>',
    B05: '<path d="M14 5c22 8 20 14 10 19S4 34 34 43"/><path d="M34 5C12 13 14 19 24 24s20 10-10 19"/><path d="M18 9.5h12M20.5 15.5h7M20.5 32.5h7M18 38.5h12" stroke-opacity=".7"/>',
    B06: '<rect x="10" y="10" width="30" height="30" rx="4"' + F + '/><rect x="10" y="10" width="15" height="15" rx="2"' + F4 + ' stroke="none"/><rect x="25" y="10" width="15" height="15" rx="2"' + F4 + ' stroke="none"/><rect x="10" y="25" width="15" height="15" rx="2"' + F4 + ' stroke="none"/><path d="M25 10v30M10 25h30"/>' + txt(17.5, 7, 7, 'A', 'font-family="system-ui,sans-serif" font-weight="700"') + txt(32.5, 7, 7, 'a', 'font-family="system-ui,sans-serif" font-weight="700"') + txt(5, 20, 7, 'A', 'font-family="system-ui,sans-serif" font-weight="700"') + txt(5, 35, 7, 'a', 'font-family="system-ui,sans-serif" font-weight="700"'),
    B07: '<path d="M24 41C10 31 4 23 8 15c3-6 11-7 16-1 5-6 13-5 16 1 4 8-2 16-16 26z"' + F + '/><path d="M5 25h10l3-6 4 12 3-7h18"/>',
    B08: L('<path d="M12 18V5M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.707 6.294A3 3 0 1 0 12 5a3 3 0 1 0-5.707 1.294"/><path d="M17.996 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.465"/><path d="M19.967 17.482a4 4 0 1 1-7.967.517 4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.465"/><path d="M6.004 5.125a4 4 0 0 0-2.526 5.77"/><path d="M12 5a3 3 0 0 0-5.7 1.3 4 4 0 0 0-2.8 4.6A4 4 0 0 0 4 17.5a4 4 0 0 0 8 .5 4 4 0 0 0 8-.5 4 4 0 0 0 .5-6.6 4 4 0 0 0-2.8-4.6A3 3 0 0 0 12 5z"' + F + ' stroke="none"/>'),
    B09: L('<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"' + F4 + '/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3 9.6 6.6 10 10v.2A3 3 0 0 1 11 15z"' + F + ' stroke="none"/><path d="M7 16v6M13 19v3M2.5 22h19"/>'),
    B10: '<circle cx="24" cy="24" r="10.5"' + F + '/><path d="M24 13.5V7M24 34.5V41M13.5 24H7M34.5 24H41M16.6 16.6l-4.5-4.5M31.4 31.4l4.5 4.5M31.4 16.6l4.5-4.5M16.6 31.4l-4.5 4.5"/><circle cx="24" cy="6" r="1.9"' + FC + '/><circle cx="24" cy="42" r="1.9"' + FC + '/><circle cx="6" cy="24" r="1.9"' + FC + '/><circle cx="42" cy="24" r="1.9"' + FC + '/><circle cx="11.3" cy="11.3" r="1.9"' + FC + '/><circle cx="36.7" cy="36.7" r="1.9"' + FC + '/><circle cx="36.7" cy="11.3" r="1.9"' + FC + '/><circle cx="11.3" cy="36.7" r="1.9"' + FC + '/><circle cx="21" cy="22" r="1.6"' + FC + '/><circle cx="27" cy="27" r="1.6"' + FC + '/>',
    B11: '<path d="M24 43V31M24 31 12 19M24 31l12-12M12 19 6 8M12 19l6-11M36 19l-6-11M36 19l6-11"/><circle cx="6" cy="7" r="2.6"' + FC + '/><circle cx="18" cy="7" r="2.6"' + FC + '/><circle cx="30" cy="7" r="2.6"' + FC + '/><circle cx="42" cy="7" r="2.6"' + FC + '/><circle cx="24" cy="31" r="2.2"' + F4 + '/>',
    B12: L('<path d="M12 18.176a3 3 0 1 1-4.953-2.449l-.025.023a4.502 4.502 0 0 1 1.483-8.75c1.414 0 2.675.652 3.5 1.671a4.5 4.5 0 1 1 4.983 7.079 3 3 0 1 1-4.983 2.25l-.005.176"' + F + '/><path d="M12 19V9M9 3l3 2 3-2"/>'),
    /* QUIMICA */
    Q01: '<ellipse cx="24" cy="24" rx="19" ry="7.5"/><ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(120 24 24)"/><circle cx="24" cy="24" r="4"' + FC + '/><circle cx="43" cy="24" r="2"' + FC + '/>',
    Q02: '<path d="M24 22 10 32M24 22l14 10M24 22V9"/><circle cx="24" cy="22" r="6.5"' + F4 + '/><circle cx="10" cy="33" r="5"' + F + '/><circle cx="38" cy="33" r="5"' + F + '/><circle cx="24" cy="8" r="4"' + F + '/>',
    Q03: '<circle cx="15" cy="24" r="10"' + F4 + '/><circle cx="35" cy="24" r="8"' + F + '/><path d="M15 19v10M10 24h10M31 24h8"/>',
    Q04: '<circle cx="12" cy="36" r="5.6"' + F4 + '/><circle cx="24" cy="36" r="5.6"' + F4 + '/><circle cx="36" cy="36" r="5.6"' + F4 + '/><circle cx="18" cy="25.5" r="5.6"' + F + '/><circle cx="30" cy="25.5" r="5.6"' + F + '/><circle cx="24" cy="15" r="5.6"' + F + '/>',
    Q05: '<path d="M19 5h10M20.5 5v13L9.5 37.5A3 3 0 0 0 12 42h24a3 3 0 0 0 2.5-4.5L27.5 18V5"/><path d="M13.6 30.5h20.8l4.1 7a3 3 0 0 1-2.5 4.5H12a3 3 0 0 1-2.5-4.5z"' + F4 + ' stroke="none"/><circle cx="21" cy="35" r="1.5"' + FC + '/><circle cx="27" cy="37" r="1.2"' + FC + '/><circle cx="25" cy="25" r="1.2"' + FC + ' fill-opacity=".6"/>',
    Q06: '<path d="M10 9v29a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V9"/><path d="M10 16h28M38 15.99v.02" stroke-width="3.4"/><path d="M24 16V4M19 4h10"/><rect x="11" y="18" width="26" height="22" rx="2"' + F + ' stroke="none"/><circle cx="17" cy="25" r="1.8"' + FC + '/><circle cx="29" cy="23" r="1.8"' + FC + '/><circle cx="23" cy="32" r="1.8"' + FC + '/><circle cx="31" cy="35" r="1.8"' + FC + '/><path d="M14 33l-2 2M33 27l2-1" stroke-opacity=".6"/>',
    Q07: '<path d="M24 43c-10 0-14-8-11-16 2-6 7-8 6-19 8 5 14 12 15 20 1 8-3 15-10 15z"' + F + '/><path d="M24 43c-4 0-6-4-4-8 1-3 4-4 4-8 4 4 6 8 4 12-1 3-2 4-4 4z"' + F4 + '/>',
    Q08: '<path d="M7 19h33l-7-7"/><path d="M41 29H8l7 7"/>',
    Q09: '<rect x="5" y="14" width="33" height="20" rx="3.5"' + F + '/><rect x="38" y="20" width="5" height="8" rx="1.5"' + F4 + '/><path d="M13 24h6M29 20v8M25 24h8"/><path d="M24 14v20M23.99 34h.02" stroke-opacity=".3"/>',
    Q10: '<circle cx="21" cy="36" r="6.5"' + F4 + '/><path d="M18 31V9a3 3 0 0 1 6 0v22"/><path d="M21 34V17M20.99 17h.02" stroke-width="3.4"/><path d="M29 12h5M29 18h3.5M29 24h5"/>',
    Q11: '<path d="M24 9l13 7.5v15L24 39l-13-7.5v-15z"' + F + '/><circle cx="24" cy="24" r="7"/><circle cx="24" cy="9" r="1.9"' + FC + '/><circle cx="37" cy="16.5" r="1.9"' + FC + '/><circle cx="37" cy="31.5" r="1.9"' + FC + '/><circle cx="24" cy="39" r="1.9"' + FC + '/><circle cx="11" cy="31.5" r="1.9"' + FC + '/><circle cx="11" cy="16.5" r="1.9"' + FC + '/>',
    Q12: '<rect x="12" y="10" width="24" height="28" rx="2"' + F + ' stroke="none"/><path d="M15 9h-4v30h4M33 9h4v30h-4"/><path d="M3 24h7M38 24h7M45 23.99v.02" stroke-opacity=".6"/><path d="M15 29l4.5-9 4.5 9 4.5-9 4.5 9"/>' + txt(42, 44, 11, 'n'),
    /* PORTUGUES */
    P01: L('<path d="M20.001 19A2 2 0 0 0 22 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"' + F + '/><path d="M12 5v16M16 13h2M16 9h2M6 13h2M6 9h2"/>'),
    P02: '<path d="M8 8h21a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H15l-6 5v-5H8a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3z"' + F4 + '/><path d="M36 18h4a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-1v5l-6-5H24a3 3 0 0 1-3-3v-1"' + F + '/>',
    P03: '<rect x="14" y="5" width="24" height="30" rx="3" transform="rotate(8 26 20)"' + F + '/><rect x="9" y="11" width="24" height="31" rx="3"' + F4 + '/><path d="M14 19h14M14 25h14M14 31h9"/>',
    P04: L('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
    P05: '<circle cx="20" cy="20" r="13"' + F + '/><path d="M30 30l12 12" stroke-width="3.6"/>' + txt(20, 24.5, 12, 'abc', 'font-family="Georgia,Cambria,serif" font-weight="700"'),
    P06: L('<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"' + F + '/><path transform="translate(6.6 6.6) scale(.45)" stroke-width="2.2" d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"' + F4 + '/>'),
    P07: txt(24, 33, 25, 'Aa', 'font-family="Georgia,Cambria,serif" font-weight="700"'),
    P08: '<rect x="4" y="16" width="15" height="12" rx="4"' + F4 + '/><rect x="22" y="16" width="19" height="12" rx="4"' + F + '/><circle cx="44.5" cy="26" r="1.9"' + FC + '/><path d="M4 35h37M41 34.99v.02" stroke-opacity=".45"/>' + txt(11.5, 25.5, 8, 'S', 'font-family="system-ui,sans-serif" font-weight="700"') + txt(31.5, 25.5, 8, 'P', 'font-family="system-ui,sans-serif" font-weight="700"'),
    P09: '<rect x="4" y="8" width="20" height="12" rx="4"' + F4 + '/><rect x="24" y="28" width="20" height="12" rx="4"' + F + '/><path d="M14 20c0 9 4 14 10 14"/><path d="M21 31l3 3-3 3"/>',
    P10: txt(24, 39, 32, 'a', 'font-family="Georgia,Cambria,serif"') + '<path d="M17 7l7.5 6" stroke-width="3.4"/>',
    P11: '<path d="M40 5C27 7 17 17 13 33l-2 9 6-7c14-3 22-13 23-30z"' + F + '/><path d="M11 42 30 16M20 26h7M24 20h8" stroke-opacity=".85"/>',
    P12: L('<path d="M5.828 18.172a2.828 2.828 0 0 0 4 0l10.586-10.586a2 2 0 0 0 0-2.829l-1.171-1.171a2 2 0 0 0-2.829 0L5.828 14.172a2.828 2.828 0 0 0 0 4"' + F + '/><path d="M14 6l7 7-4 4"/><path d="M4 20l1.768-1.768"/>')
  };
  /* icones das materias (design/icones_pro: Phosphor MIT, Tabler MIT, Lucide ISC, Healthicons CC0, bioicons CC0 e desenhos
     proprios; creditos em icones_pro/LICENCAS.md). Embutidos pelo gera_design.py: so os da propria materia em cada app. */
  var PRO = {"OUTRO":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M64,64l40,120H24ZM200,76a44,44,0,1,0-44,44A44,44,0,0,0,200,76Zm-64,76v56h88V152Z\" opacity=\".25\"/><path d=\"M224,144H136a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8h88a8,8,0,0,0,8-8V152A8,8,0,0,0,224,144Zm-8,56H144V160h72ZM71.59,61.47a8,8,0,0,0-15.18,0l-40,120A8,8,0,0,0,24,192h80a8,8,0,0,0,7.59-10.53ZM35.1,176,64,89.3,92.9,176ZM208,76a52,52,0,1,0-52,52A52.06,52.06,0,0,0,208,76Zm-88,0a36,36,0,1,1,36,36A36,36,0,0,1,120,76Z\"/><\/g>","P01.1":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M208,104a79.86,79.86,0,0,1-30.59,62.92A24.29,24.29,0,0,0,168,186v6a8,8,0,0,1-8,8H96a8,8,0,0,1-8-8v-6a24.11,24.11,0,0,0-9.3-19A79.87,79.87,0,0,1,48,104.45C47.76,61.09,82.72,25,126.07,24A80,80,0,0,1,208,104Z\" opacity=\".25\"/><path d=\"M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.65,71.65,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Zm-16.11-9.34a57.6,57.6,0,0,0-46.56-46.55,8,8,0,0,0-2.66,15.78c16.57,2.79,30.63,16.85,33.44,33.45A8,8,0,0,0,176,104a9,9,0,0,0,1.35-.11A8,8,0,0,0,183.89,94.66Z\"/><\/g>","P01.2":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M104,180a28,28,0,1,1-28-28A28,28,0,0,1,104,180Zm76-28a28,28,0,1,0,28,28A28,28,0,0,0,180,152ZM166.11,51.29a8,8,0,0,0-12.7-.29L140.47,66a16,16,0,0,1-24.94,0L102.59,51a8,8,0,0,0-12.7.29L40,120H216Z\" opacity=\".25\"/><path d=\"M248,112H220.08l-47.5-65.41a16,16,0,0,0-25.31-.72l-12.85,14.9-.2.23a7.95,7.95,0,0,1-12.44,0l-.2-.23-12.85-14.9a16,16,0,0,0-25.31.72L35.92,112H8a8,8,0,0,0,0,16H248a8,8,0,0,0,0-16ZM96.34,56l.19.24,12.85,14.89a24,24,0,0,0,37.24,0l12.85-14.89c.06-.08.1-.16.17-.24l40.66,56H55.69ZM180,144a36,36,0,0,0-35.77,32H111.77a36,36,0,1,0-1.83,16h36.12A36,36,0,1,0,180,144ZM76,200a20,20,0,1,1,20-20A20,20,0,0,1,76,200Zm104,0a20,20,0,1,1,20-20A20,20,0,0,1,180,200Z\"/><\/g>","P01.3":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M224,56V200a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H216A8,8,0,0,1,224,56Z\" opacity=\".25\"/><path d=\"M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z\"/><\/g>","P01.4":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M176,128a48,48,0,1,1-48-48A48,48,0,0,1,176,128Z\" opacity=\".25\"/><path d=\"M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z\"/><\/g>","P01":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M232,56V200H160a32,32,0,0,0-32,32V88a32,32,0,0,1,32-32Z\" opacity=\".25\"/><path d=\"M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64ZM160,88h40a8,8,0,0,1,0,16H160a8,8,0,0,1,0-16Zm48,40a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,128Zm0,32a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,160Z\"/><\/g>","P02.1":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M104,188a28,28,0,1,1-28-28A28,28,0,0,1,104,188Z\" opacity=\".25\"/><path d=\"M76,152a36,36,0,1,0,36,36A36,36,0,0,0,76,152Zm0,56a20,20,0,1,1,20-20A20,20,0,0,1,76,208ZM42.34,106.34,56.69,92,42.34,77.66A8,8,0,0,1,53.66,66.34L68,80.69,82.34,66.34A8,8,0,0,1,93.66,77.66L79.31,92l14.35,14.34a8,8,0,0,1-11.32,11.32L68,103.31,53.66,117.66a8,8,0,0,1-11.32-11.32Zm187.32,96a8,8,0,0,1-11.32,11.32L204,199.31l-14.34,14.35a8,8,0,0,1-11.32-11.32L192.69,188l-14.35-14.34a8,8,0,0,1,11.32-11.32L204,176.69l14.34-14.35a8,8,0,0,1,11.32,11.32L215.31,188Zm-45.19-89.51c-6.18,22.33-25.32,41.63-46.53,46.93A8.13,8.13,0,0,1,136,160a8,8,0,0,1-1.93-15.76c15.63-3.91,30.35-18.91,35-35.68,3.19-11.5,3.22-29-14.71-46.9L152,59.31V80a8,8,0,0,1-16,0V40a8,8,0,0,1,8-8h40a8,8,0,0,1,0,16H163.31l2.35,2.34C183.9,68.59,190.58,90.78,184.47,112.83Z\"/><\/g>","P02.2":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M128,56C48,56,16,128,16,128s32,72,112,72,112-72,112-72S208,56,128,56Zm0,112a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z\" opacity=\".25\"/><path d=\"M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z\"/><\/g>","P02.3":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M216,48v55.77C216,174.6,176.6,232,128,232S40,174.6,40,103.79V48a8,8,0,0,1,10.89-7.47C66,46.41,95.11,55.71,128,55.71s62-9.3,77.11-15.16A8,8,0,0,1,216,48Z\" opacity=\".25\"/><path d=\"M217,34.8a15.94,15.94,0,0,0-14.82-1.71C188.15,38.55,159.82,47.71,128,47.71S67.84,38.55,53.79,33.09A16,16,0,0,0,32,48v55.77c0,35.84,9.65,69.65,27.18,95.18,18.16,26.46,42.6,41,68.82,41s50.66-14.57,68.82-41C214.35,173.44,224,139.63,224,103.79V48A16,16,0,0,0,217,34.8Zm-9,69c0,32.64-8.66,63.23-24.37,86.13C168.54,211.9,148.79,224,128,224s-40.54-12.1-55.63-34.08C56.66,167,48,136.43,48,103.79V48c15.11,5.87,45.58,15.71,80,15.71S192.9,53.87,208,48v55.81Zm-18,18.87A8,8,0,1,1,178,133.33c-2.68-3-8.85-5.33-14-5.33s-11.36,2.34-14,5.33A8,8,0,1,1,138,122.66c5.71-6.38,16.14-10.66,26-10.66S184.25,116.28,190,122.66ZM92,128c-5.19,0-11.36,2.34-14,5.33A8,8,0,1,1,66,122.66C71.75,116.28,82.18,112,92,112s20.25,4.28,26,10.66A8,8,0,1,1,106,133.33C103.36,130.34,97.19,128,92,128Zm76.45,45.19a52.9,52.9,0,0,1-80.9,0A8,8,0,1,1,99.72,162.8a36.89,36.89,0,0,0,56.56,0,8,8,0,0,1,12.17,10.39Z\"/><\/g>","P02.4":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M141.66,201,129,213.66a8,8,0,0,1-11.32,0L92,188,58.35,221.66a8,8,0,0,1-11.32,0L34.34,209a8,8,0,0,1,0-11.31L68,164,42.34,138.36a8,8,0,0,1,0-11.32L55,114.34a8,8,0,0,1,11.32,0l75.3,75.3A8,8,0,0,1,141.66,201Z\" opacity=\".25\"/><path d=\"M216,32H152a8,8,0,0,0-6.34,3.12l-64,83.21L72,108.69a16,16,0,0,0-22.64,0l-12.69,12.7a16,16,0,0,0,0,22.63l20,20-28,28a16,16,0,0,0,0,22.63l12.69,12.68a16,16,0,0,0,22.62,0l28-28,20,20a16,16,0,0,0,22.64,0l12.69-12.7a16,16,0,0,0,0-22.63l-9.64-9.64,83.21-64A8,8,0,0,0,224,104V40A8,8,0,0,0,216,32ZM52.69,216,40,203.32l28-28L80.68,188Zm70.61-8L48,132.71,60.7,120,136,195.31ZM208,100.06l-81.74,62.88L115.32,152l50.34-50.34a8,8,0,0,0-11.32-11.31L104,140.68,93.07,129.74,155.94,48H208Z\"/><\/g>","P02":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M231.66,213.73a8,8,0,0,1-9.93,9.93L194,215.5A72.05,72.05,0,0,1,92.06,175.89h0c1.31.07,2.62.11,3.94.11a72,72,0,0,0,67.93-95.88h0A72,72,0,0,1,223.5,186Z\" opacity=\".25\"/><path d=\"M232.07,186.76a80,80,0,0,0-62.5-114.17A80,80,0,1,0,23.93,138.76l-7.27,24.71a16,16,0,0,0,19.87,19.87l24.71-7.27a80.39,80.39,0,0,0,25.18,7.35,80,80,0,0,0,108.34,40.65l24.71,7.27a16,16,0,0,0,19.87-19.86ZM62,159.5a8.28,8.28,0,0,0-2.26.32L32,168l8.17-27.76a8,8,0,0,0-.63-6,64,64,0,1,1,26.26,26.26A8,8,0,0,0,62,159.5Zm153.79,28.73L224,216l-27.76-8.17a8,8,0,0,0-6,.63,64.05,64.05,0,0,1-85.87-24.88A79.93,79.93,0,0,0,174.7,89.71a64,64,0,0,1,41.75,92.48A8,8,0,0,0,215.82,188.23Z\"/><\/g>","P03.1":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M200,176H104s8,6,8,16a24,24,0,0,1-48,0V64A24,24,0,0,0,40,40H176a24,24,0,0,1,24,24Z\" opacity=\".25\"/><path d=\"M96,104a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H104A8,8,0,0,1,96,104Zm8,40h64a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16Zm128,48a32,32,0,0,1-32,32H88a32,32,0,0,1-32-32V64a16,16,0,0,0-32,0c0,5.74,4.83,9.62,4.88,9.66h0A8,8,0,0,1,24,88a7.89,7.89,0,0,1-4.79-1.61h0C18.05,85.54,8,77.61,8,64A32,32,0,0,1,40,32H176a32,32,0,0,1,32,32V168h8a8,8,0,0,1,4.8,1.6C222,170.46,232,178.39,232,192ZM96.26,173.48A8.07,8.07,0,0,1,104,168h88V64a16,16,0,0,0-16-16H67.69A31.71,31.71,0,0,1,72,64V192a16,16,0,0,0,32,0c0-5.74-4.83-9.62-4.88-9.66A7.82,7.82,0,0,1,96.26,173.48ZM216,192a12.58,12.58,0,0,0-3.23-8h-94a26.92,26.92,0,0,1,1.21,8,31.82,31.82,0,0,1-4.29,16H200A16,16,0,0,0,216,192Z\"/><\/g>","P03.2":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M224,64V184a16,16,0,0,1-16,16H32a16,16,0,0,0,16-16V64a8,8,0,0,1,8-8H216A8,8,0,0,1,224,64Z\" opacity=\".25\"/><path d=\"M88,112a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm8,40h80a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16ZM232,64V184a24,24,0,0,1-24,24H32A24,24,0,0,1,8,184.11V88a8,8,0,0,1,16,0v96a8,8,0,0,0,16,0V64A16,16,0,0,1,56,48H216A16,16,0,0,1,232,64Zm-16,0H56V184a23.84,23.84,0,0,1-1.37,8H208a8,8,0,0,0,8-8Z\"/><\/g>","P03.3":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M224,56V184a8,8,0,0,1-8,8H150.93l-16,28a8,8,0,0,1-13.9,0l-16-28H40a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H216A8,8,0,0,1,224,56Z\" opacity=\".25\"/><path d=\"M116,120a12,12,0,1,1,12,12A12,12,0,0,1,116,120ZM84,132a12,12,0,1,0-12-12A12,12,0,0,0,84,132Zm88,0a12,12,0,1,0-12-12A12,12,0,0,0,172,132Zm60-76V184a16,16,0,0,1-16,16H155.57l-13.68,23.94a16,16,0,0,1-27.78,0L100.43,200H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Zm-16,0H40V184h65.07a8,8,0,0,1,7,4l16,28,16-28a8,8,0,0,1,7-4H216Z\"/><\/g>","P03.4":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M192,56V200H64V56Z\" opacity=\".25\"/><path d=\"M176,16H80A24,24,0,0,0,56,40V216a24,24,0,0,0,24,24h96a24,24,0,0,0,24-24V40A24,24,0,0,0,176,16ZM72,64H184V192H72Zm8-32h96a8,8,0,0,1,8,8v8H72V40A8,8,0,0,1,80,32Zm96,192H80a8,8,0,0,1-8-8v-8H184v8A8,8,0,0,1,176,224Z\"/><\/g>","P03":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M48,72h64V184H48ZM190.64,38.39a8,8,0,0,0-9.5-6.21l-46.81,10a8.07,8.07,0,0,0-6.15,9.57L139.79,107l62.46-13.42Z\" opacity=\".25\"/><path d=\"M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm6.62,31.47,46.82-10.05,3.34,15.9L146,97.53Zm6.64,31.57,46.82-10.06,13.3,63.24-46.82,10.06ZM216,197.94l-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm0,32h48v96H56Zm48,128H56V192h48v16Z\"/><\/g>","P04.1":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M216,116v36a80,80,0,0,1-80,80c-44.18,0-55.81-24-93.32-90a20,20,0,0,1,34.64-20L96,152V44a20,20,0,0,1,40,0v56a20,20,0,0,1,40,0v16a20,20,0,0,1,40,0Z\" opacity=\".25\"/><path d=\"M196,88a27.86,27.86,0,0,0-13.35,3.39A28,28,0,0,0,144,74.7V44a28,28,0,0,0-56,0v80l-3.82-6.13A28,28,0,0,0,35.73,146l4.67,8.23C74.81,214.89,89.05,240,136,240a88.1,88.1,0,0,0,88-88V116A28,28,0,0,0,196,88Zm12,64a72.08,72.08,0,0,1-72,72c-37.63,0-47.84-18-81.68-77.68l-4.69-8.27,0-.05A12,12,0,0,1,54,121.61a11.88,11.88,0,0,1,6-1.6,12,12,0,0,1,10.41,6,1.76,1.76,0,0,0,.14.23l18.67,30A8,8,0,0,0,104,152V44a12,12,0,0,1,24,0v68a8,8,0,0,0,16,0V100a12,12,0,0,1,24,0v20a8,8,0,0,0,16,0v-4a12,12,0,0,1,24,0Z\"/><\/g>","P04.2":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M184,40v64l-56,56L72,104V40Z\" opacity=\".25\"/><path d=\"M192,40v64a8,8,0,0,1-2.34,5.66L136,163.31v49.38l18.34-18.35a8,8,0,0,1,11.32,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L120,212.69V163.31L66.34,109.66A8,8,0,0,1,64,104V40a8,8,0,0,1,16,0v60.69l48,48,48-48V40a8,8,0,0,1,16,0Z\"/><\/g>","P04.3":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M144,48V160H96A56,56,0,0,1,96,48Z\" opacity=\".25\"/><path d=\"M208,40H96a64,64,0,0,0,0,128h40v40a8,8,0,0,0,16,0V56h24V208a8,8,0,0,0,16,0V56h16a8,8,0,0,0,0-16ZM136,152H96a48,48,0,0,1,0-96h40Z\"/><\/g>","P04.4":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M204.28,108.28l-96,96a40,40,0,0,1-56.56-56.56l96-96a40,40,0,0,1,56.56,56.56Z\" opacity=\".25\"/><path d=\"M198.63,57.37a32,32,0,0,0-45.19-.06L141.79,69.52a8,8,0,0,1-11.58-11l11.72-12.29a1.59,1.59,0,0,1,.13-.13,48,48,0,0,1,67.88,67.88,1.59,1.59,0,0,1-.13.13l-12.29,11.72a8,8,0,0,1-11-11.58l12.21-11.65A32,32,0,0,0,198.63,57.37ZM114.21,186.48l-11.65,12.21a32,32,0,0,1-45.25-45.25l12.21-11.65a8,8,0,0,0-11-11.58L46.19,141.93a1.59,1.59,0,0,0-.13.13,48,48,0,0,0,67.88,67.88,1.59,1.59,0,0,0,.13-.13l11.72-12.29a8,8,0,1,0-11.58-11ZM216,152H192a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16ZM40,104H64a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm120,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V192A8,8,0,0,0,160,184ZM96,72a8,8,0,0,0,8-8V40a8,8,0,0,0-16,0V64A8,8,0,0,0,96,72Z\"/><\/g>","P04":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M218.34,119.6,183.6,154.34a46.58,46.58,0,0,1-44.31,12.26c-.31.34-.62.67-.95,1L103.6,202.34A46.63,46.63,0,1,1,37.66,136.4L72.4,101.66A46.6,46.6,0,0,1,116.71,89.4c.31-.34.62-.67,1-1L152.4,53.66a46.63,46.63,0,0,1,65.94,65.94Z\" opacity=\".25\"/><path d=\"M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,7.78,8.22H152a8,8,0,0,0,8-7.78A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z\"/><\/g>","P05.1":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M216,48V152a8,8,0,0,1-8,8H168v48a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V104a8,8,0,0,1,8-8H88V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z\" opacity=\".25\"/><path d=\"M224,48V152a16,16,0,0,1-16,16H99.31l10.35,10.34a8,8,0,0,1-11.32,11.32l-24-24a8,8,0,0,1,0-11.32l24-24a8,8,0,0,1,11.32,11.32L99.31,152H208V48H96v8a8,8,0,0,1-16,0V48A16,16,0,0,1,96,32H208A16,16,0,0,1,224,48ZM168,192a8,8,0,0,0-8,8v8H48V104H156.69l-10.35,10.34a8,8,0,0,0,11.32,11.32l24-24a8,8,0,0,0,0-11.32l-24-24a8,8,0,0,0-11.32,11.32L156.69,88H48a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16H160a16,16,0,0,0,16-16v-8A8,8,0,0,0,168,192Z\"/><\/g>","P05.2":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M192,136v80H64V136l64-64Z\" opacity=\".25\"/><path d=\"M229.66,189.66l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L184,196.69V139.31l-56-56-56,56v57.38l18.34-18.35a8,8,0,0,1,11.32,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L56,196.69V136a8,8,0,0,1,2.34-5.66L120,68.69V24a8,8,0,0,1,16,0V68.69l61.66,61.65A8,8,0,0,1,200,136v60.69l18.34-18.35a8,8,0,0,1,11.32,11.32Z\"/><\/g>","P05.3":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M104.64,147.28a60,60,0,0,1-36-46.56A60.06,60.06,0,0,1,128,108,59.94,59.94,0,0,0,104.64,147.28Zm0,0A60,60,0,0,0,128,204a60,60,0,0,0,23.36-56.72,60.17,60.17,0,0,1-46.72,0Zm82.72-46.56A60.06,60.06,0,0,0,128,108a59.94,59.94,0,0,1,23.36,39.28A60,60,0,0,0,187.36,100.72Z\" opacity=\".25\"/><path d=\"M195.88,96c.07-1.31.12-2.63.12-4A68,68,0,0,0,60,92c0,1.33,0,2.65.12,4A68,68,0,1,0,128,213.65,68,68,0,1,0,195.88,96ZM128,193.47a51.89,51.89,0,0,1-16-35.38,67.55,67.55,0,0,0,31.9,0A51.89,51.89,0,0,1,128,193.47ZM128,144a51.93,51.93,0,0,1-14.08-1.95A52.06,52.06,0,0,1,128,118.53a52.06,52.06,0,0,1,14.08,23.52A51.93,51.93,0,0,1,128,144Zm-28.77-8.71A52.19,52.19,0,0,1,77.92,106a51.88,51.88,0,0,1,36.79,3.28A68.17,68.17,0,0,0,99.23,135.29Zm42.06-26.06A51.88,51.88,0,0,1,178.08,106a52.19,52.19,0,0,1-21.31,29.34A68.17,68.17,0,0,0,141.29,109.23ZM128,40A52.06,52.06,0,0,1,180,89.91,67.72,67.72,0,0,0,128,98.35a67.72,67.72,0,0,0-51.95-8.44A52.06,52.06,0,0,1,128,40ZM40,156a52,52,0,0,1,23.23-43.29A68.36,68.36,0,0,0,96.12,152c-.07,1.31-.12,2.63-.12,4a67.74,67.74,0,0,0,18.71,46.77A52,52,0,0,1,40,156Zm124,52a51.65,51.65,0,0,1-22.71-5.23A67.74,67.74,0,0,0,160,156c0-1.33-.05-2.65-.12-4a68.36,68.36,0,0,0,32.89-39.33A52,52,0,0,1,164,208Z\"/><\/g>","P05.4":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M168,144a40,40,0,1,1-40-40A40,40,0,0,1,168,144ZM64,56A32,32,0,1,0,96,88,32,32,0,0,0,64,56Zm128,0a32,32,0,1,0,32,32A32,32,0,0,0,192,56Z\" opacity=\".25\"/><path d=\"M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1,0-16,24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.85,8,57,57,0,0,0-98.15,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z\"/><\/g>","P05":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M208,32V192H72a24,24,0,0,0-24,24V56A24,24,0,0,1,72,32h40v96l32-24,32,24V32Z\" opacity=\".25\"/><path d=\"M208,24H72A32,32,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24ZM120,40h48v72L148.79,97.6a8,8,0,0,0-9.6,0L120,112Zm80,144H72a31.82,31.82,0,0,0-16,4.29V56A16,16,0,0,1,72,40h32v88a8,8,0,0,0,12.8,6.4L144,114l27.21,20.4A8,8,0,0,0,176,136a8.1,8.1,0,0,0,3.58-.84A8,8,0,0,0,184,128V40h16Z\"/><\/g>","P06.1":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M128,200c-15.37,0-40.77-.18-70-17.64S19.31,143,16.28,131.82A7.94,7.94,0,0,1,21.74,122a69.59,69.59,0,0,1,30.82-.64h0c-7.63-23.88-4-42.44-1-51.71A8.2,8.2,0,0,1,61,64.18C68.56,65.79,81.28,70,94.6,80.8v0A108.49,108.49,0,0,0,88,119.18C88,178,128,200,128,200Zm106.26-78a69.59,69.59,0,0,0-30.82-.64h0c7.63-23.88,4-42.44,1-51.71A8.2,8.2,0,0,0,195,64.18c-7.52,1.61-20.24,5.8-33.56,16.62v0A108.49,108.49,0,0,1,168,119.18C168,178,128,200,128,200c15.37,0,40.77-.18,70-17.64s38.69-39.34,41.72-50.54A7.94,7.94,0,0,0,234.26,122Z\" opacity=\".25\"/><path d=\"M245.83,121.63a15.53,15.53,0,0,0-9.52-7.33,73.51,73.51,0,0,0-22.17-2.22c4-19.85,1-35.55-2.06-44.86a16.15,16.15,0,0,0-18.79-10.88,85.53,85.53,0,0,0-28.55,12.12,94.58,94.58,0,0,0-27.11-33.25,16.05,16.05,0,0,0-19.26,0A94.48,94.48,0,0,0,91.26,68.46,85.53,85.53,0,0,0,62.71,56.34,16.15,16.15,0,0,0,43.92,67.22c-3,9.31-6,25-2.06,44.86a73.51,73.51,0,0,0-22.17,2.22,15.53,15.53,0,0,0-9.52,7.33,16,16,0,0,0-1.6,12.27c3.39,12.57,13.8,36.48,45.33,55.32S113.13,208,128.05,208s42.67,0,74-18.78c31.53-18.84,41.94-42.75,45.33-55.32A16,16,0,0,0,245.83,121.63ZM59.14,72.14a.2.2,0,0,1,.23-.15A70.43,70.43,0,0,1,85.18,83.66,118.65,118.65,0,0,0,80,119.17c0,18.74,3.77,34,9.11,46.28A123.59,123.59,0,0,1,69.57,140C51.55,108.62,55.3,84,59.14,72.14Zm3,103.35C35.47,159.57,26.82,140.05,24,129.7a59.82,59.82,0,0,1,22.5-1.17,129.08,129.08,0,0,0,9.15,19.41,142.28,142.28,0,0,0,34,39.56A114.92,114.92,0,0,1,62.1,175.49ZM128,190.4c-9.33-6.94-32-28.23-32-71.23C96,76.7,118.38,55.24,128,48c9.62,7.26,32,28.72,32,71.19C160,162.17,137.33,183.46,128,190.4ZM170.82,83.66A70.43,70.43,0,0,1,196.63,72a.2.2,0,0,1,.23.15C200.7,84,204.45,108.62,186.43,140a123.32,123.32,0,0,1-19.54,25.48c5.34-12.26,9.11-27.54,9.11-46.28A118.65,118.65,0,0,0,170.82,83.66ZM232,129.72c-2.77,10.25-11.4,29.81-38.09,45.77a114.92,114.92,0,0,1-27.55,12,142.28,142.28,0,0,0,34-39.56,129.08,129.08,0,0,0,9.15-19.41A59.69,59.69,0,0,1,232,129.71Z\"/><\/g>","P06.2":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M224,128a96,96,0,0,1-96,96V32A96,96,0,0,1,224,128Z\" opacity=\".25\"/><path d=\"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM40,128a88.11,88.11,0,0,1,80-87.63V215.63A88.11,88.11,0,0,1,40,128Zm96,87.63V40.37a88,88,0,0,1,0,175.26Z\"/><\/g>","P06.3":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M208,96v64H48V96Z\" opacity=\".25\"/><path d=\"M56,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0ZM88,24a8,8,0,0,0-8,8V224a8,8,0,0,0,16,0V32A8,8,0,0,0,88,24Zm40,32a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V64A8,8,0,0,0,128,56Zm40,32a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,168,88Zm40-16a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V80A8,8,0,0,0,208,72Z\"/><\/g>","P06":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M194.82,151.43l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0l-20.3-55.09-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3A7.92,7.92,0,0,1,194.82,151.43Z\" opacity=\".25\"/><path d=\"M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z\"/><\/g>","P07.1":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M237.66,153,153,237.66a8,8,0,0,1-11.31,0L42.34,138.34A8,8,0,0,1,40,132.69V40h92.69a8,8,0,0,1,5.65,2.34l99.32,99.32A8,8,0,0,1,237.66,153Z\" opacity=\".25\"/><path d=\"M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z\"/><\/g>","P07.2":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M192,96a64,64,0,1,1-64-64A64,64,0,0,1,192,96Z\" opacity=\".25\"/><path d=\"M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z\"/><\/g>","P07.3":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z\" opacity=\".25\"/><path d=\"M232,136.66A104.12,104.12,0,1,1,119.34,24,8,8,0,0,1,120.66,40,88.12,88.12,0,1,0,216,135.34,8,8,0,0,1,232,136.66ZM120,72v56a8,8,0,0,0,8,8h56a8,8,0,0,0,0-16H136V72a8,8,0,0,0-16,0Zm40-24a12,12,0,1,0-12-12A12,12,0,0,0,160,48Zm36,24a12,12,0,1,0-12-12A12,12,0,0,0,196,72Zm24,36a12,12,0,1,0-12-12A12,12,0,0,0,220,108Z\"/><\/g>","P07.4":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M64,112v32a8,8,0,0,1-8,8H24a8,8,0,0,1-8-8V112a8,8,0,0,1,8-8H56A8,8,0,0,1,64,112ZM208,40H160a8,8,0,0,0-8,8V96a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V48A8,8,0,0,0,208,40Zm0,112H160a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V160A8,8,0,0,0,208,152Z\" opacity=\".25\"/><path d=\"M160,112h48a16,16,0,0,0,16-16V48a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16V64H128a24,24,0,0,0-24,24v32H72v-8A16,16,0,0,0,56,96H24A16,16,0,0,0,8,112v32a16,16,0,0,0,16,16H56a16,16,0,0,0,16-16v-8h32v32a24,24,0,0,0,24,24h16v16a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V160a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16v16H128a8,8,0,0,1-8-8V88a8,8,0,0,1,8-8h16V96A16,16,0,0,0,160,112ZM56,144H24V112H56v32Zm104,16h48v48H160Zm0-112h48V96H160Z\"/><\/g>","P07":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M204,168a28,28,0,0,0,12-2.69V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V165.31a28,28,0,1,1,0-50.62V72a8,8,0,0,1,8-8h46.69a28,28,0,1,1,50.61,0H208a8,8,0,0,1,8,8v42.69A28,28,0,1,0,204,168Z\" opacity=\".25\"/><path d=\"M220.27,158.54a8,8,0,0,0-7.7-.46,20,20,0,1,1,0-36.16A8,8,0,0,0,224,114.69V72a16,16,0,0,0-16-16H171.78a35.36,35.36,0,0,0,.22-4,36.15,36.15,0,0,0-11.36-26.25,36,36,0,0,0-60.55,23.63,36.56,36.56,0,0,0,.14,6.62H64A16,16,0,0,0,48,72v32.22a35.36,35.36,0,0,0-4-.22,36.12,36.12,0,0,0-26.24,11.36,35.7,35.7,0,0,0-9.69,27,36.08,36.08,0,0,0,33.31,33.6,36.56,36.56,0,0,0,6.62-.14V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V165.31A8,8,0,0,0,220.27,158.54ZM208,208H64V165.31a8,8,0,0,0-11.43-7.23,20,20,0,1,1,0-36.16A8,8,0,0,0,64,114.69V72h46.69a8,8,0,0,0,7.23-11.43,20,20,0,1,1,36.16,0A8,8,0,0,0,161.31,72H208v32.23a35.68,35.68,0,0,0-6.62-.14A36,36,0,0,0,204,176a35.36,35.36,0,0,0,4-.22Z\"/><\/g>","P08.1":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M160,112a32,32,0,1,1-32-32A32,32,0,0,1,160,112Z\" opacity=\".25\"/><path d=\"M224,40V76a8,8,0,0,1-16,0V48H180a8,8,0,0,1,0-16h36A8,8,0,0,1,224,40Zm-8,132a8,8,0,0,0-8,8v28H180a8,8,0,0,0,0,16h36a8,8,0,0,0,8-8V180A8,8,0,0,0,216,172ZM76,208H48V180a8,8,0,0,0-16,0v36a8,8,0,0,0,8,8H76a8,8,0,0,0,0-16ZM40,84a8,8,0,0,0,8-8V48H76a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8V76A8,8,0,0,0,40,84Zm136,92a8,8,0,0,1-6.41-3.19,52,52,0,0,0-83.2,0,8,8,0,1,1-12.8-9.62A67.94,67.94,0,0,1,101,141.51a40,40,0,1,1,53.94,0,67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,176,176Zm-48-40a24,24,0,1,0-24-24A24,24,0,0,0,128,136Z\"/><\/g>","P08.2":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M160,128a32,32,0,1,1-32-32A32,32,0,0,1,160,128Z\" opacity=\".25\"/><path d=\"M232,120h-8.34A96.14,96.14,0,0,0,136,32.34V24a8,8,0,0,0-16,0v8.34A96.14,96.14,0,0,0,32.34,120H24a8,8,0,0,0,0,16h8.34A96.14,96.14,0,0,0,120,223.66V232a8,8,0,0,0,16,0v-8.34A96.14,96.14,0,0,0,223.66,136H232a8,8,0,0,0,0-16Zm-96,87.6V200a8,8,0,0,0-16,0v7.6A80.15,80.15,0,0,1,48.4,136H56a8,8,0,0,0,0-16H48.4A80.15,80.15,0,0,1,120,48.4V56a8,8,0,0,0,16,0V48.4A80.15,80.15,0,0,1,207.6,120H200a8,8,0,0,0,0,16h7.6A80.15,80.15,0,0,1,136,207.6ZM128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152Z\"/><\/g>","P08.3":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M144,69.09V170.91L50.24,199.67A8,8,0,0,1,40,192V48a8,8,0,0,1,10.24-7.67Z\" opacity=\".25\"/><path d=\"M228.54,86.66l-176.06-54A16,16,0,0,0,32,48V192a16,16,0,0,0,16,16,16,16,0,0,0,4.52-.65L136,181.73V192a16,16,0,0,0,16,16h32a16,16,0,0,0,16-16v-29.9l28.54-8.75A16.09,16.09,0,0,0,240,138V102A16.09,16.09,0,0,0,228.54,86.66ZM136,165,48,192V48l88,27Zm48,27H152V176.82L184,167Zm40-54-.11,0L152,160.08V79.92l71.89,22,.11,0v36Z\"/><\/g>","P08.4":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M232,88v64H168Z\" opacity=\".25\"/><path d=\"M235.06,80.61a8,8,0,0,0-8.72,1.73l-26.48,26.49A104,104,0,0,0,24,184a8,8,0,0,0,16,0,88,88,0,0,1,148.53-63.84l-26.19,26.18A8,8,0,0,0,168,160h64a8,8,0,0,0,8-8V88A8,8,0,0,0,235.06,80.61ZM224,144H187.31L224,107.31Z\"/><\/g>","P08":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M216,40V216H40V40Z\" opacity=\".25\"/><path d=\"M48,48V208H80a8,8,0,0,1,0,16H40a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16ZM216,32H176a8,8,0,0,0,0,16h32V208H176a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32Z\"/><\/g>","P09.1":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M216,152v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8H208A8,8,0,0,1,216,152Zm-8-96H48a8,8,0,0,0-8,8v40a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V64A8,8,0,0,0,208,56Z\" opacity=\".25\"/><path d=\"M208,136H48a16,16,0,0,0-16,16v40a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V152A16,16,0,0,0,208,136Zm0,56H48V152H208v40Zm0-144H48A16,16,0,0,0,32,64v40a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V64A16,16,0,0,0,208,48Zm0,56H48V64H208v40Z\"/><\/g>","P09.2":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M104,32V64a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V32a8,8,0,0,1,8-8H96A8,8,0,0,1,104,32ZM208,96H176a8,8,0,0,0-8,8v32a8,8,0,0,0,8,8h32a8,8,0,0,0,8-8V104A8,8,0,0,0,208,96Zm0,88H176a8,8,0,0,0-8,8v32a8,8,0,0,0,8,8h32a8,8,0,0,0,8-8V192A8,8,0,0,0,208,184Z\" opacity=\".25\"/><path d=\"M176,152h32a16,16,0,0,0,16-16V104a16,16,0,0,0-16-16H176a16,16,0,0,0-16,16v8H88V80h8a16,16,0,0,0,16-16V32A16,16,0,0,0,96,16H64A16,16,0,0,0,48,32V64A16,16,0,0,0,64,80h8V192a24,24,0,0,0,24,24h64v8a16,16,0,0,0,16,16h32a16,16,0,0,0,16-16V192a16,16,0,0,0-16-16H176a16,16,0,0,0-16,16v8H96a8,8,0,0,1-8-8V128h72v8A16,16,0,0,0,176,152ZM64,32H96V64H64ZM176,192h32v32H176Zm0-88h32v32H176Z\"/><\/g>","P09.3":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M221.9,61.38,152,136v58.65a8,8,0,0,1-3.56,6.66l-32,21.33A8,8,0,0,1,104,216V136L34.1,61.38A8,8,0,0,1,40,48H216A8,8,0,0,1,221.9,61.38Z\" opacity=\".25\"/><path d=\"M230.6,49.53A15.81,15.81,0,0,0,216,40H40A16,16,0,0,0,28.19,66.76l.08.09L96,139.17V216a16,16,0,0,0,24.87,13.32l32-21.34A16,16,0,0,0,160,194.66V139.17l67.74-72.32.08-.09A15.8,15.8,0,0,0,230.6,49.53ZM40,56h0Zm106.18,74.58A8,8,0,0,0,144,136v58.66L112,216V136a8,8,0,0,0-2.16-5.47L40,56H216Z\"/><\/g>","P09.4":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M128,32a96,96,0,1,0,96,96A96,96,0,0,0,128,32Zm16,112L80,176l32-64,64-32Z\" opacity=\".25\"/><path d=\"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z\"/><\/g>","P09.5":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48Z\" opacity=\".25\"/><path d=\"M144,104V64a8,8,0,0,1,16,0V84.69l42.34-42.35a8,8,0,0,1,11.32,11.32L171.31,96H192a8,8,0,0,1,0,16H152A8,8,0,0,1,144,104Zm-40,40H64a8,8,0,0,0,0,16H84.69L42.34,202.34a8,8,0,0,0,11.32,11.32L96,171.31V192a8,8,0,0,0,16,0V152A8,8,0,0,0,104,144Zm67.31,16H192a8,8,0,0,0,0-16H152a8,8,0,0,0-8,8v40a8,8,0,0,0,16,0V171.31l42.34,42.35a8,8,0,0,0,11.32-11.32ZM104,56a8,8,0,0,0-8,8V84.69L53.66,42.34A8,8,0,0,0,42.34,53.66L84.69,96H64a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V64A8,8,0,0,0,104,56Z\"/><\/g>","P09":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M80,176a32,32,0,1,1-32-32A32,32,0,0,1,80,176Z\" opacity=\".25\"/><path d=\"M245.66,74.34l-32-32a8,8,0,0,0-11.32,11.32L220.69,72H208c-49.33,0-61.05,28.12-71.38,52.92-9.38,22.51-16.92,40.59-49.48,42.84a40,40,0,1,0,.1,16c43.26-2.65,54.34-29.15,64.14-52.69C161.41,107,169.33,88,208,88h12.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,245.66,74.34ZM48,200a24,24,0,1,1,24-24A24,24,0,0,1,48,200Z\"/><\/g>","P10.1":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M200,152l-40,40L96,176,40,136,72.68,70.63,128,56l55.32,14.63L183.6,72H144L98.34,116.29a8,8,0,0,0,1.38,12.42C117.23,139.9,141,139.13,160,120Z\" opacity=\".25\"/><path d=\"M254.3,107.91,228.78,56.85a16,16,0,0,0-21.47-7.15L182.44,62.13,130.05,48.27a8.14,8.14,0,0,0-4.1,0L73.56,62.13,48.69,49.7a16,16,0,0,0-21.47,7.15L1.7,107.9a16,16,0,0,0,7.15,21.47l27,13.51,55.49,39.63a8.06,8.06,0,0,0,2.71,1.25l64,16a8,8,0,0,0,7.6-2.1l55.07-55.08,26.42-13.21a16,16,0,0,0,7.15-21.46Zm-54.89,33.37L165,113.72a8,8,0,0,0-10.68.61C136.51,132.27,116.66,130,104,122L147.24,80h31.81l27.21,54.41ZM41.53,64,62,74.22,36.43,125.27,16,115.06Zm116,119.13L99.42,168.61l-49.2-35.14,28-56L128,64.28l9.8,2.59-45,43.68-.08.09a16,16,0,0,0,2.72,24.81c20.56,13.13,45.37,11,64.91-5L188,152.66Zm62-57.87-25.52-51L214.47,64,240,115.06Zm-87.75,92.67a8,8,0,0,1-7.75,6.06,8.13,8.13,0,0,1-1.95-.24L80.41,213.33a7.89,7.89,0,0,1-2.71-1.25L51.35,193.26a8,8,0,0,1,9.3-13l25.11,17.94L126,208.24A8,8,0,0,1,131.82,217.94Z\"/><\/g>","P10.2":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M104,56A24,24,0,1,1,80,32,24,24,0,0,1,104,56Z\" opacity=\".25\"/><path d=\"M208,112a32.05,32.05,0,0,0-30.69,23l-42.21-6a8,8,0,0,1-4.95-2.71L94.43,84.55A32,32,0,1,0,72,87v82a32,32,0,1,0,16,0V101.63l30,35a24,24,0,0,0,14.83,8.14l44,6.28A32,32,0,1,0,208,112ZM64,56A16,16,0,1,1,80,72,16,16,0,0,1,64,56ZM96,200a16,16,0,1,1-16-16A16,16,0,0,1,96,200Zm112-40a16,16,0,1,1,16-16A16,16,0,0,1,208,160Z\"/><\/g>","P10.3":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M208,80v96H48V80Z\" opacity=\".25\"/><path d=\"M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z\"/><\/g>","P10.4":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M108,72v72H40a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8h60A8,8,0,0,1,108,72Zm108-8H156a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h68V72A8,8,0,0,0,216,64Z\" opacity=\".25\"/><path d=\"M100,56H40A16,16,0,0,0,24,72v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,100,56Zm0,80H40V72h60ZM216,56H156a16,16,0,0,0-16,16v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,216,56Zm0,80H156V72h60Z\"/><\/g>","P10.5":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M232,152v64a8,8,0,0,1-8,8H160a72,72,0,0,1-67.9-48H96a72,72,0,0,0,72-72h0a71.83,71.83,0,0,0-4.07-23.88h0A72,72,0,0,1,232,152Z\" opacity=\".25\"/><path d=\"M169.57,72.59A80,80,0,0,0,16,104v64a16,16,0,0,0,16,16H86.67A80.15,80.15,0,0,0,160,232h64a16,16,0,0,0,16-16V152A80,80,0,0,0,169.57,72.59ZM32,104a64,64,0,1,1,64,64H32ZM224,216H160a64.14,64.14,0,0,1-55.68-32.43A79.93,79.93,0,0,0,174.7,89.71,64,64,0,0,1,224,152Z\"/><\/g>","P10":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M232,128c0,12.51-17.82,21.95-22.68,33.69-4.68,11.32,1.42,30.65-7.78,39.85s-28.53,3.1-39.85,7.78C150,214.18,140.5,232,128,232s-22-17.82-33.69-22.68c-11.32-4.68-30.65,1.42-39.85-7.78s-3.1-28.53-7.78-39.85C41.82,150,24,140.5,24,128s17.82-22,22.68-33.69C51.36,83,45.26,63.66,54.46,54.46S83,51.36,94.31,46.68C106.05,41.82,115.5,24,128,24S150,41.82,161.69,46.68c11.32,4.68,30.65-1.42,39.85,7.78s3.1,28.53,7.78,39.85C214.18,106.05,232,115.5,232,128Z\" opacity=\".25\"/><path d=\"M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-11.55,39.29c-4.79,5-9.75,10.17-12.38,16.52-2.52,6.1-2.63,13.07-2.73,19.82-.1,7-.21,14.33-3.32,17.43s-10.39,3.22-17.43,3.32c-6.75.1-13.72.21-19.82,2.73-6.35,2.63-11.52,7.59-16.52,12.38S132,224,128,224s-9.15-4.92-14.11-9.69-10.17-9.75-16.52-12.38c-6.1-2.52-13.07-2.63-19.82-2.73-7-.1-14.33-.21-17.43-3.32s-3.22-10.39-3.32-17.43c-.1-6.75-.21-13.72-2.73-19.82-2.63-6.35-7.59-11.52-12.38-16.52S32,132,32,128s4.92-9.15,9.69-14.11,9.75-10.17,12.38-16.52c2.52-6.1,2.63-13.07,2.73-19.82.1-7,.21-14.33,3.32-17.43S70.51,56.9,77.55,56.8c6.75-.1,13.72-.21,19.82-2.73,6.35-2.63,11.52-7.59,16.52-12.38S124,32,128,32s9.15,4.92,14.11,9.69,10.17,9.75,16.52,12.38c6.1,2.52,13.07,2.63,19.82,2.73,7,.1,14.33.21,17.43,3.32s3.22,10.39,3.32,17.43c.1,6.75.21,13.72,2.73,19.82,2.63,6.35,7.59,11.52,12.38,16.52S224,124,224,128,219.08,137.15,214.31,142.11ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z\"/><\/g>","P11.1":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M224,152v64H184V128ZM32,216H72V128L32,152Z\" opacity=\".25\"/><path d=\"M228.12,145.14,192,123.47V104a8,8,0,0,0-4-7L136,67.36V48h16a8,8,0,0,0,0-16H136V16a8,8,0,0,0-16,0V32H104a8,8,0,0,0,0,16h16V67.36L68,97.05a8,8,0,0,0-4,7v19.47L27.88,145.14A8,8,0,0,0,24,152v64a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V168a8,8,0,0,1,16,0v48a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V152A8,8,0,0,0,228.12,145.14ZM40,156.53l24-14.4V208H40ZM128,144a24,24,0,0,0-24,24v40H80V108.64l48-27.43,48,27.43V208H152V168A24,24,0,0,0,128,144Zm88,64H192V142.13l24,14.4Z\"/><\/g>","P11.2":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M232,102c0,66-104,122-104,122S24,168,24,102A54,54,0,0,1,78,48c22.59,0,41.94,12.31,50,32,8.06-19.69,27.41-32,50-32A54,54,0,0,1,232,102Z\" opacity=\".25\"/><path d=\"M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z\"/><\/g>","P11.3":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M104,164a36,36,0,1,1-36-36A36,36,0,0,1,104,164Zm84-36a36,36,0,1,0,36,36A36,36,0,0,0,188,128Z\" opacity=\".25\"/><path d=\"M200,40a8,8,0,0,0,0,16,16,16,0,0,1,16,16v58.08A44,44,0,0,0,145.68,152H110.32A44,44,0,0,0,40,130.08V72A16,16,0,0,1,56,56a8,8,0,0,0,0-16A32,32,0,0,0,24,72v92a44,44,0,0,0,87.81,4h32.38A44,44,0,0,0,232,164V72A32,32,0,0,0,200,40ZM68,192a28,28,0,1,1,28-28A28,28,0,0,1,68,192Zm120,0a28,28,0,1,1,28-28A28,28,0,0,1,188,192Z\"/><\/g>","P11.4":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M229.67,133.62l-96,96a7.94,7.94,0,0,1-11.24,0l-96-96a7.94,7.94,0,0,1,0-11.24l96.05-96a7.94,7.94,0,0,1,11.24,0l96,96.05A7.94,7.94,0,0,1,229.67,133.62Z\" opacity=\".25\"/><path d=\"M235.33,116.72,139.28,20.66a16,16,0,0,0-22.56,0l-96,96.06a16,16,0,0,0,0,22.56l96.05,96.06h0a16,16,0,0,0,22.56,0l96.05-96.06a16,16,0,0,0,0-22.56ZM128,224h0L32,128,128,32,224,128Z\"/><\/g>","P11":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M215.8,119.6l-69.26,70.06a8,8,0,0,1-5.65,2.34H64.2V115.31a8,8,0,0,1,2.34-5.65L112.2,64.52V144l24-24Z\" opacity=\".25\"/><path d=\"M221.28,34.75a64,64,0,0,0-90.49,0L60.69,104A15.9,15.9,0,0,0,56,115.31v73.38L26.34,218.34a8,8,0,0,0,11.32,11.32L67.32,200H140.7A15.92,15.92,0,0,0,152,195.32l0,0,69.23-70A64,64,0,0,0,221.28,34.75ZM142.07,46.06A48,48,0,0,1,211.79,112H155.33l34.35-34.34a8,8,0,0,0-11.32-11.32L120,124.69V67.87ZM72,115.35l32-31.67v57l-32,32ZM140.7,184H83.32l56-56h56.74Z\"/><\/g>","P12.1":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M232,116h0a60,60,0,0,1-60,60H160v40H96V136H84A60,60,0,0,1,24,76h0A20,20,0,0,1,44,56h0A20,20,0,0,1,64,76,20,20,0,0,0,84,96H96V56a32,32,0,0,1,32-32h0a32,32,0,0,1,32,32v80h12a20,20,0,0,0,20-20,20,20,0,0,1,20-20h0A20,20,0,0,1,232,116Z\" opacity=\".25\"/><path d=\"M216,208H168V184h4a68.07,68.07,0,0,0,68-68,28,28,0,0,0-56,0,12,12,0,0,1-12,12h-4V56a40,40,0,0,0-80,0V88H84A12,12,0,0,1,72,76a28,28,0,0,0-56,0,68.07,68.07,0,0,0,68,68h4v64H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM96,128H84A52.06,52.06,0,0,1,32,76a12,12,0,0,1,24,0,28,28,0,0,0,28,28H96a8,8,0,0,0,8-8V56a24,24,0,0,1,48,0v80a8,8,0,0,0,8,8h12a28,28,0,0,0,28-28,12,12,0,0,1,24,0,52.06,52.06,0,0,1-52,52H160a8,8,0,0,0-8,8v32H104V136A8,8,0,0,0,96,128Z\"/><\/g>","P12.2":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M224,127.17a96.48,96.48,0,0,1-2.39,22.18A24,24,0,0,1,198.21,168H152a24,24,0,0,0-24,24,24,24,0,0,1-32,22.61C58.73,201.44,32,169.81,32,128a96,96,0,0,1,95-96C179.84,31.47,223.55,74.35,224,127.17Z\" opacity=\".25\"/><path d=\"M200.77,53.89A103.27,103.27,0,0,0,128,24h-1.07A104,104,0,0,0,24,128c0,43,26.58,79.06,69.36,94.17A32,32,0,0,0,136,192a16,16,0,0,1,16-16h46.21a31.81,31.81,0,0,0,31.2-24.88,104.43,104.43,0,0,0,2.59-24A103.28,103.28,0,0,0,200.77,53.89Zm13,93.71A15.89,15.89,0,0,1,198.21,160H152a32,32,0,0,0-32,32,16,16,0,0,1-21.31,15.07C62.49,194.3,40,164,40,128a88,88,0,0,1,87.09-88h.9a88.35,88.35,0,0,1,88,87.25A88.86,88.86,0,0,1,213.81,147.6ZM140,76a12,12,0,1,1-12-12A12,12,0,0,1,140,76ZM96,100A12,12,0,1,1,84,88,12,12,0,0,1,96,100Zm0,56a12,12,0,1,1-12-12A12,12,0,0,1,96,156Zm88-56a12,12,0,1,1-12-12A12,12,0,0,1,184,100Z\"/><\/g>","P12.3":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M184,128a56,56,0,1,1-56-56A56,56,0,0,1,184,128Z\" opacity=\".25\"/><path d=\"M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z\"/><\/g>","P12.4":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M232,192H24L96,64h64Z\" opacity=\".25\"/><path d=\"M235.92,199A8,8,0,0,1,225,195.92L155.32,72H136v8a8,8,0,0,1-16,0V72H100.68L31,195.92A8,8,0,0,1,17,188.08L82.32,72H24a8,8,0,0,1,0-16H232a8,8,0,0,1,0,16H173.68L239,188.08A8,8,0,0,1,235.92,199ZM128,112a8,8,0,0,0-8,8v16a8,8,0,0,0,16,0V120A8,8,0,0,0,128,112Zm0,56a8,8,0,0,0-8,8v16a8,8,0,0,0,16,0V176A8,8,0,0,0,128,168Z\"/><\/g>","P12.5":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M215,168.71a96.42,96.42,0,0,1-30.54,37l-9.36-9.37a8,8,0,0,0-3.63-2.09L150,188.59a8,8,0,0,1-5.88-8.9l2.38-16.2a8,8,0,0,1,4.84-6.22l30.46-12.66a8,8,0,0,1,8.47,1.49ZM159.89,105,182.06,79.2A8,8,0,0,0,184,74V50A96,96,0,0,0,50.49,184.65l9.92-6.52A8,8,0,0,0,64,171.49l.21-36.23a8.06,8.06,0,0,1,1.35-4.41l20.94-31.3a8,8,0,0,1,11.34-2l19.81,13a8.06,8.06,0,0,0,5.77,1.45l31.46-4.26A8,8,0,0,0,159.89,105Z\" opacity=\".25\"/><path d=\"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,16a87.5,87.5,0,0,1,48,14.28V74L153.83,99.74,122.36,104l-.31-.22L102.38,90.92A16,16,0,0,0,79.87,95.1L58.93,126.4a16,16,0,0,0-2.7,8.81L56,171.44l-3.27,2.15A88,88,0,0,1,128,40ZM62.29,186.47l2.52-1.65A16,16,0,0,0,72,171.53l.21-36.23L93.17,104a3.62,3.62,0,0,0,.32.22l19.67,12.87a15.94,15.94,0,0,0,11.35,2.77L156,115.59a16,16,0,0,0,10-5.41l22.17-25.76A16,16,0,0,0,192,74V67.67A87.87,87.87,0,0,1,211.77,155l-16.14-14.76a16,16,0,0,0-16.93-3l-30.46,12.65a16.08,16.08,0,0,0-9.68,12.45l-2.39,16.19a16,16,0,0,0,11.77,17.81L169.4,202l2.36,2.37A87.88,87.88,0,0,1,62.29,186.47ZM185,195l-4.3-4.31a16,16,0,0,0-7.26-4.18L152,180.85l2.39-16.19L184.84,152,205,170.48A88.43,88.43,0,0,1,185,195Z\"/><\/g>","P12":"<g fill=\"currentColor\" transform=\"scale(0.1875)\"><path d=\"M128,48,68.32,70.38a8,8,0,0,0-5.08,6.17L40,216l139.45-23.24a8,8,0,0,0,6.17-5.08L208,128Zm-4,104a20,20,0,1,1,20-20A20,20,0,0,1,124,152Z\" opacity=\".25\"/><path d=\"M248,92.68a15.86,15.86,0,0,0-4.69-11.31L174.63,12.68a16,16,0,0,0-22.63,0L123.57,41.11l-58,21.77A16.06,16.06,0,0,0,55.35,75.23L32.11,214.68A8,8,0,0,0,40,224a8.4,8.4,0,0,0,1.32-.11l139.44-23.24a16,16,0,0,0,12.35-10.17l21.77-58L243.31,104A15.87,15.87,0,0,0,248,92.68Zm-69.87,92.19L63.32,204l47.37-47.37a28,28,0,1,0-11.32-11.32L52,192.7,71.13,77.86,126,57.29,198.7,130ZM112,132a12,12,0,1,1,12,12A12,12,0,0,1,112,132Zm96-15.32L139.31,48l24-24L232,92.68Z\"/><\/g>"};
  /* icones REALISTAS dos modulos (29/10, pedido do dono: "desenho plano de paint" saiu): design/icones_real/<id>.svg.
     Ilustracoes: Servier Medical Art, CC BY 3.0 (smart.servier.com) e desenhos 3D do projeto; creditos em icones_real/LICENCAS.md.
     Nas materias vem o SVG (so os da materia); no shell, miniatura WebP 64 px (so a busca usa). Entram como <img>:
     cada SVG tem seus proprios filtros/ids, que repetidos na mesma pagina se atrapalhariam. */
  var REAL = {"P01":"pk:","P02":"pk:","P03":"pk:","P04":"pk:","P05":"pk:","P06":"pk:","P07":"pk:","P08":"pk:","P09":"pk:","P10":"pk:","P11":"pk:","P12":"pk:","OUTRO":"pk:","P01.1":"pk:","P01.2":"pk:","P01.3":"pk:","P01.4":"pk:","P02.1":"pk:","P02.2":"pk:","P02.3":"pk:","P02.4":"pk:","P03.1":"pk:","P03.2":"pk:","P03.3":"pk:","P03.4":"pk:","P04.1":"pk:","P04.2":"pk:","P04.3":"pk:","P04.4":"pk:","P05.1":"pk:","P05.2":"pk:","P05.3":"pk:","P05.4":"pk:","P06.1":"pk:","P06.2":"pk:","P06.3":"pk:","P07.1":"pk:","P07.2":"pk:","P07.3":"pk:","P07.4":"pk:","P08.1":"pk:","P08.2":"pk:","P08.3":"pk:","P08.4":"pk:","P09.1":"pk:","P09.2":"pk:","P09.3":"pk:","P09.4":"pk:","P09.5":"pk:","P10.1":"pk:","P10.2":"pk:","P10.3":"pk:","P10.4":"pk:","P10.5":"pk:","P11.1":"pk:","P11.2":"pk:","P11.3":"pk:","P11.4":"pk:","P12.1":"pk:","P12.2":"pk:","P12.3":"pk:","P12.4":"pk:","P12.5":"pk:"}, REALU = {};
  /* auditoria 31/10: icones 'pk:' vem do pacote da materia (ic.json, guardado pelo navegador); ate ele chegar a <img> leva
     data-ic e uma imagem vazia, trocada quando o pacote chega */
  var VAZIO = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', PK = null, PACOTE = null;
  if ('ic.json?v=91349157' && Object.keys(REAL).some(function (k) { return REAL[k] === 'pk:'; }) && window.fetch) {
    PACOTE = fetch('ic.json?v=91349157').then(function (r) { if (!r.ok) throw r.status; return r.json(); }).then(function (d) {
      PK = d; REALU = {};
      document.querySelectorAll('img[data-ic]').forEach(function (im) { var u = realUrl(im.getAttribute('data-ic')); if (u) im.src = u; });
    });
    PACOTE.catch(function () { });
  }
  function realUrl(k) {
    if (!REAL[k]) return '';
    if (REAL[k] === 'pk:') { if (!PK || !PK[k]) return ''; if (!REALU[k]) REALU[k] = 'data:image/webp;base64,' + PK[k]; return REALU[k]; }
    if (!REALU[k]) REALU[k] = REAL[k].indexOf('data:') === 0 ? REAL[k] : 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(REAL[k]);   /* ic/: arquivo WebP da materia (31/10) */
    return REALU[k];
  }
  function real(k, cls) { var u = realUrl(k); return '<img class="' + (cls || 'ic-tema') + ' ic-real" src="' + (u || VAZIO) + '"' + (REAL[k] === 'pk:' ? ' data-ic="' + k + '"' : '') + ' alt="" aria-hidden="true" draggable="false" decoding="async">'; }
  /* modulo (B01) e conteudo (B01.5, 30/10): ilustracao realista, objeto solto (sem ladrilho).
     Conteudo realista leva tambem .ic-sub (as regras de tamanho por lugar continuam valendo); o ladrilho do CSS so pega svg.ic-sub,
     o desenho de traco que sobra como reserva se faltar o realista. */
  function tema(id, cls) {
    id = String(id); var mod = id.split('.')[0], ehSub = id.indexOf('.') > 0;
    if (REAL[id]) return real(id, (cls || 'ic-tema') + (ehSub || id === 'OUTRO' ? ' ic-sub' : ''));
    if (!ehSub && REAL[mod]) return real(mod, cls);
    if (ehSub && PRO[id]) return '<svg class="' + (cls || 'ic-tema') + ' ic-pro ic-sub" viewBox="-7.5 -7.5 63 63" fill="none" aria-hidden="true">' + PRO[id] + '</svg>';
    if (REAL[mod]) return real(mod, cls);
    if (PRO[mod]) return '<svg class="' + (cls || 'ic-tema') + ' ic-pro ic-sub" viewBox="-7.5 -7.5 63 63" fill="none" aria-hidden="true">' + PRO[mod] + '</svg>';
    return temaVelho(mod, cls);
  }
  function temaVelho(id, cls) { return M[id] ? sv('0 0 48 48', M[id], cls || 'ic-tema') : sv('0 0 48 48', '<circle cx="24" cy="24" r="14"' + F + '/>', cls || 'ic-tema'); }

  /* ---------- interface, 24x24 (traco 1,8) ---------- */
  function ui(c) { return '<svg class="ic-ui" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + c + '</svg>'; }
  var U = {
    inicio: ui('<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/>'),
    inicioCheio: '<svg class="ic-ui" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" fill="currentColor"/></svg>',
    questoes: ui('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="m8 12 3 3 5-6"/>'),
    treino: ui('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
    simulados: ui('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><circle cx="12" cy="14.5" r="3.2"/><path d="M12 13v1.5l1 1"/>'),
    plano: ui('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14h2M14 14h2M8 17.5h2"/>'),
    desempenho: ui('<path d="M5 20v-7M10 20V5M15 20v-9M20 20V9"/>'),
    revisao: ui('<path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.5L5 21V4.5a1 1 0 0 1 1-1z"/>'),
    revisaoCheia: '<svg class="ic-ui" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.5L5 21V4.5a1 1 0 0 1 1-1z" fill="currentColor"/></svg>',
    config: ui('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
    busca: ui('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
    seta: ui('<path d="m9 6 6 6-6 6"/>'),
    voltar: ui('<path d="m15 6-6 6 6 6"/>'),
    relogio: ui('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    cronometro: ui('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 1.5M10 2.5h4M18.5 6.5l1.5-1.5M5.5 6.5 4 5"/>'),
    alvo: ui('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
    lampada: ui('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.8.6 1.1 1.4 1.1 2.2h5c0-.8.3-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>'),
    camadas: ui('<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>'),
    /* Lucide image (ISC): cartoes com imagem */
    imagem: ui('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>'),
    doc: ui('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
    check: ui('<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/>'),
    xis: ui('<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>'),
    tema: ui('<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/>'),
    tela: ui('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    nuvem: ui('<path d="M7 18a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.4 1.5A3.8 3.8 0 0 1 17.5 18z"/>'),
    livro: ui('<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5v13"/>'),
    escada: ui('<path d="M4 20h4v-4h4v-4h4V8h4V4"/>'),
    /* flashcards (30/10): dois cartoes empilhados; lapis = escrever a resposta */
    cartoes: ui('<rect x="3" y="7.5" width="14" height="13" rx="2"/><path d="M7 4.5h11a2 2 0 0 1 2 2V17"/><path d="M6.5 12.5h7M6.5 16h4.5"/>'),
    lapis: ui('<path d="M15.5 4.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/><path d="m13.5 6.5 3 3"/>'),
    teclado: ui('<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>')
  };

  /* ---------- glifos das materias (menu lateral), 24x24 cheios ---------- */
  var G = {
    /* pi desenhado (o mesmo traco do menu da pagina principal), nao letra de fonte */
    mat: '<svg class="ic-mat" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 8.5c.6-2 1.9-3 3.6-3h11.4"/><path d="M9.5 5.5v13"/><path d="M15.5 5.5v10.4c0 1.7.9 2.6 2.5 2.6"/></g></svg>',
    qui: '<svg class="ic-mat" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 2.5h6M10 2.5v6.2L4.2 18.6A2 2 0 0 0 6 21.5h12a2 2 0 0 0 1.8-2.9L14 8.7V2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.3 14h9.4l3 4.9a1.7 1.7 0 0 1-1.5 2.6H5.8a1.7 1.7 0 0 1-1.5-2.6z" fill="currentColor"/></svg>',
    bio: '<svg class="ic-mat" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20.5C4 10 10 3.5 21 3.5c0 10.5-6.5 17-17 17z" fill="currentColor"/><path d="M4 20.5 15.5 9" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1.6" stroke-linecap="round"/></svg>',
    /* Phosphor book-open (duotone), MIT: livro aberto simetrico, paginas em tom forte e contorno cheio */
    por: '<svg class="ic-mat" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" fill-opacity=".5" d="M232,56V200H160a32,32,0,0,0-32,32,32,32,0,0,0-32-32H24V56H96a32,32,0,0,1,32,32,32,32,0,0,1,32-32Z"/><path fill="currentColor" d="M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z"/></svg>'
  };

  /* ---------- ilustracoes das materias: desenhadas em design/gera_ilu.py (luz e sombra, sem brilho) ---------- */
  var ILU_SVG = {"bio": "<svg class=\"ilu\" viewBox=\"0 0 180 140\" aria-hidden=\"true\"><image x=\"19.8\" y=\"0.0\" width=\"140.3\" height=\"140.0\" href=\"data:image/webp;base64,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\"/></svg>", "qui": "<svg class=\"ilu\" viewBox=\"0 0 180 140\" aria-hidden=\"true\"><image x=\"17.5\" y=\"0.0\" width=\"145.0\" height=\"140.0\" href=\"data:image/webp;base64,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\"/></svg>", "mat": "<svg class=\"ilu\" viewBox=\"0 0 180 140\" aria-hidden=\"true\"><image x=\"13.5\" y=\"0.0\" width=\"153.0\" height=\"140.0\" href=\"data:image/webp;base64,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\"/></svg>", "por": "<svg class=\"ilu\" viewBox=\"0 0 180 140\" aria-hidden=\"true\"><image x=\"24.3\" y=\"0.0\" width=\"131.3\" height=\"140.0\" href=\"data:image/webp;base64,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\"/></svg>"}, ILU = {};
  ['bio', 'qui', 'mat', 'por'].forEach(function (m) { ILU[m] = function (k) { return ILU_SVG[m].split('@K@').join(String(k || m)); }; });
  /* desenho de traco (o antigo), para quem precisa do miolo do SVG: o motivo apagado do fundo da materia */
  function traco(id, cls) { id = String(id); var k = PRO[id] ? id : (PRO[id.split('.')[0]] ? id.split('.')[0] : null); return k ? '<svg class="' + (cls || 'ic-tema') + ' ic-pro" viewBox="0 0 48 48" fill="none" aria-hidden="true">' + PRO[k] + '</svg>' : temaVelho(id.split('.')[0], cls); }
  /* simulados (30/10): selo da banca com o nome escrito (desenho proprio, nao e logo) e um objeto por objetivo; so nas materias */
  var SIM = {"uni_São Camilo":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><defs><radialGradient id=\"sh\"><stop offset=\"0\" stop-color=\"#1b1f2a\" stop-opacity=\"0.26\"/><stop offset=\".6\" stop-color=\"#1b1f2a\" stop-opacity=\"0.117\"/><stop offset=\"1\" stop-color=\"#1b1f2a\" stop-opacity=\"0\"/><\/radialGradient><linearGradient id=\"ou\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#fbe7a1\"/><stop offset=\".35\" stop-color=\"#e2b64a\"/><stop offset=\".7\" stop-color=\"#b8861f\"/><stop offset=\"1\" stop-color=\"#7c5810\"/><\/linearGradient><radialGradient id=\"oi\" cx=\".38\" cy=\".3\" r=\".8\"><stop offset=\"0\" stop-color=\"#fff2c4\"/><stop offset=\".45\" stop-color=\"#ebc560\"/><stop offset=\"1\" stop-color=\"#a87a1a\"/><\/radialGradient><linearGradient id=\"fi\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#c4475a\"/><stop offset=\".55\" stop-color=\"#9c2433\"/><stop offset=\"1\" stop-color=\"#64121e\"/><\/linearGradient><linearGradient id=\"ca\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#9c2433\"/><stop offset=\"1\" stop-color=\"#64121e\"/><\/linearGradient><\/defs><ellipse cx=\"32\" cy=\"58.5\" rx=\"20\" ry=\"3.6\" fill=\"url(#sh)\"/><path d=\"M23.5 38 17.2 58.2l4.9-2.6 3.4 4.3 5.4-19.6z\" fill=\"url(#ca)\"/><path d=\"M40.5 38l6.3 20.2-4.9-2.6-3.4 4.3-5.4-19.6z\" fill=\"url(#ca)\"/><path d=\"M23.5 38 17.2 58.2l4.9-2.6z\" fill=\"#000\" opacity=\".18\"/><path d=\"M32.00 3.50 L34.15 5.51 L36.68 3.99 L38.37 6.41 L41.15 5.45 L42.30 8.16 L45.23 7.80 L45.78 10.69 L48.72 10.94 L48.67 13.89 L51.49 14.75 L50.82 17.62 L53.40 19.05 L52.15 21.72 L54.38 23.65 L52.60 26.00 L54.38 28.35 L52.15 30.28 L53.40 32.95 L50.82 34.38 L51.49 37.25 L48.67 38.11 L48.72 41.06 L45.78 41.31 L45.23 44.20 L42.30 43.84 L41.15 46.55 L38.37 45.59 L36.68 48.01 L34.15 46.49 L32.00 48.50 L29.85 46.49 L27.32 48.01 L25.63 45.59 L22.85 46.55 L21.70 43.84 L18.77 44.20 L18.22 41.31 L15.28 41.06 L15.33 38.11 L12.51 37.25 L13.18 34.38 L10.60 32.95 L11.85 30.28 L9.62 28.35 L11.40 26.00 L9.62 23.65 L11.85 21.72 L10.60 19.05 L13.18 17.62 L12.51 14.75 L15.33 13.89 L15.28 10.94 L18.22 10.69 L18.77 7.80 L21.70 8.16 L22.85 5.45 L25.63 6.41 L27.32 3.99 L29.85 5.51Z\" fill=\"url(#ou)\" stroke=\"#6e4e0c\" stroke-width=\".6\" stroke-linejoin=\"round\"/><circle cx=\"32\" cy=\"26\" r=\"17.4\" fill=\"url(#oi)\" stroke=\"#8a6414\" stroke-width=\".7\"/><circle cx=\"32\" cy=\"26\" r=\"15.2\" fill=\"none\" stroke=\"#fff6d6\" stroke-width=\".8\" opacity=\".75\"/><circle cx=\"32\" cy=\"26.5\" r=\"15.2\" fill=\"none\" stroke=\"#7c5810\" stroke-width=\".5\" opacity=\".45\"/><path transform=\"translate(32 14.2) scale(0.95)\" d=\"M0-3 .9-.9 3-.9 1.3.4 1.9 2.6 0 1.3-1.9 2.6-1.3.4-3-.9-.9-.9z\" fill=\"#fff3c8\" stroke=\"#8a6414\" stroke-width=\".35\"/><path transform=\"translate(25.5 16) scale(0.62)\" d=\"M0-3 .9-.9 3-.9 1.3.4 1.9 2.6 0 1.3-1.9 2.6-1.3.4-3-.9-.9-.9z\" fill=\"#fff3c8\" stroke=\"#8a6414\" stroke-width=\".35\"/><path transform=\"translate(38.5 16) scale(0.62)\" d=\"M0-3 .9-.9 3-.9 1.3.4 1.9 2.6 0 1.3-1.9 2.6-1.3.4-3-.9-.9-.9z\" fill=\"#fff3c8\" stroke=\"#8a6414\" stroke-width=\".35\"/><path d=\"M24 37.6q8 3.4 16 0\" fill=\"none\" stroke=\"#8a6414\" stroke-width=\".7\" stroke-linecap=\"round\" opacity=\".7\"/><path d=\"M3.6 23.4h5v11.6h-5l2.6-5.8z\" fill=\"#64121e\"/><path d=\"M60.4 23.4h-5v11.6h5l-2.6-5.8z\" fill=\"#64121e\"/><path d=\"M8.6 35l-2.4 2.2V35zM55.4 35l2.4 2.2V35z\" fill=\"#000\" opacity=\".35\"/><rect x=\"6.2\" y=\"20.6\" width=\"51.6\" height=\"14.4\" rx=\"1\" fill=\"url(#fi)\"/><rect x=\"6.2\" y=\"20.6\" width=\"51.6\" height=\"1.3\" fill=\"#fff\" opacity=\".28\"/><rect x=\"6.2\" y=\"33.6\" width=\"51.6\" height=\"1.4\" fill=\"#000\" opacity=\".2\"/><path d=\"M9.6 23.5H11.4L13.2 29.1L15.0 23.5H16.8L14.3 31.1H12.2Z M18.1 23.5H19.9V28.0Q19.9 29.0 20.1 29.4Q20.4 29.8 21.0 29.8Q21.7 29.8 21.9 29.4Q22.2 29.0 22.2 28.0V23.5H24.0V28.0Q24.0 29.6 23.3 30.4Q22.5 31.2 21.0 31.2Q19.5 31.2 18.8 30.4Q18.1 29.6 18.1 28.0Z M26.1 23.5H28.1L30.6 28.7V23.5H32.2V31.1H30.3L27.8 25.9V31.1H26.1Z M34.4 23.5H39.1V24.9H36.1V26.4H38.9V27.8H36.1V29.6H39.2V31.1H34.4Z M45.9 23.7V25.3Q45.4 25.0 44.8 24.9Q44.3 24.7 43.8 24.7Q43.2 24.7 42.9 24.9Q42.6 25.1 42.6 25.5Q42.6 25.8 42.8 26.0Q43.0 26.2 43.5 26.3L44.3 26.5Q45.4 26.7 45.9 27.2Q46.4 27.8 46.4 28.7Q46.4 30.0 45.7 30.6Q45.0 31.2 43.6 31.2Q43.0 31.2 42.3 31.1Q41.7 30.9 41.0 30.7V29.0Q41.7 29.4 42.3 29.6Q42.9 29.8 43.5 29.8Q44.1 29.8 44.4 29.6Q44.7 29.4 44.7 29.0Q44.7 28.6 44.5 28.4Q44.3 28.2 43.6 28.1L42.9 27.9Q41.9 27.7 41.5 27.1Q41.0 26.6 41.0 25.7Q41.0 24.6 41.6 23.9Q42.3 23.3 43.5 23.3Q44.1 23.3 44.7 23.4Q45.3 23.5 45.9 23.7Z M48.3 23.5H51.2Q52.5 23.5 53.2 24.1Q53.9 24.8 53.9 25.9Q53.9 27.1 53.2 27.8Q52.5 28.4 51.2 28.4H50.1V31.1H48.3ZM50.1 24.9V27.0H51.1Q51.6 27.0 51.8 26.7Q52.1 26.4 52.1 25.9Q52.1 25.4 51.8 25.2Q51.6 24.9 51.1 24.9Z\" fill=\"#000\" opacity=\".35\" transform=\"translate(0 .7)\"/><path d=\"M9.6 23.5H11.4L13.2 29.1L15.0 23.5H16.8L14.3 31.1H12.2Z M18.1 23.5H19.9V28.0Q19.9 29.0 20.1 29.4Q20.4 29.8 21.0 29.8Q21.7 29.8 21.9 29.4Q22.2 29.0 22.2 28.0V23.5H24.0V28.0Q24.0 29.6 23.3 30.4Q22.5 31.2 21.0 31.2Q19.5 31.2 18.8 30.4Q18.1 29.6 18.1 28.0Z M26.1 23.5H28.1L30.6 28.7V23.5H32.2V31.1H30.3L27.8 25.9V31.1H26.1Z M34.4 23.5H39.1V24.9H36.1V26.4H38.9V27.8H36.1V29.6H39.2V31.1H34.4Z M45.9 23.7V25.3Q45.4 25.0 44.8 24.9Q44.3 24.7 43.8 24.7Q43.2 24.7 42.9 24.9Q42.6 25.1 42.6 25.5Q42.6 25.8 42.8 26.0Q43.0 26.2 43.5 26.3L44.3 26.5Q45.4 26.7 45.9 27.2Q46.4 27.8 46.4 28.7Q46.4 30.0 45.7 30.6Q45.0 31.2 43.6 31.2Q43.0 31.2 42.3 31.1Q41.7 30.9 41.0 30.7V29.0Q41.7 29.4 42.3 29.6Q42.9 29.8 43.5 29.8Q44.1 29.8 44.4 29.6Q44.7 29.4 44.7 29.0Q44.7 28.6 44.5 28.4Q44.3 28.2 43.6 28.1L42.9 27.9Q41.9 27.7 41.5 27.1Q41.0 26.6 41.0 25.7Q41.0 24.6 41.6 23.9Q42.3 23.3 43.5 23.3Q44.1 23.3 44.7 23.4Q45.3 23.5 45.9 23.7Z M48.3 23.5H51.2Q52.5 23.5 53.2 24.1Q53.9 24.8 53.9 25.9Q53.9 27.1 53.2 27.8Q52.5 28.4 51.2 28.4H50.1V31.1H48.3ZM50.1 24.9V27.0H51.1Q51.6 27.0 51.8 26.7Q52.1 26.4 52.1 25.9Q52.1 25.4 51.8 25.2Q51.6 24.9 51.1 24.9Z\" fill=\"#fff\"/><\/svg>","uni_Unesp":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><defs><radialGradient id=\"sh\"><stop offset=\"0\" stop-color=\"#1b1f2a\" stop-opacity=\"0.26\"/><stop offset=\".6\" stop-color=\"#1b1f2a\" stop-opacity=\"0.117\"/><stop offset=\"1\" stop-color=\"#1b1f2a\" stop-opacity=\"0\"/><\/radialGradient><linearGradient id=\"ou\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#fbe7a1\"/><stop offset=\".35\" stop-color=\"#e2b64a\"/><stop offset=\".7\" stop-color=\"#b8861f\"/><stop offset=\"1\" stop-color=\"#7c5810\"/><\/linearGradient><radialGradient id=\"oi\" cx=\".38\" cy=\".3\" r=\".8\"><stop offset=\"0\" stop-color=\"#fff2c4\"/><stop offset=\".45\" stop-color=\"#ebc560\"/><stop offset=\"1\" stop-color=\"#a87a1a\"/><\/radialGradient><linearGradient id=\"fi\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#3f74c4\"/><stop offset=\".55\" stop-color=\"#1f4f96\"/><stop offset=\"1\" stop-color=\"#122f5e\"/><\/linearGradient><linearGradient id=\"ca\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#1f4f96\"/><stop offset=\"1\" stop-color=\"#122f5e\"/><\/linearGradient><\/defs><ellipse cx=\"32\" cy=\"58.5\" rx=\"20\" ry=\"3.6\" fill=\"url(#sh)\"/><path d=\"M23.5 38 17.2 58.2l4.9-2.6 3.4 4.3 5.4-19.6z\" fill=\"url(#ca)\"/><path d=\"M40.5 38l6.3 20.2-4.9-2.6-3.4 4.3-5.4-19.6z\" fill=\"url(#ca)\"/><path d=\"M23.5 38 17.2 58.2l4.9-2.6z\" fill=\"#000\" opacity=\".18\"/><path d=\"M32.00 3.50 L34.15 5.51 L36.68 3.99 L38.37 6.41 L41.15 5.45 L42.30 8.16 L45.23 7.80 L45.78 10.69 L48.72 10.94 L48.67 13.89 L51.49 14.75 L50.82 17.62 L53.40 19.05 L52.15 21.72 L54.38 23.65 L52.60 26.00 L54.38 28.35 L52.15 30.28 L53.40 32.95 L50.82 34.38 L51.49 37.25 L48.67 38.11 L48.72 41.06 L45.78 41.31 L45.23 44.20 L42.30 43.84 L41.15 46.55 L38.37 45.59 L36.68 48.01 L34.15 46.49 L32.00 48.50 L29.85 46.49 L27.32 48.01 L25.63 45.59 L22.85 46.55 L21.70 43.84 L18.77 44.20 L18.22 41.31 L15.28 41.06 L15.33 38.11 L12.51 37.25 L13.18 34.38 L10.60 32.95 L11.85 30.28 L9.62 28.35 L11.40 26.00 L9.62 23.65 L11.85 21.72 L10.60 19.05 L13.18 17.62 L12.51 14.75 L15.33 13.89 L15.28 10.94 L18.22 10.69 L18.77 7.80 L21.70 8.16 L22.85 5.45 L25.63 6.41 L27.32 3.99 L29.85 5.51Z\" fill=\"url(#ou)\" stroke=\"#6e4e0c\" stroke-width=\".6\" stroke-linejoin=\"round\"/><circle cx=\"32\" cy=\"26\" r=\"17.4\" fill=\"url(#oi)\" stroke=\"#8a6414\" stroke-width=\".7\"/><circle cx=\"32\" cy=\"26\" r=\"15.2\" fill=\"none\" stroke=\"#fff6d6\" stroke-width=\".8\" opacity=\".75\"/><circle cx=\"32\" cy=\"26.5\" r=\"15.2\" fill=\"none\" stroke=\"#7c5810\" stroke-width=\".5\" opacity=\".45\"/><path transform=\"translate(32 14.2) scale(0.95)\" d=\"M0-3 .9-.9 3-.9 1.3.4 1.9 2.6 0 1.3-1.9 2.6-1.3.4-3-.9-.9-.9z\" fill=\"#fff3c8\" stroke=\"#8a6414\" stroke-width=\".35\"/><path transform=\"translate(25.5 16) scale(0.62)\" d=\"M0-3 .9-.9 3-.9 1.3.4 1.9 2.6 0 1.3-1.9 2.6-1.3.4-3-.9-.9-.9z\" fill=\"#fff3c8\" stroke=\"#8a6414\" stroke-width=\".35\"/><path transform=\"translate(38.5 16) scale(0.62)\" d=\"M0-3 .9-.9 3-.9 1.3.4 1.9 2.6 0 1.3-1.9 2.6-1.3.4-3-.9-.9-.9z\" fill=\"#fff3c8\" stroke=\"#8a6414\" stroke-width=\".35\"/><path d=\"M24 37.6q8 3.4 16 0\" fill=\"none\" stroke=\"#8a6414\" stroke-width=\".7\" stroke-linecap=\"round\" opacity=\".7\"/><path d=\"M3.6 23.4h5v11.6h-5l2.6-5.8z\" fill=\"#122f5e\"/><path d=\"M60.4 23.4h-5v11.6h5l-2.6-5.8z\" fill=\"#122f5e\"/><path d=\"M8.6 35l-2.4 2.2V35zM55.4 35l2.4 2.2V35z\" fill=\"#000\" opacity=\".35\"/><rect x=\"6.2\" y=\"20.6\" width=\"51.6\" height=\"14.4\" rx=\"1\" fill=\"url(#fi)\"/><rect x=\"6.2\" y=\"20.6\" width=\"51.6\" height=\"1.3\" fill=\"#fff\" opacity=\".28\"/><rect x=\"6.2\" y=\"33.6\" width=\"51.6\" height=\"1.4\" fill=\"#000\" opacity=\".2\"/><path d=\"M9.6 23.5H11.4L13.2 29.1L15.0 23.5H16.8L14.3 31.1H12.2Z M18.1 23.5H19.9V28.0Q19.9 29.0 20.1 29.4Q20.4 29.8 21.0 29.8Q21.7 29.8 21.9 29.4Q22.2 29.0 22.2 28.0V23.5H24.0V28.0Q24.0 29.6 23.3 30.4Q22.5 31.2 21.0 31.2Q19.5 31.2 18.8 30.4Q18.1 29.6 18.1 28.0Z M26.1 23.5H28.1L30.6 28.7V23.5H32.2V31.1H30.3L27.8 25.9V31.1H26.1Z M34.4 23.5H39.1V24.9H36.1V26.4H38.9V27.8H36.1V29.6H39.2V31.1H34.4Z M45.9 23.7V25.3Q45.4 25.0 44.8 24.9Q44.3 24.7 43.8 24.7Q43.2 24.7 42.9 24.9Q42.6 25.1 42.6 25.5Q42.6 25.8 42.8 26.0Q43.0 26.2 43.5 26.3L44.3 26.5Q45.4 26.7 45.9 27.2Q46.4 27.8 46.4 28.7Q46.4 30.0 45.7 30.6Q45.0 31.2 43.6 31.2Q43.0 31.2 42.3 31.1Q41.7 30.9 41.0 30.7V29.0Q41.7 29.4 42.3 29.6Q42.9 29.8 43.5 29.8Q44.1 29.8 44.4 29.6Q44.7 29.4 44.7 29.0Q44.7 28.6 44.5 28.4Q44.3 28.2 43.6 28.1L42.9 27.9Q41.9 27.7 41.5 27.1Q41.0 26.6 41.0 25.7Q41.0 24.6 41.6 23.9Q42.3 23.3 43.5 23.3Q44.1 23.3 44.7 23.4Q45.3 23.5 45.9 23.7Z M48.3 23.5H51.2Q52.5 23.5 53.2 24.1Q53.9 24.8 53.9 25.9Q53.9 27.1 53.2 27.8Q52.5 28.4 51.2 28.4H50.1V31.1H48.3ZM50.1 24.9V27.0H51.1Q51.6 27.0 51.8 26.7Q52.1 26.4 52.1 25.9Q52.1 25.4 51.8 25.2Q51.6 24.9 51.1 24.9Z\" fill=\"#000\" opacity=\".35\" transform=\"translate(0 .7)\"/><path d=\"M9.6 23.5H11.4L13.2 29.1L15.0 23.5H16.8L14.3 31.1H12.2Z M18.1 23.5H19.9V28.0Q19.9 29.0 20.1 29.4Q20.4 29.8 21.0 29.8Q21.7 29.8 21.9 29.4Q22.2 29.0 22.2 28.0V23.5H24.0V28.0Q24.0 29.6 23.3 30.4Q22.5 31.2 21.0 31.2Q19.5 31.2 18.8 30.4Q18.1 29.6 18.1 28.0Z M26.1 23.5H28.1L30.6 28.7V23.5H32.2V31.1H30.3L27.8 25.9V31.1H26.1Z M34.4 23.5H39.1V24.9H36.1V26.4H38.9V27.8H36.1V29.6H39.2V31.1H34.4Z M45.9 23.7V25.3Q45.4 25.0 44.8 24.9Q44.3 24.7 43.8 24.7Q43.2 24.7 42.9 24.9Q42.6 25.1 42.6 25.5Q42.6 25.8 42.8 26.0Q43.0 26.2 43.5 26.3L44.3 26.5Q45.4 26.7 45.9 27.2Q46.4 27.8 46.4 28.7Q46.4 30.0 45.7 30.6Q45.0 31.2 43.6 31.2Q43.0 31.2 42.3 31.1Q41.7 30.9 41.0 30.7V29.0Q41.7 29.4 42.3 29.6Q42.9 29.8 43.5 29.8Q44.1 29.8 44.4 29.6Q44.7 29.4 44.7 29.0Q44.7 28.6 44.5 28.4Q44.3 28.2 43.6 28.1L42.9 27.9Q41.9 27.7 41.5 27.1Q41.0 26.6 41.0 25.7Q41.0 24.6 41.6 23.9Q42.3 23.3 43.5 23.3Q44.1 23.3 44.7 23.4Q45.3 23.5 45.9 23.7Z M48.3 23.5H51.2Q52.5 23.5 53.2 24.1Q53.9 24.8 53.9 25.9Q53.9 27.1 53.2 27.8Q52.5 28.4 51.2 28.4H50.1V31.1H48.3ZM50.1 24.9V27.0H51.1Q51.6 27.0 51.8 26.7Q52.1 26.4 52.1 25.9Q52.1 25.4 51.8 25.2Q51.6 24.9 51.1 24.9Z\" fill=\"#fff\"/><\/svg>","uni_Fuvest":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><defs><radialGradient id=\"sh\"><stop offset=\"0\" stop-color=\"#1b1f2a\" stop-opacity=\"0.26\"/><stop offset=\".6\" stop-color=\"#1b1f2a\" stop-opacity=\"0.117\"/><stop offset=\"1\" stop-color=\"#1b1f2a\" stop-opacity=\"0\"/><\/radialGradient><linearGradient id=\"ou\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#fbe7a1\"/><stop offset=\".35\" stop-color=\"#e2b64a\"/><stop offset=\".7\" stop-color=\"#b8861f\"/><stop offset=\"1\" stop-color=\"#7c5810\"/><\/linearGradient><radialGradient id=\"oi\" cx=\".38\" cy=\".3\" r=\".8\"><stop offset=\"0\" stop-color=\"#fff2c4\"/><stop offset=\".45\" stop-color=\"#ebc560\"/><stop offset=\"1\" stop-color=\"#a87a1a\"/><\/radialGradient><linearGradient id=\"fi\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#3a9470\"/><stop offset=\".55\" stop-color=\"#1d6a4b\"/><stop offset=\"1\" stop-color=\"#0f4230\"/><\/linearGradient><linearGradient id=\"ca\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#1d6a4b\"/><stop offset=\"1\" stop-color=\"#0f4230\"/><\/linearGradient><\/defs><ellipse cx=\"32\" cy=\"58.5\" rx=\"20\" ry=\"3.6\" fill=\"url(#sh)\"/><path d=\"M23.5 38 17.2 58.2l4.9-2.6 3.4 4.3 5.4-19.6z\" fill=\"url(#ca)\"/><path d=\"M40.5 38l6.3 20.2-4.9-2.6-3.4 4.3-5.4-19.6z\" fill=\"url(#ca)\"/><path d=\"M23.5 38 17.2 58.2l4.9-2.6z\" fill=\"#000\" opacity=\".18\"/><path d=\"M32.00 3.50 L34.15 5.51 L36.68 3.99 L38.37 6.41 L41.15 5.45 L42.30 8.16 L45.23 7.80 L45.78 10.69 L48.72 10.94 L48.67 13.89 L51.49 14.75 L50.82 17.62 L53.40 19.05 L52.15 21.72 L54.38 23.65 L52.60 26.00 L54.38 28.35 L52.15 30.28 L53.40 32.95 L50.82 34.38 L51.49 37.25 L48.67 38.11 L48.72 41.06 L45.78 41.31 L45.23 44.20 L42.30 43.84 L41.15 46.55 L38.37 45.59 L36.68 48.01 L34.15 46.49 L32.00 48.50 L29.85 46.49 L27.32 48.01 L25.63 45.59 L22.85 46.55 L21.70 43.84 L18.77 44.20 L18.22 41.31 L15.28 41.06 L15.33 38.11 L12.51 37.25 L13.18 34.38 L10.60 32.95 L11.85 30.28 L9.62 28.35 L11.40 26.00 L9.62 23.65 L11.85 21.72 L10.60 19.05 L13.18 17.62 L12.51 14.75 L15.33 13.89 L15.28 10.94 L18.22 10.69 L18.77 7.80 L21.70 8.16 L22.85 5.45 L25.63 6.41 L27.32 3.99 L29.85 5.51Z\" fill=\"url(#ou)\" stroke=\"#6e4e0c\" stroke-width=\".6\" stroke-linejoin=\"round\"/><circle cx=\"32\" cy=\"26\" r=\"17.4\" fill=\"url(#oi)\" stroke=\"#8a6414\" stroke-width=\".7\"/><circle cx=\"32\" cy=\"26\" r=\"15.2\" fill=\"none\" stroke=\"#fff6d6\" stroke-width=\".8\" opacity=\".75\"/><circle cx=\"32\" cy=\"26.5\" r=\"15.2\" fill=\"none\" stroke=\"#7c5810\" stroke-width=\".5\" opacity=\".45\"/><path transform=\"translate(32 14.2) scale(0.95)\" d=\"M0-3 .9-.9 3-.9 1.3.4 1.9 2.6 0 1.3-1.9 2.6-1.3.4-3-.9-.9-.9z\" fill=\"#fff3c8\" stroke=\"#8a6414\" stroke-width=\".35\"/><path transform=\"translate(25.5 16) scale(0.62)\" d=\"M0-3 .9-.9 3-.9 1.3.4 1.9 2.6 0 1.3-1.9 2.6-1.3.4-3-.9-.9-.9z\" fill=\"#fff3c8\" stroke=\"#8a6414\" stroke-width=\".35\"/><path transform=\"translate(38.5 16) scale(0.62)\" d=\"M0-3 .9-.9 3-.9 1.3.4 1.9 2.6 0 1.3-1.9 2.6-1.3.4-3-.9-.9-.9z\" fill=\"#fff3c8\" stroke=\"#8a6414\" stroke-width=\".35\"/><path d=\"M24 37.6q8 3.4 16 0\" fill=\"none\" stroke=\"#8a6414\" stroke-width=\".7\" stroke-linecap=\"round\" opacity=\".7\"/><path d=\"M3.6 23.4h5v11.6h-5l2.6-5.8z\" fill=\"#0f4230\"/><path d=\"M60.4 23.4h-5v11.6h5l-2.6-5.8z\" fill=\"#0f4230\"/><path d=\"M8.6 35l-2.4 2.2V35zM55.4 35l2.4 2.2V35z\" fill=\"#000\" opacity=\".35\"/><rect x=\"6.2\" y=\"20.6\" width=\"51.6\" height=\"14.4\" rx=\"1\" fill=\"url(#fi)\"/><rect x=\"6.2\" y=\"20.6\" width=\"51.6\" height=\"1.3\" fill=\"#fff\" opacity=\".28\"/><rect x=\"6.2\" y=\"33.6\" width=\"51.6\" height=\"1.4\" fill=\"#000\" opacity=\".2\"/><path d=\"M11.4 23.5H16.1V24.9H13.2V26.4H16.0V27.8H13.2V31.1H11.4Z M18.2 23.5H20.0V28.0Q20.0 29.0 20.2 29.4Q20.5 29.8 21.1 29.8Q21.8 29.8 22.1 29.4Q22.3 29.0 22.3 28.0V23.5H24.1V28.0Q24.1 29.6 23.4 30.4Q22.6 31.2 21.1 31.2Q19.7 31.2 18.9 30.4Q18.2 29.6 18.2 28.0Z M25.4 23.5H27.2L29.0 29.1L30.8 23.5H32.6L30.0 31.1H27.9Z M33.9 23.5H38.6V24.9H35.6V26.4H38.4V27.8H35.6V29.6H38.7V31.1H33.9Z M45.4 23.7V25.3Q44.9 25.0 44.3 24.9Q43.8 24.7 43.3 24.7Q42.7 24.7 42.4 24.9Q42.1 25.1 42.1 25.5Q42.1 25.8 42.3 26.0Q42.5 26.2 43.0 26.3L43.8 26.5Q44.9 26.7 45.4 27.2Q45.9 27.8 45.9 28.7Q45.9 30.0 45.2 30.6Q44.5 31.2 43.2 31.2Q42.5 31.2 41.9 31.1Q41.2 30.9 40.6 30.7V29.0Q41.2 29.4 41.8 29.6Q42.4 29.8 43.0 29.8Q43.6 29.8 43.9 29.6Q44.2 29.4 44.2 29.0Q44.2 28.6 44.0 28.4Q43.8 28.2 43.1 28.1L42.5 27.9Q41.4 27.7 41.0 27.1Q40.5 26.6 40.5 25.7Q40.5 24.6 41.2 23.9Q41.8 23.3 43.0 23.3Q43.6 23.3 44.2 23.4Q44.8 23.5 45.4 23.7Z M47.0 23.5H53.3V24.9H51.1V31.1H49.3V24.9H47.0Z\" fill=\"#000\" opacity=\".35\" transform=\"translate(0 .7)\"/><path d=\"M11.4 23.5H16.1V24.9H13.2V26.4H16.0V27.8H13.2V31.1H11.4Z M18.2 23.5H20.0V28.0Q20.0 29.0 20.2 29.4Q20.5 29.8 21.1 29.8Q21.8 29.8 22.1 29.4Q22.3 29.0 22.3 28.0V23.5H24.1V28.0Q24.1 29.6 23.4 30.4Q22.6 31.2 21.1 31.2Q19.7 31.2 18.9 30.4Q18.2 29.6 18.2 28.0Z M25.4 23.5H27.2L29.0 29.1L30.8 23.5H32.6L30.0 31.1H27.9Z M33.9 23.5H38.6V24.9H35.6V26.4H38.4V27.8H35.6V29.6H38.7V31.1H33.9Z M45.4 23.7V25.3Q44.9 25.0 44.3 24.9Q43.8 24.7 43.3 24.7Q42.7 24.7 42.4 24.9Q42.1 25.1 42.1 25.5Q42.1 25.8 42.3 26.0Q42.5 26.2 43.0 26.3L43.8 26.5Q44.9 26.7 45.4 27.2Q45.9 27.8 45.9 28.7Q45.9 30.0 45.2 30.6Q44.5 31.2 43.2 31.2Q42.5 31.2 41.9 31.1Q41.2 30.9 40.6 30.7V29.0Q41.2 29.4 41.8 29.6Q42.4 29.8 43.0 29.8Q43.6 29.8 43.9 29.6Q44.2 29.4 44.2 29.0Q44.2 28.6 44.0 28.4Q43.8 28.2 43.1 28.1L42.5 27.9Q41.4 27.7 41.0 27.1Q40.5 26.6 40.5 25.7Q40.5 24.6 41.2 23.9Q41.8 23.3 43.0 23.3Q43.6 23.3 44.2 23.4Q44.8 23.5 45.4 23.7Z M47.0 23.5H53.3V24.9H51.1V31.1H49.3V24.9H47.0Z\" fill=\"#fff\"/><\/svg>","s5":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><defs><radialGradient id=\"sh\"><stop offset=\"0\" stop-color=\"#1b1f2a\" stop-opacity=\"0.24\"/><stop offset=\".6\" stop-color=\"#1b1f2a\" stop-opacity=\"0.108\"/><stop offset=\"1\" stop-color=\"#1b1f2a\" stop-opacity=\"0\"/><\/radialGradient><linearGradient id=\"me\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f4f6f9\"/><stop offset=\".4\" stop-color=\"#b9c0cb\"/><stop offset=\".75\" stop-color=\"#7d8592\"/><stop offset=\"1\" stop-color=\"#4b525d\"/><\/linearGradient><linearGradient id=\"bt\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#e9edf2\"/><stop offset=\".5\" stop-color=\"#9aa3af\"/><stop offset=\"1\" stop-color=\"#5c6470\"/><\/linearGradient><radialGradient id=\"mo\" cx=\".42\" cy=\".36\" r=\".75\"><stop offset=\"0\" stop-color=\"#ffffff\"/><stop offset=\".8\" stop-color=\"#f1f2ee\"/><stop offset=\"1\" stop-color=\"#d5d8d2\"/><\/radialGradient><linearGradient id=\"vi\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".75\"/><stop offset=\".5\" stop-color=\"#fff\" stop-opacity=\"0\"/><\/linearGradient><\/defs><ellipse cx=\"32\" cy=\"59\" rx=\"18\" ry=\"3.4\" fill=\"url(#sh)\"/><rect x=\"28.6\" y=\"5.6\" width=\"6.8\" height=\"4.4\" rx=\"1.4\" fill=\"url(#bt)\" stroke=\"#4b525d\" stroke-width=\".5\"/><rect x=\"30.2\" y=\"9.6\" width=\"3.6\" height=\"5\" fill=\"url(#bt)\"/><path d=\"M47.2 15.2l3.8-3.8 3 3-3.8 3.8z\" fill=\"url(#bt)\" stroke=\"#4b525d\" stroke-width=\".5\"/><path d=\"M16.8 15.2 13 11.4l-3 3 3.8 3.8z\" fill=\"url(#bt)\" stroke=\"#4b525d\" stroke-width=\".5\"/><circle cx=\"32\" cy=\"35\" r=\"21\" fill=\"url(#me)\" stroke=\"#3d434c\" stroke-width=\".6\"/><circle cx=\"32\" cy=\"35\" r=\"17.8\" fill=\"#3d434c\"/><circle cx=\"32\" cy=\"35\" r=\"17.2\" fill=\"url(#mo)\"/><g stroke-linecap=\"round\"><path d=\"M32.00 21.80L32.00 18.60\" stroke=\"#2b2f36\" stroke-width=\"0.9\"/><path d=\"M33.59 19.88L33.71 18.69\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M35.16 20.13L35.41 18.96\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M36.70 20.54L37.07 19.40\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M38.18 21.11L38.67 20.02\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M38.60 23.57L40.20 20.80\" stroke=\"#2b2f36\" stroke-width=\"0.9\"/><path d=\"M40.93 22.70L41.64 21.73\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M42.17 23.70L42.97 22.81\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M43.30 24.83L44.19 24.03\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M44.30 26.07L45.27 25.36\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M43.43 28.40L46.20 26.80\" stroke=\"#2b2f36\" stroke-width=\"0.9\"/><path d=\"M45.89 28.82L46.98 28.33\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M46.46 30.30L47.60 29.93\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M46.87 31.84L48.04 31.59\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M47.12 33.41L48.31 33.29\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M45.20 35.00L48.40 35.00\" stroke=\"#2b2f36\" stroke-width=\"0.9\"/><path d=\"M47.12 36.59L48.31 36.71\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M46.87 38.16L48.04 38.41\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M46.46 39.70L47.60 40.07\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M45.89 41.18L46.98 41.67\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M43.43 41.60L46.20 43.20\" stroke=\"#2b2f36\" stroke-width=\"0.9\"/><path d=\"M44.30 43.93L45.27 44.64\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M43.30 45.17L44.19 45.97\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M42.17 46.30L42.97 47.19\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M40.93 47.30L41.64 48.27\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M38.60 46.43L40.20 49.20\" stroke=\"#2b2f36\" stroke-width=\"0.9\"/><path d=\"M38.18 48.89L38.67 49.98\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M36.70 49.46L37.07 50.60\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M35.16 49.87L35.41 51.04\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M33.59 50.12L33.71 51.31\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M32.00 48.20L32.00 51.40\" stroke=\"#2b2f36\" stroke-width=\"0.9\"/><path d=\"M30.41 50.12L30.29 51.31\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M28.84 49.87L28.59 51.04\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M27.30 49.46L26.93 50.60\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M25.82 48.89L25.33 49.98\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M25.40 46.43L23.80 49.20\" stroke=\"#2b2f36\" stroke-width=\"0.9\"/><path d=\"M23.07 47.30L22.36 48.27\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M21.83 46.30L21.03 47.19\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M20.70 45.17L19.81 45.97\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M19.70 43.93L18.73 44.64\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M20.57 41.60L17.80 43.20\" stroke=\"#2b2f36\" stroke-width=\"0.9\"/><path d=\"M18.11 41.18L17.02 41.67\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M17.54 39.70L16.40 40.07\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M17.13 38.16L15.96 38.41\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M16.88 36.59L15.69 36.71\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M18.80 35.00L15.60 35.00\" stroke=\"#2b2f36\" stroke-width=\"0.9\"/><path d=\"M16.88 33.41L15.69 33.29\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M17.13 31.84L15.96 31.59\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M17.54 30.30L16.40 29.93\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M18.11 28.82L17.02 28.33\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M20.57 28.40L17.80 26.80\" stroke=\"#2b2f36\" stroke-width=\"0.9\"/><path d=\"M19.70 26.07L18.73 25.36\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M20.70 24.83L19.81 24.03\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M21.83 23.70L21.03 22.81\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M23.07 22.70L22.36 21.73\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M25.40 23.57L23.80 20.80\" stroke=\"#2b2f36\" stroke-width=\"0.9\"/><path d=\"M25.82 21.11L25.33 20.02\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M27.30 20.54L26.93 19.40\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M28.84 20.13L28.59 18.96\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><path d=\"M30.41 19.88L30.29 18.69\" stroke=\"#2b2f36\" stroke-width=\"0.4\"/><\/g><circle cx=\"32\" cy=\"28.5\" r=\"3.4\" fill=\"none\" stroke=\"#9aa0a8\" stroke-width=\".5\"/><path d=\"M32 35L43.65 41.82\" stroke=\"#d6281e\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><path d=\"M32 35L28.55 32.98\" stroke=\"#d6281e\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><circle cx=\"32\" cy=\"35\" r=\"1.9\" fill=\"#d6281e\" stroke=\"#7d140e\" stroke-width=\".4\"/><path d=\"M15.5 33a16.8 16.8 0 0 1 22-14.2 22 22 0 0 0-22 14.2z\" fill=\"url(#vi)\"/><\/svg>","sdif":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><defs><radialGradient id=\"sh\"><stop offset=\"0\" stop-color=\"#1b1f2a\" stop-opacity=\"0.2\"/><stop offset=\".6\" stop-color=\"#1b1f2a\" stop-opacity=\"0.090\"/><stop offset=\"1\" stop-color=\"#1b1f2a\" stop-opacity=\"0\"/><\/radialGradient><linearGradient id=\"mc\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#8a96a8\"/><stop offset=\"1\" stop-color=\"#5a6577\"/><\/linearGradient><linearGradient id=\"me2\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#5b6576\"/><stop offset=\"1\" stop-color=\"#363d4a\"/><\/linearGradient><linearGradient id=\"mf\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#9bb08a\"/><stop offset=\"1\" stop-color=\"#6b8a5a\"/><\/linearGradient><linearGradient id=\"nv\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ffffff\"/><stop offset=\"1\" stop-color=\"#dde6f0\"/><\/linearGradient><linearGradient id=\"fl\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#e8392c\"/><stop offset=\"1\" stop-color=\"#b51f16\"/><\/linearGradient><\/defs><ellipse cx=\"32\" cy=\"55.5\" rx=\"28\" ry=\"3.6\" fill=\"url(#sh)\"/><path d=\"M37 54 49 28l13 26z\" fill=\"url(#mc)\" opacity=\".9\"/><path d=\"M49 28l13 26H49.5z\" fill=\"#3e4554\" opacity=\".55\"/><path d=\"M49 28l-3.6 7.8 2.1-1.2 1.6 1.8 1.4-1.6 2.3 1.4z\" fill=\"url(#nv)\"/><path d=\"M3 54 28 13l25 41z\" fill=\"url(#mc)\"/><path d=\"M28 13l25 41H31.5l-1.2-17z\" fill=\"url(#me2)\"/><path d=\"M28 13 20.6 25.2l3.2-1.6 2.6 3 2.2-2.4 2.6 2.7 2.5-2.1 2.3 1.5z\" fill=\"url(#nv)\"/><path d=\"M28 13l2.3 11.4 2.5-2.1 2.3 1.5z\" fill=\"#c4d0de\"/><path d=\"M14 40l4-3 3 2M36 39l3 3\" stroke=\"#3e4554\" stroke-width=\".7\" fill=\"none\" opacity=\".5\" stroke-linecap=\"round\"/><path d=\"M3 54q14-6 25-3t25 3z\" fill=\"url(#mf)\"/><path d=\"M28 13V3.4\" stroke=\"#4a3a2a\" stroke-width=\"1.1\" stroke-linecap=\"round\"/><path d=\"M28.4 3.6q4.4-1.4 9 0.6t8.6-.2l-1.8 3.4 1.8 3.2q-4.4 1.6-8.6-.4t-9 .4z\" fill=\"url(#fl)\"/><path d=\"M28.4 3.6q4.4-1.4 9 .6v1.2q-4.6-1.6-9-.4z\" fill=\"#fff\" opacity=\".25\"/><\/svg>","srec":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><defs><radialGradient id=\"sh\"><stop offset=\"0\" stop-color=\"#1b1f2a\" stop-opacity=\"0.22\"/><stop offset=\".6\" stop-color=\"#1b1f2a\" stop-opacity=\"0.099\"/><stop offset=\"1\" stop-color=\"#1b1f2a\" stop-opacity=\"0\"/><\/radialGradient><radialGradient id=\"av\" cx=\".4\" cy=\".35\" r=\".75\"><stop offset=\"0\" stop-color=\"#ef5547\"/><stop offset=\"1\" stop-color=\"#a71a12\"/><\/radialGradient><radialGradient id=\"ab\" cx=\".4\" cy=\".35\" r=\".75\"><stop offset=\"0\" stop-color=\"#ffffff\"/><stop offset=\"1\" stop-color=\"#dcd8d0\"/><\/radialGradient><linearGradient id=\"bo\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#d8c4a0\"/><stop offset=\"1\" stop-color=\"#8e734c\"/><\/linearGradient><linearGradient id=\"dh\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#e9edf2\"/><stop offset=\"1\" stop-color=\"#6c7480\"/><\/linearGradient><\/defs><ellipse cx=\"30\" cy=\"58.5\" rx=\"22\" ry=\"3.4\" fill=\"url(#sh)\"/><circle cx=\"30.2\" cy=\"33.4\" r=\"23.6\" fill=\"#6e5532\"/><circle cx=\"29\" cy=\"32\" r=\"23.6\" fill=\"url(#bo)\" stroke=\"#6e5532\" stroke-width=\".5\"/><circle cx=\"29\" cy=\"32\" r=\"21\" fill=\"url(#av)\"/><circle cx=\"29\" cy=\"32\" r=\"17\" fill=\"url(#ab)\"/><circle cx=\"29\" cy=\"32\" r=\"13\" fill=\"url(#av)\"/><circle cx=\"29\" cy=\"32\" r=\"9\" fill=\"url(#ab)\"/><circle cx=\"29\" cy=\"32\" r=\"5\" fill=\"url(#av)\"/><circle cx=\"29\" cy=\"32\" r=\"21\" fill=\"none\" stroke=\"#7a140e\" stroke-width=\".5\"/><path d=\"M29.6 31.4l14-14\" stroke=\"#000\" stroke-opacity=\".25\" stroke-width=\"2.6\" stroke-linecap=\"round\" transform=\"translate(1.6 2)\"/><path d=\"M29 32l5-5\" stroke=\"#9aa3af\" stroke-width=\"1\" stroke-linecap=\"round\"/><path d=\"M33.6 27.4l9.2-9.2\" stroke=\"url(#dh)\" stroke-width=\"3\" stroke-linecap=\"round\"/><path d=\"M34.6 26.4l7.2-7.2\" stroke=\"#fff\" stroke-opacity=\".55\" stroke-width=\".8\" stroke-linecap=\"round\" transform=\"translate(-.6 -.6)\"/><path d=\"M42.4 18.6l5.6-5.6 3.6 1.2-4.6 4.6zM42.4 18.6l5.6-5.6-1.2-3.6-4.6 4.6z\" fill=\"#1d6fd1\"/><path d=\"M42.4 18.6l5.6-5.6 3.6 1.2-4.6 4.6z\" fill=\"#0f4c99\"/><\/svg>","serr":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><defs><radialGradient id=\"sh\"><stop offset=\"0\" stop-color=\"#1b1f2a\" stop-opacity=\"0.22\"/><stop offset=\".6\" stop-color=\"#1b1f2a\" stop-opacity=\"0.099\"/><stop offset=\"1\" stop-color=\"#1b1f2a\" stop-opacity=\"0\"/><\/radialGradient><linearGradient id=\"rv\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f26b5b\"/><stop offset=\"1\" stop-color=\"#d33a2c\"/><\/linearGradient><linearGradient id=\"ra\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4f86d9\"/><stop offset=\"1\" stop-color=\"#2a5fb4\"/><\/linearGradient><\/defs><ellipse cx=\"32\" cy=\"50\" rx=\"27\" ry=\"4\" fill=\"url(#sh)\"/><path d=\"M6 33h24v13H6z\" fill=\"#b8281c\"/><path d=\"M30 33h20v13H30z\" fill=\"#1f4f9c\"/><path d=\"M6 33l8-11h24l-8 11z\" fill=\"url(#rv)\"/><path d=\"M30 33l8-11h20l-8 11z\" fill=\"url(#ra)\"/><path d=\"M50 33l8-11v13l-8 11z\" fill=\"#173f80\"/><path d=\"M8 32.4l7.4-9.8h9\" stroke=\"#fff\" stroke-opacity=\".45\" stroke-width=\"1\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M32 32.4l7.4-9.8h7\" stroke=\"#fff\" stroke-opacity=\".4\" stroke-width=\"1\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M30 33v13M38 22l-8 11\" stroke=\"#000\" stroke-opacity=\".15\" stroke-width=\".6\"/><path d=\"M6 46h44\" stroke=\"#000\" stroke-opacity=\".2\" stroke-width=\".6\"/><path d=\"M8 52.5l2.4-.6.6 1.4-2.2.8zM14 54l1.8-.2.2 1.2-1.8.2zM4 50.6l1.4.2-.2 1.2-1.4-.4z\" fill=\"#d9584a\"/><\/svg>","ssc":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><defs><radialGradient id=\"sh\"><stop offset=\"0\" stop-color=\"#1b1f2a\" stop-opacity=\"0.22\"/><stop offset=\".6\" stop-color=\"#1b1f2a\" stop-opacity=\"0.099\"/><stop offset=\"1\" stop-color=\"#1b1f2a\" stop-opacity=\"0\"/><\/radialGradient><linearGradient id=\"cv\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ef5547\"/><stop offset=\"1\" stop-color=\"#b82319\"/><\/linearGradient><linearGradient id=\"pp\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ffffff\"/><stop offset=\"1\" stop-color=\"#ecebe6\"/><\/linearGradient><linearGradient id=\"ar\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#e9edf2\"/><stop offset=\".5\" stop-color=\"#9aa3af\"/><stop offset=\"1\" stop-color=\"#5c6470\"/><\/linearGradient><\/defs><ellipse cx=\"32\" cy=\"59\" rx=\"25\" ry=\"3.4\" fill=\"url(#sh)\"/><path d=\"M7 16h50v40.5a2.5 2.5 0 0 1-2.5 2.5h-45A2.5 2.5 0 0 1 7 56.5z\" fill=\"#d7d4cb\"/><path d=\"M7 16h50v38.5a2.5 2.5 0 0 1-2.5 2.5h-45A2.5 2.5 0 0 1 7 54.5z\" fill=\"url(#pp)\" stroke=\"#b9b5aa\" stroke-width=\".5\"/><path d=\"M9.5 9.5h45A2.5 2.5 0 0 1 57 12v13H7V12a2.5 2.5 0 0 1 2.5-2.5z\" fill=\"url(#cv)\"/><path d=\"M9.5 9.5h45A2.5 2.5 0 0 1 57 12v1.4H7V12a2.5 2.5 0 0 1 2.5-2.5z\" fill=\"#fff\" opacity=\".25\"/><path d=\"M7 25h50\" stroke=\"#7d140e\" stroke-width=\".6\"/><circle cx=\"18\" cy=\"13.6\" r=\"1.8\" fill=\"#6f1009\"/><rect x=\"16.8\" y=\"4.6\" width=\"2.4\" height=\"9.4\" rx=\"1.2\" fill=\"url(#ar)\"/><circle cx=\"32\" cy=\"13.6\" r=\"1.8\" fill=\"#6f1009\"/><rect x=\"30.8\" y=\"4.6\" width=\"2.4\" height=\"9.4\" rx=\"1.2\" fill=\"url(#ar)\"/><circle cx=\"46\" cy=\"13.6\" r=\"1.8\" fill=\"#6f1009\"/><rect x=\"44.8\" y=\"4.6\" width=\"2.4\" height=\"9.4\" rx=\"1.2\" fill=\"url(#ar)\"/><rect x=\"10.4\" y=\"29.9\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"19.9\" y=\"29.9\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"29.4\" y=\"29.9\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"38.9\" y=\"29.9\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"48.4\" y=\"29.9\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"10.4\" y=\"36.5\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"19.9\" y=\"36.5\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"29.4\" y=\"36.5\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"38.9\" y=\"36.5\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"48.4\" y=\"36.5\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"10.4\" y=\"43.1\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"19.9\" y=\"43.1\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"29.4\" y=\"43.1\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"38.9\" y=\"43.1\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"48.4\" y=\"43.1\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"10.4\" y=\"49.699999999999996\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"19.9\" y=\"49.699999999999996\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"29.4\" y=\"49.699999999999996\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"38.9\" y=\"49.699999999999996\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><rect x=\"48.4\" y=\"49.699999999999996\" width=\"5.2\" height=\"3.2\" rx=\".8\" fill=\"#c9c6bd\"/><path d=\"M36.1 45.1c0-3.6 3-5 5.8-5s5.2 1.6 5.2 4.6-2.8 4.6-5.6 4.6-5.8-1.8-5.2-4.8\" fill=\"none\" stroke=\"#d6281e\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><\/svg>"}, SIMU = {};
  function sim(id) {
    if (!SIM[id]) return '';
    if (!SIMU[id]) SIMU[id] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SIM[id]);
    return '<img class="ic-simr" src="' + SIMU[id] + '" alt="" aria-hidden="true" draggable="false" decoding="async">';
  }
  return { pacote: PACOTE, tema: tema, sim: sim, traco: traco, temPro: function (id) { return !!PRO[id]; }, temReal: function (id) { return !!REAL[id]; }, realUrl: realUrl, ui: U, glifo: G, ilu: ILU,
    creditoReal: 'Ilustrações: Servier Medical Art, CC BY 3.0' };
})();

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
  var VIS = { mapa: {}, def: {} };
VIS.liga = function (vid, ids) { ids.forEach(function (id) { (VIS.mapa[id] = VIS.mapa[id] || []).indexOf(vid) < 0 && VIS.mapa[id].push(vid); }); };

/* ---- linha-do-tempo-escolas-literarias.js ---- */
(function () {
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

})();

/* ---- semana-de-22-imagens.js ---- */
(function () {
/* Semana de Arte Moderna de 1922: o que era a norma academica (Pedro Americo, 1888) e o que a vanguarda europeia
   trouxe (Kirchner, expressionismo alemao, 1914 - o ambiente em que Anita Malfatti estudou em Berlim), com marcadores
   numerados nas pinturas; depois a sequencia 1917 (exposicao de Anita) -> 1922 (Semana). Obras de Anita e Di Cavalcanti
   ainda tem direito autoral no Brasil: por isso nao aparecem aqui. */
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
'Wc59dd23': [
'Por isso a resposta é A',
'Do quadro 1 para o 2 está a ruptura que Anita trouxe: cor livre, forma deformada.',
'Os modernistas queriam libertar a arte das normas acadêmicas europeias,',
'valorizando a cor, a originalidade e os temas nacionais.'
],
'Wdd4432d': [
'Por isso a resposta é B',
'A Semana de 1922 quis renovar a estética e a cultura do país:',
'romper com as tradições acadêmicas e defender a liberdade artística.',
'A C erra: o marco é a própria Semana (arte, música, literatura), não pintores alemães.'
]
};
VIS.def['semana-de-22-imagens'] = {
  tit: 'Da pintura acadêmica à vanguarda: o que a Semana de 22 recusou',
  fontes: [
    'Wikipedia (pt), Semana de Arte Moderna — https://pt.wikipedia.org/wiki/Semana_de_Arte_Moderna',
    'Wikimedia Commons, Pedro Américo, Independência ou Morte! (1888), domínio público — https://commons.wikimedia.org/wiki/File:Pedro_Am%C3%A9rico_-_Independ%C3%AAncia_ou_Morte_-_Google_Art_Project.jpg',
    'Wikimedia Commons, Ernst Ludwig Kirchner, Straßenszene (Friedrichstraße Berlin) (1914), Staatsgalerie Stuttgart, domínio público — https://commons.wikimedia.org/wiki/File:Kirchner_-_Stra%C3%9Fenszene_(Friedrichstra%C3%9Fe_Berlin)_(1914).jpg'
  ],
  tipo: 'anim', dur: 10.5,
  marcas: [[0, '1. Academia'], [3.5, '2. Vanguarda'], [7, '3. 1917 → 1922']],
  cred: 'Pinturas recortadas: Pedro Américo, Independência ou Morte! (1888), Museu Paulista, domínio público; Ernst Ludwig Kirchner, Cena de rua (Friedrichstraße, Berlim) (1914), Staatsgalerie Stuttgart, domínio público. Fotos via Wikimedia Commons.',
  nota: 'As questões se resolvem pelo texto; as imagens só mostram o contraste que a Semana encenou. Obras de Anita Malfatti e de Di Cavalcanti ainda têm direito autoral no Brasil e por isso não estão reproduzidas.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    var TF = 10.5;
    svg.setAttribute('viewBox', '0 0 640 350');
    var IW = 267, IH = 200;
    var fotos = [1, 2].map(function (i) {
      var g = el('g', {});
      el('image', { href: 'vis/semana-de-22-imagens-' + i + '.webp', x: 0, y: 0, width: IW, height: IH, preserveAspectRatio: 'xMidYMid slice' }, g);
      el('rect', { x: 0, y: 0, width: IW, height: IH, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, g);
      return g;
    });
    /* marcadores (coordenadas no recorte de 267 x 200) */
    var MK = [
      [[129, 156], [172, 31], [107, 53]],
      [[104, 40], [92, 133], [245, 72]]
    ];
    var NT = [
      ['Desenho exato: cavalos e corpos', 'com anatomia correta.', 'Cor fiel à natureza, luz suave,', 'perspectiva de janela.', 'Tema histórico e heroico,', 'cena montada como teatro.'],
      ['Rostos como máscaras, em cores', 'que não existem na pele.', 'Figuras alongadas e angulosas:', 'a forma é deformada de propósito.', 'Pincelada à vista e cor pura:', 'a cidade moderna, agitada.']
    ];
    var mk = [0, 1, 2].map(function (k) {
      var g = el('g', {});
      el('circle', { cx: 0, cy: 0, r: 12, style: 'fill:var(--ad-c);stroke:var(--folha);stroke-width:2.5' }, g);
      tx(0, 5, String(k + 1), 'font-size:14px;font-weight:700;fill:#17181C;text-anchor:middle', g);
      return g;
    });
    var notas = el('g', {});
    var NTt = [], NTn = [];
    for (var k = 0; k < 3; k++) {
      var gy = 30 + 58 * k;
      var c = el('circle', { cx: 314, cy: gy - 5, r: 11, style: 'fill:var(--ad-c)' }, notas);
      NTn.push(tx(314, gy, String(k + 1), 'font-size:14px;font-weight:700;fill:#17181C;text-anchor:middle', notas));
      NTt.push([tx(334, gy, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', notas), tx(334, gy + 20, '', 'font-size:15px;fill:var(--tinta)', notas)]);
    }
    var linha = el('g', {});
    var PASSOS = [['1917', 'Anita expõe em SP', 'cor e forma livres'], ['1917', 'Monteiro Lobato', 'ataca a mostra'], ['1922', 'Semana no Theatro', 'Municipal de SP']];
    var LX = [16, 224, 432];
    var lpb = PASSOS.map(function (p, i) {
      var g = el('g', {}, linha);
      el('rect', { x: LX[i], y: 152, width: 192, height: 54, rx: 10, style: 'fill:color-mix(in srgb,var(--ad-c) 14%,var(--folha));stroke:var(--ad-c);stroke-width:1.6' }, g);
      tx(LX[i] + 12, 172, p[0] + ' · ' + p[1], 'font-size:14px;font-weight:700;fill:var(--tinta)', g);
      tx(LX[i] + 12, 194, p[2], 'font-size:14px;fill:var(--tinta)', g);
      if (i < 2) el('path', { d: 'M' + (LX[i] + 194) + ' 179 h12 m-6 -5 l6 5 l-6 5', style: 'fill:none;stroke:var(--tinta);stroke-width:1.8' }, g);
      return g;
    });
    var r1 = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:var(--lapis)'), r2 = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:var(--lapis)');
    el('line', { x1: 16, x2: 624, y1: 214, y2: 214, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(20, 240, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)')];
    for (var j = 0; j < 4; j++) P.push(tx(20, 266 + 22 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. A norma acadêmica: copiar bem a natureza', 'Pedro Américo, Independência ou Morte! (1888): pintura de Academia.', 'Era esse o modelo de arte "correta" ensinado no Brasil:', 'desenho exato, cor natural e grandes temas da história.'],
      ['2. A vanguarda europeia: cor e forma livres', 'Kirchner, Cena de rua (Berlim, 1914): expressionismo alemão.', 'Anita estudou em Berlim (1910-1914) e depois em Nova York (1915-1916).', 'A cor exprime emoção, não imita; a forma se deforma de propósito.'],
      ['3. Da exposição de Anita à Semana de 1922', 'A mostra de Anita (1917) trouxe essa liberdade e foi atacada por Lobato.', 'Em fevereiro de 1922, a Semana reuniu arte, música e literatura', 'para romper com o academicismo e buscar uma arte moderna e brasileira.']
    ];
    var _desenha = function (t) {
      var f = t < 3.5 ? 0 : t < 7 ? 1 : 2, u;
      var Lt = TXT[f]; for (j = 0; j < 5; j++) P[j].textContent = Lt[j] || '';
      r1.textContent = ''; r2.textContent = '';
      if (f < 2) {
        fotos[f].setAttribute('transform', 'translate(16 4)'); fotos[f].style.opacity = '1'; fotos[1 - f].style.opacity = '0';
        notas.style.opacity = '1'; linha.style.opacity = '0';
        for (k = 0; k < 3; k++) {
          var a = ease((t - 3.5 * f - .4 - .8 * k) / .4);
          mk[k].setAttribute('transform', 'translate(' + (16 + MK[f][k][0]) + ' ' + (4 + MK[f][k][1]) + ') scale(' + (.6 + .4 * a).toFixed(2) + ')'); mk[k].style.opacity = a.toFixed(2);
          NTt[k][0].textContent = NT[f][2 * k]; NTt[k][1].textContent = NT[f][2 * k + 1];
          NTt[k][0].style.opacity = NTt[k][1].style.opacity = a.toFixed(2);
          NTn[k].style.opacity = a.toFixed(2); NTn[k].previousSibling.style.opacity = a.toFixed(2);
        }
      } else {
        u = ease((t - 7.1) / .8);
        var s = lerp(1, .6, u);
        fotos[0].setAttribute('transform', 'translate(' + lerp(16, 16, u) + ' 4) scale(' + s.toFixed(3) + ')'); fotos[0].style.opacity = '1';
        fotos[1].setAttribute('transform', 'translate(' + lerp(16, 224, u) + ' 4) scale(' + s.toFixed(3) + ')'); fotos[1].style.opacity = u.toFixed(2);
        notas.style.opacity = '0'; mk.forEach(function (m) { m.style.opacity = '0'; });
        linha.style.opacity = u.toFixed(2);
        lpb.forEach(function (g, i) { g.style.opacity = ease((t - 7.6 - .5 * i) / .4).toFixed(2); });
        if (u > .9) { r1.setAttribute('x', 16); r1.setAttribute('y', 142); r1.textContent = 'a norma (1888)'; r2.setAttribute('x', 224); r2.setAttribute('y', 142); r2.textContent = 'a vanguarda (1914)'; }
      }
    };
    return fimResposta(VIS.def['semana-de-22-imagens'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return TF - .01; }
    });
  }
};
VIS.liga('semana-de-22-imagens', ['Wc59dd23', 'Wdd4432d']);

})();

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
  var FLIMG = {}, FLIMGU = {};
  var LOGOS = {"Fuvest": "data:image/webp;base64,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", "São Camilo": "data:image/webp;base64,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"};   /* logos das universidades nos simulados (design/logos/FONTES.md) */
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
  var HW = null, HW_EM = 24;
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

/* ==== AD-JS fim ==== */
