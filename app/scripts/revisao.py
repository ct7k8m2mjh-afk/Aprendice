#!/usr/bin/env python3
"""Revisão em slides (comandos 24 e 26 do dono): leva docs/revisao/<matéria>/<TEMA>.json para public/conteudo/<m>/revisao/.

Basta soltar um JSON novo em docs/revisao/<m>/ (formato em docs/revisao/FORMATO.md) e rodar o converte.py: nada no
código do site muda. Este script:
- confere o formato mínimo de cada tema (id, nome, slides por conteúdo; fixe com 3 linhas) e pára com erro claro;
- grava public/conteudo/<m>/revisao/<TEMA>.json (o tema inteiro) e public/conteudo/<m>/revisao/indice.json
  (temas, conteúdos e quantos slides cada um tem);
- leva resumo/formulas/erro/cartoes para a "Teoria em cartões" do tema (materia.json), sem apagar o que já existe:
  campo vazio recebe o da revisão; cartão de conteúdo que ainda não tem cartão é acrescentado;
- fotos: só as de visual.foto (Wikimedia Commons, licença livre). A imagem é baixada UMA vez para
  app/conteudo-fonte/revisao/<m>/fotos/ (versionada) e servida pelo próprio site: o navegador do aluno não fala com
  terceiros (LGPD). O crédito (autor, licença, página) segue junto no JSON.

Uso: python3 scripts/revisao.py   (o converte.py chama no fim da conversão completa)
"""
import json, os, re, sys, time, urllib.parse, urllib.request
from io import BytesIO

AQUI = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(AQUI)
RAIZ = os.path.dirname(APP)
FONTE = os.path.join(RAIZ, 'docs', 'revisao')
FOTOS = os.path.join(APP, 'conteudo-fonte', 'revisao')
DESTINO = os.path.join(APP, 'public', 'conteudo')
TIPOS = {'abertura', 'conceito', 'formula', 'grafico', 'exemplo', 'pegadinha', 'na_prova', 'fixe'}
# de onde vêm as fichas de cada matéria (as chaves de fonte "L1-F1-C02" são livro, frente e capítulo dessa obra)
OBRAS = {'fis': 'PV Física (Poliedro)'}
LARGURA_FOTO = 1280


class ErroRevisao(Exception):
    pass


def ler(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f)


def gravar(p, obj):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))


def nome_foto(arquivo):
    """'File:Apollo 15 F&H.jpg' -> 'apollo-15-f-h.webp' (estável: o mesmo arquivo do Commons dá sempre o mesmo nome)."""
    base = re.sub(r'^(File|Arquivo):', '', arquivo).rsplit('.', 1)[0]
    base = re.sub(r'[^a-z0-9]+', '-', base.lower()).strip('-')
    return base[:80] + '.webp'


def baixa_foto(arquivo, alvo):
    """Baixa do Commons (Special:FilePath) já reduzida e grava em WebP. Tenta as larguras padrão de miniatura do
    Commons, da maior para a menor: imagem original menor que a largura pedida vem sem redução, e esse caminho o
    Commons limita para robôs (erro 429)."""
    from PIL import Image
    nome = re.sub(r'^(File|Arquivo):', '', arquivo)
    erro = None
    for larg in (LARGURA_FOTO, 960, 800, 640, 500):
        time.sleep(3)  # sem pressa com o Commons (limite de pedidos)
        url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(nome.replace(' ', '_')) + f'?width={larg}'
        req = urllib.request.Request(url, headers={'User-Agent': 'AprendiceRevisao/1.0 (site de estudos; contato pelo repositório)'})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                dados = r.read()
            break
        except Exception as e:  # noqa: PERF203
            erro = e
    else:
        raise erro
    im = Image.open(BytesIO(dados))
    im = im.convert('RGB')
    if im.width > LARGURA_FOTO:
        im = im.resize((LARGURA_FOTO, round(im.height * LARGURA_FOTO / im.width)), Image.LANCZOS)
    os.makedirs(os.path.dirname(alvo), exist_ok=True)
    im.save(alvo, 'WEBP', quality=80, method=6)
    return im.size


def confere_tema(m, d, arq):
    erros = []
    for k in ('id', 'nome', 'slides'):
        if not d.get(k):
            erros.append(f'falta "{k}"')
    if erros:
        raise ErroRevisao(f'{arq}: ' + '; '.join(erros))
    if not re.fullmatch(r'[A-Z]\d{2}', d['id']):
        raise ErroRevisao(f'{arq}: id do tema "{d["id"]}" fora do padrão (ex.: F02)')
    for sub, lista in d['slides'].items():
        if not sub.startswith(d['id'] + '.'):
            erros.append(f'conteúdo {sub} não é do tema {d["id"]}')
        if not isinstance(lista, list) or not lista:
            erros.append(f'{sub}: sem slides')
            continue
        for i, s in enumerate(lista):
            if s.get('tipo') not in TIPOS:
                erros.append(f'{sub} #{i + 1}: tipo "{s.get("tipo")}" desconhecido')
            if not s.get('titulo'):
                erros.append(f'{sub} #{i + 1}: sem título')
            if s.get('tipo') == 'fixe':
                linhas = [x for x in (s.get('texto') or '').split('\n') if x.strip()]
                if len(linhas) != 3:
                    erros.append(f'{sub} #{i + 1}: o slide "fixe" precisa de 3 linhas (tem {len(linhas)})')
            for p in s.get('passos') or []:
                if not p.get('conta'):
                    erros.append(f'{sub} #{i + 1}: passo sem conta')
            foto = (s.get('visual') or {}).get('foto')
            if foto:
                for k in ('url', 'arquivo', 'autor', 'licenca'):
                    if not foto.get(k):
                        erros.append(f'{sub} #{i + 1}: foto sem "{k}" (crédito obrigatório)')
                if 'commons.wikimedia.org' not in foto.get('url', ''):
                    erros.append(f'{sub} #{i + 1}: foto fora do Wikimedia Commons')
    if erros:
        raise ErroRevisao(f'{arq}:\n  ' + '\n  '.join(erros))


def prepara_fotos(m, d, saida):
    """Copia (ou baixa uma vez) cada foto do tema e põe no slide o caminho servido pelo site."""
    n = 0
    for lista in d['slides'].values():
        for s in lista:
            foto = (s.get('visual') or {}).get('foto')
            if not foto:
                continue
            nome = nome_foto(foto['arquivo'])
            fonte = os.path.join(FOTOS, m, 'fotos', nome)
            if not os.path.exists(fonte):
                try:
                    tam = baixa_foto(foto['arquivo'], fonte)
                    print(f'  foto baixada do Commons: {nome} {tam}')
                except Exception as e:  # sem rede: o slide mostra o visual em roteiro e o crédito, sem a imagem
                    print(f'  AVISO: não consegui baixar {foto["arquivo"]}: {e}')
                    continue
            alvo = os.path.join(saida, 'fotos', nome)
            os.makedirs(os.path.dirname(alvo), exist_ok=True)
            with open(fonte, 'rb') as a, open(alvo, 'wb') as b:
                b.write(a.read())
            foto['img'] = 'revisao/fotos/' + nome
            n += 1
    return n


def alimenta_teoria(m, temas):
    """Teoria em cartões do tema: o resumo, as fórmulas, o erro e os cartões da revisão entram no materia.json."""
    p = os.path.join(DESTINO, m, 'materia.json')
    if not os.path.exists(p):
        return 0
    mat = ler(p)
    n = 0
    for mod in mat.get('modulos', []):
        d = temas.get(mod['id'])
        if not d:
            continue
        for k in ('resumo', 'erro'):
            if not mod.get(k) and d.get(k):
                mod[k] = d[k]
        if not mod.get('formulas') and d.get('formulas'):
            mod['formulas'] = list(d['formulas'])
        tem = {c.get('sub') for c in mod.get('cartoes', [])}
        novos = [c for c in d.get('cartoes', []) if c.get('sub') not in tem]
        if novos:
            mod['cartoes'] = list(mod.get('cartoes', [])) + novos
            n += len(novos)
    gravar(p, mat)
    return n


def converte(materias=None):
    rel = {}
    if not os.path.isdir(FONTE):
        return rel
    for m in sorted(os.listdir(FONTE)):
        pasta = os.path.join(FONTE, m)
        if not os.path.isdir(pasta) or (materias and m not in materias):
            continue
        arqs = sorted(f for f in os.listdir(pasta) if re.fullmatch(r'[A-Z]\d{2}\.json', f))
        if not arqs:
            continue
        saida = os.path.join(DESTINO, m, 'revisao')
        os.makedirs(saida, exist_ok=True)
        indice = {'materia': m, 'obra': OBRAS.get(m, ''), 'temas': {}}
        temas = {}
        fotos = 0
        for a in arqs:
            d = ler(os.path.join(pasta, a))
            confere_tema(m, d, f'docs/revisao/{m}/{a}')
            fotos += prepara_fotos(m, d, saida)
            d['obra'] = OBRAS.get(m, '')
            temas[d['id']] = d
            gravar(os.path.join(saida, d['id'] + '.json'), d)
            indice['temas'][d['id']] = {
                'nome': d['nome'],
                'subs': {sub: len(l) for sub, l in d['slides'].items()},
            }
        gravar(os.path.join(saida, 'indice.json'), indice)
        cartoes = alimenta_teoria(m, temas)
        rel[m] = {'temas': len(temas), 'slides': sum(sum(t['subs'].values()) for t in indice['temas'].values()),
                  'fotos': fotos, 'cartoes_teoria': cartoes}
    return rel


if __name__ == '__main__':
    try:
        print('revisão em slides', converte(sys.argv[1:] or None))
    except ErroRevisao as e:
        print('ERRO na revisão:', e)
        sys.exit(1)
