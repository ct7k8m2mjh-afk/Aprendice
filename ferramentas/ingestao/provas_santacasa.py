"""Santa Casa (FCMSCSP, Medicina, banca Vunesp): provas que o dono pôs no Google Drive (12/11/2026).

Os PDFs ficam em fontes/provas-manuais/santacasa/<pasta>/arquivo.pdf (fora do git); a origem de cada um está em
docs/provas/ORIGEM-DRIVE-saocamilo-santacasa-unesp.md.

  python3 ferramentas/ingestao/provas_santacasa.py [prova-id ...]   copia os PDFs para fabrica_saida/ingestao/<prova>/
  python3 ferramentas/ingestao/recorta.py <prova-id>                 recorta (configuração abaixo, carregada por provas.py)

Só o 1º dia (Prova de Conhecimentos Gerais, 80 objetivas) entra; o 2º dia (discursivas e redação) fica fora.
Nenhum dos dois PDFs do Drive traz o gabarito: o gabarito oficial da Vunesp (versão 1) veio da cópia hospedada pelo
Curso Objetivo (página de resolução comentada). Anuladas ficam fora.

2025: o caderno do Drive ("StaCasa2025-Testes") é de OUTRA versão (mesmas questões, alternativas em outra ordem; ex.:
q1 (A) "volúvel" no Drive, "distraído" na versão 1). O gabarito publicado é o da versão 1, então o caderno usado é o
da versão 1, do Curso Objetivo (as 80 respostas da resolução do Objetivo batem com o gabarito oficial). O do Drive fica
registrado, sem uso.
"""
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import provas  # noqa: F401  (carrega provas.py na ordem certa quando este arquivo roda sozinho)
import provas_vunesp as _v

DRIVE = 'Google Drive do dono'
OBJ = 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/santacasa/'

# prova -> papel -> (pasta em fontes/provas-manuais/santacasa, url de origem, descrição da origem)
ARQUIVOS = {
    'santacasa-2023': {
        'caderno': ('694557715-Santacasa2023-1dia-Prova', OBJ + '2023/1dia/santacasa2023_1dia_prova.pdf',
                    f'{DRIVE}; arquivo 694557715-Santacasa2023-1dia-Prova.pdf (id 1BI6NA0A_7LX-Bb38i8ii9pRw3JfOfY-_), '
                    'idêntico (mesmo md5) à cópia do Curso Objetivo'),
        'gabarito': ('objetivo-santacasa2023_gabarito', OBJ + '2023/1dia/santacasa2023_gabarito.pdf',
                     'gabarito oficial Vunesp (FAVC2201, versão 1) em cópia hospedada pelo Curso Objetivo'),
    },
    'santacasa-2025': {
        'caderno': ('objetivo-santacasa2025_1dia_prova', OBJ + '2025/1dia/santacasa2025_1dia_prova.pdf',
                    'caderno oficial Vunesp (FAVC2401, versão 1) em cópia hospedada pelo Curso Objetivo; o do Drive do '
                    'dono (994771379-StaCasa2025-Testes.pdf, id 1mpRGvhnBzG8hK8sk0c3t8YBuo6nck2cY) é de outra versão'),
        'gabarito': ('objetivo-santacasa2025_gabarito', OBJ + '2025/1dia/santacasa2025_gabarito.pdf',
                     'gabarito oficial Vunesp (FAVC2401, versão 1) em cópia hospedada pelo Curso Objetivo'),
    },
}

NOTA = (' Caderno e gabarito oficiais da Vunesp ({cod}), versão 1: caderno {cad}; gabarito em cópia hospedada pelo '
        'Curso Objetivo (o portal da Vunesp bloqueia acesso automático). Anuladas ficam fora.')
PROVAS = {
    'santacasa-2023': _v.base(
        'santacasa', 'Santa Casa', 2023, 'Medicina', 'Santa Casa 2023', 80, duracao=4,
        nota='Faculdade de Ciências Médicas da Santa Casa de São Paulo, Vestibular 1º semestre de 2023 (Medicina, '
             '22/10/2022): Prova de Conhecimentos Gerais (80 questões objetivas). A prova discursiva (2º dia) fica fora.'
             + NOTA.format(cod='FAVC2201', cad='em cópia guardada no Google Drive do dono')),
    'santacasa-2025': _v.base(
        'santacasa', 'Santa Casa', 2025, 'Medicina', 'Santa Casa 2025', 80, duracao=4,
        nota='Faculdade de Ciências Médicas da Santa Casa de São Paulo, Vestibular 1º semestre de 2025 (Medicina, '
             '28/09/2024): Prova de Conhecimentos Gerais (80 questões objetivas). A prova discursiva (2º dia) fica fora.'
             + NOTA.format(cod='FAVC2401', cad='em cópia hospedada pelo Curso Objetivo (a do Drive do dono é de outra '
                                               'versão, com as alternativas em outra ordem)')),
}
for _k in PROVAS:
    # "As questões 34 e 35 referem-se ao..." abre o texto de apoio das questões indicadas
    PROVAS[_k]['suporte'] = PROVAS[_k]['suporte'] + [r'(?i)^as quest[õo]es (de )?\d+ (e|a) \d+ referem']
    PROVAS[_k]['selo_dx'] = 4   # selo redondo à esquerda de "QUESTÃO NN" (Vunesp), como em santacasa-2021/2022


RAIZ = Path(__file__).resolve().parents[2]
FONTE = RAIZ / 'fontes' / 'provas-manuais' / 'santacasa'
ENTRADA = RAIZ / 'fabrica_saida' / 'ingestao'


def prepara(pid):
    pasta = ENTRADA / pid
    pasta.mkdir(parents=True, exist_ok=True)
    antes = {}
    if (pasta / 'manifesto.json').exists():   # o id das questões vem do sha256 do manifesto: não muda (princípio 7)
        antes = json.loads((pasta / 'manifesto.json').read_text()).get('arquivos', {})
    arqs = {}
    for papel, (nome, url, origem) in ARQUIVOS[pid].items():
        src = FONTE / nome / 'arquivo.pdf'
        if not src.exists():
            raise SystemExit(f'{pid}: falta {src} ({origem}; {url})')
        dst = pasta / f'{papel}.pdf'
        dst.write_bytes(src.read_bytes())
        arqs[papel] = {
            'url': url,
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
