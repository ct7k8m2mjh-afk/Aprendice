"""Provas do Google Drive do dono, 2º lote (12/11/2026): São Camilo 2025/1 e 2025/2 (Medicina, banca Vunesp).

Os PDFs ficam em fontes/provas-manuais/<instituição>/<nome do arquivo no Drive>/arquivo.pdf (fora do git); a origem
de cada um (nome e id no Drive) e o que ficou fora (Famema Prova I dissertativa, gabaritos sem caderno, simulado de
cursinho) estão em docs/provas/ORIGEM-DRIVE-saocamilo-santacasa-unesp.md.

  python3 ferramentas/ingestao/provas_drive2.py [prova-id ...]   copia os PDFs para fabrica_saida/ingestao/<prova>/
  python3 ferramentas/ingestao/recorta.py <prova-id>              recorta (configuração abaixo, carregada por provas.py)

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
DRIVE = 'Google Drive do dono'

# prova -> papel -> (pasta em fontes/provas-manuais, nome do arquivo no Drive, id no Drive)
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
    for papel, (pasta_fonte, nome, drive_id) in ARQUIVOS[pid].items():
        src = FONTE / pasta_fonte / 'arquivo.pdf'
        if not src.exists():
            raise SystemExit(f'{pid}: falta {src} (baixar do Drive do dono, id {drive_id})')
        dst = pasta / f'{papel}.pdf'
        shutil.copyfile(src, dst)
        arqs[papel] = {
            'url': VUNESP,
            'origem': f'{DRIVE}; arquivo {nome} (id {drive_id})',
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
