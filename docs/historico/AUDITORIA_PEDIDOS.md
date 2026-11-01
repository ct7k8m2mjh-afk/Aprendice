# Auditoria dos pedidos do Vitor: ATIVIDADES DIARIAS

Data: 30/10/2026, cerca de 00:10 (horário de São Paulo). Auditoria só de leitura: nenhum arquivo do app foi alterado.

**O que foi conferido:** o build atual, refeito pelo outro agente às 23:55 de 29/10, e o código em `design/`.

**Como:** Playwright em 1366×768, 1366×900 e 390×844, nos temas claro e escuro. Também li os dados com `dados_util`.

**Prints:** `/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/aud/`. Nas tabelas eles aparecem só pelo nome do arquivo.

## Fontes dos pedidos (e o limite delas)

1. **Transcrição desta sessão (`e5566652….jsonl`).** Ela só guarda o texto literal a partir da compactação de 29/10 às 23:03. Têm o texto completo as mensagens de 23:02, 23:23 (duas vezes, a 2ª com o pedido da escrita à mão) e 23:45. O que veio antes chegou só pelo resumo da compactação, que lista as mensagens "verbatim or close" do período de 29/10.
2. **Briefings dos 1.056 subagentes desta sessão (`subagents/*.jsonl`, 24/10 → 30/10).** Eles citam as palavras do dono. Usei principalmente os de 29/10 às 19:16, 20:01, 20:29, 21:30, 22:19 e 22:46, e os de 30/10 às 00:10, 01:19 e 02:26 (UTC).
3. **Memória do projeto:**
   - `areas/escadas-saocamilo.md`;
   - `preferences.md`;
   - `PRODUCT.md`;
   - `design/IMPLEMENTACAO*.md`;
   - `REVISAO_FINAL.md`;
   - `ICONES_3010.md`.
4. **Conversas antigas do claude.ai.** O `conversation_search` e o `recent_chats` não retornaram nada. As conversas anteriores a 24/10 só aparecem pelo PRODUCT.md e pela memória.

**Legenda de status:**
- **FEITO:** verificado no app.
- **PARCIAL:** existe, mas incompleto ou com defeito.
- **FALTANDO:** não existe.
- **EM ANDAMENTO:** outro agente está trabalhando nisso agora.

Os horários das tabelas estão no fuso de São Paulo. "29/10 (resumo)" quer dizer que o pedido veio do resumo da compactação, sem a hora exata.

---

## 1. Visual

| # | Quando | Palavras dele (resumo) | Status | Evidência | O que falta |
|---|---|---|---|---|---|
| V1 | memória | "clean, simples, bonito e moderno, um pouco de cor, motivos discretos da matéria no fundo" | FEITO | home_qui.png, home_bio.png (motivos apagados no canto direito) | — |
| V2 | 29/10 (resumo) | "não está tendo a parte de escolher modo noite ou dia" | FEITO | shell_home.png (seletor Dia/Noite no topo) | — |
| V3 | 29/10 16:16 | "tá tudo muito azul… tudo dentro de um quadrado" | FEITO | paleta neutra, cartões só no que importa | — |
| V4 | 29/10 19:46 | "Você leva tudo ao extremo… não divide nada… meio-termo" | FEITO | seções em cartões brancos com borda fina (IMPLEMENTACAO3) | — |
| V5 | 29/10 (resumo) | "a barra das atividades diárias ficou muito parecida" | FEITO | barra lateral branca com borda (shell_home.png) | — |
| V6 | 29/10 (resumo) | "textos muito pequenos" / "tudo grande e fácil de achar" | PARCIAL | por_tg1.png: print de Português legível a 1366. mat_q.png: print de lista de site pequeno. cel_q.png: a 390 px o enunciado fica com ~5 px, o P1-1 da REVISAO_FINAL ainda vale no celular | Dar zoom ou largura total ao print no celular. Nos prints de lista (Brasil Escola/Mundo Educação), aumentar a escala. |
| V7 | 29/10 (resumo) | "opção de abrir em tela cheia de novo… questão foco principal" | FEITO | botão Tela cheia no topo e no quadro | Ainda há 2 botões de tela cheia ao mesmo tempo (P3-12). Fora do shell aparece um botão branco vazio ao lado do contraste (pausa.png, cel_q.png). |
| V8 | 29/10 (resumo) | "alternativas uma do lado da outra" | FEITO | mat_q.png (A–E numa linha) | — |
| V9 | 29/10 (resumo) | "símbolo de atividades diárias… não tem nada a ver" (tirar) | FEITO | shell_home.png (título sem símbolo, sem acento, como ele quer) | — |
| V10 | 29/10 (resumo) | sombras: "a sombra não condiz… estudar antes de aplicar" | FEITO | ilustrações das matérias com projeção (shell_home.png). Miniaturas do shell já rasterizadas no Chromium (gera_design.py:56-80) | — |
| V11 | 29/10 (resumo) | livro de Português "torto" → "livro ficou perfeito" | FEITO | shell_home.png | — |
| V12 | 29/10 23:23 | ícones dos temas maiores; "em vez de círculo, retângulo com opacidade cinza bem baixa ou branco" | FEITO | home_qui.png (ladrilhos retangulares grandes) | — |
| V13 | 29/10 23:45 | "Eu não pedi para você colocar fundo cinza nos ícones principais de biologia" | EM ANDAMENTO | home_bio.png. No build atual o quadro cinza aparece atrás dos ícones nas **4** matérias, não só em Bio | Tirar o fundo cinza do ícone dentro do ladrilho branco, nas 4 matérias. |
| V14 | 29/10 23:23 | "o título Leitura e compreensão podia ter um cinza bem fraco no fundo… tá tudo muito branco" | PARCIAL | por_mod.png: o cabeçalho do tema tem fundo creme na cor da matéria, e o ícone fica num quadro branco | Confirmar com ele se o creme resolve. Na lista de conteúdos do tema, logo abaixo, os títulos continuam soltos no branco. |
| V15 | 29/10 23:23 | "barra das atividades diárias escondida no canto… botãozinho para desesconder, como no Chrome" | FEITO | lado_fechado.png (`#b-lado-fecha` / `#b-lado-abre` funcionam) | Conferir se o estado fica salvo ao recarregar (não testei). |
| V16 | 29/10 05:46 UTC | seguir os 2 mockups de referência "exatamente" | PARCIAL | layout de dashboard e de questão com painel segue a ideia dos mockups. Depois ele mesmo mudou o rumo (ícones realistas) | Nada objetivo pendente, mas os mockups não foram reabertos desde então. |
| V17 | 29/10 23:45 | Treino geral: "a colagem com as sombras ficou muito ruim… mais dinâmico, feito com carinho, animado em espiral" | EM ANDAMENTO | home_qui.png / home_bio.png: a colagem ainda é estática, com sombras de casco | Redesenho e animação de entrada em espiral. |

## 2. Ícones

| # | Quando | Palavras dele | Status | Evidência | O que falta |
|---|---|---|---|---|---|
| I1 | 29/10 (resumo) | "proibido usar qualquer tipo de emoji"; nada de símbolo de teclado como ícone | PARCIAL | Nada visível. Mas `∑ calcular` e `✓ concluir` continuam no DOM dos passos, ocultos (consulta DOM em a6.js) | Remover os glifos ∑ e ✓ dos chips de passo (vêm do app.js). Basta uma mudança de CSS para eles voltarem. |
| I2 | 29/10 (resumo) | ícones realistas dos módulos ("cérebro real", "a árvore para Ecologia"; "desenho plano de paint" recusado) | FEITO | home_bio.png, home_qui.png, mat_simulados.png | — |
| I3 | 29/10 (resumo) | "ícones todos iguais" em Conteúdos relacionados; ícones de conteúdo realistas | FEITO | mat_q.png, por_tg1.png (ícones distintos) | Em "Conteúdos relacionados" os ícones ficam pequenos (~28 px). Ele pediu desenhos maiores. |
| I4 | 29/10 23:23 | P02 Argumentação: martelo errado → "dois balões, SIM e NÃO, sobrepostos" | FEITO | por_mod.png (balões SIM/NÃO) | — |
| I5 | 29/10 23:23 | P01.2: "tira esse chapéu e óculos desenhado… chapéu real, óculos real, bigode"; "usar os mesmos exemplos da capa" | FEITO | ICONES_3010.md | Confirmar visualmente com ele na lista de conteúdos de Leitura. |
| I6 | 29/10 23:23 | Sistemas lineares: "sombra no desenho onde não fez nenhum sentido" | FEITO | ICONES_3010.md (M04.3 sem sombra) | — |
| I7 | 29/10 (resumo) | revisar cada imagem, "melhore 100%" | PARCIAL | ICONES_3010.md lista ícones ainda fracos, não corrigidos: P12.4 ovo, P02.2 óculos, M09.5, M10 círculo trigonométrico, B10 mosquito, P09.1 | Redesenhar esses 6. |
| I8 | 29/10 (resumo) | simulados: "coloque a logo/banca (Vunesp, Fuvest)"; e às 23:23: "Nos simulados, você não colocou as logos das bancas que eu te pedi" | PARCIAL | mat_simulados.png: selo/medalha desenhado com o texto VUNESP/FUVEST, sem logo oficial (regra de marca registrada) | Ele ainda reclama. Ou explicar a ele por que não usamos a logo oficial, ou deixar o selo mais forte (maior, nome da banca legível, cores próprias de cada banca). Decisão a levar para ele. |
| I9 | 29/10 (resumo) | tirar o livro ao lado do título da matéria | FEITO | home_por.png (só "Português") | — |
| I10 | 29/10 (resumo) | crédito discreto das ilustrações | FEITO | rodapé da faixa: "Ilustrações: Servier Medical Art, CC BY 3.0" | — |

## 3. Resoluções

| # | Quando | Palavras dele | Status | Evidência | O que falta |
|---|---|---|---|---|---|
| R1 | memória / 29/10 | resoluções animadas passo a passo, "animação mais fluida, não só mais rápida" | EM ANDAMENTO | mtx_sheet.png: a conta é desenhada traço a traço | Ele disse às 23:45: "muito ruim… natural, como alguém escrevendo num iPad". |
| R2 | 29/10 23:23 e 23:45 | "escritas à mão, não digitadas"; "sem caneta, sem barra; a letra desenhada, fluida, com voltas" | EM ANDAMENTO | build 23:55: `HW` (fonte de traço único), sem `.ad-caneta` durante a reprodução (a7.js: caneta=0) | Ele precisa aprovar a fluidez. Em Bio e Por não há escrita à mão (passos fixos). |
| R3 | 29/10 23:23 | "o −2P passa para a esquerda e vira +2P… em animação… Isso com todos" | PARCIAL | mtx_sheet.png: o termo "2x" viaja em vermelho e troca de sinal (W40a5453) | O detector só pega passos cujo texto fala em mover ("passa/isola/vira") e com igualdades encadeadas. Das 611 questões de Mat, ~154 têm passo com cara de transposição, e nem todas casam no `trocaLado()`. "Com todos" não está garantido: falta medir a cobertura e tratar os casos que não animam (substituição, distributiva). |
| R4 | 29/10 23:45 | replay só em Mat e em Qui com equação; "Assistir resolução → depois junta tudo num quadro só, sem assistir de novo" | EM ANDAMENTO | build 23:55: `preparaAnim` (só mat/qui com equação), `quadro()` remove o botão | O build 23:55 ainda tem "Assistir de novo" no HTML das 4 matérias (grep). Conferir no fim. |
| R5 | 29/10 (resumo) | resolução mais direta, revisar "as formas que são feitas as resoluções" | FEITO | IMPLEMENTACAO6 (enxuga): Resposta no topo, itens recolhidos. mat_res0.png | — |
| R6 | PRODUCT | explicar a alternativa que ele marcou | FEITO | mat_res0.png ("Por que a alternativa A não serve · Você marcou esta") | — |
| R7 | 29/10 (resumo) | "desenho da membrana na resolução" (figura do conteúdo) | FEITO | materia.js:1102 (só mostra figura que casa com a questão, P2-1 corrigido); :1108 (letra ≥ 12 px) | — |
| R8 | 29/10 (resumo) | "mitocôndrias: texto não dá para enxergar" | FEITO | figuras em papel branco nos dois temas (claro_svg.py) | Não reabri a figura da mitocôndria. |
| R9 | 29/10 (resumo) | "química gases confuso" → fórmulas em notação | FEITO | materia.js:2413 (subscrito automático, P2-6) | — |
| R10 | 29/10 (resumo) | dicionário Kindle (ANP, metonímia) em resoluções, revisões, teoria e flashcards | FEITO | mat_res0.png (sublinhado pontilhado em "parâmetro", "perpendiculares"); `D.dic` com 179–180 termos por matéria | — |
| R11 | REVISAO_FINAL P2-5 | pausar o passo a passo quebrava o estado | FEITO? | o fluxo novo (Pausar / Continuar / Pular para o quadro final) substituiu o antigo | Testar Pausar e Continuar no build final. |
| R12 | dados | sobra de resoluções | — | `mat/res`: 339 resoluções de questões que não estão mais no banco | Só peso morto no download. Dá para limpar. |

## 4. Flashcards

| # | Quando | Palavras dele | Status | Evidência | O que falta |
|---|---|---|---|---|---|
| F1 | 29/10 (resumo) | "flashcards tipo Anki… escreva a resposta… correção aceita outras palavras" | FEITO | tg_sheet.png (campo "Sua resposta, com as suas palavras"); correção por IA via `sample`, com alternativa manual | — |
| F2 | 29/10 (resumo) | "apenas 50 flash cards de cada matéria. OS MAIS IMPORTANTES" (analista) | FEITO | `D.flash` = 50 em cada matéria (ANALISE_FLASH50_*.md) | — |
| F3 | 29/10 (resumo) | "flashcard é 'qual a função disso?' e responde com uma palavra" | FEITO | por-f003: "Conclusão que o texto obriga a tirar…? → Inferência" | — |
| F4 | 29/10 (resumo) | "imagem do cérebro: qual é essa parte?" | FEITO | bio 15 (cérebro, coração, digestório, organelas), qui 12 (vidraria), mat 8 (sólidos); tg_sheet.png | Português não tem nenhum cartão com imagem (0). |
| F5 | 29/10 23:23 | "Informação explícita × inferência… não tem um exemplo… Tem que ter exemplo" | FEITO | `exemplo` em 50 de 50 cartões nas 4 matérias e 35 de 35 com imagem. por-f003: "Ana entrou encharcada…" | Conferir na tela que o exemplo aparece no verso (não abri o verso de por-f003 no app). |
| F6 | preferência fixa | fonte e método explicitados; não aceita informação errada | PARCIAL | conferência na web feita para bio e qui (brief de 00:24 UTC). Mas nenhum cartão tem campo `fonte` e o app não mostra a fonte | Gravar e mostrar a fonte (URL e obra) no verso. Conferir mat e por na web. |
| F7 | 29/10 23:02 | Treino geral inclui flashcards | PARCIAL | a9.js: numa rodada de Bio, os 5 flashcards foram **todos com imagem**, porque o peso +0,5 coloca os de imagem na frente | Equilibrar: no máximo 1 ou 2 com imagem por rodada. |

## 5. Questões e treino

| # | Quando | Palavras dele | Status | Evidência | O que falta |
|---|---|---|---|---|---|
| Q1 | regra fixa | questão só como print do original, nunca redigitada | PARCIAL | Bio, Qui e Por: print. Em Mat, `tipo` 'texto' = 303 e 'imagem' = 55: são questões da prova do Objetivo com enunciado transcrito | Verificar se essas 358 de Mat aparecem como print. A amostra W40a5453 era print. |
| Q2 | memória | "quer muito mais questões da São Camilo (havia só 7 por matéria)" | PARCIAL | Qui 79 e Por 51: FEITO. **Bio 7 e Mat 9: FALTANDO.** shell_home.png: "Simulado São Camilo · 7 questões" | FONTES_SAO_CAMILO.md aponta a Estratégia Vestibulares (páginas públicas por questão) como a única fonte aberta de Bio e Mat. Garimpar ali, respeitando os termos e o robots, com print e gabarito. |
| Q3 | 29/10 23:02 | botão principal na aba de cada matéria com "ABC, completar a frase, flashcards… tudo misturado", e o progresso de "quantas caiu, respondi, acertei" | FEITO | home_*.png (Treino geral com 3 contadores); a9.js: rodada de 15 itens intercalados até o resultado | O contador mostra "feitas de total" e acertos, mas não "quantas caíram" por rodada. A tela de resultado mostra isso. |
| Q4 | 29/10 23:23 | trocar o "Siga de onde parou" da matéria pelo Treino geral, com o mesmo design | FEITO | home_*.png (`b-continuar` oculto na matéria) | — |
| Q5 | 29/10 23:23 | "Continue de onde parou só na página principal… a última questão que fiz, ex.: química" | PARCIAL | shell_after.png: "Continue de onde parou · Química · Deslocamento de equilíbrio", com o botão Continuar | Ele pediu "esta questão". O cartão retoma a **escada** ("próximo: 1º degrau"), não a questão exata. O cartão do lado ainda diz "Hoje · Biologia" (matéria de hoje), o que confunde. |
| Q6 | 29/10 (resumo) | "não precisa escolher tema por tema"; Começar sortido; áreas de revisão ("Revise química orgânica") | FEITO | home_*.png ("Revise por área"); por_mod.png (Começar: 12 questões de 4 conteúdos) | — |
| Q7 | PRODUCT / memória | treino intercala lista e vestibular por nível; escada da mais fácil à mais difícil | FEITO | REVISAO_FINAL | Com o banco atual, muitas escadas ficaram curtas: "escada · 3 degraus", "Degrau 3 de 3". A promessa de 10 degraus por conteúdo não vale em vários conteúdos. Mat tem 213 questões e Por 188 com `degrau` = 0, fora das escadas. |
| Q8 | PRODUCT | cronômetro com pausa | FEITO | pausa.png (a pausa desfoca a questão; o P3-14 foi corrigido) | — |
| Q9 | REVISAO_FINAL | Treino geral: cabeçalho da questão | PARCIAL | por_tg1.png: no 1º item o cabeçalho mostrou "Questão 1 de 1" e não "Treino geral · 1 de 15". No a9.js apareceu certo, então depende do momento em que a capa é pintada | Forçar o rótulo depois do `abrirQuestao`. |
| Q10 | PRODUCT | até 500 por matéria | FEITO | Qui 571 e Por 541: passam de 500 só por causa das questões da São Camilo, que nunca se excluem. Bio 500, Mat 611 | — |

## 6. Simulados

| # | Quando | Pedido | Status | Evidência | O que falta |
|---|---|---|---|---|---|
| S1 | PRODUCT | por universidade e por matéria, até 30 questões | FEITO | mat_simulados.png | Os simulados São Camilo de Bio (7) e Mat (9) são curtos. Depende do Q2. |
| S2 | 29/10 | logos das bancas | PARCIAL | ver I8 | Decisão com ele. |
| S3 | REVISAO_FINAL P3-13 | simulado cronometrado mostra dica e resolução depois de cada questão | não verificado | — | Decidir: num simulado de prova, a correção deveria vir só no fim. |

## 7. Progresso

| # | Quando | Pedido | Status | Evidência | O que falta |
|---|---|---|---|---|---|
| P1 | memória | progresso nunca se perde ao republicar | FEITO | localStorage + ponte db (`prog_<m>`), Treino geral grava em S.q/S.flash; shell_after.png mostra o progresso entre telas | — |
| P2 | PRODUCT | exportar/importar .json | FEITO | `vai('dados')` → `b-export` | — |
| P3 | 29/10 | revisão espaçada (1/3/7/16/35 dias), revisão vencida no "Hoje" | FEITO | REVISAO_FINAL; mat_res0.png ("volta para a sua revisão amanhã") | — |
| P4 | 29/10 23:02 | progresso do Treino geral por tipo | FEITO | home_*.png | — |

## 8. Conteúdo

| # | Quando | Pedido | Status | Evidência | O que falta |
|---|---|---|---|---|---|
| C1 | memória | teoria com exemplo para cada conceito: o que é, como identificar, exemplo | FEITO | cartões: bio 121, qui 116, mat 102, por 177 | — |
| C2 | 29/10 (resumo) | Português: anáfora, catáfora e gêneros com exemplo; voz do autor | FEITO | REVISAO_FINAL item 8 | — |
| C3 | regra fixa | zero erro, fonte e método explicitados | PARCIAL | revisões em lentes (REV_*.md) | A fonte não aparece para o aluno nos cartões de teoria, nos flashcards nem no dicionário (o `dic` tem campo `fonte`; não conferi se aparece na caixinha). |
| C4 | dados | nomes de fonte | PARCIAL | Mat tem "Mundo Educacao" (6) e "Mundo Educação" (12) | Unificar a grafia. |

## 9. Navegação e entrega

| # | Quando | Pedido | Status | Evidência | O que falta |
|---|---|---|---|---|---|
| N1 | PRODUCT | app único com seletor de matéria | FEITO | shell | — |
| N2 | 29/10 | busca Ctrl+K | FEITO | REVISAO_FINAL | — |
| N3 | 29/10 23:45 | "revisão completa… chamar todas as skills… trazer ideias para o app" | EM ANDAMENTO | outro agente (revisão de design, UX e ciência da aprendizagem) | — |
| N4 | 29/10 19:18 | "termine tudo e me entregue o arquivo" | PARCIAL | v29 publicada. O build de 23:55 ainda não foi publicado | Publicar depois desta rodada (64 MB por lote). Atualizar `claude/estado-escadas-29-10.md`. |
| N5 | 29/10 (resumo) | celular não pode quebrar | PARCIAL | cel_q.png: sem rolagem lateral, mas o enunciado fica ilegível (V6) | ver V6 |

---

## O que falta fazer (por prioridade)

1. **Animação das resoluções (R1–R4), em andamento.** Antes de entregar, gravar um vídeo curto e olhar quadro a quadro:
   - letra com curvas, sem caneta;
   - termo trocando de lado com o sinal virando;
   - "Assistir resolução" só em Mat e em Qui com equação;
   - no fim, um quadro só, sem botão de rever.

   Depois, medir a cobertura da transposição: rodar `adTrocaLado` em todos os passos de Mat que têm "passa/isola/vira" e listar os que não animam. Os casos sem animação devem receber ao menos uma seta animada simples do termo.
2. **São Camilo em Biologia (7) e Matemática (9) (Q2).** É a prova prioritária dele.
   - Garimpar as páginas públicas da Estratégia por questão, citadas em FONTES_SAO_CAMILO.md, com print e gabarito.
   - Rodar as lentes de revisão.
   - Isso aumenta também o Simulado São Camilo dessas matérias.
3. **Logos das bancas (I8/S2).** Ele reclamou duas vezes. Levar a decisão a ele e explicar a regra de marca registrada, ou deixar o selo mais legível e próprio de cada banca: maior, com a cor da banca, e "VUNESP"/"FUVEST" bem visível.
4. **Fundo cinza atrás dos ícones dos temas (V13) e colagem do Treino geral (V17), em andamento.**
   - Nos ladrilhos, o ícone vai solto sobre o branco, nas 4 matérias.
   - A colagem deve entrar em espiral, sem sombras de casco.
5. **Continue de onde parou na página principal (Q5).** O botão deve abrir **a questão exata** (`S.ult` da última matéria usada), e não a escada.
   - Texto: "Continue: questão de Química · Deslocamento de equilíbrio".
   - O cartão "Hoje · Biologia" ao lado não deve contradizer a matéria do Continue.
6. **Fonte visível no material de estudo (F6/C3).** Ele exige fonte e método.
   - Adicionar `fonte` (URL ou obra) a cada flashcard e a cada cartão de teoria, e mostrar em letra pequena no verso ou no rodapé.
   - Conferir na web os flashcards de mat e por, que ainda não passaram por essa checagem.
7. **Legibilidade do enunciado (V6/N5).**
   - No celular, o print deve ocupar a largura toda, com zoom ao tocar.
   - No PC, aumentar os prints de lista, que são pequenos.
   - Em "Conteúdos relacionados", ícones maiores, de 44 a 56 px (I3).
8. **Treino geral (F7/Q9).**
   - Equilibrar flashcards com e sem imagem na rodada.
   - Garantir o rótulo "Treino geral · n de 15" no cabeçalho da questão.
9. **Ícones ainda fracos (I7).** P12.4, P02.2, M09.5, M10, B10 e P09.1, no estilo realista.
10. **Limpeza.**
    - Glifos ∑ e ✓ ocultos no DOM (I1).
    - Botão branco vazio no cabeçalho das páginas avulsas (V7).
    - "Mundo Educacao" sem acento (C4).
    - 339 resoluções órfãs em `mat/res` (R12).
    - Português sem flashcard com imagem (F4). Opcional: figuras de linguagem com imagem.
11. **Escadas curtas (Q7).** Muitos conteúdos ficaram com 3 degraus, e 401 questões estão com `degrau` = 0 (Mat 213, Por 188).
    - Decidir se essas questões entram nas escadas.
    - Ajustar o texto "escada de 10 degraus" à realidade de cada conteúdo.
12. **Entrega (N4).** Publicar o build final na URL HVJ1yigv94ay88Z9rrcCPX, em lotes de até 64 MB, sem mudar as capabilities. Atualizar o doc do projeto.
