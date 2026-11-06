# Triagem das questões de sites didáticos

Comando 21 do dono. Gerado por `app/scripts/triagem_site.py`; dados completos em `triagem-questoes-site.json`.
Nenhuma destas questões aparece mais no site (o conversor `app/scripts/converte.py` as exclui).

Critério: mesma questão = texto >= 0.85 do texto menor (mín. 12 palavras) e mesmo gabarito; busca em todas as provas de conteudo-fonte/provas e no banco antigo de provas.

## Resumo

| Matéria | Questões de site | Viraram questão de prova | Prova a baixar | Questão Aprendice |
|---|---|---|---|---|
| Biologia | 312 | 0 | 5 | 307 |
| Química | 250 | 6 | 6 | 238 |
| Matemática | 98 | 2 | 16 | 80 |
| Português | 128 | 1 | 18 | 109 |
| **Total** | **788** | **9** | **45** | **734** |

## Viraram questão de prova

| Id do site | Matéria · conteúdo | Banca citada | Questão de prova | Conteúdo da prova | Conferido |
|---|---|---|---|---|---|
| W943f6db | Química · Q01.1 | Fuvest/2025 | Fuvest 2025 · Q20 (`P0d500ac3`) | qui · Q01.1 | sim, texto e print |
| Wd135a0d | Química · Q01.5 | UDESC Vespertino/2025.1 | UDESC 2025.1 · Q68 (`P9ac472c1`) | qui · Q01.5 | sim, texto e print |
| W50e87d5 | Química · Q01.5 | ITA 1ª Fase/2023 | ITA 2023 · Q51 (`P7279e690`) | qui · Q01.5 | sim, texto e print |
| W491d7ba | Química · Q04.4 | Enem | ENEM 2025 · Q131 (`Pc5b41568`) | qui · Q04.3 | sim, texto e print |
| W0118eab | Química · Q05.1 | Fatec | Fatec 2022/2 · Q8 (`Pb5d98e3b`) | qui · Q05.3 | sim, texto e print |
| W0ddd0b4 | Química · Q12.5 | Unifor / 2025.1 | Unifor 2025.1 · Q23 (`P48935fc4`) | qui · Q12.5 | sim, texto e print |
| W1316955 | Matemática · M03.5 | Fatec | Fatec 2022/2 · Q8 (`Pb5d98e3b`) | qui · Q05.3 | sim, texto e print |
| W821d598 | Matemática · M11.1 | Enem 2011 | ENEM 2010 · Q146 (`c48f4d25`) | mat · M11.6 | sim, texto (questão do banco antigo) |
| W0a9fd2f | Português · P01.2 | USP | Fuvest 2020 · Q43 (`Pef4a4a77`) | por · P01.2 | sim, texto e print |

## Provas a baixar (não baixadas)

| Prova | Questões | Ids |
|---|---|---|
| ENEM Digital/2020 | 3 | W5bb6c02, W57aca47, W2ca0443 |
| ENEM PPL/2017 | 1 | W94a370c |
| ENEM PPL/2021 | 1 | W387d76f |
| ENEM PPL/2022 | 1 | We2d7752 |
| ENEM PPL/2023 | 1 | We0833a1 |
| ENEM PPL/2024 | 1 | W0b8eac4 |
| ENEM/2003 | 1 | W19d951a |
| ENEM/2004 | 1 | Wa725ab2 |
| ENEM/2008 | 2 | Wdc938b0, We9f5e5b |
| ENEM/2009 | 2 | W81929df, W69b5dd2 |
| ENEM/2010 | 2 | Wc9a7a55, Wc59dd23 |
| ENEM/2012 | 3 | Wd24b850, W33fc81e, Wac6bf4d |
| ENEM/2013 | 1 | Wb5dab1c |
| ENEM/2014 | 2 | W3a643a3, W643082b |
| ENEM/2015 | 2 | W8e20657, W3aa2a67 |
| ENEM/2016 | 3 | W7a7947f, W386e63b, We4f956f |
| ENEM/2017 | 1 | W6ac88fc |
| ENEM/2018 | 5 | Wcb73a63, W18722ec, Wd790cdd, Wdc16194, W8d329ea |
| ENEM/2019 | 3 | Wec2f113, W4121a4c, W0eb9f56 |
| ENEM/2020 | 4 | W845df46, Wbc7a822, W3ecc05a, Wc4a3e7e |
| ENEM/2021 | 1 | W18d5d4d |
| PUC-Rio/2024 | 1 | W39cb2bf |
| URCA/2025 | 1 | W4f69629 |
| Unitins/2021 | 1 | W5d49e70 |
| Unitins/2025 | 1 | W237add0 |

## Questões Aprendice que faltam, por conteúdo

Conta as questões com destino `questao_aprendice` e `prova_a_baixar` (enquanto a prova não for integrada, o conteúdo fica sem elas).

- **Biologia** (312): B01.1 5, B01.2 6, B01.3 4, B01.4 4, B01.5 6, B01.6 5, B02.1 6, B02.2 5, B02.3 5, B02.4 4, B02.5 6, B03.1 6, B03.2 6, B03.3 6, B03.4 4, B03.5 4, B03.6 3, B04.1 6, B04.2 6, B04.3 4, B04.4 5, B04.5 4, B05.1 6, B05.2 5, B05.3 3, B05.4 3, B05.6 3, B06.1 4, B06.2 5, B06.3 4, B06.4 3, B06.5 4, B06.6 3, B07.1 6, B07.2 3, B07.3 4, B07.4 5, B07.5 4, B07.6 4, B08.1 6, B08.2 6, B08.3 5, B08.4 6, B08.5 5, B08.6 2, B08.7 4, B09.1 4, B09.2 5, B09.3 4, B09.4 4, B09.5 5, B09.6 5, B10.1 5, B10.2 4, B10.3 4, B10.4 4, B10.5 4, B11.1 6, B11.2 4, B11.3 5, B11.4 5, B11.5 4, B12.1 3, B12.2 5, B12.3 5, B12.4 5, B12.5 6, B12.6 3
- **Matemática** (96): M01.1 3, M01.2 2, M01.3 1, M01.5 3, M02.3 1, M02.4 1, M02.5 3, M03.2 4, M03.3 3, M03.4 2, M03.5 3, M04.1 1, M04.2 1, M04.4 3, M05.1 1, M05.3 1, M05.4 6, M05.5 2, M06.3 1, M06.4 4, M07.2 1, M07.4 1, M08.4 2, M09.1 2, M09.2 4, M09.3 1, M10.1 2, M10.2 2, M10.3 3, M10.4 2, M10.5 1, M11.3 1, M11.5 1, M12.1 1, M12.3 2, M12.4 2, M12.5 1, M13.2 1, M13.5 1, M14.1 4, M14.2 4, M14.3 3, M14.5 2, M15.2 1, M15.3 2, M16.2 3
- **Português** (127): P01.1 5, P01.2 4, P01.3 3, P01.4 5, P02.1 5, P02.2 3, P02.3 4, P02.4 2, P03.1 2, P03.2 4, P03.3 2, P03.4 5, P04.1 6, P04.2 3, P04.3 2, P04.4 2, P05.1 1, P05.2 2, P05.3 2, P05.4 3, P06.1 6, P06.2 1, P06.3 4, P07.2 1, P07.3 1, P08.1 1, P08.2 1, P08.3 1, P08.4 6, P09.1 2, P09.2 1, P09.3 2, P10.1 4, P10.2 1, P10.3 1, P10.4 2, P10.5 2, P11.1 1, P11.2 2, P11.3 2, P11.4 2, P12.1 3, P12.2 6, P12.3 2, P12.4 3, P12.5 4
- **Química** (244): Q01.1 5, Q01.2 5, Q01.3 6, Q01.4 6, Q01.5 3, Q02.1 6, Q02.2 6, Q02.3 3, Q02.4 4, Q02.5 6, Q03.1 6, Q03.2 5, Q03.3 4, Q03.4 3, Q04.1 4, Q04.2 5, Q04.3 2, Q04.4 2, Q04.5 6, Q05.1 5, Q05.2 3, Q05.3 4, Q05.4 5, Q05.5 4, Q06.1 4, Q06.2 3, Q06.3 6, Q07.1 5, Q07.2 3, Q07.3 5, Q08.1 4, Q08.2 4, Q08.3 5, Q08.4 5, Q08.5 5, Q08.6 1, Q08.7 5, Q09.1 3, Q09.2 4, Q09.3 5, Q09.4 3, Q09.5 4, Q10.1 4, Q10.2 5, Q11.1 5, Q11.2 6, Q11.3 4, Q11.4 5, Q11.5 4, Q11.6 4, Q11.7 5, Q12.1 5, Q12.2 4, Q12.3 4, Q12.4 5, Q12.5 2

## Por que viraram Questão Aprendice

- banca citada sem ano (não dá para saber qual prova): 455
- sem banca citada: 252
- ano anterior a 2020 ou sem caderno oficial no inventário: 15
- banca de fora dos inventários (concurso, colégio técnico ou instituição não listada): 12
