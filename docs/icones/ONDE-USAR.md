# Ícones de tema — onde entram no site (comandos 19 e 23, dono, 06/11/2026)

Arquivos: `docs/icones/<matéria>/<id do tema>-<nome>.png`. O id no nome é o `mod.id` do site.

**Todas as matérias já têm ícones novos de tema** (aprovados pelo dono; Biologia e Química em 06/11, as outras sete em 06/11/2026, comando 23):
| Matéria | Pasta | Temas |
|---|---|---|
| Biologia | `docs/icones/biologia/` | B01 a B12 (12) |
| Química | `docs/icones/quimica/` | Q01 a Q12 (12) |
| Matemática | `docs/icones/matematica/` | M01 a M17 (17) |
| Português | `docs/icones/portugues/` | P01 a P12 (12) |
| Física | `docs/icones/fisica/` | F01 a F12 (12) |
| Geografia | `docs/icones/geografia/` | G01 a G12 (12) |
| História | `docs/icones/historia/` | H01 a H08 (8) |
| Inglês | `docs/icones/ingles/` | I01 a I04 (4) |
| Filosofia e Sociologia | `docs/icones/filosofia-sociologia/` | L01 a L08 e S01 a S08 (16) |

Ícones com ressalva (usar o atual até o dono mandar nova versão): ver comando 23 em `docs/comandos-do-dono.md`.
Visual (ver `exemplo-faixa-de-temas.png`, só o visual, não a ordem): o objeto fica INTEIRO DENTRO de um círculo claro; ao passar o mouse ou focar pelo teclado, o círculo com o ícone cresce ~6% e sobe levemente (animação curta e suave; com "reduzir movimento", só destaque de borda). No toque não há efeito: abre o tema.

## Recebem o ícone do tema (círculo)
| Onde | Código | Tamanho atual |
|---|---|---|
| Faixa de temas no topo da matéria (rolagem lateral) — lugar principal | `telas/Materia.tsx` `FaixaTemas`, `.ft-ic` | 112 px |
| Faixa compacta dentro do tema e da escada | `FaixaTemas compacta` em `Tema.tsx` e `Escada.tsx` | 76 px |
| Cabeçalho da página do tema | `telas/Tema.tsx` `.tp-ic` | 100 px |
| Lista de temas por área na página da matéria | `telas/Materia.tsx` `.area-tema` | 72 px |
| Filtro de temas nos flashcards | `telas/Flashcards.tsx` `.fl-tema` | 36 px |

## Subtemas: ponto na cor da matéria, nunca ícone (decisão do dono, 06/11)
Onde aparece um subtema, no lugar do ícone vai um **pontinho na cor principal da matéria** (`docs/cores/paleta.json`), igual ao do protótipo: o ponto de 6 a 8 px antes do nome nos grupos e itens do menu (`app-atual/design/shell.html`, `.grupo::before` e `.legenda span::before`). Mesmo tamanho e alinhamento em todo o site.
| Onde | Código | O que fazer |
|---|---|---|
| Lista de conteúdos dentro do tema | `telas/Tema.tsx` `.tp-enc` (64 px) | trocar o ícone pelo ponto; ficam ponto, nome, frase, progresso |
| Título da escada | `telas/Escada.tsx` h1 (44 px) | tirar o ícone (o título já tem a cor da matéria) |
| "Teoria desta questão" e conteúdos relacionados | `telas/Questao.tsx`, `telas/Treino.tsx` (34 px) | ponto |
| Faixa do cartão de flashcard | `ui/Cartoes.tsx` (34 px) | ponto |
| Resultados da busca (conteúdos) | `telas/Busca.tsx` (32 px) | ponto |
| "Continue de onde parei" no Início | `telas/Inicio.tsx` (150 px) | a ilustração da matéria (sem ícone de subtema) |

O ícone da MATÉRIA (Início, menu, lista de matérias: `IluMateria`) não muda neste comando.
## Salvar os novos e excluir os antigos (dono, 06/11/2026)
- Os PNG de `docs/icones/<matéria>/` são a fonte oficial: o conversor (`app/scripts/converte.py`) passa a gerar os ícones de tema dessa matéria SÓ a partir deles (`<id>.webp`).
- Excluir do site os ícones antigos dessa matéria: os de tema e todos os de subtema que vinham do protótipo (`app-atual/.../ic.json`) ou das pranchas (`app/conteudo-fonte/materias/ic/`), e o código que só servia a eles. Autorização expressa do dono, sem perguntar.
- NÃO apagar nada em `app-atual/`: o protótipo continua intacto.
- Hoje todas as matérias têm ícones novos (tabela no topo): a regra vale para as nove. Se o dono mandar nova versão de algum ícone, ela substitui a anterior pelo mesmo nome de arquivo.
- Ao gerar o WebP, apagar restos de fundo (alfa abaixo de ~30 vira 0) só no WebP; o PNG original em `docs/icones/` nunca é alterado.
