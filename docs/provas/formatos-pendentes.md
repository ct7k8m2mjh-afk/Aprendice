# Provas com formato que o site ainda não suporta

O simulado e as telas de questão do site corrigem **uma letra por questão** (A–E ou A–D). Provas em outro formato
não foram forçadas nesse molde: ficam registradas aqui, com os links oficiais, até o site ganhar o formato.
Registro do lote 1 de provas públicas (06/11/2026). Fonte dos links: `inventario-publicas-1.json` e `inventario-publicas-2.json`.

## UnB — PAS 3 (Cebraspe)

- **Formato:** itens tipo A (certo/errado, com pontuação negativa para erro), tipo B (resposta numérica de 000 a 999),
  tipo C (múltipla escolha A–D) e tipo D (discursivo), mais redação. A maior parte da prova é certo/errado.
- **Por que ficou de fora:** um item certo/errado não tem alternativas A–E; o gabarito é "C" ou "E" por item, e a nota
  desconta erro. Pegar só os itens tipo C quebraria a prova inteira (o simulado é sempre a prova completa).
- **O que o site precisa para entrar:** tipo de questão "certo/errado" (vários itens julgados sobre o mesmo texto,
  com correção C/E e, de preferência, a regra de desconto do Cebraspe) e tipo "resposta numérica".
- **Edições com caderno + gabarito definitivo confirmados (etapa 3, ano = ingresso):**

| Ano | Caderno | Gabarito definitivo |
|---|---|---|
| 2020 | https://cdn.cebraspe.org.br/pas/arquivos/463_PAS_3_2019_Matriz.pdf | https://cdn.cebraspe.org.br/pas/arquivos/Gab_Definitivo_463_PAS_3_2019_Matriz.pdf |
| 2021 (parte I) | https://cdn.cebraspe.org.br/pas/arquivos/565_PAS3_001_01.pdf | https://cdn.cebraspe.org.br/pas/arquivos/Gab_Definitivo_565_PAS3_001_01.PDF |
| 2021 (parte II) | https://cdn.cebraspe.org.br/pas/arquivos/565_PAS3_002_01.pdf | https://cdn.cebraspe.org.br/pas/arquivos/Gab_Definitivo_565_PAS3_002_01.PDF |
| 2022 (parte I) | https://cdn.cebraspe.org.br/pas/arquivos/639_PAS3_001_01.pdf | https://cdn.cebraspe.org.br/pas/arquivos/Gab_Definitivo_639_PAS3_001_01.PDF |
| 2022 (parte II) | https://cdn.cebraspe.org.br/pas/arquivos/639_PAS3_002_01.pdf | https://cdn.cebraspe.org.br/pas/arquivos/Gab_Definitivo_639_PAS3_002_01.PDF |
| 2023 | https://cdn.cebraspe.org.br/pas/arquivos/762_PAS3_001_01.pdf | https://cdn.cebraspe.org.br/pas/arquivos/Gab_Definitivo_762_PAS3_001_01.PDF |
| 2024 | https://cdn.cebraspe.org.br/pas/arquivos/884_PAS3_001_01.pdf | https://cdn.cebraspe.org.br/pas/arquivos/Gab_Definitivo_884_PAS3_001_01.PDF |
| 2025 | https://cdn.cebraspe.org.br/pas/arquivos/987_PAS3_001_01.pdf | https://cdn.cebraspe.org.br/pas/arquivos/Gab_Definitivo_987_PAS3_001_01.PDF |
| 2026 | https://cdn.cebraspe.org.br/pas/arquivos/077536BBBF4035671C6EB262F8C83C123E682EE187680C35F7E0E1369F1C024C.pdf | https://cdn.cebraspe.org.br/pas/arquivos/CE0F9E3E5E56DF8D9F4654CE208D468232CEDDF2CE1D4C153567B4252E01905B.pdf |

O caderno e o gabarito de 2025 já estão baixados em `fabrica_saida/ingestao/unb-pas3-2025/` (fora do git).

## UEM — Vestibular (somatória)

- **Formato:** 50 questões objetivas de **somatória**: cada questão tem 5 proposições numeradas 01, 02, 04, 08 e 16;
  a resposta é a soma das corretas (00 a 31), com pontuação proporcional. Mais redação.
- **Por que ficou de fora:** não existe "a alternativa certa" — o aluno julga cada proposição e informa a soma.
  Transformar em A–E alteraria a questão (proibido pelo princípio 1).
- **O que o site precisa para entrar:** tipo de questão "somatória" (marcar as proposições corretas, mostrar a soma,
  corrigir pela soma oficial e dar nota proporcional como a UEM).
- **Edições com caderno + gabarito definitivo (gabdef) confirmados:**

| Edição | Caderno | Gabarito definitivo |
|---|---|---|
| Verão 2020 (P1) | https://www.vestibular.uem.br/provas/ve20/P1.pdf | https://www.vestibular.uem.br/provas/ve20/gabdef.pdf |
| Verão 2021 | https://www.vestibular.uem.br/provas/ve21/P1.pdf | https://www.vestibular.uem.br/provas/ve21/gabdef.pdf |
| Verão 2022 | https://www.vestibular.uem.br/provas/ve22/P1.pdf | https://www.vestibular.uem.br/provas/ve22/gabdef.pdf |
| Verão 2023 | https://www.vestibular.uem.br/provas/ve23/P1.pdf | https://www.vestibular.uem.br/provas/ve23/gabdef.pdf |
| Inverno 2023 | https://www.vestibular.uem.br/provas/in23/P1.pdf | https://www.vestibular.uem.br/provas/in23/gabdef.pdf |
| Verão 2024 | https://www.vestibular.uem.br/provas/ve24/P1.pdf | https://www.vestibular.uem.br/provas/ve24/gabdef.pdf |
| Inverno 2024 | https://www.vestibular.uem.br/provas/in24/P1.pdf | https://www.vestibular.uem.br/provas/in24/gabdef.pdf |
| Verão 2025 | https://www.vestibular.uem.br/provas/ve25/P1.pdf | https://www.vestibular.uem.br/provas/ve25/gabdef.pdf |
| Inverno 2025 | https://www.vestibular.uem.br/provas/in25/P1.pdf | https://www.vestibular.uem.br/provas/in25/gabdef.pdf |
| Inverno 2026 | https://www.vestibular.uem.br/provas/in26/P1.pdf | https://www.vestibular.uem.br/provas/in26/gabdef.pdf |

Nada da UEM foi baixado.

## UFSC — Vestibular Unificado UFSC/IFC (somatória)

Registro do lote 2 (06/11/2026). Fonte dos links: `inventario-publicas-2.json`.

- **Formato:** objetivas de **somatória** (proposições 01, 02, 04, 08, 16, 32, 64; a resposta é a soma das corretas) e
  algumas questões abertas numéricas, em três dias (P1, P2 e discursivas/redação). Cadernos por cor (referência: amarelo).
- **Por que ficou de fora:** como na UEM, não há "a alternativa certa"; transformar em A–E alteraria a questão (princípio 1).
- **O que o site precisa para entrar:** o mesmo tipo "somatória" da UEM (marcar proposições, mostrar a soma, nota
  proporcional) e o tipo "resposta numérica" (00 a 99).
- **Edições com caderno + gabarito revisto confirmados:**

| Edição | Caderno (P1, amarelo) | Gabarito revisto (P1) |
|---|---|---|
| 2024 | https://vestibular2024.paginas.ufsc.br/files/2023/12/p1_amarela.pdf | https://vestibular2024.paginas.ufsc.br/files/2023/12/novo_gabarito_p1_amarela.pdf |
| 2026 | https://vestibularunificado2026.paginas.ufsc.br/files/2014/12/p1_amarela.pdf | https://vestibularunificado2026.paginas.ufsc.br/files/2025/12/novo_gabarito_p1_amarela.pdf |

A Prova 2 de cada ano fica na mesma pasta (`p2_amarela.pdf` + `novo_gabarito_p2_amarela.pdf`). 2020, 2022, 2023 e 2025
estão em dados.coperve.ufsc.br, cuja cadeia de certificado não fecha fora do navegador (baixar à mão); 2021 sem prova própria.
