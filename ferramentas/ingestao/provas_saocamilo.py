"""São Camilo (Medicina, banca Vunesp): provas que o dono pôs no Google Drive em 11/11/2026 (pasta "SAO CAMILO").

Os PDFs ficam em fontes/provas-manuais/saocamilo/<nome do arquivo no Drive>/arquivo.pdf (fora do git); a origem de
cada um (nome e id no Drive) está em docs/provas/ORIGEM-DRIVE-saocamilo-santacasa-unesp.md.

  python3 ferramentas/ingestao/provas_saocamilo.py [prova-id ...]   copia os PDFs para fabrica_saida/ingestao/<prova>/
  python3 ferramentas/ingestao/recorta.py <prova-id>                 recorta (configuração abaixo, carregada por provas.py)

Só a Prova II (objetiva) entra; a Prova I (discursivas) e a redação ficam fora. Gabarito oficial da Vunesp
(versão 1, a mesma do caderno); anuladas ficam fora.
"""
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import provas  # noqa: F401  (carrega provas.py na ordem certa quando este arquivo roda sozinho)
import provas_vunesp as _v

VUNESP = 'https://www.vunesp.com.br/'
DRIVE = 'Google Drive do dono, pasta "SAO CAMILO" (id 1rbhYsmypdOrgpGG35_t02JCZbc2YoWHe)'

# prova -> papel -> (pasta em fontes/provas-manuais/saocamilo, id no Drive, páginas ou None)
ARQUIVOS = {
    'saocamilo-2020-1': {
        'caderno': ('642504143-5dbb3c560bd57-pdf', '1HGgwSHQPaxGvUxjt_YwW-C_i-oo9m3jj', (29, 44)),
        'gabarito': ('642504143-5dbb3c560bd57-pdf', '1HGgwSHQPaxGvUxjt_YwW-C_i-oo9m3jj', (45, 45)),
    },
    'saocamilo-2023-1': {
        'caderno': ('826958283-SAO-CAMILO-2023-V1-P2', '1LkJYV_Z0ClRQHJtHcVpDzBvPsixrvRRI', None),
        'gabarito': ('826958772-SAO-CAMILO-2023-V1-P2-Gabarito', '18pGeaeg2GT1jyVCOXa_s8RjezUNDMYgl', None),
    },
    'saocamilo-2023-2': {
        'caderno': ('652950293-prova-sao-camilo-med-2023', '18a_tZXtLLgaQ6P-iXRf2dFQCUs6RN_YZ', None),
        'gabarito': ('652950615-gabarito-prova-sao-camilo-2023', '1rgWE6fTQZ3NtScWFphCgIvZ4lSuHNxok', None),
    },
}

NOTA = ' Caderno e gabarito oficiais da Vunesp ({cod}), em cópia guardada no Google Drive do dono. Anuladas ficam fora.'
PROVAS = {
    'saocamilo-2020-1': _v.base(
        'saocamilo', 'São Camilo', 2020, '1º semestre', 'São Camilo 2020/1', 50,
        nota='Centro Universitário São Camilo, Medicina, Processo Seletivo 1º semestre de 2020 (30/10/2019): Prova II '
             '(50 questões objetivas), versão 1. A Prova I (discursivas) e a redação ficam fora.' + NOTA.format(cod='CUSC1804')),
    'saocamilo-2023-1': _v.base(
        'saocamilo', 'São Camilo', 2023, '1º semestre', 'São Camilo 2023/1', 40,
        nota='Centro Universitário São Camilo, Medicina, Processo Seletivo 1º semestre de 2023 (07/11/2022): Prova II '
             '(40 questões objetivas), versão 1. A Prova I (discursivas) e a redação ficam fora.' + NOTA.format(cod='CUSC2104')),
    'saocamilo-2023-2': _v.base(
        'saocamilo', 'São Camilo', 2023, '2º semestre', 'São Camilo 2023/2', 40,
        nota='Centro Universitário São Camilo, Medicina, Processo Seletivo 2º semestre de 2023 (11/06/2023): Prova II '
             '(40 questões objetivas), versão 1. A Prova I (discursivas) e a redação ficam fora.' + NOTA.format(cod='CUSC2201')),
}
for _k in PROVAS:
    # "As questões 34 e 35 referem-se ao..." abre o texto de apoio das questões indicadas
    PROVAS[_k]['suporte'] = PROVAS[_k]['suporte'] + [r'(?i)^as quest[õo]es (de )?\d+ (e|a) \d+ referem']
for _k in ('saocamilo-2023-1', 'saocamilo-2023-2'):
    PROVAS[_k]['selo_dx'] = 4   # selo redondo à esquerda de "QUESTÃO NN" (Vunesp 2021–2023), como em saocamilo-2022-2
# a Classificação Periódica vem logo depois da última questão (2023/1: p. 17) ou depois da redação (2023/2: p. 16 é a
# redação); a detecção automática só olha as 3 últimas páginas: as questões ficam nas pp. 2–16 e 2–15
PROVAS['saocamilo-2023-1']['cadernos'] = [{'arquivo': 'caderno', 'paginas': (2, 16)}]
PROVAS['saocamilo-2023-2']['cadernos'] = [{'arquivo': 'caderno', 'paginas': (2, 15)}]


RAIZ = Path(__file__).resolve().parents[2]
FONTE = RAIZ / 'fontes' / 'provas-manuais' / 'saocamilo'
ENTRADA = RAIZ / 'fabrica_saida' / 'ingestao'


def prepara(pid):
    import pymupdf
    pasta = ENTRADA / pid
    pasta.mkdir(parents=True, exist_ok=True)
    antes = {}
    if (pasta / 'manifesto.json').exists():   # o id das questões vem do sha256 do manifesto: não muda (princípio 7)
        antes = json.loads((pasta / 'manifesto.json').read_text()).get('arquivos', {})
    arqs = {}
    for papel, (nome, drive_id, paginas) in ARQUIVOS[pid].items():
        src = FONTE / nome / 'arquivo.pdf'
        if not src.exists():
            raise SystemExit(f'{pid}: falta {src} (baixar do Drive do dono, id {drive_id})')
        dst = pasta / f'{papel}.pdf'
        d = pymupdf.open(src)
        novo = pymupdf.open()
        novo.insert_pdf(d, from_page=(paginas or (1,))[0] - 1, to_page=(paginas or (1, len(d)))[1] - 1)
        novo.save(dst)
        arqs[papel] = {
            'url': VUNESP,
            'origem': f'{DRIVE}; arquivo {nome}.pdf (id {drive_id})' + (f', páginas {paginas[0]}–{paginas[1]}' if paginas else ''),
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
