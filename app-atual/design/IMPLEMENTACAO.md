# Implementação da crítica de design (29/10/2026)

Arquivos editados: `design/shell.html`, `design/materia.css` (reescrito do zero, sem as camadas de override acumuladas) e `design/materia.js`.
Cópia do que havia antes: `design/bak_impl_2910/`.
Prints finais: `design/depois/` (190 prints).

## Como foi conferido
- **Ambiente:** Playwright/Chromium em 6 configurações: 1366×800, 1920×1080 e 390×844 (toque), cada uma no tema claro e no escuro.
- **Roteiro de cada configuração:**
  - dashboard, inclusive a parte de baixo;
  - busca (Ctrl+K);
  - Biologia: início, Questões, escada, questão antes de responder, marcada com certeza "Chutei", erro confirmado pelo teclado (letra + Enter), resolução animada no meio, abas Teoria e Fonte, próxima questão com acerto, tela cheia e saída com Esc, Simulados, simulado rápido de 5 questões até o resultado, Desempenho e Revisão;
  - Química, Matemática e Português: início, treino, questão e erro respondido;
  - volta ao dashboard e recarga da página.
- **Resultado:**
  - 0 `pageerror` e 0 erro de console nas 6 configurações.
  - Responder grava em `localStorage` (`saocamilo.bio.v1`). Depois de recarregar: bio 7, qui 1, mat 1, por 1, e o dashboard mostra o progresso.
- **Teste isolado.** Em `/home/claude/esc_test`, as pastas `bio/qui/mat/por` eram links para as pastas reais dos apps. Rodar `gera_design.py` ali teria reescrito o `index.html` real que outros agentes estão editando. Troquei os links por cópias de `index.html`, `head.html`, `app.js` e `img/`. O `res/` continua como link, só para leitura. **Nada foi injetado nos apps reais.** Falta rodar o `gera_design.py` de produção quando for a hora.

## Pedidos do dono hoje
- **Muito azul, tudo de uma cor só.** A base continua cinza neutra. A cor de cada matéria passou a aparecer:
  - no botão principal, nos selecionados e nas barras;
  - na capa tingida e nos cartões de matéria tingidos;
  - na escada desenhada do dashboard;
  - no motivo do fundo.
  O roxo ficou só no logo de Início, na meta e no avatar.
- **Tudo dentro de quadrado.** Perderam o fundo e a borda:
  - listas (Hoje, Atividade, Reforço, temas, conteúdos, degraus, simulados, desempenho, revisão, atalhos sob a questão, relacionados);
  - filtros;
  - faixa de temas.
  Ficaram como cartão só a capa/hero, o cartão da questão, o painel da resolução, os cartões de matéria e o resultado.
- **Seletor Dia/Noite e fundos cinza:** mantidos.

## Pedidos do dono às 16:31
1. **Tema claro é o principal.** O padrão sem escolha salva agora é o claro (shell e matérias). O acabamento foi conferido primeiro no claro. O escuro foi conferido nos mesmos roteiros.
2. **Texto maior.**
   - A base da matéria foi de 15 para 17 px. O shell foi para 16 px.
   - Texto corrido tem 14 px ou mais em todo lugar. Só rótulos curtos e selos têm 13 px.
   - Títulos: matéria 32 px, saudação 34 px, hero 30 px, seções 19–22 px.
   - Alternativas: letra de 20 px em botões de 56 px de altura.
   - Resolução: corpo de 17 px com entrelinha 1,6.
3. **Tela cheia de volta e visível.**
   - Botão "Tela cheia" no topo do shell e na barra da questão.
   - Ele liga o modo foco: some o menu lateral, o topo e a barra do celular. Na matéria também somem a faixa de temas e os atalhos sob a questão. O print passa a ocupar ~65% da largura (até 1000 px).
   - Se o visualizador recusar a tela cheia do navegador, o modo foco funciona do mesmo jeito.
   - Para sair: Esc, "Sair da tela cheia" na barra, ou o botão flutuante fora da questão.
4. **Alternativas A–E numa linha só, só a letra:** feito (item 5 da crítica).
5. **Símbolo ao lado de "ATIVIDADES DIARIAS":** removido. Ficou só o nome.
6. **Nenhum emoji ou símbolo de teclado como ícone.** Todos viraram SVG Lucide (licença ISC, aviso no código):
   - na resolução animada: tocar, pausar, assistir de novo, passo anterior e próximo;
   - pausa do cronômetro;
   - ampliar e tabela periódica no rodapé do print;
   - lupa (−, +, fechar);
   - galeria (fechar, anterior, próxima);
   - chips de tipo de passo: localizar, eliminar, calcular, comparar, concluir. Ficam como máscara por `aria-label`, sem os glifos ◎⊘∑⇄✓;
   - "ler a questão em texto", que antes usava ＋/－;
   - quadradinhos do resultado (✓/✕);
   - dica de teclado da barra: ícone de teclado no lugar do "?";
   - setas da paleta;
   - tentativas na aba Fonte: escritas como "B (errou)".
   - Não mexi na estrutura de módulos/escadas nem na teoria, como pedido. Só no visual e nos rótulos.

## Cores (#15), contraste calculado (WCAG 2.2)
| Matéria | Escuro: cor (tinta #0C0D10) | Claro: cor do botão | Claro: texto na página |
|---|---|---|---|
| Biologia (verde, 127°/138°) | #56D364 (10,1:1) | #177E36 + branco 5,2:1 | #177E36 (4,7 sobre #F5F5F3) |
| Matemática (verde-água, 180°/186°) | #2CCFD0 (10,1:1) | #087884 + branco 5,2:1 | #087884 (4,8) |
| Química (rosa/magenta, 335°) | #F45D9C (6,4:1) | #C2185B + branco 5,9:1 | #C2185B (5,4) |
| Português (amarelo, 43°) | #F7C548 (12,1:1) | #F2C12E + tinta #17181C 10,5:1 | #8A6200 (5,0) |
- **Distância entre Bio e Mat:** cerca de 47° de matiz nos dois temas. Ao lado do verde, a Matemática lê como azul-esverdeado (conferido nos cartões do dashboard).
- **Tokens:**
  - shell: `--bio/--qui/--mat/--por` (preenchimento), `--*-t` (texto) e `--*-ink` (tinta sobre a cor);
  - materia.css: `--ad-c`, `--ad-t` e `--ad-ink`.
- **Erro** virou vermelho-coral (#FF7B6B / #C8372D) para não se confundir com o magenta da Química.
- **Ilustrações** (`gera_ilu*.py`): não mudei.

## Itens da crítica
1. **Modo foco na questão.**
   - `html[data-v]` diz qual tela está aberta (questao, simulado-q, resultado…). Nessas telas o cabeçalho, os filtros e a faixa somem.
   - A barra compacta de 52 px fica grudada no topo, com blur. Ela traz: Voltar, ícone, nome da matéria, "Questão i de n · Treino de hoje", fina barra de progresso, ícone de teclado (a dica vira tooltip), cronômetro, pausa e Tela cheia.
   - O print começa em y≈170 no PC e em y≈260 no celular, contra 560 e 740 antes.
2. **Um acento só.**
   - O primário usa a cor da matéria com a tinta dela.
   - O selecionado (filtro, tema, certeza, degrau atual) usa `--acento-sv` com anel interno.
   - O roxo saiu das matérias. No shell ficou só como casca.
3. **Motivo de fundo atrás do conteúdo.** `body{isolation:isolate}` e `::before{z-index:-1}`. Opacidade 0,06 no escuro e 0,05 no claro. Ocupa o terço direito (`min(720px,55vw)`). Os cartões ficaram opacos.
4. **Barra do celular.**
   - 5 destinos rotulados: Início, Matéria, Treino, Revisão e Mais.
   - Pílula de 56×32 atrás do ítem ativo e `safe-area`.
   - "Matéria" abre uma folha 2×2 nas cores do caderno. "Mais" abre Questões, Simulados, Desempenho e Configurações.
   - A animação de 300 ms (`cubic-bezier(.05,.7,.1,1)`) só roda com movimento permitido. Não transborda mais.
5. **Alternativas como gabarito.**
   - 5 botões só com a letra, alinhados à largura do print.
   - Tecla em `aria-keyshortcuts`.
   - Na linha de baixo: certeza (controle segmentado), Dica e Confirmar.
   - No celular, a linha de ação gruda no rodapé do cartão.
6. **Resolução com espaço.**
   - Antes de responder: `1.35fr / minmax(360px,1fr)`. Depois (`html.ad-resp`): `1fr / minmax(440px,1.25fr)`, com transição de 300 ms.
   - "Conteúdos relacionados" virou seção comum no fim do painel.
   - Corpo em 17 px com entrelinha 1,6.
   - O espaço vazio entre o cartão e os atalhos em 1920 foi corrigido com `grid-template-rows:auto 1fr`.
7. **Contraste.**
   - `--fraco`: #8C8F99 no escuro (5,1 sobre #1D1F24); #62656F no claro (≈5,0).
   - Nenhum texto corrido abaixo de 14 px.
8. **Duas vozes tipográficas.**
   - Inter em toda a interface.
   - Patrick Hand só no caderno.
   - Monoespaçada só na conta em bloco alinhada.
   - Glossário em Inter 600 na cor da matéria.
   - "Ampliar", "Você marcou esta", "Pede/Decide" e os chips de tipo saíram da caixa-alta.
9. **Caderno noturno.**
   - No escuro: folha #1C1B18, quadriculado #2E2C27, tinta #EFE8CF, marca-texto âmbar translúcido.
   - O print ganhou anel de 1 px, raio de 12 e `brightness(.94)` no escuro.
   - A galeria continua em papel claro, porque as imagens dependem do fundo claro.
10. **Veredito como evento.**
    - Certo: escala 1→1,04→1 em 240 ms, com o check traçado (`clip-path`).
    - Errado: tremida de ±3 px em 180 ms, sobre fundo suave.
    - Veredito: opacidade e 8 px de subida em 220 ms.
    - Tudo dentro de `prefers-reduced-motion: no-preference`.
11. **Faixa de temas.**
    - Peças de 120×120, ícone de 34 px dentro de um anel de progresso (`conic-gradient`, visível a partir de 1%).
    - Rótulo limitado a 2 linhas, com o nome completo no `title`.
    - Máscara nas bordas no lugar do recuo de 44 px.
    - Rolagem só horizontal (corrige o B5).
12. **Capa da matéria.**
    - Uma linha: "**0** de 500 respondidas · acerto **—**".
    - O botão diz "Treino de hoje" e a linha abaixo diz só a composição ("4 para rever · 8 novas").
    - O cabeçalho não repete o total.
    - Os quadros de números saíram.
13. **Simulados.**
    - Viraram `<button>` (teclado funciona), em grade `40px 1fr auto 20px`: ícone de banca ou de objetivo, título, meta "7 questões · ~14 min" e chevron.
    - Agrupados em "Por universidade" e "Por objetivo".
14. **Dashboard.**
    - O hero mostra o próximo passo com a escada desenhada: um degrau por questão, vencidos cheios, o próximo tracejado com um ponto e os demais tingidos.
    - O 3D dos cartões de matéria ficou (decisão do dono). Os cartões ganharam tinta da matéria, nome de 21 px e barra na cor.
    - "Atividade recente" vazia ocupa 96 px.
    - "Meu progresso" virou uma barra empilhada nas 4 cores, com legenda.
15. **Cores do caderno:** ver a tabela acima.
16. **Desempenho.**
    - Abaixo de 5 tentativas aparece "N respostas" em cinza e a barra fica tracejada.
    - A partir de 5 aparece o %. Abaixo de 50% vai em âmbar. Não há vermelho.
    - Em Padrões: "2 erros · último há 3 min", no lugar de "0%".
17. **Hover só com mouse** (`@media (hover:hover) and (pointer:fine)`, no shell e na matéria). O `:focus-visible` global é de 2 px na cor da matéria, com afastamento.
18. **Aba Fonte.**
    - Lista de propriedades: Banca, Ano, Nº, Tipo, Gabarito e Suas tentativas.
    - O gabarito só aparece depois de responder, para não entregar a resposta antes.
    - Botão "Abrir o caderno original" com ícone de link externo.
    - "Ler a questão em texto" virou botão.
    - Chevron SVG girando 90° nos `summary`.
19. **Resultado.**
    - Quadradinhos de 44 px com o número e o check ou o x desenhados. Entram em sequência (40 ms cada).
    - Legenda só se houver chute ou dica.
    - Dica de teclado e cronômetro escondidos.
    - Pausa escondida de verdade: o `[hidden]` perdia para o `display`.
20. **Escada.**
    - Título sem cartão (32 px).
    - Coluna de 760 px com conector vertical, verde quando o degrau foi vencido.
    - Rótulo = de onde veio ("Albert Einstein 2019 · q26"), com o estado embaixo.
    - "Ver a teoria que estas questões cobram" virou botão secundário.
    - "Todos os temas" com ícone.
21. **Nome:** mantido "ATIVIDADES DIARIAS" (decisão).
22. **Sidebar.**
    - Fundo um tom abaixo do conteúdo.
    - Inativos em `--sub`. Ativo com 7% de tinta, sem barra roxa.
    - Ícones de matéria em traço (SVG próprio do shell), com a cor da matéria.
23. **Números.** Classes `.num`/`tabular-nums` no cronômetro, nos placares e nas contagens. Inter com `cv11` e `ss03`.
24. **Busca como paleta.**
    - Diálogo centrado, largura `min(640px,92vw)`, a 12vh do topo, fundo escurecido e entrada em escala.
    - Grupos: Temas, Conteúdos, e Simulados e treinos.
    - Navegação por ↑↓, Enter e Esc. Rodapé com as teclas.
    - Vazia, mostra os atalhos da matéria atual.
    - Ctrl+K funciona também de dentro da matéria.
25. **Certeza.**
    - Nada vem pré-marcado. Clicar de novo desmarca.
    - Sem marcar, grava `conf:null`.
    - A mensagem só diz "com certeza" quando a pessoa marcou Certeza. Sem marcar: "Acertou: não entra na revisão". **Não** usei o texto da crítica ("volta em 7 dias"), porque pela regra da fila acerto sem chute ou dica não volta, e o texto seria falso.

## Bugs
- **B1:** item 3.
- **B2:** item 4.
- **B3, B5:** item 11.
- **B4:** item 19.
- **B6:** item 13.
- **B7:** item 17.
- **B8:** item 5.
- **B9:** no Início, os atalhos da barra lateral ("em Química") e o cartão "Hoje · Química" seguem a matéria de hoje. A saudação explica o motivo ("a que você menos praticou nos últimos 7 dias"). O hero continua dizendo "Continue de onde parou · Português", com o nome da matéria.
- **B10:** "1 de 7 degraus vencidos · próximo: 2º degrau", igual ao que o botão Continuar abre.
- **B11:** item 25.
- **B12:** itens 2 e 7.
- **B13:** item 1 (título numa linha, com reticências).
- **B14:** item 24.
- **B15:** item 20.

## Preservado
- Salvamento: ponte db e `saocamilo.<m>.v1`.
- Regras da revisão espaçada (1/3/7/16/35).
- Atalhos A–E, Enter, H e P, e Shift+letra para riscar.
- Resolução animada: na partida automática o painel não rola mais, e o veredito fica à vista.
- Letra manuscrita do caderno.
- Galerias.
- Treino intercalado.

## Para quem for continuar
- **`gera_design.py` duplica uma linha a cada execução.** A inserção do bloco LEG ("legado v20") procura um texto que o próprio script troca (`REF_V` → `REF_N`). Por isso o `app.js` ganha uma linha repetida a cada execução: já são ~7 em `bioescadas/app.js`, linhas 101–113. É inofensivo, mas acumula. Não corrigi porque o script está fora do meu escopo.
- **Reestruturação de módulos/teoria:** está com outro agente. As regras `.mod`, `.sub`, `#v-escada` e `details.teoria-cx` em `materia.css` são só visuais e podem ser trocadas.
