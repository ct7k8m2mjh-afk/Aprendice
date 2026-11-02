"""Ingestão (sem IA): baixa caderno de prova e gabarito oficiais, com educação.

Uso:  python3 ferramentas/ingestao/baixa.py <prova-id> <rotulo> <url> [<rotulo> <url> ...]
Grava em fabrica_saida/ingestao/<prova-id>/<rotulo>.pdf e registra em manifesto.json
(link, tamanho, sha256, data). PDFs ficam fora do git; o manifesto entra.

- Respeita robots.txt do site.
- Espera PAUSA segundos entre downloads; não refaz download de arquivo já íntegro.
- Alguns servidores públicos (ex.: download.inep.gov.br) mandam a cadeia de certificado
  incompleta. Os intermediários verificados ficam em certs/ e são SOMADOS à lista de
  confiança. A verificação de TLS nunca é desligada.
"""
import hashlib, json, os, ssl, sys, time, urllib.request, urllib.robotparser
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

RAIZ = Path(__file__).resolve().parents[2]
SAIDA = RAIZ / 'fabrica_saida' / 'ingestao'
CERTS = Path(__file__).parent / 'certs'
PAUSA = 3
AGENTE = 'Mozilla/5.0 (compatible; Aprendice-ingestao/0.1; estudo pessoal de provas publicas)'


def contexto_tls():
    ctx = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or os.environ.get('REQUESTS_CA_BUNDLE'))
    for c in sorted(CERTS.glob('*.pem')):
        ctx.load_verify_locations(cafile=str(c))
    return ctx


CTX = contexto_tls()
_robots = {}


def pode(url):
    u = urlparse(url)
    base = f'{u.scheme}://{u.netloc}'
    if base not in _robots:
        rp = urllib.robotparser.RobotFileParser()
        try:
            req = urllib.request.Request(base + '/robots.txt', headers={'User-Agent': AGENTE})
            with urllib.request.urlopen(req, context=CTX, timeout=30) as r:
                rp.parse(r.read().decode('utf-8', 'ignore').splitlines())
        except Exception:
            rp.parse([])  # sem robots.txt acessível: permitido
        _robots[base] = rp
    return _robots[base].can_fetch(AGENTE, url)


def sha(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def baixa(prova, rotulo, url):
    pasta = SAIDA / prova
    pasta.mkdir(parents=True, exist_ok=True)
    man_p = pasta / 'manifesto.json'
    man = json.loads(man_p.read_text()) if man_p.exists() else {'prova': prova, 'arquivos': {}}
    destino = pasta / (rotulo + '.pdf')
    ant = man['arquivos'].get(rotulo)
    if ant and destino.exists() and sha(destino) == ant['sha256'] and ant['url'] == url:
        print(f'  ok (já baixado) {rotulo}')
        return False
    if not pode(url):
        print(f'  BLOQUEADO pelo robots.txt: {url}')
        return False
    req = urllib.request.Request(url, headers={'User-Agent': AGENTE})
    with urllib.request.urlopen(req, context=CTX, timeout=120) as r:
        dados = r.read()
        tipo = r.headers.get('Content-Type', '')
    # alguns servidores (PHP) põem quebra de linha antes do cabeçalho: tira só espaço em branco
    if dados.lstrip(b' \r\n\t').startswith(b'%PDF'):
        dados = dados.lstrip(b' \r\n\t')
    if not dados.startswith(b'%PDF'):
        print(f'  NÃO É PDF ({tipo}): {url}')
        return True
    destino.write_bytes(dados)
    man['arquivos'][rotulo] = {
        'url': url, 'bytes': len(dados), 'sha256': hashlib.sha256(dados).hexdigest(),
        'baixado_em': datetime.now(timezone.utc).isoformat(timespec='seconds'),
    }
    man_p.write_text(json.dumps(man, ensure_ascii=False, indent=2) + '\n')
    print(f'  baixado {rotulo}: {len(dados)/1e6:.1f} MB')
    return True


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 3 or len(a) % 2 == 0:
        sys.exit(__doc__)
    prova, pares = a[0], list(zip(a[1::2], a[2::2]))
    for i, (rot, url) in enumerate(pares):
        if baixa(prova, rot, url) and i < len(pares) - 1:
            time.sleep(PAUSA)
