# Auditoria de design do Aprendice

Data: 11/11/2026 · Etapa 1 (só auditoria; nenhum arquivo do site foi alterado) · Autor: coordenador da revisão de design.

**Como ler:** cada item tem um id (D01, D02…). Para autorizar, marque a linha "AUTORIZO" do item ou responda com os ids (ex.: "AUTORIZO D01, D03, D07"). Só os itens autorizados serão aplicados, na etapa 2.

## Resumo

- **Está bom (medido):** nenhuma tela tem rolagem lateral nem elemento para fora da tela (104 telas e estados × 4 larguras × 2 temas); só as cinco fontes do guia tipográfico aparecem; nenhum emoji; todo botão, link e campo tem nome para leitor de tela; todo controle alcançado pelo Tab mostra o foco (14 telas testadas, claro e escuro, mais 390 px); há o atalho "Pular para o conteúdo"; "reduzir movimento" é respeitado (a resolução abre já no estado final e o ícone não salta); claro e escuro têm exatamente os mesmos tamanhos, pesos e entrelinhas; as 9 matérias têm a mesma aparência (só muda a cor).
- **Os 5 maiores problemas:**
  1. **D01** — no celular, 947 botões e links (nas 96 telas do primeiro percurso) medem menos de 44 px (voltar 32×30, pausar 32×32, chips 31 de altura, "Trocar" 44×15).
  2. **D02** — a barra da questão corta o contador "35 de 44" quando o nome da matéria ou do tema é longo.
  3. **D03** — fração escrita na linha ("2/5 e 3/5") nos avisos "Cuidado" da teoria, contra a regra da fração empilhada.
  4. **D04 e D05** — texto com contraste abaixo de 4,5:1: rótulo TOTAL (3,85), níveis sem questão (2,79 a 3,49) e a cor de algumas matérias em letra pequena (3,94 a 4,48).
  5. **D06** — na correção a 1280 px a explicação chega a 102 caracteres por linha (o confortável é 45 a 75).
- Tamanhos de letra, cantos, sombras e espaços estão escritos com valores soltos (124 declarações distintas de tamanho de letra no CSS; 61 cores fora das variáveis); os itens D12 e D14 a D18 levam isso para variáveis sem mudar nenhum valor.
- Depois da revisão por agente separado, dois itens foram retirados (D13 e D20) e sete foram corrigidos; ver a última seção.

## Como foi medido

- Site montado do ramo `app-prototipo-completo` e aberto com o Playwright (Chromium): commit `0d376473` para as 96 telas e estados; commit `0ae9e662` para a "Revisão geral" (8 telas), que entrou no ramo durante a auditoria. É o código do ramo, não necessariamente o que está no link público.
- Larguras 390, 768, 1280 e 1440 px, temas claro e escuro: 832 passagens. Em cada uma o programa leu os estilos computados de todo texto e de todo controle.
- **Contagem:** "elementos" = soma dos elementos visíveis nas telas percorridas naquela largura, tema claro; o menu e o topo contam uma vez só. "Telas" = em quantas telas o valor aparece.
- **Contraste:** fórmula da WCAG 2.x sobre a cor computada do texto e o fundo efetivo (cores translúcidas e opacidade compostas). Texto sobre gradiente ou imagem: "não medido".
- **Alvo de toque:** caixa do elemento (`getBoundingClientRect`); links no meio de frase ficam fora da regra.
- **Medida de linha:** número de caracteres do parágrafo dividido pelo número de linhas (parágrafos de 3 linhas ou mais).
- Telas percorridas: login (e erro), boas-vindas (2 passos), Início (vazio e com histórico), lista de matérias, as 9 matérias, um tema de cada matéria, "Treine sua evolução" (4), questão das 9 matérias (antes, alternativa marcada, correção em 4 blocos, bloco 4 aberto, resolução animada tocando e no fim, abas Teoria e Fonte), Treino geral da matéria e de todas as matérias, Hoje, flashcards (lista, vazio, sessão, verso), simulados (lista, prova, em andamento), Revisão (5 abas, vazia), revisão em slides, revisão essencial, Revisão geral (4 matérias, tópico, busca, busca vazia), Desempenho (vazio e com dados), Provas (lista e detalhe), Perfil, Configurações, busca (com e sem resultado), menu "Outras matérias", "Questão não encontrada".
- Programas e dados de apoio: `docs/design/evidencias/metodo/`. Capturas: `docs/design/evidencias/`.
- **Não medido:** estados de carregamento e de falha de rede; resultado final de simulado; tela "pausada"; leitura real com leitor de tela; larguras acima de 1440 px.

## Inventário (valores distintos e contagem)

**Famílias de fonte** (1280 px, claro)

| Família | Elementos | Telas | Onde |
|---|---|---|---|
| Familjen Grotesk | 6986 | 102 | `p.mat-sub.num @revisao-geral-mat` |
| Caveat | 430 | 16 | `span.fm-linha @revisao-geral-mat` |
| Literata | 336 | 22 | `p.cor-expl @correcao-bio` |
| DM Sans | 45 | 2 | `span.l-selo @login` |
| Dancing Script | 32 | 32 | `a.tit-mat @revisao-geral-mat` |

**font-size (interface, sem a tela de login)** — 32 valores distintos a 390 px, 38 a 1280 px

| Valor | Elementos a 390 px (telas) | Elementos a 1280 px (telas) | Exemplo (seletor @tela) |
|---|---|---|---|
| 9.92px | 4 (2) | 4 (2) | `span.nuc-a @resolucao-final-qui` |
| 11px | — | 3 (1) | `button.nota.n-e kbd @flashcards-verso` |
| 12px | 535 (21) | 479 (17) | `span.ag-sem @revisao-vazia` |
| 12.5px | 57 (17) | 57 (17) | `div.abas.abas-rev button>small @revisao-vazia` |
| 12.8px | 2 (1) | 2 (1) | `span.fm-linha sub @escada-fis` |
| 13px | 365 (60) | 460 (62) | `h3.rg-cap-t @revisao-geral-mat` |
| 13.056px | — | 6 (1) | `span.fm-linha sub @revisao-geral-busca` |
| 13.2px | 100 (7) | — | `span.frac-n @correcao-mat` |
| 13.3333px | — | 9 (1) | `small.fraco.num @desempenho` |
| 13.44px | 2 (1) | — | `span.fm-linha sup @essencial-qui-3` |
| 13.5px | 1059 (85) | 4 (3) | `span.fraco.nv-outras @escada-bio` |
| 13.6px | — | 100 (7) | `span.frac-n @correcao-mat` |
| 14px | 671 (72) | 1776 (95) | `div.rg-busca small @revisao-geral-mat` |
| 14.5px | 21 (1) | 21 (1) | `b.num @desempenho` |
| 15px | 2209 (102) | 1277 (99) | `div.rg-busca label @revisao-geral-mat` |
| 15.5px | 21 (21) | 21 (21) | `details.cor-outras summary @correcao-bio` |
| 15.8px | 19 (18) | 20 (19) | `small.num @revisao-geral-mat` |
| 16px | 611 (98) | 726 (101) | `p.mat-sub.num @revisao-geral-mat` |
| 16.5px | 242 (24) | — | `span.rg-p @revisao-geral-topico-mat` |
| 16.64px | — | 2 (1) | `span.fm-linha sup @essencial-qui-3` |
| 17px | 150 (56) | 1704 (75) | `p.tp-stat.num @revisao-geral-mat` |
| 17.82px | 20 (1) | — | `span.frac-n @revisao-geral-topico-mat` |
| 18px | 240 (51) | 272 (51) | `p.in-dest-sub @inicio-vazio` |
| 18.06px | 24 (3) | — | `span.ra-st @resolucao-final-mat` |
| 18.36px | — | 34 (3) | `span.frac-n @revisao-geral-mat` |
| 19px | 131 (70) | 18 (6) | `button.in-personalizar @inicio-vazio` |
| 19.008px | — | 8 (1) | `span.frac-n @revisao-geral-mat` |
| 19.8px | 3 (1) | — | `span.fm-linha @revisao-geral-topico-mat` |
| 20px | 5 (2) | 15 (7) | `p.in-sec-sub @inicio-vazio` |
| 20.4px | — | 15 (3) | `span.fm-linha @revisao-geral-mat` |
| 20.64px | — | 4 (1) | `span.frac-n @questao-aba-teoria` |
| 21px | 311 (11) | 160 (73) | `h2.tp-h @revisao-geral-mat` |
| 21.12px | — | 1 (1) | `span.fm-linha @revisao-geral-mat` |
| 22px | 51 (26) | 63 (30) | `p.tp-stat.num b @revisao-geral-mat` |
| 22.36px | — | 20 (2) | `span.ra-st @resolucao-final-mat` |
| 24px | 33 (11) | 33 (11) | `dt.num @materia-bio` |
| 25px | 70 (59) | 10 (5) | `span.in-at-txt b @inicio-vazio` |
| 25.35px | 4 (1) | — | `b.num @desempenho` |
| 26px | 1 (1) | 309 (11) | `span.ra-t @resolucao-final-bio` |
| 28px | 5 (5) | — | `header.in-cab h1 @inicio-vazio` |
| 30px | 22 (9) | 16 (5) | `b.num @boasvindas-2` |
| 32px | — | 76 (59) | `div.rg-capa-txt h1 @revisao-geral-mat` |
| 33.28px | — | 3 (1) | `dd.num @revisao-dominio` |
| 34px | 9 (9) | 9 (9) | `b.num @materia-bio` |
| 40px | — | 15 (5) | `header.in-cab h1 @inicio-vazio` |
| 42px | 32 (32) | — | `a.tit-mat @revisao-geral-mat` |
| 54px | — | 32 (32) | `a.tit-mat @revisao-geral-mat` |

**font-weight** — 4 valores distintos a 390 px, 4 a 1280 px

| Valor | Elementos a 390 px (telas) | Elementos a 1280 px (telas) | Exemplo (seletor @tela) |
|---|---|---|---|
| 400 | 2008 (100) | 2133 (100) | `p.mat-sub.num @revisao-geral-mat` |
| 500 | 1012 (88) | 1193 (88) | `a.tp-volta @revisao-geral-mat` |
| 600 | 3376 (102) | 3812 (102) | `div.rg-busca label @revisao-geral-mat` |
| 700 | 633 (88) | 646 (88) | `a.tit-mat @revisao-geral-mat` |

**line-height (razão sobre o font-size)** — 18 valores distintos a 390 px, 18 a 1280 px

| Valor | Elementos a 390 px (telas) | Elementos a 1280 px (telas) | Exemplo (seletor @tela) |
|---|---|---|---|
| 0 | 4 (2) | 10 (3) | `span.fm-linha sub @revisao-geral-busca` |
| 1 | 695 (98) | 805 (99) | `button.chip @revisao-geral-mat` |
| 1.02 | 100 (7) | 100 (7) | `span.frac-n @correcao-mat` |
| 1.05 | 36 (34) | 36 (34) | `a.tit-mat @revisao-geral-mat` |
| 1.08 | 66 (6) | 88 (8) | `span.frac-n @revisao-geral-mat` |
| 1.1 | 55 (18) | 68 (20) | `span.fm-linha @revisao-geral-mat` |
| 1.15 | 75 (59) | 81 (59) | `div.rg-capa-txt h1 @revisao-geral-mat` |
| 1.17 | 210 (15) | 294 (15) | `span.ag-sem @revisao-vazia` |
| 1.2 | 361 (93) | 359 (96) | `h2.tp-h @revisao-geral-mat` |
| 1.25 | 166 (63) | 34 (18) | `span.tg-n i @materia-bio` |
| 1.3 | 1874 (89) | 2114 (90) | `h3.rg-cap-t @revisao-geral-mat` |
| 1.35 | 94 (8) | 100 (8) | `b.ra-faz @resolucao-final-bio` |
| 1.4 | 759 (93) | 767 (93) | `div.rg-busca small @revisao-geral-mat` |
| 1.45 | 88 (19) | 100 (25) | `div.rs-caixa.rg-caixa span @revisao-geral-mat` |
| 1.5 | 2073 (100) | 2417 (101) | `p.mat-sub.num @revisao-geral-mat` |
| 1.55 | 41 (27) | 66 (33) | `span.rg-p @revisao-geral-mat` |
| 1.6 | 276 (23) | 276 (23) | `p.cor-expl @correcao-bio` |
| normal | 56 (14) | 69 (16) | `button.ra-link @correcao-bio` |

**letter-spacing (em em)** — 10 valores distintos a 390 px, 11 a 1280 px

| Valor | Elementos a 390 px (telas) | Elementos a 1280 px (telas) | Exemplo (seletor @tela) |
|---|---|---|---|
| -0.03em | 9 (9) | 9 (9) | `b.num @materia-bio` |
| -0.02em | 118 (59) | 124 (59) | `div.rg-capa-txt h1 @revisao-geral-mat` |
| -0.01em | 178 (47) | 178 (47) | `span.in-mat-nome @inicio-vazio` |
| -0.009em | 34 (17) | 34 (17) | `p.tp-stat.num b @revisao-geral-mat` |
| -0.007em | — | 1 (1) | `span.fraco @provas` |
| -0.006em | 20 (19) | 20 (19) | `small.num @revisao-geral-mat` |
| -0.005em | 121 (73) | 124 (76) | `h2.tp-h @revisao-geral-mat` |
| 0 | 6314 (102) | 6945 (102) | `a.tit-mat @revisao-geral-mat` |
| 0.02em | 40 (40) | 110 (44) | `p.in-rotulo @inicio-vazio` |
| 0.04em | 6 (5) | 18 (11) | `p.es-pegadinha.rg-peg b @revisao-geral-mat` |
| 0.08em | 189 (15) | 221 (16) | `h3.rg-cap-t @revisao-geral-mat` |

**padding (cada lado conta uma vez)** — 43 valores distintos a 390 px, 59 a 1280 px

| Valor | Elementos a 390 px (telas) | Elementos a 1280 px (telas) | Exemplo (seletor @tela) |
|---|---|---|---|
| 0.42px | 198 (9) | — | `span.ra-t.op @resolucao-final-bio` |
| 0.52px | — | 198 (9) | `span.ra-t.op @resolucao-final-bio` |
| 0.53px | 50 (7) | — | `span.frac-n @correcao-mat` |
| 0.54px | — | 50 (7) | `span.frac-n @correcao-mat` |
| 0.72px | 19 (5) | 11 (2) | `span.frac-n @escada-mat` |
| 0.79px | 50 (7) | — | `span.frac-d @correcao-mat` |
| 0.82px | — | 50 (7) | `span.frac-d @correcao-mat` |
| 1px | 402 (9) | 416 (12) | `button.rg-limpa @revisao-geral-busca` |
| 1.08px | 19 (5) | 11 (2) | `span.frac-d @escada-mat` |
| 2px | 513 (65) | 452 (61) | `label.ep-busca input @boasvindas-1` |
| 2.38px | 200 (7) | — | `span.frac-n @correcao-mat` |
| 2.45px | — | 200 (7) | `span.frac-n @correcao-mat` |
| 3px | 166 (41) | 179 (41) | `span.nivel-etq.n-basico @escada-mat` |
| 3.21px | 40 (1) | — | `span.frac-n @revisao-geral-topico-mat` |
| 3.24px | 44 (2) | 44 (2) | `span.frac-n @escada-mat` |
| 3.25px | 32 (3) | — | `span.frac-n @resolucao-final-mat` |
| 3.3px | — | 68 (3) | `span.frac-n @revisao-geral-mat` |
| 4px | 1628 (84) | 1678 (77) | `a.tp-volta @revisao-geral-mat` |
| 4.02px | — | 24 (2) | `span.frac-n @resolucao-final-mat` |
| 5px | 58 (4) | 65 (5) | `button.chip @treino-mat` |
| 6px | 2467 (85) | 1106 (79) | `button.rg-limpa @revisao-geral-busca` |
| 7px | 483 (63) | 490 (65) | `button.chip @revisao-geral-mat` |
| 8px | 1281 (82) | 1147 (80) | `a.tp-volta @revisao-geral-mat` |
| 8.5px | 92 (9) | 92 (9) | `svg.ic @materia-bio` |
| 9px | 178 (49) | 181 (41) | `button.sanfona @escada-mat` |
| 10px | 1481 (93) | 1750 (93) | `a.tp-volta @revisao-geral-mat` |
| 12px | 2124 (86) | 4402 (90) | `h2.tp-h @revisao-geral-mat` |
| 13px | 195 (47) | 195 (47) | `button.btn.sec @tema-bio` |
| 14px | 1579 (97) | 1369 (84) | `button.chip @revisao-geral-mat` |
| 16px | 1350 (101) | 817 (86) | `article.tp-bloco.rg-topico @revisao-geral-mat` |
| 18px | 455 (87) | 469 (68) | `section.tp-bloco.rg-indice @revisao-geral-mat` |
| 20px | 313 (80) | 526 (85) | `button.btn @revisao-geral-mat` |
| 22px | 82 (31) | 367 (77) | `div.conteudo.rg @revisao-geral-mat` |
| 26px | 78 (39) | 100 (50) | `a.capa-tg @materia-bio` |
| 28px | 20 (11) | 102 (32) | `section.tp-capa.rg-capa @revisao-geral-mat` |
| 30px | 115 (45) | 97 (31) | `section.tp-capa.rg-capa @revisao-geral-mat` |
| 32px | 42 (42) | 298 (99) | `div.conteudo.rg @revisao-geral-mat` |
| 34px | 25 (13) | 57 (20) | `section.in-treino @inicio-vazio` |
| 36px | 5 (5) | 20 (5) | `section.in-treino @inicio-vazio` |
| 40px | 59 (50) | 24 (13) | `div.bv-lado @boasvindas-1` |
| 44px | 13 (13) | 23 (13) | `div.rg-busca-cx input @revisao-geral-mat` |
| 48px | 20 (14) | 129 (102) | `div.conteudo.rg @revisao-geral-mat` |
| 100px | 57 (57) | — | `div.conteudo.rg @revisao-geral-mat` |
| (outros 27 valores com menos de 20 usos somados) | | | |

**margin (cada lado conta uma vez)** — 59 valores distintos a 390 px, 82 a 1280 px

| Valor | Elementos a 390 px (telas) | Elementos a 1280 px (telas) | Exemplo (seletor @tela) |
|---|---|---|---|
| -32px | — | 100 (50) | `div.in-mats-faixa.fd @inicio-vazio` |
| -30px | 70 (35) | — | `div.q-resp @questao-bio` |
| -16px | 142 (68) | 78 (39) | `div.q-resp @questao-bio` |
| -10px | — | 63 (10) | `span.t @tema-bio` |
| -8px | 49 (27) | 44 (22) | `nav.faixa-temas.fd @materia-bio` |
| -7.48px | — | 100 (7) | `span.frac @correcao-mat` |
| -7.26px | 100 (7) | — | `span.frac @correcao-mat` |
| -6px | 143 (20) | 6 (6) | `p.fr-aviso @escada-bio` |
| -2px | 138 (35) | 138 (35) | `i.ponto-sub @questao-bio` |
| -1px | 32 (7) | 32 (7) | `div.abas.abas-rev button @revisao-vazia` |
| 1px | 67 (33) | 73 (39) | `svg.ic @revisao-geral-mat` |
| 1.58px | 100 (7) | — | `span.frac @correcao-mat` |
| 1.63px | — | 100 (7) | `span.frac @correcao-mat` |
| 2px | 177 (55) | 191 (61) | `p.es-pegadinha.rg-peg b @revisao-geral-mat` |
| 2.14px | 20 (1) | — | `span.frac @revisao-geral-topico-mat` |
| 2.16px | 22 (2) | 22 (2) | `span.frac @escada-mat` |
| 2.2px | — | 34 (3) | `span.frac @revisao-geral-mat` |
| 3px | 116 (29) | 116 (29) | `span.barra @materia-bio` |
| 4px | 243 (71) | 254 (71) | `p.mat-sub.num @revisao-geral-mat` |
| 5.1px | 137 (35) | 137 (35) | `i.ponto-sub @questao-bio` |
| 5.75px | 427 (7) | — | `i.ponto-sub @revisao-geral-mat` |
| 6px | 376 (77) | 472 (92) | `small.num @revisao-geral-mat` |
| 6.25px | 65 (1) | 71 (1) | `i.ponto-sub @revisao-dominio` |
| 6.7px | 63 (10) | — | `i.ponto-sub @tema-bio` |
| 7px | 114 (9) | 114 (9) | `div.barra @materia-bio` |
| 7.05px | — | 537 (8) | `i.ponto-sub @revisao-geral-mat` |
| 7.7px | — | 63 (10) | `i.ponto-sub @tema-bio` |
| 8px | 155 (78) | 156 (78) | `p.rg-apoio @revisao-geral-mat` |
| 10px | 224 (82) | 224 (82) | `div.tp-topo @revisao-geral-mat` |
| 12px | 184 (63) | 114 (52) | `header.rg-top-cab @revisao-geral-mat` |
| 14px | 133 (73) | 121 (73) | `div.mat-cab @revisao-geral-mat` |
| 16px | 193 (34) | 250 (38) | `div.rg-cap @revisao-geral-mat` |
| 18px | 90 (73) | 135 (73) | `h2.in-sec-tit @inicio-vazio` |
| 20px | 37 (36) | 35 (34) | `div.abas.abas-rev @revisao-vazia` |
| 22px | 69 (43) | 100 (43) | `div.rg-busca @revisao-geral-mat` |
| 24px | 60 (51) | 59 (48) | `div.bv-ilus @boasvindas-1` |
| 26px | 37 (24) | 41 (26) | `section.tp-bloco.fl-bloco @flashcards-vazio-fis` |
| 28px | 52 (25) | 60 (33) | `div.rg-grade @revisao-geral-mat` |
| 30px | 10 (5) | 10 (5) | `div.in-desemp-nums @inicio-vazio` |
| 113px | — | 27 (9) | `div.q-print @questao-geo` |
| (outros 67 valores com menos de 20 usos somados) | | | |

**gap de flex/grade (cada lado conta uma vez)** — 19 valores distintos a 390 px, 19 a 1280 px

| Valor | Elementos a 390 px (telas) | Elementos a 1280 px (telas) | Exemplo (seletor @tela) |
|---|---|---|---|
| 2px | 499 (41) | 529 (41) | `button.bv-meta @boasvindas-2` |
| 3px | 202 (18) | 288 (23) | `li.ag-dia.hoje @revisao-vazia` |
| 4px | 798 (83) | 796 (81) | `ol.ag-dias @revisao-vazia` |
| 5px | 288 (51) | 360 (51) | `div.mp-cols @materia-bio` |
| 6px | 1762 (93) | 1732 (88) | `button.chip @revisao-geral-mat` |
| 7px | 54 (9) | 54 (9) | `ul.mp-leg li @materia-bio` |
| 7.35px | 2 (1) | — | `div.fm.fm-bloco @essencial-qui-3` |
| 8px | 2164 (99) | 2333 (99) | `a.tp-volta @revisao-geral-mat` |
| 9px | 24 (3) | 24 (3) | `ul.rs-pontos li @escada-mat` |
| 9.1px | — | 2 (1) | `div.fm.fm-bloco @essencial-qui-3` |
| 10px | 1397 (81) | 1327 (87) | `div.rs-caixa.rg-caixa @revisao-geral-mat` |
| 12px | 1518 (87) | 1422 (93) | `header.rg-top-cab @revisao-geral-mat` |
| 14px | 488 (61) | 390 (60) | `div.in-mats-rolo @inicio-vazio` |
| 16px | 306 (78) | 598 (78) | `div.mat-cab @revisao-geral-mat` |
| 18px | 14 (7) | 186 (21) | `div.bv-ilus @boasvindas-1` |
| 20px | 122 (68) | 103 (63) | `div.tp-acoes @flashcards-vazio-fis` |
| 22px | 72 (18) | 84 (24) | `a.in-atalho @inicio-vazio` |
| 24px | 43 (10) | 72 (18) | `div.in-dest-acoes @inicio-vazio` |
| 28px | 26 (25) | 67 (32) | `div.rg-capa-g @revisao-geral-mat` |
| 40px | 22 (7) | 12 (7) | `div.conteudo.inicio-novo @inicio-vazio` |

**border-radius** — 22 valores distintos a 390 px, 24 a 1280 px

| Valor | Elementos a 390 px (telas) | Elementos a 1280 px (telas) | Exemplo (seletor @tela) |
|---|---|---|---|
| 0px 8px 8px 0px | 10 (4) | 10 (4) | `p.ra-linha.diag @resolucao-final-bio` |
| 0px 0px 17px 17px | — | 39 (39) | `div.q-resp @questao-bio` |
| 0px 0px 15px 15px | 4 (4) | — | `div.q-resp.com-texto @questao-fis` |
| 2px | 44 (44) | 44 (44) | `span.p i @questao-bio` |
| 3px | 361 (27) | 466 (33) | `span.t mark @revisao-geral-busca` |
| 4px | 207 (26) | 249 (26) | `span.ag-col @revisao-vazia` |
| 4px 4px 2px 2px | 131 (14) | 131 (14) | `span.mp-col i @materia-bio` |
| 4px 4px 0px 0px | 45 (5) | 45 (5) | `i.vazia @inicio-vazio` |
| 5px | — | 3 (1) | `button.nota.n-e kbd @flashcards-verso` |
| 6px | 204 (9) | 205 (10) | `span.ep-caixa @boasvindas-1` |
| 7px | 2 (1) | 2 (1) | `div.tema-seg button @inicio` |
| 8px | 225 (45) | 296 (45) | `span.q-ajuda @questao-bio` |
| 9px | 168 (52) | 187 (52) | `button.rg-limpa @revisao-geral-busca` |
| 10px | 611 (74) | 615 (74) | `a.tp-volta @revisao-geral-mat` |
| 11px | 384 (61) | 396 (67) | `button.btn @revisao-geral-mat` |
| 12px | 984 (82) | 1089 (82) | `div.rg-busca-cx input @revisao-geral-mat` |
| 13px | 48 (48) | 48 (48) | `button.btn.grande @boasvindas-1` |
| 14px | 155 (64) | 94 (43) | `a.d @revisao-geral-mat` |
| 16px | 442 (68) | 443 (50) | `section.tp-bloco.rg-indice @revisao-geral-mat` |
| 18px | 60 (36) | 140 (77) | `section.tp-capa.rg-capa @revisao-geral-mat` |
| 20px | 519 (71) | 560 (73) | `button.chip @revisao-geral-mat` |
| 24px | — | 9 (9) | `span.tp-ic @tema-bio` |
| 50% | 1504 (86) | 1629 (86) | `i.ponto-sub @revisao-geral-mat` |
| 99px | 69 (10) | 69 (10) | `div.mp-barra @materia-bio` |
| 999px | 46 (38) | 46 (38) | `button.q-amplia @questao-bio` |

**espessura de borda** — 3 valores distintos a 390 px, 3 a 1280 px

| Valor | Elementos a 390 px (telas) | Elementos a 1280 px (telas) | Exemplo (seletor @tela) |
|---|---|---|---|
| 1px | 2217 (99) | 2245 (99) | `section.tp-capa.rg-capa @revisao-geral-mat` |
| 2px | 46 (8) | 46 (8) | `div.abas.abas-rev button @revisao-vazia` |
| 3px | 32 (8) | 32 (8) | `p.cor-expl.cor-trecho @correcao-por` |

**box-shadow** (1280 px, claro) — 22 valores distintos (anéis na cor da matéria agrupados)

| Sombra | Elementos | Telas | Exemplo |
|---|---|---|---|
| `rgba(20, 22, 30, 0.04) 0px 1px 2px 0px, rgba(20, 22, 30, 0.22) 0px 10px 26px -18px` | 332 | 63 | `a.ft-item @materia-bio` |
| `rgba(20, 22, 30, 0.04) 0px 1px 0px 0px` | 125 | 35 | `button.alt @questao-bio` |
| `rgba(21, 25, 51, 0.04) 0px 1px 2px 0px` | 123 | 44 | `section.tp-bloco.rg-indice @revisao-geral-mat` |
| `rgba(0, 0, 0, 0.08) 0px 1px 2px 0px` | 58 | 48 | `button.btn @revisao-geral-mat` |
| `rgba(21, 25, 51, 0.04) 0px 1px 2px 0px, rgba(21, 25, 51, 0.22) 0px 10px 24px -16px` | 45 | 5 | `a.in-mat @inicio-vazio` |
| `rgb(229, 229, 224) 0px 0px 0px 1px inset` | 35 | 35 | `span.crono-tot.num @questao-bio` |
| `rgb(229, 229, 224) 0px 0px 0px 1px` | 35 | 35 | `div.q-print @questao-bio` |
| `<cor da matéria a 0.16> 0px 0px 0px 3px` | 27 | 27 | `button.alt.sel @correcao-bio` |
| `rgba(20, 22, 30, 0.25) 0px 4px 14px -4px` | 21 | 20 | `button.ft-seta.dir @materia-bio` |
| `<cor da matéria a 0.16> 0px 0px 0px 3px, rgba(20, 22, 30, 0.04) 0px 1px 2px 0px, rgba(20, 22, 30, 0.22) 0px 10px 26px -18px` | 13 | 13 | `a.ft-item.atual @tema-bio` |
| `<cor da matéria a 0.45> 0px 0px 0px 1.5px inset` | 11 | 11 | `button.btn.btn-conf @questao-bio` |
| `<cor da matéria a 0.45> 0px 0px 0px 1px inset` | 7 | 7 | `a.rg-item.atual @revisao-geral-mat` |
| `rgba(21, 25, 51, 0.08) 0px 2px 6px 0px, rgba(21, 25, 51, 0.14) 0px 18px 48px 0px` | 6 | 6 | `div.ra-ctl.presa @correcao-aberta-bio` |
| `rgba(21, 25, 51, 0.14) 0px 4px 14px 0px` | 5 | 5 | `button.in-seta.dir @inicio-vazio` |
| `rgba(21, 25, 51, 0.05) 0px 1px 2px 0px, rgba(21, 25, 51, 0.06) 0px 8px 22px 0px` | 5 | 4 | `article.flashcard.folha @flashcards-sessao` |
| `<cor da matéria> 0px 0px 0px 1.5px inset` | 4 | 4 | `span.nivel-etq.n-intermediario @escada-mat` |
| `<cor da matéria a 0.6> 0px 0px 0px 1.5px inset` | 4 | 4 | `a.degrau.prox @escada-mat` |
| `<cor da matéria a 0.22> 0px 0px 0px 3px` | 3 | 3 | `div.rg-busca-cx input @revisao-geral-busca` |
| `rgb(23, 24, 28) 0px 0px 0px 1px inset` | 2 | 2 | `button.bv-meta.sel @boasvindas-2` |
| `<cor da matéria a 0.55> 0px 0px 0px 1.5px inset` | 2 | 2 | `button.fl-tema @flashcards-vazio-fis` |
| `rgba(21, 25, 51, 0.02) 1px 0px 0px 0px, rgba(21, 25, 51, 0.08) 4px 0px 16px -6px` | 1 | 1 | `aside.lado @inicio` |
| `rgba(0, 0, 0, 0.2) 0px 1px 2px 0px` | 1 | 1 | `div.tema-seg button @inicio` |

**box-shadow** (1280 px, escuro) — 19 valores distintos (anéis na cor da matéria agrupados)

| Sombra | Elementos | Telas | Exemplo |
|---|---|---|---|
| `rgba(20, 22, 30, 0.04) 0px 1px 2px 0px` | 252 | 22 | `a.ft-item @materia-bio` |
| `rgba(20, 22, 30, 0.04) 0px 1px 0px 0px` | 125 | 35 | `button.alt @questao-bio` |
| `rgba(0, 0, 0, 0.6) 0px 10px 26px -18px` | 80 | 41 | `article.folha.q-cartao @questao-bio` |
| `rgba(0, 0, 0, 0.08) 0px 1px 2px 0px` | 58 | 48 | `button.btn @revisao-geral-mat` |
| `<cor da matéria a 0.16> 0px 0px 0px 3px` | 40 | 40 | `a.ft-item.atual @tema-bio` |
| `rgb(37, 39, 45) 0px 0px 0px 1px inset` | 35 | 35 | `span.crono-tot.num @questao-bio` |
| `rgb(37, 39, 45) 0px 0px 0px 1px` | 33 | 33 | `div.q-print @questao-bio` |
| `rgba(20, 22, 30, 0.25) 0px 4px 14px -4px` | 21 | 20 | `button.ft-seta.dir @materia-bio` |
| `<cor da matéria a 0.45> 0px 0px 0px 1.5px inset` | 11 | 11 | `button.btn.btn-conf @questao-bio` |
| `<cor da matéria a 0.45> 0px 0px 0px 1px inset` | 7 | 7 | `a.rg-item.atual @revisao-geral-mat` |
| `rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.5) 0px 18px 48px 0px` | 6 | 6 | `div.ra-ctl.presa @correcao-aberta-bio` |
| `rgba(21, 25, 51, 0.14) 0px 4px 14px 0px` | 5 | 5 | `button.in-seta.dir @inicio-vazio` |
| `rgba(255, 255, 255, 0.03) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.22) 0px 8px 24px 0px` | 5 | 4 | `article.flashcard.folha @flashcards-sessao` |
| `<cor da matéria> 0px 0px 0px 1.5px inset` | 4 | 4 | `span.nivel-etq.n-intermediario @escada-mat` |
| `<cor da matéria a 0.6> 0px 0px 0px 1.5px inset` | 4 | 4 | `a.degrau.prox @escada-mat` |
| `<cor da matéria a 0.22> 0px 0px 0px 3px` | 3 | 3 | `div.rg-busca-cx input @revisao-geral-busca` |
| `rgb(237, 238, 241) 0px 0px 0px 1px inset` | 2 | 2 | `button.bv-meta.sel @boasvindas-2` |
| `<cor da matéria a 0.55> 0px 0px 0px 1.5px inset` | 2 | 2 | `button.fl-tema @flashcards-vazio-fis` |
| `rgba(0, 0, 0, 0.2) 0px 1px 2px 0px` | 1 | 1 | `div.tema-seg button @inicio` |

**Cores escritas direto no CSS, fora das variáveis** (contagem no código, `app/src/estilo/*.css`)

| Arquivo | Hexadecimais (distintos) | rgb()/rgba() | Exemplos |
|---|---|---|---|
| `login.css` | 58 (57) | 30 | tela de entrada — protegida, não entra em proposta |
| `inicio.css` | 26 (18) | 3 | `#000` ×8 em misturas; azul "todas as matérias" `#E3EBFB`, `#12306F`, `#1C3FC4`; trilho `#E4E4E1` |
| `telas.css` | 15 (4) | 5 | `#000` ×8, `#FFF` ×5, `#4A4D55`, `#6B6E77` |
| `sistema.css` | 10 (7) | 3 | papel do print: `#DAD5C8` ×2, `#3E3A31` ×2, `#FBFAF7`, `#5F5B50`, `#F1EEE6`, `#E9E5DA` |
| `correcao.css` | 7 (7) | 1 | caderno: `#FFE36E`, `#D6E4F0`, `#FBF7EA`, `#5A5F7A`, `#2E2C27`, `#1C1B18`, `#B9B3A0` |
| `icones-tema.css` | 4 (3) | 8 | círculo dos ícones — protegido |
| `app.css` | 3 (3) | 3 | `#FFF`, `#FBF7F3`, `#101410` (abertura) |
| `tipografia.css` | 0 | 1 | `rgba(0,0,0,.2)` |
| `base.css` (fora dos blocos de variáveis), `dominio.css`, `geral.css`, `hoje.css`, `regiao.css`, `revisao.css` | 0 | 0 | — |
| `.tsx` | 6 | — | `Casca.tsx` `#0C0D10`, `#F1F1EE` (cor da barra do navegador); `Login.tsx` 4 cores do logo do Google |

**Declarações no CSS** (contagem no código): 124 formas distintas de declarar tamanho de letra. As mais repetidas: `14px` ×58, `15px` ×56, `16px` ×40, `var(--fs-info)` ×30, `17px` ×21, `13px` ×19, `13.5px` ×18, `18px` ×17. Cantos: `12px` ×46, `50%` ×34, `10px` ×32, `var(--r)` ×18, `8px` ×14, `var(--r-dest)` ×13, `var(--r-bloco)` ×12, `14px` ×12. No protótipo (`app-atual/design/materia.css`): 34 tamanhos de letra e 30 cantos distintos, com os mesmos valores dominantes (14, 15, 16, 17 px; 12, 14, 10 px).

**Controles: altura, canto e letra** (medido a 1280 px, claro)

| Peça | Altura | Canto | Observação |
|---|---|---|---|
| Botão `.btn` | 46 | 11 | sombra `0 1px 2px rgba(0,0,0,.08)` |
| Botão pequeno `.btn.peq`, `a.btn.sec` da Revisão | 38 | 10 | |
| Botão grande `.btn.grande` (boas-vindas) | 56 | 13 | |
| Botão grande do Início (`.in-dest-txt .btn.grande`) | 60 | 10 | canto diferente do grande do sistema |
| "Começar" do tema e dos flashcards `.btn.tp-comecar` | 60 | 14 | |
| Botão da capa do Treino geral `.btn.btn-capa` | 66 | 16 | sem sombra |
| "Confirmar resposta" `.btn-conf` | 54 | 13 | |
| "Corrigir" do flashcard `.btn.fc-corr` | 52 | 11 | |
| Botões de ícone: `.q-pausa`, `.q-tela`, `.q-ajuda` | 32 | 8 | |
| Recolher menu `.btn-ic` (menu) | 34 | 9 | |
| Marcador `.q-marca`; controles da animação `.ra-bt` | 36 | 10; 9 | |
| `.btn-ic`, `.q-ant`, seta da faixa `.ft-seta` | 40 | 11; 10; 50% | |
| Seta do Início `.in-seta` | 46 | 50% | |
| Chip `.chip` | 31 (26 no treino) | 20 | |
| Chip de certeza | 30 | 8 | |
| Filtro de área dos flashcards `.fl-area` | 48 | 999 | |
| Abas da questão / abas da Revisão e Simulados | 45 / 37 | 0 | fio de 2 px nas abas da Revisão e dos Simulados |
| Campo `.campo input` / busca de provas `.ep-busca` / busca do topo / período | 48 / 46 / 40 / 46 | 12 / 12 / 10 / 10 | |
| Alternativa `.alt` | 50 | 12 | borda 1,5 px no CSS (em tela de densidade 1 o navegador desenha 1 px) |

**Contraste abaixo de 4,5:1 em texto normal** (o que não é controle desabilitado)

| Onde | Cor do texto / fundo | Contraste | Tema | Causa |
|---|---|---|---|---|
| Rótulo "TOTAL" `.crono-tot small` (14 px/600 medido; `tipografia.css` linha 97 passa por cima dos 11,5 px de `sistema.css` linha 43) | #777980 / #F1F1EE | 3,85 | claro | `opacity: .8` sobre `lapis` (valor herdado do protótipo, `materia.css` linha 1648). O rótulo "QUESTÃO" passa. |
| Etiquetas de nível em cartão sem questão `.nivel-cartao.vazio .nivel-etq` | #C8834A / #FFF0E8 (Fís); #4DA642 / #E3FCE0 (Bio) | 2,79; 2,82 | claro | `opacity: .72` no cartão inteiro |
| "13 questões de outras regiões" `.nv-outras` (13,5 px) | #8E9097 / #FFFFFF; #6B6D76 / #16171B | 3,18; 3,49 | claro; escuro | idem |
| Cor da matéria sobre o fundo suave (`.etq.cor`, `.alt-l`, `.hj-n`; no escopo da matéria `--sv` é igual a `--s`, `ui/comum.tsx`) | Quí #D31A8D / #FFEEF5; Fís #B2580D / #FFF0E8; Bio #138404 / #E3FCE0; Fil-Soc #8C6C02 / #FFF3D5 | 4,37; 4,40; 4,45; 4,47 | claro | paleta aprovada |
| Idem | His #B77B4C / #472302; Ing #FE3E3A / #4B1D1F; Geo #59A0AB / #00353B | 3,94; 3,99; 4,48 | escuro | paleta aprovada |
| Cor da matéria sobre o papel (`.fr-trocar` "Trocar", `.in-rotulo`, `.rv-tp-n`) | Bio #138404; Quí #D31A8D; Fís #B2580D; Fil-Soc #8C6C02 / #F1F1EE | 4,29; 4,31; 4,32; 4,36 | claro | paleta aprovada |
| Rodapé do login `.l-rodape` (10 px) | #9B9397 / fundo com gradiente | 2,96 (não medido com segurança) | — | tela protegida |

Passam: `tinta`, `lapis` (5,99 sobre o papel) e `fraco` (5,14 sobre o papel) nos dois temas; certo, errado e aviso sobre seus fundos (4,88 a 9,57); letra dos botões sobre a cor da matéria (4,85 a 9,40); cor das 9 matérias sobre a folha branca (4,85 a 9,05). Ficam de fora por serem controles desabilitados (a WCAG dispensa): alternativas não escolhidas depois da resposta (`opacity .45`), "Tudo em dia" dos flashcards, "Anterior" na primeira tela da revisão.

**Medida de linha** (caracteres por linha, texto de 3 linhas ou mais)

| Texto | 390 px | 1280 px | 1440 px |
|---|---|---|---|
| Explicação da correção `.cor-expl` (Literata 16,5/17 px) | 24–33 | 79–102 | 33–44 |
| "Por quê" do passo `.ra-porque` | 27–31 | 72 | 32–36 |
| Resposta correta `.cor-resp` (17 px) | 32–36 | — | 38–48 |
| "Como a ordem é feita" `.hj-como p` (13,5/14 px) | 54 | 95 | 95 |
| Explicação do domínio `.dm-expl` (13,5/14 px) | 45 | 105 | 105 |
| Resumo do conteúdo na lista do tema `.t span` | 35–39 | 71–85 | — |
| Tópico da Revisão geral `.rg-p` (17 px) | — | 53–66 | — |

**Títulos (para leitor de tela)**: têm um `h1` — Início, matérias, matéria, tema, "Treine sua evolução", Hoje, Revisão, Revisão geral, Desempenho, Provas, Perfil, Configurações, simulados (lista e prova), flashcards (lista). **Não têm `h1`** — questão (27 estados medidos), Treino geral (matéria e todas), sessão de flashcards, simulado em andamento, revisão essencial em andamento e "Questão não encontrada" (só `h3`).

**Alvos de toque abaixo de 44 px a 390 px** — 947 ocorrências nas 96 telas do primeiro percurso. Principais:

| Peça | Tamanho medido (largura × altura) | Ocorrências |
|---|---|---|
| Chip `.chip` (região, tempo, filtros) | altura 31 (26 no treino; 30 no chip de certeza) | 263 |
| Link de conteúdo relacionado `.q-rel-g a` | 324 × 34 | 123 |
| Voltar `.q-volta` | 32 × 30 | 45 |
| Tela cheia `.q-tela`; pausar `.q-pausa` | 32 × 32 | 44; 35 |
| "Ver em texto" `.q-ver-txt` | 218–241 × 27 | 39 |
| Marcador `.q-marca` | 36 × 36 | 36 |
| "Ampliar" `.q-amplia`; fonte do print `.q-print-fonte` | 85 × 28; 51–157 × 20 | 35; 35 |
| Abas da Revisão e dos Simulados | 177 × 37; 101 × 37 | 30; 2 |
| Controles da animação `.ra-bt` | 36 × 36 (velocidade 48 × 36) | 46 |
| Anterior `.q-ant`; setas da faixa `.ft-seta` | 40 × 40 | 26; 23 |
| "Trocar" `.fr-trocar`; "Ver de outras regiões" `.link-sec` | 44 × 15; 158–166 × 14 | 19; 5 |
| Botões de 38 de altura (`a.btn.sec`, `.btn.peq`, `.btn.fantasma`) | altura 38 | 27 |
| "Revisar" do Início `.in-link` | 80 × 18 | 12 |
| Caminho `.migalhas a`; "Todos os temas" `.tp-volta` | altura 32; 147 × 40 | 10; 9 |
| Dia/Noite `.tema-seg button` | 39 × 29 | 8 |
| Dica `.q-dica`; teoria antes de começar `.sanfona`; "Personalizar" | 73 × 37; 242 × 36; 110 × 35 | 7; 4; 5 |
| Login: mostrar senha, "Esqueceu sua senha?", "Criar conta" | 36 × 35; 137 × 17; 84 × 18 | 6 (tela protegida) |

A 768 px somam-se os itens do menu em trilho (47 × 40). As abas de baixo do celular têm 76 × 61 e passam.

## Itens

Ordem: do maior para o menor impacto no aluno. Grupos que se resolvem juntos: **acessibilidade** (D01, D04, D07, D19), **variáveis de tipografia** (D09 a D14 e D20), **variáveis de forma** (D15 a D18).

### D01 — Alvos de toque menores que 44 px no celular
- **Tela e seletor:** todas; lista na tabela acima (`.chip`, `.q-volta`, `.q-pausa`, `.q-tela`, `.q-marca`, `.q-amplia`, `.q-ver-txt`, `.q-ant`, `.ra-bt`, `.ft-seta`, `.abas button`, `.fr-trocar`, `.link-sec`, `.in-link`, `.tema-seg button`, `.btn.peq`, `.q-rel-g a`…). Arquivos: `sistema.css`, `app.css`, `telas.css`, `regiao.css`, `correcao.css`.
- **Valor atual (medido a 390 px):** 947 ocorrências abaixo de 44 px; menores: "Ver de outras regiões" 14 de altura, "Trocar" 15, "Revisar" 18, fonte do print 20, chip do treino 26, "Ver em texto" 27, "Ampliar" 28, Dia/Noite 29, voltar 30.
- **Problema:** ficam abaixo dos 44 px pedidos como critério desta revisão. O mínimo da WCAG 2.2 (critério 2.5.8, nível AA) é 24 px: abaixo dele estão "Ver de outras regiões" (14), "Trocar" (15), "Revisar" (18) e a fonte do print (20). Nem o `CLAUDE.md` nem o `DESIGN.md` fixam 44 px como regra geral; se o dono preferir o mínimo de 24 px, a lista cai para essas quatro peças.
- **Proposta:** uma variável `--alvo-min: 44px` e, só em aparelho de toque (`@media (pointer: coarse)`), uma área de toque invisível (`::after` posicionado para completar 44 × 44) em cada peça da lista. **O desenho não muda:** tamanho, posição e ícone ficam iguais. Onde duas áreas se encostariam (chips que quebram em mais de uma linha, hoje com 8 px entre linhas), o espaço entre linhas passa a 14 px só no toque.
- **Efeito esperado:** toque certeiro no celular e no tablet; nada muda no computador.
- **Risco:** médio (muitas peças; conferir sobreposição de áreas vizinhas).
- **Categoria:** acessibilidade.
- **Evidência:** `evidencias/toque-390-questao.jpg`, `evidencias/toque-390-tema.jpg`, `evidencias/toque-390-revisao.jpg` (tracejado vermelho = menor que 44 px).
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D02 — A barra da questão corta o contador "N de M"
- **Tela e seletor:** questão, treinos, simulado — `.q-barq .t` (`sistema.css`).
- **Valor atual (medido):** a 1280 px, em Filosofia e Sociologia, o texto precisa de 314 px e tem 245 px: aparece "Trabalho e capitalismo · Intermediá…" e somem "· 35 de 44". Em Português, 330 px para 321 px. A 768 px o texto usa 2 linhas e a terceira é cortada. Não há `title` com o texto inteiro.
- **Problema:** o aluno perde a informação de onde está na sequência; o `DESIGN.md` pede "nada cortado".
- **Proposta:** o contador ("**35** de 44") vira um trecho que nunca encolhe (`flex: none`), na mesma posição e ordem; as reticências passam a valer só para o nome do tema; o texto completo entra no `title`. Nada é removido nem muda de lugar.
- **Efeito esperado:** o contador aparece sempre, em todas as larguras.
- **Risco:** baixo.
- **Categoria:** corrigir.
- **Evidência:** `evidencias/barra-questao-cortada-1280.jpg`.
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D03 — Fração escrita na linha em textos de teoria e de revisão
- **Tela e seletor:** aba Teoria da questão e cartões de teoria do tema — `p.cuidado` (`telas/Tema.tsx`, linhas 36 e 57: o texto de `cuidado` e de `erro` é impresso direto); Revisão geral — `.rs-caixa.rg-caixa span` (descrição da imagem em construção).
- **Valor atual (medido):** "Razão 2 : 3 entre partes dá frações 2/5 e 3/5 do total, não 2/3." (Matemática, tema Razão e proporção); "…dividida em 12 partes: 1/2, 1/3 e 1/4 pintadas…" (Revisão geral de Matemática). O corpo dos mesmos cartões já sai com fração empilhada (`span.frac-n`/`frac-d`).
- **Problema:** quebra a regra "fração sempre empilhada" do `CLAUDE.md`.
- **Proposta:** passar esses três textos pelo mesmo componente de fração do resto do site (`ui/Fracao.tsx`, regras de `logica/fracao.ts`), que já sabe deixar na linha datas, leis ("11.645/2008"), unidades e pares.
- **Efeito esperado:** 2 sobre 5, 3 sobre 5 e 2 sobre 3 empilhados, como no corpo do cartão.
- **Risco:** baixo (o componente já tem testes).
- **Categoria:** corrigir.
- **Evidência:** `evidencias/fracao-em-linha-teoria-mat.jpg`.
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D04 — Texto apagado por opacidade (contraste abaixo do mínimo)
- **Tela e seletor:** (a) questão e treinos — `.crono-tot small` (`sistema.css` linha 43, `opacity: .8`; tamanho e peso vêm de `tipografia.css` linha 97); (b) "Treine sua evolução" — `.nivel-cartao.vazio` (`opacity: .72` no cartão inteiro).
- **Valor atual (medido):** (a) "TOTAL", 14 px peso 600: 3,85:1 ("QUESTÃO" dá 7,96 e passa); (b) etiqueta do nível 2,79 (Física) e 2,82 (Biologia) no claro, 3,08 e 3,28 no escuro; "13 questões de outras regiões" 3,18 no claro e 3,49 no escuro; etiqueta "Avançado" 3,27 e 3,82.
- **Problema:** abaixo de 4,5:1; a frase "N questões de outras regiões" é informação, não é item desabilitado.
- **Proposta:** (a) `opacity: 1` só no rótulo "TOTAL": fica `lapis` sobre o papel = 5,99:1. **Atenção:** a opacidade de 0,8 vem do protótipo (`materia.css` linha 1648, onde o rótulo tem 11,5 px); mudar esse valor é sair do protótipo num ponto, por isso depende da autorização. (b) tirar a opacidade do cartão e aplicá-la só à barra de progresso; a frase fica em `fraco` (5,82:1 no claro, 5,55:1 no escuro) e as etiquetas voltam ao contraste normal da matéria (Biologia 4,45; "Avançado" 4,85 — ver D05).
- **Efeito esperado:** rótulo e frase legíveis; o cartão vazio continua marcado pela barra apagada e pelo texto em cinza.
- **Risco:** baixo em (b); médio em (a), por mexer num valor do protótipo.
- **Categoria:** acessibilidade.
- **Evidência:** `evidencias/niveis-apagados-escada-1280.jpg`, `evidencias/barra-questao-cortada-1280.jpg` (rótulo TOTAL).
- AUTORIZO: ( ) sim ( ) só (a) ( ) só (b) ( ) não ( ) com ajuste: ____

### D05 — Cor da matéria em letra pequena sobre o fundo suave (decisão do dono)
- **Tela e seletor:** etiquetas da matéria `.etq.cor`, letra da alternativa marcada `.alt-l`, número da ordem `.hj-n`, "Trocar" `.fr-trocar`, rótulo `.in-rotulo`; cores em `dados/materias.ts` (paleta de `docs/cores/paleta.json`). O fundo dessas peças é `--sv`, que dentro da matéria vale o mesmo que o fundo suave `--s` (`ui/comum.tsx`, função `tons`); conferido pelo estilo computado (ex.: Biologia `rgb(227, 252, 224)`).
- **Valor atual (medido):** claro, sobre o fundo suave — Química 4,37; Física 4,40; Biologia 4,45; Filosofia e Sociologia 4,47. Claro, sobre o papel — 4,29; 4,31; 4,32; 4,36. Escuro, sobre o fundo suave — História 3,94; Inglês 3,99; Geografia 4,48. As outras combinações passam (Matemática 8,20; História 7,18 no claro etc.).
- **Problema:** texto de 13 a 18 px abaixo de 4,5:1. Faltam de 0,03 a 0,13 no claro sobre o fundo suave, de 0,14 a 0,21 no claro sobre o papel e de 0,02 a 0,56 no escuro.
- **Proposta (sem criar cor):** nessas peças, quando a letra tem menos de 18,66 px em negrito, pôr o texto colorido sobre a folha (`folha`), onde as 9 matérias passam (4,85 a 9,05 no claro; 5,08 a 9,50 no escuro), mantendo o fundo suave só em peças de letra grande; **ou** manter como está. Mexer nos tons da paleta não é proposto: a paleta é do dono.
- **Efeito esperado:** etiquetas da matéria com fundo branco e contorno fino na cor, em vez do fundo colorido.
- **Risco:** alto (muda a aparência de uma peça muito usada e toca a paleta aprovada).
- **Categoria:** acessibilidade.
- **Evidência:** `evidencias/contraste-etiqueta-qui-1280.jpg`.
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D06 — Linhas longas na explicação e nos textos de apoio
- **Tela e seletor:** correção — `.cor-expl`, `.ra-porque` (`correcao.css`); Hoje — `.hj-como p` (`hoje.css`); Revisão, aba Domínio — `.dm-expl` (`dominio.css`).
- **Valor atual (medido a 1280 px):** explicação com 72 a 102 caracteres por linha (bloco de 870 a 894 px); "Como a ordem é feita" 95; explicação do domínio 105 (blocos de 762 px). A 1440 px a explicação fica com 33 a 44 (coluna de 376 px) — ver Dúvidas.
- **Problema:** fora da faixa de 45 a 75 caracteres por linha usada como critério desta revisão.
- **Proposta (valores que já existem):** `max-width: 68ch` nos parágrafos da explicação — é o limite que o protótipo usa na resolução (`materia.css` linha 1211); `max-width: 62ch` nos dois textos de apoio — é o limite do texto de apoio da agenda (`dominio.css` linha 9). Blocos e títulos não mudam de largura.
- **Efeito esperado (medido com a regra aplicada só para teste):** explicação entre 54 e 79 caracteres por linha (era 79 a 102 na mesma questão); explicação do domínio 63 (era 105); "Como a ordem é feita" 76 (era 95). Nada muda a 390 px nem na coluna estreita.
- **Risco:** baixo.
- **Categoria:** corrigir.
- **Evidência:** `evidencias/medida-linha-correcao-1280.jpg`, `evidencias/medida-linha-correcao-1440.jpg`; programas `metodo/p6.cjs` e `p7.cjs`.
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D07 — Telas de estudo sem título principal para leitor de tela
- **Tela e seletor:** questão (`telas/Questao.tsx`), treinos (`Treino.tsx`, `TreinoMisto.tsx`), sessão de flashcards, simulado em andamento (`SimuladoExec.tsx`), revisão essencial em andamento (`RevisaoEssencial.tsx`), "Questão não encontrada".
- **Valor atual (medido):** nenhum `h1`; a hierarquia começa em `h2` ou `h3`.
- **Problema:** quem usa leitor de tela não ouve em que tela está e não consegue pular pelo título.
- **Proposta:** um `h1` escondido visualmente (classe `.sr`, que já existe) com o nome da tela, por exemplo "Questão 35 de 44 — Trabalho e capitalismo".
- **Efeito esperado:** nenhuma mudança visível.
- **Risco:** baixo.
- **Categoria:** acessibilidade.
- **Evidência:** tabela "Títulos" do inventário.
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D08 — Bordas do botão "Treino geral"
Ver a seção própria abaixo (propostas A, B e C).
- **Categoria:** modernizar.
- AUTORIZO: ( ) A ( ) B ( ) C ( ) não ( ) com ajuste: ____

### D09 — A etiqueta tem três aparências
- **Tela e seletor:** questão — `.etq.cor`, `.etq.q-sub`, `.etq.q-fonte`; revisão essencial — `.rv-cab .etq`; demais telas — `.etq`, `.etq.ok`, `.etq.aviso`. No código: regra base `app.css` linha 174 (13 px, peso 500); `tipografia.css` linha 51 (`--fs-info`, peso 600); `sistema.css` linha 78 (`.q-meta .etq`, 13 px, peso 500) e `revisao.css` linha 82 (13 px) passam por cima.
- **Valor atual (medido a 1280 px):** na questão 13 px, peso 500 (39 telas); na revisão essencial 13 px, peso 600; nos flashcards e no resto do site 14 px, peso 600 (13,5 px a 390).
- **Problema:** a mesma peça com três aparências. O `DESIGN.md` (linha 109) e o protótipo (`materia.css` linha 960) dizem 13 px, peso 600.
- **Proposta:** todas com 13 px, peso 600 (valor do protótipo). Muda: as da questão ganham peso (500 → 600); as de 14 px voltam a 13 px.
- **Efeito esperado:** etiquetas iguais em todas as telas.
- **Risco:** baixo.
- **Categoria:** padronizar.
- **Evidência:** `evidencias/contraste-etiqueta-qui-1280.jpg`; tabela de font-size (13 px).
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste (ex.: manter 14 px em vez de 13): ____

### D10 — O título do 4º bloco da correção é menor que os outros
- **Tela e seletor:** correção — `details.cor-outras summary` (`correcao.css` linha 34).
- **Valor atual (medido):** 15,5 px, peso 600; os títulos dos blocos 1 a 3 (`h3.cor-tit`) têm 16 px, peso 600.
- **Proposta:** 16 px, igual aos outros três.
- **Efeito esperado:** os quatro títulos iguais.
- **Risco:** baixo.
- **Categoria:** padronizar.
- **Evidência:** tabela de font-size (15,5 px: 21 elementos, só esta peça).
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D11 — Um título de seção com 19 px no computador
- **Tela e seletor:** Revisão, aba Questões — `div.cab-sec h2`. A causa é um estilo escrito na própria tela: `style={{ fontSize: 19 }}` em `app/src/telas/Revisao.tsx` linha 94, que passa por cima de `tipografia.css` linha 22 (`--fs-secao`).
- **Valor atual (medido a 1280 px):** 19 px, peso 700; os outros títulos de seção (`h2.sec-tit`, `h2.tp-h`, `h2.ag-tit`, `.dm-mat-cab h2`) têm 21 px.
- **Proposta:** tirar o estilo escrito na tela; o título passa a seguir `var(--fs-secao)` (19 px no celular, 21 px no computador).
- **Efeito esperado:** igual aos outros títulos de seção.
- **Risco:** baixo.
- **Categoria:** padronizar.
- **Evidência:** tabela de font-size (19 px a 1280).
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D12 — Tamanhos de letra em variáveis e dois valores herdados por acidente
- **Tela e seletor:** `app/src/estilo/*.css` (124 declarações distintas de tamanho).
- **Valor atual (medido):** 38 tamanhos distintos a 1280 px e 32 a 390 px (sem o login). Dois não foram escolhidos por ninguém: 13,33 px (`small.fraco.num`, Desempenho, 9 elementos — é o tamanho padrão do `small` do navegador) e 15,8 px (`small.num` e `h2.tp-h small`, 20 elementos — resultado de conta em `em`). Nenhum dos dois existe no protótipo. Os demais valores fora do guia (12, 12,5, 13, 14,5, 18 px…) existem no protótipo e ficam.
- **Problema:** os mesmos números repetidos à mão em muitos arquivos, e dois valores sem origem.
- **Proposta:** (1) trocar os números repetidos pelas variáveis que já existem, sem mudar o valor (`16px` → `var(--fs-texto)`, `15px` de botão → `var(--fs-botao)`); (2) criar variáveis para valores do protótipo que o guia não nomeia, com o valor atual: `--fs-micro: 12px` (479 elementos a 1280 px), `--fs-etq: 13px`, `--fs-destaque: 18px` (272); (3) corrigir só os dois acidentais: 13,33 → `var(--fs-info)` (14 px) e 15,8 → `var(--fs-texto)` (16 px).
- **Efeito esperado:** diferença de 0,2 a 0,7 px em 29 elementos; o resto idêntico.
- **Risco:** médio (troca em muitos arquivos; conferir tela a tela).
- **Categoria:** padronizar.
- **Evidência:** tabela de font-size.
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D13 — Entrelinhas (RETIRADO depois da revisão)
- Propunha trocar 1,25 → 1,3; 1,45 → 1,5; 1,55 → 1,5. O revisor mostrou que esses três valores existem no protótipo (1,25 três vezes, 1,45 seis, 1,55 nove) e que o 1,55 da Revisão geral está no `DESIGN.md` (linha 193). Como o protótipo é o sistema, não há o que padronizar. O inventário de entrelinha fica só como registro.

### D14 — Espaçamento entre letras em variáveis (sem mudar valores)
- **Tela e seletor:** títulos, números e rótulos em caixa alta (`telas.css`, `sistema.css`, `inicio.css`, `revisao.css`, `geral.css`).
- **Valor atual (medido em texto visível a 1280 px):** −0,03 · −0,02 · −0,01 · −0,009 · −0,007 · −0,006 · −0,005 · 0 · 0,02 · 0,04 · 0,08 em. Os de três casas vêm de valores em px (−0,4 px, −0,2 px, −0,1 px). O programa não mede pseudo-elemento: no CSS há ainda 0,06 em nos rótulos "Correta" e "Sua" (`sistema.css` linha 134). Os valores 0,04 e 0,06 em vêm do protótipo (`materia.css` linhas 1648, 1785 e 1816).
- **Problema:** onze valores escritos à mão, alguns em px e outros em em.
- **Proposta:** só nomear, sem converter nenhum valor: `--ls-titulo: -0.02em`, `--ls-sub: -0.01em`, `--ls-rotulo: .02em`, `--ls-caps-p: .04em`, `--ls-caps: .08em`, e trocar os números por essas variáveis onde o valor é igual. Os valores em px ficam como estão.
- **Efeito esperado:** nenhuma mudança visível.
- **Risco:** baixo.
- **Categoria:** padronizar.
- **Evidência:** tabela de letter-spacing.
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D15 — Cantos em variáveis (sem mudar o desenho)
- **Tela e seletor:** `app/src/estilo/*.css`.
- **Valor atual (medido):** 24 cantos distintos a 1280 px; entre 8 e 14 px há sete valores seguidos (8, 9, 10, 11, 12, 13, 14), todos também presentes no protótipo. No código, `12px` aparece 46 vezes e `10px` 32 vezes escritos à mão; as variáveis (`--r`, `--r-dest`, `--r-bloco`, `--r-p`, `--r-item`, `--r-ctl`) somam 54 usos. Há dois jeitos de escrever pílula: `99px` (69 elementos) e `999px` (46).
- **Proposta:** criar as variáveis que faltam com os valores atuais — `--r-etq: 8px`, `--r-campo: 12px`, `--r-btn-g: 13px`, `--r-chip: 20px`, `--r-pilula: 999px` — e trocar os números por elas; `99px` → `var(--r-pilula)`. Nenhum canto muda de valor.
- **Efeito esperado:** nenhuma mudança visível; um só lugar para ajustar cada canto.
- **Risco:** baixo.
- **Categoria:** padronizar.
- **Evidência:** tabela de border-radius.
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D16 — Sombras neutras em variáveis (sem tocar no Início)
- **Tela e seletor:** `.btn` (`app.css`), `.ft-seta` (`telas.css` linha 89), `.alt` (`sistema.css` linha 124), `.tema-seg button`.
- **Valor atual (medido):** a sombra neutra aparece com três bases de cor — `rgba(21,25,51,…)`, `rgba(20,22,30,…)` e `rgba(0,0,0,…)` — e várias são escritas à mão em vez de usar variável: `0 1px 2px rgba(0,0,0,.08)` (51 elementos, botões), `0 4px 14px -4px rgba(20,22,30,.25)` (21, seta da faixa; igual ao protótipo, `materia.css` linha 1752), `0 1px 0 rgba(20,22,30,.04)` (125, alternativas).
- **Problema:** valores repetidos sem nome.
- **Proposta:** criar `--sombra-botao`, `--sombra-seta` e `--sombra-alt` com esses mesmos valores e usá-las no lugar dos números. O cartão de matéria e a seta do Início (`.in-mat`, `.in-seta`), que têm sombras um pouco diferentes, **não entram**: a aba Início segue as referências do dono de 06/11.
- **Efeito esperado:** nenhuma mudança visível.
- **Risco:** baixo.
- **Categoria:** padronizar.
- **Evidência:** tabelas de box-shadow.
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D17 — Cores escritas direto no CSS vão para variáveis
- **Tela e seletor:** `sistema.css` (papel do print), `correcao.css` (caderno), `telas.css`, `inicio.css`, `app.css`. Ficam de fora `login.css` e `icones-tema.css` (protegidos).
- **Valor atual (medido no código):** 61 hexadecimais fora das variáveis nesses cinco arquivos (tabela "Cores escritas direto no CSS").
- **Proposta:** levar cada uma para `base.css` como variável, com o mesmo valor e com o par do tema escuro que já existe (ex.: `--print-papel: #FBFAF7`, `--print-borda: #DAD5C8`, `--print-tinta: #3E3A31`); `#000` e `#FFF` usados em misturas ficam como `--preto` e `--branco`.
- **Efeito esperado:** nenhuma mudança visível.
- **Risco:** baixo.
- **Categoria:** padronizar.
- **Evidência:** tabela de cores.
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D18 — Espaços em variáveis (sem mudar medidas)
- **Tela e seletor:** `app/src/estilo/*.css`; texto do `DESIGN.md` ("Espaços: 4, 8, 12, 16, 22, 28").
- **Valor atual (medido a 1280 px):** 59 valores de padding, 82 de margin e 19 de gap. Os mais usados em gap: 8 px (2333 usos), 6 (1732), 12 (1422), 10 (1327), 4 (796), 16 (598), 2 (529), 14 (390). Em padding: 12 (4402), 10 (1750), 4 (1678), 14 (1369), 8 (1147), 6 (1106). A escala declarada no `DESIGN.md` não descreve o que o site (nem o protótipo, que usa `13px 20px`, `15px 30px`, `7px 14px`) realmente usa.
- **Problema:** documento e site divergem; não há variável de espaço.
- **Proposta:** criar variáveis para a escala real (`--e-2` 2 px, `--e-4`, `--e-6`, `--e-8`, `--e-10`, `--e-12`, `--e-14`, `--e-16`, `--e-18`, `--e-20`, `--e-22`, `--e-28`, `--e-32`), trocar os números por elas sem mudar nenhum valor e corrigir a frase do `DESIGN.md`. Os valores ímpares herdados do protótipo (7, 9, 13 px) ficam como estão.
- **Efeito esperado:** nenhuma mudança visível.
- **Risco:** médio (troca extensa; só vale a pena junto com D12 e D15).
- **Categoria:** padronizar.
- **Evidência:** tabelas de padding, margin e gap.
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D19 — O foco do teclado fica meio escondido na faixa de temas
- **Tela e seletor:** matéria, tema e "Treine sua evolução" — `.ft-rolo` (`telas.css` linha 73, hoje com `scroll-padding-inline: 10px`; máscara de 64 px nas linhas 75 a 77).
- **Valor atual (medido a 1280 px):** andando com Tab, o cartão em foco para em 1118–1314 px e a faixa visível vai de 268 a 1256 px: 58 px do cartão ficam sob a máscara da borda.
- **Proposta:** trocar `scroll-padding-inline: 10px` por `72px` (o valor da máscara da faixa do Início, `inicio.css` linha 35), para o cartão em foco parar inteiro fora da máscara de 64 px.
- **Efeito esperado:** o contorno de foco aparece inteiro. O ponto de encaixe da rolagem muda junto (o cartão encaixa 62 px mais para dentro); conferir com mouse e toque.
- **Risco:** médio (mexe no encaixe da rolagem da faixa).
- **Categoria:** acessibilidade.
- **Evidência:** `evidencias/foco-faixa-temas-1280.jpg`.
- AUTORIZO: ( ) sim ( ) não ( ) com ajuste: ____

### D20 — Letras abaixo de 12 px (RETIRADO depois da revisão)
- Propunha subir para 12 px os rótulos "Correta" e "Sua" (11,5 px) e a tecla das notas do flashcard (11 px). O revisor mostrou que 11,5 px e 11 px são valores do protótipo (`materia.css` linhas 1785 e 1816). Fica só o registro no inventário.

## Botão Treino geral

A ilustração não entra em nenhuma proposta: arquivo, tamanho, enquadramento e posição ficam como estão (`.arte-tg`, 230 × 190 px a 1280; 290 × 220 a 390).

**Como está hoje (medido, Matemática):**

| Parte | Medida |
|---|---|
| Cartão clicável `a.capa-tg` | 605 × 495 px a 1280; 358 × 673 a 390; canto 18 px; borda 1 px na cor principal a 24 %; sem sombra; fundo em gradiente do fundo suave |
| Cartão, mouse em cima | nenhuma mudança (medido: idêntico ao normal) |
| Cartão, foco do teclado | contorno 2 px na cor de texto da matéria, afastado 2 px |
| Cartão, tema escuro | a borda continua vindo da cor principal clara (#1F3FA6 a 24 %) sobre fundo #1D2C51: quase não aparece |
| Botão dentro dele `.btn.btn-capa` | 293 × 66 px (316 × 66 a 390); canto 16 px; sem borda; sem sombra; letra 21 px peso 700 |
| Botão, mouse em cima / apertado | brilho +5 % / desce 1 px |
| Vizinho "Meu progresso" `.mp` | canto 18 px; borda 1 px `linha`; sombra `--sombra-folha` |
| No protótipo | capa: canto 18, borda 1 px a 24 %, sem sombra; botão da capa: 56 px, canto 13, sombra colorida `--sombra-pri`, sobe 1 px com o mouse |

Imagens de hoje: `evidencias/tg-atual-1280-claro.jpg`, `tg-atual-1280-escuro.jpg`, `tg-atual-390-claro.jpg`, `tg-atual-foco-1280-claro.jpg`.

As três propostas usam só valores que já existem no sistema. Em todas: a borda do cartão passa a nascer de `--c` (que clareia no tema escuro) a 30 % — o valor que o `DESIGN.md` dá para "destaque da matéria" — e o foco continua 2 px na cor de texto da matéria, afastado 2 px.

| | **A — Folha do sistema** (recomendada) | **B — Anel** | **C — Pílula** |
|---|---|---|---|
| Cartão: canto | 18 px (igual) | 18 px (igual) | 18 px (igual) |
| Cartão: borda | 1 px, `--c` a 30 % | 1 px, `--c` a 30 % | 1 px, `--c` a 30 % |
| Cartão: sombra | `--sombra-folha` (igual ao vizinho "Meu progresso") | nenhuma (igual a hoje) | `--sombra-folha` |
| Cartão: mouse em cima | borda `--c` a 45 % e sobe 1 px | igual ao normal | igual ao normal |
| Botão: canto | 13 px (o do botão grande do sistema e do protótipo) | 16 px (igual a hoje) | 999 px (pílula) |
| Botão: contorno | nenhum | anel de 3 px em `--c` a 16 % (o mesmo da alternativa marcada) | nenhum |
| Botão: sombra | `0 1px 2px rgba(0,0,0,.08)` (a dos botões do sistema) | só o anel | `0 1px 2px rgba(0,0,0,.08)` |
| Botão: mouse em cima | brilho +5 % e sobe 1 px (como no protótipo) | anel a 22 % e brilho +5 % | brilho +5 % e sobe 1 px |
| Botão: apertado | desce 1 px (igual a hoje) | desce 1 px | desce 1 px |
| Desabilitado | opacidade 45 % (regra do sistema) | idem | idem |
| Imagens (antes: `tg-atual-…`) | `tg-proposta-A-1280-claro.jpg`, `-A-hover-1280-claro.jpg`, `-A-1280-escuro.jpg`, `-A-390-claro.jpg` | `tg-proposta-B-…` (mesmos quatro) | `tg-proposta-C-…` (mesmos quatro) |

- **A** é a mais coerente: o cartão passa a casar com o "Meu progresso" ao lado e a responder ao mouse, e o botão ganha o canto e a sombra dos outros botões grandes.
- **B** mantém a forma de hoje e só acrescenta o anel; muda menos.
- **C** é a mais diferente: seria o único botão em pílula do site (hoje a pílula só existe em chips e filtros).
- A sombra colorida do protótipo (`--sombra-pri`) não foi proposta porque o `DESIGN.md` proíbe sombra colorida; se o dono preferir o protótipo nesse ponto, ela entra em A no lugar da sombra neutra.
- O cartão "Treino geral" do Início (`.in-treino`: canto 18, borda 1 px #D3DFF7, sem sombra; botão 208 × 60, canto 10, sombra 1 px) não entra nestas propostas; ver Dúvidas, item 4. Imagens: `tg-inicio-atual-1280-claro.jpg`, `-escuro.jpg`, `tg-inicio-atual-390-claro.jpg`.
- **Risco:** baixo (uma peça, uma tela por matéria). **Categoria:** modernizar.

## Protegido, não será alterado

Identificado na revisão como decisão do dono; nenhuma proposta acima toca nisto.

- **Fontes do guia tipográfico (05/11):** Dancing Script no nome da matéria (42 px no celular, 54 px no computador, na cor da matéria), Familjen Grotesk na interface, Literata na explicação da correção e na teoria, Caveat só na conta e na fórmula do caderno, DM Sans só no login. Medido: nenhuma outra família aparece; Caveat só em `.ra-t`, `.ra-st`, `.fm-linha` e frações do caderno; Dancing Script só em `.tit-mat`.
- **Paleta das 9 matérias (05/11)** e o site inteiro assumindo a cor da matéria; azul "todas as matérias" do Início.
- **Ícones de tema** (`docs/icones/`), círculo claro, sem sombra, salto de 10 px com o mouse; **ícones das matérias e capas** (`docs/capas/`); **pontinho de 8 px** do subtema; ícones de traço do menu; onda verde e pontilhado do menu.
- **Arte do Treino geral** de cada matéria e do Início (arquivo, tamanho, enquadramento, posição).
- **Tela de login** (referência Aprendice_Login_Pacote): sempre clara, ilustração pintada, medidas próprias.
- **Tema claro como padrão** (medido: com o aparelho em modo escuro o site abre claro; o escuro é escolha do aluno em Dia/Noite ou em Configurações).
- **Aba Início** conforme as referências de 06/11: ordem das seções, títulos, "Vamos avançar nos estudos?", botões, setas de 46 px, tamanhos que crescem de 1440 a 1920 px.
- **Correção em 4 blocos**, na ordem; resolução animada só em Biologia, Química, Matemática e Física, em texto nas demais; fração empilhada; controles da animação.
- **Faixa de temas no topo da matéria**; capa da matéria; "Meu progresso"; folha das áreas.
- **Vocabulário:** Nível (básico, intermediário, avançado), Treine sua evolução, Treino geral, Simulado, Flashcard ("Curtiu este cartão? Sim/Não"), Questão Aprendice.
- **Filtro de região**, Hoje e Escudo TRI, Método Aprendice de Revisão (agenda, domínio, 5 tempos), revisão essencial e mapa mental, caixa "EM CONSTRUÇÃO... (o que será colocado: …)".
- **Menu lateral, trilho, topo e abas do celular** (posições, itens e ordem); o menu continua visível no estudo.
- Larguras de página e margens (1440 / 1680 / 1920 px), pedido de 06/11.

## Dúvidas para o dono

Só o que a medição não decide.

1. **Três ou cinco fontes?** O `CLAUDE.md` cita três (Dancing Script, Familjen Grotesk, Caveat). O guia tipográfico aprovado em 05/11 e o site usam cinco (mais Literata na explicação e DM Sans no login). Tratei as cinco como protegidas. Confirma? Se sim, vale ajustar a frase do `CLAUDE.md`.
2. **Cor da matéria em letra pequena (D05):** aceita trocar o fundo dessas etiquetas para branco, prefere manter como está, ou quer rever os tons de texto da paleta?
3. **Contadores com barra:** a lista do tema mostra "0/13" (feitas/total) e, no celular, o passo da animação mostra "5/5". Não são frações, mas usam a barra. Passam a "0 de 13" e "5 de 5", como no resto do site, ou ficam?
4. **Botões do Início:** os botões grandes do Início têm canto 10 px e 60 px de altura; o botão grande do sistema tem canto 13 px e 56 px. Isso veio das referências de 06/11? Se foi intencional, fica; se não, igualo ao sistema (e o botão "Começar treino" do Início acompanha a proposta escolhida em D08).
5. **Coluna da resolução a 1440 px:** com a questão em duas colunas (1,45 : 1), a explicação fica com 33 a 44 caracteres por linha, abaixo do confortável. Corrigir exige mudar a proporção das colunas, que é decisão de layout. Quer que eu proponha uma proporção nova?
6. **Login:** o rodapé "Versão de demonstração…" tem 10 px e contraste perto de 2,96:1, e três alvos de toque são menores que 44 px. A tela segue a referência do dono. Quer que eu proponha ajuste só nesses pontos?
7. **Arte do Treino geral no tema escuro:** na arte de Matemática, o globo e o quadrado tracejado quase somem sobre o fundo escuro (`evidencias/tg-atual-1280-escuro.jpg`). Não toquei na ilustração; só informo.
8. **Site publicado × ramo:** a auditoria mediu o código do ramo `app-prototipo-completo`. Há trabalho feito e ainda não publicado (Hoje, Domínio, filtro de região, Revisão geral). Se quiser, repito as medições direto no link público depois da próxima publicação.

## Revisão por agente separado

Em andamento: o relatório e as evidências foram entregues a um agente revisor separado, que não participou da auditoria. O resultado e as correções entram nesta seção.
