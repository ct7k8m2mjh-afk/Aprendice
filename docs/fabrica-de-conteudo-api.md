# Fábrica de conteúdo pela API (créditos do Console)

## Divisão de trabalho
| Quem | O que faz | Quem paga |
|---|---|---|
| **Claude Code** (conversa com o dono) | Planeja, escreve o app, escreve e roda os programas da fábrica, confere amostras, integra o que foi aprovado, decide | Limite do plano do dono |
| **API do Claude** (chave do Console, rodando dentro dos programas da fábrica) | Trabalho repetitivo em volume: classificar, rascunhar, revisar em lentes | Créditos mensais da API (organização do Console vinculada ao plano) |

Créditos mensais cobrem: Messages API, **Message Batches API**, Playground, Agent SDK e `claude -p` rodando com chave de API da organização vinculada. Não cobrem o Claude Code interativo. Créditos não acumulam: o que sobra no mês se perde, então vale ter lotes prontos para rodar. Fonte: https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-and-team-plans

## Linha de produção (cada etapa é um lote; nada entra no app sem passar por todas)
1. **Ingestão** (sem IA): baixar provas públicas, recortar prints, extrair texto, ler o gabarito publicado. Respeitar robots.txt; registrar a origem de cada print (o dono decide sobre direitos de uso).
2. **Classificação** — modelo rápido (`claude-haiku-5-5`), Batches: matéria, módulo/conteúdo (taxonomia do `dados.json`), dificuldade 1–10, conceito em uma linha, se tem figura.
3. **Resolução (rascunho)** — `claude-sonnet-5-5`, Batches: campos `antes, pista, passos, resposta, checagem, erradas (origem de cada distrator), armadilha, essencial`. O modelo resolve **antes** de ver o gabarito; divergência com o gabarito publicado → fila de exceção, nunca "ajustar" a resolução ao gabarito sem explicação.
4. **Lente 1 — fatos** — `claude-opus-5-5`, outro prompt, sem ver o raciocínio do rascunho: refaz a questão, confere cada afirmação e número, aponta correções exatas.
5. **Lente 2 — utilidade e clareza** — `claude-opus-5-5`, prompt diferente: linguagem de aluno, pista que não entrega, distratores honestos.
6. **Lente 1 de novo** em tudo que mudou.
7. **Conferência do Claude Code**: amostra aleatória (ex.: 10% de cada lote + 100% da fila de exceção), testes automáticos (campos, tamanho, JSON), visualização no app. Só então integra.

O mesmo esquema vale para flashcards e frases (padrão em `docs/pesquisa/padrao_cartoes.md`) e para raio-x de provas novas.

## Regras da fábrica
- Pasta sugerida: `ferramentas/fabrica/` (scripts) e `fabrica_saida/<lote>/` (resultados, fora do app até aprovação).
- **Orçamento**: cada lote declara o teto em dólares antes de rodar; o script estima o custo, para se passar do teto e registra o gasto real em `fabrica_saida/gastos.csv`. No Console, definir também limite de gasto da organização.
- Preferir **Batches** (metade do preço, resposta em até 24 h) para tudo que não é urgente; Messages só para testes.
- Prompts versionados em arquivo (`ferramentas/fabrica/prompts/*.md`), testados primeiro no Playground com casos difíceis.
- A chave fica só na variável de ambiente `ANTHROPIC_API_KEY` (segredo do ambiente do Claude Code). Nunca no código, nunca no chat, nunca no repositório.
- Saída sempre em JSON validado por esquema; resposta que não valida volta para a fila.
- Nenhum conteúdo da fábrica é "verdade" sem fonte publicada: o gabarito vem da fonte (sem gabarito publicado, só o gabarito do Aprendice: dois especialistas às cegas na mesma letra — princípio 2), a resolução é conferida, as frases de teoria citam a fonte.

## Piloto de Português (19/11/2026): o que já está construído e o que ele mediu

Programa: `ferramentas/fabrica/resolve_api.py` (chave em `APRENDICE_API_KEY`, ou `ANTHROPIC_API_KEY`).
Prompts versionados em `ferramentas/fabrica/prompts/por-*.md`, montados a partir dos arquivos oficiais do
projeto (briefs da banca, especialista da matéria, guia da skill), para não haver texto duplicado que possa
contradizer o `CLAUDE.md`. Conferência: `ferramentas/fabrica/confere_amostra.py`.

Etapas de cada lote, todas em Message Batches, com estado em disco (o programa pode ser rodado de novo e
continua de onde parou, sem pagar duas vezes):

| Etapa | Modelo | O que faz |
|---|---|---|
| resolvedor | `claude-sonnet-5-5` | resolve ÀS CEGAS (sem o gabarito) e escreve a resolução inteira |
| reconciliação | `claude-opus-5-5` | só quando a letra do resolvedor difere da oficial: entende a leitura da banca e resolve com a oficial, ou manda anular/pendente |
| gabarito cego | `claude-opus-5-5` | 2º especialista às cegas nas questões sem gabarito publicado (princípio 2) |
| lente de fatos | `claude-opus-5-5` | resolve sozinha antes de criticar e devolve correções por caminho de campo |
| lente didática | `claude-opus-5-5` | clareza para o aluno; não mexe em fato |
| lente de fatos (2ª) | `claude-opus-5-5` | tudo que a didática mudou **e** tudo que ela apontou como possível erro de fato |

Medido no lote por-0094 (50 questões de Português): **US$ 6,11 no lote, US$ 0,12 por questão**, com cache de
prompt (a entrada cai de 32 mil para ~4 mil tokens por pedido). O resolvedor, às cegas, acertou a letra oficial
em 47 de 50 (94%).

O que o piloto provou que **não** se pode dispensar:
- **A conferência do Claude Code com agentes é obrigatória.** Das 3 questões sorteadas na amostra, as 3 tinham
  item a corrigir. Lote nenhum vai ao ar só com as lentes de API.
- **A etapa de API não abre a web**, então `fontes` é sempre vazio nela: os modelos escreveram 78 endereços de
  memória, vários inexistentes. Quem confere acrescenta a fonte que abriu de verdade.
- **Pendência precisa ser conferida**, não aceita: as 2 pendências do lote não se sustentavam e viraram resolução.

### Confirmação das obras (etapa obrigatória, fora da API)

A etapa de API não abre a web. Em literatura isso cria um buraco previsível: a fábrica marca
"OBRA (confirmar na web)", declara confiança baixa quando é o caso, e **não pode confirmar nada** —
`fontes` sai vazio. Se ninguém atender ao sinal, o palpite vai ao ar com cara de fato.

Por isso cada lote tem uma etapa própria de confirmação das obras, em agente com acesso à web, que
roda junto com a conferência: `docs/resolucoes/CONFIRMA-OBRAS.md`. O que se confirma entra em
`fontes`; o que não se confirma **sai da resolução**.

## Depois, no app público
As funções de IA do app (correção de flashcard, "explique de outro jeito", dúvida sobre a questão) também usam a API, mas com **orçamento próprio pago** e limites por usuário — os créditos mensais do plano são para desenvolvimento e produção de conteúdo, e param no teto do mês.
