# Questões de prova e Questões Aprendice

Decisão do dono em 02/11/2026. Questões copiadas de sites didáticos não podem aparecer no site (confirmado em 05/11/2026). Os prints das bancas ficam por enquanto. No lugar das questões de sites entram questões escritas pelo Aprendice.

## Os dois tipos

| | Questão de prova | Questão Aprendice |
|---|---|---|
| Origem | Prova publicada por uma banca | Escrita pela fábrica (API) |
| Como aparece | Print fiel da questão original (questão só de texto: texto copiado da prova oficial, CLAUDE.md princípio 1) | Texto e figura próprios, no visual do site |
| Selo | Banca, ano e número (ex.: "Fuvest 2023 · Q12") | "Questão Aprendice"; nunca nome de banca. Pode dizer "tema que caiu na Fuvest 2023" |
| Gabarito | Só o publicado (oficial ou resolução reconhecida) | Duas resoluções independentes que concordam, mais as contas conferidas por código |
| Simulado (prova inteira por instituição e ano) | Sim | Não |
| Níveis (Treine sua evolução), treino geral, revisão | Sim | Sim |

## Escopo da troca (banco em 02/11/2026)

788 questões do banco atual (`tipo: "site"`) vieram de sites didáticos.

| Matéria | Questões de site | Têm banca citada no enunciado |
|---|---|---|
| Biologia | 312 | 104 |
| Química | 250 | 78 |
| Português | 128 | 65 |
| Matemática | 98 | 52 |
| **Total** | **788** | **299** |

Por site: Brasil Escola 587, Mundo Educação 197 (os dois são da mesma empresa), Prepara Enem 3, InfoEscola 1.

## Passo a passo para cada questão de site

1. **Triagem.** Se o enunciado cita uma banca (ex.: "(Fuvest-SP)"), procurar a prova original no site oficial da banca, com ano e número.
   - Se achar a prova e o gabarito publicado, a questão vira questão de prova, com print recortado **do PDF oficial**, nunca do site.
   - Se não achar, segue para o passo 2.
2. **Substituição.** Escrever uma Questão Aprendice nova para o mesmo conteúdo (`sub`), com o mesmo nível de dificuldade e o mesmo conceito cobrado.
   - O gerador recebe só o conceito, o conteúdo, a dificuldade e o estilo da prova-alvo (do raio-x). **Ele não recebe o texto da questão do site**, para não sair uma paráfrase.
   - A questão nova tem contexto, números, texto e alternativas próprios.
3. **Distratores com origem.** Cada alternativa errada nasce de um erro típico do aluno, que vai para o campo `erradas` da resolução (princípio "Errar ensina").
4. **Resolução** no mesmo formato de `res/<sub>.json`, mostrada na correção em 4 blocos e com resolução animada (CLAUDE.md, "Como o site ensina").
5. **Revisão em lentes.**
   - Lente A resolve sem ver o gabarito.
   - Lente B resolve sem ver nem a A nem o gabarito.
   - As duas e o gabarito precisam bater. Contas são refeitas por código.
   - Depois vêm a lente de utilidade, clareza e estilo de prova, e por fim a lente de fatos de novo em tudo que mudou.
   - Divergência vai para a fila de exceção, que o Claude Code olha uma a uma.
6. **Conferência no site:** questão e resolução renderizadas nos temas claro e escuro, em 390, 768, 1280 e 1440 px (CLAUDE.md, princípio 9).

## Figuras

- São feitas por código: as coordenadas e medidas são calculadas e o resultado sai em SVG. Nada de desenho "a olho".
- O programa confere as medidas (ângulos, comprimentos, proporções) e a figura é vista renderizada antes de entrar.
- Se a questão diz "figura fora de escala", isso tem que estar escrito. Uma figura em escala não pode entregar a resposta.
- Foto, mapa e micrografia só com licença livre (ex.: Wikimedia, com crédito no campo de fonte). Se não houver, a questão é desenhada sem eles.
- Toda figura tem texto alternativo.

## Textos de apoio (Português e interpretação)

Usar só:
- texto em domínio público (os direitos duram até 70 anos após 1º de janeiro do ano seguinte à morte do autor, Lei 9.610/98, art. 41);
- texto com licença livre;
- texto escrito pela própria fábrica.

Nunca colar texto protegido, nem trecho de matéria jornalística recente.

## Dados e progresso do aluno (princípio 7)

- Novos campos:
  - `tipo: "aprendice"`;
  - `escola: "Aprendice"`;
  - `inspiracao` (opcional, ex.: "tema que caiu na Fuvest 2023"), que nunca vira selo de banca.
- O id da questão de site removida não some: um mapa `substitui` (id novo → id antigo) leva o histórico do aluno, ou seja, erros, revisão espaçada e "continue de onde parou", para a questão nova do mesmo conteúdo e nível.
- Na interface:
  - nenhum print, foto, logo, link ou nome de site didático;
  - o selo "Questão Aprendice" fica visível;
  - opção de filtro "só questões de prova".

## Orçamento

Rodar em lotes por matéria, via Batches, com o teto de gasto declarado antes e o gasto registrado em `fabrica_saida/gastos.csv` (ver `docs/fabrica-de-conteudo-api.md`). Começar por um lote-piloto de 20 questões de uma matéria, conferir o piloto inteiro (lentes e site renderizado) e só então escalar. O trabalho é autônomo (CLAUDE.md): não é preciso esperar aprovação do dono.

## Riscos registrados para o dono decidir (princípio 10)

O site já está no ar (decisão do dono). Os prints das bancas hoje vêm em parte de PDFs de cursinho: 1.309 do Curso Objetivo, além de Qconcursos, Estratégia e Química para o Vestibular. Recomendações (não bloqueiam o que o dono autorizou):
- refazer o recorte a partir do PDF oficial de cada banca;
- registrar a autorização de uso de cada uma (o ENEM, do INEP, tem o argumento mais forte de "ato oficial", art. 8, IV);
- passar por um advogado de propriedade intelectual.
