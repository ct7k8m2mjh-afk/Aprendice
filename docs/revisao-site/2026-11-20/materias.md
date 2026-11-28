# Revisão do site, 2ª rodada: parte "matérias" (20/11/2026)

Revisor independente: só aponta, não corrige nada. Build servido em http://localhost:4190, commit `b20901f9a` do ramo `app-prototipo-completo`. O HEAD `4fbccc060` só muda um documento da coordenação.
O que foi revisto: página da matéria, faixa de temas, cada tema com seus conteúdos, escada "Treine sua evolução", teoria em cartões, flashcards e treino geral das 9 matérias.
Cobertura:
- Biologia, Matemática e Português: as quatro larguras (390, 768, 1280 e 1440), nos temas claro e escuro.
- As outras 6 matérias: 390 claro e 1280 escuro.
- Os 106 temas abertos em 1280 claro, na aba Conteúdos e na aba Teoria.
- Flashcards (página, frente e verso) e uma rodada inteira do treino geral nas 9 matérias.
Prints: `qa2-mat-*.png` no scratchpad da sessão (não versionados). Na metade do trabalho o contêiner reiniciou; os prints e medições que valem são os refeitos depois.

Gravidades: **erro** · **diferença do sistema** · **sugestão (dono)** = só o dono decide.

## 1. Situação dos 30 itens da 1ª rodada (`docs/revisao-site/2026-11-19/materias.md`)

Os itens 10, 11, 22 e 26 estão marcados no PLANO como "para o dono decidir depois". Por isso não entram como problema.

| # | Item | Situação | O que se vê agora |
|---|---|---|---|
| 1 | A escada entrega a resposta | **resolvido** | `textoDegrau` (`logica/escada.ts:14`): antes de responder, o degrau mostra só "Prova ano · questão n". O conceito só aparece depois. Nos dados sobra um conceito com a letra, `ing P468ae35d` ("…: B, por eliminação"), mas ele só aparece depois de responder. |
| 2 | `**` literal na teoria de Português | **resolvido** | Negrito renderizado nos 12 temas de Português (P10: 123 trechos em negrito). Nenhum `**` visível nos 106 temas. |
| 3 | Contagens que se contradizem | **resolvido** | Critério único (`filtraTema`). Cada conteúdo que usa questões de outras regiões ganha a linha "De outras regiões: nenhuma questão do ENEM neste conteúdo" (ex.: B01 "Transporte ativo… 0/8"). |
| 4 | Quantidade de questões na matéria e no tema | **parcial** | Saíram "de 2.907 questões", "0 de 152 feitas", "0 de 60 respondidas", "0 de 25" e "60 questões de 6 conteúdos". Continuam três contagens, descritas no problema 1 da seção 2. |
| 5 | Flashcards citam sites didáticos | **parcial** | Brasil Escola, Mundo Educação, InfoEscola e Prepara Enem sumiram dos flashcards e frases. Restam 23 cartões com fonte de site didático ou de cursinho, inclusive um de Toda Matéria (problema 2 da seção 2). |
| 6 | Fís, His, Geo, Ing e Filo/Soc sem flashcard nem frase | **resolvido** | 60 flashcards e 40 frases em cada uma. O treino geral das 9 mistura questão, flashcard e frase e termina em "Treino concluído". |
| 7 | Glifo "✗" no caderno de P10 | **resolvido** | Nenhum ✗, ✓ ou ★ nos 106 temas. O "×" que aparece é o sinal de cruzamento ou de comparação, dentro do texto. |
| 8 | "Imagem em preparação" no Resumo da escada | **resolvido** | Não aparece em nenhuma das escadas abertas (B01.2, M05.2, P10.1, Q01.1, F01.1, H01.1, G01.1, I01.1, L01.1, M08.6, M11.6). |
| 9 | Figuras da teoria ilegíveis, repetidas, com legenda técnica | **resolvido** | Figuras com 387–409px de largura. Cada figura aparece uma vez por tema. Legenda "Desenho do Aprendice" em 14px. Problema novo nas legendas: problema 4 da seção 2. |
| 12 | Subtemas sem questão somem da lista do tema sem aviso | **não** | Continuam fora, sem aviso: fs L01.5 sofistas, L08.4 Camus e o absurdo, S06.3 movimentos do campo (`Tema.tsx`, `subs = mod.subs.filter(...)`). Não estava em nenhum pacote do PLANO. **Sugestão.** |
| 13 | Migalha termina em "Conteúdo" | **resolvido** | "Biologia › Citologia › Transporte ativo e vesicular". |
| 14 | Flashcards sem a faixa de temas | **resolvido** | `/m/<m>/flashcards` com a faixa no topo, nas 9 matérias. |
| 15 | Chip 15px/600 | **resolvido** | `.chip` 14,5px, peso 500, entrelinha 17,4px, padding 7/14. Nos treinos, 14px (compacto, como prevê o DESIGN.md "Filtro de região"). |
| 16 | Lista por área apertada em 1280 | **resolvido** | 2 colunas de 445px em 1280; 3 de 342px em 1440 (mínimo 340). |
| 17 | Capa do Treino geral (1280 e 1440) | **resolvido** | Arte some em 1280 e 1440. `.btn-capa` com 380px; `.tg-n` com 170×100; rótulo 14px. Acima de 1500px: problema 9 da seção 2. |
| 18 | Etiquetas com canto 999px | **resolvido** | `.etq` e `.nivel-etq` com canto 8px (escada, flashcard, treino). |
| 19 | Contraste < 4,5 | **resolvido** | Medido: "Trocar" Bio 4,62, Fís 4,59, Quí 4,57, Filo/Soc 4,75. `.nivel-etq` Bio 4,74, Quí 4,77, Fís 4,63, Filo/Soc 4,68. Escuro ≥ 4,52. |
| 20 | Alvos de toque < 44px em 390 | **resolvido** | O desenho continua menor, mas chip, "Trocar", "Ver de outras regiões", migalha, `.btn.peq`, `.sanfona`, Dia/Noite, setas da faixa, Voltar/Tela cheia da sessão e "Curtiu? Sim/Não" ganharam `::before` de 44px. Conferido com `elementFromPoint`: altura clicável de 44px (DESIGN.md "Alvo de toque"). |
| 21 | Setas da faixa cobrem o nome do tema | **resolvido** | Nenhuma sobreposição seta × `.ft-nome` nas telas medidas (tema e escada; 390, 768, 1280 e 1440; claro e escuro). |
| 23 | Dois estilos de caixa de aviso na teoria | **resolvido** | "Erro que mais derruba" e "Cuidado" iguais: Familjen Grotesk 16px, peso 400. |
| 24 | "Meu progresso" e capa desequilibrados | **parcial** | Em 1280 e 1440, capa e "Meu progresso" com a mesma altura (375px), sem vazio. Continuam as letras ambíguas dos dias ("S D S T Q Q S S D S T Q Q S"). Em 390 sobra um vão de cerca de 60px entre os números (0%, 0 min, 0) e o gráfico. **Sugestão.** |
| 25 | "Tema todos" em minúscula | **resolvido** | O filtro mostra "Todos os temas". |
| 27 | Treino geral sem capa própria | **não** | `/m/<m>/treino` abre direto na questão 1. Não estava em nenhum pacote. **Sugestão.** |
| 28 | Rótulo cortado na barra do treino | **resolvido** | "Treino geral · 1 de 15" inteiro em Filo/Soc 1280 escuro e nas outras 8. |
| 29 | Chips de região em 2 linhas | **não** | Escada (`.pag-estreita`, caixa de 880px) em 1280 e 1440: 2 linhas, com "Centro-Oeste" sozinho. No tema (972px) cabem numa linha. **Sugestão.** |
| 30 | Ícone de M16 parecido com o de M05 | **não** | Igual à 1ª rodada. Não estava em nenhum pacote. **Sugestão (dono).** |

Resumo: 20 resolvidos, 3 parciais (4, 5 e 24), 4 não resolvidos (12, 27, 29 e 30) e 4 com o dono (10, 11, 22 e 26).

## 2. Problemas novos ou que continuam

1. **Quantidade de questões ainda na matéria e no tema** (continuação do item 4). CLAUDE.md, Vocabulário: "Quantidade de questões aparece só nos conteúdos (subtemas), não na matéria nem no tema".
   - **Matéria** `/m/<m>`, todas as larguras e temas: no contador da capa do Treino geral, `.tg-n` "Questões de prova", aparece "0 de 40" (Fís "0 de 37", His "0 de 35", Ing "0 de 28"). O contador conta as questões do treino.
   - **Tema** `/m/<m>/tema/<T>`, todas as larguras e temas: no aviso de região, `.tp-regiao`, aparecem "Só 4 questões do ENEM neste tema" e o link "Ver de outras regiões (176)". Exemplos: B01, fs L01 ("Só 3… (51)").
   - Deveria: sem número de questões nesses dois lugares. Ex.: "Poucas questões do ENEM neste tema" e "Ver de outras regiões".
   - **Erro.**

2. **Flashcards e frases ainda com fonte de site didático ou de cursinho** (continuação do item 5). Decisão do dono de 19/11 no PLANO: trocar por prova oficial, livro/edição ou site institucional. Aparece no verso, `.fc-fonte`:
   - **Bio:** bio-d019 e bio-d050 (biologianet.com); bio-d047 e bio-k006 (vestibulandoweb.com.br); bio-d036 (sanarmed.com); bio-d038 (med.estrategia.com); bio-d010 (lecturio.com); bio-k027 (kenhub.com).
   - **Quí:** qui-d042 (simplestudy.com); qui-d049 (blogdovestibular.com).
   - **Mat:** mat-d022 (todamateria.com.br); mat-d012 e mat-d014 (somatematica.com.br); mat-d015 (sanarmed.com); mat-d005, mat-k006, mat-k039, mat-d060 e mat-k040 (Estratégia).
   - **Por:** por-d059 e por-k014 (descomplica.com.br); por-d009 (vestibulares.estrategia.com); por-k032 (vestibulandoweb.com.br).
   - Se o dono considera cursinho fonte aceitável, só a Toda Matéria (mat-d022) contradiz o que já foi feito.
   - **Erro** (pela decisão do dono) / **sugestão (dono)** quanto aos cursinhos.

3. **Fonte do flashcard aparece quebrada quando a URL tem parênteses.**
   - Onde: verso do flashcard e da frase, `.fc-fonte`.
   - Exemplo: `/m/fis/treino` (2º item), 1280 escuro, cartão fis-d007. Aparece "Fonte: Mechanics Map (Moore et al., York College of Pennsylvania), 11.2 Belt- and Gear-Driven Systems — )/11:_Rigid_Body_Kinematics/11.2:_Belt-_and_Gear-Driven_Systems · eng.libretexts.org". O link reconhece a URL só até o "(" e o resto vira texto.
   - Cartões afetados: qui-d002, qui-d055, qui-k008, qui-k029 (chem.libretexts.org…`_(Inorganic_Chemistry)`…), mat-d035 (`…_(OpenStax)/…`) e fis-d007.
   - Deveria: o link reconhece a URL inteira, ou a fonte mostra só o título e o domínio.
   - **Erro.**

4. **Legenda de figura da teoria com fração na mesma linha.**
   - Onde: `/m/mat/tema/<T>?aba=teoria`, todas as larguras, legenda (`figcaption`) das figuras.
   - Casos:
     - M01 e M03: "Frações equivalentes: 1/2 = 2/4 = 4/8 = 8/16".
     - M03: "m(t) = 100·(1/2)^(t/6)".
     - M06: "N(t) = 1000·2^(t/20)" e "bases 3, 2, 1/2 e 1/3".
     - M07: "(q = 1/2)".
     - M13: "(P = 1/6)".
   - Além da barra, o expoente aparece como "^(…)", e não sobrescrito.
   - Deveria: CLAUDE.md, "Fração sempre empilhada… nunca '3/5'… em textos, fórmulas e animações"; o expoente sobrescrito.
   - **Erro.**

5. **Quatro temas sem teoria em cartões.**
   - Temas: His H08 Guerra Fria (8 conteúdos); Geo G13 Pensamento geográfico (2), G01 Cartografia (7) e G02 Relevo e estrutura da Terra (6).
   - O que acontece: em `/m/<m>/tema/<T>` não aparece o botão "Teoria em cartões" nem "Revisão" (`?aba=teoria` volta para Conteúdos). Na escada dessas matérias não há "Teoria antes de começar" (ex.: G01.1). Na questão, a aba de teoria mostra "A teoria deste conteúdo está em preparação." (`Questao.tsx:227` e `:298`).
   - Todos os outros 102 temas têm cartões.
   - Deveria: cartões de teoria como nos outros temas (princípio 3: material incompleto não vai ao ar visível ao aluno).
   - **Erro** (conteúdo faltando).

6. **Barra vertical "|" no lugar de separador no Resumo da escada de Biologia.**
   - Onde: `/m/bio/escada/B01.2`, todas as larguras, `.rs-secao li`.
   - Exemplos: "fagocitose: pseudópodes | pinocitose: invaginação"; "hemácia: hipotônico, hemólise | hipertônico, crenação".
   - Tamanho: 26 linhas em `bio/revisao/resumos.json`. Nenhuma outra matéria tem.
   - Deveria: dois itens separados, ou ";".
   - **Erro** (sinal técnico visível ao aluno).

7. **"6 conteúdos" repetido três vezes no tema.**
   - Onde: `/m/bio/tema/B01` (e todos os temas), todas as larguras.
   - Aparece em `.tp-stat` ("0% feito · acerto — · 6 conteúdos"), em `.tp-comp` ("6 conteúdos · do mais fácil ao mais difícil") e em `.tp-h` ("O que você vai encontrar 6 conteúdos"), a cerca de 120px uma da outra.
   - **Sugestão.**

8. **"acerto —" com travessão em negrito.**
   - Onde: `.tp-stat b`, tema sem respostas, em todos os temas.
   - O traço longo em negrito (17px, cor da matéria) parece um risco solto, e não "sem dado".
   - Sugestão: "acerto: ainda sem respostas", ou omitir o acerto até a primeira resposta.
   - **Sugestão.**

9. **Capa do Treino geral acima de 1500px** (fora da matriz pedida; medido em 1600px).
   - A arte volta e os três contadores `.tg-n` encolhem para 122×118px.
   - Padrão: "até 170px (~170×102)" (DESIGN.md "Matéria", Treino geral (capa)).
   - O DESIGN.md não diz o que acontece aos contadores quando a arte volta.
   - **Diferença do sistema (menor).**

10. **Migalha da escada com links de 32px de altura desenhada em 390** (`.migalhas a`, 54×32). Tem o `::before` de 44px, então o toque está certo. Fica só a nota de que, em 390, a migalha ocupa 3 linhas quando o conteúdo tem nome longo: "Inglês › Leitura e interpretação de textos › Tema e ideia principal". **Sugestão** (sem ação obrigatória).

## 3. O que foi conferido e passou

- **Rolagem lateral:** nenhuma em nenhuma tela, largura ou tema (`scrollWidth` = largura da janela nas 36 páginas de matéria, nos 278 registros de tema, nas 30 escadas e nas telas de flashcard e treino).
- **Fundo no tom da matéria** (DESIGN.md "Superfícies"):
  - `.casca` com Bio #EEF4EA / #0F1A12, Mat #EBECF3 / #0C101D, Por #F4ECF7 / #171022, Quí #FAE9F1 / #1E0C1B, Fís #FCF0E6 / #21160D, His #F2ECE8 / #151110, Geo #EAF0F0 / #0A1519, Ing #F7E7E9 / #1A0A11, Filo/Soc #FBF5E8 / #201C0F.
  - Nenhum fundo ou cartão branco ou preto, fora o papel do print da prova (`.q-print-img`, exceção prevista).
- **Título e faixa:**
  - Título da matéria em Dancing Script 700: 42px em 390, 54px a partir de 768, na `--t` da matéria nos dois temas.
  - Faixa de temas logo depois da capa nas 9 matérias. Os ícones `ic/<id>.webp` dos 106 temas carregam na faixa e no cabeçalho do tema (100px no computador, 74px no celular, decisão pendente com o dono).
- **Tema:** h1 em Familjen 32px/700 (25px em 390). Começar com 60px e canto 14. "Todos os temas" e tema anterior e próximo. Pontinho do subtema sem ícone.
- **Escada:**
  - Migalha completa; níveis com etiquetas de canto 8; "Treinar <nível>".
  - "Teoria antes de começar" abre os cartões.
  - Resumo com fórmulas em Caveat e fração empilhada (M05.2: x<sub>V</sub> com −b sobre 2a).
  - Antes de responder, o degrau mostra só a fonte.
- **Flashcards:**
  - Página com faixa, filtros por área e tema e "Todos os temas".
  - Sessão com frente, "Corrigir" de 52px, "Não sei: ver a resposta", resposta-modelo, erro comum, fonte e "Curtiu este cartão? Sim/Não", nas 9 matérias.
  - Fonte agora de livro ou site institucional na maioria (OpenStax, Stanford Encyclopedia, Cambridge Dictionary, planalto.gov.br etc.).
- **Treino geral:** nas 9 matérias, a rodada mistura questão real, flashcard e frase e termina em "Treino concluído". Rótulo da barra inteiro.
- **Erros da página:** nenhum erro de console, requisição com falha, imagem quebrada, emoji ou palavra de interface em inglês.
- **Contraste medido:** todos ≥ 4,5:1 (valores na tabela, item 19).
