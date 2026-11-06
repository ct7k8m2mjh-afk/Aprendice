# Brief: resoluções das questões básicas de ÁREAS e VOLUMES (ENEM real) para o Aprendice

O Aprendice é um app de estudos para vestibular de Medicina. Cada questão é REAL (prova oficial do ENEM/INEP), mostrada ao aluno como print fiel. Você escreve o texto de apoio e a resolução comentada, em português do Brasil, para um aluno de ensino médio.

## Material (tudo nesta pasta: /tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/geo/)
- Seu lote: `lote_XX.txt` (chave ANO-NÚMERO, gabarito OFICIAL do INEP, degrau, dificuldade). O gabarito oficial manda: se sua conta não bater, PARE e explique no campo `_problema` (não force a resolução).
- Print da questão: `crop/ANO-NÚMERO.png` — abra com a ferramenta Read e leia TUDO (texto, figura, medidas, alternativas).
- Texto extraído do PDF (ajuda na transcrição, pode ter erros de extração): `textos.json` (chave "ANO-NÚMERO" → campo "texto").
- Modelo de estilo e formato (copie o nível de qualidade): `modelo.json`.
- Teoria do app (vocabulário e fórmulas): `teoria_M08_M11.json`.

## O que entregar
Um arquivo JSON `saida_XX.json` (XX = nome do lote) com um objeto por chave:
```
{"ANO-NÚMERO": {
  "enun": "transcrição FIEL do enunciado (sem as alternativas), com quebras de parágrafo \n; figura descrita entre colchetes, ex.: [Figura: retângulo de 20 m por 30 m com ...]",
  "alts": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},   (FIÉIS ao print, com unidade e pontuação)
  "figura": true/false,   (tem figura/tabela essencial?)
  "conceito": "uma frase: o que a questão cobra",
  "tempo": minutos estimados para resolver (inteiro, 2 a 6),
  "pista": "dica que ajuda a começar SEM entregar a resposta (1 a 2 frases)",
  "antes": {"texto": "o que o aluno precisa saber antes (2 a 4 frases, linguagem simples)", "formulas": ["..."], "simbolos": [["termo", "significado"], ...]},
  "passos": [{"faz": "ação curta", "conta": "conta exata", "porque": "por que esse passo", "tipo": "localizar|calcular|comparar|eliminar|concluir"}, ...],   (3 a 6 passos; o último é "concluir")
  "resposta": "Alternativa X — valor.",
  "checagem": "uma conferência por outro caminho (ordem de grandeza, conta inversa, unidade)",
  "erradas": {"letra": "de onde vem esse número: qual erro típico do aluno leva a ele, com a conta" , ...},   (TODAS as 4 erradas; se o número não sai de erro plausível, diga isso com honestidade, como no modelo)
  "armadilha": "o erro mais comum em uma frase",
  "alerta": "",   (deixe "" se não houver nada a alertar; use se a questão tiver ambiguidade, aproximação de π, arredondamento)
  "essencial": {"pede": "...", "chave": "...", "cuidado": "..."}
}}
```

## Regras (não se quebram)
1. ZERO ERRO. Rode toda conta em Python (Bash) antes de escrever. Unidades sempre certas (m² ≠ m, 1 m³ = 1 000 L, 1 dm³ = 1 L, 1 hectare = 10 000 m², 1 cm³ = 1 mL). Use exatamente o π que a prova mandar.
2. Transcrição fiel: não "melhore" o texto da prova. Copie números, unidades e alternativas exatamente.
3. A resolução chega à alternativa do gabarito oficial. As explicações das erradas mostram a conta que gera cada número errado (a origem do distrator) — isso é o coração do app ("errar ensina").
4. Linguagem de aluno, frases curtas, sem jargão desnecessário. Nada de emoji, nada de markdown dentro dos textos (o app formata). Use "×" para multiplicação, "÷" para divisão, "²" e "³" para potências.
5. Mesmo nível de detalhe do `modelo.json` (exemplo_1). Nem mais curto, nem enrolado.
6. Não invente dados que não estão na questão.

No fim, responda só: o caminho do arquivo gerado, quantas questões, e a lista de chaves com `_problema` (se houver).
