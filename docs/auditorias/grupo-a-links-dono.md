# Auditoria separada do grupo A (links do dono) — resultado

Auditor separado (não fez a integração), 11/11/2026. Base: amostra sorteada em `docs/auditorias/grupo-a-amostra.md`
(60 questões, 2 por prova, 30 provas), gabaritos oficiais em `docs/auditorias/grupo-a-gabaritos/`, taxonomia em
`ferramentas/fabrica/agentes/TAXONOMIA.md`. Nada foi alterado em `prova.json` nem nos prints — este arquivo só registra.

## Resumo

| Tipo | Defeitos na amostra (60) | Taxa |
|---|---|---|
| Print | 2 | 3,3% |
| Gabarito | 0 | 0% (e 0 divergência nas 1.816 questões das 30 provas inteiras) |
| Classificação — matéria ou tema errado | 10 | 16,7% |
| Classificação — conteúdo vizinho mais preciso (mesmo tema) | 7 | 11,7% |
| Classificação — total | 17 | 28,3% |
| Nível | 0 | 0% |

**Principal achado:** a classificação é o ponto fraco. Em Português, quando a questão vem depois de um texto literário,
a classificação seguiu o **texto** (escola literária) e não o que a **questão pergunta** (gramática, sentido de palavra,
leitura). O mesmo erro aparece fora da amostra (ex.: anhembi-2022 q2, sobre tipo de sujeito, está em P01.2; o certo é P08.1).
Vale reclassificar todas as questões de `por` em P11/P12/P03 conferindo o comando da questão.

## 1. Conferência completa dos gabaritos (programa, 30 provas inteiras)

Todas as questões de cada `prova.json` foram comparadas com o gabarito oficial (Unicamp: bloco "PROVAS Q e …";
unicamp-2021-exh: "PROVAS E e G"; indígenas: bloco único; UERJ: coluna INGLÊS na língua estrangeira; Vunesp: "n - letra").

- **0 divergência** em 1.816 questões oficiais (1.811 com gabarito no `prova.json` + 5 anuladas).
- **Anuladas batem 100%** com o oficial: uerj-2026-1 q38 ("ANULADA"), unicamp-2021 q48, unicamp-2022 q42,
  unicamp-2025 q53, unicamp-indigena-2022 q23 ("*"). Todas estão em `fora.anuladas` e nenhuma ficou com `gab`.
- Nenhuma prova tem questão faltando: total do `prova.json` + anuladas = `total_oficial` em todas as 30.

| Prova | Questões oficiais | No prova.json | Anuladas (oficial = fora) | Divergências |
|---|---|---|---|---|
| anhembi-2022 | 40 | 40 | — | 0 |
| einstein-2021 | 50 | 50 | — | 0 |
| einstein-2021-2-enf | 50 | 50 | — | 0 |
| einstein-2022-2-enf | 50 | 50 | — | 0 |
| einstein-2023 | 50 | 50 | — | 0 |
| fmj-2021 | 60 | 60 | — | 0 |
| fmj-2022 | 60 | 60 | — | 0 |
| santacasa-2021 | 80 | 80 | — | 0 |
| santacasa-2022 | 80 | 80 | — | 0 |
| santacasa-2022-demais | 60 | 60 | — | 0 |
| saocamilo-2021-2 | 40 | 40 | — | 0 |
| saocamilo-2022-2 | 40 | 40 | — | 0 |
| uerj-2021 | 60 | 60 | — | 0 |
| uerj-2022 | 60 | 60 | — | 0 |
| uerj-2023 | 60 | 60 | — | 0 |
| uerj-2025-1 | 60 | 60 | — | 0 |
| uerj-2025-2 | 60 | 60 | — | 0 |
| uerj-2026-1 | 60 | 59 | 38 = 38 | 0 |
| uerj-2026-2 | 60 | 60 | — | 0 |
| uerj-2027-1 | 60 | 60 | — | 0 |
| unicamp-2021 | 72 | 71 | 48 = 48 | 0 |
| unicamp-2021-exh | 72 | 72 | — | 0 |
| unicamp-2022 | 72 | 71 | 42 = 42 | 0 |
| unicamp-2023 | 72 | 72 | — | 0 |
| unicamp-2024 | 72 | 72 | — | 0 |
| unicamp-2025 | 72 | 71 | 53 = 53 | 0 |
| unicamp-2026 | 72 | 72 | — | 0 |
| unicamp-2027 | 72 | 72 | — | 0 |
| unicamp-indigena-2021 | 50 | 50 | — | 0 |
| unicamp-indigena-2022 | 50 | 49 | 23 = 23 | 0 |

## 2. Amostra — 60 questões

Legenda: **OK** = sem defeito. Na coluna Classificação, "grave" = matéria ou tema errado; "leve" = conteúdo vizinho
mais preciso dentro do mesmo tema.

| Prova | Q | Print | Gabarito | Classificação (atual → sugerida) | Observação |
|---|---|---|---|---|---|
| anhembi-2022 | 14 | OK | OK (A) | **grave**: M13.6 → **M06.3** (nível 5 ok) | Função logarítmica e exponencial; não é probabilidade. |
| anhembi-2022 | 13 | OK | OK (E) | **grave**: M14.1 → **M03.1** | Porcentagem (25% e 15%) com sistema; nada de média. |
| einstein-2021 | 23 | OK | OK (C) | OK (G03.3) | Climograma; G05.3 também caberia. |
| einstein-2021 | 49 | OK | OK (B) | **leve**: M13.9 → **M13.4** | Probabilidade simples (casos favoráveis/possíveis). |
| einstein-2021-2-enf | 42 | OK | OK (D) | OK (M07.4) | |
| einstein-2021-2-enf | 10 | OK (leva o conto inteiro) | OK (B) | **grave**: P12.3 → **P07** (tema; nenhum conteúdo de P07 cita preposição — o mais próximo é P07.1) | Pergunta a classe gramatical do "a" (preposição); não é literatura. |
| einstein-2022-2-enf | 24 | OK | OK (C) | OK (G08.4) | G08.5 seria um pouco mais preciso. |
| einstein-2022-2-enf | 29 | OK | OK (B) | OK (B05.3) | |
| einstein-2023 | 6 | OK (leva o texto de 02 a 08) | OK (C) | **grave**: P03.2 → **P05.1** | Sentido de "perdeu a cerimônia" no contexto. |
| einstein-2023 | 47 | OK | OK (B) | **leve**: M13.4 → **M13.6** | "Mulher **ou** opção 1": probabilidade da união. |
| fmj-2021 | 33 | OK | OK (D) | OK (H03.8) | |
| fmj-2021 | 12 | OK | OK (B) | OK (M16.1) | |
| fmj-2022 | 6 | OK (leva o conto) | OK (A) | **grave**: P12.4 → **P09.2** | Sujeito expresso por oração (subordinada substantiva subjetiva). |
| fmj-2022 | 57 | OK | OK (E) | OK (F09.4) | |
| santacasa-2021 | 77 | OK* | OK (B) | OK (M09.3) | *Pontinha azul do selo da questão seguinte no canto inferior esquerdo (cosmético). |
| santacasa-2021 | 44 | OK* | OK (C) | OK (B04.2) | *Mesmo resíduo cosmético no rodapé. |
| santacasa-2022 | 14 | OK* (leva o texto de 11 a 17) | OK (C) | OK (I02.1) | *Arcos do selo acima do título e no rodapé (cosmético). |
| santacasa-2022 | 57 | OK* (leva o texto de 57 e 58) | OK (A) | OK (Q09.1) | *Idem. |
| santacasa-2022-demais | 10 | OK* (leva o soneto) | OK (E) | OK (P07.4) | *Idem. |
| santacasa-2022-demais | 41 | OK* (leva o texto de 39 a 41) | OK (B) | **grave**: Q11.3 → **Q12.1** | Tipo de reação (hidrogenação = adição), não função orgânica. |
| saocamilo-2021-2 | 37 | OK | OK (E) | OK (M13.4) | |
| saocamilo-2021-2 | 12 | OK | OK (D) | OK (H06.4) | |
| saocamilo-2022-2 | 18 | OK | OK (B) | OK (G05.2) | |
| saocamilo-2022-2 | 3 | OK (leva o trecho de 02 a 05) | OK (B) | **grave**: P11.2 → **P01.2** | Pergunta só a leitura do trecho ("indolência"), nada de Romantismo. |
| uerj-2021 | 24 | OK | OK (A) | OK (M10.1, nível 7) | |
| uerj-2021 | 31 | OK | OK (C) | OK (B01.4) | |
| uerj-2022 | 19 | OK | OK (C) | OK (M01.4) | MDC(272, 416) = 16. |
| uerj-2022 | 23 | OK | OK (D) | OK (M10.1) | |
| uerj-2023 | 56 | OK | OK (C) | OK (H05.11) | |
| uerj-2023 | 20 | OK | OK (C) | OK (M10.4) | |
| uerj-2025-1 | 14 | OK (o caderno não traz a crônica "Blefes"; os trechos estão nas alternativas e o livro é leitura prévia) | OK (A) | **leve**: P02.3 → **P02.4** | Pede "contra-argumentação". |
| uerj-2025-1 | 9 | OK (idem, livro de leitura prévia) | OK (A) | OK (P12.5) | |
| uerj-2025-2 | 41 | OK (leva o texto de 41 e 42) | OK (C) | **grave**: Q09.5 → **Q01.2** | Contar nêutrons de U-235 e Pu-239 (n = A − Z); não é meia-vida/fissão. |
| uerj-2025-2 | 34 | OK | OK (B) | OK (M11.3) | |
| uerj-2026-1 | 39 | OK | OK (A) | OK (Q07.2) | |
| uerj-2026-1 | 30 | OK | OK (C) | **leve**: M03.2 → **M03.1** | Aumentos simultâneos ponderados (3 + 10 + 2 = 15%), não sucessivos. |
| uerj-2026-2 | 23 | OK (leva o texto inteiro) | OK (C) | OK (I01.1) | |
| uerj-2026-2 | 57 | OK | OK (A) | OK (G10.1) | |
| uerj-2027-1 | 28 | OK | OK (A) | OK (M14.2) | |
| uerj-2027-1 | 8 | OK (leva o texto-base) | OK (A) | OK (B09.2) | Bioacumulação; B09.1 também caberia. |
| unicamp-2021 | 62 | OK | OK (A) | OK (H08.3) | |
| unicamp-2021 | 18 | OK | OK (C) | OK (I01.7, nível 3) | |
| unicamp-2021-exh | 2 | OK | OK (B) | OK (P12.2) | Camões e Pessoa; a taxonomia não tem conteúdo de literatura portuguesa. |
| unicamp-2021-exh | 58 | OK | OK (C) | OK (H02.9) | |
| unicamp-2022 | 38 | OK | OK (A) | OK (Q12.5) | |
| unicamp-2022 | 29 | OK | OK (D) | OK (I01.3) | |
| unicamp-2023 | 18 | OK | OK (A) | **grave**: Q03.3 → **Q07.2** | Lei de Hess/sinal de ΔH e carbono neutro; termoquímica. |
| unicamp-2023 | 58 | OK | OK (B) | OK (H03.6) | |
| unicamp-2024 | 32 | OK | OK (A) | OK (G02.2) | |
| unicamp-2024 | 68 | OK | OK (D) | **leve**: I01.3 → **I01.1** | Pergunta o tópico/tema do texto. |
| unicamp-2025 | 5 | OK (leva o texto e o mapa de 5 e 6) | OK (D) | **leve**: G03.5 → **G03.2** | Alta pressão, bloqueio de frente fria. |
| unicamp-2025 | 4 | OK | OK (C) | OK (G02.3) | |
| unicamp-2026 | 22 | OK | OK (D) | **grave**: por P01.2 → **fs S04.1** (matéria errada) | Gosto e distinção de classe (Bourdieu); vizinhas q23–25 já são fs. |
| unicamp-2026 | 26 | OK | OK (D) | OK (H06.8) | |
| unicamp-2027 | 50 | **DEFEITO**: na alternativa (c), "sua indústria de inteligência" está com a metade de cima das letras apagada (faixa branca atravessando a linha) | OK (B) | **leve**: G10.5 → **G10.4** | Corrigir: renderizar de novo a página 17 do caderno sem a máscara/faixa e recortar outra vez. |
| unicamp-2027 | 43 | **DEFEITO**: a linha "A partir das informações apresentadas no texto, assinale a al-" está com a metade de baixo das letras apagada (mesma faixa) | OK (C) | OK (B11.3) | Corrigir: renderizar de novo a página 15. Como o defeito se repete em duas páginas, conferir todos os prints de unicamp-2027 nessa mesma altura da página. |
| unicamp-indigena-2021 | 11 | OK | OK (C) | OK (P12.5) | |
| unicamp-indigena-2021 | 24 | OK | OK (A) | OK (F02.7) | |
| unicamp-indigena-2022 | 41 | OK | OK (D) | OK (G01.2) | |
| unicamp-indigena-2022 | 45 | OK | OK (A) | OK (H03.1) | |

## 3. Taxa de erro por tipo

- **Print:** 2/60 = **3,3%** (as duas na unicamp-2027: faixa branca cortando uma linha de texto). Todas as outras 58 estão
  inteiras, com todas as alternativas, sem pedaço de outra questão e com o texto de apoio quando o enunciado depende dele.
  Observação cosmética, não contada como defeito: nos prints de Santa Casa (e na anhembi-2022 q14), sobram arcos do selo
  redondo "QUESTÃO" da questão seguinte no rodapé, ou acima do título. Não tiram nada do conteúdo; dá para limpar
  apertando o recorte alguns pixels.
- **Gabarito:** 0/60 na amostra; **0/1.816** na conferência completa; anuladas 5/5 corretas.
- **Classificação:** 17/60 = **28,3%** (grave 10/60 = 16,7%; leve 7/60 = 11,7%). Concentração: Português (5 das
  10 graves: classificado pelo texto literário em vez do comando da questão), Química (3 graves: assunto do contexto em
  vez do que se calcula), Matemática (2 graves).
- **Nível:** 0/60. Os níveis atribuídos são plausíveis.

## 4. Recomendação

1. Prints: refazer unicamp-2027 q43 e q50 e varrer as demais da unicamp-2027 atrás da mesma faixa.
2. Gabaritos: nada a corrigir.
3. Classificação: aplicar as 17 correções acima e **reclassificar com regra explícita** "classifique pelo que o comando
   pergunta, não pelo assunto do texto de apoio", começando por todas as questões `por` em P11/P12/P03 e `qui` cujo
   conteúdo veio do contexto. Com 28% de erro na amostra, a classificação do grupo A não deve ir ao ar sem essa segunda
   passada e uma nova amostra conferida por agente separado.

## 4. Correções feitas pelo integrador depois desta auditoria (11/11/2026)

- **Prints da Unicamp 2027 (q43 e q50):** a faixa branca que cobria o logotipo no alto da página descia sobre a 1ª linha da
  coluna (o logo de 2027 vai até y≈55 e o texto começa em y≈49). A limpeza agora para logo acima da linha de texto; as 10
  provas da Unicamp foram recortadas de novo (ids e classificação mantidos) e os dois prints conferidos.
- **Classificação:** as 17 correções da amostra aplicadas como sugeridas (anhembi-2022 q13, q14; einstein-2021 q49;
  einstein-2021-2-enf q10 → P07.1; einstein-2023 q6, q47; fmj-2022 q6; santacasa-2022-demais q41; saocamilo-2022-2 q3;
  uerj-2025-1 q14; uerj-2025-2 q41; uerj-2026-1 q30; unicamp-2023 q18; unicamp-2024 q68; unicamp-2025 q5; unicamp-2026 q22;
  unicamp-2027 q50). Seguindo o principal achado, as 153 questões de Português das 30 provas classificadas em P03/P11/P12
  foram revistas pelo comando da questão: mais 45 mudaram para o conteúdo que a questão pergunta (gramática, figura de
  linguagem, sentido, discurso direto/indireto, coesão — ex.: anhembi-2022 q2 → P08.1, fmj-2022 q5 → P10.5,
  santacasa-2022-demais q9 → P08.1, uerj-2026-1 q20 → P06.2). As que perguntam a escola literária, o gênero ou a leitura
  da obra ficaram em P03/P11/P12.
- **Não corrigido (cosmético):** os arcos do selo "QUESTÃO" da questão seguinte em alguns prints da Santa Casa e da
  Anhembi (nada do conteúdo é perdido).
