"""Gera docs/resolucoes/o-que-falta.html: o painel "O que falta no Aprendice" publicado como artefato para o dono.

Números das resoluções: lidos ao vivo (banco montado pelo converte.py + registros dos lotes).
Demais itens: docs/resolucoes/o-que-falta.json (lista mantida pela coordenadora; marque "estado": "feito" ao concluir).
Uso: cd app && python3 scripts/converte.py && cd .. && python3 ferramentas/resolucoes/painel_falta.py
Depois publique o HTML no mesmo artefato (URL em docs/resolucoes/COORDENACAO.md, seção Publicação).
"""
import datetime
import hashlib
import html
import json
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import lote  # noqa: E402

RAIZ = lote.RAIZ
SAIDA = os.path.join(RAIZ, 'docs', 'resolucoes', 'o-que-falta.html')
ITENS = os.path.join(RAIZ, 'docs', 'resolucoes', 'o-que-falta.json')
PALETA = os.path.join(RAIZ, 'docs', 'cores', 'paleta.json')
ORDEM = ['mat', 'fis', 'qui', 'bio', 'por', 'geo', 'his', 'ing', 'fs']


def e(t):
    return html.escape(str(t))


def numeros():
    reg = lote.registro()
    fp = lote.resolvidas_em_provas()
    rel = json.load(open(os.path.join(lote.PUB, 'relatorio.json')))['com_resolucao']
    linhas = []
    for m in ORDEM:
        qs = lote.faltam(m, reg, fp)
        r = lote.registro(m)
        linhas.append({
            'm': m, 'nome': lote.NOMES[m], 'feitas': rel.get(m, 0), 'faltam': len(qs),
            'enem_alvo_facil': sum(1 for q in qs if lote.faixa(q) in (0, 1)),
            'pendentes': len(r.get('pendentes', {})), 'divergencias': len(r.get('divergencias', {})),
        })
    return linhas


def no_ar():
    try:
        return json.load(open(os.path.join(RAIZ, 'docs', 'resolucoes', 'publicacao.json')))['ultima']
    except Exception:
        return {}


def id_item(it):
    return it.get('id') or 'd-' + hashlib.sha1(it['texto'].encode()).hexdigest()[:10]


def caixa_resposta(it, rotulo='O que fazer com esta pendência'):
    i = id_item(it)
    return f'''<div class="resp" data-id="{e(i)}" data-item="{e(it["texto"])}">
  <label for="r-{e(i)}">{e(rotulo)}</label>
  <textarea id="r-{e(i)}" rows="2" placeholder="Escreva aqui a sua instrução"></textarea>
  <div class="resp-acao"><button type="button">Enviar</button><span class="resp-st" aria-live="polite"></span></div>
  <p class="retorno" hidden></p>
</div>'''


SCRIPT = '''<script>
(async function () {
  const caixas = Array.from(document.querySelectorAll('.resp'));
  const aviso = (c, t) => { c.querySelector('.resp-st').textContent = t; };
  const db = await (window.claude ? window.claude.use('db') : null);
  if (!db) {
    caixas.forEach(c => { c.querySelector('button').disabled = true; aviso(c, 'Abra esta página no claude.ai, com a sua conta, para enviar.'); });
    return;
  }
  const quando = iso => { try { return new Date(iso).toLocaleString('pt-BR', {dateStyle: 'short', timeStyle: 'short'}); } catch (e) { return ''; } };
  const porId = {};
  caixas.forEach(c => { porId[c.dataset.id] = c; });
  const espera = setTimeout(() => caixas.forEach(c => { if (!c.dataset.ok) aviso(c, 'Ainda não consegui carregar as respostas salvas.'); }), 10000);
  db.collection('respostas').onSnapshot(snap => {
    if (!snap.metadata.fromCache) clearTimeout(espera);
    caixas.forEach(c => { c.dataset.ok = '1'; });
    snap.docs.forEach(d => {
      const c = porId[d.id]; const v = d.data(); if (!c || !v) return;
      const ta = c.querySelector('textarea');
      if (document.activeElement !== ta && !c.dataset.editando) ta.value = v.texto || '';
      aviso(c, v.lido ? 'Recebido pela coordenação em ' + quando(v.lidoEm) : 'Enviado em ' + quando(v.enviadoEm) + '. A coordenação lê na próxima rodada.');
      const r = c.querySelector('.retorno');
      if (v.retorno) { r.textContent = 'Coordenação: ' + v.retorno; r.hidden = false; } else { r.hidden = true; }
    });
  }, () => { clearTimeout(espera); caixas.forEach(c => aviso(c, 'Não consegui carregar as respostas salvas.')); });
  caixas.forEach(c => {
    const ta = c.querySelector('textarea'); const bt = c.querySelector('button');
    ta.addEventListener('input', () => { c.dataset.editando = '1'; });
    bt.addEventListener('click', async () => {
      const texto = ta.value.trim();
      if (!texto) { aviso(c, 'Escreva a instrução antes de enviar.'); ta.focus(); return; }
      bt.disabled = true; aviso(c, 'Enviando...');
      try {
        await db.doc('respostas/' + c.dataset.id).set({texto: texto, item: c.dataset.item, enviadoEm: new Date().toISOString(), lido: false});
        delete c.dataset.editando;
        aviso(c, 'Enviado. A coordenação lê na próxima rodada.');
      } catch (e) {
        aviso(c, 'Não foi enviado: ' + ((e && e.message) || 'erro desconhecido') + '. Tente de novo.');
      } finally { bt.disabled = false; }
    });
  });
})();
</script>'''


def gera():
    pal = json.load(open(PALETA))['materias']
    cor = lambda m, k: pal.get(m, pal.get('fil', {})).get(k, '#888')  # noqa: E731
    lin = numeros()
    itens = json.load(open(ITENS)) if os.path.exists(ITENS) else {'grupos': []}
    pub = no_ar()
    tot_f = sum(x['feitas'] for x in lin)
    tot_r = sum(x['faltam'] for x in lin)
    pct = round(100 * tot_f / max(1, tot_f + tot_r))
    agora = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-3))).strftime('%d/%m/%Y, %Hh%M')

    css_cores = []
    for x in lin:
        m = x['m']
        css_cores.append(f'.m-{m}{{--c:{cor(m, "principal")};--ct:{cor(m, "texto_tema_claro")}}}')
        css_cores.append(f'@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]) .m-{m}{{--ct:{cor(m, "texto_tema_escuro")}}}}}')
        css_cores.append(f':root[data-theme="dark"] .m-{m}{{--ct:{cor(m, "texto_tema_escuro")}}}')

    linhas = []
    for x in sorted(lin, key=lambda x: (x['faltam'] == 0, -x['faltam'])):
        tot = x['feitas'] + x['faltam']
        p = 100 * x['feitas'] / max(1, tot)
        if x['faltam'] == 0:
            est = '<span class="pill ok">concluída</span>'
        elif x['m'] == 'geo':
            est = '<span class="pill pausa">pausada</span>'
        else:
            est = '<span class="pill and">em andamento</span>'
        obs = []
        if x['enem_alvo_facil']:
            obs.append(f'{x["enem_alvo_facil"]} do ENEM ou provas-alvo (nível 1 a 6)')
        if x['pendentes']:
            obs.append(f'{x["pendentes"]} em espera (print, gabarito ou trecho)')
        if x['divergencias']:
            obs.append(f'{x["divergencias"]} com gabarito em dúvida')
        linhas.append(f'''<li class="mat m-{x["m"]}">
  <div class="mat-top"><span class="dot"></span><span class="mat-nome">{e(x["nome"])}</span>{est}</div>
  <div class="barra" role="img" aria-label="{p:.0f}% feito"><span style="width:{p:.1f}%"></span></div>
  <div class="mat-num"><span><b>{x["feitas"]:,}</b> feitas</span><span><b>{x["faltam"]:,}</b> faltam</span></div>
  {f'<p class="obs">{e(" · ".join(obs))}</p>' if obs else ''}
</li>'''.replace(',', '.'))

    grupos = []
    n_falta = n_feito = n_dec = 0
    for g in itens.get('grupos', []):
        lis = []
        for it in g.get('itens', []):
            st = it.get('estado', 'falta')
            n_falta += st == 'falta'
            n_feito += st == 'feito'
            n_dec += st == 'decidir'
            rot = {'falta': 'falta', 'feito': 'feito', 'decidir': 'você decide', 'andamento': 'em andamento'}.get(st, st)
            det = f'<span class="det">{e(it["detalhe"])}</span>' if it.get('detalhe') else ''
            caixa = caixa_resposta(it) if st == 'decidir' else ''
            lis.append(f'<li class="it st-{st}"><span class="tag">{e(rot)}</span><span class="txt">{e(it["texto"])}{det}</span>{caixa}</li>')
        grupos.append(f'<section class="grupo"><h2>{e(g["area"])}</h2><ul class="itens">{"".join(lis)}</ul></section>')

    pub_txt = ''
    if pub:
        pub_txt = f'No site agora: <b>{pub.get("resolvidas", 0):,}</b> resoluções (publicado em {e(pub.get("data", ""))}).'.replace(',', '.')

    pagina = f'''<title>O que falta no Aprendice</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Dancing+Script:wght@600&display=swap">
<style>
/* Painel de acompanhamento: resumo no topo, matérias em lista com barra de progresso, depois a lista de pendências por área. */
:root{{--bg:#F6F7F9;--sup:#FFFFFF;--fg:#17181C;--suave:#5C6070;--linha:#E2E4EA;--ok:#1E7B3A;--okf:#E2F4E7;--and:#2350B8;--andf:#E6EDFC;--dec:#9A5B00;--decf:#FDF0DB;--pau:#6B6F7C;--pauf:#ECEDF1;
--txt:"Familjen Grotesk",system-ui,-apple-system,"Segoe UI",sans-serif;--tit:"Dancing Script","Brush Script MT",cursive}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#121318;--sup:#1B1D24;--fg:#ECEDF1;--suave:#A3A7B5;--linha:#2C2F39;--ok:#6FD08C;--okf:#173A22;--and:#8FB0FF;--andf:#1C2847;--dec:#F2B25C;--decf:#3D2A0E;--pau:#A3A7B5;--pauf:#262932;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#121318;--sup:#1B1D24;--fg:#ECEDF1;--suave:#A3A7B5;--linha:#2C2F39;--ok:#6FD08C;--okf:#173A22;--and:#8FB0FF;--andf:#1C2847;--dec:#F2B25C;--decf:#3D2A0E;--pau:#A3A7B5;--pauf:#262932;color-scheme:dark}}
{"".join(css_cores)}
body{{background:var(--bg);color:var(--fg);font-family:var(--txt);font-size:15px;line-height:1.5}}
.pag{{max-width:980px;margin:0 auto;padding-block:28px 56px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:grid;gap:28px}}
header{{display:grid;gap:6px}}
h1{{font-family:var(--tit);font-weight:600;font-size:2.6rem;line-height:1.1;margin:0;text-wrap:balance}}
.sub{{color:var(--suave);margin:0}}
.site{{margin:2px 0 0;font-weight:600}}
.site a{{color:var(--and);text-underline-offset:3px}}
.site a:focus-visible{{outline:2px solid var(--and);outline-offset:2px;border-radius:4px}}
.resumo{{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}}
.n{{background:var(--sup);border:1px solid var(--linha);border-radius:12px;padding:14px 16px;display:grid;gap:2px}}
.n b{{font-size:1.7rem;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.15}}
.n span{{color:var(--suave);font-size:.85rem}}
h2{{font-size:1.05rem;font-weight:700;margin:0 0 10px;letter-spacing:.01em}}
.lista{{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}}
.mat{{background:var(--sup);border:1px solid var(--linha);border-radius:12px;padding:14px 16px;display:grid;gap:8px;min-width:0}}
.mat-top{{display:flex;align-items:center;gap:8px}}
.dot{{width:10px;height:10px;border-radius:50%;background:var(--c);flex:none}}
.mat-nome{{font-weight:600;color:var(--ct);flex:1;min-width:0}}
.barra{{height:8px;border-radius:99px;background:var(--linha);overflow:hidden}}
.barra span{{display:block;height:100%;background:var(--c);border-radius:99px}}
.mat-num{{display:flex;justify-content:space-between;gap:8px;font-size:.9rem;color:var(--suave);font-variant-numeric:tabular-nums}}
.mat-num b{{color:var(--fg);font-weight:600}}
.obs{{margin:0;font-size:.82rem;color:var(--suave)}}
.pill{{font-size:.72rem;font-weight:600;padding:2px 8px;border-radius:99px;letter-spacing:.02em;white-space:nowrap}}
.pill.ok{{background:var(--okf);color:var(--ok)}}.pill.and{{background:var(--andf);color:var(--and)}}.pill.pausa{{background:var(--pauf);color:var(--pau)}}
.grupos{{display:grid;gap:22px}}
.itens{{list-style:none;margin:0;padding:0;display:grid;border:1px solid var(--linha);border-radius:12px;background:var(--sup);overflow:hidden}}
.it{{display:grid;grid-template-columns:110px 1fr;gap:12px;padding:11px 16px;border-top:1px solid var(--linha);align-items:baseline}}
.it:first-child{{border-top:0}}
.tag{{font-size:.72rem;font-weight:600;padding:2px 8px;border-radius:99px;justify-self:start;white-space:nowrap}}
.st-falta .tag{{background:var(--pauf);color:var(--fg)}}.st-feito .tag{{background:var(--okf);color:var(--ok)}}.st-decidir .tag{{background:var(--decf);color:var(--dec)}}.st-andamento .tag{{background:var(--andf);color:var(--and)}}
.st-feito .txt{{color:var(--suave);text-decoration:line-through;text-decoration-color:var(--linha)}}
.txt{{min-width:0;overflow-wrap:anywhere}}
.det{{display:block;color:var(--suave);font-size:.85rem;margin-top:2px}}
.st-feito .det{{text-decoration:none}}
footer{{color:var(--suave);font-size:.82rem}}
.resp{{grid-column:2;display:grid;gap:6px;margin-top:4px}}
.geral .resp{{grid-column:auto;padding:12px 16px;margin:0}}
.resp label{{font-size:.8rem;font-weight:600;color:var(--suave)}}
.resp textarea{{width:100%;box-sizing:border-box;font:inherit;font-size:.92rem;color:var(--fg);background:var(--bg);border:1px solid var(--linha);border-radius:8px;padding:8px 10px;resize:vertical;min-height:56px}}
.resp textarea:focus-visible{{outline:2px solid var(--and);outline-offset:1px;border-color:transparent}}
.resp-acao{{display:flex;align-items:center;gap:10px;flex-wrap:wrap}}
.resp button{{font:inherit;font-size:.85rem;font-weight:600;color:var(--sup);background:var(--fg);border:0;border-radius:8px;padding:7px 16px;cursor:pointer}}
.resp button:hover{{opacity:.88}}
.resp button:focus-visible{{outline:2px solid var(--and);outline-offset:2px}}
.resp button:disabled{{opacity:.5;cursor:default}}
.resp-st{{font-size:.8rem;color:var(--suave)}}
.retorno{{margin:0;font-size:.85rem;background:var(--okf);color:var(--ok);border-radius:8px;padding:6px 10px}}
@media (max-width:520px){{.it{{grid-template-columns:1fr;gap:4px}}.resp{{grid-column:auto}}h1{{font-size:2.2rem}}}}
</style>
<div class="pag">
<header>
  <h1>O que falta no Aprendice</h1>
  <p class="sub">Atualizado em {agora} (horário de Brasília). {pub_txt}</p>
  <p class="site">Site: <a href="https://aprendice.vercel.app" target="_blank" rel="noopener">aprendice.vercel.app</a></p>
</header>
<div class="resumo">
  <div class="n"><b>{pct}%</b><span>das questões de prova já resolvidas</span></div>
  <div class="n"><b>{f"{tot_f:,}".replace(",", ".")}</b><span>resoluções prontas</span></div>
  <div class="n"><b>{f"{tot_r:,}".replace(",", ".")}</b><span>questões sem resolução</span></div>
  <div class="n"><b>{n_dec}</b><span>decisões esperando você</span></div>
</div>
<section><h2>Resoluções por matéria</h2><ul class="lista">{"".join(linhas)}</ul></section>
<div class="grupos">{"".join(grupos)}
<section class="grupo"><h2>Outra instrução para a coordenação</h2><div class="itens geral">{caixa_resposta({"id": "geral", "texto": "Instrução geral do dono"}, "Escreva qualquer outra instrução")}</div></section>
</div>
<footer>{n_feito} itens concluídos · {n_falta} itens por fazer. A página é atualizada pela coordenação a cada 1.000 questões resolvidas; as suas instruções são lidas a cada rodada (3 em 3 horas).</footer>
</div>
''' + SCRIPT
    open(SAIDA, 'w').write(pagina)
    print(SAIDA, tot_f, tot_r)


if __name__ == '__main__':
    gera()
