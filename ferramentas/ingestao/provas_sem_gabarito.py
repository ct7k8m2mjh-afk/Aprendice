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


# ------------------------------------------------------------------------------------------------------------- IME
def _ime_pre(pasta):
    g = {int(n): v for n, v in re.findall(r'(?<![\d,.])(\d{1,2})\s+([A-E])\b', _p.texto_pdf(pasta / 'preliminar.pdf'))}
    assert sorted(g) == list(range(1, 41)), sorted(g)
    return g


def ime(pid, ano):
    nota = (f'Instituto Militar de Engenharia, Concurso de Admissão {ano - 1}/{ano} aos cursos de Formação e Graduação: prova '
            'objetiva da 1ª fase, 40 questões A–E (Matemática 1–15, Física 16–30, Química 31–40). A 2ª fase fica fora. No '
            'pacote, só o gabarito PRELIMINAR do IME; o definitivo foi publicado no site do IME, que não abre daqui (cadeia '
            'TLS incompleta), e as cópias achadas estão em servidor que proíbe robôs: anulações do definitivo não conferidas.')
    PROVAS[pid] = sem_gabarito(_p.PROVAS['ime-2023'], _ime_pre, nota, ano=str(ano),
                               fase=f'Concurso {ano - 1}/{ano} – 1ª fase (objetiva)', titulo=f'IME {ano - 1}/{ano}')


IME = 'https://www.ime.eb.mil.br/'
_m('ime-2024', IME, caderno='ime/provas-e-gabaritos-ime-2023-2024/caderno-provas-ime-2024.pdf',
   preliminar='ime/provas-e-gabaritos-ime-2023-2024/gabarito-preliminar-ime-2024.pdf')
_m('ime-2025', IME, caderno='ime/provas-e-gabaritos-ime-2024-2025/provas-gabaritos-vestibular-2025-ime/prova-vestibular-2025-ime.pdf',
   preliminar='ime/provas-e-gabaritos-ime-2024-2025/provas-gabaritos-vestibular-2025-ime/gabarito-preliminar-ime-2025.pdf')
ime('ime-2024', 2024)
ime('ime-2025', 2025)


# ------------------------------------------------------------------------------------------- UECE, 1ª fase (CEV-UECE)
# Os comunicados de resultado dos recursos (www.cev.uece.br) trazem o gabarito oficial DEFINITIVO de 2023.1, 2023.2,
# 2024.2, 2025.1 e 2026.1: essas entram normalmente, com gab. A 2025.2 só tem o preliminar + os pareceres (Comunicado
# 81/2025: 22, 55 e 82 anuladas, nenhuma letra alterada): entra com gab null e gab_preliminar.
CEV = 'https://www.cev.uece.br/'


def _uece_blocos(txt, n_total=85):
    """Blocos 'LÍNGUA INGLESA - GABARITO [DEFINITIVO] 1 [– DEFINITIVO]' (qualquer caixa) com linhas de números e de letras."""
    m = re.search(r'(?i)L[ÍI]NGUA INGLESA\s*[-–]\s*GABARITO\s+(?:DEFINITIVO\s+)?1\b', txt)
    assert m, 'sem bloco do inglês, gabarito 1'
    bloco = re.split(r'(?i)GABARITO', txt[m.end():])[0]
    ls = [l.split() for l in bloco.splitlines() if l.strip()]
    g = {}
    for a, b in zip(ls, ls[1:]):
        if a and all(x.isdigit() for x in a) and len(a) == len(b) and all(re.fullmatch(r'[A-D]|[Xx]|\*', x) for x in b):
            for n, v in zip(a, b):
                g[int(n)] = v if v in 'ABCD' else 'X'
    assert sorted(g) == list(range(1, n_total + 1)), sorted(g)
    return g


def _uece_tabela(txt):
    """Tabela 'Questão Disciplina Gab 1 Gab 2 Gab 3 Gab 4' (duas por linha); na língua (78–85) vale a Língua Inglesa."""
    g = {}
    for n, disc, v in re.findall(r'(?<!\d)(\d{1,2})\s+([A-ZÀ-Úa-zà-ú][A-Za-zÀ-ú ]+?)\s+([A-DX])\s+[A-DX]\s+[A-DX]\s+[A-DX]\b', txt):
        n = int(n)
        if n >= 78 and 'Inglesa' not in disc:
            continue
        g[n] = v
    assert sorted(g) == list(range(1, 86)), sorted(g)
    return g


def _uece_gab(arquivo, formato):
    def gab(pasta):
        txt = _p.texto_pdf(pasta / f'{arquivo}.pdf')
        return _uece_blocos(txt) if formato == 'blocos' else _uece_tabela(txt)
    return gab


def uece1(pid, ano, sem, data, comunicado=None, formato='blocos', **extra):
    cfg = dict(_p.PROVAS['uece-2024-1'])
    nota = (f'Universidade Estadual do Ceará, Vestibular {ano}.{sem}, 1ª fase (Prova de Conhecimentos Gerais aplicada em '
            f'{data}, caderno do gabarito 1), 85 questões A–D. Língua estrangeira: inglês. ')
    cfg.update({'ano': str(ano), 'fase': f'{ano}.{sem} – 1ª fase', 'titulo': f'UECE {ano}.{sem}',
                # 2025.2: "TEXTO II" (algarismo romano) também abre texto de apoio
                'suporte': cfg['suporte'] + [r'^TEXTO\s+\d+\s*$', r'(?i)^TEXTO\s+[IVX]+\s*$'], 'suporte_secao': True,
                'cita_textos': True})
    if comunicado:
        cfg.update({'gabarito': _uece_gab('gabarito', formato),
                    'nota': nota + f'Gabarito oficial definitivo (Comunicado {comunicado}-CEV/UECE, após recursos); anuladas ficam fora.'})
    else:
        cfg = sem_gabarito(cfg, _uece_gab('preliminar', formato), nota + extra.pop('nota_pre'), extra.pop('anuladas', ()))
    cfg.update(extra)
    PROVAS[pid] = cfg


_C = 'https://www.cev.uece.br/wp-content/uploads/'
_m('uece-2023-1', CEV, caderno=('url', _C + '2022/11/vtb20231f1g1.pdf', 'uece/vtb20231f1g1.pdf'),
   gabarito=('url', _C + '2022/11/comunicado2092022cev.pdf', 'uece/comunicado2092022cev.pdf'))
_m('uece-2023-2', CEV, caderno=('url', _C + '2023/04/vtb20232f1g1.pdf', 'uece/vtb20232f1g1.pdf'),
   gabarito=('url', _C + '2023/05/comunicado512023cev.pdf', 'uece/comunicado512023cev.pdf'))
_m('uece-2024-2', CEV, caderno=('url', _C + '2024/04/vtb2024f1gab1.pdf', 'uece/vtb2024f1gab1.pdf'),
   gabarito=('url', _C + '2024/05/Comunicado-49.2024-Resultado-Definitivo-dos-Recursos-Prova-1a-Fase-do-Vestibular-2024.2.pdf',
             'uece/Comunicado-49.2024-Resultado-Definitivo-dos-Recursos-Prova-1a-Fase-do-Vestibular-2024.2.pdf'))
_m('uece-2025-1', CEV, caderno='uece/provas-uece-1-fase-2025/1ª fase prova uece 2025 gabarito 1.pdf',
   gabarito=('url', _C + '2024/12/comunicado1532024cevuece.pdf', 'uece/comunicado1532024cevuece.pdf'))
_m('uece-2025-2', CEV, caderno=('url', _C + '2025/04/v20252f1g1.pdf', 'uece/v20252f1g1.pdf'),
   preliminar=('url', _C + '2025/04/v2025v2f1gabpre.pdf', 'uece/v2025v2f1gabpre.pdf'))
_m('uece-2026-1', CEV, caderno=('url', _C + '2025/10/vtb20261f1g1.pdf', 'uece/vtb20261f1g1.pdf'),
   gabarito=('url', _C + '2025/10/comunicado1902025cev.pdf', 'uece/comunicado1902025cev.pdf'))
uece1('uece-2023-1', 2023, 1, '06/11/2022', '209/2022', formato='tabela', topo=50, base=38)   # cabeçalho mais baixo: "09." em y≈56
uece1('uece-2023-2', 2023, 2, '30/04/2023', '51/2023')
uece1('uece-2024-2', 2024, 2, '28/04/2024', '49/2024')
uece1('uece-2025-1', 2025, 1, '17/11/2024', '153/2024')
uece1('uece-2026-1', 2026, 1, '12/10/2025', '190/2025')
uece1('uece-2025-2', 2025, 2, '27/04/2025', formato='tabela', anuladas=(22, 55, 82),
      nota_pre='Só o gabarito oficial PRELIMINAR (site da CEV) e os pareceres dos recursos (Comunicado 81/2025-CEV/UECE: '
               'questões 22, 55 e 82 anuladas, nenhuma letra alterada); o comunicado com o gabarito definitivo não foi '
               'localizado. A letra do preliminar vai em gab_preliminar.')


if __name__ == '__main__':
    if sys.argv[1:2] == ['prepara']:
        for pid in (sys.argv[2:] or list(MANUAIS)):
            print(prepara(pid))
