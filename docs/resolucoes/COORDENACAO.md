# Coordenação das sessões de resolução

Arquivo de passagem entre sessões coordenadoras (decisão do dono, 12/11/2026: trocar a coordenação por uma sessão nova
para gastar menos do limite semanal). Leia inteiro antes de agir. Atualize no fim de cada rodada o que mudou.

## Papel
A coordenadora só organiza: questões no site, classificação, prints, gabaritos, publicação e o andamento das sessões.
NUNCA resolve questão. Fala com o dono em português do Brasil, direto, sem termos técnicos (CLAUDE.md).

## Situação (13/11, 03h30)
O dono mandou todas as sessões pararem depois do último lote. Não abrir sessões novas até ele mandar retomar.
Respostas do dono no painel (9) cumpridas ou em andamento; "anulada pelo Aprendice" vale para gabarito oficial contra os fatos.

## Regras de economia (dono, 12/11/2026)
- No máximo 5 sessões de resolução trabalhando ao mesmo tempo. Agora: Matemática, Física, Química, Biologia e Português.
- Pausadas (retomar só quando uma das 5 acabar a matéria ou o dono pedir): Inglês, Geografia, Filosofia e Sociologia,
  "Completar resoluções animadas" (ferramentas/resolucoes/completa.py). História acabou.
- Cada sessão de resolução troca por uma nova depois de 10 lotes (ou contexto acima de 40%): ela avisa com a palavra
  TROCA; a coordenadora abre uma sessão nova da mesma matéria (Opus, ambiente env_01PD36og67UPYvCWa3DcbQpX, repositório
  https://github.com/ct7k8m2mjh-afk/aprendice, ramo app-prototipo-completo, permission_mode acceptEdits, tag
  aprendice-resolucoes) com o prompt-padrão abaixo, e atualiza a tabela de sessões aqui.
- A própria coordenadora também é trocada quando a conversa passar de 40%: escreva o estado aqui e peça ao dono.
- Conferência agendada a cada 3 horas (não de hora em hora).

## Prompt-padrão de uma sessão de matéria
"Você é a sessão de resoluções de <MATÉRIA> do Aprendice. Leia CLAUDE.md e siga integralmente
docs/resolucoes/PROMPT-SESSAO-RESOLUCOES.md, com a sua matéria = <m>. Fale português do Brasil. Comece com
`cd app && flock /tmp/converte.lock python3 scripts/converte.py`, volte à raiz e siga a esteira
(`python3 ferramentas/resolucoes/lote.py proximo <m> --novo`, até 3 lotes abertos seus). Limite de 10 lotes por
sessão: só abra lote novo se (lotes que você já gravou + lotes abertos seus) for menor que 10; ao gravar o 10º, mande TROCA. Se houver lote aberto de uma
sessão anterior desta matéria, assuma com `--retomar <lote>`. Trabalhe continuamente e nunca pare
esperando aprovação nem resposta (dono, 13/11): enquanto a lente confere um lote, já adiante o próximo. Questão com erro ou
problema sai como pendente com o motivo e vai por mensagem para a coordenadora; você segue para a próxima.
Avise a coordenadora com TROCA quando chegar a hora (passo 9 do prompt), escrevendo em
docs/resolucoes/caixa/<m>.md (veja LEIA.md); nunca use send_message, que pede aprovação do dono."
Ao abrir: extra_allowed_tools = ["Bash","Edit","Write","Read","Glob","Grep","Agent","Skill","WebFetch","WebSearch",
] (dono, 13/11: resolvedores não pedem autorização; também em .claude/settings.json).

## Sessões (13/11/2026, 03h30 UTC) — TODAS PARADAS por ordem do dono (último lote)
| Matéria | Sessão | Situação |
|---|---|---|
| Matemática | session_01PveEKZRuBiHmg4Hm9HT1J1 | PARADA por ordem do dono (13/11 03h): último lote mat-0059, nada aberto; pode arquivar |
| Física | session_01PveEKXmCjqipC4JbNj9w73 | PARADA por ordem do dono (13/11 03h): último lote fis-0056, nada aberto; pode arquivar |
| Química | session_01PveEKadroQ4kNhHt52L2hy | PARADA por ordem do dono (13/11 03h): último lote qui-0059, nada aberto; pode arquivar |
| Biologia | session_01PveEKaptKYR7JXwbmxDGXx | PARADA por ordem do dono (13/11 03h): último lote bio-0058, nada aberto; pode arquivar |
| Português | session_01PveEKaBDR2WGsLQUacMYFY | PARADA por ordem do dono (13/11 03h): último lote por-0087, nada aberto; pode arquivar |
| Inglês | session_01PveEKYvFj3v794d3jbEjQY | matéria concluída, tudo gravado: pode arquivar (dono avisado) |
| Geografia | session_01PveEKYE1nkNeafq9SNBU2b | pausada, tudo gravado (até geo-0038; faltam 1.476): pode arquivar (dono avisado 13/11) |
| Filosofia e Sociologia | session_01PveEKWgecw6NvvouAmBWM2 | matéria concluída (13/11), tudo gravado: pode arquivar (dono avisado) |
| Completar animadas | session_01PveEKXSa4J8B5gRwFfa8Af | pausada, tudo gravado; deixou pendentes P0eaf87df (Unicamp 2025 q72), passo 2 de Pb942e52d, gabaritos P1ba4d126 e P140521…: pode arquivar (dono avisado 13/11) |
| História | session_01PveEKar9UR25QNispiKNT4 | matéria concluída |
Desativadas (não mandar nada): Fable session_01PveEKXU47Vds1gGREvakqY, session_01PveEKazGNg4UZjknkJiLtJ,
session_01PveEKaAcCyTZHYawMeybog; Inglês antiga session_01PveEKYMQYJ9tRsSFLsoey8; Matemática duplicada
session_01PveEKb4hnDGKRb7Gtd9hCr. A coordenadora antiga é session_01PveEKWW3t7ZxcdDQKNiYWa (conversa do dono "APRENDICE").

## Reclassificar (recados das sessões; atualizado 13/11, 03h)
Classificação = campos `materia`/`tema`/`conteudo` da questão no prova.json (id não muda; a resolução continua ligada
pelo id). Questão que muda de matéria sai dos `pendentes` do registro antigo para entrar na fila da nova.
- Matemática (falta): com resolução de Matemática já gravada e mudança de matéria (refazer no estilo da outra matéria):
  P7c50dc09 (Física, ondas), Pb3deaa68 (Biologia, níveis tróficos), Pb906bf2a (Geografia). Subtema errado, sem destino
  indicado pela sessão: Pea59fe40, P632bbc24, P17e6f8b1, Pb9248592, Pc79dc928, P0ca7ab6a. Prints/dados: P19d0e8df
  (tabela vazia no print), Pf5b6a3c2 (caderno pula a D), número divergente P14017141, P4b446079, Pf025255d.
- Português (falta): subtema errado, sem destino indicado: Ped65eba5, P3bdc3073, Pbe8025a1, Pfe767de0, P98fee0ad,
  P273c97a5, P5bd2916f, P9889395d, Pd86425b8, P087b8c9f. Dado: P40c29de8 (alternativa E com coluna do poema colada).
  P298602be (UFT 2023/2 q14): especialistas A, preliminar da Copese B: fora do ar até sair o definitivo.
  63 pendentes "obra:" (lotes 61-71). FMABC 2022 q16 (Pd7fbdc3f): anulada pelo Aprendice (dono, 13/11).
- Feito em 13/11 (sessão principal): Biologia P3c08d8ee→Física F08.5, Pc68c4acb→Química Q01.3, Pbf20fbdc→Português
  P01.2; subtemas P372650c4 B04.1, Pfa8485e7 B01.4, Pd4ba01ad B02.5. Química P7f6fa922→Biologia B09.1 e 15 subtemas
  (Pa03ab8a5, P7e43e4b3, P373a52f0, Pbf3a7103, Pd7e4692a, Pd02b7249, Pe17c191b, P33b5d811, P433f7077, Ped3214f8,
  Pd751a99a, Peba62744, Pfe847491, Pa2e37ff4, Pe719f30b). Física P0e47c350 F11.9, P20f45835 F09.6, Pf58dd11b F05.1.
  Português P73a24ac0→B05.4, P7b12298d→B12.5, Pd8a099e2→S04.1, P2e17d217→S07.2 (P82bbfc0a já em outra-materia.json).
  UECE: Ped354672→B08.5, P46105cc7 e P6f6cf8da→B03.3, P4a88f3b0→B07.2, P77bfc70e→S04.4.
  Prints refeitos: P8a7424bc, P2d41428f (transcrição retirada: tem fórmula), P039ae129.
- O "~~texto~~" na entrada das sessões é a marcação de ITÁLICO do site (QuestaoCartao.tsx a mostra em itálico; regra
  já no PROMPT-SESSAO-RESOLUCOES.md). Não há erro de extração: Pa582852a, Pd28a6e90, P1daa8136, Pff5a68fe, P0bf82481,
  P2ea30ef7 e Pa2383034 estão certos no site.
- UFRR 2025/2026: links do gabarito oficial pós-recursos achados (editais 97/24 e 93/25, anotados na `nota` das provas),
  mas editais.ufrr.br e web.archive.org não respondem daqui: letras não conferidas. Tentar de novo noutra rodada.
- Física P88f37147 (Fema, ITER): motivo final no registro (duas afirmativas falsas, sem errata): fica fora; dono decide.

## Caixa das sessões (dono, 13/11)
As sessões falam com a coordenadora só por docs/resolucoes/caixa/<m>.md (commit). A coordenadora deixa um vigia em segundo
plano (Bash em background: git fetch a cada 2 min; termina quando a pasta caixa/ muda em origin) e o rearma depois de
tratar cada mensagem. Na rodada, ler também a caixa.

## Rodada da conferência (a cada 3 horas)
1. `git pull --rebase --autostash origin app-prototipo-completo`.
2. Contar os lotes de cada sessão (commits com o id dela: `git log --since=<criação> --format=%b | grep -c <id>`).
   Lote começado não se interrompe (dono, 13/11): a sessão só para quando termina os lotes que já abriu. Por isso o
   limite vem no prompt (gravados + abertos < 10 para abrir outro). Na rodada, quem tiver gravados + abertos >= 10 (ou
   contexto > 40%) recebe send_message priority later: não abrir lote novo, terminar os abertos e mandar TROCA.
   Não esperar a sessão pedir (dono, 13/11: Física chegou a 21 lotes sem troca).
   Para cada sessão trabalhando: get_session. Parada com matéria ainda por fazer → send_message (priority later):
   "Continue: próximo lote da sua matéria, sem encerrar a vez entre lotes, até o dono mandar parar." Falha por limite
   ou créditos → anotar em docs/resolucoes/conferencia.md e avisar o dono uma vez. Pedido de aprovação sem resposta →
   avisar o dono uma vez. Pediu TROCA → abrir a sessão nova (acima).
3. Prints: questões pendentes por print (docs/resolucoes/lotes-<m>.md) que não estejam em docs/provas/prints-refeitos.md
   → `python3 ferramentas/ingestao/refaz_print.py <prova> <n> ... --previa`, conferir a imagem, gravar, commit, avisar a
   sessão da matéria.
4. `cd app && flock /tmp/converte.lock python3 scripts/converte.py && npx tsc --noEmit -p . && npx vitest run`.
5. Publicação a cada 500 resoluções novas (compare com `ultima.resolvidas` de docs/resolucoes/publicacao.json), tudo
   verde: create_deployment produção (time team_ktkWAyK9Cc0bRLSR5qu5GW5b, projeto prj_hVOH7ZV6islXYIUgzmgiJqxvNspM,
   gitSource github ct7k8m2mjh-afk/Aprendice ref app-prototipo-completo sha=HEAD, projectSettings vite, rootDirectory
   app, installCommand "npm ci", buildCommand "python3 -m pip install -q --break-system-packages pillow numpy scipy &&
   python3 scripts/converte.py && npx vite build", outputDirectory dist, nodeVersion 22.x,
   sourceFilesOutsideRootDirectory true). As prévias automáticas da Vercel estão desligadas (12/11). Quando o site
   servir a contagem nova: atualizar publicacao.json, commit, push, avisar o dono em 2 linhas por matéria.
6. Painel "O que falta": só se passou de mais 1.000 resolvidas desde a última atualização (seção abaixo).
7. Nada novo: não fazer nada e não avisar.

## Esperando o dono
Regra (dono, 13/11): problema de questão vem das sessões para a coordenadora, que resolve sozinha (web, print, reclassificação).
Só o que não tem solução sem o dono, EM ÚLTIMO CASO, vai para o painel "O que falta" como item `decidir` (com `id`): o dono
escreve a instrução na caixa de texto abaixo do item e envia pela página. Em toda rodada: ArtifactData list da coleção
`respostas` do painel; para cada doc com `lido:false`, cumprir a instrução, gravar `retorno` (o que foi feito) e `lido:true`
com update, e marcar o item como feito no o-que-falta.json.
- Limite semanal da conta em aviso (renova 19/11). Teste de cobertura animada de Matemática voltou ao verde (82,3%, 13/11).
- Decidido pelo dono em 13/11 (painel): "questão anulada pelo Aprendice" para gabarito oficial contra os fatos ou enunciado
  com erro/dado faltando — lista em app/conteudo-fonte/anuladas-aprendice.json (12 questões: Pc90de958, Pd7fbdc3f,
  P855bb53e, Pb1863457, Pe5a5d0ab, Pb024ee4d, P88f37147, P7f440cd0, P525706b9, Pcc7ef326, Pd1c0ef9d, Pc520853b). Caso
  igual que aparecer: acrescentar a linha nesse arquivo e tirar a id das pendências do registro. Letras de música e fotos
  de imprensa: uso autorizado para fins educacionais. Teste da fábrica pela API: o dono não vai fazer.
- Checklist de provas para baixar à mão: https://claude.ai/artifact/AfS22NUUP69GNTWsEKV5YC (coleção `provas`;
  campos prova, gabarito, obs). Faltam, entre outras: Famema 2023 (caderno da Prova II v1), FMJ 2020 e 2023.

## Painel "O que falta no Aprendice" (pedido do dono, 13/11)
Artefato: https://claude.ai/artifact/L5VSRBJLyyadbmaWMmNwj4 (tem o link do site no topo). Atualizar SÓ a cada 1.000
questões resolvidas a mais (dono, 13/11). Última atualização: 18.060 feitas (13/11, com a seção Provas pedida pelo dono) → próxima ao passar de 19.060. Para atualizar: mude o item em docs/resolucoes/o-que-falta.json (estado falta/andamento/decidir/feito), rode o converte,
depois `python3 ferramentas/resolucoes/painel_falta.py` e publique docs/resolucoes/o-que-falta.html nesse URL (Artifact,
`url` = o link acima, de outra conversa; read antes).

## Publicação
Última no ar: dpl_2nXjFi2ruBj9zHwh8Lzn4G2ZwAni (commit 8f6e726b, 13/11): 18.413 resoluções.
Próxima ao passar de 18.913.
Contagem: `com_resolucao` de https://aprendice.vercel.app/conteudo/relatorio.json (ou do relatório local do converte).

Coordenadora atual: session_01PveEKabuyZnqVN65W5FfEc (desde 12/11, 23h UTC).
