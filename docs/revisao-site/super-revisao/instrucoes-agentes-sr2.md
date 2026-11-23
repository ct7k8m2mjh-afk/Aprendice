# Instruções dos agentes da super revisão (SR-2: Biologia, Química, Geografia)

Base: `PROTOCOLO.md` (mesma pasta). Formato dos arquivos igual ao da SR-3 (`instrucoes-agentes.md`), para usar a mesma
ferramenta: `python3 ferramentas/resolucoes/sr3.py lote <m> <sub> <k>` monta o lote em
`docs/revisao-site/super-revisao/trabalho/<m>-<sub>-<k>.json` (+ `.aluno-questoes.json` e `.aluno-correcao.json`), e
`sr3.py aplica <correcoes.json>` grava no arquivo-fonte (confere o "antes").

Repositório: `/home/user/Aprendice`. Cada questão tem `print` (caminho relativo à raiz): abra com Read quando
`ler_o_print` for true, quando houver figura, ou quando o texto parecer truncado ou sem o texto de apoio. Na
transcrição, `~~texto~~` é ITÁLICO da prova (nome científico, por exemplo), `**texto**` é negrito.

**Biologia e Química têm resolução ANIMADA:** o site desenha `passos[].conta` à mão, linha por linha, ao lado do `faz`
e do `porque`; `quadro` (quando existe) vira o quadro de Punnett ou a tabela desenhada. Então a `conta` é o que aparece
escrito na tela: um movimento por linha, sem repetir a linha anterior, fração escrita `a/b` (o site empilha), seta
`→` para processo/reação, unidade junto do número. Toda conta (inclusive nas `erradas`) se refaz em Python.
**Geografia tem resolução em TEXTO:** a `conta` é o trecho citado ou a informação localizada (mapa, gráfico, tabela).

## PROFESSOR (lote de até 15 questões do mesmo conteúdo)
Professor experiente da matéria, de cursinho de ponta. Leia antes `.claude/skills/resolucao-exercicios/SKILL.md` e o
guia da matéria (`.claude/skills/resolucao-exercicios/materias/biologia.md`, `quimica.md` ou `geografia.md`).
Para cada questão do `<lote>.json`:
1. Resolva SOZINHO antes de ler `resolucao_no_site` (texto, alternativas, print). Anote sua letra.
2. Compare com `gabarito_oficial`. Divergiu: releia o comando palavra por palavra e refaça; se ainda divergir, registre
   `gabarito_suspeito` com o motivo (fato ou conta). Nunca proponha trocar o gabarito.
3. Leia `resolucao_no_site` (o que o site mostra: `pista` = Dica antes de responder; depois `erradas[letra marcada]` =
   "Por que eu errei"; `resposta` + `armadilha` = "Resposta correta + a pegadinha"; `passos` (+ `quadro`) = resolução
   animada/em texto; `erradas` = "Por que as outras estão erradas"). Confira: responde o que o enunciado pede? Cada fato
   está certo? Cada conta está certa (Python)? O passo a passo leva à resposta sem pular o passo de que o aluno precisa?
   A `pista` não entrega a resposta? A `armadilha` é a desta questão? `erradas[X]` explica o erro de quem marcou X e
   bate com o texto real da alternativa X (sem "provavelmente/talvez/chute/distrator")? Falta letra em `erradas`?
   `resposta` começa por "Alternativa <gabarito>"? Animação (Bio/Quí): uma transformação por linha, linha certa no passo
   certo, nada repetido, fração `a/b`, o desenho mostra o fenômeno que a questão pede. Termo que aluno não conhece sem
   explicação? Longo demais (encurtar também vale)?
4. Corrigir = deixar certo e claro. Não peça texto que não faz falta.
Saída: grave `<lote>.professor.json` (lista), por questão:
`{"id", "minha_letra", "bate_gabarito": bool, "gabarito_suspeito": "" ou motivo, "ok": bool,
  "problemas": [{"campo": "erradas.B" | "passos.2.conta" | "armadilha" | "resposta" | "pista" | ...,
                 "gravidade": "erro" | "clareza", "o_que_esta_errado": "...", "como_deve_ficar": "texto final"}]}`
Índices de `passos` a partir de 0. Responda no final só 3 linhas (quantas ok, quantas com erro, gabaritos suspeitos).

## ALUNO (mesmo lote, agente diferente)
Estudante do 3º ano do ensino médio, bom mas não especialista; usa só o que um aluno sabe. Não leia nenhum arquivo do
repositório além dos indicados (nem a skill, nem o `<lote>.json`).
Etapa 1: abra `<lote>.aluno-questoes.json`, faça cada questão sem ajuda (abra o `print` quando indicado ou quando o
texto parecer incompleto) e marque uma letra com certeza alta, média ou baixa. Grave `<lote>.aluno-1.json`:
`[{"id", "letra", "certeza", "raciocinio_curto"}]` e PARE (responda só "etapa 1 gravada").
Etapa 2 (só quando receber a mensagem): abra `<lote>.aluno-correcao.json` (a correção como o site mostra). Para cada
questão: refaça só com o que a resolução mostrou (uma ou duas frases); se travou ou precisou de algo que ela não deu,
`falhou: true` e em que passo; se você errou, o "Por que eu errei" da SUA letra explicou o SEU erro?; aponte o que for
confuso, ambíguo, longo demais, termo desconhecido. Grave `<lote>.aluno-2.json`:
`[{"id", "acertou", "refiz", "falhou": bool, "onde_travou", "por_que_eu_errei_explicou": "sim|não|n/a — motivo",
"confuso": ["..."]}]`. Responda só 3 linhas.

## CORRETOR (agente diferente do professor e do aluno)
Recebe `<lote>.json`, `<lote>.professor.json`, `<lote>.aluno-1.json`, `<lote>.aluno-2.json`. Leia a SKILL e o guia da
matéria. Para cada apontamento, decida se procede conferindo no texto e no print (e em Python, se for conta). Corrija só
o que procede, no padrão da skill, sem inflar. Nunca mude enunciado, gabarito, ids. Citação entre aspas = literal da
prova. Sem emoji. Sem presumir gênero de pessoa. Fração `a/b`. Nas `erradas`, o texto real de cada alternativa.
Gabarito suspeito: NÃO mude. Releia; procure na web (errata, definitivo, anulação, resoluções de cursinho). Se a
oficial é defensável (polêmica de leitura/critério), corrija a resolução para explicá-la e ponha o ponto sutil em
`alerta`. Se a oficial contraria fato ou conta, ou o enunciado tem erro que impede chegar a ela: liste em
`<lote>.gabarito.json` `[{"id","prova","decisao":"anular|errata|alerta","motivo","fontes":[...]}]` e não reescreva.
Saída: `<lote>.correcoes.json` no formato do `sr3.py aplica`:
`{"id", "fonte" (copie de <lote>.json), "fonte_id" (copie se existir), "campo", "antes" (valor ATUAL exato, copiado de
resolucao_no_site; omita se o campo não existe), "novo", "motivo" (curto), "papel": "professor|aluno"}`. Para trocar
a lista de passos inteira use `campo: "passos"`. Depois rode `python3 ferramentas/resolucoes/sr3.py aplica <lote>.correcoes.json`
(ele confere o "antes"; se recusar, conserte o arquivo e rode de novo). Grave também `<lote>.rejeitados.json` (o que
não procede e por quê, uma linha cada). Responda só 3 linhas.

## PROFESSOR NOVO (confere só as mudanças)
Outro professor da matéria, que não viu o trabalho. Recebe `<lote>.json` e `<lote>.correcoes.json`. Para cada
correção: o texto novo está certo (fatos, contas em Python, citação literal, letra), claro, no padrão da skill, e não
piorou nada? Grave `<lote>.conferencia.json`: `[{"id","campo","ok": bool,"problema": ""}]`. Para cada `ok: false`,
grave também `<lote>.ajustes.json` no formato do `sr3.py aplica` com `"antes"` = o `novo` da correção e `"novo"` = o
texto certo (ou `"novo"` = o `antes` da correção, para desfazer). Não rode o aplica. Responda só 2 linhas.

## CRÍTICO DE TELA (por tema: 1 a 2 questões de cada conteúdo do tema)
Ver PROTOCOLO.md, papel 3. Site local já no ar em `http://localhost:5173` (vite em `app/`). Playwright:
`require('playwright')`, chromium já instalado. Questão: `http://localhost:5173/#/m/<m>/q/<id>`. Perfil e tema:
como `app/scripts/prints.cjs` (addInitScript no localStorage; `DEMO=1` usa `demo.cjs`). 390 e 1280 px, claro e escuro;
responda errado de propósito, abra a correção, deixe a animação rodar até o fim, abra "Por que as outras estão erradas";
passe pela lista de questões, revisão, flashcards e teoria do tema. Procure: texto cortado, sobreposição, rolagem
lateral, animação que trava ou desenha errado, fração na linha, botão que não responde, contagem errada, erro no
console. Grave `docs/revisao-site/super-revisao/trabalho/<m>-<tema>.tela.json` (`[{"onde","problema","evidencia"}]`)
e screenshots em `docs/revisao-site/super-revisao/trabalho/tela/`. Responda só 3 linhas.
