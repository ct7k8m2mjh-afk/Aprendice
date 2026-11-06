<!-- fonte: https://www.youtube.com/watch?v=-0Umf3pYhs4 | modelo: gemini-3.1-flash-lite -->
# Fuvest 2019 Mathematics Solutions - Question 55 - Probability

- Canal: Professor Mateca
- Link: https://www.youtube.com/watch?v=-0Umf3pYhs4
- Duração: 5 min

Este relatório descreve a metodologia de ensino utilizada pelo professor no vídeo de resolução da questão da Fuvest.

## Questão(ões)
*   **Prova/Ano:** FUVEST 2019, questão 55.
*   **Assunto:** Probabilidade.
*   **Enunciado:** Uma seta inicia na posição zero e, após cinco rodadas, pode se mover um passo para a esquerda, para a direita ou permanecer na mesma posição (todas com igual probabilidade). Pede-se a probabilidade de a seta retornar à posição zero.

## Passo a passo da resolução
1.  **[00:43]** O professor analisa o alcance do movimento da seta. Explica que, com cinco movimentos, ela não pode chegar além da posição 2 ou -2 (se ela fosse até a posição 3, não conseguiria retornar).
2.  **[01:27]** Calcula o número total de possibilidades (espaço amostral). Cada uma das 5 rodadas tem 3 opções, logo $3^5 = 243$.
3.  **[01:57]** Identifica os cenários favoráveis para retornar ao zero: 
    *   **Cenário 1:** Ficar parado em todas as rodadas (P, P, P, P, P). Conta: 1 maneira.
    *   **Cenário 2:** Ir duas vezes para a direita e duas para a esquerda, ficando parado uma vez (D, D, E, E, P). Conta: utiliza permutação com repetição: $\frac{5!}{2!2!} = 30$ maneiras.
    *   **Cenário 3:** Ir uma vez para a direita, uma para a esquerda e ficar parado três vezes (D, E, P, P, P). Conta: permutação com repetição: $\frac{5!}{3!} = 20$ maneiras.
4.  **[04:47]** Soma os casos favoráveis: $1 + 30 + 20 = 51$.
5.  **[05:05]** Calcula a probabilidade final: $51 / 243$. Simplifica por 3, resultando em $17 / 81$.

## Leitura do enunciado
O professor lê o enunciado em voz alta enquanto aponta com a caneta. Ele não grifa o texto, mas foca na informação de que há "três possibilidades com igual probabilidade" e utiliza o gráfico da reta numérica (que já aparece no enunciado) para desenhar os caminhos. Ele interpreta a questão destacando que a parte mais difícil é listar os movimentos possíveis.

## Organização dos dados e notação
Ele utiliza uma notação própria escrita à mão: "P" para Parado, "D" para Direita e "E" para Esquerda. Ele desenha círculos na reta numérica para marcar as posições que a seta pode atingir. As contas são dispostas de forma linear à direita do enunciado impresso.

## Teoria mobilizada
O professor mobiliza o conceito de **Análise Combinatória (Permutação com repetição)**. Ele gasta pouco tempo explicando a fórmula, aplicando-a diretamente como uma ferramenta para encontrar as possibilidades de arranjo dos movimentos.

## Alternativas
Não observado. O professor resolve a questão do início ao fim sem analisar as alternativas erradas ou explicar o motivo dos distratores; ele simplesmente chega ao resultado e marca a alternativa correspondente (B).

## Conferência
O professor não faz uma conferência formal ou verificação por substituição. Ele confia no processo de contagem das permutações que ele mesmo estruturou.

## Dicas, atalhos e pegadinhas
*   **Frase-chave:** "Essa é a parte mais chata, entender quais são os possíveis movimentos".
*   **Atalho:** O professor utiliza a permutação com repetição para evitar listar as 51 combinações manualmente, o que seria um erro comum e demorado.
*   **Alerta:** Ele aponta que o aluno precisa perceber que, se a seta for muito longe (ex: posição 3), ela não consegue retornar ao ponto inicial no tempo restante, descartando assim valores fora do intervalo [-2, 2].

## Estilo didático
O estilo é direto e pragmático. O uso da caneta digital sobre a folha dá um tom de "resolução de mesa de estudo", o que aproxima o professor do aluno. O ritmo é constante e o detalhamento é bom, mas é uma resolução focada em quem já possui uma base matemática, já que ele pula rapidamente para a fórmula de permutação sem uma revisão teórica aprofundada.
