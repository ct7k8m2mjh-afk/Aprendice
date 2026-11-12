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
            _, url, local = rel[:3]
            src = CACHE / local
            origem = url + ' (site oficial, baixado em 11/11/2026' + (f'; {rel[3]}' if len(rel) > 3 else '') + ')'
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


# ------------------------------------------------------------------------------------------------- Fempar 2027 (FGV)
# Na rodada anterior só havia o gabarito preliminar; o definitivo (prova de 18/10/2026) já está publicado na página da
# FGV (conhecimento.fgv.br/processoseletivo/fempar27): a prova entra normalmente, com gab.
def _fempar27_gab(pasta):
    txt = _p.texto_pdf(pasta / 'gabarito.pdf')
    txt = txt[txt.index('PROVA TIPO 1 – LÍNGUA ESTRANGEIRA (INGLÊS)'):]
    txt = re.split(r'PROVA TIPO 1 – LÍNGUA ESTRANGEIRA \(ESPANHOL\)', txt)[0]
    ls = [l.split() for l in txt.splitlines()[1:] if l.strip()]
    g = {}
    for a, b in zip(ls, ls[1:]):
        if a and all(x.isdigit() for x in a) and len(a) == len(b) and all(re.fullmatch(r'[A-E]|\*', x) for x in b):
            for n, v in zip(a, b):
                g[int(n)] = v if v != '*' else 'X'
    assert sorted(g) == list(range(1, 81)), sorted(g)
    return g


_FGV = 'https://conhecimento.fgv.br/sites/default/files/concursos/'
_m('fempar-2027', 'https://conhecimento.fgv.br/processoseletivo/fempar27',
   caderno=('url', _FGV + 'fempar-medicina-cnm001-tipo-1.pdf', 'fempar/fempar-medicina-cnm001-tipo-1.pdf'),
   gabarito=('url', _FGV + 'fempar-publicacao-1.pdf', 'fempar/fempar-publicacao-1.pdf'))
PROVAS['fempar-2027'] = _p.fempar(2027, 'PROVA TIPO 1', '18/10/2026')
PROVAS['fempar-2027']['gabarito'] = _fempar27_gab
# "READ TEXT I AND ANSWER QUESTIONS 01 TO 05": numeração própria do bloco de língua (aqui 16–25); posição fixa da instrução
PROVAS['fempar-2027']['suporte'] = [r for r in PROVAS['fempar-2027']['suporte'] if 'Read' not in r]
PROVAS['fempar-2027']['suporte_forcado'] = {('caderno', 5): [(305, 0, (16, 20))], ('caderno', 6): [(156, 0, (21, 22)), (56, 1, (23, 25))]}


# ------------------------------------------------------------------------------------------- URCA PSU 2026.2/2027.1
# Provas de 31/10 e 01/11/2026: em 11/11/2026 só o gabarito PRELIMINAR está no site da CEV-URCA.
_UR = 'https://www.urca.br/cev/wp-content/uploads/sites/39/2026/11/'
_m('urca-2027-1', 'https://www.urca.br/cev/',
   **{'d1-caderno': ('url', _UR + 'PROVA-I-FIS-MAT-QUI-E-BIO.pdf', 'urca/PROVA-I-FIS-MAT-QUI-E-BIO.pdf'),
      'd2-caderno': ('url', _UR + 'PROVA-II-HIS-GEO-PORT-RED-E-ING.pdf', 'urca/PROVA-II-HIS-GEO-PORT-RED-E-ING.pdf'),
      'd1-preliminar': ('url', _UR + 'GABARITO-PRELIMINAR-1o-DIA.pdf', 'urca/GABARITO-PRELIMINAR-1o-DIA.pdf'),
      'd2-preliminar': ('url', _UR + 'GABARITO-PRELIMINAR-2o-DIA.pdf', 'urca/GABARITO-PRELIMINAR-2o-DIA.pdf')})


def _urca27_pre(pasta):
    g = _p.urca_gab([_p.texto_pdf(pasta / f'{d}-preliminar.pdf') for d in ('d1', 'd2')])
    assert sorted(g) == list(range(1, 121)), sorted(g)
    return g


PROVAS['urca-2027-1'] = sem_gabarito(
    _p.urca(2027, 1), _urca27_pre,
    'Universidade Regional do Cariri, Processo Seletivo Unificado 2026.2 (demais campi) / 2027.1, provas de 31/10 e '
    '01/11/2026: Prova I (Física, Matemática, Química, Biologia; questões 1–60) e Prova II (História, Geografia, Língua '
    'Portuguesa, Inglês; aqui 61–120), A–E. Redação fora. Só o gabarito PRELIMINAR da CEV-URCA (site oficial, 11/11/2026); '
    'a letra dele vai em gab_preliminar.',
    fase='PSU 2026.2/2027.1 (nov/2026)', titulo='URCA PSU 2027.1')
# 2027.1, História: os textos I e II vêm logo abaixo do enunciado ("à luz dos textos abaixo") e são da própria questão;
# só "Texto 1 – Questões de 46 a 49" (Português/Inglês) abre texto de apoio compartilhado
PROVAS['urca-2027-1']['suporte'] = [r'(?i)^Texto?\s+([IVX]+|\d+)\s*[-–:.]\s*Quest'] + PROVAS['urca-2027-1']['suporte'][1:]


# --------------------------------------------------------------------------------------------- UNIRG (Medicina)
_UG = 'https://www.unirg.edu.br/arquivos/documentos/Vestibular/'


class _ComoGabarito:
    """Pasta em que 'gabarito.pdf' aponta para 'preliminar.pdf' (reaproveita o leitor de gabarito da prova-base)."""
    def __init__(self, pasta):
        self.pasta = pasta

    def __truediv__(self, nome):
        return self.pasta / ('preliminar.pdf' if nome == 'gabarito.pdf' else nome)


def _pre_da_base(base_pid):
    return lambda pasta: _p.PROVAS[base_pid]['gabarito'](_ComoGabarito(pasta))


def _nota_unirg(ano, sem, campus, data, resto):
    return (f'Universidade de Gurupi (TO), Processo Seletivo {ano}/{sem} do curso de Medicina, campus {campus} (prova de '
            f'{data}), caderno tipo 1: 54 questões A–D, 6 por matéria. Língua estrangeira: inglês. Redação fora. ' + resto)


# Paraíso 2022/1: o pacote do Brasil Escola só trazia o preliminar; o DEFINITIVO está no site da UNIRG (entra com gab)
_m('unirg-2022-1-paraiso', 'https://www.unirg.edu.br/vestibular/paraiso',
   caderno=('url', _UG + '2022-1P/ProvaTipo01%20-%20Internet%20(1).pdf', 'unirg/p22-caderno.pdf'),
   gabarito=('url', _UG + '2022-1P/UNIRGPT20221%20%E2%80%93%20GabaritosDefinitivos.pdf', 'unirg/p22-def.pdf'))
_c = dict(_p.PROVAS['unirg-2022-1'])
_c.update({'fase': 'Medicina 2022/1 – Paraíso do Tocantins', 'titulo': 'UNIRG Medicina 2022/1 – Paraíso',
           'nota': _nota_unirg(2022, 1, 'Paraíso do Tocantins', '14/11/2021',
                               'Gabarito definitivo publicado pela Comissão Permanente de Processo Seletivo (08/12/2021); anulada fica fora.')})
PROVAS['unirg-2022-1-paraiso'] = _c
# Paraíso: texto de apoio da p. 2 em largura quase total (x≈48–422, com imagem à direita): faixas largas + duas colunas
PROVAS['unirg-2022-1-paraiso'].update({'colunas': 'faixas', 'faixas_modo': 'largas', 'divisa': 298})
PROVAS['unirg-2022-1-paraiso']['corte'] = PROVAS['unirg-2022-1-paraiso']['corte'] + [r'(?i)^RASCUNHO DE GABARITO']   # grade de rascunho na p. 15
PROVAS['unirg-2022-1-paraiso']['corte_forcado'] = {('caderno', 15): [(718, 1)]}   # a grade atravessa as duas colunas

# Gurupi 2023/1: o arquivo "Gabarito Definitivo" do site é o gabarito PRELIMINAR (25 e 37 já anuladas nele)
_m('unirg-2023-1', 'https://www.unirg.edu.br/vestibular/gurupi',
   caderno=('url', _UG + '2023-1G/CadernoProvaObjetivaReda%C3%A7%C3%A3o%20-%20Tipo%201%20(1).pdf', 'unirg/u23-caderno.pdf'),
   preliminar=('url', _UG + '2023-1G/Gurupi%20-%20Vestibular%20-%20Gabarito%20Definitivo.pdf', 'unirg/u23-gab.pdf'))
_c = {k: v for k, v in _p.PROVAS['unirg-2023-2'].items() if k != 'uma_coluna'}
PROVAS['unirg-2023-1'] = sem_gabarito(
    _c, _pre_da_base('unirg-2023-2'),
    _nota_unirg(2023, 1, 'Gurupi', '06/11/2022', 'O arquivo publicado como "gabarito oficial" traz o gabarito PRELIMINAR '
                '(25 e 37 anuladas nele); o definitivo não foi localizado. A letra do preliminar vai em gab_preliminar.'),
    fase='Medicina 2023/1', titulo='UNIRG Medicina 2023/1', ano='2023')
PROVAS['unirg-2023-1']['uma_coluna'] = (14, 15)   # mapas e questões 46–48 em largura total

# Gurupi 2027/1 (prova de 01/11/2026): só o gabarito preliminar no site
_m('unirg-2027-1', 'https://www.unirg.edu.br/vestibular/gurupi',
   caderno=('url', _UG + '2027-1/provas/GURUPI%20-%201.pdf', 'unirg/u27-caderno.pdf'),
   preliminar=('url', _UG + '2027-1/provas/GABARITO%20PRELIMINAR%20-%20GURUPI1.pdf', 'unirg/u27-pre.pdf'))
PROVAS['unirg-2027-1'] = sem_gabarito(
    _p.PROVAS['unirg-2026-2'], _pre_da_base('unirg-2026-2'),
    _nota_unirg(2027, 1, 'Gurupi', '01/11/2026', 'Só o gabarito PRELIMINAR (site da UNIRG, 11/11/2026); a letra dele vai em '
                'gab_preliminar.'),
    fase='Medicina 2027/1', titulo='UNIRG Medicina 2027/1', ano='2027')


# ---------------------------------------------------------------------------------------------- Unespar 2025
# O arquivo publicado como "gabarito-provisorio-2025.pdf" é o EDITAL N. 045/2024 – CCCV, "Gabarito oficial da Prova
# Objetiva" (com a anulada marcada), o mesmo tipo de documento usado na Unespar 2024 (Edital 48): entra normalmente.
_UP = 'https://vestibular.unespar.edu.br/vestibulares-anteriores/vestibular-2024-2025/vestibular-2025/outros-arquivos/provas-e-gabarito/'
_m('unespar-2025', 'https://vestibular.unespar.edu.br/vestibulares-anteriores/vestibular-2024-2025/vestibular-2025',
   caderno=('url', _UP + 'caderno-de-provas-grupo-i-redacao-e-objetiva-de-multipla-escolha.pdf',
            'unespar/caderno-de-provas-grupo-i-redacao-e-objetiva-de-multipla-escolha.pdf'),
   gabarito=('url', _UP + 'gabarito-provisorio-2025.pdf', 'unespar/gabarito-provisorio-2025.pdf'))


def _unespar25_gab(pasta):
    return _p.pares(_p.texto_pdf(pasta / 'gabarito.pdf').replace('anulada', 'ANULADA'))


PROVAS['unespar-2025'] = _p.unespar(2025)
PROVAS['unespar-2025'].update({'gabarito': _unespar25_gab, 'total_de': lambda pasta: max(_unespar25_gab(pasta)),
                               'nota': PROVAS['unespar-2025']['nota'].replace(
                                   'Gabarito oficial publicado em edital após os recursos',
                                   'Gabarito oficial (Edital 045/2024-CCCV, publicado com o nome de arquivo "gabarito-provisorio-2025")')})


# ------------------------------------------------------------------------------------------------- Acafe (Medicina)
# Verão 2022 (14/11/2021): os arquivos "gabarito oficial" da Acafe trazem o gabarito
# PRELIMINAR; o definitivo não foi localizado. 15–21: espanhol e depois inglês (vale o inglês).
def _acafe_pre(pasta):
    ocorr = {}
    txt = _p.texto_pdf(pasta / 'preliminar.pdf')
    for n, v in re.findall(r'(?<![\d,.])(\d{1,2})\s+([A-E]\b|\*|X\b|ANULADA|Anulada)', txt):
        ocorr.setdefault(int(n), []).append(v if len(v) == 1 and v in 'ABCDE' else 'X')
    g = {n: (l[1] if len(l) > 1 and 15 <= n <= 21 else l[0]) for n, l in ocorr.items()}
    assert sorted(g) == list(range(1, 64)), sorted(g)
    return g


_AC = 'https://storage.acafe.org.br/concurso/vestibular/'
# Verão 2020: fica fora — o único caderno publicado é a prova comentada, com a justificativa da banca (e a letra certa)
# colada ao fim de cada questão, sem marca de fim de enunciado que o recorte reconheça (anotado em faltantes-por-ano.md).
_m('acafe-2022-verao', 'https://www.acafe.org.br/',
   caderno=('url', _AC + '2022/1/05%20-%20Provas/5.3%20-%20Prova%20Medicina%2022_1.pdf', 'acafe/acafe-2022-verao-caderno.pdf'),
   preliminar=('url', _AC + '2022/1/05%20-%20Provas/5.1%20-%20Gabarito%20oficial%2022_1.pdf', 'acafe/acafe-2022-verao-preliminar.pdf'))
PROVAS['acafe-2022-verao'] = sem_gabarito(
    _p.acafe_antiga(2022, 1), _acafe_pre,
    'Vestibular de Medicina Acafe, Verão 2022 (prova de 14/11/2021). Língua estrangeira: inglês. Print da prova oficial. O '
    'arquivo "Gabarito oficial 22_1" da Acafe é o gabarito PRELIMINAR (31 anulada nele); a letra dele vai em gab_preliminar.')
PROVAS['acafe-2022-verao']['suporte_forcado'] = {('caderno', 16): [(162, 0, (18, 21))]}   # "Text 3 ... The Hippocratic Oath" (p. 16): texto das 18–21


# ------------------------------------------------------------------------------------------- UEMG 2022 (Instituto AOCP)
# O gabarito do pacote saiu dois dias depois da prova (06/03/2022), antes do prazo de recursos (08 e 09/03): é o
# preliminar; o definitivo não foi localizado (o site da UEMG recusa acesso automático).
_m('uemg-2022', UEMG := 'https://vestibular.uemg.br/',
   caderno='uemg/prova-e-gabarito-uemg-2022/provas-uemg-2022.pdf', preliminar='uemg/prova-e-gabarito-uemg-2022/gabarito-uemg-2022.pdf')


def _uemg22_pre(pasta):
    g = _gab_grade(_p.texto_pdf(pasta / 'preliminar.pdf'), 'ABCD')   # inglês antes do espanhol: vale a 1ª
    assert sorted(g) == list(range(1, 49)), sorted(g)
    return g


PROVAS['uemg-2022'] = sem_gabarito({
    'catalogo': 'uemg', 'escola': 'UEMG', 'ano': '2022', 'fase': 'Vestibular 2022', 'titulo': 'UEMG 2022', 'banca': 'Instituto AOCP',
    'duracao_horas': 4, 'total': 48, 'alternativas': 4,
    'cadernos': [{'arquivo': 'caderno', 'paginas': (3, 23)}],   # p. 24 em diante: instruções e rascunho da redação
    'colunas': lambda r: [(40, 300), (300, r.width - 30)], 'margem': 40, 'topo': 50, 'base': 50,
    'ancora': r'^(\d{1,2})\s*$', 'ancora_dx': 14, 'sequencial': True, 'ancora_isolada': True,
    'secoes_rx': [(r'(?i)^L[íi]ngua Estrangeira\s*[-–]\s*Ingl[êe]s', 'Inglês'), (r'(?i)^L[íi]ngua Estrangeira\s*[-–]\s*Espanhol', 'Outra língua'),
                  (r'^F[íi]sica\s*$', 'Conhecimentos gerais')],   # fecha o espanhol (p. 11)
    # títulos de matéria no alto da coluna (y≈56): corte fixo, porque a palavra "História" solta numa linha justificada
    # do texto da 41 (p. 21) seria lida como título
    'corte_forcado': {('caderno', 11): [(50, 0)], ('caderno', 13): [(50, 1)], ('caderno', 15): [(50, 0)],
                      ('caderno', 17): [(50, 0)], ('caderno', 19): [(50, 1)], ('caderno', 22): [(50, 1)]},
    'pular_secoes': ('Outra língua',), 'pular_antes_sequencia': True,
    'corte': [r'(?i)^REDA[ÇC][ÃA]O\s*$', r'(?i)^RASCUNHO', r'(?i)^PROPOSTA DE REDA'],
    # textos I e II (p. 3) valem para 1–4; o texto do inglês (sem título, logo abaixo da seção, p. 6–7) para 7–12;
    # as questões 5 e 6 trazem o texto logo abaixo do enunciado
    'suporte': [], 'suporte_forcado': {('caderno', 3): [(80, 0, (1, 4))], ('caderno', 6): [(76, 1, (7, 12))]},
    'area': lambda n: 'Conhecimentos gerais', 'area_da_materia': True,
}, _uemg22_pre,
    'Universidade do Estado de Minas Gerais, Vestibular 2022 (Instituto AOCP, prova de 06/03/2022): 48 questões A–D '
    '(Língua Portuguesa e Literatura, língua estrangeira, Física, Química, Biologia, Geografia, História e Matemática). '
    'Língua estrangeira: inglês (7 a 12). Redação fora. O gabarito do pacote saiu antes dos recursos (preliminar); a letra '
    'dele vai em gab_preliminar.')


# ---------------------------------------------------------------------------------------- EMESCAM Medicina 2022/1
# Pacote do Brasil Escola: prova A + quadro de gabaritos A–D gerado em 07/10/2021 (dias depois da prova, sem marca de
# definitivo nem de anuladas). O site da EMESCAM/Fundep fica atrás de desafio Cloudflare (não contornado): tratado como
# preliminar.
_m('emescam-2022-1', 'https://emescam.br/',
   caderno='emescam/provas-e-gabaritos-emescam-medicina-2022-1/EMESCAM - objetiva - 2022_PROVA A.pdf',
   preliminar='emescam/provas-e-gabaritos-emescam-medicina-2022-1/GABARITOS - EMESCAM 2.2021.pdf')


def _emescam_pre(pasta):
    g = {int(n): v for n, v in re.findall(r'(?m)^\s*(\d{1,2})\s+([A-D])\s+[A-D]\s+[A-D]\s+[A-D]\s*$', _p.texto_pdf(pasta / 'preliminar.pdf'))}
    assert sorted(g) == list(range(1, 61)), sorted(g)
    return g


PROVAS['emescam-2022-1'] = sem_gabarito({
    'catalogo': 'emescam', 'escola': 'EMESCAM', 'ano': '2022', 'fase': 'Medicina 2022/1', 'titulo': 'EMESCAM Medicina 2022/1',
    'banca': 'EMESCAM', 'duracao_horas': 4.5, 'total': 60, 'alternativas': 4,
    'cadernos': [{'arquivo': 'caderno', 'paginas': (3, 999)}],
    'colunas': 'faixas', 'margem': 30, 'topo': 45, 'base': 50,   # duas colunas; margens alternadas (x≈43/71 e 300/328)
    'ancora': r'^QUEST[ÃA]O\s+(\d{1,2})\s*$', 'ancora_dx': 45, 'sequencial': True,
    'corte': [r'(?i)^FOLHA DE RESPOSTAS', r'(?i)^RASCUNHO',
              r'^(L[ÍI]NGUA PORTUGUESA|L[ÍI]NGUA INGLESA|MATEM[ÁA]TICA|F[ÍI]SICA|QU[ÍI]MICA|BIOLOGIA|HIST[ÓO]RIA|GEOGRAFIA|ATUALIDADES)\s*$'],
    'suporte': [r'(?i)^INSTRU[ÇC][ÃA]O:', r'(?i)^INSTRUCTION:'],
    'area': lambda n: 'Conhecimentos gerais',
    'faixas_modo': 'largas', 'divisa': 297,   # questões 54–56 em largura total (com figura)
}, _emescam_pre,
    'Escola Superior de Ciências da Santa Casa de Misericórdia de Vitória, Processo Seletivo de Medicina 2022/1 (outubro de '
    '2021), prova A: 60 questões A–D. Redação e prova dissertativa fora. O quadro de gabaritos do pacote não diz se é o '
    'definitivo (gerado dias depois da prova, sem anuladas); tratado como preliminar: a letra dele vai em gab_preliminar.')


if __name__ == '__main__':
    if sys.argv[1:2] == ['prepara']:
        for pid in (sys.argv[2:] or list(MANUAIS)):
            print(prepara(pid))
