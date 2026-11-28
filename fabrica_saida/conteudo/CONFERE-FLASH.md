# Conferência dos flashcards e frases (Fábrica — Conteúdo, Aprendice)

Você confere uma parte (até 50 itens) de flashcards e frases para completar de uma matéria do Aprendice (site de estudos
para ENEM e vestibular). Os itens já passaram por lente de fatos e lente didática na API, que NÃO abre a web. Sua
conferência é a última barreira: zero erro e fonte de verdade.

Arquivo de entrada: o caminho que veio no seu pedido (`parteN.json`: lista de itens). Cada item tem `id`, `fonte` e os
campos do cartão (`frente`, `verso`, `essencial`, `aceita`, `erro_comum`) ou da frase (`frase` com "___", `resp`,
`aceita`). Itens com `"amostra": true` recebem a revisão completa (B); todos recebem a conferência da fonte (A).

## A. Fonte (100% dos itens)
Para cada item, abra na web (WebSearch/WebFetch) uma página que confirme o fato do item e grave em `fonte` no formato
`"Nome da página ou obra — URL"`. Só valem:
- prova oficial (INEP, banca) com link; página de universidade, órgão de governo (gov.br, IBGE, Embrapa, Câmara,
  Senado, Planalto), museu, NASA, ESA; livro aberto institucional (OpenStax, editoras universitárias);
- enciclopédias e dicionários reconhecidos: Britannica, Stanford Encyclopedia of Philosophy, Internet Encyclopedia of
  Philosophy, Cambridge Dictionary, Oxford Learner's, Merriam-Webster, British Council (gramática);
- NUNCA site didático: Brasil Escola, Mundo Educação, Prepara Enem, InfoEscola, Toda Matéria, Só Física, Stoodi,
  Descomplica, Guia do Estudante, Wikipedia, blogs.
Pode usar a mesma página para vários itens se ela confirma cada um. Se a fonte proposta (livro) estiver certa e você
achar a página aberta correspondente (ex.: capítulo do OpenStax), use a página. Só grave URL que você abriu e que trata
do fato. Se nenhuma fonte permitida confirmar o fato depois de procurar de verdade: `remover: true` com o motivo.

## B. Revisão completa (itens da amostra)
Responda você mesmo antes de ler a resposta. Confira: fato 100% certo; uma só resposta possível (outra resposta certa
vai para `aceita` ou a pergunta é precisada); conta refeita; `essencial` e `aceita` corretos; `erro_comum` real;
frente até ~90 caracteres, verso uma frase até ~110, frase de completar até ~120 com uma lacuna; sem emoji; fração "a/b".
Erro de fato também em item fora da amostra que você notar ao conferir a fonte: corrija igual.

## Saída
Grave `parteN.conferido.json` ao lado da entrada (troque `.json` por `.conferido.json`): uma lista com UM objeto por item
recebido, nesta forma:
`{"id": "fis-d001", "fonte": "Nome — https://...", "correcoes": {"campo": "valor novo"}, "remover": false,
"motivo": "", "erro_amostra": ""}`
- `correcoes`: só os campos que mudam (listas como lista JSON). Vazio `{}` se nada muda além da fonte.
- `erro_amostra`: nos itens da amostra, descreva em uma frase o erro de CONTEÚDO que você achou (vazio se nenhum). Isso
  mede a taxa de erro das lentes.
Valide o JSON (python3 -c "import json;json.load(open('...'))") antes de terminar.
Devolva só UMA linha: "parteN: X itens, Y fontes trocadas, Z correções, W removidos, erros na amostra: K de A".
