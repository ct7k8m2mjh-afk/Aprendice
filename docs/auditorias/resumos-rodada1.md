# Auditoria — resumos por subtema (comando 35), rodada 1

Auditor separado (não fez o trabalho). Data: 09/11/2026. Build da árvore atual (`converte.py` → `tsc` → `vitest` → `vite build`), servido localmente e conferido com Playwright (Chromium), conta teste@exemplo.com.

Escopo: seção "Resumo" na tela do conteúdo (Escada), "Resumo de cada conteúdo" na aba Revisão do tema, "Resumo para levar" no fim da revisão em slides, caixa tracejada "Imagem em preparação" e a regra "sem animação" em Português, Geografia, História, Inglês e Filosofia e Sociologia.

Screenshots: `/tmp/claude-0/-home-user-aprendice/aee5743b-68b8-515c-b692-c4a8e9011d85/scratchpad/audres/shots/` (arquivos temporários da sessão; os nomes estão em cada defeito).

## O que foi conferido e passou

- **Dados**: os 361 resumos de `docs/revisao/<m>/resumos.json` chegam iguais ao `public/conteudo/<m>/revisao/resumos.json` (título, pontos, pegadinha, fórmula e descrição da imagem). Diferenças: 0.
- **Texto na tela**: 14 resumos sorteados (2 por matéria: B02.5, B01.5, F09.6, F02.1, L02.4, S05.2, G04.1, G07.3, H05.3, H01.4, I04.5, I03.1, Q01.3, Q01.5). Os 73 pontos e pegadinhas sem fórmula estão idênticos ao JSON. Os títulos também.
- **Varredura**: 359 resumos aparecem na tela (Tema para bio/fis/fs/geo/his/ing, Escada para qui). Todos têm a caixa "Imagem em preparação", porque ainda não há imagem. Os 2 que faltam estão no defeito M3.
- **Larguras e temas**: telas Escada, Tema e Fim em bio, fis, fs, geo, his, ing e qui, em 390, 768, 1280 e 1440 px, nos temas claro e escuro.
  - Rolagem lateral: 0 em todas.
  - Nada sai da caixa do resumo.
  - Grade: 1 coluna abaixo de 700 px de contêiner; texto e caixa lado a lado acima disso (1,4fr : 1fr).
- **Sistema de design**:
  - Título do resumo em Familjen 600 17px (`--fs-tema`); pontos em Familjen 400 16px, entrelinha 1,55.
  - Ponto de 7px na cor `--p` da matéria (bio #3FA535, fis #F27700, fs #E8B616, geo #0F6E7A, his #75451D, ing #AC002A, qui #D31A8D).
  - Caixa tracejada na cor da matéria misturada à borda, canto 12, fundo `--sv2`, texto `--fs-info` 14px.
  - Pegadinha no componente `es-pegadinha` (canto 10). Título da seção 21px 700 (19px em 390).
  - O escuro troca todos os tons corretamente.
- **Console**: sem erros nas telas do resumo. Só aparecem os avisos "React Router Future Flag", que já existiam (B5).
- **Sem animação nas matérias de texto**: fs, geo, his e ing foram percorridos do começo ao fim da revisão em slides (13 slides cada).
  - Tempo 2 = "Rever os pontos", na capa e na barra de tempos.
  - Nenhuma `.ra` (resolução animada) e nenhum "Ver do começo" ou "Próximo passo": os passos aparecem juntos, em texto.
  - Nenhuma escrita à mão animada e nenhum visual animado.
- **Correção de questão em Português** (Pa563c0a): "Resolução" em texto, sem "Assistir resolução" e sem `.ra`.
- **Matérias animadas**: bio e fis continuam com "Ver acontecer" e com resolução animada.
- **Fração empilhada**: \frac aparece empilhado em todos os casos vistos (F01.2, F01.4, F10.3, G06.1, Q06.1, Q06.3). Barras "/" que ficaram na linha são datas de lei ("Lei 9.474/1997") e unidades ("m/s"), conforme DESIGN.md.

## Defeitos

### Graves

**G1 — Comandos LaTeX sem suporte aparecem como texto cru no resumo (material de estudo com erro)**

O motor de fórmulas (`app/src/logica/latex.ts`, tabela `SIMBOLOS`) não conhece `\sum`, `\ell`, `\wedge` nem `\vee`. Por isso escreve o nome do comando no lugar do símbolo.

| Comando | Matéria e subtema | O que aparece | Deveria ser |
|---|---|---|---|
| `\sum` | fis F03.6 (Estática) | "sumFx = 0 e sumFy = 0"; "sumF = 0 e sumM = 0" | ΣFx = 0 |
| `\sum` | qui Q06.3 (Gás sobre água) | "M média = sumXi Mi" | — |
| `\sum` | qui Q07.2 (Entalpia de formação) | fórmula com "sum" | — |
| `\sum` | qui Q07.3 (Energia de ligação) | "ΔH = sumE rompidas − sumE formadas" | — |
| `\ell` | fis F10.3 (Young) | "λ = d·I / ell" | λ = d·I / ℓ |
| `\ell` | qui Q01.3 (Hund) | "m_ell = −ell,…,0,…,+ell" | m_ℓ = −ℓ,…,0,…,+ℓ |
| `\wedge`, `\vee` | fs L04.4 (Conectivos lógicos) | "p wedgeq", "p veeq" | p ∧ q, p ∨ q |

- **Telas**: Escada, Tema (aba Revisão) e Fim da revisão em slides. Em qui, só a Escada, porque Q01, Q06 e Q07 mostram o essencial no Tema e qui ainda não tem slides.
- **Larguras e temas**: todas as larguras, claro e escuro.
- **Como reproduzir**: abra `#/m/fis/tema/F03?aba=revisao`, `#/m/qui/escada/Q07.3`, `#/m/qui/escada/Q01.3`, `#/m/fs/tema/L04?aba=revisao` e `#/m/fis/tema/F10?aba=revisao`.
- **Screenshots**: `z-fis-estatica-390.png`, `z-qui-energia-390-escuro.png`, `z-qui-hund-1280.png`, `z-fs-conectivos-390.png`, `z-fis-young-768.png`, `escada-qui-390-escuro.png`.
- **Atenção**: o mesmo motor desenha as fórmulas da revisão essencial e dos slides. Se essas fórmulas aparecem lá, o defeito se repete.

**G2 — `\begin{aligned}` mostra o "&" de alinhamento na fórmula de Q06.1**

- **O que aparece**: "T const.&: P₁V₁ = P₂V₂", "P const.&: V₁/T₁ = V₂/T₂" e "V const.&: …".
- **Causa**: `latex.ts` remove `\begin{aligned}` mas não trata o `&`.
- **Tela**: Escada de qui Q06.1 (o mesmo texto existe no essencial de Q06). Todas as larguras, claro e escuro.
- **Como reproduzir**: abra `#/m/qui/escada/Q06.1`.
- **Screenshot**: `z-qui-q061-390.png`.

### Médios

**M1 — Ponto da lista fica sozinho acima de fórmula alta**

- **Onde**: fis F01.4 (Relatividade), no ponto "γ = 1/√(1 − v²/c²)".
- **O que acontece**: o ponto de 7px fica na primeira linha e a fórmula começa embaixo dele. Ponto e conteúdo ficam desalinhados.
- **Quando**: em todas as larguras, claro e escuro. Telas Tema e Escada de F01.4.
- **Como reproduzir**: abra `#/m/fis/tema/F01?aba=revisao`.
- **Screenshots**: `z-fis-relat-390-claro.png`, `tema-fis-1440-escuro.png`.

**M2 — Fração "½" em caractere único, não empilhada**

- **Onde**:
  - qui Q01.3: "spin +½" e a pegadinha "−½".
  - qui Q07.1: "H₂ + ½ O₂".
- **Regra**: CLAUDE.md pede fração sempre empilhada.
- **Quando**: Escada de qui, todas as larguras e temas.
- **Como reproduzir**: abra `#/m/qui/escada/Q01.3`.
- **Screenshot**: `z-qui-hund-1280.png`.

**M3 — Dois resumos de Filosofia e Sociologia nunca aparecem**

- **Quais**: `L01.6` ("O que é filosofia e suas áreas") e `L06.6` ("Filosofia analítica e virada linguística").
- **Por quê**: esses ids não existem como subtemas do site. `materia.json` de fs só tem L01.1–L01.5 e L06.1–L06.5.
- **Consequência**: os resumos estão nos dados, mas não aparecem em tela nenhuma (359 de 361 visíveis). Falta decidir: criar os subtemas ou ligar esses resumos a um subtema que já existe.
- **Como reproduzir**: abra `#/m/fs/tema/L01?aba=revisao`. Aparecem 5 resumos; os dados têm 6.

**M4 — Resumo sem cartão na Escada, com cartão no Fim**

- **O que acontece**: na Escada, a seção "Resumo" fica solta sobre o fundo, entre o cartão "Treine sua evolução" e os cartões de "Por nível". No Fim da revisão, o mesmo componente vem dentro de cartão (`tp-bloco`).
- **Problema**: o mesmo bloco aparece com aparências diferentes, e na Escada destoa dos blocos vizinhos.
- **Quando**: todas as larguras e temas.
- **Como reproduzir**: abra `#/m/geo/escada/G06.1`.
- **Screenshots**: `pag-escada-geo-1280.png`, `fimpag-his-1280-claro.png`.

### Baixos

- **B1 — Espaço faltando**: fis F01.3 aparece "2abcosθ", sem espaço antes de cos. Tela Tema F01. Screenshot: `tema-fis-1440-escuro.png`.
- **B2 — Entrada animada em matéria de texto**: em "Lembrar sem olhar", as lacunas reveladas (`.rv-falta`, `revisao.css:143`) entram com uma animação de 0,45 s também em fs, geo, his e ing. É micro-transição de interface, não resolução animada, mas a regra diz "sem animação". O dono precisa confirmar se essa transição é aceita.
- **B3 — Regra de matérias animadas em dois lugares**: `app/src/ui/Resolucao.tsx:16` tem sua própria lista `ANIMADAS`, além de `MATERIAS_ANIMADAS` (`app/src/dados/revisao.ts:65`). Hoje as duas são iguais, mas podem divergir numa mudança futura.
- **B4 — Teste fora deste escopo falha**: `vitest` tem 655 testes que passam e 1 que falha, em `provas.test.ts` ("enem-2020 q93: recorte sem as alternativas A–E"). Não tem relação com os resumos, mas a regra de "rodar os testes" não fecha verde.
- **B5 — Avisos no console**: os avisos "React Router Future Flag" (v7_startTransition e v7_relativeSplatPath) aparecem em toda carga. Já existiam antes.
- **B6 — Aspas retas nos dados**: há 29 trechos com aspas simples retas, por exemplo 'Ils ne passeront pas' (H07.2) e 'melhorar a vida reduz a natalidade' (G06.1). Questão tipográfica do conteúdo.
- **B7 — Química só mostra resumo na Escada (informativo)**: Q01, Q06 e Q07 têm essencial e por isso não mostram "Resumo de cada conteúdo" no Tema, como manda `RESUMOS-LEIA.md`. Química também não tem slides de revisão, então "Resumo para levar" nunca aparece. O comportamento segue a especificação; fica registrado.

## Contagem

| Gravidade | Defeitos |
|---|---|
| Graves | 2 (G1, G2) |
| Médios | 4 (M1–M4) |
| Baixos | 7 (B1–B7) |
