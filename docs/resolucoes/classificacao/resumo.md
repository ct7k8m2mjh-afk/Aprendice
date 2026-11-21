# Classificação: resumo por matéria

Conferido pela fábrica de classificação (triagem claude-haiku-5-5; conferência às cegas claude-sonnet-5-5; desempate às cegas claude-opus-5-5). Regra: o conteúdo é o que o COMANDO cobra, não o assunto do texto de apoio. Matéria = a de origem da questão.

| Matéria | Conferidas | Mudaram | Mudaram de matéria | Ficaram | Sem resposta | Sugestão de conteúdo novo |
|---|---|---|---|---|---|---|
| Biologia | 2815 | 639 | 72 | 2175 | 1 | 135 |
| Química | 2869 | 757 | 56 | 2112 | 0 | 53 |
| Matemática | 3538 | 971 | 29 | 2567 | 0 | 53 |
| Português | 4786 | 1593 | 18 | 3193 | 0 | 130 |
| Física | 2785 | 477 | 21 | 2308 | 0 | 3 |
| História | 2465 | 464 | 82 | 2001 | 0 | 14 |
| Geografia | 2583 | 638 | 86 | 1945 | 0 | 12 |
| Inglês | 2518 | 655 | 11 | 1863 | 0 | 23 |
| Filosofia e Sociologia | 1439 | 396 | 53 | 1043 | 0 | 47 |
| **total** | **25798** | **6590** | **428** | **19207** | **1** | **470** |

## Gasto (US$, fabrica_saida/gastos.csv, lotes classif-*)

- bio: 3.75
- fis: 2.58
- fs: 2.98
- geo: 4.07
- his: 3.44
- ing: 4.08
- mat: 4.90
- por: 11.73
- qui: 3.93
- sug: 0.30
- teste: 0.70 (piloto e testes)
- todas: 3.77 (piloto e testes)
- **total: 46.22**

## Como foi conferido

- Piloto de 300 questões (metade suspeitas pelo verificador), conferido por agentes que abriram o print: no formato final,
  em 1 de 30 mudanças sorteadas a classificação antiga era melhor; 7 de 7 mudanças de matéria certas.
- No todo, mais uma amostra sorteada de 30 mudanças de subtema e 30 de matéria, também com o print aberto: 1 erro em cada
  (3%). Os erros achados foram corrigidos à mão (`ajustes-conferencia.json`, 9 questões).
- 4 questões da São Camilo 2024/2 ficaram como estavam: o `resolucoes.json` antigo dessa prova fixa o tema e sobrepõe o
  `prova.json` (RECLASS na caixa da classificação).
- 413 questões que mudaram de matéria e já tinham resolução entraram nos `pendentes` da matéria nova (motivo
  "classificação: resolver na matéria nova"); a resolução antiga continua onde estava.
- "Sem resposta" (1): a triagem não devolveu resposta; a questão ficou como estava.
