# BRIEF — Treino geral (o essencial de cada matéria)

App ATIVIDADES DIARIAS, estudo para Medicina (prioridade: São Camilo, banca VUNESP; depois Santa Casa, Fuvest, Unesp, Einstein).
Vai existir um botão principal "Treino geral" em cada matéria, que mistura 3 tipos de item sobre os TEMAS GERAIS mais cobrados:
ABC (questões reais), completar a frase, e flashcards (já existem, não mexa).

Sua matéria: **{M}** (bio, qui, mat ou por). Leia os dados com:
```
cd /home/claude/escadas-sc && python3 -c "import dados_util as du; D=du.le('{M}'); ..."
```
Chaves úteis: D['banco'] (questões: id, escola, ano, n, enun, alts, gab, modulo, sub, dif 1-10, conceito, tipo 'prova'/'site', degrau, figura),
D['teoria'][mod]['cartoes'] (cartões de teoria JÁ REVISADOS: sub, titulo, oque, identificar, exemplo, caderno[], cuidado),
D['teoria'][mod]['nome'], D['nomesub'], D['areas'], D['flash'] (para não duplicar o que o flashcard já pergunta).
Relatórios de incidência já feitos: design/../ANALISE_FLASH50_{M}.md (use o ranking de temas mais cobrados).

**NÃO ESCREVA no dados.json / index.html.** Grave só o arquivo de saída: `/home/claude/escadas-sc/ESSENCIAL_{M}.json`.

## Parte 1 — ABC principais (40 ids)
Escolha 40 questões DO BANCO (nunca crie nem altere questão; são prints de provas reais). Critérios, nesta ordem:
1. Cobrem os temas gerais que MAIS caem em Medicina (use o ranking de incidência), proporcional à incidência; todos os temas grandes representados.
2. Questão "que eu preciso saber": cobra um conceito central e recorrente, não detalhe raro nem pegadinha de nicho.
3. Preferir vestibular (tipo 'prova'), São Camilo primeiro, depois Santa Casa/Unesp/Fuvest/Einstein; listas ('site') só se cobrirem um tema central sem boa questão de prova.
4. Dificuldade variada (maioria dif 3–7), com gabarito presente e degrau > 0.
5. Leia o enunciado e as alternativas de cada uma escolhida e confira que o gabarito faz sentido (se suspeitar de gabarito errado, NÃO escolha e anote no relatório).
6. Sem duas questões que cobram exatamente a mesma coisa.

## Parte 2 — Completar a frase (40 itens)
Cada item é UMA frase tirada dos cartões de teoria (oque, identificar, caderno, cuidado ou exemplo), com UMA lacuna "___" no termo-chave.
Regras (erro zero):
- A frase vem do cartão (pode encurtar ou recortar um trecho, sem mudar o sentido e sem acrescentar informação que o cartão não traz).
- A lacuna é o termo-chave do conceito (1 a 3 palavras, ou um número/símbolo curto em mat/qui). Nunca uma palavra óbvia nem de ligação.
- Só UMA resposta possível dada a frase: se outro termo também completaria corretamente, reescreva o recorte ou escolha outra lacuna.
- A frase precisa fazer sentido sozinha (sem "isso", "ele" sem referente). Português correto, com acentos.
- "aceita": sinônimos/variações que um corretor justo aceitaria (plural, sigla, sem acento já é tolerado automaticamente; liste sinônimos reais).
- Cobrir os temas mais cobrados, proporcional à incidência; evite repetir exatamente o que um flashcard já pergunta.
- Em mat, prefira conceitos/relações (ex.: "Em uma PG, cada termo é o anterior multiplicado pela ___." → "razão").

## Saída (JSON UTF-8)
```
{"abc": ["<id>", ...40],
 "completar": [{"id": "{M}-c001", "mod": "B05", "sub": "B05.5", "frase": "... ___ ...", "resp": "termo", "aceita": ["..."], "fonte": "cartão B05.5 · caderno"} ...40]}
```
E um relatório curto `/home/claude/escadas-sc/ESSENCIAL_{M}.md`: critérios usados, distribuição por tema, questões descartadas por suspeita.
Antes de terminar, valide com Python: 40 ids existentes e únicos no banco; 40 frases com exatamente um "___"; mod/sub existentes.
