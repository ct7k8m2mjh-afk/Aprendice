# Comandos do dono — situação

Legenda: **feito** · **em andamento** · **em espera** · **aguardando o dono**. Decisões que valem: `docs/pedidos-do-dono.md` (e `CLAUDE.md`). Texto completo de cada comando: `docs/historico/2026-11-09-antes-da-compactacao/comandos-do-dono.md`.

Toda tarefa visual termina igual (princípio 9 + regra de publicação): 390/768/1280/1440 claro e escuro, agente separado revisando até zerar, testes, commit, publicar no link.

**Estado:** 06/11 publicado no link (commit d85f7293: design do protótipo, paleta e fontes, ícones de tema das 9 matérias, correção em 4 blocos, provas novas, questões de sites fora; o build da Vercel instala numpy e scipy). 06/11 fim do dia: agentes parados pelo limite semanal (volta 12/11, 1h de Brasília); retomar do que ficou salvo no repositório: ícones (23), revisão em slides (24), piloto de resoluções (25), lote 2 rodada 5 (14), auditoria rodada 2 (20).

| # | Comando | Situação · o que falta | Onde |
|---|---|---|---|
| 1 | Pesquisa São Camilo | feito | `app/conteudo-fonte/provas/saocamilo-2024-2` |
| 2 | Ícones das matérias, "Outras matérias", Início | feito | site |
| 4 | Não mexer nos ícones até o dono mandar (05/11) | **em espera** para ícone não pedido; os ícones mandados depois (19, 23, 32) estão liberados | — |
| 6 | Banca de resoluções | feito | `ferramentas/fabrica/agentes/` |
| 7 | Resoluções São Camilo 2024/2 (40) | no site; os defeitos da auditoria de 06/11 (fração em linha, expoente, subscrito, destaque, termos parados) foram para o motor do 20 — **conferir na versão nova** | simulado São Camilo 2024/2 |
| 8 | Especialistas por matéria | feito | `ferramentas/fabrica/agentes/especialistas/` |
| 9 | CLAUDE.md propagado (site, vestibulares, Questões Aprendice, manutenção) | feito | `CLAUDE.md`, `PRODUCT.md`, READMEs |
| 10 | Direitos: quem decide é o dono | feito | princípio 10 |
| 11 | Link público | feito; produção só de `app-prototipo-completo` | https://aprendice.vercel.app |
| 12 | Login da referência + abertura à mão | feito e publicado | tela de entrada |
| 13 | Publicar quando uma aba inteira mudar | regra | `CLAUDE.md` |
| 14 | 82 instituições: baixar provas, separar matérias, classificar nível e subtema (sem resolução) | **em andamento (dono, 09/11: terminar tudo e publicar por matéria e subtema, sem resoluções)** — dois agentes: (a) ENEM 2020–2022 e provas da triagem de 2020 em diante (dono, 09/11: nada antes de 2020); (b) cobertura das 82 instituições (2020–2026 ou ≥3 anos), itens de baixar-a-mão, questões sem classificação e auditoria separada. Certo/errado e somatória ficam fora (só múltipla escolha). Publicar ao fim | `docs/provas/inventario-*.md` |
| 15 | Revisão periódica dos comandos | em andamento (loop de 1 h) | este arquivo |
| 16 | Design pelo sistema do protótipo | feito e publicado (06/11); falta a verificação final separada | `DESIGN.md` |
| 17 | (substituído pelo 18) | — | — |
| 18 | Paleta, "Filosofia e Sociologia" (`fs`, migração), guia tipográfico | feito e publicado (06/11); falta a verificação final separada | `DESIGN.md` |
| 19 | Ícones de tema de Biologia e Química | feito e publicado | `docs/icones/ONDE-USAR.md` |
| 20 | Correção em 4 blocos + motor único de animação | **em auditoria (rodada 2)**: 19 defeitos da rodada 1 corrigidos, 501 testes passam; falta o auditor separado zerar | questão respondida |
| 21 | Tirar as 788 questões de sites didáticos | feito no site (progresso v3 migrado; 216 duplicatas mostram a prova oficial com o id antigo). Falta: verificação separada; baixar 45 provas (36 ENEM 2003–2022); 734 Questões Aprendice (fábrica + lentes) | `docs/provas/triagem-questoes-site.*`, `docs/questoes-aprendice.md` |
| 22 | 40 questões ENEM de geometria básica (M08.6, M11.6) | feito (conversor protege M08.6 e M11.6) | Mat → Áreas/Volumes básicos |
| 23 | Ícones de tema das outras 7 matérias (81 PNG) | **feito e publicado** (ícones das 9 matérias no ar desde 06/11). Ressalvas, usar o atual até nova versão do dono: H08 Guerra Fria (globo divide os blocos no Atlântico; a Cortina de Ferro passava no meio da Europa); G03 Clima (véu de fundo, alfa até 28: no WebP, alfa < 30 vira 0); H04 Independência e Império (sem marrom couro, só ouro e verde). H07: entrou o capacete sozinho; a versão com bandeiras fica só no Drive | `docs/icones/<matéria>/` |
| 24 | Método Aprendice de Revisão | **em andamento** — fase 1 no site (ciclo de 5 tempos, "Revisão em slides" no tema, aba Conteúdos, progresso v4); falta auditoria separada e as fases: (2) agenda pela data da prova + painel de domínio + saída por 3 acertos espaçados, migrando `revisao.ts` sem mudar ids; (3) tela Hoje (prova-alvo × fraqueza × risco de esquecer) + Escudo TRI; (4) equívocos por distrator e gêmeos; (5) resolução que esmaece, modo véspera, hábito sem punição, tutor que pergunta. Publicar a cada fase | `docs/estrategia-revisao.md` |
| 25 | Resolução de toda questão de prova sem `res` (fábrica, Batches, teto por lote, skill `resolucao-exercicios`, lentes fato → didática → fato; código do equívoco em cada alternativa errada) | **em andamento** — sem chave da API aqui (o dono preferiu não ativar): levantamento das questões sem resolução, piloto de 20 do ENEM pela banca em agentes, estimativa do volume para o dono decidir. Prioridade: provas-alvo mais escolhidas e níveis 1–6; matérias novas usam a revisão do tema como teoria | `res/`, `ferramentas/fabrica/` |
| 26 | Revisão de Física em slides (F01–F12, 727 slides) | feito no site; falta auditoria separada e publicar | `docs/revisao/fis/` |
| 27 | Revisão de Filosofia e Sociologia (L01–L08, S01–S08, 865) | feito no site; falta auditoria separada e publicar | `docs/revisao/fs/` |
| 28 | Revisão de Inglês (I01–I04, 271) | feito no site; falta auditoria separada e publicar | `docs/revisao/ing/` |
| 29 | Revisão de Geografia (G03–G12, 586) | feito no site; G01 e G02 sem livro (L1 não veio); falta auditoria e publicar | `docs/revisao/geo/` |
| 30 | Revisão de História (H01–H07, 589) | feito no site; H08 e H05.8–H05.11 aguardam o livro L4; H07.4–H07.7 parciais; falta auditoria e publicar | `docs/revisao/his/` |
| 31 | Revisão de Biologia | **em andamento** — B01, B02, B04, B09, B11 no site (270 slides); integrar os outros temas quando chegarem (complementa a teoria, não a substitui) | `docs/revisao/bio/` |
| 32 | Capas, ícones do Drive, aba Início pelas referências, Treino geral de todas as matérias | **feito e publicado** (06/11, conferido no ar); ícones sem sombra e com salto (09/11) publicados. Treino geral nas 9 matérias (09/11): Fís, Geo, His, Ing e FS com 40 questões reais de prova cada (temas que mais caem, níveis 1–6; `converte.py: treino_geral_novas`), sem flashcards e sem frases até haver material aprovado nesse formato (os cartões e os slides "fixe" da revisão não viram pergunta curta nem lacuna de um termo sem escrever texto novo); falta publicar | `docs/capas/`, `docs/referencias/aba-principal/` |
| 33 | Revisão essencial (8–12 telas por tema) no lugar dos slides | **em andamento** — tela essencial e mapa mental no site; Química Q01, Q06, Q07 prontos; os outros temas chegam da fábrica; tema sem `essencial` continua com os slides | `docs/revisao/FORMATO-ESSENCIAL.md` |
| 34 | Química hoje: essencial Q01–Q12 + questões de Química já resolvidas, no link | **em andamento, prioridade acima das outras** — integrar e publicar cada tema assim que chegar em `docs/revisao/qui/` (faltam Q02–Q05, Q08–Q12) | `docs/revisao/qui/LEIA.md` |
| 35 | Revisão por subtema: resumo curto (pontos, pegadinha) + **caixa de imagem** com a descrição do que ilustrar; o dono gera as imagens e manda ao Code depois (nome `<id do subtema>.png`) | **dados prontos, falta integrar no site** — `resumos.json` em cada matéria (361 subtemas: Bio, Fís, FS, Geo, His, Ing, Qui); cada subtema tem `titulo`, `pontos`, `pegadinha`, `imagem.descricao`. No site: mostrar o resumo do subtema e, no lugar da figura, uma caixa tracejada com a descrição até a imagem chegar; ao chegar a imagem, ela substitui a caixa. A lista para o dono gerar as imagens está em `IMAGENS-PARA-GERAR.md`. Q01/Q06/Q07 seguem com o `essencial` (telas com `visual`), os resumos deles são derivados | `docs/revisao/<matéria>/resumos.json`, `docs/revisao/IMAGENS-PARA-GERAR.md` |
