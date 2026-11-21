# Retenção: os momentos que fazem o aluno voltar

Estrategista de retenção, 20/11/2026. Base: `CLAUDE.md`, `PRODUCT.md`, `ferramentas/fabrica/agentes/marketing/RETENCAO.md`,
`docs/estrategia-revisao.md` (Método Aprendice de Revisão) e o código do site em `app/src` (ramo `app-prototipo-completo`).

**Status:** as mensagens abaixo são RASCUNHO. Ainda passam pelo redator (`REDATOR.md`) e pelo revisor de marca
(`REVISOR.md`) antes de ir ao site. Nenhum código foi alterado.

Regras seguidas em todos os rascunhos: só dentro do site; números só os reais do progresso do aluno; sem emoji; sem
culpa nem cobrança; sem contagem regressiva falsa; sem perda fictícia; sem comparação com outros alunos; curtas.
Os trechos entre chaves (`{n}`) são números ou nomes tirados dos dados reais, nunca fixos.

---

## 1. O que o site já sabe do aluno (dados reais, onde estão)

| Pergunta | Existe? | Onde (campo exato / função) | Observação |
|---|---|---|---|
| Data da prova | sim | `estado.perfil.datasProva[provaId]` ("AAAA-MM-DD"); a próxima: `logica/revisao.ts:proximaProva`, `agendaDe(e).prova` / `.provaId`; dias que faltam: `diasEntre(agora, ag.prova)` | Pedida só no Perfil (`telas/Perfil.tsx:DatasProva`), não nas boas-vindas. `proximaProva` só conta datas **depois de hoje** (no dia da prova, ela some da agenda). |
| Provas-alvo | sim | `estado.perfil.provasAlvo` (ids do catálogo; `'enem'`) | Escolhidas nas boas-vindas (padrão: ENEM) e no Perfil. Nome legível: `ui/revisao/AgendaRevisao.tsx:nomeProva`. |
| Dias estudados (sequência) | sim, derivado | `logica/inicio.ts:diasDeConstancia(e)` e `logica/estatisticas.ts:semana(e).sequencia` (as duas fazem a mesma conta) | Contam só dias com **resposta a questão** (`materias[m].q[id].tent[].ts`). Flashcards (`materias[m].flash[id].hist[].ts`) não entram. Não existe "pausa". |
| Respostas hoje / ontem / semana | sim | `semana(e).hoje`, `.ontem`, `.semana`, `.dias[7]`; meta: `estado.perfil.meta` | Já aparece no menu lateral (`ui/Casca.tsx`, `.meta-lado`). |
| Data do último acesso | **não existe** | — | Existe `estado.mexidoEm` (última mudança de qualquer tipo, inclusive tema e preferências): não serve. O último **estudo** sai da última tentativa: `logica/estatisticas.ts:atividadeRecente(e, 1)[0].ts` (só questões). `materias[m].sessoes` só tem dados migrados do protótipo: o site novo não grava sessões. |
| Erros pendentes de revisão | sim | Vencidos hoje: `logica/estatisticas.ts:questoesVencidas(mc, s, agora, ag)` (erro com certeza primeiro). Na fila, vencidos ou não: `logica/revisao.ts:filaDe(eq, ag)` não nulo. Por questão: `memoriaDe` (`certeza`, `acertos`, `lapsos`, `vence`). Flashcards vencidos: `resumoMateria(...).flashVencidos`. Conteúdos em slides que voltam hoje: `logica/cicloRevisao.ts:revisoesVencidas(s, agora)`. | Entra na revisão: erro, chute (mesmo certo) ou dica (`revisao.ts:fraca`). Volta amanhã (`emNDias(ts, 1)`). Sai depois de 3 acertos espaçados (`SAIDA`). |
| Resultado de fim de sessão | sim | Hoje/Escudo: `estado.sessaoHoje.res` (`'a'`/`'e'`), `treinoMisto.resultadoMisto`; Treino geral: `estado.treinoMisto.res`; Treino da matéria: `estado.treino[m].res`; Flashcards: estado local da tela; Simulado: `estado.simuladosFeitos[]` (`acertos`, `total`, `porMateria`, `itens[].ok`); Revisão em slides: `materias[m].revs[sub].hist[]` + `vence`. | "Treine sua evolução" (escada) **não tem tela de fim**: na última questão, "Concluir" volta à lista do conteúdo. |
| Plano do dia | sim | `logica/hoje.ts:planoHoje(...)` → `sessao.length`, `minutosDe(n, segPorQuestao)`, `nItensSessao`, `itens[].vencidas/certeza/esquecidas/novas/faceisErradas`; Escudo TRI: `escudoTri(...)` (`erradas`, `garantidos`) | Montado a partir das provas-alvo × fraqueza × risco de esquecer. |
| Onde parou | sim | `telas/Inicio.tsx:ondeParou(todas, e)` (conteúdo, próxima questão, `prog.feitas/total`) | Já alimenta "Continue de onde parou". |

### O que a tela Hoje já mostra hoje (`telas/Hoje.tsx:Hoje`)
- Título "Hoje" e o subtítulo literal: "O que estudar hoje, na ordem que mais rende: primeiro o que mais cai nas suas provas, onde você mais erra e o que está para esquecer."
- Bloco da sessão: "{n} questões · cerca de {min} min", "De {k} conteúdos, [começando pelas fáceis erradas do Escudo TRI,] com o seu tempo médio de {x} minutos por questão.", escolha de 15/25/40 min, botão "Começar" (ou "Continuar {i} de {n}" + "Montar de novo").
- Sem nada: "Nada pendente agora" / "Você não tem questões para revisar nem conteúdos pendentes na sua região. Escolha uma matéria para avançar."
- Escudo TRI (com ENEM nas provas-alvo), "A ordem de hoje" com os motivos de cada conteúdo ("Errou com certeza", "{n} voltam hoje", "Ainda não estudado", "Cai muito nas suas provas"...) e "Como a ordem é feita".
- **Não mostra** a data da prova nem quantos dias faltam (isso só aparece na Revisão, `AgendaRevisao`).
- **Achado importante:** a Hoje não é a porta de entrada. Depois das boas-vindas o aluno cai no Início (`/`); o Início não tem link para Hoje; no celular, a barra de abas (Início, Matérias, Simulados, Revisão, Perfil) não tem Hoje. No celular, a Hoje só se alcança pelo botão "O que estudar hoje" da Revisão. Ver "Sugestões ao dono", item 1.

---

## 2. Os momentos

Coluna "implementação": **já existe — só texto** (troca de texto num elemento que já está na tela) | **pequena** (até
cerca de 30 linhas, só com dados que já existem; esboço exato) | **sugestão ao dono** (dado novo, lógica grande, e-mail
ou notificação, mudança de navegação ou de visual, ou decisão dele). Nenhuma "pequena" cria elemento visual novo: o
texto entra em parágrafos e classes que já existem na mesma tela (`miolo`, `fraco`, `q-antes`, `hj-link`); se o
revisor achar que alguma muda o visual, ela vira sugestão ao dono (CLAUDE.md: toda mudança visual precisa da permissão
dele).

### 2.1 Primeira visita (entender o site em 5 segundos)

| momento | onde na tela (arquivo e componente) | situação atual (texto literal) | mensagem proposta (rascunho) | dado real que alimenta | por que faz voltar | implementação |
|---|---|---|---|---|---|---|
| Antes de entrar (login) | `telas/Login.tsx:Login`, `h1.l-titulo`, `p.l-lead`, `.l-faixa` | "Estude com foco em questões reais de vestibulares e evolua em cada matéria." · "Organize seus estudos, pratique questões, entenda suas respostas e acompanhe seu progresso — tudo em um só lugar." · faixa: "Seu próximo avanço começa aqui." · selo: "Estudo organizado, prática constante, progresso real" | Título: "Questões reais do ENEM e dos vestibulares." Linha: "Com fonte e gabarito. A correção começa pela letra que você marcou, e o que você erra volta no dia certo." Faixa: "O que você errar hoje volta na hora certa." (no lugar de "Seu próximo avanço começa aqui.", que é clichê) | Fatos do produto (CLAUDE.md, princípios 1, 2, 5 e a revisão espaçada de `logica/revisao.ts`); nenhum número | Em 5 segundos o aluno entende a diferença (questão real + erro que volta), que é o motivo de abrir o site amanhã em vez de outro | já existe — só texto |
| Boas-vindas, provas-alvo | `telas/BoasVindas.tsx:BoasVindas`, passo 1, `p.miolo` | "O site prioriza o que essas provas cobram: simulados, sugestões e treinos. Dá para mudar depois no perfil." | "O site monta o seu estudo do dia pelo que essas provas cobram. Dá para mudar depois no Perfil." | `perfil.provasAlvo` → `logica/hoje.ts:pesosDasProvas` | Liga a escolha de agora ao plano do dia: o aluno sabe que amanhã já existe um "o que fazer" feito para ele | já existe — só texto |
| Boas-vindas, data da prova | `telas/BoasVindas.tsx`, passo 2 ("Qual o seu ritmo?") | Não pergunta a data; ela só existe no Perfil (`Perfil.tsx:DatasProva`) | "Quando é a sua prova? Com a data, a revisão é marcada para você chegar firme nela." (campo opcional, "Pular") | `perfil.datasProva` (o dado já existe; falta pedir) | Sem data, a agenda não conta a partir da prova (pilar 2) e a véspera nunca é reconhecida | sugestão ao dono (campo novo na tela = mudança visual) |
| Primeiro Início, sem nenhuma resposta | `telas/Inicio.tsx:Inicio`, `header.in-cab` (`h1` + `p`) | "Vamos avançar nos estudos?" · "Escolha uma matéria ou misture seus conhecimentos." | `p`: "Para começar, a tela Hoje já separou {n} questões, cerca de {min} min, pelo que cai {no ENEM / nas suas provas}." ("Hoje" com link, classe `hj-link`) | `atividadeRecente(e, 1).length === 0`; `planoHoje(todas, e.materias, { provasAlvo, conj, ag, minutos })` → `sessao.length`, `minutosDe(...)`, `pesos.provas` | O primeiro passo concreto e curto, com tempo real, tira a dúvida "por onde começo" | pequena: em `Inicio()`, `const novo = !atividadeRecente(e, 1).length; const pl = novo ? planoHoje(todas, e.materias, { provasAlvo: e.perfil?.provasAlvo || [], conj: regiaoDoEstado(e).conj, ag: agendaDe(e), minutos: e.pref.minutosHoje || TEMPO_PADRAO }) : null;` e trocar o texto do `<p>` quando `pl?.sessao.length` (≈ 8 linhas) |

### 2.2 Hoje (entrada do dia: o que fazer e quanto leva)

| momento | onde na tela (arquivo e componente) | situação atual (texto literal) | mensagem proposta (rascunho) | dado real que alimenta | por que faz voltar | implementação |
|---|---|---|---|---|---|---|
| Abrir a Hoje com a data da prova informada | `telas/Hoje.tsx:Hoje`, `.titulo-pag p.sub` | "O que estudar hoje, na ordem que mais rende: primeiro o que mais cai nas suas provas, onde você mais erra e o que está para esquecer." (a data da prova não aparece) | Acrescentar ao fim do `p.sub`: "{ENEM} em {12 de novembro}: faltam {n} dias." | `agendaDe(e, agora)` → `ag.prova`, `ag.provaId`; `diasEntre(agora, ag.prova)`; `nomeProva(ag.provaId)` | A conta é real e do aluno (não é contagem regressiva inventada); dá sentido à sessão de hoje | pequena: `ag` já está calculado em `Hoje()`; `{ag.prova && <> {nomeProva(ag.provaId)} em {DATA_LONGA.format(ag.prova)}: faltam {plural(diasEntre(agora, ag.prova), 'dia', 'dias')}.</>}` (importar `diasEntre` e um `Intl.DateTimeFormat`; ≈ 4 linhas) |
| Hoje com provas-alvo mas sem data | `telas/Hoje.tsx`, `section.hj-como p` (já tem link `hj-link` para provas-alvo quando não há) | Só aparece link quando não há provas-alvo: "Escolha suas provas-alvo para a ordem seguir o que elas cobram." | "Informe a data da sua prova e a revisão passa a contar a partir dela." (link `hj-link` para `/perfil#datas-prova`) | `alvos.length > 0 && !ag.prova` | Pede o único dado que falta para a agenda do pilar 2, no lugar onde ele faz diferença | pequena: em `Hoje()`, ao lado do link de provas-alvo: `{alvos.length > 0 && !ag.prova && <> <Link to="/perfil#datas-prova" className="hj-link">Informe a data da sua prova</Link> e a revisão passa a contar a partir dela.</>}` (≈ 2 linhas) |
| Sessão do dia pronta | `telas/Hoje.tsx`, `h2#hj-ses-tit` + `p` | "{n} questões · cerca de {min} min" · "De {k} conteúdos, [começando pelas fáceis erradas do Escudo TRI,] com o seu tempo médio de {x} minutos por questão." | Manter o título. Linha: "{v} são erros que voltam hoje; o resto é o que mais cai nas suas provas." (só quando `v > 0`) | `plano.sessao` cruzado com `plano.itens[].vencidas + faceisErradas` (ou contar `memoriaDe(...).fila && vence <= agora` nos ids da sessão) | Diz por que estas questões, e não outras: o erro de ontem é o primeiro passo de hoje | pequena: em `Hoje()`, `const v = plano.sessao.filter((x) => { const m = memoriaDe(e.materias[x.m]?.q[x.id], ag); return !!m && (m.ultimaFraca \|\| (m.fila && m.vence <= agora)); }).length;` e usar no `p` (≈ 4 linhas) |
| Nada pendente | `telas/Hoje.tsx`, mesmo bloco | "Nada pendente agora" · "Você não tem questões para revisar nem conteúdos pendentes na sua região. Escolha uma matéria para avançar." | "Revisão em dia." · "Nenhuma questão volta hoje. Escolha uma matéria para avançar em conteúdo novo." | `plano.sessao.length === 0` | Reconhece o trabalho feito sem elogio vazio e aponta o próximo passo | já existe — só texto |
| Entrada do dia pelo Início | `telas/Inicio.tsx:HoraDeRevisar`, `p.in-sec-sub` | "Transforme seus erros em aprendizado." | Com vencidas: "{n} questões voltam hoje para revisão." Sem vencidas: "Nenhuma questão volta hoje." | soma de `questoesVencidas(mc, s, agora, agendaDe(e)).length` em `todas` (já calculado por matéria dentro de `HoraDeRevisar`, mas só para as 3 primeiras) | Número real e pequeno no lugar de frase genérica: dá a medida do dia | pequena: em `HoraDeRevisar`, `const totVenc = todas.reduce((a, mc) => a + questoesVencidas(mc, e.materias[mc.id] \|\| VAZIA, Date.now(), agendaDe(e)).length, 0);` e trocar o texto do `p.in-sec-sub` (≈ 3 linhas) |
| Hoje como porta de entrada | Início, menu do celular, fim das boas-vindas | Hoje só no menu lateral; no celular só pelo botão da Revisão | — | — | O "o que fazer e quanto leva" existe, mas o aluno não o encontra | sugestão ao dono (item 1) |

### 2.3 Fim de sessão (o que melhorou + o próximo passo)

| momento | onde na tela (arquivo e componente) | situação atual (texto literal) | mensagem proposta (rascunho) | dado real que alimenta | por que faz voltar | implementação |
|---|---|---|---|---|---|---|
| Fim da sessão de Hoje / Escudo TRI | `telas/Hoje.tsx:FimSessao` | "Sessão de hoje concluída" · "{ok} de {n} questões certas, em {k} matérias." · "{e} questões erradas voltam amanhã na revisão. Cada resposta já conta na agenda e no domínio de cada conteúdo." | Acrescentar o que melhorou: "{x} que você tinha errado, hoje certas." Trocar a última linha por: "Amanhã: {a} questões voltam na revisão." (com `a` contando as de hoje e as que já estavam marcadas) | Melhorou: itens com `ses.res[k] === 'a'`, última tentativa não fraca e alguma tentativa anterior fraca (`pegaEstado().materias[m].q[id].tent.slice(0, -1).some(fraca)`). Amanhã: `questoesVencidas(mc, s, emNDias(agora, 1) + DIA - 1, ag).length` somado em `todas` (o `todas` já chega em `FimSessao` e não é usado) | Fecha com uma vitória real (o erro que virou acerto) e um compromisso concreto para amanhã, com número | pequena: em `FimSessao`, `const e = pegaEstado(); const viraram = ses.it.filter((x) => { const t = e.materias[x.m]?.q[x.id]?.tent \|\| []; return ses.res[chaveMisto(x)] === 'a' && t.length > 1 && !fraca(t[t.length - 1]) && t.slice(0, -1).some(fraca); }).length;` e `const amanha = todas.reduce((a, mc) => a + questoesVencidas(mc, e.materias[mc.id] \|\| estadoMateriaVazio(), emNDias(Date.now(), 1) + DIA - 1, agendaDe(e)).length, 0);` (≈ 10 linhas) |
| Fim do Treino geral (todas as matérias) | `telas/TreinoMisto.tsx:TreinoMisto`, bloco `tm-fim` | "Treino concluído" · "{ok} de {n} questões certas, em {k} matérias." · "Cada resposta já conta no progresso da matéria da questão. Erros e chutes entram na revisão espaçada." | "{e} erros voltam amanhã na revisão, com os chutes." (sem erros: "Nenhum erro nesta rodada. Os chutes certos voltam amanhã para confirmar.") — só a segunda frase quando houver chute certo | `Object.values(ses.res).filter((v) => v === 'e').length`; chute certo: `tent` da questão com `ok && conf === 'chute'` | O aluno sai sabendo que o erro tem data para voltar, em vez de "entram na revisão" abstrato | pequena: no ramo `ses.i >= ses.it.length`, `const er = Object.values(ses.res).filter((v) => v === 'e').length;` e trocar o `p.miolo` (≈ 3 linhas; o caso do chute pode ficar para depois) |
| Fim do Treino da matéria | `telas/Treino.tsx`, `resultado-fl` | "Treino concluído" · "{a} de {n} itens certos." · "Erros e chutes entram na revisão espaçada automaticamente." | "{e} itens voltam na revisão: as questões amanhã, os flashcards e frases no dia marcado." | `ses.it` e `ses.res` (`'e'` por tipo `k`) | Mesmo motivo: o próximo passo tem data | pequena: `const er = ses.it.filter((x) => ses.res[x.id] === 'e').length;` e trocar o `p.miolo` (≈ 2 linhas) |
| Fim dos flashcards | `telas/Flashcards.tsx`, `resultado-fl` | "Sessão concluída" · contadores Acertei/Quase/Errei · "Os que você errou voltam ainda hoje; os demais, no dia certo da revisão." | Manter (já diz o próximo passo com verdade). Opcional: "Os {e} que você errou voltam ainda hoje; os demais, no dia certo da revisão." | `res` da tela (`'e'`) | — | já existe — só texto |
| Resultado do simulado | `telas/SimuladoResultado.tsx`, `.res-sim` | "{a} de {t} certas · {tempo} · {data}" · "Os erros e as questões em branco já entraram na revisão espaçada." | "{n} questões, entre erros e em branco, voltam amanhã na revisão." (botão já existe: "Ir para a revisão") | `f.itens.filter((x) => !x.ok).length` | Transforma o placar (que pode desanimar) em lista curta e datada | pequena: `const nRev = f.itens.filter((x) => !x.ok).length;` no texto do `p.fraco` do ramo sem `p` (≈ 2 linhas) |
| Fim da revisão em slides | `telas/RevisaoSlides.tsx:Fim` | "Conteúdo firme por enquanto" / "Este conteúdo volta logo" · "Volta {amanhã} ({data}). Acertou a aplicação e lembrou do essencial: o intervalo cresce." | Manter: já tem o que melhorou (números das 3 fases) e o próximo passo com data real | `revs[sub].hist`, `revs[sub].vence` | — | já existe — só texto (nada a mudar) |
| Fim do "Treine sua evolução" (escada) | `telas/Questao.tsx` (última questão: "Concluir" → volta a `/m/:m/escada/:sub`) | Não há tela de fim: volta à lista do conteúdo | "{c} de {t} certas neste conteúdo. {e} voltam amanhã na revisão." + próximo nível ou próximo conteúdo | `progressoEscada(qs, s)`, `filaDe` | O momento de maior esforço termina sem fechamento | sugestão ao dono (tela nova) |

### 2.4 Erro (convite à revisão)

| momento | onde na tela (arquivo e componente) | situação atual (texto literal) | mensagem proposta (rascunho) | dado real que alimenta | por que faz voltar | implementação |
|---|---|---|---|---|---|---|
| Errou uma questão (conteúdo, nível, revisão) | `telas/Questao.tsx:QuestaoTela`, painel `q-lado`, ramo `revelado`, logo acima de `.q-lado-fim` | Cabeçalho da correção (`ui/Resolucao.tsx`): "Você marcou {B}. A resposta é {D}." e "Por que eu errei". Nada diz que a questão volta. (Antes de responder, se já respondeu: "Você já respondeu esta questão {n vezes}; revisão {amanhã}.") | "Esta questão volta {amanhã} na revisão." Se errou com certeza: "Você marcou com certeza: ela vem antes das outras na revisão de amanhã." | `f = filaDe(eq, agendaDe(pegaEstado()))` (já calculado na linha `const f = filaDe(...)`, depois de `registraTentativa`); `f.vence` → `emDias(f.vence)`; `f.certeza` | O erro deixa de ser fim e vira encontro marcado; a certeza errada é o caso que mais rende revisar (pilar 3) | pequena: no ramo `revelado`, antes de `.q-lado-fim`: `{f && <p className="q-antes fraco"><Icone nome="repetir" tam={15} /> {f.certeza ? 'Você marcou com certeza: ela vem antes das outras na revisão de amanhã.' : \`Esta questão volta ${emDias(f.vence)} na revisão.\`}</p>}` (≈ 3 linhas; reaproveita a classe da linha "Você já respondeu") |
| Acertou no chute ou com dica | mesmo lugar | "Você acertou" | "Acertou no chute: ela volta {amanhã} para confirmar." / com dica: "Acertou com dica: ela volta {amanhã} para você fazer sem." | `escolha === q.gab && f` (fila não nula = fraca: chute ou dica); `conf === 'chute'`, `pista` | Honesto com o aluno: o acerto por sorte não é tratado como domínio, e ele sabe que vai ter a chance de provar | pequena: mesma linha acima, com a condição `escolha === q.gab ? (conf === 'chute' ? ... : ...) : ...` (+2 linhas) |
| Erro dentro da sessão de Hoje e do Treino geral | `telas/Treino.tsx:QuestaoInline` (usada por `RodadaQuestoes`) | Igual: correção sem a data de volta | As mesmas duas mensagens acima | `filaDe(pegaEstado().materias[m]?.q[q.id], agendaDe(pegaEstado()))` depois de `confirma` | Mesmo motivo | pequena: igual à de `Questao.tsx`, na `div.q-lado-fim` de `QuestaoInline` (≈ 4 linhas) |
| Revisão vazia | `telas/Revisao.tsx`, `.vazio` | "Nada para revisar hoje" · "Quando você errar, chutar ou usar uma pista, a questão aparece aqui no dia certo." | Manter (verdadeiro e sem culpa) | `totVenc === 0` | — | já existe — só texto (nada a mudar) |

### 2.5 Sequência de dias

| momento | onde na tela (arquivo e componente) | situação atual (texto literal) | mensagem proposta (rascunho) | dado real que alimenta | por que faz voltar | implementação |
|---|---|---|---|---|---|---|
| Constância no Início | `telas/Inicio.tsx:Desempenho`, `.in-desemp-nums` | "{n} dias de constância" | "{n} dias seguidos estudando" (com 0: "Seu primeiro dia começa com uma questão.") | `logica/inicio.ts:diasDeConstancia(e)` | Reconhece o hábito com número real, sem ameaça de perder | já existe — só texto |
| Contar flashcards na sequência | `logica/inicio.ts:diasDeConstancia` (e `estatisticas.ts:semana` para manter as duas iguais) | Só conta respostas a questões | (mesma mensagem; muda o que conta) | `materias[m].flash[id].hist[].ts` | Pilar 10: a ofensiva conta recuperações (questão, frase, flashcard); quem revisou cartões estudou | pequena: em `diasDeConstancia`, dentro do laço das matérias: `for (const f of Object.values(s.flash)) for (const h of f.hist \|\| []) if (h.ts <= agora) dias.add(iniDia(h.ts));` (2 linhas; o mesmo em `respostasPorDia` se o dono quiser que a meta semanal também conte cartões) |
| Menu lateral (meta) | `ui/Casca.tsx`, `.meta-lado` | "{s} de {meta}" · "meta da semana" · "hoje {h} · ontem {o}" | Manter. Não acrescentar aviso de "não perca a sequência" (seria perda fictícia/cobrança) | `semana(e)`, `perfil.meta` | — | já existe — só texto (nada a mudar) |
| Pausa sem perder a sequência | — | Não existe | "Pausa marcada. A sequência continua quando você voltar." | **dado não existe** (dias de pausa) | Pilar 10: hábito saudável, nenhuma punição | sugestão ao dono (item 4) |

### 2.6 Volta depois de dias parado (acolher, sem cobrança)

| momento | onde na tela (arquivo e componente) | situação atual (texto literal) | mensagem proposta (rascunho) | dado real que alimenta | por que faz voltar | implementação |
|---|---|---|---|---|---|---|
| Abrir o Início depois de 3 dias ou mais sem estudar | `telas/Inicio.tsx:Inicio`, `header.in-cab p` | "Vamos avançar nos estudos?" · "Escolha uma matéria ou misture seus conhecimentos." | `p`: "Bom ter você de volta. {n} questões voltam hoje; comece por elas e o resto se ajusta." (sem dizer quantos dias ficou fora) | Último estudo: maior `ts` entre `materias[*].q[*].tent[*]` e `materias[*].flash[*].hist[*]` (função nova `diasParado` em `logica/inicio.ts`); vencidas: soma de `questoesVencidas` (a mesma da linha "Entrada do dia pelo Início") | Acolhe e reduz o retorno a um passo pequeno e conhecido; não lembra a ausência | pequena: em `logica/inicio.ts`, `export function ultimoEstudo(e: Estado): number { let u = 0; for (const s of Object.values(e.materias)) if (s) { for (const eq of Object.values(s.q)) for (const t of eq.tent) u = Math.max(u, t.ts); for (const f of Object.values(s.flash)) for (const h of f.hist \|\| []) u = Math.max(u, h.ts); } return u; }`; em `Inicio()`, `const u = ultimoEstudo(e); const volta = u > 0 && diasEntre(u, Date.now()) >= 3;` e trocar o `p` (≈ 12 linhas) |
| Volta com sessão de Hoje velha | `telas/Hoje.tsx:sessaoAberta` | A sessão de outro dia some sozinha (só vale a do dia: `s.dia === iniDia(agora)`) e a lista é refeita | Nada a dizer: já é o comportamento certo (sem lista acumulada para "pagar") | `sessaoHoje.dia` | Ninguém volta para uma pilha de atraso | já existe — só texto (nada a mudar) |
| Volta com muitas vencidas | `telas/Hoje.tsx`, `p` do bloco da sessão | "De {k} conteúdos, com o seu tempo médio..." | Quando o total vencido passa do que cabe no tempo: "A sessão pega as {n} mais importantes; as outras ficam para os próximos dias." | total vencido (soma de `itens[].vencidas`) > `plano.sessao.length` | Tira o peso do acúmulo sem esconder nada | pequena: `const venc = plano.itens.reduce((a, it) => a + it.vencidas + it.faceisErradas, 0);` e a frase quando `venc > n` (≈ 3 linhas) |

### 2.7 Véspera de prova

| momento | onde na tela (arquivo e componente) | situação atual (texto literal) | mensagem proposta (rascunho) | dado real que alimenta | por que faz voltar | implementação |
|---|---|---|---|---|---|---|
| Últimos 3 dias antes da prova | `telas/Hoje.tsx:Hoje`, `.titulo-pag p.sub` (mesma linha da data, 2.2) | Nada; a Revisão mostra "{Prova} em {data}" · "Faltam {n} dias..." (`AgendaRevisao`) | "{ENEM} em {n} dias. A revisão já fecha na véspera: o que volta agora é o que você já estudou." Na véspera (`n === 1`): "{ENEM} amanhã. Revise pouco e durma bem." | `diasEntre(agora, ag.prova) <= 3`; `logica/revisao.ts:intervalo` garante que nada é marcado depois da véspera | Mensagem calma, verdadeira, que dá permissão para não abrir conteúdo novo; ancora a volta nos dias finais | pequena: junto da linha da data em `Hoje()`: `const falta = ag.prova ? diasEntre(agora, ag.prova) : null;` e o texto quando `falta !== null && falta <= 3` (≈ 4 linhas). Atenção: a frase não pode dizer que o plano mudou, porque `planoHoje` ainda inclui questões novas (isso é o modo véspera, item 3 das sugestões) |
| Dia da prova | `telas/Hoje.tsx`, mesmo lugar | Nada (e `proximaProva` já pula a prova do dia) | "Hoje é dia de {ENEM}. Boa prova." | `perfil.datasProva[id] === data de hoje` para algum `id` de `provasAlvo` (`diaDaData(...) === iniDia(agora)`) | Reconhece o dia sem empurrar estudo | pequena: `const hojeProva = (e.perfil?.provasAlvo \|\| []).find((id) => diaDaData(e.perfil?.datasProva?.[id]) === iniDia(agora));` (≈ 3 linhas) |
| Modo véspera de verdade | `logica/hoje.ts:planoHoje` | Não existe | "Modo véspera: só o que você já estudou, sessão curta." | lógica nova (pilar 10) | Pilar 10 do Método | sugestão ao dono (item 3) |

---

## 3. Sugestões ao dono

Cada item precisa de decisão do dono porque muda navegação ou visual, cria dado novo ou sai do site.

1. **Hoje como porta de entrada.** Hoje é a tela que responde "o que faço e quanto leva", mas o aluno não chega nela:
   o fim das boas-vindas leva ao Início (`BoasVindas.tsx:conclui` → `nav('/')`), o Início não tem link para Hoje e a
   barra do celular (`ui/Casca.tsx`, `nav.tabs`) não tem Hoje. Opções: (a) um cartão ou link "Hoje" no Início;
   (b) trocar uma aba do celular por Hoje; (c) terminar as boas-vindas em `/hoje`. É mudança de navegação e de visual.
2. **Pedir a data da prova nas boas-vindas** (campo opcional no passo "Ritmo", com "Pular"). O dado já existe
   (`perfil.datasProva`); falta pedir na hora certa. É campo novo na tela.
3. **Modo véspera** (pilar 10 do Método, fase 5): nos 3 dias antes de cada prova, o plano de Hoje sem questões novas,
   só erros com certeza e o que já está dominado, sessão mais curta e aviso de sono. É lógica nova em
   `logica/hoje.ts:planoHoje` (tirar `novas` quando `falta <= 3`) e decisão de conteúdo (o texto do aviso de sono).
4. **Sequência com pausa** (pilar 10): marcar dias de pausa sem perder a sequência. **Dado não existe**: precisa de um
   campo novo (por exemplo `pref.pausas: number[]`, dias marcados), com migração (princípio 7) e um botão novo.
5. **Tela de fim do "Treine sua evolução"**: hoje a última questão da escada volta à lista sem resumo. Uma tela de
   fim com acertos no conteúdo, o que volta amanhã e o próximo nível fecharia o maior esforço do aluno. Tela nova.
6. **Registro de estudo por sessão:** `materias[m].sessoes` não é mais gravado pelo site novo (só tem o que veio do
   protótipo). Para mensagens como "{n} minutos hoje" ou "último acesso", seria preciso voltar a gravar o início e o fim
   de cada sessão. Dado novo.
7. **E-mail e notificação ficam fora** até o dono decidir. Se um dia entrarem, os candidatos naturais são "{n} questões
   voltam hoje" e a véspera de prova, sempre com consentimento expresso e opção de sair (LGPD).
8. **"O equívoco volta"** (pilar 4): a mensagem "o mesmo erro de raciocínio voltou, agora em outra questão" depende dos
   códigos de equívoco por alternativa, que a fábrica ainda não marca. **Dado não existe.**
9. Para o redator (não é decisão do dono, só registro): no login, "Seu próximo avanço começa aqui." e "Estudo
   organizado, prática constante, progresso real" são frases genéricas, do tipo que o guia de voz proíbe; no Início,
   "Transforme seus erros em aprendizado." e "Uma nova chance de fixar o conteúdo." também. Os rascunhos acima trocam
   a primeira e a terceira por números reais.
