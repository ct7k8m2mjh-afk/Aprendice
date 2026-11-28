# Auditoria de design — tela "Revisão geral" (commit 0ae9e662)

Auditor separado (princípio 9). Não corrige código; só lista as diferenças em relação ao sistema de design
(`app-atual/design/materia.css`, `fontes.css`, `DESIGN.md`, `app/src/estilo/base.css`, `tipografia.css`, `sistema.css`).

## Como foi conferido
- Código lido: `app/src/telas/RevisaoGeral.tsx`, `app/src/estilo/geral.css`, `AtalhosGeral` em `Materia.tsx`, aba "Revisão geral" em `Revisao.tsx`; comparado com `Tema.tsx`, `sistema.css` (`.tp-capa`, `.tp-bloco`, `.tp-enc`, `.tp-viz`), `revisao.css` (`.es-pegadinha`, `.rs-caixa`), `telas.css` (`.area-cab`), `app.css` (`.campo`).
- Renderizado (Vite local, Playwright) em 390, 768, 1280 e 1440 px, temas claro e escuro: `#/m/mat/geral?t=M04.2`, `#/m/por/geral?t=PK42`, `#/m/fis/geral?t=FK39`, `#/m/fs/geral/filosofia`, `#/m/fs/geral/sociologia?t=SK23`, `#/m/geo/geral`, `#/m/geo`, `#/revisao?aba=geral` (72 capturas) + busca e teclado.

## O que está de acordo
- Sem rolagem lateral em nenhuma tela/largura/tema; nada cortado nas telas da revisão geral.
- Nome da matéria em Dancing Script na cor dela (só `.tit-mat`); demais textos em Familjen Grotesk; Caveat só dentro de fórmulas (`.fm-*`, `.frac-*`, `sup`/`sub`). Nenhum emoji.
- Título "Revisão geral" no mesmo x que o da tela do tema (capa em x = 276, h1 em x = 307 a 1280/1440; 16/35 a 390), mesma ordem de topo (`CabMateria` → "‹ Matéria" → `.tp-capa`).
- Cor da matéria só no escopo `.m-<id>`; claro e escuro corretos (Sociologia em amarelo-ouro, Matemática azul, Física laranja, Geografia azul-petróleo).
- Subtemas com pontinho `.ponto-sub` 8px na cor da matéria, sem ícone. Nenhuma animação (`animation-name: none` em todos os elementos).
- Busca com rótulo visível, `aria-describedby`, `aria-live` com o número de resultados; foco visível pelo anel global (`base.css:121`), chips alcançáveis por Tab.
- Pegadinha e caixa "EM CONSTRUÇÃO" reutilizam `.es-pegadinha` e `.rs-caixa` (tracejado 1,5px, mín. 120px).

## Diferenças encontradas

1. **Item da lista marcado como "atual" sem tópico aberto (celular e tablet, ≤900px).**
   Onde: `#/m/geo/geral` e `#/m/fs/geral/filosofia` a 390 e 768 px (sem `?t=`).
   Está: o 1º tópico ("Origens da Geografia…") aparece com fundo `--sv2`, contorno e nome em `--t`, e recebe `aria-current="true"`, mas o tópico não está aberto (≤900px a lista e o tópico aparecem um de cada vez).
   O sistema pede: realce de "atual" só no item realmente aberto (DESIGN.md, Revisão geral: "atual `--sv2`…"); no celular sem `?t=` nenhum item deve parecer selecionado nem ser anunciado como atual.
   Referência: `app/src/telas/RevisaoGeral.tsx:70` (`mostrado = topico || lista[0]`) e `:164` (`atual = mostrado?.id === t.id`).

2. **Rótulo do capítulo em 13px fixo, diferente do rótulo irmão.**
   Está: `.rg-cap-t { font: 600 13px/1.3 … }`.
   O sistema pede: o mesmo papel tipográfico do rótulo de área da página da matéria (`.area-cab h2`), que o guia tipográfico fixa em `var(--fs-info)` (13,5px) 600 1,3 — "CARTOGRAFIA E NATUREZA" na página `#/m/geo` sai em 13,5px; na revisão geral sai em 13px.
   Referência: `app/src/estilo/geral.css:50` × `app/src/estilo/tipografia.css:49`.

3. **Espaçamento fora da escala (4, 8, 12, 16, 22, 28).**
   - `.rg-est { gap: 6px }` (ícones lido/marcado) — `geral.css:60`.
   - `.rg-limpa { right: 6px }` — `geral.css:27`.
   - `.rg-item { padding: 12px 6px }` e `.rg-cap-t { padding: 12px 6px 4px }` em ≤700px — `geral.css:100-101` (segue o `.tp-enc a` de `sistema.css:287`, mas fora da escala pedida para esta tela).
   - `.rg-viz a .ic { margin-top: 2px }` — `geral.css:94`; `.rg-volta { margin: -4px 0 12px }` — `geral.css:68`.
   - `.rg-item mark { padding: 0 1px }` — `geral.css:59`.
   O sistema pede: só valores da escala (critério desta tela e cabeçalho do próprio `geral.css:4-5`).

4. **Tamanhos e cantos escritos à mão em vez das variáveis do sistema.**
   - Rótulo da busca `font-size: 15px` (`geral.css:20`) — o papel "rótulo de campo" usa `var(--fs-botao)` (`tipografia.css:105`).
   - Campo `font: 400 16px` (`geral.css:24`) — texto de interface é `var(--fs-texto)`.
   - Botão limpar `border-radius: 9px` (`geral.css:28`) — existe o token `--r-item` (9px, `base.css:100`).
   - Destaque da busca `border-radius: 3px` (`geral.css:59`) — fora dos cantos do sistema (`--r-*`).
   O sistema pede: tamanhos pelas variáveis `--fs-*` e cantos pelos tokens `--r-*` (valores iguais hoje, mas deixam de acompanhar se a escala mudar, como já acontece em ≥768px, onde `--fs-tela` passa a 32px).

5. **Tópico aberto fora de vista na lista (computador).**
   Onde: `#/m/mat/geral?t=M04.2` a 1280/1440 px.
   Está: o tópico aberto é o 21 de 112 ("Equação do 2.º grau"), mas a lista começa no topo ("Frações e decimais"); o item realçado só aparece rolando a página.
   O sistema pede: o item atual visível ao lado do painel aberto, como no índice das outras telas da matéria (alinhamento lista | painel).
   Referência: `app/src/telas/RevisaoGeral.tsx:72-80` (só o painel do tópico é rolado/focado).

6. **Texto do link de volta diferente da tela irmã.**
   Está: "‹ Geografia" (nome da matéria).
   Na tela do tema (`Tema.tsx:123`) o mesmo link, no mesmo lugar, diz "‹ Todos os temas". Mesma posição e estilo; só o texto difere. Registrar a escolha no DESIGN.md ou alinhar.
   Referência: `app/src/telas/RevisaoGeral.tsx:108`.

7. **Cartões da aba "Revisão geral" (Revisão): Filosofia e Sociologia com o mesmo ícone.**
   Onde: `#/revisao?aba=geral`, 1280 px.
   Está: as duas linhas usam o ícone `m_fs` (lâmpada) idêntico, lado a lado, sem nada que as diferencie além do nome.
   Não contraria regra escrita (ícone da matéria fs), mas é a única tela em que duas linhas vizinhas têm o mesmo ícone; decisão do dono.
   Referência: `app/src/telas/RevisaoGeral.tsx:293`.

Total: 7 diferenças (1 de comportamento visual/acessibilidade, 5 de sistema, 1 para decisão do dono).
