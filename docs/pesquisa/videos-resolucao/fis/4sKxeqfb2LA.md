<!-- fonte: https://www.youtube.com/watch?v=4sKxeqfb2LA | modelo: gemini-3.5-flash-lite | analisado em 2026-11-05 -->
# The best technique for solving electrical circuits - part 1 - with professor Renato Brito

- Canal: Física Com Renato Brito
- Link: https://www.youtube.com/watch?v=4sKxeqfb2LA
- Duração: 7 min

## Questão(ões)
- **Assunto:** Física / Eletrodinâmica
- **Subtema:** Circuitos elétricos (Leis de Ohm e Leis de Kirchhoff)
- **Enunciado:** O professor apresenta um circuito elétrico misto com uma fonte de tensão de 90 V, diversos resistores com valores conhecidos (15 Ω, 12 Ω, 3 Ω, 6 Ω) e um resistor com valor desconhecido $R$. Sabendo que a corrente que passa pelo resistor de 15 Ω é de 2 A, o objetivo é encontrar todas as correntes do circuito e o valor da resistência $R$.

## Passo a passo da resolução
1. [00:23] **Atribuição do potencial de referência (0 V):** O professor define a linha inferior do circuito como o potencial de referência de $0\text{ V}$.
2. [00:41] **Cálculo do potencial após a fonte:** Ao passar pela bateria de $90\text{ V}$ do polo negativo para o positivo, o potencial sobe para $+90\text{ V}$.
3. [01:04] **Cálculo do potencial após o resistor superior (15 Ω):** Sabendo que a corrente pelo resistor de $15\ \Omega$ é $2\text{ A}$ da esquerda para a direita, a queda de tensão é $15 \times 2 = 30\text{ V}$. Portanto, o potencial no nó superior direito cai de $90\text{ V}$ para $60\text{ V}$.
4. [01:25] **Cálculo da corrente no resistor de 6 Ω:** O resistor de $6\ \Omega$ está ligado entre o potencial de $60\text{ V}$ e $0\text{ V}$. A ADP é $60 - 0 = 60\text{ V}$. Usando $i = \frac{U}{R}$, obtém-se $i = \frac{60}{6} = 10\text{ A}$ (descendo).
5. [02:20] **Cálculo da corrente no resistor de 3 Ω (1ª Lei de Kirchhoff / Nós):** Analisando o nó onde chegam a corrente de $2\text{ A}$ (do resistor superior) e a corrente que desce de $10\text{ A}$ pelo resistor de $6\ \Omega$, o professor deduz que a corrente no resistor de $3\ \Omega$ é de $8\text{ A}$ (indo para a esquerda).
6. [02:47] **Cálculo do potencial no nó central:** Movendo-se no sentido contrário à corrente de $8\text{ A}$ pelo resistor de $3\ \Omega$, o potencial aumenta: $60 + (3 \times 8) = 60 + 24 = 84\text{ V}$.
7. [03:15] **Cálculo da corrente no resistor de 12 Ω:** O resistor de $12\ \Omega$ está entre $84\text{ V}$ e $0\text{ V}$. A ADP é $84\text{ V}$, logo $i = \frac{84}{12} = 7\text{ A}$ (descendo).
8. [04:33] **Cálculo da corrente no resistor $R$:** Analisando o nó central superior, a corrente que chega da esquerda (através de $R$) divide-se em $8\text{ A}$ (para a direita) e $7\text{ A}$ (para baixo). Logo, a corrente em $R$ é $8 + 7 = 15\text{ A}$.
9. [05:03] **Cálculo da corrente total na bateria:** No nó superior esquerdo, somam-se a corrente de $15\text{ A}$ (vindo de $R$) e a corrente de $2\text{ A}$ (vindo do resistor superior). Logo, a corrente total que passa pela bateria é $15 + 2 = 17\text{ A}$.
10. [05:33] **Cálculo da resistência $R$:** A ADP sobre o resistor $R$ é a diferença entre $90\text{ V}$ (nó esquerdo) e $84\text{ V}$ (nó central), que resulta em $6\text{ V}$. Utilizando $R = \frac{U}{i}$, tem-se $R = \frac{6\text{ V}}{15\text{ A}} = 0,4\ \Omega$.

## Leitura do enunciado
- [00:00] O professor lê o enunciado diretamente do diagrama desenhado na lousa, destacando os valores fornecidos (como os $2\text{ A}$ na resistência de $15\ \Omega$ e a fonte de $90\text{ V}$) e o que é pedido (todas as correntes e a resistência $R$). Não há texto de contexto textual longo, pois o problema é puramente esquemático.

## Organização dos dados e notação
- [00:23] O professor anota os potenciais elétricos diretamente nos nós do circuito usando tinta vermelha (ex: $0\text{ V}$, $+90\text{ V}$, $+60\text{ V}$, $+84\text{ V}$).
- As correntes são indicadas com setas e valores em azul junto aos resistores.
- As fórmulas (como $i = \frac{U}{R}$) são escritas em destaque no lado direito da lousa.

## Teoria mobilizada
- **1ª Lei de Ohm:** $U = R \cdot i$ (ou $i = \frac{U}{R}$ e $R = \frac{U}{i}$), aplicada extensivamente ao longo de todo o vídeo.
- **Lei das Malhas / Variação de Potencial:** O professor utiliza o conceito de que o potencial elétrico diminui a favor da corrente e aumenta contra a corrente em um resistor.
- **1ª Lei de Kirchhoff (Leis dos Nós):** Conservação das correntes elétricas nos nós do circuito.
- O tempo gasto explicando e relembrando a teoria ocorre de forma integrada aos passos, sem uma introdução teórica isolada longa.

## Alternativas
- Não observado (questão discursiva/aberta resolvida passo a passo na lousa).

## Conferência
- [03:52] O professor realiza divisão passo a passo na lousa (ex: $\frac{84}{12} = 7$) e verifica as multiplicações mentalmente (ex: $3 \times 8 = 24$, $60 + 24 = 84$) antes de avançar para o próximo passo.

## Dicas, atalhos e pegadinhas
- **Macete principal:** "Mete o zero e sai andando" — técnica de atribuir $0\text{ V}$ a um fio de referência para propagar os potenciais pelos nós do circuito, evitando o uso de sistemas complexos de equações de Kirchhoff.
- Frase-chave: *"Se a favor da corrente o potencial diminui, contra a corrente o potencial aumenta."*

## Estilo didático
- **Ritmo e tom:** Dinâmico, informal, entusiasmado e bem-humorado ("rapaz", "danado", "professor é doido").
- **Linguagem:** Acessível, em português coloquial do Brasil, com analogias simples de percurso ("passar pela bateria", "subir ou descer o potencial").
- **Nível de detalhe:** Alto nível de detalhamento algébrico e conceitual, ideal para alunos que têm dificuldade com análise de malhas e nós em eletrodinâmica.
