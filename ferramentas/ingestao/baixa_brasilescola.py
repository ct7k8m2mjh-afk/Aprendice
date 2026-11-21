"""Baixa provas (2020+) das páginas de downloads do Brasil Escola indicadas pelo dono (11/11/2026).
Uso: python3 ferramentas/ingestao/baixa_brasilescola.py sigla=slug [sigla=slug ...]
Salva em fontes/provas-manuais/<sigla>/<rotulo>/, abre .zip/.rar (bsdtar) e registra em fontes/provas-manuais/manifesto.json.
Respeita robots.txt (/baixar/ só é proibido para AmazonAdBot); User-Agent genérico; uma requisição por vez."""
import json, os, re, subprocess, sys, time, html, urllib.request
BASE = 'https://vestibular.brasilescola.uol.com.br'
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'
RAIZ = os.path.join(os.path.dirname(__file__), '..', '..', 'fontes', 'provas-manuais')
MAN = os.path.join(RAIZ, 'manifesto.json')

def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.status, r.headers.get('Content-Type', ''), r.read()

def rotulo(t):
    t = t.lower()
    t = re.sub(r'[áàãâ]', 'a', t); t = re.sub(r'[éê]', 'e', t); t = re.sub(r'[í]', 'i', t); t = re.sub(r'[óôõ]', 'o', t); t = re.sub(r'[ú]', 'u', t); t = t.replace('ç', 'c')
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:70]

def main():
    man = json.load(open(MAN)) if os.path.exists(MAN) else {}
    for arg in sys.argv[1:]:
        sigla, slug = arg.split('=', 1)
        try:
            st, _, pag = get(f'{BASE}/downloads/{slug}.htm')
        except Exception as e:
            print('PAGINA FALHOU', sigla, slug, e); continue
        s = pag.decode('utf-8', 'ignore')
        itens = re.findall(r'<a[^>]+href="(https://vestibular\.brasilescola\.uol\.com\.br/baixar/(\d+))"[^>]*>(.*?)</a>', s, re.S)
        for url, num, corpo in itens:
            titulo = html.unescape(' '.join(re.sub('<[^>]+>', ' ', corpo).split()))
            titulo = re.sub(r'\s*\d+\s+downloads realizados.*$', '', titulo)
            anos = [int(a) for a in re.findall(r'20[0-9]{2}', titulo)]
            if not anos or max(anos) < 2020:
                continue
            chave = f'{sigla}/{num}'
            if man.get(chave, {}).get('ok'):
                continue
            pasta = os.path.join(RAIZ, sigla, rotulo(titulo))
            os.makedirs(pasta, exist_ok=True)
            try:
                st, ct, dados = get(url)
            except Exception as e:
                man[chave] = {'titulo': titulo, 'url': url, 'ok': False, 'erro': str(e)[:120]}; print('ERRO', sigla, titulo, e); continue
            ext = '.pdf' if dados[:4] == b'%PDF' else '.zip' if dados[:2] == b'PK' else '.rar' if dados[:4] == b'Rar!' else '.bin'
            arq = os.path.join(pasta, 'arquivo' + ext)
            open(arq, 'wb').write(dados)
            if ext in ('.zip', '.rar'):
                r = subprocess.run(['bsdtar', '-xf', 'arquivo' + ext], cwd=pasta, capture_output=True)
                if r.returncode == 0:
                    os.remove(arq)
            # nomes vindos de .rar antigos podem estar em cp437/cp1252: renomeia para UTF-8 válido
            for raizd, dirs, fs in os.walk(pasta, topdown=False):
                for n in fs + dirs:
                    try:
                        n.encode('utf-8')
                    except UnicodeEncodeError:
                        novo = n.encode('utf-8', 'surrogateescape').decode('cp437', 'replace')
                        os.rename(os.path.join(raizd, n), os.path.join(raizd, novo))
            ok = ext != '.bin'
            if not ok:
                os.remove(arq)
            man[chave] = {'titulo': titulo, 'url': url, 'pasta': os.path.relpath(pasta, RAIZ), 'ok': ok,
                          'arquivos': sorted(os.listdir(pasta)), 'origem': f'{BASE}/downloads/{slug}.htm'}
            print('OK' if ok else 'FALHOU', sigla, '|', titulo, '|', man[chave].get('arquivos'))
            json.dump(man, open(MAN, 'w'), ensure_ascii=True, indent=1)
            time.sleep(1)
    json.dump(man, open(MAN, 'w'), ensure_ascii=True, indent=1)

if __name__ == '__main__':
    main()
