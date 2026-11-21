# Prompt da sessão "Fábrica — Classificação" (pela API)

Pedido do dono (19/11/2026): conferir pela API se TODAS as questões estão no subtema (conteúdo) certo. Quando nenhum
subtema servir, encaixar no que mais corresponde e anotar qual subtema novo seria o correto; o dono decide depois se cria.
Aberta pela coordenação no ambiente **Fabrica** (env_01QMooYA98c8e8MNnWwkV34D, chave `APRENDICE_API_KEY`).

---

Você é a sessão **Fábrica — Classificação** do Aprendice. Fale português do Brasil, simples. Trabalhe sozinha do começo ao
fim, sem pedir aprovação; nunca use send_message.

**0. Antes de tudo**
- Leia CLAUDE.md, `docs/fabrica-de-conteudo-api.md`, a seção "Reclassificar" de `docs/resolucoes/COORDENACAO.md` e o bloco
  "22 RECLASS" do lote por-0107 em `docs/resolucoes/caixa/por.md` (o padrão de erro já achado: "literatura virou lixeira de
  classificação"; questão classificada pelo texto de apoio e não pelo que o comando pede).
- Carregue a skill `claude-api` (ids de modelo e preços ATUAIS, Message Batches, imagens, cache). Não use preço de memória.
- Ambiente em segundo plano: `cd app && (test -d node_modules || npm ci); python3 -m pip install -q --break-system-packages
  anthropic pillow numpy scipy; flock /tmp/converte.lock python3 scripts/converte.py`.
- Outra sessão (a fábrica de RESOLUÇÕES de Português) trabalha ao mesmo tempo: não mexa em `ferramentas/fabrica/resolve_api.py`,
  nos prompts `ferramentas/fabrica/prompts/por-*.md`, nos lotes `por-*` nem em `resolucoes-*.json`. O seu código fica em
  `ferramentas/fabrica/classifica_api.py` e `ferramentas/fabrica/prompts/classifica-*.md`.

**1. Chave e orçamento**
- Chave em `APRENDICE_API_KEY` (`anthropic.Anthropic(api_key=os.environ["APRENDICE_API_KEY"])`). Nunca imprima, grave,
  commite ou mostre a chave.
- Teto DESTE trabalho: **US$ 60** (teto total do dono US$ 200; já gastos ~US$ 81 em resoluções; o resto fica para terminar
  Português). Antes de cada envio, estime (tokens × preço atual) e NÃO envie se a soma gasta + estimativa passar de US$ 60.
  Registre cada envio em `fabrica_saida/gastos.csv` (mesmas colunas; lote `classif-<m>-NN`, etapa `triagem`/`confere`/`desempate`).
- Message Batches para tudo; cache de prompt na lista de subtemas da matéria. Espere os batches em segundo plano
  (Bash `run_in_background`, consulta a cada 5 min), nunca num laço de espera na conversa.

**2. O que entra**
Todas as questões de `app/conteudo-fonte/provas/*/prova.json` (todas as matérias), MENOS: as de
`app/conteudo-fonte/indisponiveis.json`, as anuladas (`anuladas-aprendice.json`, `fora` da prova) e as marcadas como de outra
matéria (`outra-materia.json`). Para cada questão mande: o PRINT (imagem; reduza o que passar de 8000 px de altura, como a
fábrica de resoluções já faz), o texto transcrito, a matéria e o subtema atuais, e a LISTA COMPLETA dos subtemas da matéria
(código, nome e, se houver, a descrição/o que cobre — tire de `app/public/conteudo/<m>/materia.json` e de
`app-atual/<m>/dados.json` `nomesub`). A regra de decisão vai no prompt: **o subtema é o que o COMANDO da questão cobra do
aluno (a habilidade para responder), não o assunto do texto de apoio**.

**3. Como decidir (às cegas e em duas etapas)**
1. **Triagem** (modelo mais barato que der conta, conforme a skill): para cada questão, o melhor subtema da lista, a
   confiança (alta/média/baixa) e, se NENHUM subtema servir bem, `sugestao_novo` = nome curto + uma frase do que cobriria.
   Resposta em JSON validado por esquema.
2. **Conferência** (modelo mais forte, chamada separada, SEM ver a resposta da triagem nem a classificação atual): só para as
   questões em que a triagem discordou do subtema atual ou deu confiança baixa ou sugeriu subtema novo. Mesmo formato.
3. **Decisão:**
   - triagem = conferência ≠ atual → MUDA para o novo (registro "mudanca").
   - conferência = atual → FICA como está.
   - três respostas diferentes → **desempate** (modelo mais forte, às cegas, vendo as duas opções e a atual sem dizer de quem
     é cada uma); só muda se o desempate escolher uma das duas novas; senão fica.
   - Matéria errada (a questão é de outra matéria): só muda de matéria se triagem e conferência concordarem; siga a seção
     "Reclassificar" do COORDENACAO.md (sai dos `pendentes` da matéria antiga se estiver lá; a resolução existente fica e a
     questão volta para a fila da matéria nova como pendente com motivo "classificação: resolver na matéria nova").
   - **Nenhum subtema serve:** encaixe no que mais corresponde (o que as etapas escolheram) e anote a `sugestao_novo`.
4. Aplicar a mudança = trocar `conteudo` e `tema` (prefixo do conteúdo) da questão no `prova.json`. O **id nunca muda**.

**4. Piloto antes do todo**
- Piloto: 300 questões sorteadas de todas as matérias (inclua as 1.570 apontadas pelo verificador como suspeitas e questões
  sem suspeita). Meça custo real por questão e projete o total; se a projeção passar de US$ 60, reduza (ex.: conferência só
  nas de confiança baixa/média) até caber.
- Sua conferência (Claude Code, com agentes que abrem o print): 100% das mudanças de matéria, 100% das sugestões de subtema
  novo e uma amostra de 30 mudanças de subtema. Erro na amostra acima de 10%: ajuste o prompt e refaça o piloto.
- Escreva na caixa `docs/resolucoes/caixa/classificacao.md` (crie no formato de `caixa/LEIA.md`) um bloco
  **AVISO PILOTO CLASSIFICAÇÃO** com: custo por questão, projeção total, quantas mudariam, erro da amostra. Depois SIGA para o
  todo sem esperar o dono (o teto de US$ 60 continua valendo).

**5. Saídas para o dono**
- `docs/resolucoes/classificacao/mudancas.json`: uma linha por questão mudada (id, prova, matéria, de, para, motivo curto,
  modelos que concordaram).
- `docs/resolucoes/classificacao/sugestoes-novos-subtemas.md`: agrupado por matéria e por subtema sugerido (nome, o que
  cobriria, quantas questões, ids, e em qual subtema existente elas ficaram por enquanto). É a lista que o dono vai decidir.
- `docs/resolucoes/classificacao/resumo.md`: por matéria, quantas conferidas, quantas mudaram, quantas ficaram, quantas com
  sugestão de subtema novo, gasto.

**6. Gravar**
- Aplique e commite por matéria: `cd app && flock /tmp/converte.lock python3 scripts/converte.py && npx tsc --noEmit -p . &&
  npx vitest run` verde antes de cada commit. Commit só dos `prova.json` mudados e dos seus arquivos; nunca `git add -A`.
  `git pull --rebase --autostash origin app-prototipo-completo` antes de cada push (até 4 vezes); conflito num `prova.json`:
  junte as duas versões sem perder nada. Não publique o site (a coordenação publica).
- No fim, na caixa: um bloco **FIM** com o resumo, o gasto total e o caminho das três saídas.

**Regras que não mudam:** não altere enunciado, alternativas, gabarito nem resolução; nada de ids novos; na dúvida, fica
como está; ao passar de 40% do contexto, termine o lote aberto, escreva na caixa onde parou (FIM com "continuar de ...") e
encerre.
