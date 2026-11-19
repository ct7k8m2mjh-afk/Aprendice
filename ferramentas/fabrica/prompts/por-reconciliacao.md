# Prompt da RECONCILIAÇÃO DE GABARITO — Português (fábrica pela API)
<!-- Versão 1 (19/11/2026). Montado por resolve_api.py. Só roda quando a letra do resolvedor
     (às cegas) difere do gabarito publicado da banca. Regra do dono, 12 e 13/11/2026. -->

{{BRIEF_RESOLVEDOR}}

---

{{ESPECIALISTA}}

---

# Conteúdos (subtemas) de Português no site

{{CONTEUDOS}}

---

# A sua tarefa agora

Um especialista resolveu esta questão às cegas e chegou a uma letra DIFERENTE do gabarito que a
banca publicou. Você recebe a questão, o **print** (que é a questão), a letra do especialista e o
**gabarito oficial**. A regra do dono é clara: **vale o gabarito oficial**, salvo erro de fato.

## O que você faz, nesta ordem
1. Releia o comando da questão palavra por palavra no print: "correta", "incorreta", "exceto",
   "segundo o texto", "o autor defende", "assinale a alternativa que NÃO…". A maioria das
   divergências nasce aí.
2. Releia o texto de apoio e CADA alternativa inteira, no print.
3. Pergunte-se: **que leitura a banca fez** para considerar aquela letra certa? Em que ponto a
   leitura do especialista se separa da dela? Qual convenção gramatical, qual critério de
   literatura, qual recorte do enunciado leva à oficial?
4. Decida:

**(a) `decisao: "oficial"`** — a letra oficial é defensável (polêmica de leitura, critério da
banca, convenção da área, ou o especialista simplesmente leu o comando errado). Escreva a
resolução INTEIRA ensinando a chegar à letra oficial, no esquema abaixo, e explique no `alerta` o
ponto sutil ou polêmico e por que a oficial prevalece. Esta é a saída esperada na maioria dos casos.

**(b) `decisao: "anular"`** — o gabarito oficial contraria FATO verificável (a afirmação oficial é
falsa; a regra gramatical diz o contrário; a alternativa oficial não se sustenta no texto de jeito
nenhum), ou o enunciado tem erro ou dado faltando que impede chegar à oficial. Então NÃO se ensina
a resposta errada: `motivo` começa por "anular: " e traz o erro com o fato. Resolução vazia.

**(c) `decisao: "pendente"`** — você não consegue decidir com certeza absoluta (print incompleto,
suspeita de errata que precisa ser conferida na web, obra literária que você não confirma).
`motivo` diz o que impede. Resolução vazia.

Escolha (b) ou (c) só com razão forte e escrita. Diferença de leitura não é erro de fato:
isso é (a).

## Se `decisao: "oficial"`
Escreva a resolução completa como o resolvedor escreveria (campos e regras abaixo), com a
`resposta` começando por "Alternativa <letra oficial> — ". A resolução não pode dar a entender que
o gabarito é discutível no corpo dos passos: o ponto polêmico vive só no `alerta`.

{{REGRAS_CAMPOS}}

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

## Os cinco erros que a conferência mais devolveu (piloto por-0094) — não repita
1. **`checagem` que repete um passo.** A `checagem` confere por um caminho DIFERENTE do dos
   `passos` e diferente do que está em `caminhos`. Em Português, isso quer dizer: uma segunda
   marca no texto, um teste de substituição, o contraponto com outra alternativa, ou a inversão da
   alternativa certa. Se a sua `checagem` repete a conta, a decomposição ou o raciocínio que já
   está num `porque`, ela não serve: escreva outra.
2. **`tipo: "calcular"` em Português.** Em Português não há conta. Use `localizar`, `comparar`,
   `eliminar` ou `concluir`.
3. **`erradas` fora do formato "Por que eu errei".** TODAS as letras, sem exceção, começam pelo que
   FALTOU no raciocínio de quem marcou aquela letra ("Faltou notar que…", "Faltou voltar ao
   trecho…") e depois mostram o fato ou o trecho que derruba a alternativa. Não deixe uma letra
   nesse formato e as outras como afirmação neutra.
4. **Fato que o aluno não pode conferir no que a prova mostra.** Não afirme nada sobre a obra, o
   autor ou os personagens que não esteja no trecho da prova, a não ser que a pergunta dependa da
   obra inteira. E não atribua uma classificação a um autor nomeado (crítico, gramático) sem uma
   referência conferível: diga o fato sem a atribuição.
5. **`alerta` que faz o aluno duvidar da questão.** O `alerta` é `""` quando não há problema real na
   prova. Quando há polêmica de leitura, explique o ponto sutil e pare aí: nunca escreva frases
   como "o gabarito oficial prevalece", que só plantam dúvida em quem está estudando.

Mais uma: um `equivoco` é o ERRO de quem marcou aquela letra, com nome de erro
(`P10.3:enclise-apos-palavra-atrativa`). Nunca um rótulo que diga que o uso é aceito ou que
mencione o gabarito.
