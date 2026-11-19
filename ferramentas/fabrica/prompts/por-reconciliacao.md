# Prompt da RECONCILIAÇÃO DE GABARITO — Português (fábrica pela API)
<!-- Versão 1 (19/11/2026). Montado por resolve_api.py. Só roda quando a letra do resolvedor
     (às cegas) difere do gabarito publicado da banca. Regra do dono, 12 e 13/11/2026. -->

{{BRIEF_RESOLVEDOR}}

---

{{ESPECIALISTA}}

---

# Conteúdos (subtemas) de Português no site

{{CONTEUDOS}}

---

# A sua tarefa agora

Um especialista resolveu esta questão às cegas e chegou a uma letra DIFERENTE do gabarito que a
banca publicou. Você recebe a questão, o **print** (que é a questão), a letra do especialista e o
**gabarito oficial**. A regra do dono é clara: **vale o gabarito oficial**, salvo erro de fato.

## O que você faz, nesta ordem
1. Releia o comando da questão palavra por palavra no print: "correta", "incorreta", "exceto",
   "segundo o texto", "o autor defende", "assinale a alternativa que NÃO…". A maioria das
   divergências nasce aí.
2. Releia o texto de apoio e CADA alternativa inteira, no print.
3. Pergunte-se: **que leitura a banca fez** para considerar aquela letra certa? Em que ponto a
   leitura do especialista se separa da dela? Qual convenção gramatical, qual critério de
   literatura, qual recorte do enunciado leva à oficial?
4. Decida:

**(a) `decisao: "oficial"`** — a letra oficial é defensável (polêmica de leitura, critério da
banca, convenção da área, ou o especialista simplesmente leu o comando errado). Escreva a
resolução INTEIRA ensinando a chegar à letra oficial, no esquema abaixo, e explique no `alerta` o
ponto sutil ou polêmico e por que a oficial prevalece. Esta é a saída esperada na maioria dos casos.

**(b) `decisao: "anular"`** — o gabarito oficial contraria FATO verificável (a afirmação oficial é
falsa; a regra gramatical diz o contrário; a alternativa oficial não se sustenta no texto de jeito
nenhum), ou o enunciado tem erro ou dado faltando que impede chegar à oficial. Então NÃO se ensina
a resposta errada: `motivo` começa por "anular: " e traz o erro com o fato. Resolução vazia.

**(c) `decisao: "pendente"`** — você não consegue decidir com certeza absoluta (print incompleto,
suspeita de errata que precisa ser conferida na web, obra literária que você não confirma).
`motivo` diz o que impede. Resolução vazia.

Escolha (b) ou (c) só com razão forte e escrita. Diferença de leitura não é erro de fato:
isso é (a).

## Se `decisao: "oficial"`
Escreva a resolução completa como o resolvedor escreveria (campos e regras abaixo), com a
`resposta` começando por "Alternativa <letra oficial> — ". A resolução não pode dar a entender que
o gabarito é discutível no corpo dos passos: o ponto polêmico vive só no `alerta`.

{{REGRAS_CAMPOS}}
