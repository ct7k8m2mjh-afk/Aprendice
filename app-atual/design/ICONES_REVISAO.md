# Revisão dos ícones — 29/10/2026

Arquivo: `design/icones.js` (cópia do original: `design/icones.js.bak_icones`). Mesma API: `ICO.tema(id)`, `ICO.ui`, `ICO.glifo`, `ICO.ilu`; mesmas chaves.
Folha antes/depois: `/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/comp.png` (temas em 24/32/48 no escuro #0F1529 com degradê do app; claro 32/48; glifos; interface).

## Trocas de ícone
| Chave | Tema | Antes | Depois | Fonte |
|---|---|---|---|---|
| glifo `por` | Português | livro chapado, sem leitura de páginas | livro aberto simétrico, páginas a 50% + contorno | Phosphor `book-open` duotone (MIT) |
| B02 | Bioquímica celular | hexágono com "pernas" (parecia inseto) | enzima com sítio ativo + substrato encaixando (chave-fechadura) | desenho próprio |
| B08 | Neuro, hormônios, imune, repr. | neurônio ilegível (parecia faísca) | cérebro | Lucide `brain` (ISC) + preenchimento duotone |
| B09 | Ecologia | folha (repetia o glifo de Biologia) | duas árvores sobre o solo (ecossistema) | Lucide `trees` (ISC) |
| B12 | Diversidade dos seres vivos | borboleta tosca | borboleta com corpo e antenas | Tabler `butterfly` (MIT) |
| M06 | Exponencial e logaritmo | texto "log x" (ilegível em 24 px) | eixos, curva aˣ e log x espelhadas na reta y = x (funções inversas), cortes em (0,1) e (1,0) | desenho próprio |
| P01 | Leitura e compreensão | folha genérica | livro aberto com texto | Lucide `book-open-text` (ISC) |
| P04 | Coesão e coerência | dois ovais sobrepostos | elos de corrente | Lucide `link` (ISC) |
| P06 | Figuras de linguagem | aspas (lia-se "citação") | balão de fala com brilho (linguagem figurada) | Lucide `message-circle` + `sparkle` (ISC) |
| P10 | Norma e emprego | "à" + traço extra (acento duplicado) | "a" com acento grave único (crase) | desenho próprio |
| P12 | Literatura: Pré-Modernismo em diante | livro com estrela (colidia com P01) | caneta esferográfica (moderno, em par com a pena de P11) | Tabler `ballpen` (MIT) |

## Correção de bug: traços que sumiam no app
O degradê `#ad-grad` (unidades da caixa do objeto) não pinta traço com caixa de largura ou altura zero. Testado no Chromium: linha 100% horizontal/vertical isolada some.
Afetava 11 traços: B04 (pontilhado lateral), Q06 (êmbolo), Q09 (divisória), Q10 (mercúrio do termômetro), Q12 (ligações laterais), M08 (altura tracejada), M10 (eixo), M14 (base), M17 (conector), P08 (linha de base), P12 (lombada).
Correção: toque invisível de 0,02 na ponta (ex.: `M10 16h28M38 15.99v.02`). Verificado por script (getBBox de todo traço): zero ocorrências.

## Mantidos (checados, sem problema)
B01, B03–B07, B10, B11, Q01–Q12 (só correções acima), M01–M05, M07–M17, P02, P03, P05, P07–P09, P11, glifos bio/qui/mat e os 27 ícones de interface.

## Licenças
Lucide — ISC, © 2026 Lucide Icons and Contributors. Tabler Icons — MIT, © 2020–2026 Paweł Kuna. Phosphor Icons — MIT, © 2023 Phosphor Icons. Avisos no topo de `icones.js`.
