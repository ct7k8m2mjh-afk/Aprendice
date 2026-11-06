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
- Pastas: `ferramentas/fabrica/` (scripts) e `fabrica_saida/api/<lote>/` (resultados, fora do site até aprovação).
- Resoluções de questões de prova: `ferramentas/fabrica/resolucoes_api.py` (`seleciona`, `roda --teto`, `integra`). Os prompts são os briefs da banca (`ferramentas/fabrica/agentes/`) + especialista da matéria + skill `resolucao-exercicios`; aprovadas vão para `app/conteudo-fonte/provas/<prova>/resolucoes.json`.
- **Orçamento**: cada lote declara o teto em dólares antes de rodar; o script estima o custo, para se passar do teto e registra o gasto real em `fabrica_saida/gastos.csv`. No Console, definir também limite de gasto da organização.
- Preferir **Batches** (metade do preço, resposta em até 24 h) para tudo que não é urgente; Messages só para testes.
- Prompts versionados em arquivo (`ferramentas/fabrica/prompts/*.md`), testados primeiro no Playground com casos difíceis.
- A chave fica só na variável de ambiente `APRENDICE_API_KEY` do ambiente "Fabrica" do Claude Code (os programas a enviam como `Authorization: Bearer`). Nunca no código, nunca no chat, nunca no repositório. Conectada e testada em 06/11/2026.
- Saída sempre em JSON validado por esquema; resposta que não valida volta para a fila.
- Nenhum conteúdo da fábrica é "verdade" sem fonte publicada: o gabarito vem da fonte, a resolução é conferida, as frases de teoria citam a fonte.

## Depois, no app público
As funções de IA do app (correção de flashcard, "explique de outro jeito", dúvida sobre a questão) também usam a API, mas com **orçamento próprio pago** e limites por usuário — os créditos mensais do plano são para desenvolvimento e produção de conteúdo, e param no teto do mês.
