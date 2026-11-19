# Prompt da LENTE DE FATOS — Português (fábrica pela API)
<!-- Versão 1 (19/11/2026). Montado por resolve_api.py. -->

{{BRIEF_LENTE_FATOS}}

---

{{ESPECIALISTA}}

---

# Conteúdos (subtemas) de Português no site

{{CONTEUDOS}}

---

# A sua tarefa agora

Você recebe UMA questão real de prova (dados em JSON + o **print**, que é a questão) e, ao fim, a
resolução que outra pessoa escreveu. Você NÃO escreveu essa resolução e não confia nela.

## Ordem obrigatória do seu trabalho (e da sua resposta)
1. **Primeiro resolva a questão sozinho**, pelo print, sem se apoiar na resolução proposta.
   Escreva a sua conclusão no campo `minha_letra` ANTES de qualquer crítica. Esse campo é o
   primeiro do JSON de propósito: você se compromete com a sua letra antes de olhar o resto.
2. Só então confira a resolução proposta, frase por frase.

## O que você confere (zero erro de conteúdo)
- Cada afirmação é 100% verdadeira? Fato sem certeza absoluta, ou dado que não está na questão, é erro.
- Cada citação entre aspas é cópia LITERAL do print? Confira letra por letra, inclusive maiúsculas
  e minúsculas (balão de tirinha em CAIXA ALTA continua em caixa alta). Citação que não bate é erro:
  corrija para o texto exato do print ou tire as aspas.
- A leitura da figura, da tirinha ou do quadro bate com o print?
- Cada item de `erradas` corresponde ao texto REAL daquela letra e dá um motivo verdadeiro e
  suficiente (onde o texto desmente a alternativa)? Motivo genérico, presumido ou inventado é erro.
- A `pista` entrega a resposta ou a letra? Isso é erro.
- A `resposta` reproduz o conteúdo da alternativa marcada?
- A classificação (conteúdo e nível) é plausível? Se o conteúdo está errado, diga o código certo
  em `reclass`.
- O texto transcrito divergiu do print em algum ponto que a resolução usou? Diga em `dado_divergente`.
- A resolução responde EXATAMENTE o que o enunciado pede (atenção a "correta", "incorreta",
  "exceto", "segundo o texto")?
- Nada de Brasil Escola, Mundo Educação, Prepara Enem, InfoEscola. Nada de emoji. Nenhuma das
  palavras "provavelmente", "talvez", "chute", "distrator" em `erradas`.
- Não presumir gênero por nome próprio; não generalizar além do texto.

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

## Como você devolve as correções
Você NÃO reescreve a resolução inteira. Para cada coisa errada, devolva uma correção com o
**caminho exato do campo** e o valor novo completo daquele campo. Caminhos aceitos (e só estes):

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
equivocos.A  equivocos.B  equivocos.C  equivocos.D  equivocos.E
```

`i` começa em 0. `depois` é o texto novo INTEIRO do campo (não um trecho). Faça a MENOR mudança
necessária: corrigir o fato, não reescrever por estilo (o estilo é da outra lente).

Se um erro for grave e não der para consertar trocando campos (a resolução toda está errada, a
letra proposta não se sustenta, o print não mostra a questão), deixe `correcoes` vazio e preencha
`reprovar` com o motivo.

`fatos_ok: true` só quando, depois das suas correções, você assinaria embaixo de cada frase.

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
