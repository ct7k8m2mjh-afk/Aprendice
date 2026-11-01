# Biologia: Treino geral (o essencial), 29/10

Arquivo de dados: `ESSENCIAL_bio.json` (40 ids de ABC + 40 itens de completar). Nada foi gravado em `dados.json` nem em `index.html`.

## Método

- **Incidência:** ranking por módulo e por conteúdo de `ANALISE_FLASH50_bio.md`, com estes pesos: São Camilo ×3, provas de 2021 em diante ×1,5, Fatec ×0,5. As 40 vagas foram divididas pelos módulos na proporção desse peso (B12 30,8 · B09 29,0 · B06 26,5 · B05 26,2 · B07 19,2 · B11 18,5 · B04 17,5 · B08 16,5 · B10 16,0 · B01 15,5 · B03 12,5 · B02 9,2). Dentro de cada módulo, a prioridade ficou com os conteúdos de maior peso.
- **ABC:** li o enunciado e as cinco alternativas de todas as 188 questões de prova do banco. Para cada escolhida, o gabarito foi conferido de duas formas: resolvendo a questão (as contas foram refeitas) ou eliminando as alternativas com erro conceitual. Nenhuma questão foi criada nem alterada.
- **Completar:** cada frase foi recortada de um cartão de teoria já revisado (o campo de origem está indicado em `fonte`). A lacuna é o termo-chave. Testei cada frase contra respostas alternativas que também estariam corretas e reescrevi as que admitiam mais de uma resposta. Também evitei perguntar o mesmo que os 50 flashcards.
- **Validação em Python:** 40 ids existentes e únicos no banco, todos com gabarito e degrau maior que 0; 40 frases com exatamente um "___"; mod/sub existentes em `teoria` e em `nomesub`.

## ABC: 40 questões, todas de prova

| módulo | nº | ids (conteúdo) |
|---|---:|---|
| B12 Seres vivos | 5 | Pc682321 musgo/esporos (São Camilo 2024), Pd79452b retrovírus, Pb5912cb especificidade do vírus, P9326bee parede de fungo, Pe3c9fb6 âmnio |
| B09 Ecologia | 5 | P715b848 maré vermelha (São Camilo 2024), P2f55a19 Pampa, P5eabc52 mercúrio na cadeia, Pd97360b controle biológico/níveis tróficos, P8f3cb1f fluxo de energia |
| B06 Genética clássica | 5 | Pf1efeae herança quantitativa (São Camilo 2024), Pbb379d6 ABO pelas aglutininas, P9dc2eb5 linkage trans 16 UR, P9c44554 cromossomo Y, Pe07eea7 dominância incompleta × 2ª lei |
| B05 Genética molecular | 4 | P547782d diferenciação (São Camilo 2024), Pcb53e1e inserção/frameshift, Pb570d83 Chargaff, Peaaa72a edição + clonagem |
| B11 Evolução | 4 | Paf0ad5e teoria sintética, P24f9856 Lamarck/deriva/Darwin, P36d0b87 isolamento geográfico × reprodutivo, Pf6d4ecb Hardy-Weinberg 2pq |
| B07 Fisiologia I | 3 | P75373c7 efeito Bohr, Pe83b95f hematose, Pc82dfe1 hemograma |
| B04 Divisão celular | 3 | P0a240e7 anáfase I, P831b9bb X/Y na meiose I, P411044a telomerase/câncer |
| B08 Fisiologia II | 3 | P03bc2b3 vacina, P023b4d8 soro/memória, Pb99b11c hormônios do ciclo |
| B10 Doenças | 3 | P999b3de resistência bacteriana, Pd8fbc8a malária, P540c9e2 imunidade coletiva |
| B01 Citologia | 2 | P1d4683f traço comum pro/eucarionte, Pb84f3bb nucléolo |
| B03 Metabolismo | 2 | Pa99e300 ponto de compensação, Pa1cc3b0 fermentação alcoólica |
| B02 Bioquímica | 1 | Pe45f264 enzimas específicas (São Camilo 2024) |

- **Escolas:** São Camilo 5 (todas as questões únicas de São Camilo do banco), Santa Casa 11, Unesp 11, Fuvest 7, Einstein 6. Nenhuma questão de site, nenhuma da Fatec.
- **Dificuldade:** dif 3 (3 questões), 4 (6), 5 (8), 6 (11), 7 (11), 8 (1). São 36 de 40 entre dif 3 e 7.
- **Figuras:** só entraram questões com figura quando o gabarito pode ser conferido pelo texto, porque o enunciado descreve a figura ou porque as alternativas erradas têm erro conceitual. A resposta não depende de ler o desenho.

## Completar: 40 frases

Distribuição igual à do ABC: B12 5, B09 5, B06 5, B05 4, B11 4, B07 3, B04 3, B08 3, B10 3, B01 2, B03 2, B02 1.

## Questões descartadas por suspeita (não escolhidas)

- **P4f909ea** (Einstein 2019, B05.3; gabarito B, 369 bases → 123 aminoácidos): a conta ignora o códon de parada e as regiões não traduzidas do RNAm maduro. Pelo rigor, o número seria menor que 123. O gabarito oficial é B.
- **P0032661** (Fuvest 2023, B06.1; gabarito D, 1/300): o gabarito só fecha se "portadora da AME" quiser dizer *afetada*. Lido como heterozigota, o resultado é outro. O texto é ambíguo.
- **Pb7c0d58** (Einstein 2024, B11.4; gabarito E, 0,84): o enunciado diz que a população está em equilíbrio de Hardy-Weinberg, mas as contagens dadas (5 000 AA, 2 000 Aa, 3 000 aa) não estão em proporção de equilíbrio. A conta fecha, mas a premissa é contraditória.
- **P6bbd922** (Fuvest 2019, 1/200) e **Pa6cb65b** (Fatec 2014, ciclo do N): o gabarito depende de detalhes da figura que não consigo conferir.
- **Excluídas por regra:** degrau 0 (P003f179 Einstein 2027 biomagnificação, P2b8819d Einstein 2026 epistasia, P0c046a1, Pb9e81f8, P078cbff). Em cada par de cópias da mesma questão da São Camilo, ficou só uma: Pe45f264 (sai P051777a) e P547782d (sai Pbd4716c).
