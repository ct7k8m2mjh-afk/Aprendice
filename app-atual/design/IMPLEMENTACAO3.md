# Implementação 3: ajustes finais de tela (29/10/2026)

Pedido do dono: "Antes separava demais, agora não divide nada. Precisa regredir um pouco, mas pegar o que ficou bom agora, só que não muito extremo." Por isso as mudanças são pequenas e de meio-termo. Nada foi refeito do zero.

**Arquivos editados:** `shell.html`, `materia.css`, `materia.js`, `icones.js`, `gera_design.py`. A cópia de antes está em `design/bak_impl3/`.
**Não mexi** em `<m>/app.js`, `<m>/index.html` nem nos dados.
**Build:** rodou só em `/home/claude/esc_test`, com cópias reais (não links) das matérias, sem `res/`. **Falta rodar `python3 design/gera_design.py` em escadas-sc.**
**Prints:** antes em `design/depois3/antes/` e depois em `design/depois3/`, nos tamanhos 1366×768 e 1920×1080 no tema claro, 1366 no escuro (`*_esc_*`) e 390×844. As conferências de fluxo estão nos arquivos `v_*.png`.

## 1. Ícones dos módulos: os realistas
- **Origem.** `gera_design.py` lê `design/icones_real/<id>.svg`, os 53 desenhos. Cada matéria recebe só os seus.
- **Como entram.** Como `<img>` (`ICO.tema('B01')` → `img.ic-tema.ic-real`). Cada SVG traz filtros e ids próprios. Repetidos inline na mesma página, eles se atrapalhariam.
- **Shell.** Ele só mostra ícone de módulo na busca, em 28 px. Por isso leva miniaturas WebP de 64 px, cerca de 80 KB para as 53, e não os 912 KB dos SVGs.
  - As miniaturas são geradas com cairosvg e PIL.
  - Ficam em cache em `icones_real/_mini64.json`, refeito quando algum SVG muda.
  - O shell foi de 680 para 778 KB.
- **Onde aparecem:** faixa de temas (ícone de 44 px num círculo branco, com o anel de progresso), página do módulo, "Temas desta área", grade de Questões, Desempenho, temas dos flashcards, escada, "Teoria do tema" sob a questão e busca.
- **Fundo da matéria.** O motivo apagado do fundo continua com o traço antigo (`ICO.traco`).
- **Crédito "Ilustrações: Servier Medical Art, CC BY 3.0":**
  - em 11,5 px, no rodapé da faixa de temas, só em Biologia e Química, que usam desenhos da Servier (Matemática e Português são 3D do projeto). Some na tela da questão;
  - em Configurações, no shell;
  - no cabeçalho de `icones.js`.

## 2. Ícones de conteúdo em ladrilho
- **Desenho.** Os 255 ícones de traço continuam e ganharam `.ic-sub`:
  - ladrilho com cantos de 30%;
  - gradiente da cor da matéria (7% → 19% sobre o branco);
  - brilho radial no topo;
  - contorno de 1 px a 16%;
  - sombra de contato de 3 px.
- **Ícone.** Fica na cor sólida da matéria, com uma margem feita pelo `viewBox` (`-7.5 -7.5 63 63`). Padding em % seria calculado sobre a largura do botão e quebrava as pílulas.
- **Escuro.** Tem uma versão própria.
- **Pílula selecionada.** O ladrilho fica branco.

## 3. Barra lateral
- **Claro.** Barra branca (`--lado:#FFFFFF`), borda e sombra leve à direita. O conteúdo foi de #F5F5F3 para **#F1F1EE**, no shell (`--fundo`) e nas matérias (`--papel`).
- **Item ativo.** Fundo tingido da cor da matéria (11%) e texto em 600.
  - A seção aberta (Questões, Flashcards…) fica tingida a 6%, com o ponto.
  - Início fica tingido de roxo.
- **Escuro.** Barra #131418 sobre o conteúdo #0C0D10, com a mesma regra.

## 4. Seções em cartões
**O cartão.** `.ad-bloco` é branco, com borda de 1 px, cantos de 16 px e cabeçalho de 19 px separado por uma linha. Dentro dele, pílulas, chips e listas não têm caixa própria, só divisórias entre os itens. O `.vazio` tracejado perde a borda quando está dentro de um cartão.

**Onde entrou:**
- **Matéria:**
  - "Revise por área": o cartão inteiro, com "Temas desta área" separado por uma linha vertical;
  - "Onde você precisa reforçar";
  - "O que você vai encontrar", na página do módulo;
  - grade de temas de Questões;
  - Revisão: "Vencidas hoje", e "Próximos 7 dias" com "Marcadas" lado a lado;
  - Flashcards: Área e Tema;
  - Desempenho: "Acerto por tema" e "Padrões";
  - Simulados e Histórico.
- **Shell:** "Hoje · Matéria", "Meu progresso" e "Atividade recente".

Nas seções que já vêm do app, `emBloco()` move o título e o painel originais para dentro do cartão, sem perder os ids.

## 5. O que importa chama mais atenção
- **Botão principal:** cor da matéria cheia e sombra suave da mesma cor (`--sombra-pri`).
  - Começar: módulo, área e flashcards.
  - Treino de hoje / Continuar, na capa: 18 px em 700 e 56 px de altura.
  - Confirmar / Próxima questão: 18 px e 54 px.
  - Corrigir.
  - Revisar agora.
  - Começar / Continuar do Início: 18 px e 56 px.
- **Números de progresso:**
  - "0 de 500 respondidas": o número em 22 px na cor da matéria;
  - números dos flashcards em 40 px;
  - Meu progresso em 42 px.

## 6. Flashcards com imagem
- **Dados.** `D.flash_img` (bio 15, qui 12, mat 8) entra no MESMO baralho de `D.flash`, com o selo de tipo "Com imagem". Tudo é igual aos outros cartões:
  - correção por IA ou local;
  - revisão espaçada em `S.flash[id]`;
  - sessões de 20;
  - mescla com a conta.
- **Imagens.** O build embute os SVGs de `design/flash_img/<m>/` só na própria matéria (`%FLIMG%`). Isso soma cerca de 1,1 MB em Biologia, 0,8 MB em Química e 75 KB em Matemática. Português não tem.
- **No cartão:**
  - a imagem fica grande acima do campo (até 640 px, no máximo 46vh), em papel branco;
  - clicar abre o zoom, ajustado à altura da tela;
  - o crédito aparece pequeno embaixo.
- **Filtro.** "Com imagem · N" fica no cabeçalho do cartão Área. Combina com área e tema e é lembrado em `ad-fl-img-<m>`.
- **Busca e Início.** O índice do shell (`IDX.fl`) conta os cartões com imagem.

## 7. Ilustrações
O build já usa as moléculas novas (`gera_ilu3d.py`). Não precisei mexer.

## Conferência
- **Erros:** 0 pageerror e 0 erro de console, fora os 404 de `*/res/*`, que não foi copiado para `esc_test` de propósito.
- **Fluxo de flashcard com imagem (1366):**
  - "mitocondria", sem acento, foi corrigido como **Certo** pela comparação local;
  - Acertei num cartão e Errei no outro, e depois respondi uma questão;
  - depois de recarregar, `S.flash` continuou com `bio-i13` e `bio-i05`, `q` com 1 resposta, e a tela mostrou 1 para revisar e 13 novos;
  - o Início mostrou "1 de 500" e a Atividade recente.
- **Celular (390):** sem rolagem horizontal; o cartão de vidraria aparece com a imagem inteira.
- **Revisão dos prints com a pergunta "exagerou?":**
  - o ladrilho ficou sutil;
  - a sombra dos botões é discreta;
  - os cartões não têm caixas dentro;
  - a barra lateral se distingue sem pesar.
- **Ajustes feitos depois de olhar os prints:**
  - padding em % quebrava os ladrilhos;
  - havia margem sobrando em "O que você vai encontrar";
  - havia linha dupla no fim da lista;
  - a grade de temas tinha cantos curvos nas divisórias;
  - o zoom cortava a imagem na vertical.
