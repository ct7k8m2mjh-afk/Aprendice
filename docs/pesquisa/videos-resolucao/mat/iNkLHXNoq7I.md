<!-- fonte: https://www.youtube.com/watch?v=iNkLHXNoq7I | modelo: gemini-3.5-flash-lite | analisado em 2026-11-05 -->
# LCM and GCD in the ENEM exam 

- Canal: Escola de Números com Thyago Araujo
- Link: https://www.youtube.com/watch?v=iNkLHXNoq7I
- Duração: 24 min

## Questão(ões)
- Questão 01: ENEM (2015), assunto: Matemática, subtema: MDC. Distribuição de ingressos (400 vespertina e 320 noturna) em quantidades iguais para o mínimo de escolas possível.
- Questão 02: ENEM (2015), assunto: Matemática, subtema: MDC. Cortar 40 tábuas de 540cm, 30 de 810cm e 10 de 1080cm em pedaços de mesmo comprimento máximo (menor que 2m) sem sobras.
- Questão 03: ENEM (2016/2ª aplicação), assunto: Matemática, subtema: MMC e PA. Três grupos batem palma a cada 2s, 3s e 4s a partir do instante 1s. Pede o termo geral da sequência de instantes em que batem juntos.

## Passo a passo da resolução
1. [00:37] **Questão 01**: Identifica que busca o número mínimo de escolas, o que implica o número máximo de ingressos por escola (MDC de 400 e 320). Calcula $mdc(320, 400) = 80$ ingressos por escola. Divide 320 por 80 (4 escolas noturnas) e 400 por 80 (5 escolas vespertinas), somando $4 + 5 = 9$ escolas (letra c).
2. [08:05] **Questão 02**: Busca o maior tamanho de peça possível e menor que 2m. Corta os zeros finais de 540, 810 e 1080 representando por um fator 10 ($2 \times 5$). Calcula o MDC dos números restantes, obtendo o MDC de 540, 810 e 1080 como 270 cm (2,7 m). Como deve ser menor que 2m, elimina o fator 2 do MDC, resultando em $135$ cm. Calcula a quantidade de peças: 4 tábuas de 540 dão $4 \times 4 = 160$, 30 tábuas de 810 dão $6 \times 30 = 180$, e 10 tábuas de 1080 dão $8 \times 10 = 80$, totalizando $160 + 180 + 80 = 420$ peças (letra e).
3. [19:36] **Questão 03**: Calcula o MMC dos intervalos de palmas: $mmc(2, 3, 4) = 12$ segundos. Identifica que a sequência de instantes em que batem juntos é uma PA de primeiro termo 1 e razão 12 ($1, 13, 25, 37, 49$). Utiliza o termo geral da PA: $a_n = a_1 + (n-1)r$, resultando em $1 + (n-1) \cdot 12$, equivalente a $12(n-1) + 1$, com $1 \le n \le 5$ (letra d).

## Leitura do enunciado
- **Questão 01**: Grifa os valores numéricos (400 ingressos para sessão vespertina, 320 para noturna) e os critérios (cada escola recebe para uma única sessão, mesmo número de ingressos, sem sobras). Destaca a expressão "número mínimo de escolas".
- **Questão 02**: Grifa quantidades e tamanhos das tábuas (40 tábuas de 540 cm, 30 de 810 cm, 10 de 1080 cm), a exigência de "mesmo comprimento, sem deixar sobras", "maior tamanho possível" e "comprimento menor que 2 m".
- **Questão 03**: Grifa os intervalos de palmas (grupo A a cada 2s, B a cada 3s, C a cada 4s), o instante inicial de registro (1 s), o limite de tempo (60 s) e o que é pedido ("termo geral da sequência").

## Organização dos dados e notação
- Anotações feitas diretamente na tela da questão digitalizada com caneta digital (marcações em amarelo e anotações em vermelho).
- Uso da notação de MDC: $mdc(320, 400)$ e $mdc(540, 810, 1080)$.
- Decomposição simultânea em fatores primos com barras verticais e circulação dos divisores comuns.
- Indicação clara de PA e fórmula do termo geral $a_n = a_1 + (n-1)r$.

## Teoria mobilizada
- **MDC (Máximo Divisor Comum)**: Explicado como a ferramenta para dividir valores em partes iguais, sem sobras e no maior tamanho/quantidade possível [03:16, 09:09]. Gasta cerca de 3 a 5 minutos por questão explicando a teoria aplicada.
- **MMC (Mínimo Múltiplo Comum)**: Explicado como o cálculo para sincronizar eventos que ocorrem em tempos diferentes [21:06]. Propriedade de eliminar números contidos e multiplicar consecutivos [21:35].
- **Progressão Aritmética (PA)**: Fórmula do termo geral $a_n = a_1 + (n-1)r$ [23:09].

## Alternativas
- Não discute detalhadamente cada distrator individualmente em todas as questões, focando em justificar o gabarito correto encontrado e alertando sobre pegadinhas específicas (como o tamanho menor que 2m na Questão 02).
- Na Questão 03, aponta por que o limite de $n$ deve ser até 5 devido à restrição de 60 segundos [24:03].

## Conferência
- Na Questão 01, confere a divisão das escolas obtendo números inteiros exatos [17:21].
- Na Questão 02, confere a conversão de centímetros para metros (270 cm = 2,7 m) e a necessidade de ajustar pelo menor fator para atender à restrição de menor que 2 m [13:55].
- Na Questão 03, confere os valores gerados pela PA e o limite temporal de 60 segundos [22:22].

## Dicas, atalhos e pegadinhas
- "Quanto menor o número de escolas, maior o número de ingressos (máximo)" [02:43].
- "Toda vez que os números terminam em zero, você pode cortar os zeros e colocar um 2 e um 5 lá em cima para representar o 10" (atalho para MDC) [11:02].
- "Para MDC, só me interessam os números que dividem todos ao mesmo tempo" [05:27].
- "Número contido no MMC pode ser eliminado; números consecutivos basta multiplicar" [21:46].

## Estilo didático
- Ritmo dinâmico, motivacional e informal ("Fala minha turma maravilhosa!").
- Utiliza repetição e ênfase em palavras-chave ("vai memorizando esses sinais").
- Linguagem acessível, usa analogias do dia a dia e valida o aluno ("você que está distraído...").
- Excelente didática para alunos com dificuldades básicas em matemática por explicar cada detalhe das passagens algébricas e aritméticas.
