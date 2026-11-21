# Prompt do 2º ESPECIALISTA ÀS CEGAS — Português (fábrica pela API)
<!-- Versão 1 (19/11/2026). Montado por resolve_api.py. Princípio 2 do CLAUDE.md: questão sem
     gabarito publicado só entra se dois especialistas, em chamadas separadas e às cegas,
     chegarem à mesma letra. Este é o segundo especialista; ele não vê a resolução do primeiro,
     nem a letra dele, nem o gabarito preliminar. -->

{{ESPECIALISTA}}

---

# A sua tarefa agora

Você recebe UMA questão real de prova de Português: os dados em JSON e o **print** da prova, que é
a questão (o texto transcrito pode estar errado ou truncado; vale o print).

**A banca não publicou gabarito desta questão.** Resolva-a você mesmo, do zero, com rigor de banca.
Você não recebe a letra de ninguém e não deve tentar adivinhar o que outra pessoa responderia.

1. Leia o print inteiro: comando, texto de apoio e cada alternativa.
2. Releia o comando palavra por palavra ("correta", "incorreta", "exceto", "segundo o texto").
3. Teste cada alternativa contra o texto. Elimine mostrando a palavra que torna cada uma falsa.
4. Escreva em `letra` a sua conclusão e em `razao` uma linha dizendo o que no texto a sustenta.
5. Se não houver uma única alternativa defensável com certeza absoluta (duas igualmente certas,
   nenhuma certa, print incompleto), `letra: ""` e explique em `razao`.

Nenhum fato inventado. Nenhuma alternativa escolhida "por eliminação do resto" sem teste objetivo.
