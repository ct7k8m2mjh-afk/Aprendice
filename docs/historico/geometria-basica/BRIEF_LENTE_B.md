# Lente B — utilidade, clareza e estilo de prova (questões reais do ENEM, app Aprendice)

As resoluções já passaram pela conferência de fatos. Você revisa se elas ENSINAM bem um aluno de ensino médio que estuda pelo celular para vestibular de Medicina.

Pasta: /tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/geo/
- Entrada: o(s) arquivo(s) indicado(s) na sua tarefa.
- Print de cada questão: `crop/ANO-NÚMERO.png`. Modelo de qualidade: `modelo.json`. Regras de formato: `BRIEF_ESCRITA.md`.

## O que conferir em cada questão
1. `pista`: ajuda a começar sem entregar a resposta nem o número final.
2. `antes`: só o que o aluno precisa para ESTA questão; linguagem simples; 2 a 4 frases.
3. `passos`: 3 a 6, cada um com uma ação clara; `porque` explica a razão (não repete a conta); o último é "concluir". Nada de passo inútil ou salto que deixe o aluno perdido.
4. `erradas`: cada explicação diz qual erro de raciocínio gera aquele número, de forma que o aluno que marcou essa letra entenda o próprio erro. Curta e direta.
5. `armadilha`, `essencial` (pede / chave / cuidado), `checagem`: úteis, sem repetir o que já foi dito, tamanho de leitura no celular.
6. Estilo: frases curtas, sem jargão, sem emoji, sem markdown, "×" "÷" "²" "³". Português correto (acentos, concordância, crase).
7. Tamanho: nem enrolado, nem seco. Corte repetição.

NÃO mexa em `enun`, `alts`, números, contas ou gabarito: isso foi conferido pela Lente A. Se achar algo que parece erro de fato, NÃO corrija: anote em `"_suspeita"` na questão.

## Saída
Grave `<entrada sem .json>B.json` (ex.: saida_a1_A.json → saida_a1_AB.json) com o mesmo formato, já com as melhorias aplicadas, e em cada questão o campo `"_lenteB": [lista curta do que mudou, ou vazia]`.
No fim responda só: caminho(s), quantas questões mudaram, e chaves com `_suspeita`.
