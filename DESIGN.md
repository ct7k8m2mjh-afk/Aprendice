---
name: APRENDICE
description: Site de estudo para vestibulares pelas questões reais das provas, em folhas brancas sobre papel cinza, uma cor por matéria.
colors:
  papel: "#F1F1EE"
  folha: "#FFFFFF"
  folha2: "#F4F4F1"
  malha: "#EEEEEA"
  linha: "#E5E5E0"
  borda2: "#D6D6D0"
  campo-borda: "#878A93"
  tinta: "#17181C"
  lapis: "#585B64"
  fraco: "#62656F"
  neutro-c: "#2B2D33"
  certo: "#0A7550"
  certo-bg: "#E2F6EE"
  errado: "#B3302A"
  errado-bg: "#FCEAE7"
  aviso: "#8A6200"
  aviso-bg: "#FBF1DA"
  cad-papel: "#FBF7EA"
  cad-tinta: "#1C2F74"
  cad-borda: "#E6DCC0"
  bio-c: "#177E36"
  bio-t: "#12692C"
  qui-c: "#C2185B"
  qui-t: "#A3124B"
  mat-c: "#087884"
  mat-t: "#066570"
  por-c: "#F2C12E"
  por-t: "#8A6200"
  fis-c: "#2F5BD3"
  fis-t: "#2A4FB8"
  geo-c: "#E07010"
  geo-t: "#A84F00"
  his-c: "#8A5A2B"
  his-t: "#7A4E24"
  fil-c: "#6A3DB8"
  fil-t: "#5E35A6"
  soc-c: "#4A5568"
  soc-t: "#3F4859"
  ing-c: "#D0312D"
  ing-t: "#B0261F"
  verde-marca: "#1A8038"
  lado: "#FFFFFF"
  lado-escuro: "#131418"
  papel-escuro: "#0C0D10"
  folha-escuro: "#16171B"
  folha2-escuro: "#1D1F24"
  malha-escuro: "#1A1B1F"
  linha-escuro: "#25272D"
  borda2-escuro: "#32353D"
  campo-borda-escuro: "#666A74"
  tinta-escuro: "#EDEEF1"
  lapis-escuro: "#A3A6B0"
  fraco-escuro: "#8C8F99"
  neutro-c-escuro: "#D9DBE0"
  certo-escuro: "#2FD39A"
  errado-escuro: "#FF7B6B"
  aviso-escuro: "#F5C451"
typography:
  saudacao:
    fontFamily: "Familjen Grotesk, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "34px (24px até 640px)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.4px"
  titulo-materia:
    fontFamily: "Dancing Script, Familjen Grotesk"
    fontSize: "44px (em todas as larguras)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0"
    color: "{colors.<materia>-t}"
  display:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.4px"
  capa:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.4px"
  headline:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.3px"
  title:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.25
  title-bloco:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.1px"
  rotulo-area:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.08em"
    textTransform: "uppercase"
  body:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  body-item:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.35
  label:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 600
    lineHeight: 1.4
  mao:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "23px"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  item-menu: "9px"
  p: "10px"
  controle: "11px"
  grande: "13px"
  r: "14px"
  bloco: "16px"
  destaque: "18px"
  pilula: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  bloco-x: "22px"
  pagina-x: "32px (16px até 700px)"
  pagina-topo: "22px (14px até 700px)"
  pagina-pe: "48px (32px até 700px)"
  grade: "28px"
  secao: "28px"
layout:
  menu-lateral: "244px (acima de 1180px)"
  trilho: "64px (641 a 1180px, e menu recolhido)"
  abas-celular: "68px, até 640px"
  topo: "61px (57px até 640px)"
  pagina-max: "1440px"
  inicio-max: "1560px, 12 colunas, 28px"
  conteudo-max: "880px"
components:
  button-primary:
    backgroundColor: "{colors.neutro-c}"
    textColor: "{colors.folha}"
    typography: "{typography.body-item}"
    rounded: "{rounded.controle}"
    padding: "0 20px"
    height: "46px"
  button-grande:
    typography: "18px 700"
    rounded: "{rounded.grande}"
    padding: "0 30px"
    height: "56px"
  button-capa:
    typography: "21px 700"
    rounded: "{rounded.bloco}"
    padding: "16px 40px"
    height: "66px"
    minWidth: "380px"
  button-primary-materia:
    backgroundColor: "{colors.bio-c}"
    textColor: "{colors.folha}"
    rounded: "{rounded.controle}"
    padding: "0 20px"
    height: "46px"
  button-secondary:
    backgroundColor: "tinta a 7%"
    textColor: "{colors.tinta}"
    rounded: "{rounded.controle}"
    padding: "0 20px"
    height: "46px"
  button-secondary-hover:
    backgroundColor: "tinta a 11%"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.lapis}"
    rounded: "{rounded.controle}"
    padding: "0 12px"
    height: "46px"
  button-icon:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.lapis}"
    rounded: "11px"
    size: "40px"
  input:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.controle}"
    padding: "0 14px"
    height: "48px"
  chip:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.lapis}"
    rounded: "{rounded.pilula}"
    padding: "7px 14px"
  chip-selected:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
  etiqueta:
    backgroundColor: "{colors.malha}"
    textColor: "{colors.lapis}"
    typography: "13px 500"
    rounded: "{rounded.pilula}"
    padding: "4px 10px"
  folha:
    backgroundColor: "{colors.folha}"
    rounded: "{rounded.bloco}"
    padding: "18px 22px"
  cartao-tema:
    size: "196 x 204px (150 x 176px até 640px; 150px compacto)"
    rounded: "{rounded.bloco}"
    padding: "8px 8px 18px"
    ladrilho: "128px de altura, canto 11px, objeto 3D de 112px"
  alternativa:
    backgroundColor: "{colors.folha2}"
    textColor: "{colors.tinta}"
    rounded: "12px"
    height: "56px (50px até 900px)"
  conta-a-mao:
    backgroundColor: "{colors.cad-papel}"
    textColor: "{colors.cad-tinta}"
    typography: "{typography.mao}"
    rounded: "8px"
    padding: "6px 12px"
---

# Design System: APRENDICE

## Regra de trabalho (decisão do dono, 05/11/2026)
Referência do dono é para **reproduzir**, não para copiar: cada tela, componente ou imagem é construído de novo até ficar igual à referência. Proibido copiar e colar código, CSS, imagens ou arquivos da referência, e proibido reaproveitar designs de trabalhos anteriores sem comando expresso do dono (`CLAUDE.md`, princípio 12).

## Fonte da verdade do sistema (comando expresso do dono, 05/11/2026)
O **protótipo `app-atual/`** (o arquivo de estudos do dono) é o sistema de design oficial. Grade, alinhamento e posição de cada elemento, hierarquia, fontes (título da matéria em Dancing Script na cor da matéria, textos em Familjen Grotesk, contas à mão em Caveat), tamanhos, pesos, cores, espaçamentos, margens, largura máxima, cantos e o comportamento em cada largura de tela seguem o protótipo, com os valores exatos de `app-atual/design/materia.css` e `app-atual/design/fontes.css`. Para ver: `PUBLICAR=1 python3 design/gera_design.py` dentro de `app-atual/` e abrir `<matéria>/index.html`.
- É referência do **sistema**, não do conteúdo: matérias, telas, funções e ícones novos continuam e seguem esse sistema; nada volta atrás.
- Quando um valor deste arquivo divergir do protótipo, vale o protótipo, e este arquivo é corrigido.
- Exceção aprovada pelo dono: a tela de login segue a referência própria dela (Aprendice_Login_Pacote).
- Ícones: sem animação; trocáveis quando o dono mandar, sempre no lugar, tamanho e enquadramento do sistema.
- Conferência: 390, 768, 1280 e 1440 px, temas claro e escuro (CLAUDE.md, princípio 9).

## Overview

**Creative North Star: "A mesa de estudo"**

A tela é uma mesa cinza-clara onde ficam folhas brancas: cada bloco de conteúdo é uma folha com borda fina de 1px, cantos suaves e, quando precisa se destacar, uma sombra difusa quase imperceptível. Sobre essa mesa neutra, cada matéria tem a sua cor, e essa cor só aparece no que pertence à matéria (o botão de continuar, a barra de progresso, o título da página da matéria, o anel de acerto, a lavagem suave do cartão principal). Fora de uma matéria, o "acento" é um grafite neutro (`neutro-c`), então a interface geral não tem cor de marca: a cor é informação.

O tom é calmo, denso o bastante para quem estuda todos os dias, e concreto. Familjen Grotesk carrega a interface, de título a etiqueta, com hierarquia feita por tamanho e peso (400, 600 e 700); a caixa alta espaçada aparece só nos rótulos de área (13px, 0.08em) e no "Sua resposta" do painel da questão, como no protótipo. O nome da matéria, no topo de toda tela dela, é escrito em Dancing Script 700 de 44px na cor da matéria. A escrita à mão (Caveat) aparece em um único lugar: a conta resolvida, escrita sobre um retalho de papel de caderno dentro da resolução. As ilustrações são objetos 3D realistas (célula, átomo, sólidos, livros com pena) apoiados em ladrilhos lavados na cor da matéria; os ícones de interface são traços Lucide finos (1.75) que nunca competem com elas.

Tema claro é o padrão; o escuro troca papel e folha por grafites quase pretos e clareia as cores das matérias para manter o contraste, sem mudar a estrutura.

**Key Characteristics:**
- Papel cinza neutro, folhas brancas com borda de 1px, sombras difusas e neutras.
- Uma cor por matéria, usada só no que é da matéria; grafite neutro no resto.
- Familjen Grotesk em tudo; Dancing Script só no nome da matéria (44px, na cor dela); Caveat só na conta à mão.
- Ilustrações 3D realistas para matérias, módulos e conteúdos; ícones de interface em traço Lucide 1.75.
- Verde, vermelho e âmbar reservados para certo, errado e aviso.
- Sem emoji, sem rótulos-chamada acima de títulos, sem brilho colorido.

## Colors

Uma base acromática levemente quente, três cores semânticas e um círculo de cores de matéria que entram por escopo (`.m-<id>`), nunca soltas na interface.

### Primary
- **Cor da matéria** (`--c` / `--t` / `--ink`, definidos por matéria em `app/src/dados/materias.ts` e injetados por `EstiloMaterias` como `.m-<id>`, nos dois temas): `--c` preenche (botão, barra, anel, ponto da navegação, borda do item atual), `--t` é a versão do texto sobre a folha com contraste AA (título da matéria, links e destaques dentro da matéria) e `--ink` é o texto sobre `--c`. Biologia verde (`bio-c`), Química magenta (`qui-c`), Matemática verde-água (`mat-c`), Português amarelo (`por-c`, com texto âmbar escuro `por-t` e tinta escura sobre o amarelo). As matérias em preparação já têm matiz reservado: Física azul, História terracota, Geografia oliva, Inglês violeta, Filosofia e Sociologia castanho (Redação não é matéria do site).
- **Lavagens da matéria** (`--sv` = 13% de `--c` sobre a folha; `--sv2` = 7%): fundo do ladrilho das ilustrações 3D, do ícone em quadradinho de linhas e atalhos, da alternativa selecionada, da questão respondida na folha de respostas, da caixa "A ideia-chave".
- **Grafite neutro** (`neutro-c`, e `neutro-c-escuro` no tema escuro): é o valor de `--c`/`--t` fora de qualquer matéria. Botões e destaques das telas gerais (simulados, revisão, configurações) usam esse grafite.

### Semânticas
- **Certo** (`certo` sobre `certo-bg`): alternativa certa, degrau acertado, veredito "acertou", passo concluído.
- **Errado** (`errado` sobre `errado-bg`): alternativa errada, alternativa marcada na resolução, cronômetro em alerta, botão de perigo.
- **Aviso** (`aviso` sobre `aviso-bg`): "quase", questão marcada para revisar, pausa, pista, armadilha, cuidado, prévia.

### Neutral
- **Papel** (`papel`): o fundo da mesa e da barra lateral.
- **Folha** (`folha`) e **Folha 2** (`folha2`): superfícies de conteúdo; `folha2` é o hover e o fundo de blocos internos (texto da questão, "por que", números).
- **Malha** (`malha`): trilho de barras e anéis, fundo de etiquetas e numerais neutros, seletor de tema.
- **Linha** (`linha`) e **Borda 2** (`borda2`): a borda de 1px de toda folha e divisória; `borda2` é a borda em hover e do botão secundário.
- **Borda de campo** (`campo-borda`): borda de campos de texto, busca e alternativas, mais escura para atingir 3:1 de contraste de componente.
- **Tinta** (`tinta`), **Lápis** (`lapis`), **Fraco** (`fraco`): texto principal, texto de apoio e metadados.
- **Caderno** (`cad-papel`, `cad-tinta`, `cad-borda`): papel creme, tinta azul de caneta e borda bege, só para os materiais de caderno (conta à mão e lista de fórmulas pautada).

### Named Rules
**A Regra da Cor Que Pertence.** A cor de uma matéria só pinta o que é daquela matéria. Fora do escopo `.m-<id>`, `--c` é grafite. Se um elemento não tem matéria, ele não tem cor.

**A Regra do Semáforo Reservado.** Verde, vermelho e âmbar significam certo, errado e aviso, e nada mais. Uma matéria nova nunca ocupa o matiz do vermelho de "errado".

**A Regra do Texto Legível.** Texto colorido usa `--t`, nunca `--c`; em Português claro, o amarelo preenche e o âmbar escreve.

## Typography

**Display Font:** Familjen Grotesk (com system-ui, -apple-system, Segoe UI, Roboto)
**Body Font:** Familjen Grotesk
**Título da matéria:** Dancing Script 700 (hospedada em `app/src/assets/fontes`, licença SIL OFL 1.1 em `OFL-dancing-script.txt`), só no nome da matéria
**Mão:** Caveat (com Segoe Print, cursive), só na conta à mão

**Character:** Uma grotesca de desenho firme e um pouco condensado, que dá aos títulos personalidade sem perder a leitura em 13px. A letra de mão é um traço do caderno do aluno, não uma fonte decorativa.

### Hierarchy
- **Saudação** (600, 34px, -0.4px; 24px até 640px): "Olá, ..." do início.
- **Título da matéria** (Dancing Script 700, 44px/1.05, em `--t`, igual em todas as larguras), com a linha de apoio em 15px `lapis` 4px abaixo.
- **Display** (600, 32px/1.15, -0.4px): título de página, de tema e de conteúdo (com o ícone 3D de 44px a 14px do texto); linha de apoio em 17px `lapis`.
- **Capa** (700, 32px): título da capa do treino geral; **Headline** (600, 30px/1.2): título do destaque do início.
- **Title** (600, 22px): título de seção do início ("Minhas matérias"); 19px nos títulos de folha e seção; 13px 600 caixa alta 0.08em em `--t` nos rótulos de área.
- **Body** (400, 17px, 1.55): texto corrido; resumo de teoria a 17.5px/1.6 com máximo de 72ch.
- **Item** (600, 15 a 17px, 1.25 a 1.35): título de linha, cartão, degrau e atalho, com metadado em 13.5 a 14px `fraco` logo abaixo.
- **Label** (600, 12.5 a 14.5px, sem caixa alta): etiquetas, grupos da navegação, legendas, números de passo.
- **Mão** (Caveat 400, 23px, 1.3): só a linha de conta em cada passo da resolução.

Números de progresso, contagem e tempo usam algarismos tabulares (`.num`).

### Named Rules
**A Regra de Uma Voz.** Familjen Grotesk em tudo, inclusive botões, teclas (`kbd`) e números grandes. Hierarquia por tamanho e peso. Exceções do sistema: o nome da matéria em Dancing Script e a caixa alta espaçada dos rótulos de área.

**A Regra da Conta à Mão.** Caveat só escreve a conta resolvida. Não vai em títulos, botões, destaques nem listas.

## Layout

Valores aplicados em `app/src/estilo/base.css` (variáveis `--lado`, `--topo`, `--pag-*`, `--r-*`) e `app.css`, medidos no protótipo (`app-atual/design/shell.html` e `materia.css`) com o navegador.

- **Menu lateral** (acima de 1180px): 244px, fundo `lado` (branco no claro, `#131418` no escuro), borda de 1px e sombra lateral leve; padding 18/12/12px. Logo de 150 x 48px; botão de recolher 34px (canto 9px). Itens de 38px: padding 9/12px, canto 9px, ícone 20px a 12px do texto, 15.5px 500 em `lapis`; ativo em 600 `tinta` sobre `tinta` a 7% (na matéria, a cor dela a 15%). Ícones das matérias na cor da matéria. Rótulo de grupo 14px 500 `fraco` com ponto de 6px, padding 18/12/6px. Rodapé: meta da semana (anel de 44px, padding 12/12/10px, linha em cima) e Configurações.
- **Trilho** (641 a 1180px, e o menu recolhido no computador): 64px, padding 14/8px, só ícones, itens de 40px.
- **Barra do topo**: 61px com a linha de 1px embaixo (57px até 640px), padding 0 28px (0 12px no celular), 14px entre peças. Busca à esquerda: até 520px (mín. 200px), 40px, canto 10px, ícone 17px, `Ctrl K` só acima de 1180px; ocupa o espaço livre até 900px. Tema Dia/Noite segmentado (padding 3px, canto 10px, botões 6/11px com canto 7px, 14px 500; rótulos somem até 900px). Perfil: avatar de 32px em `tinta` e o nome em 15px 500 (nome some até 900px; o perfil todo some até 640px, onde vai para as abas).
- **Abas do celular** (até 640px): 68px, 5 destinos; botão de 56px de altura com a pílula de 56 x 32px (canto 16px) e ícone de 22px; rótulo 12px 500; ativa com a pílula em `tinta` a 9%.
- **Página**: até 1440px, padding 22/32/48px (14/16/32px até 700px; no celular soma 68px das abas embaixo). Conteúdo estreito (conteúdo de uma escada, configurações) até 880px, alinhado à esquerda dentro da página da matéria.
- **Início**: até 1560px, padding 26/32/40px (20px até 900px, 16px até 640px); grade de 12 colunas com 28px (24px de linha no celular): destaque em 8 colunas + evolução em 4; "Minhas matérias" (22px) e cartões em 3 colunas (2 até 1250px); desempenho em 7 + atividade e frase em 5. Até 1250px tudo em uma coluna.
- **Matéria**: cabeçalho (nome em Dancing Script 44px + apoio 15px), faixa de temas, capa do treino geral (2/3) com os atalhos (1/3, uma coluna até 1250px), e a folha das áreas.
- **Faixa de temas**: cartões de 196 x 204px com 14px entre eles (150 x 176px até 640px; 150px e ladrilho de 84px dentro de um tema ou conteúdo), padding 8/8/18px, canto 16px, ladrilho lavado de 128px (canto 11px) com o objeto 3D de 112px, nome 14.5px 600 em até 2 linhas, barra de 4px no pé. Rola com encaixe, máscara de 64px na borda que tem mais e setas de 40px.
- **Folha das áreas**: padding 8/28/18px, canto 16px (14px até 700px); cada área com rótulo 13px caixa alta em `--t` e o resumo em 14px; linhas em colunas de no mínimo 340px (uma coluna até 900px), cada linha 72px de ícone + nome 17.5px 600 + barra de 6px + apoio 14px + porcentagem 16px 600 em `--t` (56px de ícone e 16px de nome até 700px).
- **Questão**: barra de 52px presa no topo, de borda a borda, com o cronômetro e os botões de 32px; cartão do print (1.8fr) e painel de resposta (mín. 340px) com 20px entre eles, canto 18px. Alternativas de 56px (50px até 900px), canto 12px; certeza em controle segmentado de 36px; confirmar com 54px, 18px 700, canto 13px. Até 900px uma coluna e a folha de resposta presa no rodapé.
- **Breakpoints**: 1250 (grades do início e da matéria), 1180 (menu vira trilho), 900 (questão em uma coluna, topo compacto), 700 (margens de 16px), 640 (abas do celular).

## Elevation & Depth

Profundidade vem primeiro da borda de 1px e da troca de tom entre papel e folha; a sombra é um reforço discreto, sempre neutra (azul-acinzentada muito escura no claro, preta no escuro, com um fio de luz interno de 3 a 4% no escuro). As ilustrações 3D carregam a própria sombra de contato (drop-shadow preta de 12 a 15%).

### Shadow Vocabulary
- **Sombra** (`--sombra`): folhas em destaque (cartão principal, cartões de matéria), item ativo da navegação, botão pressionado do seletor de tema.
- **Sombra alta** (`--sombra-alta`): janelas, aviso flutuante, lupa da questão e hover dos cartões de matéria.
- **Anel de foco de campo** (`0 0 0 3px` de `--c` a 22%): só em campos com foco, junto da borda em `--t`.
- **Seleção por contorno** (`inset 0 0 0 1px`): reforço da borda do item selecionado ou atual (alternativa, degrau seguinte, tema atual, meta escolhida), na cor do estado.

### Named Rules
**A Regra da Sombra Sem Cor.** Sombras são sempre neutras. Nunca brilho colorido em volta de botões, cartões ou ilustrações.

**A Regra da Borda Primeiro.** Toda folha tem borda de 1px; a sombra nunca substitui a borda.

## Shapes

Cantos suaves e consistentes: 8px em etiquetas e retalhos de caderno, 10px em itens de navegação, botões pequenos e miniaturas, 12px em botões, campos e blocos internos, 14px (`--r`) em folhas, alternativas e ladrilhos, 16px em janelas, 18px nos cartões de destaque (principal, capa do treino, cartão de matéria). Chips são pílulas (20px); pontos de matéria, avatares, selos de resultado e números de passo são círculos. Bordas são de 1px em superfícies e 1.5px em controles de escolha (alternativas, opções, notas de flashcard). Ilustrações 3D nunca são recortadas em círculo: ficam inteiras, com `object-fit: contain`, dentro do ladrilho.

## Components

### Buttons
Firmes e sem cerimônia: um bloco de cor sólida com texto em 600.
- **Shape:** cantos de 11px (10px no pequeno), altura de 46px e 16px 600 (38px pequeno; grande de 56px, 18px 700, canto 13px; o da capa do treino geral com 66px, 21px 700, canto 16px e no mínimo 380px, largura total até 899px).
- **Primary:** fundo `--c`, texto `--ink`, sombra mínima de 1px. Dentro de uma matéria é a cor da matéria; fora, grafite.
- **Hover / Focus:** brilho +5% no hover, desce 1px ao pressionar; foco com contorno de 2px em `--t`, afastado 2px. Desabilitado a 45% de opacidade.
- **Secundário:** sem borda, fundo `tinta` a 7% e texto `tinta`; hover a 11%.
- **Fantasma:** transparente, texto `lapis`; hover em `folha2`.
- **Perigo:** fundo `errado`, texto branco.
- **Ícone:** quadrado de 40px, borda de 1px, cantos de 11px; marcado fica com borda `--c` e fundo `--sv`.

### Chips
- **Style:** pílula em folha, borda de 1px `linha`, texto `lapis` 500 a 14.5px.
- **State:** selecionado inverte para fundo `tinta` e texto `papel`. Usado em filtros, certeza da resposta e avaliação de cartões.

### Etiquetas
Retângulo de 8px com texto de 13px 600: neutra em `malha`/`lapis`, da matéria em `--sv`/`--t`, e nas três semânticas com o par `*-bg`/cor.

### Cards / Containers
- **Corner Style:** 14px (`--r`); 18px nos cartões de destaque.
- **Background:** `folha`; cartões de destaque da matéria recebem uma lavagem diagonal de `--c` a 14 a 16% que some até 70% da largura, com borda misturando 30% de `--c`.
- **Shadow Strategy:** sem sombra por padrão; `--sombra` só nos destaques (ver Elevation & Depth).
- **Border:** 1px `linha`; hover em `borda2` com subida de 1px nas folhas clicáveis.
- **Internal Padding:** 20 a 22px em blocos, 14 a 18px em linhas e cartões compactos.

### Inputs / Fields
- **Style:** 48px de altura, cantos de 12px, folha com borda de 1px `campo-borda`, rótulo acima em 600.
- **Focus:** borda em `--t` com anel de 3px de `--c` a 22%.
- **Error / Disabled:** sem estado próprio de campo; erros aparecem em blocos `errado-bg`.

### Navigation
- **Lateral:** itens de 38px, 15.5px 500 em `lapis`, cantos de 9px; hover em `tinta` a 4%; ativo em 600 sobre `tinta` a 7% (matéria: a cor dela a 15%). Cada matéria com o seu ícone de traço na cor dela; "Outras matérias" abre a lista das demais. Grupo "Estudo" com rótulo de 14px 500 `fraco` e ponto de 6px. Ver medidas em Layout.
- **Superior:** busca de até 520px x 40px (canto 10px) à esquerda, seletor Dia/Noite segmentado em `tinta` a 6%, avatar de 32px em `tinta`.
- **Celular:** abas inferiores com pílula de 56 x 32px, ícone de 22px e rótulo de 12px 500; a ativa com a pílula em `tinta` a 9%.

### Alternativas da questão
No painel de resposta, uma linha de cinco botões de 56px de altura (50px até 900px) com a letra em 20px 600, fundo `folha2`, borda de 1.5px `linha`, cantos de 12px; selecionada recebe borda `--c` e fundo `--sv`; depois da correção, certa e errada assumem as cores semânticas; riscada fica a 60% com a letra tachada. Com texto, viram linhas empilhadas.

### Resolução em passos
Linha do tempo vertical: número do passo em círculo de 34px `--sv`/`--t`, fio de 2px `linha` ligando os passos, título em 600, a conta escrita à mão (Caveat 23px, tinta azul de caneta sobre retalho `cad-papel` com borda `cad-borda`) e o "por que" em `lapis`.

### Caderno de fórmulas
Lista em papel creme pautado (linhas a cada 28px em 10% da tinta), tinta azul `cad-tinta`, cantos de 10px, escrita em Familjen Grotesk 16px.

### Ilustração 3D
Objetos realistas renderizados, um por matéria, módulo e conteúdo, sobre ladrilho de `--sv2` (cartão de matéria em 16:10, faixa de temas em 64px, linhas em 64px). Ícones de interface (Lucide, traço único de 1.75, sem preenchimento, 18 a 22px) ficam para ações e navegação; quando um item não tem ilustração própria, cai para a do módulo.

## Do's and Don'ts

### Do:
- **Do** envolver toda tela ou bloco de uma matéria no escopo `.m-<id>` e usar `--c`, `--t`, `--ink`, `--sv`, `--sv2`; nunca o hexadecimal da matéria direto.
- **Do** usar `--t` para qualquer texto colorido e `--c` só para preenchimentos.
- **Do** dar a toda folha borda de 1px `linha` e cantos de 14px; reservar `--sombra` para destaques e `--sombra-alta` para o que flutua.
- **Do** usar `campo-borda` em campos e alternativas, para manter 3:1 de contraste de componente.
- **Do** ilustrar matérias, módulos e conteúdos com objetos 3D realistas sobre ladrilho `--sv2`, e a interface com traços Lucide de 1.75.
- **Do** manter números de progresso e tempo em algarismos tabulares.
- **Do** verificar cada tela nos dois temas; os valores escuros de cada matéria vêm de `materias.ts`.

### Don't:
- **Don't** usar a cor de uma matéria em elementos que não são dela, nem como cor de marca geral.
- **Don't** usar verde, vermelho ou âmbar fora de certo, errado e aviso.
- **Don't** colocar rótulos-chamada (kicker, eyebrow) em caixa alta ou colorida acima de títulos.
- **Don't** usar sombra ou brilho colorido; sombras são neutras.
- **Don't** usar emoji nem ícones de glifo; nem ícones planos ou de traço no lugar da ilustração 3D de um conteúdo.
- **Don't** usar Caveat fora da conta à mão da resolução, nem Dancing Script fora do nome da matéria; nenhuma outra família na interface.
- **Don't** escrever texto em amarelo de Português sobre folha clara; use `por-t`.
