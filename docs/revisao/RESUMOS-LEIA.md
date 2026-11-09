# resumos.json (comando 35)
Em cada `docs/revisao/<matéria>/resumos.json`: `{ "<tema>": { "nome", "subtemas": [ { "sub", "titulo", "pontos": [...], "pegadinha", "imagem": { "tipo": "caixa_imagem", "descricao": "o que ilustrar" } } ] } }`.
- `pontos` e `pegadinha` vêm dos cartões já aprovados nas lentes (caderno e cuidado); nada novo foi acrescentado. Podem ter KaTeX (`$...$`).
- Física/Química: `formula` também aparece no `essencial` de Q01, Q06, Q07 (Química: um item por tela, então o mesmo `sub` pode repetir).
- Imagem ainda não enviada: mostrar caixa tracejada com `imagem.descricao`. Imagem enviada pelo dono: `docs/imagens/<matéria>/<sub>.png`, substitui a caixa.
- Lista para o dono: `IMAGENS-PARA-GERAR.md`.
