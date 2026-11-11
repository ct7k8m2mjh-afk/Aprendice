---
name: APRENDICE
description: Site de estudo para vestibulares pelas questões reais das provas, em folhas brancas sobre papel cinza, uma cor por matéria.
---

# Design System: APRENDICE

Versão compacta (09/11/2026). Texto longo anterior: `docs/historico/2026-11-09-antes-da-compactacao/DESIGN.md`. **Se este arquivo divergir do código, vale o código** (`app/src/estilo/*.css`, `app/src/dados/materias.ts`); se divergir do protótipo, vale o protótipo e corrige-se aqui.

## Regras de base
- Sistema = protótipo `app-atual/` (`design/materia.css`, `fontes.css`, `shell.html`); ver: `PUBLICAR=1 python3 design/gera_design.py` em `app-atual/`. Sistema, não conteúdo: telas e matérias novas seguem o sistema.
- Reproduzir referência, nunca copiar (princípio 12). Exceção: login segue a referência própria (Aprendice_Login_Pacote).
- Conferir em 390, 768, 1280, 1440 px, claro e escuro (princípio 9).
- Clima "mesa de estudo": papel cinza, folhas brancas com borda 1px, sombra neutra discreta; cor da matéria só no que é da matéria; fora dela, grafite `neutro-c`. Claro é o padrão; escuro troca superfícies e clareia as cores das matérias.
- Proibido: emoji, ícone de glifo, rótulo-chamada (kicker) acima de título, brilho/sombra colorida, cor de matéria fora do escopo `.m-<id>`, verde/vermelho/âmbar fora de certo/errado/aviso, hexadecimal de matéria direto no CSS.

## Cores

### Base (`base.css`, claro / escuro)
| Token | Claro | Escuro | Uso |
|---|---|---|---|
| papel | #F1F1EE | #0C0D10 | fundo da mesa |
| folha | #FFFFFF | #16171B | superfícies |
| folha2 | #F4F4F1 | #1D1F24 | hover, blocos internos |
| malha | #EEEEEA | #1A1B1F | trilhos, etiquetas neutras |
| linha | #E5E5E0 | #25272D | borda 1px de toda folha |
| borda2 | #D6D6D0 | #32353D | borda em hover, secundário |
| campo-borda | #878A93 | #666A74 | campos e alternativas (3:1) |
| tinta / lapis / fraco | #17181C / #585B64 / #62656F | #EDEEF1 / #A3A6B0 / #8C8F99 | texto principal / apoio / metadado |
| neutro (`--c`,`--t`,`--p` fora de matéria) | #2B2D33 (ink #FFFFFF) | #D9DBE0 (ink #0C0D10) | grafite |
| `--s` fora de matéria | #EEEEEA | #1A1B1F | |
| certo / certo-bg | #0A7550 / #E2F6EE | #2FD39A / #0F2A22 | só certo |
| errado / errado-bg | #B3302A / #FCEAE7 | #FF7B6B / #2E1714 | só errado |
| aviso / aviso-bg | #8A6200 / #FBF1DA | #F5C451 / #2A2312 | só aviso, pegadinha, pausa |
| cad-papel / cad-tinta / cad-borda / cad-caneta | #FBF7EA / #1C2F74 / #E6DCC0 / #C0392B | #1C1B18 / #EFE8CF / #34312A / #FF8A7A | caderno (conta à mão) |
| lado (menu) | #FFFFFF | #131418 | |
| verde-marca | #1A8038 | #4CC46E | marca (nunca ao lado do verde de Bio) |
| cad-marca (marca-texto) | #FFE36E | rgba(255,214,90,.28) | resultado da conta |

Sombras: `--sombra` 0 1px 2px rgba(21,25,51,.05), 0 8px 22px rgba(21,25,51,.06) (escuro: fio interno 3% + 0 8px 24px preto .22); `--sombra-alta` 0 2px 6px .08, 0 18px 48px .14 (escuro .5); `--sombra-folha` 0 1px 2px .04 (escuro nenhuma); `--sombra-tema` 0 1px 2px .04, 0 10px 26px -18px .22. Foco de campo: anel 3px de `--c` a 22% + borda `--t`. Seleção: `inset 0 0 0 1px` na cor do estado. Borda primeiro: sombra nunca substitui a borda.

### Matérias (paleta do dono, `docs/cores/paleta.json`; `materias.ts`, conferido por `unificacao.test.ts`)
| Matéria (id) | Principal `--p` | Texto claro `--t` | Texto escuro | Fundo claro `--s` | Fundo escuro | Sobre principal | Botão claro `--c`/`--ink` |
|---|---|---|---|---|---|---|---|
| Biologia (bio) verde-folha | #3FA535 | #138404 | #51A948 | #E3FCE0 | #173613 | #17181C | #138404 / branco |
| Química (qui) magenta | #D31A8D | #D31A8D | #F65BB0 | #FFEEF5 | #471D33 | #FFFFFF | #D31A8D / branco |
| Matemática (mat) azul-marinho | #1F3FA6 | #1F3FA6 | #6B93F6 | #EEF4FF | #1D2C51 | #FFFFFF | #1F3FA6 / branco |
| Português (por) roxo | #8A3FD1 | #8A3FD1 | #B679FC | #F6F0FF | #35244A | #FFFFFF | #8A3FD1 / branco |
| Física (fis) laranja | #F27700 | #B2580D | #F27700 | #FFF0E8 | #482206 | #17181C | #F27700 / #17181C |
| Geografia (geo) azul-petróleo | #0F6E7A | #0F6E7A | #59A0AB | #DCFAFF | #00353B | #FFFFFF | #0F6E7A / branco |
| História (his) marrom couro | #75451D | #75451D | #B77B4C | #FFF0E6 | #472302 | #FFFFFF | #75451D / branco |
| Inglês (ing) vermelho-cereja | #AC002A | #AC002A | #FE3E3A | #FFEFEF | #4B1D1F | #FFFFFF | #AC002A / branco |
| Filosofia e Sociologia (fs) amarelo-ouro | #E8B616 | #8C6C02 | #E8B616 | #FFF3D5 | #3B2B00 | #17181C | #E8B616 / #17181C |

- Escopo `.m-<id>` (injetado por `EstiloMaterias`); ao entrar na matéria a casca ganha `.em-materia .m-<id>` e o site inteiro assume a cor (menu, abas, onda, anel, título, botões, barras, faixa).
- No escuro: `--c` = `--t` = texto escuro, `--ink` #17181C. `--sv` = 13% de `--c` sobre a folha; `--sv2` = 7%.
- Uso: `--p` barras, anéis, pontos; `--t` todo texto colorido (nunca `--c`); `--s` etiqueta do tema ativo, item ativo do menu, fundos de destaque; `--c`/`--ink` botão. Trilho de barra neutro (`linha`). fs no claro: barra amarela com contorno 1px no tom de texto.
- Azul "todas as matérias" (só no Início, não é cor de matéria): `--misto-a` #E3EBFB/#18233D, `--misto-b` #EEF3FD/#131B2E, `--misto-borda` #D3DFF7/#26324F, `--misto-btn` #12306F/#9DB7F6 (letra #FFFFFF/#0C0D10), `--misto-t` #1C3FC4/#A8C0FF.

## Tipografia
Guia do dono `docs/fontes/Guia-tipografico-APRENDICE.pdf`. Fontes servidas pelo site (`app/src/assets/fontes/*.woff2`, OFL; `@font-face` em `base.css`); papéis em `tipografia.css` (carregado por último). Uma fonte por papel; nunca peso < 400 em texto; nunca duas sem serifa na mesma tela.

| Papel (variável) | Fonte | Peso | Celular (≤700) | Computador (>700) | Entrelinha |
|---|---|---|---|---|---|
| Título da matéria (`--fs-materia`) | Dancing Script | 700 | 42px | 54px; 62px ≥1700; 70px ≥2200 | 1.05 |
| Título da tela (`--fs-tela`) | Familjen Grotesk | 700 | 25px | 32px | 1.15, -0.02em |
| Seção/bloco (`--fs-secao`) | Familjen | 700 | 19px | 21px | 1.2 |
| Tema e conteúdo (`--fs-tema`) | Familjen | 600 | 15px | 17px | 1.3 |
| Texto (`--fs-texto`) | Familjen | 400 | 16px | 16px | 1.5 |
| Secundária (`--fs-info`) | Familjen | 400 | 13.5px | 14px | 1.4 |
| Explicação da correção e teoria (`--fs-expl`) | Literata | 400 | 16.5px | 17px | 1.6 |
| Conta à mão (`--fs-mao` / `--fs-mao-grande`) | Caveat | 500 | 21 / 24px | 24 / 26px | 1.35–1.55 |
| Botão (`--fs-botao`) | Familjen | 600 | 15px | 15px | 1 |
| Login | DM Sans | — | só na tela de entrada | | |

- Dancing Script: só o nome da matéria (máx. 2 palavras, nunca < 24px). Caveat: só conta e fórmula do caderno. Literata: só texto longo da correção e da teoria.
- Rótulos/etiquetas: 600 no tamanho secundário; caixa alta só em rótulos curtos (áreas 13px 0.08em, "SUA RESPOSTA"). Números de tempo/placar/porcentagem tabulares.

### Fração, notação e conta × texto (`logica/fracao.ts`, `notacao.ts`, `ui/Fracao.tsx`; testes `fracao`, `notacao`, `motorConta`)
- **Fração sempre empilhada** (`'frac'` desligado): barra 1,5px na cor do texto, 0,86em; em texto corrido 0,8em sem abrir a entrelinha. Vale para "/", "÷" e " / " ("6√5/5" = (6√5) sobre 5). Ficam na linha: datas, unidades ("km/h"), pares ("A/a"), versos, alternativas ("A / B"). Texto original escondido para leitor de tela.
- **Nuclídeo não é fração**: "207/82 Pb" vira índices à esquerda (massa em cima, Z embaixo, 0,62em), só quando o de baixo é o Z do símbolo.
- **Notação**: "10^−2", "SO4^2−" sobem; "V_R", "h_{máx}", "a1" descem; fórmula química com índice e carga automáticos (0,66em) só quando todos os símbolos são elementos.
- **Conta × texto** (`contaEhTexto`, `comecaComConta`; regras detalhadas no código e nos testes): em Por, Ing, His, Geo e fs a "conta" de um passo é sempre texto; nas outras, trecho citado, frase e frase explicativa com poucas expressões são texto; linha que **começa** com conta (ou tem equação de seta entre fórmulas) continua Caveat. Texto sai em Familjen 400 16px sobre `folha2` com fio de 3px à esquerda.

## Formas e medidas
- Cantos (`base.css`): `--r-item` 9 (menu), `--r-p` 10, `--r-ctl` 11 (botões, campos), 12 (alternativas, blocos internos), 13 (botão grande), `--r` 14 (folhas), `--r-bloco` 16, `--r-dest` 18 (destaques), pílula 20; etiqueta 8. Borda 1px em superfícies, 1.5px em controles de escolha.
- Espaços: 4, 8, 12, 16, 22 (bloco), 28 (grade/seção). Curva `--curva` cubic-bezier(.2,.7,.2,1).
- Página: `--pag-max` 1440px, padding 22/32/48 (14/16/32 até 700; +68px das abas no celular); `--pag-estreita` 880px (escada). **≥1700px: 1680px, margem 40px; ≥2200px: 1920px, margem 48px** (todas as abas). Telas de uma coluna usam a coluna das outras (título no mesmo x).
- Breakpoints: 2200, 1700 (telas grandes), 1250, 1180 (menu → trilho), 1101 de área útil (questão em 2 colunas), 1100, 900, 700 (margens 16px), 640 (abas do celular), 520, 480, 420.

## Componentes

### Botões
| Tipo | Altura | Canto | Padding | Cor |
|---|---|---|---|---|
| Primário | 46px | 11 | 0 20 | `--c`/`--ink`, sombra 1px |
| Pequeno | 38px | 10 | | |
| Grande | 56px | 13 | 0 30 | |
| Capa do treino geral | 66px, mín. 380px (largura toda até 899) | 16 | 16 40 | |
| Secundário | 46px | 11 | 0 20 | tinta a 7% (hover 11%), sem borda |
| Fantasma | 46px | 11 | 0 12 | transparente, `lapis`; hover `folha2` |
| Perigo | 46px | 11 | | `errado`, letra branca |
| Ícone | 40×40 | 11 | | folha, borda 1px; marcado `--c` + `--sv` |
Hover brilho +5%; pressionar desce 1px; foco contorno 2px `--t` afastado 2px; desabilitado 45%.

### Outros
- **Campo**: 48px, canto 12, borda `campo-borda`, rótulo 600 acima; foco borda `--t` + anel 3px. Erro em bloco `errado-bg`.
- **Chip**: pílula 20, borda `linha`, `lapis` 500 14.5px, padding 7/14; selecionado fundo `tinta`, letra `papel`.
- **Etiqueta**: canto 8, 13px 600; neutra `malha`/`lapis`, da matéria `--sv`/`--t`, semânticas `*-bg`/cor.
- **Folha/cartão**: `folha`, borda 1px `linha`, canto 14 (18 nos destaques), padding 20–22 (14–18 compactos); sem sombra por padrão; clicável: hover `borda2` + sobe 1px. Destaque da matéria: lavagem diagonal de `--c` 14–16% até 70% da largura, borda com 30% de `--c`.
- **Ícones de interface**: Lucide, traço 1.75, 18–22px, sem preenchimento.

## Casca
- **Menu lateral** (>1180px): 244px, fundo `lado`, borda 1px, `--sombra-lado`; padding 18/12/12. Logo 150×48; botão recolher 34px (canto 9). Itens 38px, padding 9/12, canto 9, ícone 20px a 12px do texto, 15px 500 `lapis` (nome longo quebra em 2 linhas, nunca cortado); hover tinta 4%; ativo 600 `tinta` sobre tinta 7% (na matéria: `--s` e `--t`). Grupo: 14px 500 `fraco`, ponto 6px, padding 16/12/5. Rodapé: meta da semana (anel 44px, padding 9/12/7; "0 de 150", "meta da semana", "hoje 0 · ontem 0") e Configurações. Onda verde e pontilhado no pé, nunca cortados.
- **Trilho** (641–1180px e menu recolhido): 64px, padding 14/8, itens 40px, só ícones; botão de 34px esconde/mostra (preferência salva no navegador).
- **Menu no estudo**: continua visível na questão, treino, flashcards e simulado; some só em "Tela cheia" (Esc sai).
- **Topo**: 61px + linha 1px (57px até 640), padding 0 28 (0 12), 14px entre peças. Busca até 520px (mín. 200), 40px, canto 10, ícone 17px, `Ctrl K` só >1180; até 640 a busca tem 44px mín. e quebra em 2 linhas (15px, 1.2), sem reticências. Resultados: cada grupo uma vez, na ordem do melhor resultado. Dia/Noite segmentado (padding 3, canto 10, botões 6/11 canto 7, 14px 500; rótulos somem ≤900). Perfil: avatar 32px `tinta` + nome 15px 500 (nome some ≤900; perfil vai para as abas ≤640).
- **Abas do celular** (≤640): 68px, 5 destinos, botão 56px, pílula 56×32 (canto 16) com ícone 22px, rótulo 12px 500; ativa tinta 9%.

## Telas

### Início (`telas/Inicio.tsx`, `inicio.css`; referências `docs/referencias/aba-principal/`)
- Coluna `--pag-max`, seções a 40px. Cabeçalho "Vamos avançar nos estudos?" 700 40px (28 ≤700) + apoio 21/18px `lapis`. Títulos de seção em `--fs-tela`.
- **Suas matérias**: faixa das 9 (Bio, Quí, Mat, Por, Fís, Geo, His, Ing, Fil e Soc), rolagem lateral + roda + setas 46px (`ui/rolo.ts`), máscara 72px; cartão mín. 192px (150 ≤640; alarga para o nome não quebrar), padding 20/20/22, canto 16, borda 1px; círculo 150px (116 ≤640), objeto a 108% do círculo; nome 700 `--fs-secao` a 16px; barra 9px (trilho #E4E4E1/#2A2C33, preenchimento `--p` da própria matéria).
- **Destaques** (1,17 : 1, gap 28; empilhados ≤1100): canto 18, altura mín. 300, padding 34/36, arte absoluta à direita (≤640 sobe para cima). **Treino geral** (degradê `--misto-a`→`--misto-b`, borda `--misto-borda`; título 40px; botão `--misto-btn` com ícone embaralhar; "Personalizar" em `--misto-t` escolhe 10/15/20/30 questões por rodada, nunca a matéria; arte 33% do cartão, 160–300px). **Continue de onde parou** (fundo `--s`; rótulo caixa alta 16px 700 `--t` — exceção da referência; matéria 40px; "N de M questões • Faltam K"; barra 10px `--c`; botão "Continuar estudo" mín. 286px; arte 34%, 150–220px). Sem histórico: "Comece por aqui".
- **Seu desempenho por matéria | Hora de revisar** (1,08 : 1, fio 1px com 44px de cada lado; empilhados ≤1100): período (7 dias, 30 dias, desde o começo; 46px, canto 10); barras verticais (eixo 100/50/0, barra até 56px em `--p`, nomes Bio, Quím, Mat, Port, Fís, Geo, Hist, Ingl, Fil/Soc; sem resposta "—"); "N questões resolvidas | N dias de constância"; "Seu destaque" com ponto `certo`. Direita: 3 matérias de menor acerto (arte 76px, nome 22px 700, "Revisar →" `--misto-t`), botão "Revisar meus erros" `--misto-btn`.
- **Atalhos** Flashcards e Simulados: folhas 108px, canto 16, borda `borda2`, ícone 38px, título 25px 700, apoio 18px.
- Botões grandes do Início 18px. **1440→1920px cresce contínuo** até a escala da referência: título 40→56, seções 32→44, nomes 21→25, destaques 40→56, apoio 18→26, botões 18→21 (altura 60→66), cartão 192→212, círculo 150→175, "Hora de revisar" arte 76→92 e nome 22→30; arte do Treino geral até 400px.
- Números: `logica/inicio.ts`, `logica/estatisticas.ts`.

### Matéria
- **Capa da matéria** (`CapaMateria` em `telas/Materia.tsx`; capas do dono `docs/capas/<m>/REF-CLARO|REF-ESCURO.png`): faixa 3:1 com altura 120–300px (`--H`), canto 18, fundo `--s` (escuro com leve degradê no alto à esquerda); cabeçalho à esquerda (nome em Dancing Script, pode quebrar só aqui; apoio 16px "N temas · questões reais, todas com a fonte" ou "· questões em preparação", `subMateria`); arte à direita = um WebP por matéria montado por `app/scripts/capas.py` a partir das peças PNG (originais intactos), caixa em `src/dados/capas.ts`; ≤520px arte até 100px de altura. **Sem sombra de chão** (09/11).
- Depois: faixa de temas; **Treino geral + Meu progresso** lado a lado; atalhos (continuar, flashcards, revisão, simulados; colunas mín. 230px, uma ≤700); folha das áreas.
- **Treino geral (capa)**: arte à direita (em cima ≤899); 3 contadores (Questões de prova, Completar a frase, Flashcards; até 170px, ~170×102, 4 linhas, gap 10, padding 10/12, canto 12, barra 4px); botão 66px mín. 380px; "15 itens por rodada…" 8px abaixo. Arte 170px (150 ≤1250; some entre 1101 e 1500; 240×190 ≤700).
- **Meu progresso** (`.mp`, `telas.css`): grade 1,75fr : mín. 300px (>1100; empilha ≤1100; só ele quando não há treino); padding 18/22, canto 18, borda `linha`; título 700 17px com fio embaixo; total 34–42px 700 + 15px; barra 10px segmentada (gap 3); legenda 14px com ponto 10px; números 24px 700 + 14px (gap 22); gráfico de colunas 64px de altura, colunas até 22px em `--p` a 55% (hoje `--p` cheio), rótulos 12px 500, legenda 13px; ≤700 padding 18/18/20.
- **Faixa de temas**: cartões 196px (216 ≥1700; 232 ≥2200; 150 ≤640), gap 14, padding 8/8/18, canto 16, `--sombra-tema`; área do ícone 128px (100 ≤640) com ícone 112px; nome 2 linhas fixas (2,6em), nunca cortado: se pediria 3, o cartão alarga de 10 em 10px (`--ft-w`, medido em `FaixaTemas`); barra 4px no pé; hover sobe 2px. Atual: borda `--p` 60% + anel 3px. Compacta (dentro de tema/conteúdo): 150px, padding 4/4/16, área 84px, ícone 76px. Rola com encaixe, roda do mouse (para baixo = direita; nas pontas volta a rolar a página), máscara 64px, setas 40px.
- **Folha das áreas**: padding 8/28/18, canto 16 (14 ≤700); rótulo caixa alta `--t`; linhas em colunas mín. 340px (uma ≤900): ícone 72px (56 ≤700) + nome 17.5px 600 (16 ≤700) + barra 6px + apoio 14px + % 16px 600 `--t`.

### Tema
"‹ Todos os temas" (padding 8/10/8/4); capa do tema (padding 28/30, 20/18 ≤700; canto 18; lavagem): ícone 100px a 22px do texto, "Tema N de M · Matéria", título `--fs-tela`, números; 3 barras por nível (Básico, Intermediário, Avançado; gap 18, barra 8px); ações a 24px: Começar (60px, canto 14, padding 16/34), "N questões de K conteúdos · do mais fácil ao mais difícil", "Teoria em cartões · N" (46px, canto 11; largura toda ≤700), "Revisão" (abre a essencial). "O que você vai encontrar" (padding 18/22/10, canto 16): ponto 8px `--p` + nome + resumo + "feitas/total" + barra 6px + seta; pé com tema anterior/próximo.

### Questão
- Barra 52px presa no topo da área: "‹ Voltar", ícone da matéria, "Matéria · Tema · nível · N de M" com progresso 2px; ajuda de teclado; cronômetros TOTAL e QUESTÃO (28px, canto 8); pausa 32px; Tela cheia. ≤900 saem os rótulos TOTAL/QUESTÃO e o texto usa até 2 linhas; ≤520 sai o ícone (e Tela cheia no simulado); ≤420 sai o tempo total.
- Cartão único (padding 16/16/0, 14 ≤700; canto 18): etiquetas + marcador 36px; print em papel branco (canto 12) com "Ampliar" + fonte; no escuro brilho 0,88. Largura do print (`useLarguraPrint`, >700px): estreita e centra quando print + A–E + Confirmar cabem sem ficar < 90% do natural; máx. 1,3× (1,05× quando medido pelas linhas, ~25px por linha); mín. 320px.
- Resposta presa ao pé: "SUA RESPOSTA" + 5 letras 50px (canto 12, gap 10, borda 1.5px; ≤700 de borda a borda acima das abas, sem rótulo); certeza segmentada 36px; Dica; Confirmar 54px mín. 180 canto 13. Selecionada: borda `--c`, fundo `--c` 11%, anel 3px; riscada 60% tachada; com texto viram linhas empilhadas. Depois: "Correta"/"Sua", anterior (40px) e Próxima.
- Painel Resolução · Teoria · Fonte (abas 45px, corpo 16/20/20): embaixo até 1100px de área útil; ≥1101 à direita (1,45 : 1 mín. 360; >1280 de área 1,55 : 1 mín. 380), preso e rolando por dentro. Conteúdos relacionados em 2 colunas com ponto 8px, nomes inteiros.
- **Simulado**: mesmo cartão; folha de respostas embaixo; ≤520 contador numa linha 14px. Lista: folha por instituição (canto 16), linhas com ícone 56px (44 ≤640).

### Correção em 4 blocos (`ui/Resolucao.tsx`, `correcao.css`)
Veredito ("Você marcou B. A resposta é A." + gabarito oficial), depois, nesta ordem, blocos canto 12 padding 16/18, título Familjen 600 16px, texto Literata `--fs-expl` 1.6:
1. **Por que eu errei** — `res.erradas[marcada]`, fundo `errado-bg`, título `errado`; some se acertou.
2. **Resposta correta** — `res.resposta` (600 17px) em `certo-bg`; dentro, **A pegadinha** (`res.armadilha`) em `aviso-bg`.
3. **Resolução animada**.
4. **Por que as outras estão erradas** — `<details>` fechado; letra em quadrado 28px; não repete a do bloco 1.
Outros campos de `res/` não aparecem; sem resolução, aviso "em revisão"; fonte no pé.

### Resolução animada (motor único: `logica/motorConta.ts`, `ui/motorAnima.ts`, `ui/ResolucaoAnimada.tsx`)
- Dados: `res.quadro` ou `res.passos` (número em círculo 28px; "faz" 600 16px; "porque" Literata). Caderno `cad-papel`, grade 24px, canto 14, passos tracejados; conta Caveat 500 `--fs-mao-grande` (`--fs-mao` ≤480). Sinais que a Caveat não tem (√ → ≈ ≤ ≥ ≠ Δ π…) em traço de caneta (`ui/maoGlifos.tsx`).
- Marca-texto `cad-marca` no resultado (após o último =, ≈ ou →, até 36 caracteres) ou no `destaque`, casando termo inteiro.
- Quebra de linha só após seta, vírgula, ponto e vírgula, dois-pontos, conjunção ou antes de "=" do meio; nunca dentro de parênteses nem antes do último "=".
- Antes: faixa "Assistir resolução" (botão 13/22, sem sombra), "N passos, escritos à mão na sua frente", "Ver sem animação". Tocando: barra presa em `top: --topo + 60px` (z 14) com Tocar/Pausar, anterior, próximo, velocidade 0,75/1/1,5/2× (salva em `ra-vel`), "Passo i de n" (i/n ≤480), Pular para o final, Recomeçar (botões 36px canto 9). Espaço toca/pausa, ← → mudam de passo (sem mudar de questão). Reduzir movimento: estado final direto.
- **Conta** (Mat; conta de Fís/Quí): termo atravessa o "=" em arco (`cad-caneta`) trocando o sinal; fator passa dividindo/multiplicando; multiplicação cruzada na diagonal; cancelamento riscado (2px, −12°); resultado com pulo só se a conta conferir. Mesma letra, halo do papel.
- **Processo** (Bio, Quí, Fís): reação, fluxo, cadeia, pares, contraste, etapas (ponto 9px, fio 1,5px); peças canto 9, borda 1,5px. Humanas e Português: texto. DOM final = texto dos dados (`motorConta.test.ts`).

### Outras telas
- Nada cortado: objetivo do degrau e nome da instituição (provas-alvo do Perfil) quebram de linha, sem reticências. Desempenho: as duas colunas terminam juntas. Treino de matéria sem questões leva à matéria com o aviso "em preparação".

### Filtro de região (pedido do dono, 09/11/2026; `ui/FiltroRegiao.tsx`, `logica/regiao.ts`, `estilo/regiao.css`)
- Regiões de prática: Nacional (ENEM), **São Paulo (separado)**, Sudeste (RJ, MG, ES), Sul, Nordeste, Norte, Centro-Oeste. Cada questão do banco tem `rg`/`uf` (gerados por `converte.py: marca_regioes`).
- **Região das minhas provas**: automática pelas provas-alvo (todas de SP → São Paulo; mistura → as regiões delas; o ENEM entra sempre junto) ou escolhida à mão (`pref.regioes`, estado v6). Seletor no Perfil e no "Trocar" do filtro.
- **Chips** "Minha região · Todas as regiões · <cada região>" (chip do sistema: pílula 20, 14.5px 500, 7/14; selecionado tinta/papel; compacto 5/12 14px nos treinos) no topo do conteúdo (Escada, abaixo do título), do tema (antes da capa), da revisão (aba Questões) e dos treinos (abaixo da barra, só antes da 1ª questão e no fim da rodada; trocar refaz a rodada). Embaixo, frase 14px `lapis` "Minha região: **São Paulo e ENEM**, pelas suas provas-alvo." + "Trocar" (600, sublinhado). Filtro vale para o site inteiro (`pref.filtroRegiao`).
- ≤700px: os chips ficam numa linha só, rolando por dentro (sangram até a borda, a página não rola para o lado).
- **Aviso** (região com menos de 5 questões ali): faixa `aviso-bg`/`aviso`, canto 12, padding 10/14, 14px, com "Ver de outras regiões (N)". Região sem nenhuma questão: a lista vira a de todas as regiões, com o aviso; nível sem questão da região treina com as de outras regiões ("N questões de outras regiões"). Nunca sem questão.
- Contagens dos conteúdos (lista do tema, Escada, busca, "Continue de onde parou") seguem o filtro. Provas e faculdades e Simulados abrem em "Minha região", com o chip São Paulo.

### Flashcards
- Lista: capa lavada com números (revisar hoje / novos / firmes; gap 28, mín. 76; descem ≤700), Começar 60px; "Área" (chips 48px, ícone 28px) e "Tema" em lista (ícone 36px, barra 6px).
- Sessão: cartão até 920px centrado, padding 30/40/34 (18/16/20 ≤640), canto 20; faixa do tema (ponto 8px, padding 8/12, canto 12); caixa de resposta mín. 118px; Corrigir 52px, "Não sei", atalho de teclado (some no toque). O mesmo cartão no treino geral.
- Caderno de fórmulas: papel creme pautado a cada 28px (tinta 10%), canto 10, Familjen 16px.

### Revisão em slides e revisão essencial (`revisao.css`, `telas/RevisaoSlides.tsx`, `ui/revisao/`)
- **5 tempos** no topo (pílulas `--r-p`, padding 8/10, número 24px; atual em `--sv`/`--t` com número `--c`; ≤900 só o atual mostra o nome).
- **Slide**: padding 22/26/24, canto 18, `--sombra-tema`; título `--fs-tela`; texto Literata `--fs-expl`; destaque com fio 3px `--p` sobre `--sv2`; fórmula em `cad-papel` Caveat `--fs-mao-grande`; com visual e ≥860px de largura útil, 2 colunas (gap 28). Palco do visual: padding 12/14/14, `folha2`, controles 32px. Fotos só com crédito visível.
- "Lembrar sem olhar": caixa tracejada 1.5px `--p` 55% sobre `--sv2`; opções canto 12. Navegação: pontos 8px (atual 22px `--p`; marcados com anel `aviso`); ≤520 botões só ícone 46px.
- **Essencial** (8–12 telas por tema): termômetro (peso em 3 traços 16×6px `--p`), mapa mental, uma tela por conteúdo (pontos 8px `--p`, pegadinha em `aviso-bg`, "Aprofundar" fechado), Questão Aprendice (alternativas 34px + texto, canto 12), conexões. Teclado ← → e Esc.
- **Mapa mental** (componente do sistema): <640px em coluna (eixo 2px `--p`, nós canto 14 borda 1.5px sobre `--sv2`); ≥640px radial, altura 460–560px, centro em pílula `--c`/`--ink` (máx. 220px), nós 150–210px em `folha`, ramos 2,5px `--p` desenhados em 0,7s, ligações tracejadas 5/5.

### Agenda e painel de domínio (comando 24, fase 2; `ui/revisao/AgendaRevisao.tsx`, `ui/revisao/PainelDominio.tsx`, `estilo/dominio.css`, regras em `logica/revisao.ts` e `logica/dominio.ts`)
- **Regra**: errou, chutou ou usou dica → a questão entra na revisão e volta amanhã; cada acerto na data marcada é um acerto espaçado (escala 1, 3, 7 dias); **sai depois de 3 acertos espaçados** (`SAIDA`). Erro com certeza vem primeiro na fila. Com a data da próxima prova-alvo (`perfil.datasProva`, estado v7), o intervalo vira o menor entre a escala e uma fração do que falta (30% até 30 dias, 7,5% a partir de 365, log no meio), nunca depois da véspera. Flashcards e revisão em slides encurtam do mesmo jeito. Migração v6→v7: até `revisaoDesde` vale a regra antiga (a etapa antiga vira os acertos; o dia marcado não muda).
- **Agenda** (topo da Revisão, todas as abas): folha `.bloco`, grade texto | gráfico (1fr : 300–420px, gap 16/28; empilha ≤1100). Título `--fs-secao` 700 ("ENEM em 2 de dezembro de 2026" ou "Sua agenda de revisão"); apoio `--fs-info` `lapis`, máx. 62ch; botão secundário pequeno "Trocar a data"/"Informar a data da prova" (largura toda ≤520) leva a `/perfil#datas-prova`. Gráfico de 14 dias (7 ≤520, e a legenda conta os mesmos 7): colunas 64px em trilho tinta 5% (canto 4), barra até 22px em `--p` 55% sobre a folha, hoje `--p` cheio (como o "Meu progresso"); número 12px 600 em cima; dia da semana + data 12px; dia da prova em `aviso-bg` com contorno `aviso` e rótulo "Prova"; dias depois da prova a 45%.
- **Aba Domínio**: resumo (folha canto 18, padding 22/28): Domina · Aprendendo · Esqueceu em 30–40px 700 com ponto 10px (rótulo `--fs-info`), "No dia da prova" (média de R = e^(−t/S) no dia, supondo as revisões já marcadas feitas até a véspera — `projetaAte`; só com data) como número secundário 24px `lapis`, separado por fio a 28px; barra 10px empilhada das questões feitas (gap 3); legenda `--fs-info`. Por matéria (`.m-<id>`): nome `--fs-secao` 700 com ponto, números com ponto 8px (14px 600), previsão em `--t`; temas em `<details>` (linha padding 12/4, gap 16, fio `linha`, seta em traço 1.75px), nome `--fs-tema` 600, barra 6px (120–220px) e números em coluna de 136px; conteúdos com `ponto-sub`, 15px, "ainda não feito" `fraco` `--fs-info`. Espaços só da escala (8/12/16/22/28). Cores: domina `--p` (escuro `--t`), aprendendo `--p` 42% sobre a folha (escuro `--t` 62%), esqueceu `aviso`. ≤700: barra desce para a 2ª linha.
- **Perfil · Datas das provas**: uma linha por prova-alvo (nome `--fs-tema` 600 + instituição `--fs-info`; campo de data 48px canto 12, borda `campo-borda`, 220px; empilha ≤520); frase "A agenda conta a partir de …: faltam N dias."
- Abas da Revisão: Questões · Flashcards · Marcadas · Conteúdos · Domínio (2 colunas ≤520). Etiqueta da questão vencida: "Errou com certeza" (`err`), "N de 3 acertos" ou "Vencida" (`aviso`).

### Hoje e Escudo TRI (comando 24, fase 3; `telas/Hoje.tsx`, `estilo/hoje.css`, regras em `logica/hoje.ts`)
- **Regra da ordem**: cada conteúdo (subtema) com algo a fazer recebe nota = (0,15 + 0,85 × peso relativo) × (0,2 + fraqueza) × (0,2 + risco) (× 1,5 com fácil errada no Escudo). **Peso** = fatia das questões de cada prova-alvo no banco que são do conteúdo, média entre as provas-alvo com ≥ 20 questões (`catalogoDaQuestao` em `dados/provas.ts`); sem nenhuma, a frequência no banco da região. **Fraqueza** (memória da fase 2): esqueceu 1, errou e não acertou 0,8 (+0,2 com certeza), 1–2 acertos espaçados 0,4, domina 0. **Risco**: 1 − R(hoje); errada por último 1; vencida no mínimo 0,5. Nunca estudado: fraqueza 0,5 e risco 0,6. Questões de cada conteúdo, nesta ordem: fáceis erradas (Escudo), vencidas (erro com certeza primeiro), esquecidas, até 3 novas (mais fáceis primeiro; só em conteúdo novo ou com fraqueza ≥ 0,3). Tudo pelo filtro de região, com reserva.
- **Sessão**: 15, 25 ou 40 min (`pref.minutosHoje`, padrão 25); tempo por questão = mediana do aluno (60–360 s; sem 10 respostas, 180 s); no máximo 6 por conteúdo. Fica salva em `sessaoHoje` (campo opcional, sem mudar a versão; refaz no dia seguinte) e roda em `/hoje/sessao` pelo mesmo componente do Treino geral (`RodadaQuestoes`).
- **Tela**: título `--fs-tela` + apoio; chips de região; folha da sessão (canto 18, padding 22/28, 18 ≤700): título `--fs-secao` 700 (abaixo do `h1` da página) "N questões · cerca de M min", apoio `--fs-info`, "Tempo de hoje" + chips (selecionado tinta/papel); botão grande Começar/Continuar (mín. 220px; largura toda ≤700; vai para baixo ≤900). **Escudo TRI** (só com ENEM nas provas-alvo): folha canto 18; ícone escudo 22px em quadrado 40px tinta 7% canto 11; título `--fs-secao`; botão secundário "Revisar as fáceis (N)" (um só botão principal na tela: Começar); números 30px 700 (24px em 3 colunas ≤700, alinhados no alto) — fáceis erradas em `errado`, feitas, conteúdos com o básico garantido (≥ 3 fáceis feitas e nenhuma errada); lista com ponto 8px, "N erradas de K fáceis feitas" e etiqueta `aviso` "Acertou a difícil e errou a fácil". **A ordem de hoje**: folha, linhas com número em círculo 28px (`--sv`/`--t`; fora da sessão tinta 6%/`lapis`), ponto 8px + nome `--fs-tema` 600, "Matéria · Tema · x% das questões das suas provas", motivos em etiquetas (fáceis erradas `aviso`, errou com certeza `err`, voltam hoje, esquecidas, ainda não estudado, "Cai muito…" da matéria), à direita "N questões / cerca de M min"; separador "Se sobrar tempo". Rodapé "Como a ordem é feita".
- Acesso: menu (grupo Estudo, primeiro item, ícone calendário) e botão "O que estudar hoje" no título da Revisão (celular).

## Ícones e ilustrações
- **Ícones de tema** (fonte: `docs/icones/<m>/<id>-<nome>.png`, intactos; onde entram: `docs/icones/ONDE-USAR.md`): `app/scripts/converte.py` + `icones_tema.py` geram `public/conteudo/<m>/ic/<id>.webp` (320px, WebP q84, 8–29 KB, fundo apagado, objeto 100% opaco, sem franja, até 88% do raio) e `src/dados/iconesTema.ts`. Todas as 9 matérias (B01–B12, Q01–Q12, M01–M17, P01–P12, F01–F12, G01–G12, H01–H08, I01–I04, L01–L08 e S01–S08); únicos ícones de tema do site.
- Círculo claro (`IcTema`, `icones-tema.css`) do tamanho do lugar: faixa 112px, compacta 76px, capa do tema 100px, folha das áreas 72/56px, filtros dos flashcards 36/28px, busca 32px. Gradiente do branco a `--s` (escuro: #F1F3EF com 14% de `--p`); o ladrilho de trás sai.
- **Sem sombra em nenhum ícone** (09/11): `box-shadow: none` nos círculos (`.ic-tema`, `.circ-mat`), `filter: none` nas artes (`.ilu-mat`, `.ic-materia`, `.capa-ilu`, `.bv-ilus`, `.in-cont-arte`); capas sem sombra de chão (`SEM_SOMBRA` em `capas.py`).
- **Hover/foco** (09/11): o ícone **salta 10px para cima** (scale 1.04) e fica no alto enquanto o mouse estiver em cima; nos pequenos (filtros, áreas, busca) 4px. Transição 0,38s cubic-bezier(.34,1.56,.64,1). Só em aparelho com mouse (`hover: hover`) ou foco pelo teclado; toque sem efeito; reduzir movimento: sem salto.
- **Ícone da matéria** (`ui/IconeMateria.tsx`): um objeto das peças das capas, `public/conteudo/capas/ic-<m>.webp` (320px) por `scripts/capas.py`.
- **Subtema sem ícone**: ponto `.ponto-sub` 8px em `--p`, 8px antes do nome, centrado na primeira linha (lista do tema, "Teoria desta questão", relacionados, faixa do flashcard, busca).
- Sem animação nos ícones (princípio 8). Ilustração nunca recortada em círculo à força: `object-fit: contain`.

## Corrigido na compactação (09/11/2026, texto antigo × código)
- Título da matéria: era 36/44px; o código usa 42/54px (62 ≥1700, 70 ≥2200).
- Telas grandes: era 1880px/44px e 2280px/56px; o código usa 1680px/40px (≥1700) e 1920px/48px (≥2200).
- "inicio-max 1560px, 12 colunas": não existe mais; o Início usa `--pag-max`.
- Ícones: saíram a sombra dos círculos, o contorno, o "cresce 6% e sobe 3px" e a sombra de contato das capas e dos ícones de matéria (commit ed144a47, decisão de 09/11). Com "reduzir movimento" não há mais contorno de 2px (fica anulado pelo `box-shadow: none`).
- Rótulo do grupo do menu: o código usa 14px 500 (o texto também dizia 13.5px 600).
- Faixa de temas: a altura do cartão vem do conteúdo (o texto antigo dizia 204 e 210px).


## Resolução por matéria (dono, 09/11/2026)
- Animada pelo motor único: bio, qui, mat, fis.
- Texto passo a passo (`.cor-texto`, lista numerada; trecho citado em itálico com fio à esquerda na cor da matéria): por, geo, his, ing, fs.
