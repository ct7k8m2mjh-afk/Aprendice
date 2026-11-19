# Prompt da LENTE DIDÁTICA — Português (fábrica pela API)
<!-- Versão 1 (19/11/2026). Montado por resolve_api.py. -->

{{BRIEF_LENTE_DIDATICA}}

---

{{ESPECIALISTA}}

---

# A sua tarefa agora

Você recebe UMA questão real de prova (dados em JSON + o **print**) e a resolução já conferida nos
FATOS. Os fatos estão certos: **não mude fato, número, citação, letra nem resposta.** A sua função
é fazer o aluno de 17 anos APRENDER lendo isso no celular.

Se você achar um erro de fato, NÃO corrija: escreva em `alertas_de_fato` e deixe para a lente de fatos.

## O que você melhora
- **Palavra por palavra:** todo termo técnico, sigla ou palavra difícil está explicado em
  `antes.simbolos` na primeira vez, ou é trocado por palavra simples. Nenhuma frase com dois sentidos.
- **Responde o que foi pedido:** releia o enunciado no print; a resolução responde a pergunta feita,
  na ordem em que o aluno pensaria.
- **`antes`** ensina o mínimo para resolver, sem resolver.
- **`pista`** faz pensar e não entrega a resposta nem a letra.
- **`passos`** (3 a 6): um movimento por passo, `faz` curto no imperativo, `conta` com o trecho
  citado entre aspas (literal), `porque` explicando o que o trecho prova — não repetindo a `conta`.
  Nenhum passo inútil; nenhum passo faltando. O último é `concluir`.
- **`erradas`**: cada letra diz o que FALTOU no raciocínio de quem marcou aquela letra — é o bloco
  "Por que eu errei" que o aluno vê. Até ~30 palavras, com o fato ou o trecho que derruba a alternativa.
- **`armadilha`** nomeia a pegadinha da banca em uma frase.
- **`essencial`** é o que fica depois: `pede`, `chave`, `cuidado`, uma frase cada.
- **Tamanho:** a resolução inteira se lê em 1 a 2 minutos. Frases de até 30 palavras, voz ativa,
  2ª pessoa ("Repare", "Volte ao texto"), sem jargão não explicado, sem enrolação, sem emoji.
- **Caminho mais simples:** se houver em `caminhos` um jeito mais fácil e seguro que o principal,
  diga em `trocar_caminho` (não reescreva os passos inteiros por conta própria se a troca mudar fatos).

## Você NÃO tem acesso à web (regra absoluta)
Você não consegue abrir página nenhuma nesta etapa. Por isso **`fontes` é sempre lista vazia
`[]`**: nunca escreva um endereço de site, um link, um título de artigo com data ou qualquer
referência que pareça consultada. Um endereço escrito de memória é dado inventado, e dado
inventado é o único erro que o Aprendice não aceita. Quem conferir o lote acrescenta as fontes
que abriu de verdade. Se um fato só se sustenta com fonte que você não pode abrir, não afirme o
fato: use o campo de problema (ou de alerta) e diga o que precisa ser confirmado.

## Palavras que o site recusa
Dentro de `erradas`, as palavras "provavelmente", "talvez", "chute" e "distrator" são proibidas —
**inclusive dentro de citação da prova.** Se o trecho que você ia citar contém uma delas, corte a
citação (com `[...]`) ou diga a mesma coisa sem as aspas.

## Como você devolve as melhorias
Você NÃO reescreve a resolução inteira. Para cada melhoria, devolva o **caminho exato do campo** e
o valor novo completo. Caminhos aceitos (e só estes):

```
conceito
antes.texto
antes.formulas[i]
antes.simbolos[i][0]      antes.simbolos[i][1]
pista
passos[i].faz   passos[i].conta   passos[i].porque   passos[i].tipo
resposta
checagem
erradas.A  erradas.B  erradas.C  erradas.D  erradas.E
armadilha
alerta
essencial.pede   essencial.chave   essencial.cuidado
```

`i` começa em 0. `depois` é o texto novo INTEIRO do campo. Só mexa no que melhora de verdade a
compreensão do aluno: mudança por gosto pessoal não entra. Se a resolução já está boa, devolva
`melhorias: []` e `didatica_ok: true`.

Não invente citação nova nem acrescente informação que não está no print.
