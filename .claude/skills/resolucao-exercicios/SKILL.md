---
name: resolucao-exercicios
description: Como escrever, revisar ou corrigir resoluções comentadas de questões de vestibular e ENEM no APRENDICE, em Português, Matemática, Inglês, Física, Química, Biologia, Geografia ou História. Use sempre que for gerar ou revisar o conteúdo de `res/<sub>.json` (antes, pista, passos, resposta, checagem, erradas, armadilha, alerta, essencial), escrever prompts da fábrica de resoluções ou de Questões Aprendice, montar a lista de subtemas de uma matéria nova, ou avaliar se uma resolução está no padrão.
---

# Resolução de exercícios no APRENDICE

Este guia junta duas fontes:
1. **O padrão que já está no app.** São 2.916 resoluções em `app-atual/*/res/*.json`, revisadas em lentes. Ele manda no formato.
2. **Como os bons professores resolvem em vídeo.** São 433 resoluções de canais de vestibular, cerca de 50 por matéria (83 em Português, que inclui Literatura), analisadas em 05/11/2026; as anotações de cada vídeo estão em `docs/pesquisa/videos-resolucao/`. As anotações foram geradas por IA a partir dos vídeos e algumas têm erros de conta ou de fato. Os guias por matéria já descartaram essas anotações e as listam. Nunca use uma anotação como fonte de fato sem conferir. Elas mandam no método: a ordem de raciocínio, o que destacar e onde o aluno erra.

Quando as duas fontes divergem, vale o formato do app, porque o aluno lê no celular e não assiste a uma aula.

Os arquivos por matéria ficam em `materias/`. Leia o da matéria antes de escrever:

| Matéria | Arquivo |
|---|---|
| Matemática | `materias/matematica.md` |
| Física | `materias/fisica.md` |
| Química | `materias/quimica.md` |
| Biologia | `materias/biologia.md` |
| Português | `materias/portugues.md` |
| Inglês | `materias/ingles.md` |
| História | `materias/historia.md` |
| Geografia | `materias/geografia.md` |

Cada arquivo traz:
- os subtemas que caem, com os que mais caem primeiro;
- os tipos de questão de cada subtema e o roteiro de resolução de cada tipo;
- os distratores típicos (para o campo `erradas`);
- as armadilhas recorrentes e um exemplo comentado.

## O método em uma linha

**Entender o que é pedido → separar o que serve → lembrar a ideia que resolve → executar → conferir → explicar por que cada errada engana.**

Os bons professores dos vídeos fazem exatamente isso. Os fracos pulam o começo (resolvem sem mostrar como leram o enunciado) e o fim (marcam a letra sem conferir nem comentar as erradas). No APRENDICE, o começo e o fim são obrigatórios.

## Campo a campo (`res/<sub>.json`)

Escreva para um aluno que **errou** a questão e está lendo no celular. Use frases curtas, voz ativa, 2ª pessoa ("Converta", "Repare") e nenhum jargão sem explicação.

### `antes`: o mínimo para começar
- `texto`: de 2 a 5 frases com a ideia que destrava a questão, e não um resumo do capítulo. Quando a questão esconde o trabalho real numa conversão, numa palavra ou num gráfico, diga isso aqui ("O enunciado dá o volume em mL de propósito: essa conversão é o trabalho real da questão").
- `formulas`: de 1 a 4 linhas, só o que vai ser usado nos passos, escrito como a regra é dita em aula ("C = m ÷ V, logo m = C × V"). Nas matérias sem fórmula, entram as regras em forma de linha ("hipotônico: entra água, o volume sobe").
- `simbolos`: pares `[termo, explicação curta]` para todo símbolo, sigla ou palavra técnica que aparece na resolução e que um aluno do 2º ano pode não saber.

### `pista`: por onde começar, sem entregar
- Uma ou duas frases que apontam o primeiro movimento ou o primeiro cuidado, como "Antes de multiplicar, olhe as duas unidades lado a lado" ou "Primeiro descubra a fração que sobrou; só depois vire quilos".
- Nunca dê o resultado, a letra ou a regra final pronta.

### `passos`: o caminho, um movimento por passo
- `faz`: o comando, no imperativo, com até ~8 palavras ("Converta o volume para litro").
- `conta`: o que se escreve no caderno, seja a conta, o trecho citado do texto, a leitura do gráfico ou o esquema em linha. Contas por extenso, com unidades e os valores intermediários.
- `porque`: a razão do passo, em 1 ou 2 frases. Aqui mora o ensino. Use o "porque" que o professor fala em voz alta ("O L de baixo cancela com o L do volume, sobrando grama").
- `tipo`: sempre preencher, com um destes: `localizar` (achar no texto, figura ou gráfico), `calcular`, `comparar`, `eliminar` (descartar alternativa ou hipótese), `concluir`. Cerca de 2.500 passos antigos estão sem tipo; ao revisar, complete.
- Normalmente são de 3 a 6 passos. O último é `concluir` e liga o resultado à letra.
- A ordem é a do raciocínio, não a do enunciado. Antes de executar, sempre vem o passo que traduz o que é pedido, quando ele não é óbvio.
- As matérias de leitura (Português, Inglês, História, Geografia) seguem o mesmo esquema. A `conta` vira o trecho do texto entre aspas ou a informação localizada, e o `porque` explica o que o trecho prova.

### `resposta`
"Alternativa X — " seguida do conteúdo da alternativa em linguagem de gente (com unidade, quando houver).

### `checagem`: conferir por outro caminho
Não repita a conta. Confira por um caminho diferente, por exemplo:
- reconstruir o todo ("10 + 33,33 + 6,67 = 50 kg: fecha com o saco");
- conferir a unidade ou a ordem de grandeza ("1,8 g de sal em 200 mL de soro é plausível");
- substituir o resultado no enunciado;
- testar um caso extremo;
- nas questões de leitura, achar uma segunda marca no texto ("Conte as conjunções: são quatro marcas de oposição").

### `erradas`: de onde vem cada distrator (princípio "Errar ensina")
- Uma entrada para cada letra errada, em até ~30 palavras.
- Quando um erro típico real chega exatamente ao valor, escreva "X sai de …" e mostre a conta. Por exemplo: "Parou numa etapa: calculou só o gasto do degrau, 1/5 × 50 = 10 kg".
- Quando nenhuma conta plausível chega ao valor, escreva "X não confere" e mostre o teste objetivo que derruba a alternativa. **Nunca invente uma origem.** Proibido: "provavelmente", "talvez", "chute", "distrator", "não sai de conta nenhuma" sem o teste.
- Nas questões de leitura, diga o que a alternativa afirma e onde o texto a desmente ou deixa de sustentá-la. Ela pode ser extrapolação, generalização, inversão, verdadeira mas fora do que se pede, ou meia verdade.

### `armadilha`
Uma frase com **a** armadilha principal da questão, que é o motivo pelo qual quem errou errou ("A pergunta é quanto SOBROU, não quanto foi usado").

### `alerta` (opcional)
Problema da própria prova, como erro de digitação, redação imprecisa da banca ou gabarito discutível com a justificativa. Fica vazio quando não há problema.

### `essencial`: o resumo que fica
`{pede, chave, cuidado}`, uma frase cada: o que a questão pede, a ideia que resolve e o cuidado que evita o erro.

### `nota_dif` (opcional)
Use quando a dificuldade ou o degrau do banco parecem errados, com a justificativa. Não altere `dif` ou `degrau` por conta própria.

## Regras que não se quebram

1. **Resolva antes de ver o gabarito.** Se o seu resultado divergir do gabarito publicado, a questão vai para a fila de exceção. Nunca ajuste a resolução ao gabarito sem explicar.
2. **Toda conta é conferida por código** (Python) antes de entrar, inclusive as contas das `erradas`.
3. **Nada de fato sem fonte.** Datas, autores, dados biológicos e constantes têm que ser conferíveis. Na dúvida, não afirme.
4. **Questão de prova versus Questão Aprendice** (ver `docs/questoes-aprendice.md`). A resolução nunca cita site didático. Na Questão Aprendice, ela nunca chama a questão pelo nome de uma banca.
5. **Revisão em lentes** (ver `docs/fabrica-de-conteudo-api.md`). Nada entra no app sem passar por elas.
6. **Sem emoji, sem "Ótima pergunta!", sem enrolação.** O tom é de professor bom de cursinho: direto, seguro e gentil.

## O que os vídeos ensinam (vale para todas as matérias)

O que os professores bem avaliados fazem e as resoluções do app devem reproduzir:
- **Separam o contexto do comando.** Nas questões do ENEM, o texto-base costuma ser longo e o comando está na última frase. O primeiro passo é dizer o que realmente se pede.
- **Anotam os dados com unidade antes de qualquer conta**, e desenham ou esquematizam quando há movimento, circuito, molécula, heredograma, mapa ou linha do tempo.
- **Dizem em voz alta a ideia que resolve** ("aqui é permutação com repetição", "isso é conservação de energia") antes de fazer contas.
- **Quebram em casos** quando a questão permite (por exemplo, os cenários de movimento na probabilidade da Fuvest 2019) e somam no fim.
- **Usam as alternativas a seu favor**: eliminação por unidade, por ordem de grandeza, por palavra absoluta ("sempre", "nunca", "apenas") e por "verdadeira mas não responde".
- **Nomeiam a pegadinha** ("a parte mais chata é entender os movimentos possíveis").

O que os fracos fazem e deve ser evitado: marcar a letra sem comentar as erradas, não conferir, fazer revisão teórica longa antes da questão e pular passos "óbvios".

## Checklist antes de entregar uma resolução
- [ ] Resolvi sem o gabarito e bateu com o publicado.
- [ ] O `antes` tem só o necessário; todo símbolo usado está em `simbolos`.
- [ ] A `pista` não entrega a resposta.
- [ ] Cada passo é um movimento só, tem `tipo`, e o `porque` explica o raciocínio, não repete a conta.
- [ ] A `checagem` usa outro caminho.
- [ ] Cada letra errada tem origem real ("sai de…") ou teste objetivo ("não confere…"), sem especulação.
- [ ] A `armadilha` e o `essencial` estão preenchidos.
- [ ] As contas foram conferidas por código e o JSON é válido.
- [ ] Vi a resolução renderizada no app (claro, escuro, 390 px) quando for integrar.
