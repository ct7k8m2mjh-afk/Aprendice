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
- Modo enxuto (PROMPT-SESSAO-RESOLUCOES.md): lote de 50, 200 questões por sessão (4 lotes; dono 19/11), 6 agentes resolvem em paralelo, 2 conferentes (25 cada) em
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
o lote de 50 (`lote.py proximo <m> 50 --novo`) e o passo 9 (200 questões por sessão = 4 lotes de 50; ao gravar o 4º lote, ou se passar de 40% do contexto antes, termine os lotes abertos,
escreva FIM na caixa e encerre). Retome antes os lotes abertos que o vez.py listar (`--retomar <lote>`). ESTEIRA (dono, 19/11: tudo resolvido nesta tarde): não espere a conferência de um lote para abrir o próximo — enquanto os conferentes trabalham no lote N, abra o N+1 e dispare os resolvedores (no máximo 2 lotes abertos ao mesmo tempo). Prepare o
ambiente em segundo plano, LOGO NA PRIMEIRA AÇÃO e em dois comandos separados (o lote só abre com o banco montado; o
converte leva ~4 min e não precisa do npm): (1) `cd app && python3 -m pip install -q --break-system-packages pillow numpy
scipy && flock /tmp/converte.lock python3 scripts/converte.py`; (2) `cd app && (test -d node_modules || npm ci)`. Enquanto o
converte roda, leia o CLAUDE.md e o prompt; não use sleep: o `lote.py proximo` já espera o converte sozinho. Nunca use send_message e nunca pare esperando
aprovação ou resposta: pendências e avisos vão para docs/resolucoes/caixa/<m>.md (veja caixa/LEIA.md), com commit e push."
(Matemática: acrescentar a regra da animação — campo `conta` no formato que o motor anima; teste motorConta exige 70%.)

## RODADA (a cada despertar)
MATÉRIAS DIVIDIDAS (19/11 17h29; 19h05 Português em 4 partes — partes.json): ler também caixa/<m>-p<k>.md;
`vez.py <m> --parte 2`; ao reabrir a parte 2, o prompt leva "PARTE 2" e `--parte 2` (ver a seção "Matéria dividida em
partes" do PROMPT-SESSAO-RESOLUCOES.md). A sessão sem --parte é a parte 1.
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

## Provas novas (dono, 19/11)
As provas novas (baixadas pelo dono ou achadas depois; lista no artefato "Provas para baixar", docs/provas/ARTEFATO-PROVAS.md)
só entram na fila de resolução DEPOIS que acabarem todas as questões atuais pendentes de todas as matérias (vez.py dando
ACABOU em todas). Até lá: só registrar que existem; não integrar ao banco nem abrir lotes delas. Quando tudo acabar,
integrar essas provas e mandar para as sessões de resolução.

## Física acabando (dono, 19/11 ~17h)
O dono avisou: o próximo lote de Física termina tudo o que falta (restavam pouco mais de 200). Quando o vez.py de Física der
ACABOU, NÃO reabrir sessão de Física (Geografia já está aberta). Provas novas só depois que TODAS as matérias acabarem
(seção "Provas novas").

## Trabalho repetido (conferido 19/11 21h15)
29 questões de Português foram resolvidas duas vezes em 19/11: pela fábrica (por-0104) e pela sessão da parte 3 (por-p3-0001),
porque a sessão nova escolheu as questões antes de o registro do lote da fábrica chegar ao git (corrida). Mais 11 repetidas
em 11–13/11 (por-0024/27/32/44 × por-0046; por-0075/78 × por-0082; por-0084/85/86 × por-0088). Custo extra da API ~US$ 3.
REGRA para qualquer trabalho em paralelo: logo depois do `lote.py proximo`, commit e push do registro ANTES de resolver
(e `git pull` antes do proximo). Hoje só a fábrica trabalha em Português, sem risco.

## Estado 20/11 22h UTC (coordenadora nova, outra conta) — vale acima das seções antigas
- Prompt da passagem: docs/resolucoes/PROMPT-NOVA-COORDENADORA.md. As sessões da conta antiga (inclusive as 3 de pendentes
  de 06h10 e o ambiente env_01PD36og...) não existem nesta conta; a fonte de verdade é o git.
- Sessões de pendentes abertas às 22h02 UTC (ambiente Default da conta nova), retomando os 13 lotes abertos e depois a fila
  "classificação: resolver na matéria nova" (224): session_01Tq253XXh44KrKH1tkSh3AZ (bio/qui/mat/fis),
  session_01Tq253YL64uC84SwEt9PDxi (geo/his), session_01Tq253UuNCgZUQ9sTxeyRNY (por/fs/ing). 45 min sem commit = caiu; abrir
  outra com o mesmo prompt (seção 4.1 do prompt da passagem).
- No ar: dpl_Ho7ikkdfpS7HHZkXnFsGzFR22Kas (commit 62c4b05e, login de demonstração), 26.549 resoluções. publicacao.json corrigido.
- Conferido no site às 22h15 UTC: com_resolucao soma 26.549 (relatorio.json). Ambiente novo da conta nova: "Aprendice"
  (env_017uFXKuGZ3YGuXrgUUTdSAd, libera aprendice.vercel.app). Faltam os conectores do Vercel e do Supabase: pedido ao dono.
- Continua valendo "NÃO PUBLICAR" (abaixo) até o dono configurar o Supabase.
- "Por que eu errei" fracos: dono decidiu (20/11 22h) "ignora API, faça aqui no Claude". Roteiro em
  docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md (provas-alvo, ~1.700: mat ~436, fís ~825, quí ~435). Sessões abertas 22h13 UTC:
  session_01Tq253ZPg9jdmFb9cbntD91 (mat → qui, série mq) e session_01Tq253VAQptS9rzESrtPqkE (fís, série fis). Caixa: conteudo.md.
- DECISÕES DO DONO 20/11 22h20 UTC ("todas sim", itens 1–6 e 8 da seção 6 do prompt da passagem): excluir conta no Perfil,
  3 ajustes de layout, 23 fontes de flashcards, subtemas novos sugeridos, 66 "anular" viram "Questão indisponível", 7 itens
  "para o dono" do PLANO.md, apagar o ramo rascunho-teoria-lentes (conteúdo já está em app/conteudo-fonte/materias/his.json;
  o GitHub recusou o delete a partir da sessão: fica com o dono). Sessões 22h21: session_01Tq253Y5RX4sCDxee8CTceS (telas;
  relatório docs/revisao-site/2026-11-20/decisoes-do-dono-telas.md) e session_01Tq253ZZrpookBgGHXXqZHc (conteúdo;
  relatório docs/resolucoes/decisoes-do-dono-conteudo.md). Arquivar sessões da conta antiga: só o dono.

## REGRA DO DONO (21/11/2026): NO MÁXIMO 4 SESSÕES AO MESMO TEMPO
"Termina a tarefa ou matéria e liga a próxima." Motivo: em 20/11 às 22h51 oito sessões juntas estouraram o limite de 5 h da
conta. Peça a cada sessão no máximo 3 agentes em paralelo. Fila (21/11 04h35 UTC):
- 21/11 06h15 UTC — RODANDO (3): marketing (session_01Tq253ZLvhTYPTJzzEKVyyv; ~150 textos aplicados às 06h08,
  amostra conferida pela coordenadora em 390 px: entrada, início, Hoje, matéria, revisão — ok); erradas mat→qui
  (…VTRm1LJn4ApYvF6sn; estava parada esperando um agente travado, cutucada às 06h09); erradas fís continuação
  (…YLHV4apz1hEmfwXme, nova; a anterior fez fis-01 a fis-03, 66 textos). Geo arquivada (67 indisponíveis no total).
- ESPERANDO VAGA: nada. Próximos candidatos: 4.4 revisão final (depois das contas no ar).
- ACABARAM (arquivadas): pendentes das 9 matérias (ACABOU; his ficou com 2 pendentes); telas das decisões do dono (FIM;
  conferido pela coordenadora em 390/1280, claro/escuro: Perfil com Excluir minha conta, capa do Treino geral, página
  não encontrada, Revisão, questão); conteúdo das decisões do dono (FIM: 23 fontes, 25 subtemas e 266 questões movidas,
  66 indisponíveis); erradas mq-01 a mq-03.
- Feito pela coordenadora: folha de caderno quadriculado (37102cff2).

## Estado 20/11 06h10 UTC (antigo)
Fila normal: TODAS as matérias acabaram (falta 1 de História, incluída abaixo). Fábrica de Português parou em 19/11 21h38 (13 lotes, 654;
as partes 2–4 cobriram o resto). Pendentes "classificação: resolver na matéria nova" (418) com 3 sessões de pendentes:
session_01PveEKYJhKA7RfgZCSftpct (bio/qui/mat/fis), session_01PveEKaCdFfRjWqaTYysva1 (geo/his), session_01PveEKYZChYRBxQSMaSYeoU
(por/fs/ing). Ficam para o dono: 66 "anular" (já no site como indisponível ou para decidir), 17 outra matéria, 4 obra.

## NÃO PUBLICAR até o dono configurar o Supabase (20/11 04h45)
O ramo já tem as contas de verdade (commits 009df6826, 058fa7ffc, 47e5e6d9c, 834909bfa; docs/contas.md). Publicar antes de o dono
configurar Site URL/Redirect (Authentication → URL Configuration) e SMTP próprio (Resend/Brevo) deixa os alunos sem conseguir se
cadastrar. Site no ar: dpl_Ho7ikkdfpS7HHZkXnFsGzFR22Kas (62c4b05e, login de demonstração). Quando o dono avisar: publicar,
testar cadastro real com conta de teste (apagar depois) e mandar o passo a passo do admin. Pendente decisão: botão "Excluir
minha conta" no Perfil (LGPD).

## Revisão completa do site (dono, 19/11 ~21h30) — ANTES de publicar de novo
1) Fundo "tom da matéria" (dono escolheu; nunca branco/preto; creme fora das matérias; Bio claro #EEF4EA/#FAFCF7, escuro
#0F1A12/#17241A) — agente implementando. 2) Depois: 4 revisores independentes sobre UM build (casca; 9 matérias; questão e
correção; dados/contagens/console), 390/768/1280/1440, claro/escuro, cada caixa de texto, fonte, tamanho, entrelinha,
espaçamento entre letras, botões, informação no lugar certo, comparando com o sistema (app-atual/design + DESIGN.md).
3) Corrigir tudo (decisão visual nova → perguntar ao dono). 4) Nova revisão até zero. 5) Publicar (inclui Questão
indisponível, RECLASS de Português e as resoluções novas).
Estado 19/11 22h20 UTC: fundo feito (commit e6b9c5533; DESIGN.md "Superfícies"). Build da revisão em /tmp/qa servido em
http://localhost:4190 (só nesta coordenadora). 4 revisores rodando (casca, matérias, questão/correção, dados); instruções
comuns em scratchpad/qa-comum.md. Pendente de decisão do dono: contraste da cor da matéria direto no fundo claro (Quí 4,18,
Bio 4,33, Fís 4,36; título/ícone ≥3 passa) e item ativo do menu/etiqueta de nível 3,94–4,48 (cores da paleta aprovada).

## Correção da revisão (19/11 ~23h UTC) — ver docs/revisao-site/2026-11-19/PLANO.md
Pacote A (questão/correção, código) e C (dados) com agentes desta coordenadora no checkout principal; depois B (matérias e
casca) e D (motor de animação); depois nova revisão completa e publicação. Fábrica de CONTEÚDO pela API:
session_01PveEKZzai8tN1n9vxoQYqX (prompt docs/resolucoes/PROMPT-FABRICA-CONTEUDO.md; teto US$ 40; caixa caixa/conteudo.md):
flashcards e frases de fis/his/geo/ing/fs + "Por que eu errei" fracos (6.347; dono: só o que couber, ENEM e alvo primeiro).
20/11 01h UTC: pacotes A, B, C, D feitos (motor b20901f9a); fontes Toda Matéria trocadas (6fcfd743d); dicionário em
andamento. 2ª RODADA da revisão rodando (4 revisores; relatórios irão para docs/revisao-site/2026-11-20/; build em /tmp/qa,
porta 4190). Depois: corrigir o que sobrar, 3ª rodada se preciso, e PUBLICAR.
Orçamento API: 200 = ~81 gastos + 60 classificação + ~15 Português + 40 conteúdo.

## Fábrica de CLASSIFICAÇÃO pela API (dono, 19/11 ~21h15) — FIM 20/11 00h58
6.590 questões mudaram de subtema (428 de matéria), 470 sugestões de subtema novo, US$ 46,22. Saídas em
docs/resolucoes/classificacao/ (resumo.md, mudancas.json, sugestoes-novos-subtemas.md). PENDENTE: dono decidir os subtemas
novos; as ~428 que mudaram de matéria precisam de resolução na matéria nova (pendentes "classificação") — abrir sessão de
pendentes depois da revisão do site.

Sessão session_01PveEKaueZxMsGjqv3gMYrd (ambiente Fabrica), prompt docs/resolucoes/PROMPT-FABRICA-CLASSIFICACAO.md.
Confere o subtema de TODAS as questões; muda só com duas respostas iguais às cegas; sem subtema bom: encaixa no mais próximo e
anota a sugestão (docs/resolucoes/classificacao/sugestoes-novos-subtemas.md) para o DONO decidir se cria. Teto US$ 60.
Caixa: docs/resolucoes/caixa/classificacao.md (AVISO PILOTO CLASSIFICAÇÃO → levar ao dono; FIM → levar o resumo e a lista de
sugestões ao dono; NÃO reabrir sem ordem).

## Fábrica pela API (dono, 19/11)
Teto: US$ 200 de créditos da API. Matéria sugerida para a fábrica: Português (a sessão deu FIM em 19/11 ~15h; NÃO reabrir
sessão de Português enquanto a fábrica estiver com a matéria, para não haver dois trabalhando nos mesmos lotes).
Aguardando o OK do dono para abrir a sessão "Fábrica" (ambiente Fabrica, env_01QMooYA98c8e8MNnWwkV34D).
Prompt: docs/resolucoes/PROMPT-FABRICA-PORTUGUES.md (o dono abre a sessão). Na caixa por.md, o FIM da fábrica NÃO reabre
sessão de Português: ler o AVISO PILOTO FÁBRICA e levar o resultado ao dono, que decide se a fábrica continua.

## Sessões (19/11/2026, 14h58 UTC)
| Matéria | Sessão | Situação |
|---|---|---|
| Matemática parte 1 | — | ACABOU (19/11 19h20, mat-0081). Matemática inteira terminada. |
| Física | — | ACABOU (19/11 18h18). Não reabrir. |
| Química | — | ACABOU (19/11 18h51). Não reabrir. |
| Geografia parte 1 | — | ACABOU (19/11 18h51). Não reabrir. |
| Biologia | — | ACABOU (19/11 18h19, bio-0077). Não reabrir. |
| Português | session_01PveEKX1JnJpMCfgHmpRupU (FÁBRICA pela API) | trabalhando: piloto por-0094 ok (US$ 6,11); o dono autorizou continuar, lotes por-0095/0096 em esteira. Não abrir outra sessão de Português |
| Matemática parte 2 | — | ACABOU (19/11 18h57). Não reabrir. |
| Português parte 3 | session_01PveEKawjpi7T2DjhNLhHCY | trabalhando (aberta 19/11 19h06 para TERMINAR a parte 3; caixa por-p3.md) |
| Português parte 4 | — | ACABOU (19/11 19h26). Não reabrir. |
| Geografia parte 2 | — | ACABOU (19/11 18h49). Não reabrir. |
| Português parte 2 | session_01PveEKaafKU4T97asCdKPew | trabalhando (aberta 19/11 19h25 para TERMINAR, ~44) |
| Inglês + Filosofia e Sociologia | — | ACABARAM (19/11 19h35). Não reabrir. |
| Pendentes Português (obras) | — | ACABOU (19/11 ~20h15). |
| Pendentes Português (demais) | — | ACABOU (19/11 ~20h15). |
| Pendentes Inglês (prints) | — | ACABOU (19/11 ~20h15). |
| Pendentes Bio/Quí/Mat/Fís | — | ACABOU (19/11 ~20h15). |
| Pendentes Geo/His/FS | — | ACABOU (19/11 ~20h15). |
"ANULAR" (53, docs/resolucoes/anular-para-o-dono.md): DONO 19/11 ~19h45 decidiu: vão ao site como "Questão indisponível" (print visível, sem responder nem corrigir; fora de treinos e simulados). Agente implementando; não reabrir.
Caídas pelo limite em 13/11 (o dono pode arquivar): Mat session_01PveEKWKTewFDUJvA5Y5s91, Fís session_01PveEKXXFLhp4ro4vnf1rh7,
Quí session_01PveEKZxREDvirT6VTx5nKy, Geo session_01PveEKaHNFQdko42Ddhy3XZ, Bio session_01PveEKaPh1PAjF3bRbuJ5fG, Por session_01PveEKY3G8XPW7thJLdH3jL.
Paradas do sistema novo (o dono pode arquivar): Mat session_01PveEKaSPVEijwvkvEUmmWx, Fís session_01PveEKX5T4pY3Xx4fn4PR8G,
Por session_01PveEKWhAdHoSJKa5to3K8D, Bio session_01PveEKb648gnNx7gv9Y2Xbs.
19/11 04h45 UTC: as 6 sessões acima CAÍRAM em 13/11 ~06h10 (limite semanal; status failed). Limite renovou 19/11 04h.
vez.py: todas LIVRES; lotes a retomar: mat-0064, mat-0065, fis-0062, qui-0064, por-0091, por-0093, geo-0039, geo-0040 (bio nenhum).
Reabertas as 6 em 19/11 14h58 com aprovação do dono.
Última rodada: 19/11 04h45 UTC (caixa lida até 57a5a8a5; nada novo desde 13/11). Novas: DADO P233b33fd (texto de apoio colado na E); GABARITO P0e5ecbdc (UFRR, Edital 93/25). Agente de pendências da caixa disparado 05h48 (um por vez).
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
questões resolvidas a mais (dono, 13/11). Última atualização: 23.815 feitas (19/11 ~18h30) → próxima ao passar de 24.815. Para atualizar: mude o item em docs/resolucoes/o-que-falta.json (estado falta/andamento/decidir/feito), rode o converte,
depois `python3 ferramentas/resolucoes/painel_falta.py` e publique docs/resolucoes/o-que-falta.html nesse URL (Artifact,
`url` = o link acima, de outra conversa; read antes).

## Publicação
ATUAL: ver "Estado 20/11 22h UTC" acima e publicacao.json (no ar: dpl_Ho7ikk..., 62c4b05e). O texto abaixo é antigo.
Disparada 20/11 02h14 (pedido do dono): dpl_AX9c2qaAryjD2UwyHYL8SNSukrX4 (commit dd870bf8, 874 testes verdes, 26.549 local; inclui fundo, indisponível, pacotes A–D, classificação). Conferir no site e registrar. Falta ainda: privacidade do perfil (F1), F2, F3 → publicar de novo.
Última no ar: dpl_HVBmf5cTNEmUBmpDrfzbnPijjmF8 (commit 178ab0a4, 19/11 20h33, conferido no site 20h24): 26.300 resoluções. Próxima: com o 'Questão indisponível' (depois da 2ª revisão visual) e/ou quando a fábrica de Português acabar.
Contagem: `com_resolucao` de https://aprendice.vercel.app/conteudo/relatorio.json (ou do relatório local do converte).

Coordenadora atual: ver a tabela de sessões e a tarefa agendada (13/11: nova coordenadora enxuta).
