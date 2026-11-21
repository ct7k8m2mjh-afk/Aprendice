# Auditoria — Revisão em slides, rodada 1 (06/11/2026)

Auditor separado (não fez o trabalho). Escopo: comandos 24 (fase 1) e 26–31 — botão "Revisão em slides" na tela do tema, rota `#/m/<matéria>/revisao/<conteúdo>` (ciclo de 5 tempos), aba "Conteúdos" na tela Revisão. Código: `app/src/telas/RevisaoSlides.tsx`, `app/src/ui/revisao/`, `app/src/estilo/revisao.css`, `app/scripts/revisao.py`, `app/src/logica/cicloRevisao.ts`, `app/src/dados/revisao.ts`. Nada foi corrigido.

## Como foi conferido
- `python3 scripts/converte.py` (ok, sem mudar arquivos versionados), `npx tsc --noEmit` (0 erros), `npx vitest run` (12 arquivos, 605 testes ok), `npx vite build` (ok).
- Build servido localmente; Playwright (Chromium) com roteiro próprio do auditor: login de teste, boas-vindas, tema trocado pelo botão "Tema escuro"/"Tema claro". Para cada conteúdo o ciclo inteiro: tela do tema → botão "Revisão em slides" → link do conteúdo → capa → tempo 1 (questões, letra pelo teclado, certeza) → tempo 2 (todos os slides, com a tentativa de fórmula/frase) → tempo 3 (3 lacunas) → tempo 4 (questões) → tempo 5 (fim) → tela Revisão, aba Conteúdos (vencimento forçado).
- Conteúdos: Física F03.5, Filosofia e Sociologia S05.3, Inglês I03.4, Geografia G12.3, História H03.9 (pintura "Tiradentes esquartejado"), Biologia B11.5.
- Larguras e temas: 390, 768, 1280 e 1440 px, claro e escuro (48 ciclos completos). Em 1280 claro e 390 escuro cada roteiro animado e cada resolução animada foram tocados até o fim.
- Em cada tela: rolagem lateral, elemento fora da tela, texto cortado por `overflow`, reticências, fração em linha, fonte calculada, foto com crédito visível e imagem carregada, console e rede.
- Conteúdo: os 53 JSON publicados são idênticos aos de `docs/revisao/` (fora `obra` e `foto.img`). 5 slides por matéria (30) comparados com o que a tela mostra: título, texto, frase-chave, legenda e roteiro iguais ao JSON (exceto o defeito A2).
- Varredura estática de todos os 3 308 slides (fração em linha pelo próprio `partesFracao` do site, códigos de cor, tamanhos do FORMATO).

Screenshots: `/tmp/claude-0/-home-user-aprendice/aee5743b-68b8-515c-b692-c4a8e9011d85/scratchpad/audrv/shots/` (nome = `<conteúdo>-<largura>-<tema>-<etapa>.png`; ex.: `F03.5-1280-claro-2s07b.png` = slide 7 depois da animação). Os prints de página inteira mostram barras fixas (menu, barra de abas do celular, barra de resposta) no meio da imagem: é efeito da captura, não defeito.

## O que está certo
- Nenhuma rolagem lateral e nenhum texto cortado nas 4 larguras, nos 2 temas, em todas as etapas.
- Fontes: títulos e textos em Familjen Grotesk; fórmulas e contas em Caveat; cor da matéria em etiqueta, tempos, pontos, botões e roteiro; cantos e tamanhos pelos tokens do sistema (`--r-dest`, `--fs-*`).
- Frações das fórmulas e do motor sempre empilhadas.
- Toda foto aparece com autor, licença e link do Commons, e todas as 203 imagens carregam (servidas pelo próprio site).
- Roteiros e resoluções animadas rodam até o fim (motor: 10 a 20 s por exemplo); "reduzir movimento" previsto.
- Teclado: letras/1–5 e Enter no tempo 1 e 4; setas ← → nos slides.
- O que a tela mostra é exatamente o texto aprovado do JSON (salvo A2).

## Contagem
| Gravidade | Quantos |
|---|---|
| Alta | 4 |
| Média | 7 |
| Baixa | 9 |

## Alta

**A1. "Ver acontecer" sem animação: o visual é o roteiro de produção escrito em texto.** Todas as matérias, todas as larguras, os 2 temas.
Reproduzir: qualquer slide com `visual.movimento` (ex.: F03.5 slide 1, H03.9 slide 1, S05.3 slide 1).
O palco mostra frases como "A foto aparece inteira por 2 s.", "Ela esmaece e no lugar surge um livro fechado com '1988'", "A foto aparece inteira por 2 s e esmaece; o gráfico ocupa o lugar dela", "Um círculo tracejado se ajusta à curva do alto do loop" — nada disso é desenhado; a foto fica parada e o aluno lê instruções de bastidor (169 passos com tempo de cena; 2 s marcado em cor como se fosse dado). Contraria "Ver a coisa acontecer: resolução animada, nunca só texto" (CLAUDE.md) e o pilar 1.2. O próprio código registra o desenho SVG como pendente (`PEDIDOS-MOTOR.md`, pedido 1).
Screenshots: `F03.5-1280-claro-2s01b.png`, `S05.3-1280-claro-2s01b.png`, `G12.3-1280-claro-2s02b.png`.

**A2. Ao tirar o código de cor, frases ficam quebradas na tela.** `limpaRoteiro` apaga "#75451D" e deixa a preposição solta ou o parêntese aberto: 432 trechos de roteiro/descrição terminam em "... em." ou similar.
Exemplos vistos na tela: G12.3 slide 2 "o pequeno, 'poluição', em."; G12.3 slide 1 "o traçado do rio Doce, em, até o Atlântico"; G12.3 slides 3, 4 e 5 ("... em."); H03.9 slide 3 "Pino 1641, São Paulo (marrom: ‘bandeirantes..." (parêntese nunca fecha); H06.1 (vários "Destaques em.").
Screenshot: `G12.3-1280-claro-2s02b.png`.

**A3. Tempo 4 ("Aplicar") e fim sem correção: faltam as resoluções.** Das questões dos 339 conteúdos com revisão, só 71 (Biologia) têm resolução; Física, Filosofia e Sociologia, Inglês, Geografia e História: 0. Após responder, o painel diz "A resolução comentada desta questão está em revisão"; o fim promete "Questões para rever com a correção completa", que não existe. Quebra "Errar ensina" e os 4 blocos da correção. Cada questão gera ainda `404 /conteudo/<m>/res/<conteúdo>.json` e erro "Failed to load resource" no console.
Reproduzir: F03.5, G12.3, H03.9, I03.4, S05.3 — qualquer largura, responder no tempo 4.
Screenshots: `F03.5-1280-claro-t4-q1.png`, `F03.5-1280-claro-5fim.png`.

**A4. Índice de várias letras sai errado no motor da conta.** F03.5 slide 7 (exemplo): `v_{mín}` aparece como "v" + "mi" em outra fonte (não Caveat, mais grossa) + "n" ainda mais abaixo — 1280 e 390, claro e escuro. Os JSON têm 108 índices de várias letras (`_{eq}`, `_{máx}`, `_{rel}`, `_{cat}`...) que podem passar pelo mesmo caminho quando estão em `passos`.
Screenshots: `F03.5-1280-claro-2s07b.png`, ampliação `/tmp/claude-0/-home-user-aprendice/aee5743b-68b8-515c-b692-c4a8e9011d85/scratchpad/audrv/zoom-vmin.png`.

## Média

**M1. Número com barra que não é fração aparece empilhado.** Pelo próprio `partesFracao` do site:
- F11.8 slide 4 (roteiro): "rede 220/127 V" e "380/220 V" viram 220 sobre 127;
- G11.6 slide 4: "PEC 48/2023" vira 48 sobre 2023;
- H03.6 slide 1: "Lei 12.519/2011" e "Lei 14.759/2023" viram frações.
(Também `F/A-18` em F10.7 slide 4, hoje escondido porque o slide tem foto.)

**M2. Esc não volta.** O botão "Voltar" diz "Voltar (Esc)", mas a tela da revisão não trata Esc (testado na capa e no tempo 1, 1280 claro: a rota não muda). Princípio 6 (responder pelo teclado).

**M3. Aba "Conteúdos" da tela Revisão invisível no celular.** Em 390 (claro e escuro) a 4ª aba fica fora da tela (x 356–468) — aparece só um "C" no canto, sem sinal de que a faixa rola.
Screenshot: `F03.5-390-escuro-6revisao.png`.

**M4. "É aqui que você errou" marca o slide errado.** O pilar 1.2 pede marcar os slides que respondem às questões erradas no tempo 1; o código marca sempre e só o(s) slide(s) `pegadinha`, com qualquer erro ou chute, mesmo sem relação com a questão errada (`FaseVer`, `aviso`).
Screenshot: `B11.5-390-claro-2s05a.png`.

**M5. Imagem sensível sem aviso antes.** H03.9 slide 1: o roteiro manda "Aviso breve antes da imagem: ‘pintura com cena de execução’", mas a pintura (corpo esquartejado) já aparece inteira ao abrir o slide; o aviso é só a linha 1 do roteiro, abaixo da imagem (no celular, depois dela). 390/768/1280/1440, claro e escuro.
Screenshots: `H03.9-1280-claro-2s01b.png`, `H03.9-390-escuro-2s01a.png`.

**M6. Palco do roteiro com grande espaço vazio.** Os passos ainda não tocados ficam com `visibility:hidden` e ocupam o lugar: no início do slide aparece 1 passo e um bloco vazio de 200–300 px (forte em 390 e 768).
Screenshots: `I03.4-768-escuro-2s03a.png`, `H03.9-390-escuro-2s01a.png`.

**M7. Fonte do slide enorme e com endereço cru.** 262 slides têm `fonte` com mais de 160 caracteres (até 415), alguns com URL inteira ("https://www.onestopenglish.com/..."). Ocupa metade do slide e, no celular, empurra o visual para depois dela (o roteiro de F03.5 slide 7 vem depois de 8 linhas de fonte).
Screenshots: `F03.5-390-escuro-2s07b.png`, `I03.4-768-escuro-2s03a.png`.

## Baixa

**B1.** 390: o nome do tempo atual sai cortado com reticências ("Pergunta primeiro", "Lembrar sem olhar") — todas as matérias, claro e escuro. Screenshot: `B11.5-390-claro-3lembrar-a.png`.

**B2.** 390: no cabeçalho do palco, "De novo" quebra em duas linhas e "Pausar" fica sem fundo/apertado. Screenshots: `F03.5-390-escuro-2s07b.png`, `B11.5-390-claro-2s05a.png`.

**B3.** Crédito sempre começa com "Foto:", também para pintura e gravura ("Foto: Pedro Américo (1843–1905)" em H03.9).

**B4.** Aba "Conteúdos" da Revisão: linha sem o ponto/ícone da matéria (as outras abas mostram), selo "Para hoje" muito largo que espreme o título no celular, estilo inline `fontSize: 15`; o subtítulo da tela fala só das questões ("volta em 1, 3, 7, 16, 35 dias"). Screenshots: `F03.5-1280-claro-6revisao.png`, `F03.5-390-escuro-6revisao.png`.

**B5.** Lembrar sem olhar: os botões "Não lembrei / Quase / Lembrei" têm teclas 1/2/3 definidas no código (`NOTAS`) mas nenhum atalho funciona.

**B6.** Exemplo com a frase-chave entregando a resposta antes da resolução (F03.5 slide 7: "No fundo, o trilho empurra com seis vezes o peso" acima do "Assistir resolução").

**B7.** Formato fora do `FORMATO.md`: 14 slides com texto acima de 40 palavras (ex.: F02.3 #5, F04.1 #8), 2 frases-chave acima de 15 palavras (F02.4 #8, F04.3 #8).

**B8.** `revisao.py` recusa foto fora do Wikimedia Commons ("foto fora do Wikimedia Commons"), mas o `FORMATO.md` (decisão do dono, 06/11/2026) aceita outras fontes com crédito e acervo: a próxima imagem autorizada de museu ou acervo trava a conversão.

**B9.** No motor, raiz sai como "√(R · g)" (parênteses), sem a barra da raiz usada nas fórmulas dos slides (`.fm-raiz`); as duas formas convivem no mesmo slide (F03.5 slide 7).

## Observação (fora do escopo, sem contar)
Console: avisos de "React Router Future Flag" em todas as telas e "GPU stall due to ReadPixels" (WebGL da tela inicial); já existiam.
