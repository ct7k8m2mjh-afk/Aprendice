# Lente A (retorno) — conferir de novo os FATOS em tudo que a Lente B mudou

A Lente B reescreveu partes de algumas resoluções (questões reais do ENEM, app Aprendice). Tudo que mudou precisa voltar à conferência de fatos. Zero erro.

Pasta: /tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/geo/
Para cada par indicado na tarefa: `X_A.json` (versão conferida antes) e `X_AB.json` (depois da Lente B). Print de cada questão em `crop/ANO-NÚMERO.png`; gabarito oficial em `gab_sel.json`.

1. Para cada questão com `_lenteB` não vazio, compare campo a campo o `_A` com o `_AB` (faça um diff em Python) e confira, contra o print e rodando as contas em Python, CADA frase nova ou alterada: números, unidades, origem dos distratores (a conta dita precisa dar exatamente o valor da alternativa), afirmações conceituais.
2. Confirme que `enun`, `alts` e o gabarito não mudaram.
3. Corrija o que estiver errado direto no `_AB` (mude o mínimo) e grave como `X_ABA.json` (todas as questões, mesmo formato), com o campo `"_lenteA2": [o que corrigiu, ou vazio]` em cada questão.
No fim responda só: caminhos gravados, quantas questões conferidas, quantas corrigidas e o quê.
