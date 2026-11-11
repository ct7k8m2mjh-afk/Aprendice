"""Valida os arquivos docs/revisao/<materia>/geral.json (revisão geral).

Uso, a partir da raiz do repositório:  python3 docs/revisao/valida_geral.py
Sai com código 1 se houver erro. Não altera nenhum arquivo.
"""
import json, os, sys

RAIZ = os.path.dirname(os.path.abspath(__file__))
MATERIAS = ["por", "mat", "bio", "fis", "qui", "geo", "his", "fs", "ing"]
CAMPOS = ["id", "capitulo", "titulo", "subs", "busca", "pontos", "pegadinha", "imagem"]

erros = 0
for m in MATERIAS:
    caminho = os.path.join(RAIZ, m, "geral.json")
    if not os.path.exists(caminho):
        continue
    d = json.load(open(caminho, encoding="utf-8"))
    problemas = []
    ids = [t.get("id") for t in d["topicos"]]
    if len(ids) != len(set(ids)):
        problemas.append("id repetido")
    for t in d["topicos"]:
        i = t.get("id")
        if list(t) != CAMPOS:
            problemas.append(f"{i}: campos fora do esquema")
            continue
        if not (t["titulo"].strip() and t["capitulo"].strip() and t["pegadinha"].strip()):
            problemas.append(f"{i}: titulo, capitulo ou pegadinha vazio")
        if not t["pontos"] or not all(isinstance(x, str) and x.strip() for x in t["pontos"]):
            problemas.append(f"{i}: pontos vazio")
        if not t["busca"] or not all(isinstance(x, str) and x.strip() for x in t["busca"]):
            problemas.append(f"{i}: busca vazio")
        if not {"tipo", "descricao"} <= set(t["imagem"]):
            problemas.append(f"{i}: imagem sem tipo ou descricao")
    print(f"{m}: {len(ids)} tópicos, {'ok' if not problemas else problemas[:10]}")
    erros += len(problemas)
sys.exit(1 if erros else 0)
