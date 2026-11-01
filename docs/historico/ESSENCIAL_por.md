# Treino geral de Português: o essencial (29/10/2026)

Arquivo de saída: `ESSENCIAL_por.json`, com 40 ids de ABC e 40 itens de completar. Não alterei `dados.json` nem `index.html`.

## Critérios
- **Peso por tema:** usei a tabela de incidência ponderada de `ANALISE_FLASH50_por.md` (provas reais, São Camilo ×2, de 2021 em diante ×1,5). A cota de cada sub é proporcional ao peso (40 × %), arredondada. Os temas grandes, que são leitura (P01–P02), sentido e figuras (P05–P06), coesão (P04), vozes e discursos (P10.5) e literatura (P11–P12), entraram todos.
- **ABC:**
  - Só questões do banco com tipo 'prova', gabarito presente e degrau > 0. Nenhuma questão de lista ('site').
  - Na ordem de preferência das escolas: São Camilo (24), Unesp (8), Santa Casa (4), Fuvest (3), Einstein (1).
  - Li o enunciado, as alternativas e o gabarito de cada uma, além do bloco "Resposta" da resolução (`por/res`). Nas questões que dependem de imagem (tirinha de Calvin P024f7e3, tirinha de Dahmer P30ab321, soneto “XCIX” de Cláudio Manuel da Costa em Pd454688), decodifiquei o print da prova que está em `res` e conferi a imagem. Em Pcccc823, a fala da tirinha já está transcrita no enunciado.
  - Para não repetir o que se cobra, não há duas questões da mesma ideia. Por exemplo, a concessiva entra uma vez só (P5e44fc6), e da dupla P8f8f1cf/Pc7a70b2, as duas sobre a forma em -ra, ficou só a segunda.
- **Completar:**
  - Cada frase foi recortada de um cartão de teoria revisado. A fonte indica o sub, o título do cartão e o campo usado.
  - A lacuna fica no termo-chave, e a frase foi montada para ter uma resposta só. Por exemplo, em vez de "haver no sentido de ___", que aceitaria tanto "existir" quanto "tempo", usei “Há vagas”.
  - Os itens evitam o que os 50 flashcards já perguntam. Onde o tema era o mesmo, a lacuna cobre outra face dele: o flashcard pergunta ativa → passiva, e o item aqui pede passiva → ativa; o flashcard pergunta "presente → imperfeito", e o item pede "fiz → fizera".
  - Um script conferiu que a resposta aparece no próprio cartão. A única exceção é c014, em que "contrariar" é a forma verbal de "contrariá-la", que está no cartão.

## Distribuição por tema (ABC / completar)
| sub | conteúdo | ABC | completar |
|---|---|---|---|
| P01.2 | explícito × inferência | 3 | 3 |
| P10.5 | vozes e discursos | 3 | 3 |
| P05.1 | sentido no contexto | 2 | 2 |
| P04.2 | conjunções | 2 | 2 |
| P06.2 | figuras de pensamento | 2 | 2 |
| P02.3 | ironia e implícito | 2 | 2 |
| P01.1 | tema e tese | 2 | 2 |
| P04.1 | referência | 1 | 2 |
| P07.4 | formação de palavras | 2 | 2 |
| P05.2 | denotação, conotação, polissemia | 2 | 2 |
| P03.3 | charge, tirinha | 1 | 1 |
| P11.3 | Realismo, Naturalismo, Machado | 2 | 2 |
| P12.3 | Modernismo de 30 | 1 | 1 |
| P11.2 | Romantismo | 1 | 1 |
| P12.2 | Modernismo de 22 | 1 | 1 |
| P06.3 | figuras de construção | 1 | 1 |
| P11.1 | Barroco e Arcadismo | 1 | 1 |
| P08.1 | sujeito | 1 | 1 |
| P06.1 | metáfora e afins | 1 | 1 |
| P11.4 | Parnasianismo e Simbolismo | 1 | 1 |
| P05.4 | variação linguística | 1 | 1 |
| P07.1 | classes de palavras | 1 | 1 |
| P07.2 | pronomes | 1 | 1 |
| P09.4 | adverbiais | 1 | 1 |
| P07.3 | verbo | 1 | 1 |
| P02.2 | ponto de vista e modalização | 1 | 1 |
| P09.5 | reduzidas | 1 | 1 |
| P08.4 | predicação | 1 | 0 |

Dificuldade dos 40 ABC: dif 3 = 10, 4 = 6, 5 = 9, 6 = 9, 7 = 6. Todas ficam na faixa de 3 a 7; nenhuma é rara nem de nicho.

## Questões descartadas ou anotadas
- **Nenhum gabarito suspeito** entre as questões lidas. Todos batem com o texto e com a resolução.
- **Duplicata no banco:** P30ab321 e Pf7a8e29 são a mesma questão (São Camilo 2024, tirinha de André Dahmer, gab D). Usei só P30ab321, que traz a fala transcrita no enunciado. Vale apagar uma das duas no banco.
- **Ruído de extração:** em Pa9cccba, a alternativa E termina com " 3" (o número da página veio junto). O gabarito, C, não é afetado. Não editei.
- **Ressalva de leitura:** em P3f3c903 (São Camilo 2017), classificar “Desatravancaram” como sujeito indeterminado é o gabarito oficial (A), e o cartão P08.1 usa o mesmo exemplo. Mantive a questão.
- **Fora por dependência de leitura obrigatória ou por ser de nicho:** Pe492a84 (desfecho de romance), P2c7c8eb (Pégaso) e as questões de dif 8 ou mais.
