# Coordenação das sessões de resolução

Arquivo de passagem entre coordenadoras. Leia inteiro antes de agir. Atualize no fim de cada ação o que mudou.
Sistema refeito em 13/11/2026 a pedido do dono (lote maior, nenhuma sessão parada, nada de pedir permissão,
coordenação só ativa quando há tarefa, economizar o limite semanal melhorando o método).

## Papel da coordenadora
Só organiza: abre sessões de matéria, trata as pendências que chegam na caixa, publica, cuida do painel. NUNCA resolve
questão. Fala com o dono em português do Brasil, simples. Mantém a própria conversa curta: troca por uma coordenadora nova
(create_session com o prompt da seção abaixo) ao passar de 25% do contexto, escrevendo o estado aqui antes.

## Como trabalha (sempre por evento, nunca esperando)
- É acordada só por: a tarefa agendada de hora em hora (que entra nesta conversa), uma mensagem do dono, ou o aviso de um
  agente dela terminando. Em cada despertar faz a RODADA abaixo e encerra a vez. Sem nada novo: não escreve nada ao dono.
- NUNCA: espera publicação de pé (dispara e confere na rodada seguinte); faz laço de consulta (git, eventos, site);
  roda converte/tsc/vitest na própria conversa (as sessões já rodam; antes de publicar, um build em segundo plano);
  lê arquivos ou eventos grandes inteiros; manda rajadas de recados; põe dois agentes gravando ao mesmo tempo no mesmo
  ramo. Agente que grava: um por vez, com `git add` só dos arquivos dele e `git pull --rebase` antes do push.
- Nunca usa send_message com as sessões (pede aprovação ao dono). Fala com elas criando a sessão com o prompt certo.

## Sessões de matéria
- 6 matérias ao mesmo tempo (dono, 13/11: pediu Geografia de volta e autorizou uso extra): Matemática, Física, Química,
  Biologia, Português e Geografia. História, Inglês e Filosofia e Sociologia acabaram.
- Modo enxuto (PROMPT-SESSAO-RESOLUCOES.md): lote de 60, 6 agentes resolvem em paralelo, 2 conferentes (30 cada) em
  segundo plano enquanto o próximo lote já anda; a conversa principal só organiza. Troca pelo contexto (40%), não por
  número de lotes. Sessão de revisão separada: NÃO (avaliado em 13/11: o lote fica preso à sessão que o abriu, falar entre
  sessões pede aprovação ou consulta repetida, e o conferente em segundo plano já trabalha em paralelo e às cegas).
- A sessão escreve FIM, PENDENCIAS ou ACABOU em docs/resolucoes/caixa/<m>.md (commit) e, no FIM, encerra.
- Abrir sessão: create_session (Opus, ambiente env_01PD36og67UPYvCWa3DcbQpX, source_url
  https://github.com/ct7k8m2mjh-afk/aprendice, source_revision app-prototipo-completo, permission_mode acceptEdits, tag
  aprendice-resolucoes, extra_allowed_tools ["Bash","Edit","Write","Read","Glob","Grep","Agent","Skill","WebFetch","WebSearch"],
  título "Resoluções — <Matéria> (<data hora>)") com o prompt-padrão abaixo.

## Prompt-padrão de uma sessão de matéria
"Você é a sessão de resoluções de <MATÉRIA> do Aprendice. Fale português do Brasil. Na raiz do repositório, rode
`python3 ferramentas/resolucoes/vez.py <m>`: se der OCUPADO (outra sessão desta matéria gravou há menos de 45 min), encerre
sem fazer nada. Senão, leia CLAUDE.md e siga integralmente docs/resolucoes/PROMPT-SESSAO-RESOLUCOES.md com a sua matéria =
<m>, em especial o MODO ENXUTO (a sua conversa só organiza; resolver, conferir e abrir prints é sempre trabalho de agentes),
o lote de 60 (`lote.py proximo <m> 60 --novo`) e o passo 9 (ao passar de 40% do contexto, termine os lotes abertos,
escreva FIM na caixa e encerre). Retome antes os lotes abertos que o vez.py listar (`--retomar <lote>`). Prepare o
ambiente em segundo plano: `cd app && (test -d node_modules || npm ci); python3 -m pip install -q --break-system-packages
pillow numpy scipy; flock /tmp/converte.lock python3 scripts/converte.py`. Nunca use send_message e nunca pare esperando
aprovação ou resposta: pendências e avisos vão para docs/resolucoes/caixa/<m>.md (veja caixa/LEIA.md), com commit e push."
(Matemática: acrescentar a regra da animação — campo `conta` no formato que o motor anima; teste motorConta exige 70%.)

## RODADA (a cada despertar)
1. `git pull -q --rebase --autostash origin app-prototipo-completo`.
2. Caixa: `git log --since=<última rodada> --format=%h -- docs/resolucoes/caixa/` e ler só os blocos novos.
   FIM → abrir a sessão nova da matéria (prompt-padrão). ACABOU → abrir Geografia no lugar. PENDENCIAS → anotar em
   "Pendências a tratar" e tratar com UM agente (worktree próprio), não na conversa.
3. Sessões vivas: `python3 ferramentas/resolucoes/vez.py <m>` para cada matéria da tabela. LIVRE com sessão marcada como
   trabalhando = a sessão caiu ou parou → abrir nova (a anterior: anotar para o dono arquivar).
4. Publicação a cada 500 resolvidas a mais que publicacao.json: build em segundo plano (converte+tsc+vitest), verde →
   create_deployment (dados na seção Publicação) e ENCERRAR a vez; na rodada seguinte conferir a contagem no site e
   registrar.
5. Painel: só a cada 1.000 resolvidas a mais (seção Painel); nesse momento ler também as respostas do dono (ArtifactData
   list `respostas`), cumprir e gravar o retorno.
6. Atualizar a tabela abaixo e encerrar.

## Sessões (13/11/2026, 05h47 UTC)
| Matéria | Sessão | Situação |
|---|---|---|
| Matemática | session_01PveEKWKTewFDUJvA5Y5s91 | trabalhando (aberta 13/11 05h47; anterior aSPVE deu FIM) |
| Física | session_01PveEKXXFLhp4ro4vnf1rh7 | trabalhando (aberta 13/11 05h32 pela coordenadora antiga; anterior X5T4 deu FIM) |
| Química | session_01PveEKZxREDvirT6VTx5nKy | trabalhando (aberta 13/11 05h52 pela coordenadora antiga; FIM da anterior após qui-0063 já tratado) |
| Geografia | session_01PveEKaHNFQdko42Ddhy3XZ | trabalhando (aberta 13/11 05h52 a pedido do dono: 6ª sessão, além do limite de 5) |
| Biologia | session_01PveEKb648gnNx7gv9Y2Xbs | trabalhando (aberta 13/11 05h03; FIM cancelado, limite 40%) |
| Português | session_01PveEKY3G8XPW7thJLdH3jL | trabalhando (aberta 13/11 05h47; anterior WhAd deu FIM) |
Paradas do sistema novo (o dono pode arquivar): Mat session_01PveEKaSPVEijwvkvEUmmWx, Fís session_01PveEKX5T4pY3Xx4fn4PR8G,
Por session_01PveEKWhAdHoSJKa5to3K8D.
Última rodada: 13/11 05h44 UTC (caixa lida até 2df8c094). Agente de pendências da caixa disparado 05h48 (um por vez).
Antigas, todas paradas (o dono pode arquivar): Mat session_01PveEKZRuBiHmg4Hm9HT1J1, Fís session_01PveEKXmCjqipC4JbNj9w73,
Quí session_01PveEKadroQ4kNhHt52L2hy, Bio session_01PveEKaptKYR7JXwbmxDGXx, Por session_01PveEKaBDR2WGsLQUacMYFY; e as
anteriores já listadas para arquivar. Coordenadoras antigas: session_01PveEKWW3t7ZxcdDQKNiYWa, session_01PveEKabuyZnqVN65W5FfEc.
COORDENADORA ATUAL: session_01PveEKXX1TDGcjetcyMQLVm (13/11 05h03), acordada a cada 20 min por 3 tarefas (minutos 3, 23, 43: trig_01L1hQ4kKsZUoi153z1k5wqY, trig_01GNukL58HkyvYTSY6ao7ujk, trig_01LRUGodxhrgPzxYEYvKm4sn).
Ambientes: as sessões usam o Default (env_01PD36og67UPYvCWa3DcbQpX, tem a chave da Vercel; o repositório vem no source_url).
O ambiente "Fabrica" (env_01QMooYA98c8e8MNnWwkV34D) tem o repositório salvo e a APRENDICE_API_KEY (fábrica pela API).

## Uso da conta
O limite semanal acabou em 13/11 (renova 19/11, 1h de Brasília). O DONO AUTORIZOU continuar com uso extra (13/11, ~06h UTC): não pausar por isso.
Arquivadas em 13/11 a pedido do dono: todas as sessões de resolução paradas (sistema novo 1 de Mat/Fís/Quí/Por, Geografia antiga,
Filosofia e Sociologia, História, "Resoluções ENEM e vestibular", Química 3). A coordenadora session_01PveEKabuyZnqVN65W5FfEc pode ser arquivada.

## Permissões (medido em 13/11)
- Sessões de matéria: Bash/Edit/Agent/Write/Read não pedem; só send_message pedia (por isso a caixa).
- Coordenadora: create_session pede UMA vez por sessão; create_deployment/get_deployment (Vercel) e Artifact/ArtifactData
  pedem a cada uso por política do servidor. Por isso: publicar só a cada 500, painel só a cada 1.000, e nada de
  get_deployment (conferir pelo relatorio.json do site com curl).

## Pendências a tratar
- Física (FIM 13/11 05h29): print P8de70adc (fim das linhas cortado, °F); P9615ec2a (UERR q44: conferir no caderno se é esta a questão 44 do gabarito; se for, resolver com C e alerta); texto P42642b2d (0,2 kg → 2,0 kg pelo print).
Prints, reclassificações e gabaritos que chegaram das sessões e ainda não foram tratados. Restos de 13/11: gabaritos da
UFRR (editais 93/25-CPV e 97/24-CPV; site deu 503) — Pdfed097c, P4e8b41b9, P523fcc4a, P802620a5, P1b018f21, Pdfefb95a,
Pb2ea6273, Pdc6fdc40, P91b7dbde, P6e4b0c62, Pf34120b0; IME 2024 q36 (P1f92eb26) errata E a confirmar (resolução pronta em
docs/resolucoes/trabalho/qui-0055.parte1.json da sessão antiga — se não existir aqui, a sessão de Química refaz).

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
- Revisar como "anular" (gabarito oficial contra a conta, gravadas com alerta pelo prompt antigo): Pae0c806e, P1c5351e6,
  P4db2bbce, Pb2b6d654; e P9615ec2a (pendente). Regra nova no PROMPT-SESSAO (13/11 05h55).
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
Em andamento (13/11 05h56): dpl_5xTE1MfLrc4mzG1QxsSmMzDEamEP, commit 78298a33, build local verde (786 testes), 19.483 resoluções
(mat 2581 · fís 1823 · quí 2259 · bio 2158 · por 3085 · geo 1097 · his 2451 · fs 1562 · ing 2467). Na rodada seguinte: conferir
`com_resolucao` no site; se bater, atualizar publicacao.json e a linha "Última no ar".
Contagem: `com_resolucao` de https://aprendice.vercel.app/conteudo/relatorio.json (ou do relatório local do converte).

Coordenadora atual: ver a tabela de sessões e a tarefa agendada (13/11: nova coordenadora enxuta).
