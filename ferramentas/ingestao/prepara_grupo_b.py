"""Copia para fabrica_saida/ingestao/<prova>/ os PDFs do grupo B que só existem em fontes/provas-manuais/ (links do
dono, baixados do Brasil Escola), com o manifesto que o recorte usa. `url` = link de download do Brasil Escola (a página
oficial da instituição não serve mais o arquivo ou não responde a acesso automático); `origem` = de onde o arquivo veio
(registro para o dono decidir os direitos, princípio 10). Uso: python3 prepara_grupo_b.py [<prova-id> ...]
"""
import hashlib, json, shutil, sys
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FONTE = RAIZ / 'fontes' / 'provas-manuais'
ENTRADA = RAIZ / 'fabrica_saida' / 'ingestao'
MANIFESTO = json.loads((FONTE / 'manifesto.json').read_text())

# prova -> (chave do manifesto do Brasil Escola, {papel: caminho em fontes/provas-manuais})
MANUAIS = {
    'unitins-2021-1': ('unitins/47310', {
        'caderno': 'unitins/prova-e-gabarito-unitins-2021/prova_geral_final.pdf',
        'gabarito': 'unitins/prova-e-gabarito-unitins-2021/Gabarito DEfinitivo 2021_1.pdf'}),
    'uft-2022-1': ('uft/47451', {
        'manha': 'uft/provas-e-gabaritos-uft-2022-1/vestibular_UFT_2022.1_prova_manha.pdf',
        'tarde': 'uft/provas-e-gabaritos-uft-2022-1/vestibular_UFT_2022.1_prova_tarde.pdf',
        'gabarito': 'uft/provas-e-gabaritos-uft-2022-1/vestibular_UFT_2022_1_gabarito_definitivo.pdf'}),
    'uft-2022-2': ('uft/47488', {
        'manha': 'uft/provas-e-gabaritos-uft-2022-2/Vestibular_2022_2_ProvaManha.pdf',
        'tarde': 'uft/provas-e-gabaritos-uft-2022-2/Vestibular_2022_2_ProvaTarde.pdf',
        'gabarito': 'uft/provas-e-gabaritos-uft-2022-2/Vest2022.2_-_Gabarito_Definitivo.pdf'}),
    'uft-2023-1': ('uft/47548', {
        'manha': 'uft/provas-e-gabaritos-uft-2023/Vestibular 2023.1 Prova Manh╞.pdf',
        'tarde': 'uft/provas-e-gabaritos-uft-2023/Vestibular 2023.1 Prova Tarde.pdf',
        'gabarito': 'uft/provas-e-gabaritos-uft-2023/vestibular 2023_1_GABARITO_DEFINITIVO.pdf'}),
    'uft-2024-1': ('uft/47617', {
        'manha': 'uft/provas-e-gabaritos-uft-2024-1/provas-e-gabaritos-uft-2024-1/Vestibular UFT_UFNT 2024_1 Manha.pdf',
        'tarde': 'uft/provas-e-gabaritos-uft-2024-1/provas-e-gabaritos-uft-2024-1/Vestibular UFT_UFNT 2024_1 Tarde.pdf',
        'gabarito': 'uft/provas-e-gabaritos-uft-2024-1/provas-e-gabaritos-uft-2024-1/gabarito-definitivo-uft-2024-1.pdf'}),
    'ufrr-2021': ('ufrr/47328', {
        'caderno': 'ufrr/provas-e-gabaritos-ufrr-2021/Caderno de Provas - E3_PI - Vestibular 2021.pdf',
        'gabarito': 'ufrr/provas-e-gabaritos-ufrr-2021/Edital N 22-21 Gabarito Oficial e recursos- Vestibular 2021.pdf'}),
    'ufrr-2022': ('ufrr/47465', {
        'caderno': 'ufrr/provas-e-gabaritos-ufrr-2022/Caderno de Provas - E3_PI - 0A Vestibular 2022.pdf',
        'gabarito': 'ufrr/provas-e-gabaritos-ufrr-2022/Edital N 14-22 Gabarito Oficial e recursos- Vestibular 2022.pdf'}),
    'ufrr-2023': ('ufrr/47562', {
        'caderno': 'ufrr/provas-e-gabaritos-ufrr-2023/provas-e-gabaritos-ufrr-2023/Vestibular 2023 - E3-PI.pdf',
        'gabarito': 'ufrr/provas-e-gabaritos-ufrr-2023/provas-e-gabaritos-ufrr-2023/gabarito-oficial-ufrr-2023.pdf'}),
    'ime-2021': ('ime/47265', {
        'caderno': 'ime/provas-e-gabaritos-ime-2020-2021/1ª fase/Prova_Objetiva_-_1ª_FASE.pdf',
        'gabarito': 'ime/provas-e-gabaritos-ime-2020-2021/1ª fase/Gabarito_definitivo_(Prova_Objetiva_-_1ª_FASE).pdf'}),
    'ime-2022': ('ime/47386', {
        'caderno': 'ime/provas-e-gabaritos-ime-2021-2022/1ª fase/CFG-objetiva-CQ.pdf',
        'gabarito': 'ime/provas-e-gabaritos-ime-2021-2022/1ª fase/Gabarito_definitivo_-_1a_Fase.pdf'}),
    'ime-2023': ('ime/47545', {
        'caderno': 'ime/provas-e-gabaritos-ime-2022-2023/prova-vestibular-2023-ime.pdf',
        'gabarito': 'ime/provas-e-gabaritos-ime-2022-2023/gabarito-oficial-vestibular-2023-ime.pdf'}),
    'ime-2026': ('ime/47767', {
        'caderno': 'ime/provas-e-gabaritos-ime-2025-2026/provas-e-gabaritos-ime-2025-2026/prova-1-fase-ime-2026.pdf',
        'gabarito': 'ime/provas-e-gabaritos-ime-2025-2026/provas-e-gabaritos-ime-2025-2026/gabarito-definitivo-1-fase-ime-2026.pdf'}),
    # UEA (Vunesp): arquivo único da edição 2020/acesso 2021 dividido por páginas (caderno, gabarito)
    'uea-2021': ('uea/47339', {'caderno': ('uea/provas-e-gabaritos-uea-2020-2021/arquivo.pdf', 1, 26), 'gabarito': ('uea/provas-e-gabaritos-uea-2020-2021/arquivo.pdf', 29, 29)}),
    'uea-2021-bio': ('uea/47339', {'caderno': ('uea/provas-e-gabaritos-uea-2020-2021/arquivo.pdf', 30, 41), 'gabarito': ('uea/provas-e-gabaritos-uea-2020-2021/arquivo.pdf', 46, 46)}),
    'uea-sis3-2020': ('uea/47340', {'caderno': ('uea/provas-e-gabaritos-uea-sis-2020/UEAM1902 - SIS TRIÊNIO 2020-2022 - PROVA DE ACOMPANHAMENTO III-mesclado.pdf', 1, 23),
                                    'gabarito': ('uea/provas-e-gabaritos-uea-sis-2020/UEAM1902 - SIS TRIÊNIO 2020-2022 - PROVA DE ACOMPANHAMENTO III-mesclado.pdf', 25, 25)}),
    'uea-sis3-2021': ('uea/47340', {'caderno': ('uea/provas-e-gabaritos-uea-sis-2020/UEAM2002 - SIS TRIÊNIO 2021-2023 - PROVA DE ACOMPANHAMENTO III-mesclado.pdf', 1, 23),
                                    'gabarito': ('uea/provas-e-gabaritos-uea-sis-2020/UEAM2002 - SIS TRIÊNIO 2021-2023 - PROVA DE ACOMPANHAMENTO III-mesclado.pdf', 25, 25)}),
    'uea-2025': ('uea/47680', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2024-2025/provas-e-gabaritos-uea-vestibular-sis-2025/provas-e-gabaritos-vestibular-uea-2025/prova-conhecimentos-gerais-vestibular-2025-uea.pdf',
                               'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2024-2025/provas-e-gabaritos-uea-vestibular-sis-2025/provas-e-gabaritos-vestibular-uea-2025/gabarito-conhecimentos-gerais-vestibular-2025-uea.pdf'}),
    'uea-2025-bio': ('uea/47680', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2024-2025/provas-e-gabaritos-uea-vestibular-sis-2025/provas-e-gabaritos-vestibular-uea-2025/prova-conhecimentos-especificos-grupo1-vestibular-2025-uea.pdf',
                               'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2024-2025/provas-e-gabaritos-uea-vestibular-sis-2025/provas-e-gabaritos-vestibular-uea-2025/gabarito-conhecimentos-especificos-grupo1-vestibular-2025-uea.pdf'}),
    'uea-2025-hum': ('uea/47680', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2024-2025/provas-e-gabaritos-uea-vestibular-sis-2025/provas-e-gabaritos-vestibular-uea-2025/prova-conhecimentos-especificos-grupo2-vestibular-2025-uea.pdf',
                               'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2024-2025/provas-e-gabaritos-uea-vestibular-sis-2025/provas-e-gabaritos-vestibular-uea-2025/gabarito-conhecimentos-especificos-grupo2-vestibular-2025-uea.pdf'}),
    'uea-2025-exa': ('uea/47680', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2024-2025/provas-e-gabaritos-uea-vestibular-sis-2025/provas-e-gabaritos-vestibular-uea-2025/prova-conhecimentos-especificos-grupo3-vestibular-2025-uea.pdf',
                               'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2024-2025/provas-e-gabaritos-uea-vestibular-sis-2025/provas-e-gabaritos-vestibular-uea-2025/gabarito-conhecimentos-especificos-grupo3-vestibular-2025-uea.pdf'}),
    'uea-sis3-2025': ('uea/47680', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2024-2025/provas-e-gabaritos-uea-vestibular-sis-2025/provas-e-gabaritos-sis-uea-2024-2025/prova3-sis-2024-uea.pdf',
                                    'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2024-2025/provas-e-gabaritos-uea-vestibular-sis-2025/provas-e-gabaritos-sis-uea-2024-2025/gabarito3-sis-2024-uea.pdf'}),
    'uea-2026': ('uea/47785', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2025-2026/provas-e-gabaritos-uea-2026/prova-conhecimentos-gerais-2026-vestibular.pdf',
                               'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2025-2026/provas-e-gabaritos-uea-2026/gabarito-conhecimentos-gerais-2026-vestibular.pdf'}),
    'uea-2026-bio': ('uea/47785', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2025-2026/provas-e-gabaritos-uea-2026/prova-conhecimentos-especificos-uea-2026-vestibular-grupo1.pdf',
                               'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2025-2026/provas-e-gabaritos-uea-2026/gabarito-conhecimentos-especificos-uea-2026-vestibular-grupo1.pdf'}),
    'uea-2026-hum': ('uea/47785', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2025-2026/provas-e-gabaritos-uea-2026/prova-conhecimentos-especificos-uea-2026-vestibular-grupo2.pdf',
                               'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2025-2026/provas-e-gabaritos-uea-2026/gabarito-conhecimentos-especificos-uea-2026-vestibular-grupo2.pdf'}),
    'uea-2026-exa': ('uea/47785', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2025-2026/provas-e-gabaritos-uea-2026/prova-conhecimentos-especificos-uea-2026-vestibular-grupo3.pdf',
                               'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2025-2026/provas-e-gabaritos-uea-2026/gabarito-conhecimentos-especificos-uea-2026-vestibular-grupo3.pdf'}),
    'uea-sis3-2026': ('uea/47785', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2025-2026/provas-e-gabaritos-uea-2026/prova-uea-2025-sis-3.pdf', 'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2025-2026/provas-e-gabaritos-uea-2026/gabarito-uea-2025-sis-3.pdf'}),
    'uea-2027': ('uea/47821', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-gabaritos-uea-2027-sis-2026/vestibular-2027-uea/uea-2027-prova-conhecimentos-gerais-versao-1.pdf',
                               'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-gabaritos-uea-2027-sis-2026/vestibular-2027-uea/uea-2027-gabarito-conhecimentos-gerais-versao-1.pdf'}),
    'uea-2027-bio': ('uea/47821', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-gabaritos-uea-2027-sis-2026/vestibular-2027-uea/uea-2027-prova-conhecimentos-especificos-grupo-1.pdf',
                               'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-gabaritos-uea-2027-sis-2026/vestibular-2027-uea/uea-2027-gabarito-conhecimentos-especificos-grupo-1.pdf'}),
    'uea-2027-hum': ('uea/47821', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-gabaritos-uea-2027-sis-2026/vestibular-2027-uea/uea-2027-prova-conhecimentos-especificos-grupo-2.pdf',
                               'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-gabaritos-uea-2027-sis-2026/vestibular-2027-uea/uea-2027-gabarito-conhecimentos-especificos-grupo-2.pdf'}),
    'uea-2027-exa': ('uea/47821', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-gabaritos-uea-2027-sis-2026/vestibular-2027-uea/uea-2027-prova-conhecimentos-especificos-grupo-3.pdf',
                               'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-gabaritos-uea-2027-sis-2026/vestibular-2027-uea/uea-2027-gabarito-conhecimentos-especificos-grupo-3.pdf'}),
    'uea-sis3-2027': ('uea/47821', {'caderno': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-gabaritos-uea-2027-sis-2026/sis-2026-uea/uea-sis-2026-prova-acompanhamento-3.pdf',
                                    'gabarito': 'uea/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-e-gabaritos-uea-vestibular-e-sis-2026-2027/provas-gabaritos-uea-2027-sis-2026/sis-2026-uea/uea-sis-2026-gabarito-acompanhamento-3.pdf'}),
    'unirg-2021-1-paraiso': ('unirg/47424', {
        'caderno': 'unirg/provas-e-gabaritos-unirg-medicina-2021/CPtipo 1.pdf',
        'gabarito': 'unirg/provas-e-gabaritos-unirg-medicina-2021/GAB DEFINITIVO PS UNIRG 20211 CP RET 20 DE MAIO .pdf'}),
    'unirg-2021-2-paraiso': ('unirg/47424', {
        'caderno': 'unirg/provas-e-gabaritos-unirg-medicina-2021/PROVA-MATRIZ-MEDICINA---PROVA-A-(INGLES).pdf',
        'gabarito': 'unirg/provas-e-gabaritos-unirg-medicina-2021/Gabarito Final Paraíso.pdf'}),
}


def prepara(pid):
    chave, arqs = MANUAIS[pid]
    reg = MANIFESTO[chave]
    pasta = ENTRADA / pid
    pasta.mkdir(parents=True, exist_ok=True)
    man = {'prova': pid, 'arquivos': {}}
    for papel, rel in arqs.items():
        paginas = None
        if isinstance(rel, tuple):   # (arquivo, 1ª página, última página): pedaço de um PDF que junta caderno e gabarito
            rel, paginas = rel[0], rel[1:]
        src = FONTE / rel
        if not src.exists():
            raise SystemExit(f'{pid}: falta {src} — rode baixa_brasilescola.py {chave.split("/")[0]}=<slug> (origem no manifesto)')
        dst = pasta / f'{papel}.pdf'
        if paginas:
            import pymupdf
            novo = pymupdf.open()
            novo.insert_pdf(pymupdf.open(src), from_page=paginas[0] - 1, to_page=paginas[1] - 1)
            novo.save(dst, garbage=3, deflate=True)
        else:
            shutil.copyfile(src, dst)
        man['arquivos'][papel] = {
            'url': reg['url'],
            'origem': f"{reg['url']} (Brasil Escola, \"{reg['titulo']}\", página {reg['origem']}; arquivo {src.name}"
                      + (f", páginas {paginas[0]}–{paginas[1]}" if paginas else '') + ')',
            'bytes': dst.stat().st_size,
            'sha256': hashlib.sha256(dst.read_bytes()).hexdigest(),
            'copiado_em': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        }
    (pasta / 'manifesto.json').write_text(json.dumps(man, ensure_ascii=False, indent=2) + '\n')
    print(pid, 'ok')


if __name__ == '__main__':
    for pid in sys.argv[1:] or list(MANUAIS):
        prepara(pid)
