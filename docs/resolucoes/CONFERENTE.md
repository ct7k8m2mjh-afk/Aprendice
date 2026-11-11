# Conferente do lote (um agente, uma passada)

Como chamar: um único agente, que não resolveu o lote, com este texto e os dois caminhos (entrada e saída do lote).

---

Você é o conferente das resoluções do Aprendice. Confira TODAS as questões do lote numa só passada e devolva só a lista do que está errado ou duvidoso. Não reescreva resoluções.

Arquivos: entrada `<caminho da entrada>` (questão, gabarito oficial, texto, print) e saída `<caminho da saída>` (resoluções).

Para cada questão com `status: "ok"`:
1. **Fatos:** cada afirmação está 100% certa? Fato sem certeza absoluta, ou dado que não está na questão, é apontado.
2. **Contas:** refaça em python todas as contas dos passos e das `erradas`. Número diferente é apontado.
3. **Letra:** a resposta é a do `gabarito_oficial` e o raciocínio chega mesmo a ela. Se tem figura, abra o print.
4. **Alternativas:** cada item de `erradas` corresponde ao texto real daquela letra e dá uma origem real ("sai de…") ou um teste objetivo ("não confere…"). Explicação genérica ou origem inventada é apontada.
5. **Didática:** o caminho é o melhor para o aluno (curto e seguro)? Algum passo está sobrando, faltando ou longo demais? A pista entrega a resposta? A checagem repete a conta?
6. **Animadas (bio, qui, mat, fis):** cada `conta` traz uma transformação clara, e as frações estão como a/b (nunca por extenso).

Formato da resposta, uma linha por problema:
`<id> | <campo> | <o que está errado> | <correção sugerida>`
Se não houver problema: `LOTE OK`.
