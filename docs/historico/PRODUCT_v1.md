# Product

<!-- impeccable:product-schema 1 -->

> Escrito em 27/10/2026 sem entrevista formal: o Vitor pediu para trabalhar sem perguntas. Tudo abaixo foi dito por ele nesta conversa ou em pedidos anteriores do projeto, exceto o que está marcado **[inferido]**, que é dedução a confirmar.

## Platform

web

## Users

- **Vitor**, vestibulando de **Medicina**. Ordem das provas dele: **Fuvest → Unesp → São Camilo**. A **São Camilo** é a prioridade máxima.
- Estuda sozinho, todo dia, num **PC com Windows** (navegador), não no celular. Usa o app como rotina diária: o título da página foi renomeado por ele para "ATIVIDADES DIARIAS".
- Tarefa: resolver questões reais de vestibular por matéria, da mais fácil para a mais difícil. Errar, entender o porquê pela resolução e voltar a subir.

## Product Purpose

- Um app único de estudo, com seletor de matéria, para não ter que andar entre arquivos.
- Matérias: **Biologia, Química, Matemática e Português**.
- Cada conteúdo vira uma **escada** de questões reais, organizadas por dificuldade.
- Cada questão tem uma **resolução passo a passo**: o que saber antes, passos, resposta, conferência, por que cada alternativa errada está errada e a armadilha.
- Sucesso = o Vitor chegar à prova da São Camilo dominando o padrão das bancas que ele vai enfrentar **[inferido: a meta final é a aprovação; o app em si mede acerto por conteúdo]**.

## Positioning

- **Toda questão já foi publicada** antes, em caderno de prova ou lista pública. Nenhuma é inventada ou redigida pelo produto.
- Toda questão aparece como **print do original**, nunca redigitada, com o link e a procedência da fonte.
- A escada ordena questões reais por dificuldade dentro de cada conteúdo.
- As questões da São Camilo, Fuvest e Unesp têm prioridade sobre as demais.

## Operating Context

- Sessões diárias no PC: "Treino de hoje" (12 questões), "Continuar de onde parei", escadas por conteúdo, simulados e progresso.
- **Cronômetro por questão com pausa**, porque o Vitor sai do exercício e não quer o tempo correndo.
- **Simulados por universidade** (São Camilo, Fuvest, Unesp) e por matéria, até **30 questões** cada.
- O progresso fica salvo **só no navegador**. Exportar/importar `.json` é o único backup.
- Publicado como artifact privado no claude.ai, que roda num visualizador com moldura.

## Capabilities and Constraints

### Regras que não se quebram
- Não criar questão.
- Não redigitar questão.
- Não inventar link, ano, banca ou fonte.
- Respeitar o robots.txt das fontes.

### Corte de quantidade
- Até **500 questões por matéria**, sem nunca excluir questão de vestibular ou ENEM.
- Matemática ficou em **611**: só as de prova já passam de 500.

### Resoluções
- Podem usar fórmulas.
- Zero erro em material de estudo.
- Toda resolução passa por revisão em lentes sucessivas, com agentes diferentes, antes de entrar.

### Formato das resoluções
Campos fixos:
- antes, pista, passos (com tipo), resposta, checagem;
- erradas, com a origem de cada número de distrator;
- armadilha, essencial.

### Ordem das fontes no banco
São Camilo > Fuvest/Unesp > Santa Casa > outras provas > listas de site.

### Ainda não decidido / pendente
- Escada de dicas progressivas, hoje com 1 pista só.
- Lotes de resoluções em fila.
- O destino dos 4 apps individuais antigos.

## Brand Commitments

- **Código de cores do caderno do Vitor**, obrigatório: Matemática verde-água, Português amarelo, Biologia verde, Química rosa/magenta.
  - O mesmo caderno traz História, Física, Geografia e Inglês, que não estão no app.
- Título da página: **"ATIVIDADES DIARIAS"**.
- Nome interno do produto: **Escadas** (São Camilo — Fuvest · Unesp).
- Tom: direto, em português do Brasil. Explica sem assumir conhecimento técnico.

## Evidence on Hand

- Banco atual: **Bio 500 · Quí 500 · Por 500 · Mat 611**. Fontes:
  - provas: Vunesp/Unesp, Fuvest, Santa Casa, Einstein, Famema, Fatec, Sírio-Libanês, FMJ;
  - listas: Brasil Escola, Mundo Educação.
- **Caderno São Camilo 2024/2**, o único público, com prints e resolução pelo comentário oficial. Usado: Bio 7, Quí 8, Mat 9, Por 8.
- Resoluções revisadas, em `*/res/*.json` publicados.
  - Na Matemática, o pacote publicado é a fonte da verdade.
- **Não existe:** prova da São Camilo além de 2024/2 no acervo público. Não fabricar.

## Product Principles

1. **Real ou nada.** Questão não publicada, fonte não verificável ou resolução não conferida não entram.
2. **A prova manda.** O que a São Camilo, a Fuvest e a Unesp cobram decide prioridade, corte e simulado.
3. **Errar ensina.** A resolução explica a alternativa errada que ele marcou, não só a certa.
4. **Rotina sem atrito.** O app é aberto todo dia: retomar, pausar e responder pelo teclado têm de ser imediatos.
5. **Acabamento acima de velocidade.** Um trabalho que levou horas e ficou certo vale mais que um rápido e incompleto.
