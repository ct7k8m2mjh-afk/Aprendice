# Pedidos do dono (registro permanente)

Tudo o que o dono envia (texto, imagens, pranchas) fica anotado aqui, com data e o que foi feito.
Imagem enviada nunca é "por enviar": tem uso, e o uso fica registrado.

## Imagens recebidas
| Data | O que é | Onde está no projeto | Uso |
|---|---|---|---|
| 02/11 | Prancha de 12 ícones de Física (um por tema F01–F12) | app/conteudo-fonte/materias/ic/pranchas/fisica.webp | ícones dos temas de Física e ícone principal |
| 02/11 | Prancha de 12 ícones de Geografia (G01–G12) | app/conteudo-fonte/materias/ic/pranchas/geografia.webp | ícones dos temas de Geografia e ícone principal |
| 03/11 | Pranchas de História, Filosofia, Sociologia, Inglês | app/conteudo-fonte/materias/ic/pranchas/ | ícones dos temas e principais |
| 03/11 | Referência do menu lateral | docs/referencias/menu-lateral.webp | ícones de linha verdes do menu |
| 03/11 | Referência da tela inicial | docs/referencias/tela-inicial.webp | nova tela inicial |
| 03/11 | Célula 3D de referência (corte com um quarto removido) | docs/referencias/celula-3d.webp | padrão de acabamento da célula construída (textura, proporção, organelas) |

## Regras visuais ditas pelo dono
- Ícones 3D: luz de FRENTE e de cima; o fundo branco é o chão; a sombra cai para TRÁS do objeto (nunca na frente). A sombra serve para dar contraste e destacar o ícone.
- Resolução máxima: nada borrado em tela cheia. Recorte nunca pode cortar o objeto.
- Sem fundo branco em volta do ícone recortado.
- Cores das matérias bem distintas entre si (como um caderno de cada cor): nenhuma matéria com cor parecida com outra.
- Prioridade futura: construir os ícones (3D/vetor em camadas) em vez de colar PNG, para poder animar (ex.: expandir ao passar o mouse).
- Redação não é matéria do app (removida em 03/11).
- Formas decorativas (onda verde do menu) não podem aparecer cortadas.

## Ordem de trabalho (03/11) — o que vem primeiro e por quê
1. Feito: cores distintas por matéria, Redação removida, onda do menu sem corte (valem de qualquer jeito).
2. Ícones CONSTRUÍDOS (3D em camadas) em vez de melhorar o copia-e-cola: não se amplia/retoca o que vai ser refeito.
   Sombras e resolução entram já na construção (luz de frente e de cima, sombra para trás, render em alta).
3. Animação dos ícones construídos (ex.: partes que se expandem ao passar o mouse).

- Ícones construídos precisam de textura, proporção e vida no nível da referência 3D da célula (03/11).

## Regra de animação (03/11, vale para TODOS os ícones)
- Cada ícone anima de acordo com a FUNÇÃO do que representa (ex.: circuito = corrente correndo no fio e lâmpada acendendo).
- Nunca "desmontar" peças sem sentido. Antes de animar, conferir se o próprio desenho faz sentido físico/científico
  (ex.: nuvem e vento do tamanho de continentes soltos fora da Terra NÃO fazem sentido; nuvens e ventos ficam rentes à superfície).
- Catálogo de cada ícone, função e animação: docs/animacoes-dos-icones.md.

## Regra de criação (03/11)
- Nada é tirado/copiado/projetado da imagem de referência: copiar perde a qualidade original.
- Tudo é CRIADO (modelado, pintado de forma procedural em alta resolução, ou assado da nossa própria cena 3D) para ficar
  igual à referência. A referência serve só para olhar e comparar lado a lado.


## Decisões de 05/11/2026
- O produto é um **site** (navegador no computador, celular e tablet), não aplicativo de loja.
- Público: vestibulares em geral de todo o Brasil, não só Medicina.
- O site pode ter **Questões Aprendice** (criadas por ele), revisadas pela banca de especialistas e sempre identificadas.
- Uma banca de especialistas (doutores/mestres) por matéria resolve e revisa as questões.
- Toda mudança no `CLAUDE.md` é aplicada em todos os arquivos do projeto.
- Direitos autorais: quem decide o que de terceiros vai ao site é o dono. O Claude registra a origem e avisa riscos, sem bloquear.
- Site publicado em link público por decisão do dono (05/11/2026).

- 05/11/2026: tarefa da célula 3D cancelada. Decisão: o site passará a usar só ícones sem animação. Não mexer nos ícones até o dono mandar.
