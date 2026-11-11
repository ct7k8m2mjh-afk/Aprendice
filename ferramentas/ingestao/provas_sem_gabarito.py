"""Provas de 2020–2026 que tinham ficado fora só por falta de gabarito publicado ou definitivo (princípio 2 novo, dono,
11/11/2026): a questão entra com `gab: None` e, se houver, `gab_preliminar` (letra do gabarito preliminar/provisório da
banca ou de resolução publicada reconhecida). Fica fora do ar até ganhar o gabarito do Aprendice (dois especialistas às
cegas, na mesma letra, e igual à do preliminar). Anulada (no preliminar ou em comunicado) continua fora ('X').

Cada prova reaproveita a configuração de recorte de uma prova já integrada da mesma banca e troca só o gabarito:
  'gabarito'              -> definitivo oficial, quando existir (aqui, nenhum: {} )
  'sem_gabarito_oficial'  -> True (recorta.py aceita gab None)
  'gabarito_preliminar'   -> letras do preliminar; 'X' = anulada no preliminar ou em comunicado

Uso: python3 ferramentas/ingestao/provas_sem_gabarito.py prepara [<prova-id> ...]   (copia os PDFs para fabrica_saida/ingestao)
O que entrou, o que ficou fora e por quê: docs/provas/faltantes-por-ano.md (seção "Provas sem gabarito definitivo").
"""
import hashlib
import json
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

import provas as _p   # módulo parcialmente carregado: as provas anteriores (e os grupos A, B e C) já existem

RAIZ = Path(__file__).resolve().parents[2]
FONTE = RAIZ / 'fontes' / 'provas-manuais'
CACHE = RAIZ / 'fontes' / 'cache-pdf' / 'semgab'   # arquivos baixados de sites oficiais nesta rodada (fora do git)
ENTRADA = RAIZ / 'fabrica_saida' / 'ingestao'
MANIFESTO = json.loads((FONTE / 'manifesto.json').read_text())

MANUAIS = {}
PROVAS = {}

SEM_GAB = (' Gabarito definitivo/oficial não publicado ou não localizado; a questão entra com o gabarito do Aprendice '
           '(dois especialistas, às cegas, na mesma letra e igual à do preliminar) e fica fora do ar até lá.')


def _m(pid, oficial, **arquivos):
    """arquivos: papel -> caminho em fontes/provas-manuais/ (pacote do Brasil Escola, link do dono) ou
    ('url', <endereço oficial>, <arquivo em fontes/cache-pdf/semgab>)."""
    MANUAIS[pid] = {'oficial': oficial, 'arquivos': arquivos}


def _registro(rel):
    for k, v in MANIFESTO.items():
        if v.get('pasta') and rel.startswith(v['pasta'] + '/'):
            return v
    raise SystemExit(f'sem registro no manifesto para {rel}')


def prepara(pid):
    m = MANUAIS[pid]
    pasta = ENTRADA / pid
    pasta.mkdir(parents=True, exist_ok=True)
    arqs = {}
    for papel, rel in m['arquivos'].items():
        if isinstance(rel, tuple):
            _, url, local = rel
            src = CACHE / local
            origem = url + ' (site oficial, baixado em 11/11/2026)'
        else:
            src = FONTE / rel
            reg = _registro(rel)
            url = m['oficial']
            origem = f"{reg['url']} (Brasil Escola, \"{reg['titulo']}\", página {reg['origem']}; arquivo {src.name})"
        if not src.exists():
            raise SystemExit(f'{pid}: falta {src}')
        dst = pasta / f'{papel}.pdf'
        shutil.copyfile(src, dst)
        arqs[papel] = {'url': url, 'origem': origem, 'bytes': dst.stat().st_size,
                       'sha256': hashlib.sha256(dst.read_bytes()).hexdigest(),
                       'copiado_em': datetime.now(timezone.utc).isoformat(timespec='seconds')}
    (pasta / 'manifesto.json').write_text(json.dumps({'prova': pid, 'arquivos': arqs}, ensure_ascii=False, indent=2) + '\n')
    return pasta


def sem_gabarito(base, pre, nota, anuladas=(), **extra):
    """Copia a configuração `base` (dict) e troca o gabarito: definitivo vazio, preliminar = pre(pasta)."""
    cfg = dict(base)

    def preliminar(pasta):
        g = pre(pasta)
        for n in anuladas:
            g[n] = 'X'
        return g
    cfg.update({'gabarito': None, 'sem_gabarito_oficial': True, 'gabarito_preliminar': preliminar, 'nota': nota + SEM_GAB})
    cfg.update(extra)
    return cfg


# ------------------------------------------------------------------------------------------------------------- UFT
from provas_grupo_b import _gab_grade  # noqa: E402

UFT = 'https://www.uft.edu.br/concursos-e-selecoes/ingresso-na-graduacao/vestibular-1'


def _uft_pre(pasta):
    """Gabarito provisório da Copese: mesma grade do definitivo (manhã 1–32, inglês antes do espanhol; tarde aqui +32)."""
    txt = _p.texto_pdf(pasta / 'preliminar.pdf')
    m, t = re.split(r'PROVA\s+TARDE', txt)
    g = _gab_grade(m)
    g.update({n + 32: v for n, v in _gab_grade(t).items()})
    assert sorted(g) == list(range(1, 77)), sorted(g)
    return g


def uft(pid, ano, sem, data, anuladas=(), extra_nota=''):
    base = _p.PROVAS['uft-2024-1']
    nota = (f'Universidade Federal do Tocantins (com a UFNT), Vestibular {ano}.{sem} (Copese), provas de {data}: manhã '
            '(Linguagens, língua estrangeira e Matemática, 32 questões) e tarde (Ciências Humanas e da Natureza, 44 questões, '
            'aqui 33–76), A–D. Língua estrangeira: inglês. Redação fora. Só o gabarito PROVISÓRIO da Copese foi achado '
            '(pacote do Brasil Escola); a letra dele vai em gab_preliminar.' + extra_nota)
    PROVAS[pid] = sem_gabarito(base, _uft_pre, nota, anuladas, ano=str(ano), fase=f'Vestibular {ano}/{sem}',
                               titulo=f'UFT {ano}/{sem}')
    # 2024/2: títulos de língua sem "PROVA DE" ("ESPANHOL" antes de "INGLÊS"): o espanhol é pulado
    PROVAS[pid]['secoes_rx'] = [(r'^ESPANHOL$', 'Espanhol'), (r'^INGL[ÊE]S$', 'Inglês')] + base['secoes_rx']


_UFT = 'uft/provas-e-gabaritos-uft-'
_m('uft-2023-2', UFT, manha=_UFT + '2023-2/provas-uft-2023-2-manha.pdf', tarde=_UFT + '2023-2/provas-uft-2023-2-tarde.pdf',
   preliminar=_UFT + '2023-2/uft-2023-2-gabarito-preliminar.pdf')
_m('uft-2024-2', UFT, manha=_UFT + '2024-2/uft-2024-2-vestibular-manha.pdf', tarde=_UFT + '2024-2/uft-2024-2-vestibular-tarde.pdf',
   preliminar=_UFT + '2024-2/gabarito-preliminar-uft-2024-2-vestibular.pdf')
uft('uft-2023-2', 2023, 2, '30/04/2023')
uft('uft-2024-2', 2024, 2, '05/05/2024', anuladas=(71, 72),
    extra_nota=' O gabarito definitivo (03/06/2024) anulou as questões 39 e 40 da tarde (aqui 71 e 72), segundo a notícia '
               'do Estratégia Vestibulares (vestibulares.estrategia.com, "Vestibular UFT 2024/2: confira o gabarito '
               'definitivo"); o PDF do definitivo não pôde ser baixado (o servidor de arquivos proíbe robôs).')


# ------------------------------------------------------------------------------------------------------------ UFRR
def _ufrr_pre(pasta):
    """Anexo I do edital do gabarito preliminar: linhas 'Questão'/'Gabarito' por disciplina; vale o inglês."""
    txt = _p.texto_pdf(pasta / 'preliminar.pdf')
    ini = re.search(r'GABARITO PRELIMINAR DA PROVA INTEGRAL', txt)
    assert ini, 'sem gabarito preliminar da PI'
    bloco = re.split(r'ANEXO', txt[ini.end():])[0]
    g, disc = {}, ''
    ls = bloco.splitlines()
    for a, b in zip(ls, ls[1:]):
        if a.strip().startswith('Disciplina'):
            disc = a
        if a.strip().startswith('Questão') and b.strip().startswith('Gabarito'):
            if re.search(r'ESPANHOL|FRANC', disc):
                continue
            ns = [int(x) for x in a.split()[1:]]
            vs = re.findall(r'(?<!\w)(?:[A-E]|N\*?)(?!\w)', b.split('Gabarito', 1)[1])
            assert len(ns) == len(vs), (a, b)
            for n, v in zip(ns, vs):
                g[n] = v if v in 'ABCDE' else 'X'
    assert sorted(g) == list(range(1, 73)), sorted(g)
    return g


def ufrr(pid, ano, edital_pre, edital_of):
    nota = (f'Universidade Federal de Roraima, Vestibular {ano} (Comissão Permanente de Vestibular): Prova Integral (a '
            'mesma da etapa 3 do seriado), 72 questões A–E de Português, Matemática, Biologia, Física, Geografia, História, '
            'Química e língua estrangeira (inglês). Redação fora. No pacote, só o gabarito PRELIMINAR (Edital '
            f'{edital_pre}-CPV); o gabarito oficial após recursos{" (Edital " + edital_of + "-CPV)" if edital_of else ""} '
            'foi publicado em editais.ufrr.br, que não respondeu daqui: anulações do oficial não conferidas.')
    PROVAS[pid] = sem_gabarito(_p.PROVAS['ufrr-2023'], _ufrr_pre, nota, ano=str(ano),
                               fase=f'Vestibular {ano} – Prova Integral', titulo=f'UFRR {ano}')


UFRR = 'https://editais.ufrr.br/'
_R = 'ufrr/provas-e-gabaritos-ufrr-'
_m('ufrr-2024', UFRR, caderno=_R + '2024/provas-ufrr-2024/CADERNOS DE PROVA Vestibular 2024 - E3-PI.pdf',
   preliminar=_R + '2024/gabarito-ufrr-2024.pdf')
_m('ufrr-2025', UFRR, caderno=_R + '2025/provas-e-gabaritos-ufrr-2025/caderno-de-prova-2025-e3-ufrr.pdf',
   preliminar=_R + '2025/provas-e-gabaritos-ufrr-2025/gabarito-preliminar-ufrr-2025.pdf')
_m('ufrr-2026', UFRR, caderno=_R + '2026/provas-gabaritos-ufrr-2026/prova-ufrr-2026-pi.pdf',
   preliminar=_R + '2026/provas-gabaritos-ufrr-2026/gabaritos-preliminar-ufrr-2026.pdf')
ufrr('ufrr-2024', 2024, 'Nº 89/23', '')
ufrr('ufrr-2025', 2025, 'Nº 96/24', 'Nº 97/24')
ufrr('ufrr-2026', 2026, 'Nº 89/25', 'Nº 93/25')


if __name__ == '__main__':
    if sys.argv[1:2] == ['prepara']:
        for pid in (sys.argv[2:] or list(MANUAIS)):
            print(prepara(pid))
