#!/usr/bin/env python3
"""Resolve conflito de rebase em arquivos JSON de dicionario, por uniao de 3 vias.

Os arquivos de resolucao (`resolucoes-<mat>.json`) e os registros
(`registro-<mat>.json`) sao dicionarios com chave por questao ou por lote.
Quando duas sessoes gravam lotes diferentes na mesma branch, o git marca
conflito de texto, mas o conteudo nao se contradiz: cada lado acrescentou
chaves suas. A juncao correta e a uniao, nunca sobrescrever um lado.

Regra por chave, comparando com a base comum:
  - chave que so um lado criou        -> entra
  - chave que so um lado mudou        -> vale a versao mudada
  - chave que um lado apagou e o
    outro nao tocou                   -> fica apagada
  - chave que os dois mudaram         -> desce um nivel; se nao der,
                                         aborta e avisa qual e

Uso:  python3 ferramentas/fabrica/junta_json.py            (todos os em conflito)
      python3 ferramentas/fabrica/junta_json.py a.json b.json
Sai com codigo 1 (sem gravar nada) se alguma chave colidir de verdade.
"""
import json
import subprocess
import sys

FALTA = object()


def _git(*args):
    p = subprocess.run(["git", *args], capture_output=True, text=True)
    return p.stdout if p.returncode == 0 else None


def em_conflito():
    saida = _git("diff", "--name-only", "--diff-filter=U") or ""
    return [n for n in saida.split("\n") if n.endswith(".json")]


def estagio(arquivo, n):
    bruto = _git("show", f":{n}:{arquivo}")
    if bruto is None:
        return FALTA
    return json.loads(bruto)


def junta(base, nosso, meu, caminho, erros):
    if not (isinstance(nosso, dict) and isinstance(meu, dict)):
        if nosso == meu:
            return nosso
        if base == meu:
            return nosso
        if base == nosso:
            return meu
        erros.append(caminho)
        return None
    saida = dict(nosso)
    if not isinstance(base, dict):
        base = {}
    for chave, valor in meu.items():
        if chave not in nosso:
            if chave not in base:
                saida[chave] = valor          # criei eu
            continue                          # eles apagaram de proposito
        if nosso[chave] == valor:
            continue
        if base.get(chave, FALTA) == nosso[chave]:
            saida[chave] = valor              # so eu mudei
        elif base.get(chave, FALTA) == valor:
            continue                          # so eles mudaram
        else:
            r = junta(base.get(chave, FALTA), nosso[chave], valor,
                      f"{caminho}/{chave}", erros)
            if r is None:
                return None
            saida[chave] = r
    for chave in list(saida):
        if chave in base and chave not in nosso and chave not in meu:
            del saida[chave]                  # os dois apagaram
    return saida


def ordena(obj):
    if isinstance(obj, dict):
        return {c: ordena(obj[c]) for c in sorted(obj)}
    return obj


def main(argv):
    arquivos = argv[1:] or em_conflito()
    if not arquivos:
        print("nada em conflito")
        return 0
    prontos = []
    ruins = []
    for arquivo in arquivos:
        base, nosso, meu = (estagio(arquivo, n) for n in (1, 2, 3))
        if FALTA in (nosso, meu):
            ruins.append((arquivo, ["arquivo criado/apagado em um lado"]))
            continue
        erros = []
        saida = junta(base if base is not FALTA else {}, nosso, meu, "", erros)
        if saida is None:
            ruins.append((arquivo, erros))
            continue
        prontos.append((arquivo, nosso, saida))
    if ruins:
        for arquivo, erros in ruins:
            print(f"COLISAO {arquivo}: {', '.join(erros)}")
        print("nada foi gravado: resolva estes a mao")
        return 1
    for arquivo, nosso, saida in prontos:
        with open(arquivo, "w", encoding="utf-8") as fh:
            json.dump(ordena(saida), fh, ensure_ascii=False, indent=1)
            fh.write("\n")
        print(f"ok {arquivo}: {len(nosso)} -> {len(saida)} chaves no topo")
        subprocess.run(["git", "add", arquivo], check=True)
    print(f"{len(prontos)} arquivo(s) juntado(s) e no indice; "
          "rode: git rebase --continue")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
