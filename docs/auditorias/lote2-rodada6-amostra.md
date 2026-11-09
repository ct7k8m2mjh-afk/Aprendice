# Amostra para a auditoria separada — lote 2, rodadas 5 e 6 (09/11/2026)

Sorteio fixo (semente 9): 3 questões por prova da rodada 6 com mais de 40 questões (2 nas menores) e 2 por prova da
rodada 5. Para cada questão, o auditor (agente que não fez o trabalho) confere: print fiel e completo
(`app/conteudo-fonte/provas/<id>/q/<NNN>.webp`), gabarito igual ao oficial (links em `fontes` do `prova.json`) e
matéria/tema/conteúdo/nível (ids de `ferramentas/fabrica/agentes/TAXONOMIA.md`). Relatório em
`docs/auditorias/lote2-rodada6.md`.

```
Rodada 6:
acafe-2021-inverno: 25, 31, 42
acafe-2021-verao: 9, 13, 19
acafe-2022-inverno: 1, 48, 61
acafe-2023-inverno: 23, 31, 34
acafe-2023-verao: 7, 41, 61
acafe-2024-verao: 23, 37, 62
cmmg-2021-2: 4, 41, 46
cmmg-2022-1: 11, 25, 47
cmmg-2023-1: 29, 47, 48
cmmg-2023-2: 11, 16, 29
fema-2020: 2, 4
fema-2021: 5, 17
puccampinas-2021: 6, 18
puccampinas-2022: 14, 26
puccampinas-2023: 18, 22
puccampinas-2024: 3, 13
puccampinas-2025: 1, 8, 53
puccampinas-2026: 18, 49, 63
pucminas-2021-2: 2, 16, 28
pucminas-2022-2: 1, 8, 39
pucminas-2023-1: 8, 13, 38
pucpr-2023-1: 6, 32, 37
pucpr-2023-2: 13, 35, 59
pucpr-2024-1: 5, 28, 29
pucrio-2020: 3, 4, 18
pucrio-2023: 36, 39, 44
saocamilo-2024-2: 11, 16
uece-2024-1: 6, 65, 79
unifesp-2022: 12, 15
unifesp-2026: 7, 13

Rodada 5:
fempar-2021: 9, 76
fempar-2026: 14, 50
mackenzie-2022-2: 19, 59
mackenzie-2026-1: 14, 44
mackenzie-2026-2: 15, 47
mackenzie-2027-1: 27, 51
pucminas-2024-1: 13, 22
pucminas-2025-1: 1, 6
pucminas-2026-1: 9, 35
pucminas-2027-1: 2, 33
pucpr-2024-2: 14, 42
pucpr-2025-1: 6, 50
pucpr-2025-2: 39, 46
pucpr-2026-1: 10, 12
pucpr-2026-2: 39, 47
pucrio-2024: 38, 49
pucrio-2025: 3, 8
pucrio-2026: 46, 56
pucrio-2027: 26, 58
unicentro-2022: 47, 89
unicentro-2023: 68, 77
unicentro-2024: 75, 94
unicentro-2026: 14, 48
unicentro-2027: 15, 75
unirg-2022-1: 13, 38
unirg-2022-2: 2, 50
unirg-2023-2: 27, 42
unirg-2024-1: 1, 22
unirg-2024-2: 8, 28
unirg-2025-2: 14, 15
unirg-2026-1: 18, 29
unirg-2026-2: 6, 21
unitins-2022-2: 20, 41
unitins-2023-2: 7, 19
unitins-2024-2: 5, 36
unitins-2025-2: 29, 37
unitins-2026-2: 24, 33
uva-2024-1: 51, 55
uva-2025-1: 18, 41
uva-2026-1: 5, 50
```

## Resultado da auditoria separada (09/11/2026)

Auditor: agente que não fez a ingestão. Amostra: 161 questões (81 da rodada 6, 80 da rodada 5). Método: (a) print de
cada questão aberto e comparado com a página do caderno oficial em `fabrica_saida/ingestao/<prova>/`, mais varredura
automática de tinta nas bordas do print; (b) gabarito comparado com o PDF oficial (texto, imagem renderizada ou, na
PUCPR e na PUC-Rio, a alternativa destacada no caderno com gabarito); nas provas com vários tipos/línguas, conferido o
tipo e a língua do caderno usado (Acafe/UVA/Unitins/UNIRG/Fempar: inglês e tipo 1; UECE: gabarito 1, inglês;
Unicentro e PUC-Rio pela numeração original em `nq`); (c) ids conferidos com `TAXONOMIA.md`; (d) escola, ano, fase
e número contra a capa e o gabarito; (e) lista de anuladas do gabarito contra `fora` e `questoes`. Nada foi corrigido.

### Defeitos

| Prova | Questão | Tipo | Errado → certo |
|---|---|---|---|
| mackenzie-2026-2 | 15 | (a) print — **grave** | print cortado embaixo: a alternativa E (a correta) aparece cortada ao meio → recortar até o fim da alternativa E |
| fema-2020 | 4 | (a) print — **grave** | print termina na alternativa c; a alternativa d ("casal 4") ficou de fora → incluir a d |
| pucminas-2021-2 | 2, 16, 28 | (a) print — **grave** | margem direita cortada: últimas letras de cada linha somem ("Paulo Freir", "secretore", "condiçõe") → recortar a coluna inteira |
| pucminas-2022-2 | 1, 8, 39 | (a) print — **grave** | idem ("Frei Bett", "bilhõe", "fantoches, ma") |
| pucminas-2023-1 | 8, 13, 38 | (a) print — **grave** | idem ("Kilimanjar", "estudos d", texto-base da 8 cortado) |
| pucminas-2024-1 | 22 | (a) print — **grave** | idem |
| pucminas-2025-1 | 1, 6 | (a) print — **grave** | idem (texto-base e alternativas da 6 cortados) |
| pucminas-2026-1 | 9 | (a) print — **grave** | idem |
| pucminas-2027-1 | 2 | (a) print — **grave** | idem |
| pucpr-2023-1 | 37 | (a) print — **grave** | topo cortado: o numerador da fração da equação ("sen(5x) − sen(−3x)") sai pela metade → subir o recorte |
| pucpr-2024-1 | 29 | (a) print | rodapé leva um pedaço da fórmula da questão 30 → cortar antes |
| unirg-2025-2 | 15 | (a) print | rodapé leva os ícones do cabeçalho do texto seguinte → cortar antes |
| acafe-2021-inverno | 25 | (c) taxonomia | M10.3 → M16.1 (a afirmação correta, B, é resto de divisão de polinômio) |
| acafe-2023-verao | 7 | (c) taxonomia | P04.4 → P07.4 (emprego do hífen em palavras compostas/prefixadas) |
| acafe-2023-verao | 41 | (c) taxonomia | Q11.1 → Q11.4 (funções amina/éster/álcool e ligações em alcaloides) |
| acafe-2024-verao | 23 | (c) taxonomia | M05.4 → M10.5 (f(x) = 85 − 15·sen(...), função trigonométrica) |
| cmmg-2021-2 | 41 | (c) taxonomia | F02.5 → F11.2 (carga entrando em campo elétrico uniforme; não é lançamento) |
| cmmg-2021-2 | 46 | (c) taxonomia | M03.1 → M11.2 (volume de cilindros de oxigênio) |
| cmmg-2022-1 | 47 | (c) taxonomia | M10.3 → M10.2 (dois ângulos e um lado: lei dos senos) |
| puccampinas-2025 | 53 | (c) taxonomia | B07.5 → B08.5 (sensibilidade à insulina) |
| pucminas-2023-1 | 13 | (c) taxonomia | P10.1 → P10.2 (topicalização e regência nominal; não há concordância) |
| pucpr-2024-2 | 42 | (c) taxonomia | F09.3 → F09.2 (espelho plano na parede) |
| mackenzie-2026-2 | 15 | (c) taxonomia | I04.5 → I03.7 (condicionais) |
| unirg-2022-2 | 50 | (c) taxonomia | H06.8 → H06.9 (revoluções de 1848, Primavera dos Povos) |
| unirg-2023-2 | 42 | (c) taxonomia | M07.4 → M07.1 (PA de razão 4) |
| fempar-2021 | 76 | (c) taxonomia | M12.2 → M12.5 (área de pentágono por coordenadas) |
| pucrio-2024 | 49 | (c) taxonomia | H06.7 → H06.10 (Guerra de Secessão) |
| pucrio-2025 | 8 | (c) taxonomia | I02.1 → I02.5 (prefixo de "uncomfortable") |
| fema-2020 | 2, 4 | (d) ano | ano 2020 → 2021 (capa: "Processo Seletivo FEMA 2021"; as demais provas usam o ano do vestibular, ex. PUC-Rio 2020 aplicada em 2019) |
| fema-2021 | 5, 17 | (d) ano | ano 2021 → 2022 (capa: "Processo Seletivo FEMA 2022") |

Fora da amostra, achado durante a conferência: o corte da margem direita é sistemático nas 7 provas da PUC Minas —
227 dos 315 prints têm tinta encostada na borda direita (2021-2: 35/45; 2022-2: 33; 2023-1: 36; 2024-1: 33; 2025-1: 27;
2026-1: 27; 2027-1: 36). Em cmmg-2023-2 as anuladas 17 e 40 estão em `fora.sem_gabarito` em vez de
`fora.anuladas` (o gabarito definitivo diz "Anulada"); ficam fora do site do mesmo jeito.

### Taxa de erro por tipo (161 questões)

| Tipo | Defeitos | Taxa |
|---|---|---|
| (a) print completo e fiel | 19 (17 graves: 14 PUC Minas, Mackenzie 2026-2 q15, Fema 2020 q4, PUCPR 2023-1 q37) | 11,8% |
| (b) gabarito igual ao oficial | 0 | 0% |
| (c) matéria/tema/conteúdo/nível | 16 (todos de conteúdo ou tema; nenhum de matéria; nível sem erro evidente) | 9,9% |
| (d) fonte, ano e número | 4 (as 4 da Fema) | 2,5% |
| (e) anuladas fora | 0 | 0% |
| Questões com pelo menos um defeito | 38 | 23,6% |

Conclusão: gabaritos e anuladas estão corretos na amostra inteira. O defeito que bloqueia a publicação é o recorte:
refazer todos os prints da PUC Minas e conferir de novo, por varredura de borda, os prints com tinta no limite de
baixo ou de cima (casos Mackenzie, Fema e PUCPR). A taxa de taxonomia (~10%) pede uma passada da lente de
classificação, sobretudo em questões de Matemática com várias afirmativas e em Física/Inglês.
