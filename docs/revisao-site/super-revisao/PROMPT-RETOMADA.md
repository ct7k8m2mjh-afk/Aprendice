# Retomada da super revisão e das questões pendentes (pedido do dono, 27/11/2026)

Palavras do dono: "se ainda tiver questões pendentes, as sessões responsáveis devem publicá-las e corrigi-las; devem
terminar". A super revisão parou em 23/11 (sessões da outra conta encerradas). Três sessões retomam, cada uma até o
fim das suas matérias. Com a sessão Ateliê, são 4 sessões ao mesmo tempo (o limite do dono, 21/11).

| Sessão | Primeiro | Depois, nesta ordem (até o fim) |
|---|---|---|
| SR-1 | as questões pendentes finais (seção A) | Matemática → Física → Filosofia e Sociologia |
| SR-2 | — | Biologia → Química → Geografia |
| SR-3 | — | Português → História → Inglês |

---

Você é a sessão **SR-<k>** da super revisão do Aprendice (o número e as matérias estão na mensagem que abriu você e na
tabela acima). Fale português do Brasil, simples. Trabalhe sozinha do começo ao fim, sem pedir aprovação; nunca use
send_message.

## 0. Antes de tudo
1. Leia: `CLAUDE.md` (manda em tudo), `docs/revisao-site/super-revisao/PROTOCOLO.md`, as instruções dos agentes da sua
   sessão (SR-1: `papeis-sr1.md` e `ferramentas/super-revisao/sr.py`; SR-2: `instrucoes-agentes-sr2.md`; SR-3:
   `orquestrador-sr3.md` e `instrucoes-agentes.md`; SR-2 e SR-3 usam `ferramentas/resolucoes/sr3.py`), a skill
   `resolucao-exercicios` e o guia da matéria, e o `<m>.md` de cada matéria sua em `docs/revisao-site/super-revisao/`.
2. **Onde parou:** o "CONTINUAR DE" do `<m>.md` pode estar atrasado. Confira com
   `git log --format="%h %cd %s" --date=short -- docs/revisao-site/super-revisao/<m>.md app/conteudo-fonte` e
   continue do último conteúdo realmente gravado. Inglês (SR-3): a coordenação tinha começado; o `ing.md` diz onde.
3. Prepare o ambiente em segundo plano: `cd app && (test -d node_modules || npm ci) && python3 -m pip install -q
   --break-system-packages pillow numpy scipy && flock /tmp/converte.lock python3 scripts/converte.py`. Os scripts
   antigos citam `/home/user/Aprendice`; use o caminho do seu checkout.

## A. Só SR-1, primeiro: as questões pendentes finais (antes de voltar a Matemática)
Em 27/11, 34 questões aparecem no site sem resolução e sem selo de fora. Refaça a lista com:
```
cd app && python3 - <<'EOF'
import json,glob
for m in ['bio','qui','mat','por','fis','geo','his','ing','fs']:
  b=json.load(open(f'public/conteudo/{m}/banco.json')); res=set()
  for f in glob.glob(f'public/conteudo/{m}/res/*.json'): res|=set(json.load(open(f)))
  for q in b:
    if q['id'] not in res and not (q.get('indisponivel') or q.get('outraMateria') or q.get('anulada')):
      print(m,q['id'],str(q.get('pendente'))[:100])
EOF
```
e cruze com `python3 ferramentas/resolucoes/lote.py pendentes` (o motivo completo de cada uma). Para cada questão,
uma destas saídas, sempre pelas regras do CLAUDE.md e de `docs/resolucoes/PROMPT-SESSAO-RESOLUCOES.md`:
- **"gabarito do Aprendice em preparação"** (ex.: qui P0ffb2963, P4013ff98; por Pe24503bc, P2b2aa288, P298602be;
  fís P58d32c58): princípio 2 — busque gabarito publicado na web; sem ele, **dois especialistas** (dois agentes,
  nenhum vê a resposta do outro) resolvem; se a letra bater (e bater com o preliminar, se houver), escreva a resolução
  completa (skill `resolucao-exercicios`, lentes do princípio 3) com o aviso do gabarito do Aprendice. Se não bater:
  vira **Questão indisponível** (`app/conteudo-fonte/indisponiveis.json`, mesmo formato, motivo "gabarito do
  Aprendice sem acordo dos dois especialistas").
- **De outra matéria que não está entre as 9** (Artes, Educação Física; ex.: por Pfc99ec33, P0aaed1c4, P2cc479e5):
  regra do dono de 13/11 — acrescente em `app/conteudo-fonte/outra-materia.json` (mesmo formato).
- **De outra das 9 matérias** ("classificação", "reclassificada"): confira se já está na matéria nova com resolução;
  se não, reclassifique (seção "Reclassificar" do `COORDENACAO.md`; o id não muda) e resolva lá.
- **"anular"** que ainda aparece sem selo: decisão do dono de 20/11 ("todas sim") — vira Questão indisponível.
- **"print"** (mat P17aea30d, geo Pd4ca228f): refaça o print pelo PDF oficial (`ferramentas/ingestao/refaz_print.py`);
  com o print certo, resolva. Se o PDF oficial não existir no repositório nem na rede liberada: Questão indisponível,
  motivo "print incompleto".
- **"obra"/"fato"** sem fonte confiável depois de uma nova busca na web: Questão indisponível ("na dúvida, não entra").
Grave cada saída no lugar certo, `lote.py valida` e `grava` quando for resolução, `converte.py` + testes verdes,
commit e push. No fim da seção A, a lista do comando acima tem de vir **vazia**. Publique (seção D) e escreva no fim de
`docs/resolucoes/COORDENACAO.md` um bloco "27/11 PENDENTES FINAIS — FIM" com o que foi feito em cada questão.

## B. A super revisão (todas as sessões)
Siga o `PROTOCOLO.md` e as instruções da sua sessão sem atalhos: professor e aluno por lote (agentes diferentes),
corretor, **professor novo** conferindo só o que mudou, crítico de tela por conteúdo (ou por tema, como a SR-2 já
fazia). Regras que não mudam:
- Questão de prova (enunciado, print, gabarito, id) não se altera. Gabarito que parecer errado: não muda; vai para a
  seção de gabaritos do `<m>.md` com a prova encontrada.
- Corrigir = deixar certo e claro; proibido inflar. Fração sempre empilhada (`a/b`). Nada de emoji.
- Correção no arquivo-fonte (nunca em `app/public/`). Erro de código (motor, tela) com teste no vitest, um commit por
  achado; mudança que muda o visual aprovado **não** se faz: anote em `<m>.md` em "Para o dono" (a sessão Ateliê
  cuida do visual com o dono).
- Registre cada conteúdo no `<m>.md` (tabela e "CONTINUAR DE") e no `<m>-achados.jsonl`. Linhas com `"papel":"dono"`
  no jsonl vieram do Ateliê: não desfaça.
- ALUNO e CRÍTICO DE TELA com `model: "sonnet"`; PROFESSOR, CORRETOR e PROFESSOR NOVO no modelo padrão. No máximo 3
  agentes ao mesmo tempo.

## C. Gravar (a cada conteúdo)
`git pull -q --rebase --autostash origin app-prototipo-completo`; `cd app && flock /tmp/converte.lock python3
scripts/converte.py && npx tsc --noEmit -p . && npx vitest run` verde; commit só dos seus arquivos (`git add
<arquivo>`, nunca `git add -A`), mensagem em português terminando com as linhas de atribuição que o sistema indicar,
sem nome de modelo; `git push origin HEAD:app-prototipo-completo` (até 4 tentativas, com pull --rebase entre elas;
conflito: junte sem perder nada; nunca `--force`). Nunca grave dado pessoal em arquivo.

## D. Publicar (ao fim de cada matéria e ao fim da seção A)
- Antes: pull, converte, tsc e vitest verdes; o número de resoluções em `app/public/conteudo/relatorio.json` não pode
  cair em relação a `docs/resolucoes/publicacao.json`.
- Conector da Vercel, `create_deployment`: teamId `team_ktkWAyK9Cc0bRLSR5qu5GW5b`, projeto
  `prj_hVOH7ZV6islXYIUgzmgiJqxvNspM`, target production, gitSource github, org `ct7k8m2mjh-afk`, repo `Aprendice`,
  ref `app-prototipo-completo`, sha = o commit mais novo do ramo no GitHub; projectSettings: framework `vite`,
  rootDirectory `app`, installCommand `npm ci`, buildCommand
  `python3 -m pip install -q --break-system-packages pillow numpy scipy && python3 scripts/converte.py && npx vite build`,
  outputDirectory `dist`, nodeVersion `22.x`, sourceFilesOutsideRootDirectory `true`. Espere READY.
- O site continua com o login de demonstração: não crie nem mude variáveis na Vercel (`VITE_CONTAS_REAIS` só com o
  dono).
- Confira no ar `https://aprendice.vercel.app/conteudo/relatorio.json` e uma questão corrigida (390 claro, 1280
  escuro). Atualize `docs/resolucoes/publicacao.json` (`ultima`) e comite.
- Sem conector da Vercel nesta sessão: não tente outro caminho; anote no `<m>.md` "pronto para publicar" e siga.

## E. Fim e contexto
- Ao terminar cada matéria: resumo no `<m>.md` (questões revistas, correções, gabaritos suspeitos, pendências do
  dono) e um bloco "SR-<k>: <matéria> FIM" no fim do `COORDENACAO.md`. Siga para a próxima matéria da sua linha.
- Ao passar de ~60% do contexto: termine o conteúdo aberto, grave, atualize o "CONTINUAR DE" e encerre com uma linha
  dizendo onde parou (a coordenação abre outra sessão com este mesmo prompt).
