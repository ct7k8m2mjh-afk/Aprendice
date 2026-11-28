"""Provas do Google Drive do dono, 2º lote (12/11/2026): São Camilo 2025/1 e 2025/2 (Medicina, banca Vunesp) e
Famema 2022 (Prova II, banca FGV).

Os PDFs ficam em fontes/provas-manuais/<instituição>/<nome do arquivo no Drive>/arquivo.pdf (fora do git); a origem
de cada um (nome e id no Drive) e o que ficou fora (Famema Prova I dissertativa, gabaritos sem caderno, simulado de
cursinho) estão em docs/provas/ORIGEM-DRIVE-saocamilo-santacasa-unesp.md.

  python3 ferramentas/ingestao/provas_drive2.py [prova-id ...]   copia os PDFs para fabrica_saida/ingestao/<prova>/
  python3 ferramentas/ingestao/recorta.py <prova-id>              recorta (configuração abaixo, carregada por provas.py)

Só a Prova II (objetiva) entra; a Prova I (discursivas) e a redação ficam fora. Gabarito oficial da Vunesp
(versão 1, a mesma do caderno); anuladas ficam fora. Famema 2022 (FGV): Prova II do caderno único tipo 1 e gabarito
DEFINITIVO oficial da FGV (página conhecimento.fgv.br/concursos/vestibularfamema22), não o preliminar do Drive.
"""
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import provas  # noqa: F401  (carrega provas.py na ordem certa quando este arquivo roda sozinho)
import provas as _p
import provas_vunesp as _v

VUNESP = 'https://www.vunesp.com.br/'
DRIVE = 'Google Drive do dono'

# prova -> papel -> (pasta em fontes/provas-manuais, nome do arquivo no Drive, id no Drive[, url oficial, caminho do arquivo])
ARQUIVOS = {
    'saocamilo-2025-1': {
        'caderno': ('saocamilo/SAO-CAMILO-2025-1-semestre-Prova-II-prova',
                    'SÃO CAMILO 2025 - 1º semestre Prova II - prova.pdf', '1sCsFKH5wknQbDEJtTDxOOIZFLlmLQr_v'),
        'gabarito': ('saocamilo/SAO-CAMILO-2025-1-semestre-Prova-II-gabarito',
                     'SÃO CAMILO 2025 - 1º semestre Prova II - gabarito.pdf', '11chNdsBrt3th3z5bZse0jLA1ocw_NlN0'),
    },
    'saocamilo-2025-2': {
        'caderno': ('saocamilo/SAO-CAMILO-2025-2-semestre-Prova-II-prova',
                    'SÃO CAMILO 2025 - 2º semestre Prova II - prova.pdf', '1vdF4F7uUN0Kv6ydjR8ZkQVMVQWtlMrFW'),
        'gabarito': ('saocamilo/SAO-CAMILO-2025-2-semestre-Prova-II-gabarito',
                     'SÃO CAMILO 2025 - 2º semestre Prova II - gabarito.pdf', '1HMTeVhVqgMpoE0c_xOTzLuyMyPE2bT-d'),
    },
    # Famema 2022 (FGV): caderno tipo 1 do Drive (mesmo md5 do PDF oficial da FGV); o Drive só tem o gabarito PRELIMINAR,
    # mas o DEFINITIVO está publicado na página oficial da FGV (baixado em 12/11/2026; robots.txt permite /sites/default/files)
    'famema-2022': {
        'caderno': ('famema/FAMEMA-2022-tipo-1-prova', 'FAMEMA 2022 - tipo 1 - prova.pdf', '1Y9707yaexGQlRlp1B3C8mhVhCbwHzFSO',
                    'https://conhecimento.fgv.br/sites/default/files/concursos/famema2022_tipo1.pdf'),
        'gabarito': (None, None, None, 'https://conhecimento.fgv.br/sites/default/files/concursos/famema2022_gabarito_definitivo.pdf',
                     'fontes/cache-pdf/semgab/famema/famema2022_gabarito_definitivo.pdf'),
    },
}

NOTA = ' Caderno e gabarito oficiais da Vunesp ({cod}), em cópia guardada no Google Drive do dono. Anuladas ficam fora.'
PROVAS = {
    'saocamilo-2025-1': _v.base(
        'saocamilo', 'São Camilo', 2025, '1º semestre', 'São Camilo 2025/1', 40,
        nota='Centro Universitário São Camilo, Medicina, Processo Seletivo 1º semestre de 2025 (22/11/2024): Prova II '
             '(40 questões objetivas), versão 1. A Prova I (discursivas) e a redação ficam fora.' + NOTA.format(cod='CUSC2401')),
    'saocamilo-2025-2': _v.base(
        'saocamilo', 'São Camilo', 2025, '2º semestre', 'São Camilo 2025/2', 40,
        nota='Centro Universitário São Camilo, Medicina, Processo Seletivo 2º semestre de 2025 (08/06/2025): Prova II '
             '(40 questões objetivas), versão 1. A Prova I (discursivas) e a redação ficam fora.' + NOTA.format(cod='CUSC2402')),
}
for _k in PROVAS:
    # "As questões 34 e 35 referem-se ao..." abre o texto de apoio das questões indicadas
    PROVAS[_k]['suporte'] = PROVAS[_k]['suporte'] + [r'(?i)^as quest[õo]es (de )?\d+ (e|a) \d+ referem']
    # "QUESTÃO 16 / Leia o trecho ... para responder à questão." (2025/1): instrução logo abaixo do número é da própria questão
    PROVAS[_k]['suporte_nao_colado'] = 20
# questões: 2025/1 nas pp. 2–12 (p. 13 é a Classificação Periódica, 14–16 redação e rascunho);
# 2025/2 nas pp. 3–15 (p. 2 em branco, 16 é a redação, 18 a Classificação Periódica)
PROVAS['saocamilo-2025-1']['cadernos'] = [{'arquivo': 'caderno', 'paginas': (2, 12)}]
PROVAS['saocamilo-2025-2']['cadernos'] = [{'arquivo': 'caderno', 'paginas': (3, 15)}]


# ------------------------------------------------------------------------------------------- Famema 2022 (FGV)
def _famema22_gab(pasta):
    """Gabarito DEFINITIVO da FGV: bloco 'Medicina – Tipo 1' (igual ao de Enfermagem); '*' = anulada."""
    txt = _p.texto_pdf(pasta / 'gabarito.pdf')
    txt = txt[txt.index('Medicina – Tipo 1'):]
    txt = re.split(r'Medicina – Tipo 2', txt)[0]
    ls = [l.split() for l in txt.splitlines()[1:] if l.strip()]
    g = {}
    for a, b in zip(ls, ls[1:]):
        if a and all(x.isdigit() for x in a) and len(a) == len(b) and all(re.fullmatch(r'[A-E]|\*', x) for x in b):
            for n, v in zip(a, b):
                g[int(n)] = v if v != '*' else 'X'
    assert sorted(g) == list(range(1, 41)), sorted(g)
    return g


_FAMEMA22_AREAS = ((10, 'Língua Portuguesa'), (20, 'Matemática'), (25, 'Geografia'), (30, 'História'), (35, 'Inglês'),
                   (40, 'Física'))
_c = _p.fempar(2022, '', '05/12/2021')
_c.update({
    'catalogo': 'famema', 'escola': 'Famema', 'ano': '2022', 'fase': 'Vestibular 2022', 'titulo': 'Famema 2022',
    'banca': 'FGV', 'duracao_horas': 5, 'total': 40,
    'nota': 'Faculdade de Medicina de Marília, Vestibular 2022 (05/12/2021, banca FGV), Enfermagem e Medicina, caderno único '
            'Tipo 1 (branca): só a Prova II (40 questões objetivas A–E: Português 1–10, Matemática 11–20, Geografia 21–25, '
            'História 26–30, Inglês 31–35, Física 36–40). A Prova I (8 discursivas de Química e Biologia) e a Prova III '
            '(redação) ficam fora. Caderno do Google Drive do dono (idêntico ao PDF oficial da FGV); gabarito oficial '
            'DEFINITIVO da FGV (o preliminar do Drive só difere na questão 4, anulada no definitivo). Anulada fica fora.',
    # Prova II nas pp. 12–21 (pp. 3–11: Prova I discursiva e folhas de resposta; 22–23: Prova III, redação)
    'cadernos': [{'arquivo': 'caderno', 'paginas': (12, 21)}],
    # coluna esquerda até x=292: na p. 15 há um fio vertical do caderno em x≈297 (entrava na borda do print da 22)
    'colunas': lambda r: [(38, 292), (305, r.width - 30)], 'margem': 38, 'topo': 34, 'base': 42,
    'topo_pag': {12: 148},   # p. 12: título "Prova II" no alto (entrava no fim da questão 3, topo da coluna direita)
    'uma_coluna': (16,),   # questão 24: tabelas da população em largura total
    'secoes_rx': [(r'^L[íi]ngua Portuguesa$', 'Língua Portuguesa'), (r'^Matem[áa]tica$', 'Matemática'),
                  (r'^Geografia$', 'Geografia'), (r'^Hist[óo]ria$', 'História'), (r'^L[íi]ngua Inglesa$', 'Inglês'),
                  (r'^F[íi]sica$', 'Física')],
    'pular_secoes': (),
    'corte': [r'(?i)^Prova III$', r'(?i)^REDA[ÇC][ÃA]O$', r'(?i)^RASCUNHO'],
    'suporte': [r'(?i)^READ THE FOLLOWING TEXT'],
    'gabarito': _famema22_gab,
    'area': lambda n: next(a for lim, a in _FAMEMA22_AREAS if n <= lim),
})
PROVAS['famema-2022'] = _c


RAIZ = Path(__file__).resolve().parents[2]
FONTE = RAIZ / 'fontes' / 'provas-manuais'
ENTRADA = RAIZ / 'fabrica_saida' / 'ingestao'


def prepara(pid):
    import shutil
    pasta = ENTRADA / pid
    pasta.mkdir(parents=True, exist_ok=True)
    antes = {}
    if (pasta / 'manifesto.json').exists():   # o id das questões vem do sha256 do manifesto: não muda (princípio 7)
        antes = json.loads((pasta / 'manifesto.json').read_text()).get('arquivos', {})
    arqs = {}
    for papel, (pasta_fonte, nome, drive_id, *oficial) in ARQUIVOS[pid].items():
        if pasta_fonte:
            src = FONTE / pasta_fonte / 'arquivo.pdf'
            origem = f'{DRIVE}; arquivo {nome} (id {drive_id})'
            if oficial:
                origem += f'; idêntico (mesmo md5) ao PDF oficial {oficial[0]}'
        else:   # baixado do site oficial da banca
            src = RAIZ / oficial[1]
            origem = f'{oficial[0]} (site oficial, baixado em 12/11/2026)'
        if not src.exists():
            raise SystemExit(f'{pid}: falta {src} (Drive do dono, id {drive_id}; ou {oficial[:1]})')
        dst = pasta / f'{papel}.pdf'
        shutil.copyfile(src, dst)
        arqs[papel] = {
            'url': oficial[0] if oficial else VUNESP,
            'origem': origem,
            'bytes': dst.stat().st_size,
            'sha256': (antes.get(papel) or {}).get('sha256') or hashlib.sha256(dst.read_bytes()).hexdigest(),
            'sha256_arquivo': hashlib.sha256(dst.read_bytes()).hexdigest(),
            'copiado_em': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        }
    (pasta / 'manifesto.json').write_text(json.dumps({'prova': pid, 'arquivos': arqs}, ensure_ascii=False, indent=2) + '\n')
    return pasta


if __name__ == '__main__':
    for pid in (sys.argv[1:] or list(ARQUIVOS)):
        print(prepara(pid))
