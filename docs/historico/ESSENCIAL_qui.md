# Química: Treino geral, o essencial (29/10/2026)

Saída: `ESSENCIAL_qui.json`, com 40 questões ABC e 40 frases de completar. Não mexi em dados.json nem em index.html.

## Método
- **Ranking:** usei a incidência por módulo de `ANALISE_FLASH50_qui.md`. São só questões de prova, com peso dobrado para a São Camilo e peso 1,5 para provas de 2021 em diante. Dividi os 40 itens de cada parte entre os módulos na proporção desse peso.
- **ABC:** só entraram questões com tipo 'prova', degrau > 0 e gabarito presente. Escolhi primeiro a São Camilo, depois Santa Casa, Unesp, Einstein e Fuvest. Nenhuma questão de lista entrou.
  - Li o enunciado e as alternativas de todas as 40 e resolvi cada uma.
  - Nas questões com figura, abri o print (crop_prova, novas/prints e sc_novas/qui/prints) para conferir o gabarito contra a figura.
  - Não ficaram duas questões cobrando a mesma ideia.
- **Completar:** cada frase saiu de um cartão de teoria revisado. Recortei o cartão sem mudar o sentido, e a resposta aparece no próprio cartão (conferido por script).
  - Deixei de fora as ideias que os 50 flashcards já perguntam, como ΔHf, Hess, R, pH, carbono quiral, limitante e polos da pilha. Nesses temas usei um ângulo vizinho: no carbono quiral, por exemplo, a frase cobra a regra 2ⁿ.
  - Cada lacuna tem uma resposta só. Troquei dois rascunhos que admitiam outra resposta correta:
    - "proporção em ___" aceitaria "volume" no caso de gases;
    - "mesma fórmula ___" aceitaria "mínima".
- **Validação (Python):** os 40 ids existem no banco e não se repetem. Todas as 40 frases têm exatamente um "___". Todos os mod, sub e títulos de cartão existem.

## Distribuição por módulo (ABC = completar)
| módulo | peso % | ABC | completar |
|---|---|---|---|
| Q01 Átomo e tabela | 4,4 | 2 | 2 |
| Q02 Ligações e forças | 7,0 | 3 | 3 |
| Q03 Inorgânica e nox | 8,9 | 3 | 3 |
| Q04 Mol e estequiometria | 10,8 | 4 | 4 |
| Q05 Soluções | 7,2 | 3 | 3 |
| Q06 Gases | 5,4 | 2 | 2 |
| Q07 Termoquímica | 8,0 | 3 | 3 |
| Q08 Cinética, equilíbrio e pH | 14,3 | 6 | 6 |
| Q09 Eletroquímica e radioatividade | 11,9 | 5 | 5 |
| Q10 Coligativas | 2,5 | 1 | 1 |
| Q11 Orgânica: estrutura e isomeria | 9,5 | 4 | 4 |
| Q12 Orgânica: reações e biomoléculas | 10,2 | 4 | 4 |

- **ABC por escola:** São Camilo 25, Santa Casa 7, Unesp 5, Einstein 2, Fuvest 1.
- **ABC por dificuldade:** 2 (×2), 3 (×11), 4 (×13), 5 (×4), 6 (×7), 7 (×2), 8 (×1). São 37 de 40 entre dif 3 e 7.

## Questões descartadas
- **P6fdaa81 (São Camilo 2024, meia-vida do iodo-125):** o gabarito D bate com a conta, mas o enunciado é ambíguo. Diz "foi medida a massa residual de 1 g", quando 1 g é a massa inicial, e não há print para o aluno conferir. Entrou no lugar a **Pf7012c2** (Santa Casa 2018, gálio-67, meia-vida lida no gráfico).
- **Pb76c9c1 (Santa Casa 2021, oxidação a C₄H₈O₂):** as alternativas são só figuras e o banco não tem o texto delas. Ficou fora. A oxidação de aldeído entra pela P382532c (Fehling).
- **Gabarito errado:** não achei nenhum entre as questões analisadas.

## As 40 ABC (id · conteúdo · escola e ano · dif · gabarito conferido)
- **Q01:** Pa0c25dd (Q01.2, SC 2021, d3, C) · P0d022d4 (Q01.5, Fuvest 2025, d4, B)
- **Q02:** P4005266 (Q02.3, Unesp 2021, d4, B) · Pf8747c6 (Q02.4, SCasa 2018, d3, E) · Pc5a19d7 (Q02.4, SCasa 2023, d6, A)
- **Q03:** Pf8f018d (Q03.4, SC 2024, d5, B) · P79ad435 (Q03.4, SC 2015, d2, B) · P79ae436 (Q03.3, SC 2014, d3, A)
- **Q04:** P5a53055 (Q04.1, SC 2024, d6, C) · P46d60c8 (Q04.2, SC 2022, d4, A) · Pa5f2c2b (Q04.3, Unesp 2026, d6, C) · P591931f (Q04.4, SC 2022, d4, D)
- **Q05:** P8ca9a74 (Q05.2, SC 2015, d4, A) · P6364cfb (Q05.3, SC 2023, d2, D) · P967a049 (Q05.5, SC 2021, d4, B)
- **Q06:** P941ccd1 (Q06.2, SC 2021, d6, A) · Pafed037 (Q06.2, SC 2022, d5, E)
- **Q07:** P7ac905b (Q07.2, SC 2015, d3, A) · P3837fa0 (Q07.2, SC 2021, d6, E) · P4b8697a (Q07.1, SC 2024, d3, A)
- **Q08:** P48783a7 (Q08.6, SC 2015, d3, D) · Pfbabaa0 (Q08.6, Unesp 2026, d7, A) · P70d720f (Q08.4, SC 2025, d4, D) · P9579aee (Q08.5, SCasa 2022, d6, E) · P8083be1 (Q08.1, SC 2023, d4, A) · Pa2c8972 (Q08.2, Einstein 2024, d3, D)
- **Q09:** P6b8f55a (Q09.1, SC 2025, d3, C) · Pc6e102f (Q09.2, SC 2021, d4, E) · P90f9f67 (Q09.2, Einstein 2023, d8, E) · Pd3d723d (Q09.4, Unesp 2021, d4, C) · Pf7012c2 (Q09.5, SCasa 2018, d5, C)
- **Q10:** P498924c (Q10.1, SC 2024, d7, A)
- **Q11:** Pf41093f (Q11.6, SC 2024, d4, C) · P4ec3c8a (Q11.1, SC 2024, d6, A) · P2e8e8c0 (Q11.3, SCasa 2018, d4, B) · P5079713 (Q11.4, SC 2015, d3, B)
- **Q12:** P641df45 (Q12.2, SCasa 2019, d5, E) · P382532c (Q12.2, SC 2021, d3, C) · Pcd2f026 (Q12.3, SCasa 2026, d4, A) · P0dfb369 (Q12.4, Unesp 2024, d3, E)

**Resumo das contas conferidas:**
- **Q01:** Sm-147 tem 85 nêutrons e Nd-143 tem 83, diferença de 2; o Nd³⁺ tem 57 e⁻; o óxido é Nd₂O₃.
- **Q03:** no bafômetro, x + y = 3 + 7 = 10, e o dicromato é laranja.
- **Q04:**
  - cetirizina: 50 mg ÷ 388,5 × 21 C × 6 × 10²³ ≈ 1,6 × 10²¹;
  - cânfora: C₁₀H₁₆O;
  - 869 kg de MnO₂ ÷ 86,9 g/mol = 10⁴ mol;
  - Al₂S₃: o H₂S é o limitante, e 6 ÷ 3 = 2 mol.
- **Q05:** vitamina C: 0,15 g/L ÷ 176 ≈ 8,5 × 10⁻⁴ mol/L.
- **Q06:**
  - N₂O + 2 H₂O: 1 200 mol × 0,08 × 530 ÷ 1 000 ≈ 51 atm;
  - M = 1,62 × 0,08 × 340 ≈ 44 g/mol (CO₂).
- **Q07:**
  - ΔH = −394 − 483,2 + 74,9 = −802,3 kJ;
  - Hess: eq. 3 + 3 × eq. 4 = 206 − 726 = −520 kJ.
- **Q09:**
  - ddp Mn/Ni = 0,95 V;
  - eletrólise da água: 0,40 − (−0,83) = 1,23 V;
  - cobre: Q = 0,2 A × 4 800 s = 960 C, que depositam ≈ 0,32 g de Cu;
  - Ga-67: t½ = 80 h, e 740 → 92,5 MBq são 3 meias-vidas = 240 h = 10 dias.
- **Q10:** partículas: III 2,0 > IV 1,8 > V 1,6 > II 1,5 > I 0,9.
