<!-- fonte: https://www.youtube.com/watch?v=JUM7qKzmYOg | modelo: gemini-3.5-flash-lite -->
# ENEM 2025 - Análise Combinatória

- Canal: Fábrica de Matemática
- Link: https://www.youtube.com/watch?v=JUM7qKzmYOg
- Duração: 4 min

## Questão(ões)
- ENEM (ano e número não ditos); Matemática; Análise combinatória.
- Um pai comprou 8 presentes diferentes para seus três filhos, com regras específicas de distribuição (filhos mais velho e mais novo recebem 3 presentes cada, do meio recebe 2; o mais velho ganha um celular ou uma bicicleta, mas não ambos). Pede-se o número de maneiras distintas de fazer essa distribuição.

## Passo a passo da resolução
1. [00:48] O professor lista os 8 presentes e define a quantidade que cada filho vai receber (mais velho: 3, mais novo: 3, do meio: 2) e a restrição do mais velho (celular ou bicicleta, mas não ambos).
2. [01:59] Calcula as maneiras de escolher o presente restrito do filho mais velho: como ele pode ganhar ou o celular ou a bicicleta (2 opções), ele escolhe 1 entre esses 2. Raciocínio: $2$ opções.
3. [02:18] Calcula as escolhas restantes para o filho mais velho: dos 6 presentes restantes, ele escolhe 2, pois a ordem não importa. Usa combinação: $C_{6,2}$.
4. [02:59] Calcula as escolhas para o filho mais novo: dos 5 presentes restantes após a entrega ao mais velho, ele escolhe 3. Usa combinação: $C_{5,3}$.
5. [03:22] Calcula as escolhas para o filho do meio: dos 2 presentes restantes, ele escolhe os 2. Usa combinação: $C_{2,2}$.
6. [03:28] Explica a regra do "e" (multiplica) e do "ou" (soma) para distribuir os presentes aos filhos sequencialmente e monta a expressão final: $2 \times C_{6,2} \times C_{5,3} \times C_{2,2}$.
7. [03:59] Calcula cada combinação separadamente: $C_{6,2} = 15$, $C_{5,3} = 10$, $C_{2,2} = 1$.
8. [04:33] Multiplica todos os valores: $2 \times 15 \times 10 \times 1 = 300$, chegando à resposta letra C.

## Leitura do enunciado
- O professor lê o enunciado em voz alta pausadamente a partir de [00:13]. Não há grifos visuais ou destaques por cores no texto original do enunciado durante a leitura. Ele identifica os dados principais oralmente à medida que começa a passar para o papel.

## Organização dos dados e notação
- Anota os 8 presentes em forma de lista vertical: "celular", "bicicleta", "bola", "livro", "War", "camisa", "caneta", "meia".
- Cria colunas para os três filhos ("+ velho", "+ novo", "do meio") e indica abaixo de cada um os espaços para os presentes correspondentes ($3$, $3$ e $2$).
- Usa a notação de combinação com a letra $C$ (ex: $C_{6,2}$).
- Usa setas e símbolos de multiplicação ($\times$).

## Teoria mobilizada
- Conceito de Combinação simples (análise combinatória, onde a ordem dos elementos não importa).
- Princípio Fundamental da Contagem (multiplicação de eventos independentes sequenciais).
- O tempo gasto explicando a teoria e as regras "e/ou" ocorre de forma integrada durante a montagem da expressão entre [03:28] e [03:40].

## Alternativas
- Não analisou individualmente as alternativas incorretas; calculou o valor final diretamente e comparou com as opções disponíveis para marcar a letra C.

## Conferência
- Não realizada explicitamente (não refez o cálculo por outro método e não verificou unidades ou ordens de grandeza).

## Dicas, atalhos e pegadinhas
- "Lembre, pessoal, que quando é 'e' você multiplica, quando é 'ou' você soma" [03:29].
- "A ordem de escolha não importa [...] temos um problema de combinação" [02:24].
- "Fazendo de cabeça" para agilizar o cálculo de algumas combinações simples [04:28].

## Estilo didático
- Ritmo dinâmico, entusiasta e encorajador ("Sensacional, né, professor? É!").
- Linguagem informal e direta ("galera", "coleguinhas").
- Nível de detalhe alto no passo a passo das contas (abre o fatorial passo a passo).
- Ótimo para engajar alunos, embora o uso constante de autopermissões ("né, professor?") dê um tom peculiar de monólogo interativo.
