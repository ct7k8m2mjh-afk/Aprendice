# Auditoria dos pedidos do Vitor: APRENDICE (escadas / ATIVIDADES DIARIAS)

Data: 01/11/2026, cerca de 00:50 (horário de São Paulo). Auditoria só de leitura: nenhum arquivo do projeto foi alterado.

**O que foi conferido:** o build local servido em http://127.0.0.1:8765, com Playwright/Chromium a 1440×900 no tema claro, e o código em /home/claude/escadas-sc/design. Os prints estão em `/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/aud_pedidos/shots/`. Os scripts estão em `.../scratchpad/aud_pedidos/p1.js` a `p7.js`.

## De onde vieram os pedidos (e o que eu NÃO consegui ler)

1. **Chat do claude.ai "ESTUDOS MED" (1.128 turnos).** Os turnos foram lidos diretamente com read_conversation:
   - 400 (23/10 21:05);
   - 600 (27/10 18:09);
   - 855 (29/10 21:18);
   - 874 (22:18);
   - 911 (23:23);
   - 929 (23:45);
   - 945 e 947 (30/10 00:44);
   - 960 (01:04);
   - 1000 (04:11);
   - 1080 (19:34);
   - 1082 (19:37).

   Ler o chat inteiro não foi viável: cada página traz de 1 a 4 turnos, e muitos turnos têm mais de 20 mil caracteres. Por isso as outras mensagens vieram das fontes abaixo.
2. **`/home/claude/escadas-sc/AUDITORIA_PEDIDOS.md`** (auditoria de 30/10 00:10). Ela cobre os pedidos de 29/10 e anteriores, a partir do resumo da compactação e dos briefings dos subagentes.
3. **`scratchpad/auditoria/mensagens.md` e `RELATORIO.md`** (30/10 06:06). Trazem o texto literal das mensagens de 30/10 de 01:44 a 05:46.
4. **Resumo da compactação de 31/10 22:54**, na transcrição local. Ele lista as mensagens do fim de 30/10 até 31/10 19:43. Depois disso vêm, em texto literal, as mensagens de 31/10 19:52 e 01/11 00:24.
5. **Os 4 anexos .txt de 31/10:**
   - auditoria integral;
   - refinamento visual obrigatório;
   - pesquisa e experimentação;
   - direção de arte.
6. **Memória** (`areas/escadas-saocamilo.md`, `preferences.md`) e `PRODUCT.md`.

**Lacunas, ditas com franqueza:**
- **30/10, entre 05:46 e 19:34.** Pelos anexos de imagem com horário 18:02 e 19:02 e pela resposta do assistente no turno 1077 ("sombras… seguem as suas referências: luz de cima à esquerda"), houve pedido de sombras com imagens de referência. O texto literal não foi recuperado.
- **23/10 a 29/10 à tarde.** Só tenho o texto de segunda mão da auditoria de 30/10, mais os turnos 400 e 600.
- **Documentos do Projeto:** `claude/estado-escadas-*.md`, `auditoria-aprendice-31-10.md` e `escadas-ferramentas-retomada.md`. Este agente não tem a ferramenta Projects, então não os li.
- **conversation_search em outros chats:** nada encontrado sobre o app.

**Legenda de status:**
- **FEITO:** visto no app ou no código.
- **PARCIAL:** existe, mas incompleto.
- **NÃO FEITO.**
- **CONFLITA:** choca com outro pedido ou com uma regra.
- **NÃO VERIFICÁVEL.**

---

## A. O que falta (NÃO FEITO, PARCIAL e CONFLITA), por importância para ele

| # | Data (SP) | Pedido, nas palavras dele | Vezes | Status | Evidência |
|---|---|---|---|---|---|
| 1 | 27/10 18:09 (e memória) | "a São Camilo é a faculdade que eu estou me preparando… Como assim só 5, 2, 3 questões? É para ter 10 de cada aí, muito mais… Procura." | 2+ | **NÃO FEITO em Bio e Mat** / FEITO em Qui e Por | `dados_util`: São Camilo Bio **5** (todas de 2024), Mat **5** (2024), Qui 77, Por 45. Na tela, a home de Biologia mostra "Simulado São Camilo · 5 questões". |
| 2 | 23/10 21:05 (base do projeto) | cada conteúdo "dividida em 10 questões… mais simples, fácil, médio, difícil, nível vestibular… Isso para todos os temas" | 1 (é a premissa do app) | **PARCIAL** | Conteúdos com menos de 10 degraus: Bio 66 de 69, Mat 76 de 78, Por 44 de 50, Qui 32 de 57. Questões fora das escadas (degrau 0): Mat 213, Por 187, Qui 51, Bio 15. |
| 3 | 30/10 02:33 / 03:52 (memória: "visuais em praticamente toda questão") | "adicione isso em praticamente todas as questões que vão ser útil uma visualização"; "explicar em forma de desenho e animação o conteúdo" | 2 | **PARCIAL** | Questões com visual (ligações `VIS.liga` no build): Bio 368 de 498, Qui 214 de 569, **Mat 120 de 607, Por 20 de 535**. Visuais embutidos: 110, 35, 16 e 2. |
| 4 | regra fixa (preferências) + 29/10 | "Não aceita informação incorreta em material de estudo; quer a fonte e o método explicitados" | fixa | **NÃO FEITO nos flashcards** | Os 50 cartões de cada matéria têm `exemplo`, mas **nenhum tem `fonte`** (conferido com `dados_util`). O verso aberto no app (por-f003, print 11_flash_verso.png) mostra Resposta-modelo, Exemplo, Cuidado e Curtiu, sem fonte. A teoria não foi reverificada (a auditoria de 30/10 dizia que também não mostra). As resoluções têm a aba "Fonte" (FEITO). |
| 5 | 29/10 (resumo) e 29/10 23:23 | "Nos simulados, você não colocou as logos das bancas que eu te pedi" | 2 | **CONFLITA** (regra de marca registrada) | Print 31_por_sim.png: selos de texto pequenos ("São Camilo", "Fuvest", "Unesp") e a linha "Prova aplicada pela Vunesp". Não há logo oficial, por decisão do assistente (marca registrada). Ele reclamou duas vezes. Falta explicar isso a ele, ou fazer um selo mais forte. |
| 6 | 29/10 23:23 | "o −2P passa para a esquerda e vira +2P… em animação… Isso com todos" | 1 | **PARCIAL** | Existe o motor (`trocaLado`/`montaMov`, materia.js). Na questão testada (Mat P7a272fd), `.ad-mov` = 0: é proporção, sem transposição. A cobertura sobre as ~154 questões com passo de transposição **não foi medida**. Não há garantia de "com todos". |
| 7 | 29/10 23:23 | "siga de onde parou esta questão de química" (só na página principal) | 1 | **PARCIAL** | Teste p7.js: o botão Continuar abre a questão exata (S.ult = P9579aee, "Degrau 7 de 11"). Mas o cartão diz "0 de 11 degraus vencidos · próximo: **1º degrau**", que não é a questão aberta. Ao lado, aparecem "Treino geral de **Biologia**" e "Hoje · **Biologia**", embora o Continue seja de Química. |
| 8 | 31/10 (anexo "Refinamento", item 8) | "Corrija destaques excessivos que prejudiquem a leitura, incluindo marcações coloridas sobre textos" | 1 | **PARCIAL** | A Resposta ainda sai com o marca-texto amarelo sob a letra cursiva (materia.css:624-626; print 21_mat_res.png). O resto do painel foi enxugado. |
| 9 | 31/10 (anexo, item 5) × 30/10 05:45 | 30/10: "ícones bem grandes… cortados um pouco nas laterais, vindo para a tela" × 31/10: "a ilustração anatômica… recortes muito próximos dos limites… corrija cortes" | 2 | **CONFLITA** | Print 02_bio.png: o rosto anatômico e as hemácias cortados na borda direita do banner. Atende ao pedido de 30/10 e contraria o anexo de 31/10. |
| 10 | 30/10 05:45 | "quando eu sair no final, me avisa o tempo total" | 1 | FEITO no código, **não testado no app** | materia.js:2963 manda `postMessage({ad:'toast'…})` e shell.html:593 mostra o aviso. Às 06:06 de 30/10 o aviso não aparecia ao sair pela barra lateral; o código foi corrigido depois, mas não refiz o teste. |
| 11 | 29/10 23:45 / 21:18 | "tem que melhorar muito… fluidez… como alguém escrevendo num iPad"; "sem caneta, sem barra" | 2 | FEITO técnico; **qualidade: NÃO VERIFICÁVEL** | Durante o "Assistir resolução" em Mat: 0 elementos de caneta visíveis, barra Pausar/velocidade, e no fim "um quadro só" sem o botão de rever (p3.js). A fluidez "natural" é julgamento dele. Não gravei vídeo. |
| 12 | 31/10 19:52 + 31/10 (várias) | "SIGA EXATAMENTE ESTE MODELO DE SOMBREAMENTO E COPIE A REFERÊNCIA"; "porque você está entregando tudo tão rápido… as sombras" | 4+ (30/10 04:11, 05:35, 05:45, 19:34, 19:37; 31/10) | Aplicado; **fidelidade NÃO VERIFICADA** por mim | `foto3d/sombra3.py` (31/10 20:36) diz que os parâmetros foram ajustados por mínimos quadrados sobre a folha de referência de 31/10. Ícones de conteúdo regravados às 20:38, de módulo às 22:21 e `ilu_ref.json` às 22:23 (horário de SP). Não comparei lado a lado com a referência dd78f248. É o tema em que ele mais insistiu. |
| 13 | 31/10 (vídeo, 18:27) | "dá um delay e aparece o design anterior antes de aparecer o atual. Você precisa corrigir isso" | 1 | **PARCIAL / não conclusivo** | O código esconde o iframe até `{ad:'pronto'}`. Numa captura (p4.js), 3 s depois de trocar para Matemática, a área abaixo do carrossel estava **em branco**. Em outra (p5.js) estava completa. Não aparece o design antigo, mas há vazio intermitente. |
| 14 | 29/10 23:23 | "o título Leitura e compreensão podia ter um cinza bem fraco no fundo… tá tudo muito branco" | 1 | **NÃO REVERIFICADO** (PARCIAL em 30/10) | — |
| 15 | regras de trabalho, 30/10 19:34 e 01/11 00:24 | "SEPARAR NO TEXTO AS TAREFAS… ENUMERÁ-LAS… COLOCAR EM PRÁTICA"; "você está ignorando o que eu estou falando?" | 3+ | **NÃO VERIFICÁVEL** no código | É comportamento. A queixa de 01/11 mostra que ele continua percebendo pedidos ignorados. Exemplo: o voto no flashcard existia em 30/10 06:06 ("Gostei/Não gostei"), mas ele não o achou onde esperava, logo depois de revelar a resposta. |
| 16 | 31/10 (4 anexos) | auditoria integral + refinamento (ícones 3D, cartões da home, carrossel, banners, listas, questão, painel, tipografia) | 4 | **PARCIAL** (são pedidos amplos) | Visto: título só cursivo; carrossel com ~5,5 cartões, setas e fade na borda; listas por área com título; questão com TOTAL e QUESTÃO, A–E e "nº na prova"; sem bordas laterais coloridas (o grep `border-left:3px` não acha nada). Não fiz a revisão de design completa: julgar "excelência" está fora do que dá para verificar objetivamente. |

---

## B. O que está FEITO (com evidência)

| Data (SP) | Pedido, nas palavras dele | Evidência |
|---|---|---|
| memória | questão sempre como print, nunca redigitada | Prints 20_mat_q.png e 20_bio_q.png (print do caderno com marca d'água) |
| memória / 29/10 | flashcards tipo Anki, escrevo a resposta e a correção aceita outras palavras | Campo "Sua resposta, com as suas palavras", botão Corrigir e "Não sei: ver a resposta" (p2.js) |
| 29/10 21:18 | "Flashcard é 'qual a função disso?' e respondo com uma palavra" | por-f003: "Conclusão que o texto não diz, mas obriga o leitor a tirar?" → "Inferência" |
| 29/10 23:23 | "Informação explícita × inferência… Tem que ter exemplo" | Verso por-f003: "Exemplo: Ana entrou encharcada…". `exemplo` em 50 de 50 cartões nas 4 matérias |
| 30/10 05:45 e 01/11 00:24 | "curtiu esse cartão? Sim, não" na resolução, quando revela a resposta | p2.js: no verso, a ordem é Resposta-modelo → Exemplo → Cuidado → **"Curtiu este cartão? Sim / Não"** → "Como foi?". `Curtiu` está no índice 688 do texto e `Como foi` no 759. materia.js:1506-1528 (frases de completar também) |
| 29/10 (resumo) | "imagem do cérebro: qual é essa parte?" | Treino geral conta 65 flashcards em Bio, 62 em Qui e 58 em Mat (50 + cartões com imagem). Português: 50, sem imagem |
| 29/10 / memória | dicionário de passar o mouse (Kindle) | `D.dic` em cada matéria (aud. 30/10 R10). Não reabri |
| memória | modo dia/noite; tema claro | Seletor Dia/Noite no topo (01_home.png) |
| 29/10 23:23 | esconder a barra das atividades diárias, com botão para mostrar | `#b-lado-fecha` visível ("Esconder a barra lateral") e `#b-lado-abre` (p1.js) |
| 29/10 | tela cheia (uma vez só) | Só `#b-tela2` visível; `#b-tela` oculto (p1.js) |
| 29/10 (resumo) | tirar o símbolo ao lado do título da matéria | "Biologia" e "Química" só cursivos (prints) |
| 29/10 23:23 | ícones dos temas maiores, em retângulo claro | Ladrilhos de cerca de 194 px com ícone de 112 px (p1.js) |
| 29/10 23:45 | "não pedi fundo cinza nos ícones de biologia" (igual às outras) | As 4 matérias usam o mesmo ladrilho tingido na cor da matéria (sheet_paginas.png). Não há mais diferença só em Bio |
| 29/10 23:23 | Argumentação: dois balões SIM/NÃO | Ladrilho de Argumentação com balões SIM/NÃO (sheet_paginas.png) |
| 29/10 23:23 | trocar o "siga de onde parou" da matéria pelo Treino geral | Matéria sem Continue, com o cartão Treino geral (02_bio.png) |
| 29/10 23:02 | Treino geral misturando ABC, completar frase e flashcards, com progresso | "6 questões, 4 frases e 5 flashcards" e 3 contadores (02_bio.png). Rótulo "Treino geral · n de 15" (materia.js:2098). No máximo 2 cartões com imagem por rodada (montaMx, `nImg >= 2`) |
| 29/10 23:45 | "Assistir resolução" só em Mat e em Qui com equação; depois um quadro só, sem rever | materia.js:2633-2639 (`anima = HW && (mat ‖ qui com =)`). Bio: `.ad-fixo`, sem o botão. Mat: botão presente, que some após o quadro (p3.js) |
| 29/10 23:23 | escrita à mão, não digitada | Fonte de traço único `HW` só em mat e qui (gera_design.py:398-408). Sem caneta (p3.js) |
| 30/10 01:04 | "DÁ PARA ANIMAR QUANDO EU ABRIR O APP TAMBÉM" | `#abertura` presente aos 400 ms: o logo é escrito à mão e voa para a barra (00_abertura.png, shell.html) |
| 30/10 01:44 | áreas sem duplicados, "tudo em uma só" | Os dados ainda repetem módulos (Bio B08 e B12; Qui Q03, Q08, Q10 e Q12; Por P08 e P09), mas a tela filtra com `visto[m]` (materia.js:1117). Bio mostra 12 itens sem repetir |
| 30/10 01:50 | Revise por área em lista, com a área como título pequeno; cursiva só no título da matéria; fonte menos genérica | "CÉLULA E ENERGIA" como título da lista (02_bio.png); "Treino geral" em fonte sem serifa |
| 30/10 02:33 | tirar o "Treino de hoje" | Nenhum botão visível com "Treino de hoje" (p1.js) |
| 30/10 03:52 | quantas questões respondi hoje e ontem | Barra lateral: "hoje 1 · ontem 0" depois de responder (21_mat_res.png) |
| 30/10 03:52 | capa do Treino geral feita a partir das referências, sem animação | `capa-tg.webp` nas 4 matérias |
| 30/10 04:11 | tirar os botões embaixo da questão | `#ad-baixo` com display none (p3.js) |
| 30/10 04:11 | ícones de Citologia etc. sem opacidade | `.ad-tema` com opacity 1 (p1.js) |
| 30/10 04:11 | questão feita hoje não volta no mesmo dia | `feitaHoje()` filtra o treino, o Treino geral e as sessões (materia.js; teste t27 de 30/10). Simulados não filtram (ele não pediu) |
| 30/10 04:11 | sair do Treino geral e voltar exatamente no mesmo item | `MX.salva/guardada`, "Continuar treino geral · Você parou no item n de 15" (código; teste t26 de 30/10) |
| 30/10 04:11 / 05:45 | capa de Química (estava "muito feia" e "caricata") | Refeita com vidraria de vidro realista (sheet_paginas.png, 19:47 de 30/10) |
| 30/10 05:45 / 19:34 | Bio com o rosto de músculos e hemácias; "troque este rosto por esse" | O rosto da capa é o da referência 66789903 (rosto_cmp.png) |
| 30/10 05:45 | Português sem "livro com letras" | A capa agora é caderno, lápis e balão de aspas (sheet_paginas.png) |
| 30/10 05:30 | "não tem resolução nos simulados" | Resolução depois de cada resposta (aud. 06:06, S1). Simulados listados (31_por_sim.png) |
| 30/10 05:45 | relógio total ao lado do relógio da questão | "TOTAL 00:05 · QUESTÃO 00:02" (21_mat_res.png) |
| 29/10 (resumo) | alternativas lado a lado | A–E numa linha (21_mat_res.png) |
| PRODUCT | cronômetro com pausa | Botão de pausa ao lado dos relógios (21_mat_res.png) |
| 29/10 | número da questão sem conflito com o da prova | Cabeçalho "Fuvest 2019 · nº 14 na prova" e print "14" (21_mat_res.png) |
| memória | revisão espaçada | "Volta para a sua revisão amanhã" (21_mat_res.png) |
| 31/10 | ícones fracos (M10, P12.4, P02.2, M09.5, B10, P09.1) | Refeitos; M10 agora diz "sen θ" (icones_fracos.png). A qualidade fica para ele julgar |

---

## C. O que não consegui verificar

- O texto literal dos pedidos de 30/10 entre 05:46 e 19:34 (referências de sombra, ~18:02 e 19:02) e a maior parte de 23/10 a 29/10.
- Os documentos do Projeto (sem a ferramenta Projects).
- A fidelidade das sombras à referência de 31/10.
- A fluidez da escrita à mão (precisa de vídeo e do julgamento dele).
- A cobertura da animação de troca de lado.
- O aviso de tempo total ao sair pela barra lateral.
- O tema escuro e a tela de 390 px (não testados nesta rodada).
- Se o build local de 01/11 já está publicado na URL do artifact.
