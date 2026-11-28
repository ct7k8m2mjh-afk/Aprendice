# Revisão do site, 3ª rodada: parte "matérias" (21/11/2026)

Revisor independente: só aponta, não corrige nada. Build servido em http://localhost:4191, commit `82d57265`.
Login em modo demonstração (perfil e progresso de demonstração injetados no `localStorage`, `scripts/demo.cjs`).

O que foi revisto: página da matéria (capa, faixa de temas, Treino geral, Meu progresso, atalhos, folha das áreas),
tema (Conteúdos e Teoria em cartões), escada "Treine sua evolução", capa e rodada do Treino geral, flashcards (lista,
frente e verso), revisão essencial, revisão em slides (capa) e revisão espaçada (tela Revisão).

Cobertura:
- **A fundo** (390, 768, 1280 e 1440 px; claro e escuro; 11 telas cada = 264 medições): Biologia (matéria antiga),
  Física e História (só texto).
- **As outras 6** (Quí, Mat, Por, Geo, Ing, Filo/Soc): matéria e primeiro tema em 390 e 1280, claro e escuro.
- Teoria dos 4 temas que estavam sem cartões (H08, G13, G01, G02), figuras da teoria de Matemática (M01, M03, M06,
  M07, M13), escada B01.2 em 390/1280/1440, tema L01 de Filo/Soc, matéria em 1600 px.
- Rodada inteira do Treino geral (15 itens até "Treino concluído") em Física e História, 1280 escuro.
- Tela Revisão (revisão espaçada) em 390 e 1280, claro e escuro.

Método: Playwright/Chromium, deviceScaleFactor 1, espera de 3,3 s para a abertura animada terminar (antes disso o
logo cobre a tela). Medido por script em cada tela: rolagem lateral, elementos para fora da janela, texto cortado,
fundos #FFF/#000, emoji, sinais técnicos (`**`, `^(`, `undefined`, `NaN`), contraste de cada texto contra o fundo
real (camadas compostas), área clicável real em 390 (`elementFromPoint` a partir do centro), ordem do foco por
Tab, erros de console e de rede, números de questões na matéria e no tema. Prints em
`/tmp/claude-0/-home-user-Aprendice/5a7f51d5-ceb2-54ed-b9d9-892a96765791/scratchpad/r3-materias-*.png` (não
versionados); olhados um a um os das telas principais.

Classificação: **ERRO** · **DECISÃO DO DONO**.

## 1. Situação dos itens abertos das rodadas anteriores

| Item | O que era | Situação | O que se vê agora |
|---|---|---|---|
| 19/11 n.º 4 · 20/11 n.º 1 | Quantidade de questões na matéria e no tema | **resolvido** | Capa do Treino geral: "Questões de prova 3 feitas" (sem o total). Aviso de região do tema sem número ("Ver de outras regiões", `FiltroRegiao.tsx:110`, `semNumero`). Números "x de N" só na lista de conteúdos. |
| 19/11 n.º 5 · 20/11 n.º 2 | Flashcards com fonte de site didático/cursinho | **resolvido** | Nenhuma fonte de Toda Matéria, Estratégia, Descomplica, Sanar, Biologianet, Vestibulandoweb, Kenhub, Lecturio etc. nos 9 `materia.json`. Nas duas rodadas completas, todas as fontes eram OpenStax, NASA, universidades, CPDOC, Câmara. |
| 20/11 n.º 3 | Link da fonte quebrado com parênteses na URL | **resolvido** | `fimDoLink` aceita parênteses balanceados (`logica/fonteTexto.ts:15`), com teste dos cartões qui-d002 e fis-d007. |
| 20/11 n.º 4 | Fração em linha na legenda das figuras de Matemática | **parcial** | Legenda agora empilha ("Frações equivalentes", "q = ½", "P = ⅙" em fração de verdade; expoente sobrescrito em "1000·2^t/20"). Continua a fração em linha **dentro do desenho** das figuras: achado N1. |
| 20/11 n.º 5 | Temas sem teoria (H08, G13, G01, G02) | **resolvido** | Os 4 abrem "Teoria em cartões" (H08 com 8 cartões, caderno e "Cuidado"). |
| 20/11 n.º 6 | Barra "\|" no Resumo de Biologia | **resolvido** | `ResumoSubtema.tsx:19` divide em dois itens. Nenhuma "\|" visível em B01.2 (390, 1280, 1440). |
| 20/11 n.º 7 | "6 conteúdos" três vezes no tema | **resolvido** | Fica uma vez ("0% feito · 6 conteúdos"); a frase ao lado do Começar virou "Do mais fácil ao mais difícil". |
| 20/11 n.º 8 | "acerto —" em negrito | **resolvido** | O acerto só aparece depois da primeira resposta ("27% feito · acerto 71%"). |
| 20/11 n.º 9 | Contadores da capa acima de 1500 px | **não** | Em 1600 px os três `.tg-n` seguem com 122×118 px. Fora da matriz pedida; não entra como achado novo. |
| 20/11 n.º 10 | Migalha em 3 linhas em 390 | sem ação | Era só nota; continua igual. |
| 19/11 n.º 12 | Conteúdo sem questão some do tema | **resolvido** | `Tema.tsx:110`: conteúdos sem questão vão para o fim da lista. L01 mostra "Sofistas" (0 de 3). |
| 19/11 n.º 24 | "Meu progresso": letras dos dias e vão em 390 | **parcial** | Dias agora "dom seg ter qua qui sex sáb". Em 390 continua o espaço da altura do gráfico (64 px) quando ele está vazio. Era sugestão; não reaberto. |
| 19/11 n.º 27 | Treino geral sem capa própria | **resolvido** | `/m/<m>/treino` abre a capa (decisão do dono de 20/11). Ver N4 sobre a faixa. |
| 19/11 n.º 29 | Chips de região em 2 linhas na escada | **resolvido** | Uma linha só em 1280 e 1440 (9 chips). |
| 19/11 n.º 30 | Ícone de M16 parecido com M05 | com o dono | Não verificado de novo; é decisão do dono. |

## 2. Achados novos

**N1. Fração em linha e expoente "^" dentro das figuras da teoria.**
- Tela: `/m/<m>/tema/<T>?aba=teoria`, todas as larguras e temas (é o desenho, igual em todos).
- O que está errado: CLAUDE.md, "Fração sempre empilhada… nunca '3/5' ou '3 ÷ 5' na mesma linha, em textos, fórmulas e
  animações". A legenda já foi corrigida, mas o texto desenhado dentro do SVG ainda traz a fração na mesma linha.
  Contagem das figuras únicas cujo texto desenhado tem fração "a/b":
  - **Matemática: 40 de 157.** Exemplos: M06 "Exponenciais de bases 3, 2, ½ e ⅓" (legenda do gráfico: "y = (1/2)ˣ",
    "y = (1/3)ˣ"); "Função logarítmica decrescente" ("f(x) = log1/2 x", ponto "(1/2, 1)"); "Decaimento por meia-vida"
    ("m(t) = 100 · (1/2)t/6", com o expoente sem sobrescrito); "Área do triângulo" ("A = b·h/2 = 6·4/2 = 12");
    "Tabela de seno, cosseno e tangente" ("1/2", "√2/2", "√3/2"); "Regra de três" ("4/6 = 60/x"); "Dois dados"
    ("P = 6/36 = 1/6"); "Esfera" ("V = (4/3)·πr³"); "Média ponderada" ("49/6").
  - **Química: 2** ("Decaimento radioativo: m = m₀ · (1/2)ⁿ"; "Soro fisiológico": "9 / 58,44 = 0,154 mol/L").
  - **Biologia: 1** ("Hardy-Weinberg": "q² = 1/10.000").
  - "120/80 mmHg" (pressão) e as datas de Português ("1189/1198") não são fração e ficam fora.
- Onde: SVG embutido em `app/public/conteudo/<m>/figuras.json`, gerado a partir de `app-atual/<m>/img/<mod>.json`
  (ex.: `app-atual/mat/img/M06.json`), que não pode ser alterado (princípio 8).
- Como corrigir: redesenhar essas figuras numa fonte nova fora de `app-atual/` (ex.: `app/conteudo-fonte/figuras/`),
  com a fração empilhada (numerador, barra, denominador) e expoente sobrescrito, e fazer o `converte.py` usar a versão
  nova. Teste que falhe se houver `\d/\d` dentro de `<text>` das figuras de Mat/Quí/Bio/Fís.
- **ERRO.**

**N2. Cartões de nível "vazios" da escada com contraste abaixo de 4,5:1 e cara de desativado, mas com botão que funciona.**
- Tela: `/m/<m>/escada/<sub>`, bloco "Por nível", todas as larguras, claro e escuro.
- O que está errado: o cartão de um nível sem questão da região leva `opacity: .72`. O texto fica abaixo do mínimo:
  - His H01.1 claro: "Básico" 3,75:1; "11 questões de outras regiões" (13,5 px) 3,15:1. Escuro: "Básico" 3,07:1; frase 3,39:1.
  - Bio B01.1 claro: "Avançado" 3,04:1; "Ainda sem questões neste nível" 3,16:1.
  - Filo/Soc L01.1 claro: "Básico" 2,83:1; "9 questões de outras regiões" 3,17:1.
  - Sem a opacidade, os mesmos textos dão 4,55–9,40:1.
- Além disso, o cartão apagado tem o botão "Treinar básico" ativo e 11 questões para treinar (de outras regiões). Parece
  desativado sem estar.
- O medidor geral não pegou o caso porque o texto está dentro de um bloco semitransparente; a conta acima compõe o
  texto e o fundo do cartão sobre o fundo da página.
- Onde: `app/src/estilo/telas.css:563` (`.nivel-cartao.vazio { opacity: .72; }`); classe aplicada em
  `app/src/telas/Escada.tsx:118`.
- Como corrigir: tirar a opacidade. Para marcar o nível sem questão da região, usar outro sinal com contraste AA: fundo
  `folha2`, borda tracejada, ou o texto em `fraco` (≥4,7:1 pelo DESIGN.md). O apagado fica só para o nível que não tem
  questão nenhuma, sem botão.
- **ERRO** (contraste, acessibilidade).

**N3. Lista "Revisão essencial de <matéria>" fora do sistema das telas da matéria.**
- Tela: `/m/<m>/essencial` (atalho "Revisão essencial" na página da matéria, ex.: Química). Visto em 1280 claro (Quí e Bio).
- O que está errado:
  - Não tem o nome da matéria em Dancing Script nem a faixa de temas no topo (CLAUDE.md: "Faixa de temas sempre no topo
    da matéria"). Flashcards, tema, escada e revisão geral têm os dois.
  - A lista de temas fica solta sobre a folha quadriculada, sem a folha/cartão (`.tp-bloco`/`--folha`) que as outras
    listas da matéria usam (DESIGN.md: "Cartão sempre levemente tingido" e a grade é o fundo, os cartões por cima).
  - Em Biologia, que ainda não tem revisão essencial, o endereço mostra só "Em preparação". Não há link para ela na
    página da matéria, então o aluno não chega lá.
- Onde: `app/src/telas/RevisaoEssencial.tsx:245-257` (`EssencialMateria`, `titulo-pag` + `ul.tp-enc.es-lista`).
- Como corrigir: usar `CabMateria` + `FaixaTemas compacta` como em `Flashcards.tsx:93-95`, e pôr a lista dentro de uma
  folha `.tp-bloco` com o título "Revisão essencial" no tamanho `--fs-tela`.
- **ERRO** (diferença em relação ao sistema de design).

**N4. Capa do Treino geral sem a faixa de temas.**
- Tela: `/m/<m>/treino` (capa própria aprovada pelo dono em 20/11), todas as larguras e temas.
- O que acontece: tem o nome da matéria e "‹ Todos os temas", mas não tem a faixa de temas que as outras telas da matéria
  (flashcards, tema, escada) mostram no topo. Ex.: `r3-materias-bio-treinocapa-768-claro.png`.
- Onde: `app/src/telas/Treino.tsx:139-140` (há `CabMateria`, não há `FaixaTemas`).
- Como fica a decisão: a regra "Faixa de temas sempre no topo da matéria" sugere pôr a faixa compacta, como nos
  flashcards. Mas essa capa foi aprovada pelo dono assim, e o treino geral não é de um tema só. Por isso fica com ele.
- **DECISÃO DO DONO.**

## 3. O que foi conferido e passou

- **Rolagem lateral:** nenhuma nas 320 medições (264 a fundo + 56 das outras matérias), nem elemento para fora da janela.
- **Fundo e cartões:** nenhum fundo ou cartão #FFF/#000. Véu da matéria na casca (ex.: Quí `#FAE9F1`, Mat `#EBECF3`,
  Geo `#EAF0F0`, folha com `--p` 2,5%) e folha quadriculada com a margem rosa nas 9.
- **Título:** Dancing Script 700, 42 px em 390 e 54 px a partir de 768, na cor de texto da matéria nos dois temas (Bio
  `#127F04`/`#51A948`, Fís `#AD550D`/`#F27700`, His `#75451D`/`#BE885E`).
- **Faixa de temas** no topo da matéria, do tema, da escada e dos flashcards nas 9 matérias. Setas não cobrem os nomes.
- **Subtemas:** ponto na cor da matéria, sem ícone. Número de questões só nos conteúdos ("0 de 12"), na escada
  ("12 questões reais") e nos cartões de nível.
- **Contraste** (fora o N2): nenhum texto abaixo de 4,5:1 (3:1 para texto grande) nas 320 medições; o menor medido foi
  4,68:1. Medidor conferido em duas telas.
- **Alvo de toque em 390:** todos os botões, chips, setas, "Trocar", "Todos os temas", Dia/Noite e "Ver de outras regiões"
  com área clicável de pelo menos 44 px de altura (medida real pelo `elementFromPoint`). O único abaixo é o link
  "Pular para o conteúdo", que é invisível de propósito e aparece no foco.
- **Foco por teclado:** "Pular para o conteúdo" é o primeiro Tab. Todos os itens focados mostram anel. Na sessão de
  flashcards o foco vai para a resposta, depois Corrigir e "Não sei"; no verso, link da fonte, Sim/Não e Errei/Quase/Acertei.
- **Treino geral:** rodada inteira em Física e História (questão → flashcard → frase, 15 itens) até "Treino concluído"
  ("1 de 6 questões de prova · 0 de 5 flashcards · 0 de 4 frases"). Nenhum erro de console.
- **Flashcards:** verso com resposta-modelo, erro comum, fonte (título + domínio) e "Curtiu este cartão? Sim/Não" nas
  sessões e no treino.
- **Escada:** antes de responder, só "Prova ano · questão n"; o conceito aparece depois. Resumo com fórmula em Caveat
  e expoente sobrescrito (F01.1 "k = 10³; m = 10⁻³").
- **Emoji, `**`, `undefined`, `NaN`:** nenhum. **Console/rede:** nenhum erro (só os avisos de versão do React Router).

Total: 3 ERROS, 1 DECISÃO DO DONO
