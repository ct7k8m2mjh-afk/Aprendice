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
}


def prepara(pid):
    chave, arqs = MANUAIS[pid]
    reg = MANIFESTO[chave]
    pasta = ENTRADA / pid
    pasta.mkdir(parents=True, exist_ok=True)
    man = {'prova': pid, 'arquivos': {}}
    for papel, rel in arqs.items():
        src = FONTE / rel
        if not src.exists():
            raise SystemExit(f'{pid}: falta {src} — rode baixa_brasilescola.py {chave.split("/")[0]}=<slug> (origem no manifesto)')
        dst = pasta / f'{papel}.pdf'
        shutil.copyfile(src, dst)
        man['arquivos'][papel] = {
            'url': reg['url'],
            'origem': f"{reg['url']} (Brasil Escola, \"{reg['titulo']}\", página {reg['origem']}; arquivo {src.name})",
            'bytes': dst.stat().st_size,
            'sha256': hashlib.sha256(dst.read_bytes()).hexdigest(),
            'copiado_em': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        }
    (pasta / 'manifesto.json').write_text(json.dumps(man, ensure_ascii=False, indent=2) + '\n')
    print(pid, 'ok')


if __name__ == '__main__':
    for pid in sys.argv[1:] or list(MANUAIS):
        prepara(pid)
