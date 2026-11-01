# Crítica de design: ATIVIDADES DIARIAS (29/10/2026)

Revisão independente, feita no app rodando em `http://localhost:8765/index.html`, sem mudar código.

**Método**
- Playwright (Chromium) em 5 configurações: 1366×800 escuro (`d1366-*`), 1366×800 claro (`l1366-*`), 1920×1080 escuro (`d1920-*`), 390×844 escuro e claro com toque (`d390-*`, `l390-*`).
- Telas percorridas: dashboard, busca (Ctrl+K), as 4 matérias, Estudar, escada, questão antes e depois de responder (erro e acerto), abas Resolução, Teoria e Fonte, simulado rápido até o resultado, Desempenho e Revisão.
- Valores medidos no navegador com `getComputedStyle`. O contraste foi calculado pela fórmula WCAG 2.2.
- Os ~210 prints estão em `design/critica/`. Os nomes citados abaixo são relativos a essa pasta.

**Referências consultadas (2025–2026)**
- **Linear**, ["Behind the latest design refresh"](https://linear.app/now/behind-the-latest-design-refresh), mar/2026:
  - sidebar "a few notches dimmer" para o conteúdo mandar;
  - menos ícones, e menores;
  - fim do fundo colorido nos ícones;
  - divisórias mais suaves;
  - densidade mantida "without letting the interface feel overwhelming".
- **Duolingo**:
  - [refresh das abas](https://blog.duolingo.com/core-tabs-redesign): poucos estilos de texto, espaço em branco no lugar de caixas, arte decorativa de cabeçalho cortada "because it took up space without serving a purpose";
  - [análise do padrão de feedback](https://blakecrosley.com/guides/design/duolingo): faixa de resultado que sobe do rodapé em 200 ms ease-out, botão único "Continuar", vermelho "not scary".
- **Brilliant** ([showcase](https://screensdesign.com/showcase/brilliant-learn-by-doing)): explicação interativa depois do erro, caminho do curso visível, celebração curta no fim da sessão.
- **Apple HIG / Liquid Glass** (WWDC25, [resumo](https://www.createwithswift.com/liquid-glass-redefining-design-through-hierarchy-harmony-and-consistency/)): os controles ficam acima do conteúdo e o "elevam"; a interface pode "hide, or simplify its components based on user actions".
- **Material 3**:
  - a [barra de navegação](https://developer.android.google.cn/develop/ui/compose/components/navigation-bar?hl=ca) é para **3 a 5 destinos**;
  - tokens de movimento e curvas já estão em `base_kit/kit/referencias/movimento.md`.
- **Refactoring UI**: tirar ênfase reduzindo contraste, e não tamanho; um destaque por tela. A regra também está em `referencias/design-de-interface.md` §1.
- **Base interna**:
  - `referencias/design-de-interface.md`: grade de 8, contraste e estados;
  - `apps-de-estudo.md`: UWorld, AMBOSS e o modo Tutor contra o modo Prova;
  - `movimento.md`.

**Diagnóstico geral**

A base já é boa: tipografia Inter consistente, cartões limpos, ícones de tema bonitos, resolução muito rica e um tema claro digno.

O que segura o app de parecer "2026" são quatro coisas:
1. **Excesso de chrome acima da questão.** A questão começa em y≈560 no PC e em y≈740 no celular.
2. **Um roxo genérico disputando com a cor da matéria.** Há dois acentos em toda tela.
3. **Camadas de texto e fundo sem disciplina.** São quatro vozes tipográficas, o motivo do fundo é pintado *por cima* dos cartões e o papel creme fica claro demais no tema escuro.
4. **Navegação de celular quebrada.** São 11 ícones sem rótulo numa barra de 390 px.

---

## P1: maior impacto, fazer primeiro

### 1. Modo foco na questão: recolher cabeçalho, filtros e faixa de temas
- **Onde:** `#ad-cab`, `#ad-temas` e `.ad-filtros` quando `#v-questao` está visível (todas as matérias).
- **Problema:**
  - Em `d1366-bio-04-questao.png`, o cabeçalho (77 px), a faixa de temas (175 px) e a linha "voltar/teclado" consomem 380 px antes da questão. O print começa em y=560 e as alternativas só aparecem depois de rolar.
  - Em `d390-bio-04-questao.png`, o print aparece em y≈740 de 844, embaixo de 3 linhas de filtros e da faixa de temas.
  - Em `d1366-bio-16-sim-resultado.png`, a faixa aparece cortada no topo da tela de resultado.
- **Referência:** Apple HIG, controles que "hide, or simplify … based on user actions". O modo Prova do UWorld e do AMBOSS (`apps-de-estudo.md`) deixa só a barra da questão.
- **Mudança:**
  - Quando `body` tiver `data-v="questao"` ou `data-v="simulado-q"`:
    - `#ad-temas, .ad-filtros{display:none}`;
    - `#ad-cab` vira uma barra compacta: `height:48px; display:flex; align-items:center; gap:12px; padding:0 4px`, com ícone de 20 px, nome da matéria em `600 15px`, o título "Questão 3 de 12 · Treino de hoje" e o cronômetro, tudo na mesma linha;
    - essa barra fica `position:sticky; top:0; z-index:5; background:color-mix(in srgb,var(--papel) 88%,transparent); backdrop-filter:blur(12px)`.
  - A linha "teclado: A–E escolhe…" sai da tela e vira `title`/tooltip no botão `?` (24×24) ao lado do cronômetro.
  - Resultado esperado: o print começa em y≈130 no PC e em y≈110 no celular.

### 2. Um acento só: a cor da matéria assume o CTA, e o roxo vira cor da casca (dashboard)
- **Onde:** `.btn` primário, `#b-treino`, `#b-conf`, `#b-prox`, `.ad-filtros button[aria-pressed=true]`, `.ad-tema[aria-current]`, `.ad-abas button.on`, `.volta`.
- **Problema:**
  - Em `d1366-bio-03-inicio.png`, uma página verde (ícones, motivos, chips) tem o botão principal, o filtro "Todos", a aba ativa e o tema selecionado em roxo `#7B6CF6`.
  - Em `l390-bio-13-escada.png`, o tema selecionado está roxo e o tema sob o dedo está verde. São dois "destaques" diferentes na mesma faixa.
  - Branco sobre `#7B6CF6` dá **3,95:1**, abaixo de AA (4,5:1) para o texto de 15,5 px/600 do botão.
- **Referência:** Linear 2026 (remover cores concorrentes); `design-de-interface.md` §1 ("Cor de matéria = acento, em 1 ou 2 elementos por tela").
- **Mudança:**
  - Dentro das matérias, o primário passa a ser `background:var(--acento); color:var(--acento-ink)`. O token `--acento-ink:#0B0F1E` já existe no CSS e nunca é usado no botão.
  - Contraste de `#0B0F1E` sobre as cores do tema escuro: Bio 9,6, Quí 5,7, Mat 6,6, Port 10,7 (todos AA).
  - No tema claro, mantenha `--acento-ink:#fff` sobre Bio `#13874B` (4,6), Quí `#C8304B` (5,3), Mat `#4057E0` (5,7) e Port `#93620A` (5,3).
  - Selecionado (filtro, aba, tema) = `background:var(--acento-sv); color:var(--tinta); box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--acento) 55%,transparent)`.
  - O roxo fica só na casca (logo, Início, meta), escurecido para `#6656E6` no escuro (branco = 5,2:1).

### 3. O motivo de fundo é pintado por cima dos cartões
- **Onde:** `html.ad body::before` em `design/materia.css` (`position:fixed; z-index:0; opacity:.07`).
- **Problema:**
  - Um pseudo-elemento posicionado com `z-index:0` é pintado **depois** dos blocos não posicionados.
  - Por isso os desenhos aparecem *dentro* dos cartões:
    - o vírus atravessa o texto do passo 3 da resolução (`z-passo-6s.png`, x≈1150, y≈560);
    - o vírus fica sobre o hero (`d1366-bio-03-inicio.png`);
    - a célula fica sobre a faixa de temas (`d1366-bio-04-questao.png`);
    - as aspas de Português ficam sobre "Período composto" (`d1366-por-04-questao.png`).
  - O motivo deveria ser fundo, mas virou ruído sobre o texto.
- **Referência:** pedido do dono ("motivos discretos da matéria no fundo"); Material, onde a elevação é a superfície por cima.
- **Mudança:**
  - `html.ad body::before{z-index:-1}` e `html.ad body{isolation:isolate; background:var(--papel)}`. Alternativa: `main, #ad-cab, #ad-temas, section{position:relative; z-index:1}`.
  - Use `opacity:.06` no escuro e `.05` no claro, e restrinja ao terço direito: `background-size:min(720px,55vw) auto`.
  - Faça o mesmo no dashboard (item 14).

### 4. Barra inferior do celular: 11 ícones sem rótulo e transbordando
- **Onde:** `#menu` em ≤640 px (shell `index.html`).
- **Problema:**
  - Em `d390-01-dash.png` e `l390-bio-13-escada.png`, há 11 botões de 38–40 px sem texto.
  - O último aparece cortado: `#menu.scrollWidth` = 406 px > 390, e `b-cfg` fica em x=416, fora da tela.
  - Ícones como raio, check e prancheta não se explicam sozinhos.
- **Referência:** Material 3, barra de navegação com 3 a 5 destinos e rótulo; lei de Hick.
- **Mudança:**
  - A barra fica com 5 itens rotulados (`font:500 11px/1.2 var(--disp)`, ícone de 22 px, alvo de 64×56): **Início · Matéria · Treino · Revisão · Mais**.
  - "Matéria" abre uma folha (bottom sheet, 300 ms, `cubic-bezier(0.05,0.7,0.1,1)`) com as 4 matérias em grade 2×2, nas cores do caderno.
  - "Mais" contém Questões, Simulados, Desempenho e Configurações.
  - Item ativo: pílula de `56×32px; border-radius:16px; background:var(--acento-sv)` atrás do ícone.
  - Use `padding-bottom:env(safe-area-inset-bottom)`.

### 5. Alternativas: transformar 5 cartões de 58 px em uma linha de gabarito
- **Onde:** `.bolhas` e `.bolha` (questão, todas as matérias).
- **Problema:**
  - O print já traz o texto das alternativas. Os 5 cartões repetem "Alternativa A … E" (`d1366-bio-05-questao-bolhas.png`) e ocupam 322 px.
  - Cada cartão mostra a letra **duas vezes**: o círculo `.L` e o `kbd` à direita.
  - O botão Confirmar fica 400 px abaixo do print.
  - Em 1920 (`d1920-bio-04-questao.png`), as bolhas têm 1000 px de largura e o print 598 px: são larguras desalinhadas.
- **Referência:** folha de respostas de prova (padrão de vestibular); UWorld e AMBOSS (opções compactas); Fitts (alvo perto da ação).
- **Mudança:**
  - No PC (≥900 px): `.bolhas{flex-direction:row; gap:8px; max-width:var(--print-w)}` e `.bolha{flex:1; height:52px; justify-content:center; padding:0}`.
  - Mostre só a letra em `600 17px`. Remova `.t` e o `kbd`, e ponha a tecla no `aria-keyshortcuts="A"`.
  - Marcada: `background:var(--acento-sv); border-color:var(--acento)` com `transform:scale(.97)` por 100 ms ao clicar.
  - Logo abaixo, numa linha só: certeza (segmented control de 3, 32 px) à esquerda e "Confirmar" à direita.
  - No celular, mantenha as bolhas em linha (5×64 px cabem em 358 px) e prenda a linha de ação no rodapé: `position:sticky; bottom:calc(64px + env(safe-area-inset-bottom))`.
  - Ganho: cerca de 250 px de altura por questão.

### 6. Depois de responder, a resolução precisa de espaço: painel mais largo e "Conteúdos relacionados" fora dele
- **Onde:** `#ad-painel`, `.ad-rel` e a grade da `#v-questao`.
- **Problema:**
  - Em `d1366-bio-07-respondida.png` e `d1366-bio-10-resolucao-meio.png`, o painel tem 438 px e "Conteúdos relacionados" ocupa 140 px fixos no rodapé dele.
  - Sobram cerca de 250 px úteis para ler uma resolução de 2.400 px.
  - A questão já respondida continua com 580 px, ocupando a maior parte da tela.
- **Referência:** UWorld e AMBOSS no modo Tutor (a explicação domina depois da resposta); Duolingo ("Continuar" único).
- **Mudança:**
  - Antes de responder, use `grid-template-columns: minmax(0,1.35fr) minmax(360px,1fr)`.
  - Depois, use `body.respondida` com `grid-template-columns: minmax(0,1fr) minmax(440px,1.25fr)` e `transition: grid-template-columns 300ms cubic-bezier(0.2,0,0,1)`.
  - Mova `.ad-rel` para o fim da resolução, como uma seção comum, sem `position` fixa.
  - Corpo da resolução em `font-size:15.5px; line-height:1.6`.

### 7. Contraste: texto "fraco" reprova AA nos dois temas
- **Onde:** `--fraco` (dicas, contagens, `kbd`, "0 de 33 feitas", legendas).
- **Problema:**
  - `#6C7393` sobre `#131A33` dá **3,69:1** no escuro.
  - `#7B819C` sobre `#F6F7FC` dá **3,59:1**, e sobre branco dá 3,84:1, no claro.
  - Aparece em texto de 11–14 px. Exemplos: `kbd` das bolhas, contadores dos filtros (11,7 px) e "verde: acertou · vermelho…" em `d1366-bio-16-sim-resultado.png`.
- **Referência:** WCAG 2.2, 1.4.3 (4,5:1); `design-de-interface.md` §4.
- **Mudança:**
  - Escuro: `--fraco:#8A91B0` (≈5,3:1 sobre `#131A33`).
  - Claro: `--fraco:#626984` (≈5,4:1 sobre `#F6F7FC`).
  - Nenhum texto abaixo de 12 px: contadores dos filtros `12px`, `kbd` `12px`.

---

## P2: deixam o app claramente mais moderno

### 8. Duas vozes tipográficas, não quatro
- **Onde:** `.formula`/caderno (manuscrita), glossário `dl.simbolos dt`, "AMPLIAR", "BRASIL ESCOLA", "VOCÊ MARCOU ESTA", `.tipo` ("◎ LOCALIZAR").
- **Problema:** `d1366-bio-10-resolucao-meio.png` e `d1366-bio-07-respondida.png` misturam Inter, manuscrita, monoespaçada verde caixa-alta e monoespaçada cinza no mesmo painel. Fica parecendo colagem.
- **Referência:** Duolingo 2025 ("a minimal set of type styles"); Refactoring UI.
- **Mudança:**
  - Inter para tudo da interface.
  - A manuscrita fica **só** no cartão do caderno (é identidade).
  - Monoespaçada só em número tabular (cronômetro, `1 / 4`).
  - Glossário `dt`: `font:600 14px var(--disp); color:var(--acento)`.
  - Rótulos "AMPLIAR", "VOCÊ MARCOU ESTA" e ".tipo": `font:600 11.5px var(--disp); letter-spacing:.02em; text-transform:none`, escritos como "Você marcou esta" e "Localizar".

### 9. O papel creme no tema escuro ofusca
- **Onde:** `.formula` e o caderno (fundo `#FBF6E6`-ish quadriculado) e o rodapé do print `#q-print` no escuro.
- **Problema:** em `d1366-bio-08-teoria.png` e `d1366-bio-10-resolucao-meio.png`, um bloco de 200 px quase branco aparece no meio do painel escuro. É o ponto mais claro da tela e rouba o foco do texto da resolução.
- **Referência:** Material, modo escuro (evitar superfícies brilhantes grandes); `design-de-interface.md` §9.
- **Mudança:**
  - No `[data-theme=dark]`: `.formula{background:#1A2038; background-image:linear-gradient(#2A3152 1px,transparent 1px),linear-gradient(90deg,#2A3152 1px,transparent 1px); background-size:22px 22px; color:#E9E3C8}`. É um "caderno noturno", com a mesma manuscrita.
  - O print continua claro (a regra é não redigitar), mas ganha `border-radius:12px; box-shadow:0 0 0 1px var(--linha)` e `filter:brightness(.94)` só no escuro.

### 10. Veredito como evento: microinteração de acerto e erro
- **Onde:** `.veredito` e `.bolha.certo` / `.bolha.errado`.
- **Problema:** em `d1366-bio-07-respondida.png`, o resultado aparece pronto, sem transição. A alternativa errada tem o mesmo peso visual da certa.
- **Referência:** Duolingo (faixa sobe em 200 ms ease-out, "not scary red"); `movimento.md`.
- **Mudança:**
  - Alternativa certa: `@keyframes ok{0%{transform:scale(1)}40%{transform:scale(1.04)}100%{transform:scale(1)}}`, 240 ms `cubic-bezier(0.05,0.7,0.1,1)`, com o check desenhado (`stroke-dashoffset` de 24 a 0 em 200 ms).
  - Alternativa errada: `translateX` de -3/3/0 px em 180 ms. Sem vermelho cheio: `background:var(--errado-bg)`.
  - `.veredito`: entra com `opacity 0→1` e `translateY(8px→0)` em 220 ms.
  - Tudo dentro de `@media (prefers-reduced-motion:no-preference)`.

### 11. Faixa de temas: rótulo de 4 linhas e progresso invisível
- **Onde:** `#ad-temas .ad-tema` e `.ad-tema i` (barrinha de progresso).
- **Problema:**
  - "Neuro, hormônios, imune e reprodução" quebra em 4 linhas e invade a barra de progresso (`d1366-bio-03-inicio.png`, x≈1210, y≈275–330).
  - A primeira peça começa com 45 px de recuo e a seta esquerda some.
  - As barrinhas (3 px, cor `--linha`) são quase invisíveis, e 0% e 2% parecem iguais.
- **Referência:** Linear 2026 (menos ícones, menores, estrutura com menos ruído).
- **Mudança:**
  - `.ad-tema{width:112px; height:112px; padding:12px 8px}`, ícone de 36 px.
  - `span{-webkit-line-clamp:2; display:-webkit-box; -webkit-box-orient:vertical; overflow:hidden; font-size:12.5px}`, com o nome completo no `title`.
  - Progresso como anel de 2 px em volta do ícone (`conic-gradient(var(--acento) calc(var(--p)*1%), var(--linha) 0)`), visível a partir de 1%.
  - Máscara de borda em vez de recuo: `mask-image:linear-gradient(90deg,transparent,#000 24px,#000 calc(100% - 24px),transparent)`.

### 12. Painel "Hoje" e cabeçalho da matéria: tirar o que se repete
- **Onde:** `#v-inicio` (`#treino-dica`, `#k-q`/`#k-resp`/`#k-acerto`) e o hero do dashboard.
- **Problema:**
  - Em `d1366-bio-03-inicio.png`, "Treino de hoje · 12 questões" aparece no botão e logo abaixo de novo ("Treino de hoje: 12 questões novas.").
  - "500 questões" está no cabeçalho e no cartão.
  - Os três quadros de número (500 / 0 / —) ocupam 90 px para dizer quase nada.
- **Referência:** Duolingo (cortar o que "took up space without serving a purpose"); Refactoring UI ("labels are a last resort").
- **Mudança:**
  - `#treino-dica` mostra só a composição: "4 para rever · 8 novas", em `13px var(--lapis)`.
  - Troque os 3 quadros por uma linha: "**0** de 500 respondidas · acerto **—**" (`15px`, números `tabular-nums 600`).
  - Os 90 px economizados vão para "Onde você precisa reforçar".

### 13. Simulados: lista sem afordância nem teclado
- **Onde:** `#lista-sim .linha` (bio, qui, mat e por).
- **Problema:**
  - Em `d1366-bio-14-simulados.png`, as linhas são `div` com `cursor:pointer`, sem `tabindex` e sem `role` (medido: `tabIndex=-1`, `role=null`). Não dá para abrir pelo teclado.
  - Não há chevron nem ícone, e "7 q" é abreviação crua.
- **Referência:** WCAG 2.1.1 (teclado); padrão de lista do Linear e do Raycast (ícone + título + meta + chevron).
- **Mudança:**
  - Transformar em `<button class="linha">` (ou `role="button" tabindex="0"` com Enter/Espaço).
  - Grade `grid-template-columns:40px 1fr auto 20px`.
  - Ícone da banca 24 px em `--acento-sv` e meta "7 questões · ~14 min".
  - Chevron 16 px em `--fraco`.
  - Hover `background:var(--folha2)`.
  - Agrupe com subtítulos `600 12px` em caixa-alta suave: "Por universidade", "Por objetivo".

### 14. Dashboard sem identidade e com hero vazio
- **Onde:** shell `#painel`: "Comece por aqui", "Minhas matérias" e o fundo.
- **Problema:**
  - Em `d1366-01-dash.png` e `d1920-01-dash.png`, as matérias têm ilustração 3D com cores próprias:
    - o DNA é arco-íris na página da Biologia;
    - o gráfico da Matemática é roxo, mas a cor da Matemática no caderno é **verde-água**.
  - O hero repete o DNA do cartão logo abaixo.
  - O fundo do dashboard não tem nenhum motivo, ao contrário das matérias.
  - Em 1920 a coluna "Atividade recente" fica com 280 px vazios.
- **Referência:** Linear (remover fundos coloridos de ícone); `PRODUCT.md` (código de cores do caderno, obrigatório).
- **Mudança:**
  - No cartão de matéria, troque a ilustração 3D por um campo com motivo da matéria em traço (`ICO.tema` × 3, `opacity:.18`, cor da matéria) sobre `color-mix(in srgb,var(--c) 8%,var(--folha))`, com 120 px de altura.
  - Ponha o nome da matéria em `600 18px` e a barra de progresso de 6 px na cor da matéria.
  - O hero deixa de ter ilustração e passa a mostrar o próximo passo com a escada desenhada (7 degraus, preenchidos até o atual, na cor da matéria).
  - Num dashboard novo, "Atividade recente" vira estado vazio de 120 px, não 280.

### 15. A Matemática está na cor errada
- **Onde:** `html.ad.m-mat{--ad-c:#7B8FFF}` / claro `#4057E0`, o ícone π do menu e a ilustração.
- **Problema:** o `PRODUCT.md` diz "Matemática verde-água" (obrigatório). Hoje ela é índigo e fica parecida com o roxo da casca (`d1366-mat-04-questao.png`: π, abas e botões quase da mesma cor).
- **Referência:** `PRODUCT.md`, Brand Commitments.
- **Mudança:**
  - Escuro: `--ad-c:#2EC4B6` (tinta `#0B0F1E` = 8,8:1).
  - Claro: `--ad-c:#0F766E` (branco = 5,5:1).
  - Para distinguir da Biologia (`#34D17F`), use o motivo (π, eixos) e a matiz (174° contra 147°). Teste lado a lado no dashboard.
  - **Decisão do dono:** confirmar antes de trocar.

### 16. Desempenho: 0% vermelho gigante com uma questão
- **Onde:** `#desempenho .card` (número grande) e `#padroes`.
- **Problema:**
  - Em `d1366-bio-17-desempenho.png`, "Citologia 1 de 42 feitas" mostra **0%** em vermelho de 22 px. Uma amostra de 1 vira veredito.
  - Em `#padroes` (`d1366-bio-17b-desempenho-baixo.png`) aparece "0%" solto à direita, sem rótulo.
- **Referência:** `design-de-interface.md` §8 (número + rótulo + comparação); prática do UWorld (mostrar o n).
- **Mudança:**
  - Abaixo de 5 tentativas, mostre "1 resposta" em `--lapis` (sem %) e a barra tracejada.
  - A partir de 5, mostre % em `tinta`. A cor só aparece fora da meta: abaixo de 50% em `--aviso`; vermelho só para queda.
  - Em `#padroes`, troque "0%" por "1 erro · última há 2 min".

### 17. Estado preso em hover no toque e foco de teclado
- **Onde:** `.ad-tema:hover`, `.dis:hover`, `.linha:hover` e os anéis de foco.
- **Problema:**
  - Em `l390-bio-13-escada.png`, "Bioquímica celular" ficou verde depois do toque (hover preso).
  - O foco da `.bolha` existe (2 px na cor da matéria), mas não há `outline-offset` e ele se mistura à borda de 1,5 px (`z-foco-teclado.png`).
- **Referência:** WCAG 2.4.7 e 2.4.11; Material (estados).
- **Mudança:**
  - Envolva todo `:hover` em `@media (hover:hover) and (pointer:fine)`.
  - Regra global: `:focus-visible{outline:2px solid var(--acento); outline-offset:2px; border-radius:inherit}`.

### 18. Fonte: aba quase vazia e com controle cru
- **Onde:** aba "Fonte" do `#ad-painel`.
- **Problema:** em `d1366-bio-09-fonte.png`, há um "–" solto como controle de recolher, um link sublinhado verde e "+ ler a questão em texto" em 12 px. A aba ocupa 100 px num painel de 600.
- **Referência:** padrão de "Detalhes" do Notion e do Linear (lista de propriedades).
- **Mudança:**
  - Lista de propriedades em grade `120px 1fr`: Banca, Ano, Nº da questão, Tipo (prova/lista), Gabarito (com link), "Abrir original ↗" (botão secundário de 36 px).
  - Sem `details`. Chevron SVG no lugar de "+/–" em todos os `summary` do app (`summary::marker{content:""}`, ícone de 16 px girando 90° em 150 ms).

---

## P3: acabamento

### 19. Simulado: resultado no centro, com hierarquia
- **Onde:** `#v-simulado`, tela de resultado.
- **Problema:**
  - Em `d1366-bio-16-sim-resultado.png`, a linha "teclado: A–E…" continua visível e o cronômetro some, sobrando uma **pílula vazia** (x≈1320, y≈248).
  - A legenda das cores (11–12 px, 2 linhas) explica quadradinhos que poderiam ter a letra dentro.
- **Mudança:**
  - Esconda `.q-topo` no resultado.
  - Quadradinhos de `40×40px; border-radius:10px`, com o número da questão dentro (`600 13px`) e ✓/✕ de 12 px no canto. Isso elimina a legenda.
  - Animação dos quadradinhos entrando em sequência (`animation-delay: calc(var(--i)*40ms)`, 200 ms).

### 20. Escada: a lista é o herói, e o título não precisa de cartão
- **Onde:** `#v-escada` (`#e-tit`, `#e-teoria`, `#e-degraus`).
- **Problema:** em `d1366-bio-13-escada.png`, o cartão do título ocupa metade da largura com 120 px vazios. "+ a teoria que estas questões cobram" começa em minúscula. Os degraus se chamam "Degrau 2, Degrau 3", sem informação.
- **Referência:** Brilliant (caminho do curso como visual principal).
- **Mudança:**
  - O título vai para cima, sem cartão (`600 28px`, subtítulo `15px --lapis`).
  - Degraus em coluna única de 720 px com conector vertical de 2 px entre os números: `::before{left:27px; top:-12px; height:12px; background:var(--linha)}`, preenchido na cor da matéria quando vencido.
  - Rótulo do degrau = banca + ano ("Santa Casa 2018 · q52"), e não "Degrau 3".
  - "Ver a teoria que estas questões cobram" como botão secundário.

### 21. Título do app sem acento
- **Onde:** `.lgm` / `<title>`: "ATIVIDADES DIARIAS".
- **Problema:** é o único texto da interface sem acento. A varredura das 4 matérias não achou outro. Em caixa-alta de 13 px/700, o título também briga com o logo.
- **Mudança:**
  - Se o dono aceitar, "Atividades diárias" em `600 15px`, sem caixa-alta.
  - **Decisão do dono:** o nome foi escolhido por ele (`PRODUCT.md`).

### 22. Sidebar: "a few notches dimmer"
- **Onde:** shell `#menu .item` e `#meta-lado`.
- **Problema:** em `d1366-01-dash.png`, os itens inativos estão em `tinta` (`#E7E9F5`, 15 px/500), com o mesmo peso do conteúdo. O ícone π, a vidraria e a folha são coloridos e cheios ao lado de ícones de traço cinza, misturando dois estilos.
- **Referência:** Linear 2026 (sidebar mais apagada, ícones menores, "muted inactive text").
- **Mudança:**
  - Inativo `color:var(--lapis); font-weight:500; font-size:14px`.
  - Ativo `color:var(--tinta); background:color-mix(in srgb,var(--tinta) 6%,transparent)`, sem a barra roxa à esquerda.
  - Ícones de matéria em traço de 18 px com só o traço na cor da matéria.
  - Sidebar `background:color-mix(in srgb,var(--papel) 92%,#000)`.

### 23. Números e ritmo: grade de 8 e tabular
- **Onde:** global.
- **Problema:**
  - Os tamanhos medidos (13,5 / 14,5 / 15,5 / 11,67 px) fogem de uma escala.
  - Padding de `.bolha` `9px 14px 9px 10px`.
  - O cronômetro "00:03" e as % não usam `tabular-nums` em todo lugar.
- **Mudança:**
  - Escala `12 · 13 · 14 · 16 · 20 · 28 · 36` e espaçamento `4 · 8 · 12 · 16 · 24 · 32 · 48`.
  - `html.ad{font-feature-settings:"tnum" 0,"cv11" 1}` e `.num,.cronometro,[data-num]{font-variant-numeric:tabular-nums}`.
  - Inter `"ss03"` deixa o "a" mais legível em 14 px.

### 24. Busca (Ctrl+K) como paleta de comando
- **Onde:** `#q-busca` e `#res-busca`.
- **Problema:** em `d1366-02-busca.png`, o resultado cai como dropdown sobre a saudação ("Boa tarde, Vitor!" aparece cortado por trás). Não há agrupamento nem dica de teclado.
- **Referência:** Raycast e Linear (paleta centrada, grupos, ↑↓ Enter).
- **Mudança:**
  - Ctrl+K abre um diálogo centrado (`width:min(640px,92vw); top:12vh`) com `backdrop: color-mix(in srgb,#000 40%,transparent)` e entrada de 200 ms `scale(.98→1)`.
  - Resultados agrupados ("Conteúdos", "Simulados", "Questões"), item ativo com `--acento-sv` e rodapé com "↑↓ navegar · Enter abrir · Esc fechar" em `12px --fraco`.

### 25. Certeza e mensagem de "segurança" coerentes
- **Onde:** `#ad-conf` (padrão "Acho que sim") e `#ad-volta` ("Acertou com segurança: não entra na revisão").
- **Problema:** em `d1366-bio-05-questao-bolhas.png`, a certeza vem pré-marcada em "Acho que sim". Mesmo assim, o acerto diz "com segurança" (primeira passada). A pessoa não escolheu, e o texto afirma algo que ela não disse.
- **Mudança:**
  - Nenhuma opção pré-marcada (`aria-pressed=false` nas três). Se ficar vazia, registre `conf:null` e escreva "Acertou: volta em 7 dias".
  - Visual do controle segmentado: `height:32px; border-radius:8px; background:var(--folha2)`, item ativo `background:var(--folha); box-shadow:0 1px 2px rgba(0,0,0,.2)`.

---

## Bugs visuais encontrados

| # | Onde | O que acontece | Print |
|---|---|---|---|
| B1 | `body::before` (motivo) | Pintado por cima dos cartões e do texto (`z-index:0` posicionado) | `z-passo-6s.png`, `d1366-bio-03-inicio.png`, `d1366-por-04-questao.png` |
| B2 | `#menu` ≤640 px | 11 itens; `scrollWidth` 406 > 390; Configurações fora da tela; sem rótulos | `d390-01-dash.png` |
| B3 | `.ad-tema` "Neuro, hormônios, imune e reprodução" | Rótulo em 4 linhas invade a barra de progresso | `d1366-bio-03-inicio.png` |
| B4 | Resultado do simulado | Dica de teclado ainda visível; pílula do cronômetro vazia | `d1366-bio-16-sim-resultado.png` |
| B5 | Faixa de temas no resultado e na Revisão | Faixa cortada no topo e primeira peça cortada ("ncer", "itologia") com a seta esquerda sobre o texto | `d1366-bio-16-sim-resultado.png`, `d1366-bio-18-revisao.png`, `d1366-bio-12-estudar.png` |
| B6 | `#lista-sim .linha` | `div` clicável sem `tabindex`/`role`: inacessível por teclado | `d1366-bio-14-simulados.png` |
| B7 | Hover em tela de toque | Estado `:hover` fica preso depois do toque (tema verde no claro) | `l390-bio-13-escada.png` |
| B8 | `.bolha` | Letra repetida (`.L` + `kbd`) e texto "Alternativa A" sem informação | `d1366-bio-05-questao-bolhas.png` |
| B9 | Dashboard | "Matéria de hoje: Química", mas o menu diz "EM BIOLOGIA" e o cartão continua Biologia | `d1366-19-dash-depois.png` |
| B10 | "Continue de onde parou" | "Degrau 6 de 7" ao lado de "14% da escada": parece contradição (14% = 1 de 7 vencidos) | `d1366-19-dash-depois.png` → trocar por "1 de 7 vencidos · você está no 6º" |
| B11 | `#ad-conf` + `#ad-volta` | Padrão "Acho que sim" pré-marcado, mas a mensagem fala "com segurança" | `d1366-bio-05-questao-bolhas.png`, primeiro acerto no tour |
| B12 | Contraste | Branco sobre `#7B6CF6` = 3,95:1; `--fraco` = 3,6–3,8:1 nos dois temas | todos |
| B13 | Título "Questão 1 de 12 · Treino de hoje" | Quebra em 2 linhas em 1366 (bio), empurrando chips | `d1366-bio-04-questao.png` |
| B14 | Busca | O dropdown cobre a saudação, que aparece cortada atrás | `d1366-02-busca.png` |
| B15 | Escada no celular | O cartão do título ocupa a tela inteira antes do 1º degrau | `l390-bio-13-escada.png` |

**Texto sem acento:**
- A varredura do texto renderizado (shell + 4 matérias: início, Questões, Simulados, Desempenho, Revisão e 4 resoluções cada) só encontrou **"ATIVIDADES DIARIAS"**.
- "SO" em Química é fórmula (SO₂), não erro.

**Não verificado:**
- teclado completo no simulado (só o foco da bolha);
- leitor de tela;
- `prefers-reduced-motion` em cada animação (existem 4 regras em `materia.css` e 7 em `bio/index.html`).
