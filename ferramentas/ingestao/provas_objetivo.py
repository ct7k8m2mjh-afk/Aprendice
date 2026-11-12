"""Provas da Vunesp que faltavam no site, baixadas da página de resolução comentada do Curso Objetivo (12/11/2026).

O portal da Vunesp bloqueia acesso automático; o Curso Objetivo hospeda o caderno oficial (versão 1) e o gabarito oficial
da Vunesp de cada prova (curso-objetivo.br não tem robots.txt; User-Agent genérico; nada de login ou bloqueio contornado).
A lista de arquivos de cada página vem do serviço público que a própria página usa
(sistemas.objetivo.br/ResolucaoComentadaApi/templates/prova/<n>).

Conferência antes de integrar (a regra é a de docs/provas/origem-vunesp.md):
- gabarito: PDF oficial da Vunesp, "VERSÃO 1", com o mesmo código de concurso do caderno;
- caderno: é a versão 1 — a ordem das alternativas de cada questão é a mesma da resolução comentada do Objetivo, e as
  respostas da resolução batem com o gabarito oficial (onde a resolução discorda, vale o oficial; anulada fica fora).

  python3 ferramentas/ingestao/provas_objetivo.py [prova-id ...]   baixa os PDFs para fabrica_saida/ingestao/<prova>/
  python3 ferramentas/ingestao/recorta.py <prova-id>                recorta (configuração abaixo, carregada por provas.py)
"""
import hashlib
import json
import sys
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import provas  # noqa: F401  (carrega provas.py na ordem certa quando este arquivo roda sozinho)
import provas_vunesp as _v

OBJ = 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/'
CASA = 'cópia hospedada pelo Curso Objetivo (página de resolução comentada): o portal da Vunesp bloqueia acesso automático'

# prova -> papel -> (caminho depois de OBJ, páginas ou None)
ARQUIVOS = {}
PROVAS = {}


# ------------------------------------------------------------------ Santa Casa (FCMSCSP), 1º dia, Conhecimentos Gerais
for _a, _cod, _data in ((2024, 'FAVC2301', '21/10/2023'), (2026, 'FAVC2501', '18/10/2025'), (2027, 'FAVC2601', '26/09/2026')):
    _pid = f'santacasa-{_a}'
    ARQUIVOS[_pid] = {'caderno': (f'santacasa/{_a}/1dia/santacasa{_a}_1dia_prova.pdf', None),
                      'gabarito': (f'santacasa/{_a}/1dia/santacasa{_a}_gabarito.pdf', None)}
    PROVAS[_pid] = _v.base(
        'santacasa', 'Santa Casa', _a, 'Medicina', f'Santa Casa {_a}', 80, duracao=4,
        nota=f'Faculdade de Ciências Médicas da Santa Casa de São Paulo, Vestibular 1º semestre de {_a} (Medicina, {_data}): '
             'Prova de Conhecimentos Gerais (80 questões objetivas), versão 1. A prova discursiva (2º dia) fica fora. '
             f'Caderno e gabarito oficiais da Vunesp ({_cod}), em {CASA}. Anuladas ficam fora.')
    PROVAS[_pid]['suporte'] = PROVAS[_pid]['suporte'] + [r'(?i)^as quest[õo]es (de )?\d+ (e|a) \d+ referem']
    PROVAS[_pid]['selo_dx'] = 4   # selo redondo à esquerda de "QUESTÃO NN", como nas Santa Casa 2021–2025
# 2026 p. 10: tabela de largura total (texto de apoio das 26 e 27) até y≈420; abaixo, duas colunas
PROVAS['santacasa-2026']['faixas_pag'] = {('caderno', 10): [(0, 440, None), (440, 9999, 297.6)]}


def _anula(pid, ns):
    """Questões anuladas pela banca depois do gabarito publicado (o PDF do gabarito é o original): ficam fora."""
    gab = PROVAS[pid]['gabarito']
    PROVAS[pid]['gabarito'] = lambda pasta: {**gab(pasta), **{n: 'X' for n in ns}}


# ------------------------------------------------------------------ Famema, Prova II (40 objetivas; Prova I discursiva fora)
# (ano, código, data, páginas da Prova II no PDF do Objetivo sem a redação)
for _a, _cod, _data, _pag in ((2020, 'FMMA1903', '08/12/2019', (13, 23)), (2021, 'FMMA2001', '06/12/2020', (13, 25)),
                              (2024, 'FMMA2301', '26/11/2023', (25, 37)), (2025, 'FMMA2401', '24/11/2024', (13, 25)),
                              (2026, 'FMMA2501', '20/11/2025', (13, 25))):
    _pid = f'famema-{_a}'
    ARQUIVOS[_pid] = {'caderno': (f'famema/{_a}/famema{_a}_prova.pdf', _pag),
                      'gabarito': (f'famema/{_a}/famema{_a}_gabarito.pdf', None)}
    PROVAS[_pid] = _v.base(
        'famema', 'Famema', _a, 'Medicina e Enfermagem', f'Famema {_a}', 40,
        nota=f'Faculdade de Medicina de Marília, Vestibular {_a} ({_data}): Prova II (40 questões objetivas), versão 1. '
             'A Prova I (discursivas) e a redação ficam fora. '
             f'Caderno e gabarito oficiais da Vunesp ({_cod}), em {CASA}. Anuladas ficam fora.')
    PROVAS[_pid]['suporte'] = PROVAS[_pid]['suporte'] + [r'(?i)^as quest[õo]es (de )?\d+ (e|a) \d+ referem']
# 2024: questões 15 e 16 anuladas pela Vunesp (registrado na resolução comentada do Objetivo, "QUESTÃO ANULADA"; o
# gabarito publicado no PDF é o original, B e A)
_anula('famema-2024', (15, 16))


# Santa Casa 2020: a prova objetiva foi a do 2º dia (003. Prova de Conhecimentos Gerais, 27/10/2019)
ARQUIVOS['santacasa-2020'] = {'caderno': ('santacasa/2020/2dia/santacasa2020_2dia_prova.pdf', None),
                              'gabarito': ('santacasa/2020/2dia/santacasa2020_2dia_gabarito.pdf', None)}
PROVAS['santacasa-2020'] = _v.base(
    'santacasa', 'Santa Casa', 2020, 'Medicina', 'Santa Casa 2020', 80, duracao=4,
    nota='Faculdade de Ciências Médicas da Santa Casa de São Paulo, Vestibular 1º semestre de 2020 (Medicina, 27/10/2019): '
         'Prova de Conhecimentos Gerais (80 questões objetivas, 2º dia), versão 1. A prova discursiva fica fora. '
         f'Caderno e gabarito oficiais da Vunesp (FAVC1902), em {CASA}. Anuladas ficam fora: 12 e 73, conforme o gabarito '
         'oficial versão 3 (cópia no Google Drive do dono), que marca as duas como anuladas.')
PROVAS['santacasa-2020']['suporte'] = PROVAS['santacasa-2020']['suporte'] + [r'(?i)^as quest[õo]es (de )?\d+ (e|a) \d+ referem']
# o gabarito versão 1 é o publicado antes dos recursos; a versão 3 (Drive do dono, mesmo concurso, mesma numeração —
# as versões da Vunesp só trocam a ordem das alternativas) traz 12 e 73 como "N"; a resolução do Objetivo dá a 73 "sem resposta"
_anula('santacasa-2020', (12, 73))
PROVAS['santacasa-2020']['selo_dx'] = 4   # selo redondo à esquerda de "QUESTÃO NN"


# ------------------------------------------------------------------ FMJ (Jundiaí), Prova II objetiva (Prova I discursiva fora)
for _a, _cod, _data, _n in ((2024, 'FMJU2301', '15/10/2023', 60), (2025, 'FMJU2401', '22/09/2024', 40),
                            (2026, 'FMJU2501', '05/10/2025', 40)):
    _pid = f'fmj-{_a}'
    ARQUIVOS[_pid] = {'caderno': (f'fmj/{_a}/fmj{_a}_prova_II.pdf', None),
                      'gabarito': (f'fmj/{_a}/fmj{_a}_gabarito.pdf', None)}
    PROVAS[_pid] = _v.base(
        'fmj', 'FMJ', _a, 'Medicina', f'FMJ {_a}', _n,
        nota=f'Faculdade de Medicina de Jundiaí, Vestibular {_a} (Medicina, {_data}): Prova II ({_n} questões objetivas), '
             'versão 1. A Prova I (discursivas e redação) fica fora. '
             f'Caderno e gabarito oficiais da Vunesp ({_cod}), em {CASA}. Anuladas ficam fora.')
    PROVAS[_pid]['suporte'] = PROVAS[_pid]['suporte'] + [r'(?i)^as quest[õo]es (de )?\d+ (e|a) \d+ referem']


# ------------------------------------------------------------------ Einstein, Prova I objetiva (Prova II discursiva fora)
for _a, _cod, _data, _arq, _pag, _fase in (
        (2020, 'FEAE1902', '01/12/2019', 'alberteinstein2020_prova.pdf', (1, 20), 'Medicina e Enfermagem'),
        (2022, 'FEAE2103', '21/12/2021', 'alberteinstein2022_prova_I.pdf', None, 'Medicina, Enfermagem e Fisioterapia'),
        (2024, 'FEAE2303', 'out./2023', 'alberteinstein2024_prova_I.pdf', None, 'Medicina e demais cursos'),
        (2025, 'FEAE2405', 'out./2024', 'alberteinstein2025_prova_I.pdf', None, 'Medicina e demais cursos'),
        (2026, 'FEAE2502', 'out./2025', 'alberteinstein2026_prova_I.pdf', None, 'Medicina e demais cursos')):
    _pid = f'einstein-{_a}'
    ARQUIVOS[_pid] = {'caderno': (f'alberteinstein/{_a}/{_arq}', _pag),
                      'gabarito': (f'alberteinstein/{_a}/alberteinstein{_a}_gabarito.pdf', None)}
    PROVAS[_pid] = _v.base(
        'einstein', 'Einstein', _a, _fase, f'Einstein {_a}', 50,
        nota=f'Faculdade Israelita de Ciências da Saúde Albert Einstein, Vestibular {_a} ({_data}): Prova I (50 questões '
             'objetivas), versão 1. A Prova II (discursivas e redação) fica fora. '
             f'Caderno e gabarito oficiais da Vunesp ({_cod}), em {CASA}. Anuladas ficam fora.')
    PROVAS[_pid]['suporte'] = PROVAS[_pid]['suporte'] + [r'(?i)^as quest[õo]es (de )?\d+ (e|a) \d+ referem',
                                                         r'(?i)^answer questions\b']


RAIZ = Path(__file__).resolve().parents[2]
ENTRADA = RAIZ / 'fabrica_saida' / 'ingestao'
UA = 'Mozilla/5.0 (compatible; generic-client)'


def _baixa(url):
    for tentativa in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except Exception:   # noqa: BLE001
            if tentativa == 2:
                raise
            time.sleep(5)


def prepara(pid):
    import pymupdf
    pasta = ENTRADA / pid
    pasta.mkdir(parents=True, exist_ok=True)
    antes = {}
    if (pasta / 'manifesto.json').exists():   # o id das questões vem do sha256 do manifesto: não muda (princípio 7)
        antes = json.loads((pasta / 'manifesto.json').read_text()).get('arquivos', {})
    arqs = {}
    for papel, (caminho, paginas) in ARQUIVOS[pid].items():
        url = OBJ + caminho
        dst = pasta / f'{papel}.pdf'
        bruto = _baixa(url)
        if paginas:
            d = pymupdf.open(stream=bruto, filetype='pdf')
            novo = pymupdf.open()
            novo.insert_pdf(d, from_page=paginas[0] - 1, to_page=paginas[1] - 1)
            novo.save(dst)
        else:
            dst.write_bytes(bruto)
        arqs[papel] = {
            'url': url,
            **({'paginas': list(paginas)} if paginas else {}),
            'bytes': dst.stat().st_size,
            'sha256': (antes.get(papel) or {}).get('sha256') or hashlib.sha256(dst.read_bytes()).hexdigest(),
            'sha256_arquivo': hashlib.sha256(dst.read_bytes()).hexdigest(),
            'baixado_em': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        }
        time.sleep(1)
    (pasta / 'manifesto.json').write_text(json.dumps({'prova': pid, 'arquivos': arqs}, ensure_ascii=False, indent=2) + '\n')
    return pasta


if __name__ == '__main__':
    for pid in (sys.argv[1:] or list(ARQUIVOS)):
        print(prepara(pid))
