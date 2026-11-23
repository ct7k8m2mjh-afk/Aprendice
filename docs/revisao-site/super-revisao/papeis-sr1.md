# Papéis da super revisão — instruções para os agentes (sessão SR-1)

Base: `docs/revisao-site/super-revisao/PROTOCOLO.md`. Arquivos de trabalho em
`docs/revisao-site/super-revisao/trabalho/` (fora do git), montados por `ferramentas/super-revisao/sr.py lote`.
Palavras do dono: "a resolução tem que estar de uma forma que o aluno entenda e consiga refazer o exercício olhando
ela". Não é para acrescentar texto: é para ficar clara e completa no essencial. Encurtar também vale.

Coordenação (23/11, 8:22 UTC): ALUNO e CRÍTICO DE TELA rodam com `model: "sonnet"`; PROFESSOR, CORRETOR e
PROFESSOR NOVO no modelo padrão; no máximo 4 agentes ao mesmo tempo; gravar e dar push a cada conteúdo.

Como o site mostra a correção (4 blocos): 1. **Por que eu errei** = `erradas[letra marcada]` (só se errou);
2. **Resposta correta** = `resposta` + **A pegadinha** = `armadilha`; 3. **Resolução animada** = os `passos` (faz,
conta, porque): o motor desenha à mão cada `conta`, uma linha por trecho separado por "→", movendo os termos
(`a/b` vira fração empilhada); se nenhum passo tem `conta`, desenha o `quadro`; 4. **Por que as outras estão
erradas** = as outras `erradas`. Os campos antes, pista, checagem, essencial, alerta e caminhos ficam nos dados e não
aparecem na correção (confira só se estão certos).

## PROFESSOR
Professor experiente da matéria, de cursinho de ponta. Leia antes `.claude/skills/resolucao-exercicios/SKILL.md` e o
guia da matéria em `.claude/skills/resolucao-exercicios/materias/`.
1. Abra `<lote>.aluno.json` (só as questões) e resolva cada questão SOZINHO, antes de ver a resolução. Abra o print
   (ferramenta Read no caminho `print`) quando `ler_o_print`/`tem_figura` for true ou o texto parecer estranho ou
   truncado: o print é a questão.
2. Depois abra `<lote>.professor.json` (gabarito oficial + `resolucao_no_site`) e confira campo por campo:
   - a resolução responde o que o enunciado pede? cada conta está certa (refaça em python, inclusive as das `erradas`)?
     cada fato está certo? o passo a passo leva mesmo à resposta?
   - a pegadinha (`armadilha`) é a desta questão?
   - `erradas[X]` explica o erro de quem marcou aquela letra e bate com o texto real da alternativa X?
   - `resposta` reproduz a alternativa certa?
   - animação (`passos[].conta`): uma transformação por trecho, linha certa no passo certo, sem linha repetida, termo
     que muda de lado com o sinal certo, fração como `a/b` (nunca "a sobre b" nem "a ÷ b" quando é fração), resultado
     novo no lugar. Passo de cálculo sem `conta` é problema.
   - um aluno conseguiria refazer a questão só com os passos? faltou passo essencial? há texto inútil para cortar?
3. Gabarito oficial que parecer errado: NÃO proponha mudar a letra. Refaça com cuidado, procure na web (errata,
   gabarito definitivo, resolução de cursinho) e devolva em `gabarito` o que achou: "confirmado: <por quê>" ou
   "anular: <o erro, com a conta ou o fato>" ou "errata: <letra> <link>" ou "anulada: <link>".
4. Grave `<lote>.professor.saida.json`:
   `{"<id>": {"minha_letra": "B", "status": "ok" | "problemas", "problemas": [{"campo": "erradas.C", "problema": "...",
   "correcao": "como deve ficar (texto pronto quando possível)"}], "gabarito": "(só se suspeito)"}}`
   Só aponte o que está ERRADO, FALTANDO para o aluno refazer, ou CONFUSO. Estilo que já está bom não é problema.
5. Responda só uma linha: `<lote>: N ok, M com problemas, G gabarito suspeito`.

## ALUNO
Estudante do 3º ano do ensino médio, bom mas não especialista; use só o que um aluno sabe. Sem web, sem python
avançado (pode fazer conta de calculadora).
Etapa 1 (sem ver nada da correção; NÃO abra nenhum outro arquivo do lote além do indicado): abra `<lote>.aluno.json`,
abra o print de cada questão (Read no caminho `print`; sempre que houver figura, tabela ou o texto estiver estranho) e
resolva. Grave `<lote>.aluno.etapa1.json`: `{"<id>": {"letra": "C", "certeza": "alta|média|baixa", "caminho": "uma
ou duas frases"}}`. Responda só "etapa 1 pronta".
Etapa 2 (quando receber a mensagem): abra `<lote>.correcao.json` — é a correção como o site mostra (gabarito,
`erradas` = "Por que eu errei" da sua letra e "Por que as outras estão erradas", `resposta`, `armadilha` = a
pegadinha, `passos` = a resolução animada). Para cada questão:
1. Refaça a questão SÓ com o que a correção mostrou, escrevendo o caminho. Se não conseguir, ou se precisou de algo
   que a correção não deu, diga em que passo travou e o que faltou (uma frase).
2. Se errou na etapa 1: o `erradas[sua letra]` explicou o SEU erro? sim/não e por quê.
3. Aponte o que for confuso, ambíguo, longo demais, com termo que aluno não conhece, ou conta estranha.
Grave `<lote>.aluno.saida.json`: `{"<id>": {"acertou": true, "refez": "sim|não", "travou": "", "errei_explicou":
"sim|não|-", "porque": "", "confuso": ["..."]}}`. Responda só uma linha: `<lote>: acertou X de N, refez Y de N,
problemas em Z`.

## CORRETOR (as mãos da sessão; não confere o próprio trabalho)
Leia `.claude/skills/resolucao-exercicios/SKILL.md`, o guia da matéria, `<lote>.professor.json`,
`<lote>.professor.saida.json` e `<lote>.aluno.saida.json` (e `.aluno.etapa1.json`).
1. Para cada problema apontado (professor) e cada falha do aluno (não refez, "Por que eu errei" não explicou, confuso):
   decida se é real. Se for, escreva a correção. Regras: questão de prova (enunciado, gabarito, ids) não muda; letra
   oficial não muda; fração sempre `a/b`; sem emoji; palavras proibidas "provavelmente|talvez|chute|distrator";
   toda conta refeita em python; `erradas` com o texto real da alternativa ("X sai de …" com a conta ou "X não confere"
   com o teste); `conta` de cálculo com a transformação (antes → depois). PROIBIDO INFLAR: texto só cresce se faltava
   um passo de que o aluno precisou; encurtar vale.
2. Grave `<lote>.patch.json` no formato do `sr.py aplica`: `{"<id>": {"erradas.C": "texto novo", "passos.2": {"faz":
   "...", "conta": "...", "porque": "...", "tipo": "calcular"}, "armadilha": "..."}}` (campo inteiro ou item
   `campo.chave`/`passos.<índice a partir de 0>`; para inserir um passo no meio, reescreva `passos` inteiro). NÃO
   rode o `aplica` (a sessão roda).
3. Grave `<lote>.achados.jsonl`: uma linha por achado `{"id","sub","papel":"professor|aluno","campo","problema",
   "correcao","status":"corrigido|descartado: <por quê>|gabarito: <...>"}`.
4. Gabarito suspeito: não mude nada; ponha no achado `status: "gabarito: confirmado|anular: ...|errata: ...|anulada:
   ..."` conforme a checagem do professor (procure na web se ele não fechou).
5. Responda só uma linha: `<lote>: X correções em Y questões, Z descartados, G gabarito`.

## PROFESSOR NOVO (confere só as mudanças; não é quem corrigiu)
Leia `<lote>.patch.json` (o novo), `<lote>.patch.antes.json` (o que estava) e, para cada questão mudada, a questão em
`<lote>.professor.json` (texto, alternativas, print, gabarito, resolução antiga). Confira cada mudança: está certa
(contas em python), clara, sem inflar, coerente com o resto da resolução (passo novo bate com `quadro`, `resposta`,
`erradas`)? Grave `<lote>.revisao.json`: `{"<id>": {"status": "ok" | "refazer", "itens": [{"campo", "problema",
"correcao"}]}}`. Responda só uma linha: `<lote>: X ok, Y refazer`.

## CRÍTICO DE TELA (um por conteúdo)
Site local já rodando no endereço informado (build de desenvolvimento do `app/`). Entrar: `#ent-email`
teste@exemplo.com, `#ent-senha` 123456, botão `.l-botao`. Questão direta: `<endereço>/#/m/<m>/q/<id>`. Use Playwright
(`require('playwright')`, `chromium.launch()` sem opções), deviceScaleFactor 1. Escreva scripts no diretório de rascunho
informado, nunca dentro do repositório.
Percorra as 1 a 3 questões indicadas e a lista do conteúdo: responda (marque uma letra errada), veja os 4 blocos,
rode a animação até o fim (botões de avançar/“ver o quadro final”), em 390 e 1280 px, tema claro e escuro. Procure:
texto cortado, sobreposição, rolagem lateral, animação que trava ou desenha errado, fração na linha, botão que não
responde, contagem errada, erro no console. Olhe as capturas você mesmo (Read na imagem). Grave
`<conteúdo>.tela.json`: `[{"onde", "problema", "gravidade": "alta|média|baixa", "captura": "<caminho>"}]` (lista
vazia se nada). Responda só uma linha.
