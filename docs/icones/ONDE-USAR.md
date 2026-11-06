# Ícones de tema — onde entram no site (comando 19, dono, 06/11/2026)

Arquivos: `docs/icones/<matéria>/<id do tema>-<nome>.png` (Biologia pronta: B01 a B12). O id no nome é o `mod.id` do site.
Visual (ver `exemplo-faixa-de-temas.png`, só o visual, não a ordem): o objeto fica INTEIRO DENTRO de um círculo claro; ao passar o mouse ou focar pelo teclado, o círculo com o ícone cresce ~6% e sobe levemente (animação curta e suave; com "reduzir movimento", só destaque de borda). No toque não há efeito: abre o tema.

## Recebem o ícone do tema (círculo)
| Onde | Código | Tamanho atual |
|---|---|---|
| Faixa de temas no topo da matéria (rolagem lateral) — lugar principal | `telas/Materia.tsx` `FaixaTemas`, `.ft-ic` | 112 px |
| Faixa compacta dentro do tema e da escada | `FaixaTemas compacta` em `Tema.tsx` e `Escada.tsx` | 76 px |
| Cabeçalho da página do tema | `telas/Tema.tsx` `.tp-ic` | 100 px |
| Lista de temas por área na página da matéria | `telas/Materia.tsx` `.area-tema` | 72 px |
| Filtro de temas nos flashcards | `telas/Flashcards.tsx` `.fl-tema` | 36 px |

## Subtemas ficam SEM ícone (decisão do dono, 05/11)
| Onde | Código | O que fazer |
|---|---|---|
| Lista de conteúdos dentro do tema | `telas/Tema.tsx` `.tp-enc` (64 px) | tirar o ícone; ficam nome, frase, progresso |
| Título da escada | `telas/Escada.tsx` h1 (44 px) | tirar o ícone |
| "Teoria desta questão" e conteúdos relacionados | `telas/Questao.tsx`, `telas/Treino.tsx` (34 px) | usar o ícone do TEMA da questão, pequeno, ou nenhum |
| Faixa do cartão de flashcard | `ui/Cartoes.tsx` (`c.sub || c.mod`, 34 px) | usar o ícone do TEMA (`c.mod`) |
| Resultados da busca | `telas/Busca.tsx` (32 px) | ícone do TEMA do resultado |
| "Continue de onde parei" no Início | `telas/Inicio.tsx` (`q.sub`, 150 px) | ícone do TEMA (`q.modulo`) ou a ilustração da matéria |

O ícone da MATÉRIA (Início, menu, lista de matérias: `IluMateria`) não muda neste comando.
## Salvar os novos e excluir os antigos (dono, 06/11/2026)
- Os PNG de `docs/icones/<matéria>/` são a fonte oficial: o conversor (`app/scripts/converte.py`) passa a gerar os ícones de tema dessa matéria SÓ a partir deles (`<id>.webp`).
- Excluir do site os ícones antigos dessa matéria: os de tema e todos os de subtema que vinham do protótipo (`app-atual/.../ic.json`) ou das pranchas (`app/conteudo-fonte/materias/ic/`), e o código que só servia a eles. Autorização expressa do dono, sem perguntar.
- NÃO apagar nada em `app-atual/`: o protótipo continua intacto.
- Matérias sem ícones novos ainda: mantêm os atuais até o dono mandar os delas; quando mandar, a mesma regra vale.
