"""Copia os PDFs de fontes/provas-manuais/ (links do dono, baixados do Brasil Escola) para fabrica_saida/ingestao/<prova>/
com o manifesto que o recorte usa. No manifesto, `url` é a página oficial da instituição/banca (é a fonte que o site
mostra); `origem` é de onde o arquivo foi de fato baixado (registro para o dono decidir os direitos, princípio 10).

Uso: python3 ferramentas/ingestao/prepara_manuais.py <prova-id> ...   (sem argumentos: todas as de MANUAIS)
"""
import hashlib, json, shutil, sys
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FONTE = RAIZ / 'fontes' / 'provas-manuais'
ENTRADA = RAIZ / 'fabrica_saida' / 'ingestao'
MANIFESTO = json.loads((FONTE / 'manifesto.json').read_text())

sys.path.insert(0, str(Path(__file__).parent))
import provas  # noqa: E402,F401  (carrega provas_grupo_a na ordem certa)
from provas_grupo_a import MANUAIS  # noqa: E402


def prepara(pid):
    m = MANUAIS[pid]
    pasta = ENTRADA / pid
    pasta.mkdir(parents=True, exist_ok=True)
    reg = MANIFESTO[m['manifesto']]
    arqs = {}
    for papel, rel in m['arquivos'].items():
        paginas = None
        if isinstance(rel, tuple):   # (arquivo, (primeira, última)): caderno e gabarito no mesmo PDF publicado
            rel, paginas = rel
        src = FONTE / rel
        if not src.exists():
            raise SystemExit(f'{pid}: falta {src} — rode baixa_brasilescola.py (origem no manifesto)')
        dst = pasta / f'{papel}.pdf'
        if paginas:
            import pymupdf
            d = pymupdf.open(src)
            novo = pymupdf.open()
            novo.insert_pdf(d, from_page=paginas[0] - 1, to_page=paginas[1] - 1)
            novo.save(dst)
        else:
            shutil.copyfile(src, dst)
        if papel == 'caderno' and m.get('limpa'):
            m['limpa'](dst)   # ex.: logotipo no alto das páginas, que cairia no meio do print
        arqs[papel] = {
            'url': m['oficial'],
            'origem': reg['url'] + ' (Brasil Escola, página ' + reg['origem'] + '; arquivo ' + src.name
                      + (f', páginas {paginas[0]}–{paginas[1]}' if paginas else '') + ')',
            'bytes': dst.stat().st_size,
            'sha256': hashlib.sha256(dst.read_bytes()).hexdigest(),
            'copiado_em': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        }
    (pasta / 'manifesto.json').write_text(json.dumps({'prova': pid, 'arquivos': arqs}, ensure_ascii=False, indent=2) + '\n')
    return pasta


if __name__ == '__main__':
    for pid in (sys.argv[1:] or list(MANUAIS)):
        print(prepara(pid))
