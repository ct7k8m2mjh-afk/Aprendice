# Revisão essencial: o formato da revisão no site (dono, 06/11/2026)

**Decisão do dono:** a revisão de cada matéria é REVISÃO, não aula. Ninguém lê 800 slides um a um. Cada tema mostra só o que todo aluno precisa saber e entender e o que é primordial nas provas. Modelo: o caderno **Revisaí** (Poliedro), que cobre a Matemática inteira do ensino médio em cerca de 110 páginas: tópicos curtos com subtítulos, fórmula ou regra em destaque, um **mapa mental** por tema, **questão resolvida** em alguns temas, o **termômetro** (o que mais cai) e o boxe de **conexão** com outras matérias.

## Tamanho
- Por tema: **8 a 12 telas** no total (antes: 50 a 60 slides).
- Por matéria: cerca de **100 a 150 telas** (antes: 600 a 800).
- Cada tela cabe numa tela de celular sem rolar (390 × 620 px), até **40 palavras** de texto corrido.

## Estrutura de cada tema (campo novo `essencial` no `revisao/<TEMA>.json`)
```json
"essencial": {
  "termometro": [ {"sub":"B04.2","peso":"alta|media|baixa","provas":"Fuvest, Unesp, Enem","como_cai":"1 frase"} ],
  "mapa": { "centro":"Divisão celular", "ramos":[ {"sub":"B04.1","titulo":"Ciclo celular","chave":"fórmula, regra ou ideia em até 12 palavras","liga":["B04.2"]} ] },
  "telas": [ {"sub":"B04.1","titulo":"...","pontos":["até 4 tópicos, cada um com até 18 palavras"],"formula":"KaTeX opcional","pegadinha":"1 frase: a armadilha que a banca usa","visual":{"tipo":"animacao|esquema|grafico|foto","descricao":"...","movimento":["roteiro curto"]}} ],
  "questao_resolvida": {"enunciado":"Questão Aprendice (nova, no estilo da prova mais frequente)","alternativas":["A) ...","B) ...","C) ...","D) ...","E) ..."],"gabarito":"C","passos":[{"faz":"...","conta":"...","mov":"..."}],"por_que_erram":"1 frase"},
  "conexao": [ {"materia":"Química","frase":"1 frase ligando o tema a outra matéria"} ]
}
```
Ordem na tela: **Termômetro** (o que mais cai neste tema) → **Mapa mental** do tema (uma tela) → **uma tela por conteúdo** (do que mais cai para o que menos cai) → **Questão resolvida** → **Conexão** (opcional).

## Regras de conteúdo
- Escolher pelo que a prova cobra (princípio 4): o peso do termômetro vem da seção "O que as provas cobram" das fichas e dos raio-x por instituição. Conteúdo de peso baixo ganha tela curta (2 tópicos).
- Cada tela responde: o que é, a fórmula ou regra, como reconhecer na questão e a pegadinha. Nada de história, curiosidade ou abertura motivacional, a não ser que caia na prova.
- O `essencial` é tirado do material que JÁ PASSOU pelas lentes (slides, cartões, resumo, fórmulas do mesmo JSON). Não entra fato novo; se faltar algo essencial, anotar em `pendencias`.
- Fração empilhada, fórmulas em KaTeX (≤ 358 px), Humanas em `\text{}`, sem emoji, cor da matéria.
- Questão resolvida: questão nova (Questão Aprendice), 5 alternativas, passos curtos (até 5), a errada mais marcada explicada em "por_que_erram".

## Lentes
1. Lente A (fatos): confere cada tópico do `essencial` contra os slides e cartões do mesmo arquivo (já aprovados) e refaz contas; nada novo sem fonte.
2. Lente B (didática): corta o que não cai, confere tamanho (40 palavras, 4 tópicos, 12 telas por tema), clareza e ordem pelo termômetro.

## No site
- A aba **Revisão** de cada matéria mostra o `essencial` de cada tema.
- Os slides completos (`slides`) continuam guardados e podem aparecer só como "Aprofundar este conteúdo", fechado, dentro da tela do conteúdo (o dono decide se fica).
