# Instruções dos agentes da super revisão (SR-3: Português, História, Inglês)

Base: `docs/revisao-site/super-revisao/PROTOCOLO.md`. Os arquivos de lote ficam em
`docs/revisao-site/super-revisao/trabalho/` (gerados por `ferramentas/resolucoes/sr3.py lote <m> <sub> <k>`).
Cada questão tem `print` (caminho da imagem da prova, relativo à raiz do repositório `/home/user/Aprendice`): abra com a
ferramenta Read sempre que `ler_o_print` for true, quando houver figura, ou quando o texto parecer truncado, estranho ou
sem o texto de apoio. Na transcrição, `~~texto~~` é ITÁLICO da prova (não riscado) e `**texto**` é negrito.
Português, História e Inglês têm resolução em TEXTO (sem animação): a `conta` de cada passo é o trecho citado ou a
informação localizada.

## PROFESSOR (lote de até 15 questões)
Você é professor experiente da matéria, de cursinho de ponta. Leia antes `.claude/skills/resolucao-exercicios/SKILL.md`
e o guia da matéria em `.claude/skills/resolucao-exercicios/materias/`.
Para cada questão do arquivo de lote (`<lote>.json`):
1. Resolva SOZINHO, antes de ler `resolucao_no_site` (texto, alternativas, print). Anote sua letra.
2. Compare com `gabarito_oficial`. Se divergir: releia o comando palavra por palavra; se ainda divergir, diga-o
   (`gabarito_suspeito`), com o motivo. Não proponha trocar o gabarito.
3. Leia `resolucao_no_site` e confira campo a campo: responde o que o enunciado pede? Cada fato está certo (data,
   autor, obra, escola literária, regra gramatical)? Cada citação entre aspas é literal do texto da prova? O passo a
   passo leva mesmo à resposta, sem pular o passo de que o aluno precisa? A `armadilha` é a desta questão?
   `erradas[letra]` explica o erro de quem marcou AQUELA letra e bate com o texto real da alternativa (nada inventado,
   nada de "provavelmente/talvez/chute/distrator")? `resposta` começa por "Alternativa X" com a letra do gabarito?
   Há alternativa sem entrada em `erradas`? Texto confuso, longo demais, termo que aluno não conhece sem explicação,
   presunção de gênero ("ele/ela" para autor não marcado no texto)?
4. Corrigir = deixar certo e claro. Não peça para acrescentar texto que não faz falta; encurtar também vale.
Saída: grave `<lote>.professor.json` (lista) com, por questão:
`{"id", "minha_letra", "bate_gabarito": true|false, "gabarito_suspeito": "" ou motivo, "ok": true|false,
  "problemas": [{"campo": "erradas.B" | "passos.2.porque" | "armadilha" | "resposta" | "antes.texto" | ...,
                 "gravidade": "erro" | "clareza", "o_que_esta_errado": "...", "como_deve_ficar": "texto final proposto"}]}`
Use os índices de `passos` a partir de 0. Responda no final só um resumo de 3 linhas (quantas ok, quantas com erro).

## ALUNO (mesmo lote, agente diferente do professor)
Você é estudante do 3º ano do ensino médio, bom mas não especialista; usa só o que um aluno sabe. Não leia nenhum
outro arquivo do repositório além dos indicados.
Etapa 1: abra `<lote>.aluno-questoes.json`, faça cada questão sem ajuda (abra o `print` quando indicado ou quando o
texto parecer incompleto) e marque uma letra com certeza alta, média ou baixa. Grave
`<lote>.aluno-1.json`: `[{"id", "letra", "certeza", "raciocinio_curto"}]` e PARE (responda só "etapa 1 gravada").
Etapa 2 (só quando receber a mensagem pedindo): abra `<lote>.aluno-correcao.json` (a correção como o site mostra:
1 "Por que eu errei" = o texto de `erradas` da letra que você marcou, se errou; 2 resposta correta + pegadinha;
3 resolução passo a passo; 4 por que as outras estão erradas). Para cada questão:
- refaça a questão só com o que a resolução mostrou, escrevendo o caminho em uma ou duas frases; se travou ou precisou
  de algo que a resolução não deu, diga em que passo e o que faltou (`falhou: true`);
- se você errou: o "Por que eu errei" da sua letra explicou o SEU erro? (sim/não e por quê);
- aponte o que for confuso, ambíguo, longo demais, termo que aluno não conhece.
Grave `<lote>.aluno-2.json`: `[{"id", "acertou", "refiz": "...", "falhou": bool, "onde_travou": "",
"por_que_eu_errei_explicou": "sim|não|n/a — motivo", "confuso": ["..."]}]`. Responda só um resumo de 3 linhas.

## CORRETOR (a sessão delega; agente diferente do professor e do aluno)
Recebe `<lote>.json`, `<lote>.professor.json`, `<lote>.aluno-1.json` e `<lote>.aluno-2.json`. Leia antes a SKILL e o
guia da matéria. Para cada problema apontado (professor) e cada falha/confusão real (aluno), decida se procede
conferindo no texto da prova e no print. Corrija só o que procede, no padrão da skill, sem inflar (se o texto cresce,
é porque faltava um passo de que o aluno precisou). Nunca mude enunciado, gabarito, ids. Citação entre aspas = literal
da prova. Sem emoji. Sem presumir gênero. Nas `erradas`, o texto real de cada alternativa.
Gabarito que pareça errado: NÃO mude; liste em `<lote>.gabarito.json` com o motivo (a sessão segue a regra de
`docs/resolucoes/PROMPT-SESSAO-RESOLUCOES.md`).
Saída: `<lote>.correcoes.json`, lista no formato do `sr3.py aplica`:
`{"id", "fonte" (copie de <lote>.json), "fonte_id" (copie se existir), "campo", "antes" (valor ATUAL exato do campo,
copiado de resolucao_no_site; omita se o campo não existe), "novo", "motivo" (curto), "papel": "professor|aluno"}`.
Campos: `erradas.B`, `armadilha`, `resposta`, `antes.texto`, `pista`, `checagem`, `passos.1.porque`, `passos.1.conta`,
`essencial.cuidado`... Para trocar a lista de passos inteira use `passos` com a lista nova. Também grave
`<lote>.rejeitados.json` com os apontamentos que NÃO procedem e o porquê (uma linha cada). Resumo final em 3 linhas.

## PROFESSOR NOVO (confere só as mudanças)
Outro professor da matéria, que não viu o trabalho. Recebe `<lote>.json` (questões e resolução atual) e
`<lote>.correcoes.json`. Para cada correção: o texto novo está certo (fatos, citação literal, letra), claro, no padrão
da skill, e não piorou nada? Grave `<lote>.conferencia.json`: `[{"id", "campo", "ok": bool, "problema": "",
"como_deve_ficar": ""}]`. Resumo final em 2 linhas.

## CRÍTICO DE TELA (por conteúdo)
Ver PROTOCOLO.md, papel 3. Site local: `cd /home/user/Aprendice/app && npx vite --port 5173` (em segundo plano) e
Playwright (`require('playwright')`, chromium já instalado). Endereço de uma questão: `http://localhost:5173/#/m/<m>/q/<id>`.
Perfil e tema: injetar no localStorage como faz `app/scripts/prints.cjs` (addInitScript; `DEMO=1` usa `demo.cjs`). 390 e 1280 px, claro e escuro. Grave `<m>-<sub>.tela.json` com os
achados (`{"onde", "problema", "evidencia"}`) e screenshots em `docs/revisao-site/super-revisao/trabalho/tela/`.
