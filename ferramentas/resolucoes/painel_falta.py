"""Gera docs/resolucoes/o-que-falta.html: o painel "O que falta no Aprendice" publicado como artefato para o dono.

Números das resoluções: lidos ao vivo do banco montado pelo converte.py (app/public/conteudo/<m>/banco.json), dos
registros dos lotes (todas as partes -p<k> e os lotes -pend-), de app/conteudo-fonte/indisponiveis.json, das provas
(app/conteudo-fonte/provas/*/prova.json) e do relatorio.json do site no ar. Cada questão do banco cai numa só situação
(situacoes()): pronta · na fila · em lote aberto · em espera · com gabarito em dúvida · nunca terá resolução
(indisponível, anulada pelo Aprendice ou de outra matéria). Itens com "auto" têm o detalhe escrito aqui.
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


BRT = datetime.timezone(datetime.timedelta(hours=-3))
SITE_RELATORIO = 'https://aprendice.vercel.app/conteudo/relatorio.json'
INDISPONIVEIS = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'indisponiveis.json')
# Situação de cada questão do banco montado (uma só categoria por questão, nesta ordem de precedência)
NUNCA = ('outra', 'anulada', 'indisponivel')       # nunca terão resolução, por decisão do dono
VAO_TER = ('fila', 'lote', 'espera', 'duvida')      # ainda vão ganhar resolução


def fmt(n):
    return f'{n:,}'.replace(',', '.')


def situacoes():
    """id -> (matéria, situação, questão), para todas as questões do banco montado (app/public/conteudo/<m>/banco.json):
    feita (tem resolução, cr) · outra (de outra matéria) · anulada (anulada pelo Aprendice) · indisponivel ("Questão
    indisponível", indisponiveis.json) · lote (em lote aberto comum, sendo resolvida) · espera (pendente: no registro de
    qualquer parte, em lote de pendentes -pend- aberto ou em pendentes.md) · duvida (divergência de gabarito) · fila."""
    import re
    reg = lote.registro()   # união de todas as matérias e partes (-p<k>)
    ind = set()
    if os.path.exists(INDISPONIVEIS):
        ind = set(json.load(open(INDISPONIVEIS)).get('questoes', {}))
    lote_comum, lote_pend = set(), set()
    for nome, l in reg['lotes'].items():
        if l.get('estado') == 'aberto':
            (lote_pend if lote.e_pend(nome) else lote_comum).update(l['ids'])
    md = os.path.join(lote.DOCS, 'pendentes.md')
    pend_md = set(re.findall(r'\bP[0-9a-f]{8}\b', open(md, encoding='utf-8').read())) if os.path.exists(md) else set()
    sit = {}
    for m in ORDEM:
        for q in json.load(open(os.path.join(lote.PUB, m, 'banco.json'))):
            i = q['id']
            if q.get('cr'):
                s = 'feita'
            elif q.get('outraMateria'):
                s = 'outra'
            elif q.get('anuladaAprendice'):
                s = 'anulada'
            elif q.get('indisponivel') or i in ind or str(q.get('pendente', '')).startswith('indisponível'):
                s = 'indisponivel'
            elif i in lote_comum:
                s = 'lote'
            elif i in lote_pend or i in reg['pendentes'] or i in pend_md:
                s = 'espera'
            elif i in reg['divergencias']:
                s = 'duvida'
            else:
                s = 'fila'
            sit[i] = (m, s, q)
    return sit


def site():
    """Resoluções publicadas: relatorio.json do site no ar; sem rede, a última publicação registrada."""
    import urllib.request
    try:
        with urllib.request.urlopen(SITE_RELATORIO, timeout=20) as r:
            d = json.load(r)['com_resolucao']
        return {'por_materia': d, 'total': sum(d.values()), 'fonte': 'relatório do site no ar'}
    except Exception:
        try:
            u = json.load(open(os.path.join(RAIZ, 'docs', 'resolucoes', 'publicacao.json')))['ultima']
            return {'por_materia': u['por_materia'], 'total': u['resolvidas'],
                    'fonte': f'última publicação registrada, {u.get("data", "")}'}
        except Exception:
            return {'por_materia': {}, 'total': 0, 'fonte': 'sem dado'}


def numeros(sit, no_site):
    import collections
    rel = json.load(open(os.path.join(lote.PUB, 'relatorio.json')))['com_resolucao']
    linhas = []
    for m in ORDEM:
        c = collections.Counter(s for (mm, s, _) in sit.values() if mm == m)
        facil = sum(1 for (mm, s, q) in sit.values() if mm == m and s == 'fila' and lote.faixa(q) in (0, 1))
        if c['feita'] != rel.get(m, 0):
            sys.exit(f'{m}: {c["feita"]} com resolução no banco, {rel.get(m)} no relatorio.json: rode o converte de novo')
        linhas.append({'m': m, 'nome': lote.NOMES[m], 'feitas': c['feita'], 'no_site': no_site['por_materia'].get(m, 0),
                       'faltam': sum(c[k] for k in VAO_TER), 'nunca': sum(c[k] for k in NUNCA),
                       'c': c, 'enem_alvo_facil': facil})
    return linhas


def provas(sit):
    """Provas: no projeto; prontas (cada questão tem resolução ou nunca terá, por decisão); pendentes, separadas pelo que
    resta (questões na fila; em lote aberto; só em espera ou com gabarito em dúvida); e anos 2020-2026 sem prova em
    cada vestibular do catálogo. Questão duplicada de uma antiga do protótipo conta pelo id antigo
    (public/conteudo/duplicatas-provas.json)."""
    import glob
    fonte = os.path.join(RAIZ, 'app', 'conteudo-fonte')
    arq_dup = os.path.join(lote.PUB, 'duplicatas-provas.json')
    dup = json.load(open(arq_dup)) if os.path.exists(arq_dup) else {}
    ids = {}
    prontas = so_nunca = com_fila = com_lote = so_espera = 0
    for f in glob.glob(os.path.join(fonte, 'provas', '*', 'prova.json')):
        d = json.load(open(f))
        ids[d['id']] = (d.get('catalogoId'), str(d.get('ano', ''))[:4])
        st = set()
        for q in d['questoes']:
            i = q['id'] if q['id'] in sit else dup.get(q['id'], '/').split('/')[-1]
            s = sit.get(i, ('', 'fila'))[1]
            st.add('indisponivel' if q.get('indisponivel') and s != 'feita' else s)
        resta = st & set(VAO_TER)
        if not resta:
            prontas += 1
            so_nunca += bool(st & set(NUNCA))
        elif 'fila' in resta:
            com_fila += 1
        elif 'lote' in resta:
            com_lote += 1
        else:
            so_espera += 1
    cat = json.load(open(os.path.join(fonte, 'catalogo-vestibulares.json')))['provas']
    anos = [str(a) for a in range(2020, 2027)]
    cobertos = {(c, a) for c, a in ids.values() if c and a in anos}
    vazios = sum(1 for v in cat for a in anos if (v['id'], a) not in cobertos)
    sem_nenhuma = sum(1 for v in cat if not any((v['id'], a) in cobertos for a in anos))
    return {'projeto': len(ids), 'completas': prontas, 'so_nunca': so_nunca, 'andamento': len(ids) - prontas,
            'com_fila': com_fila, 'com_lote': com_lote, 'so_espera': so_espera,
            'vestibulares': len(cat), 'anos_vazios': vazios, 'meta': len(cat) * len(anos), 'sem_nenhuma': sem_nenhuma}


def detalhe_auto(it, lin, no_site, quando):
    """Itens do o-que-falta.json com "auto": o detalhe é escrito aqui, com os números do momento."""
    a = it.get('auto')
    if a == 'resolucoes':
        ms = ', '.join(f'{x["nome"]} {fmt(x["no_site"])}' for x in lin)
        fil = [x['nome'] for x in lin if x['c']['fila']]
        return (f'{fmt(no_site["total"])} publicadas no site ({ms}); {fmt(sum(x["feitas"] for x in lin))} prontas no '
                f'banco local em {quando}. Fila zerada em todas as matérias'
                + (f' menos {", ".join(fil)}' if fil else '') + '; o resto está em lote aberto ou em espera.')
    if a == 'espera':
        xs = sorted(lin, key=lambda x: -x['c']['espera'])
        return ('Hoje: ' + ', '.join(f'{x["nome"]} {x["c"]["espera"]}' for x in xs if x['c']['espera'])
                + f' (total {sum(x["c"]["espera"] for x in lin)}, contando os pendentes de todas as partes e os que estão '
                'sendo retomados nos lotes de pendentes). Regra (13/11): pergunta sobre a obra inteira passa a ser '
                'resolvida com fonte didática confirmada na web; letra de música deixou de ser motivo de espera.')
    return it.get('detalhe')


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
    sit = situacoes()
    no_site = site()
    lin = numeros(sit, no_site)
    pv = provas(sit)
    itens = json.load(open(ITENS)) if os.path.exists(ITENS) else {'grupos': []}
    tot_f = sum(x['feitas'] for x in lin)
    tot_r = sum(x['faltam'] for x in lin)
    tot_n = sum(x['nunca'] for x in lin)
    so = {k: sum(x['c'][k] for x in lin) for k in VAO_TER + NUNCA}
    pct = 100 * tot_f / max(1, tot_f + tot_r)
    pct_txt = (f'{pct:.1f}'.replace('.', ',') if pct < 99.95 else '100') + '%'
    agora = datetime.datetime.now(BRT).strftime('%d/%m/%Y, %Hh%M')
    banco_em = datetime.datetime.fromtimestamp(os.path.getmtime(os.path.join(lote.PUB, 'relatorio.json')), BRT)
    banco_em = banco_em.strftime('%d/%m/%Y, %Hh%M')

    css_cores = []
    for x in lin:
        m = x['m']
        css_cores.append(f'.m-{m}{{--c:{cor(m, "principal")};--ct:{cor(m, "texto_tema_claro")}}}')
        css_cores.append(f'@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]) .m-{m}{{--ct:{cor(m, "texto_tema_escuro")}}}}}')
        css_cores.append(f':root[data-theme="dark"] .m-{m}{{--ct:{cor(m, "texto_tema_escuro")}}}')

    linhas = []
    for x in sorted(lin, key=lambda x: (x['c']['fila'] == 0, -x['faltam'])):
        c = x['c']
        tot = x['feitas'] + x['faltam']
        p = 100 * x['feitas'] / max(1, tot)
        # concluída = nenhuma questão na fila (todas já resolvidas ou entregues a um lote/à espera)
        if c['fila'] == 0:
            est = '<span class="pill ok">concluída</span>'
        elif x['m'] in itens.get('pausadas', []):  # estado real vem do o-que-falta.json
            est = '<span class="pill pausa">pausada</span>'
        else:
            est = '<span class="pill and">em andamento</span>'
        obs = []
        if x['faltam']:
            partes_f = [f'{fmt(c["fila"])} na fila' if c['fila'] else '',
                        f'{fmt(c["lote"])} em lote aberto' if c['lote'] else '',
                        f'{fmt(c["espera"])} em espera (print, gabarito ou trecho)' if c['espera'] else '',
                        f'{fmt(c["duvida"])} com gabarito em dúvida' if c['duvida'] else '']
            obs.append('Faltam: ' + ', '.join(t for t in partes_f if t))
        if x['enem_alvo_facil']:
            obs.append(f'{fmt(x["enem_alvo_facil"])} da fila são do ENEM ou provas-alvo (nível 1 a 6)')
        if x['nunca']:
            obs.append(f'{fmt(x["nunca"])} nunca terão resolução (decisão: indisponível, anulada ou de outra matéria)')
        obs.append(f'{fmt(x["no_site"])} no site agora')
        linhas.append(f'''<li class="mat m-{x["m"]}">
  <div class="mat-top"><span class="dot"></span><span class="mat-nome">{e(x["nome"])}</span>{est}</div>
  <div class="barra" role="img" aria-label="{p:.0f}% feito"><span style="width:{p:.1f}%"></span></div>
  <div class="mat-num"><span><b>{fmt(x["feitas"])}</b> prontas</span><span><b>{fmt(x["faltam"])}</b> faltam</span></div>
  <p class="obs">{e(" · ".join(obs))}</p>
</li>''')

    grupos = []
    n_falta = n_feito = n_dec = n_and = 0
    for g in itens.get('grupos', []):
        lis = []
        for it in g.get('itens', []):
            st = it.get('estado', 'falta')
            n_falta += st == 'falta'
            n_feito += st == 'feito'
            n_dec += st == 'decidir'
            n_and += st == 'andamento'
            rot = {'falta': 'falta', 'feito': 'feito', 'decidir': 'você decide', 'andamento': 'em andamento'}.get(st, st)
            dt = detalhe_auto(it, lin, no_site, banco_em)
            det = f'<span class="det">{e(dt)}</span>' if dt else ''
            caixa = caixa_resposta(it) if st == 'decidir' else ''
            lis.append(f'<li class="it st-{st}"><span class="tag">{e(rot)}</span><span class="txt">{e(it["texto"])}{det}</span>{caixa}</li>')
        grupos.append(f'<section class="grupo"><h2>{e(g["area"])}</h2><ul class="itens">{"".join(lis)}</ul></section>')

    pub_txt = (f'No site agora: <b>{fmt(no_site["total"])}</b> resoluções ({e(no_site["fonte"])}). Prontas no banco local, '
               f'montado em {banco_em}: <b>{fmt(tot_f)}</b> ({fmt(tot_f - no_site["total"])} ainda não publicadas).')

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
.nota-provas{{margin-top:10px;max-width:70ch}}
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
  <p class="sub">Números calculados em {agora} (horário de Brasília, UTC-3). {pub_txt}</p>
  <p class="site">Site: <a href="https://aprendice.vercel.app" target="_blank" rel="noopener">aprendice.vercel.app</a></p>
</header>
<div class="resumo">
  <div class="n"><b>{pct_txt}</b><span>das questões de prova que terão resolução já estão prontas</span></div>
  <div class="n"><b>{fmt(no_site["total"])}</b><span>resoluções no site agora (publicadas)</span></div>
  <div class="n"><b>{fmt(tot_f)}</b><span>resoluções prontas no banco ({fmt(tot_f - no_site["total"])} ainda não publicadas)</span></div>
  <div class="n"><b>{fmt(tot_r)}</b><span>questões que ainda vão ganhar resolução: {fmt(so["fila"])} na fila, {fmt(so["lote"])} em lote aberto, {fmt(so["espera"])} em espera, {fmt(so["duvida"])} com gabarito em dúvida</span></div>
  <div class="n"><b>{fmt(tot_n)}</b><span>nunca terão resolução, por decisão: {fmt(so["indisponivel"])} indisponíveis, {fmt(so["anulada"])} anuladas pelo Aprendice, {fmt(so["outra"])} de outra matéria</span></div>
  <div class="n"><b>{n_dec}</b><span>decisões esperando você</span></div>
</div>
<section><h2>Provas</h2>
<div class="resumo">
  <div class="n"><b>{pv["projeto"]}</b><span>provas no projeto e no site</span></div>
  <div class="n"><b>{pv["completas"]}</b><span>provas prontas: toda questão tem resolução ou está fora por decisão ({pv["so_nunca"]} delas têm alguma questão fora)</span></div>
  <div class="n"><b>{pv["andamento"]}</b><span>provas pendentes: {pv["com_fila"]} com questões na fila, {pv["com_lote"]} sem fila, mas com questões em lote aberto, {pv["so_espera"]} só com questões em espera ou com gabarito em dúvida</span></div>
  <div class="n"><b>{pv["anos_vazios"]}</b><span>faltam: anos de 2020 a 2026 sem prova, nos {pv["vestibulares"]} vestibulares do catálogo</span></div>
</div>
<p class="obs nota-provas">A meta é uma prova por ano de 2020 a 2026 em cada vestibular ({pv["meta"]} ao todo). {pv["sem_nenhuma"]} vestibulares ainda não têm nenhuma prova, por bloqueio do site da banca (baixar à mão), formato que o site não aceita, gabarito só preliminar ou por não terem prova própria.</p>
</section>
<section><h2>Resoluções por matéria</h2><ul class="lista">{"".join(linhas)}</ul></section>
<div class="grupos">{"".join(grupos)}
<section class="grupo"><h2>Outra instrução para a coordenação</h2><div class="itens geral">{caixa_resposta({"id": "geral", "texto": "Instrução geral do dono"}, "Escreva qualquer outra instrução")}</div></section>
</div>
<footer>{n_feito} itens concluídos · {n_and} em andamento · {n_falta} por fazer · {n_dec} para você decidir. A página é atualizada pela coordenação a cada 1.000 questões resolvidas; as suas instruções são lidas a cada rodada (3 em 3 horas).</footer>
</div>
''' + SCRIPT
    open(SAIDA, 'w').write(pagina)
    print(SAIDA, tot_f, tot_r)


if __name__ == '__main__':
    gera()
