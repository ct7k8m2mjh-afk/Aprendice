# Método Aprendice de Revisão

Pedido do dono (06/11/2026): uma estratégia de revisão que só o Aprendice tenha e que leve o aluno à aprovação em qualquer vestibular com mais eficiência que qualquer concorrente.
Base: pesquisa de concorrentes e de evidência científica em `docs/pesquisa/estrategia-revisao-pesquisa.md` (fontes com link). Este documento é a especificação para o site; cada parte cita a evidência que a sustenta.

## A ideia em uma frase
O aluno não "relê a matéria": ele **tenta lembrar antes de ver**, recebe a correção no ponto exato do raciocínio que falhou, e o site decide **quando cada coisa volta**, contando a partir da data da prova dele, até o domínio ser comprovado em questões diferentes.

O que o mercado faz (Descomplica, Me Salva!, Estratégia, Aprova Total, Poliedro, Bernoulli, Anki, Quizlet): revisão = resumo, mapa mental ou aula de reforço (técnicas de baixa utilidade, Dunlosky 2013); priorização pelo ENEM em geral; TRI só como nota do simulado; espaçamento só em cartões feitos pelo próprio aluno. Nenhum pede a certeza antes da resposta, nenhum conta a revisão a partir da data da prova, nenhum volta o *equívoco* (só a questão).

## Os 10 pilares (o que só o Aprendice terá)

### 1. Ciclo de revisão em 5 tempos (para cada conteúdo)
A revisão em slides (`docs/revisao/<matéria>/<TEMA>.json`) nunca abre com explicação.
1. **Pergunta primeiro** — 2 ou 3 questões reais do conteúdo, no nível do aluno, ANTES dos slides, com a certeza marcada (pré-teste: Richland 2009; Pan & Sana 2021).
2. **Ver acontecer** — os slides animados (abertura, conceito, fórmula, gráfico, exemplo com a conta se movendo, pegadinha). Os slides que respondem às questões erradas no passo 1 aparecem marcados ("é aqui que você errou") (multimídia, segmentação: Mayer 2021).
3. **Lembrar sem olhar** — em cada slide `conceito`/`formula`, antes de revelar, o aluno completa a frase-chave ou escolhe a fórmula (geração: Bertsch 2007, d = 0,40). O slide `fixe` vira 3 lacunas a preencher.
4. **Aplicar em questão nova** — 1 a 3 questões reais diferentes das do passo 1, do mesmo conceito (transferência: Pan & Rickard 2018). Uma delas pode ser de um conteúdo "gêmeo" (pilar 6).
5. **Voltar no dia certo** — o conteúdo entra na agenda do pilar 2.

### 2. Agenda contada a partir da data da prova
- O aluno informa a data de cada prova-alvo (o site sugere pelas datas oficiais).
- Cada questão e cada conteúdo têm um "quanto você ainda lembra" estimado (modelo simples de memória: estabilidade que cresce a cada acerto espaçado e cai no erro; previsão `R = e^(−t/S)`).
- O próximo intervalo é escolhido para que o item esteja firme NO DIA DA PROVA: intervalos de cerca de 20–40% do tempo que falta quando a prova está a semanas, 5–10% quando está a meses (Cepeda 2008); nada agendado para depois da prova.
- Substitui as etapas fixas 1-3-7-16-35 de `app/src/logica/revisao.ts` (mantendo migração: o histórico atual vira a estabilidade inicial; ids não mudam).
- Saída da revisão: só o **sistema** tira um item, depois de 3 acertos em sessões diferentes, sendo pelo menos 1 em questão diferente da original (successive relearning: Rawson 2013; quando o aluno decide sozinho, o ganho some — Karpicke 2009).

### 3. A certeza vale tanto quanto a resposta
O site já pergunta "certeza / acho / chute". Agora isso decide a fila:
- **errou com certeza** → prioridade máxima, volta amanhã e de novo em poucos dias (hipercorreção: Butterfield & Metcalfe 2001; esses erros voltam se não forem revistos: Butler 2011);
- **acertou no chute** → conta como não sabido;
- **painel de calibração**: "onde você acha que sabe e não sabe" por tema (ilusão de fluência: Rhodes & Castel 2008).

### 4. O erro de raciocínio volta, não só a questão
- Cada alternativa errada de cada resolução ganha um código de **equívoco** (ex.: `F02.2:a-metade` = "usou a como o número do t²"). A fábrica marca isso ao escrever "Por que eu errei".
- Quando o aluno marca uma letra, o equívoco dela entra na agenda; na volta, o site traz OUTRA questão real que cobra o mesmo equívoco, e o slide `pegadinha` correspondente (feedback elaborado e transferência: Pan & Rickard 2018; Metcalfe 2017).

### 5. Escudo TRI (ENEM) e regra por prova
- Para quem tem o ENEM como alvo: fila "garanta o básico" — os erros em questões nível 1–3 vêm primeiro; indicador por conteúdo "básico garantido"; alerta de **incoerência** quando o aluno acerta a difícil e erra a fácil do mesmo conteúdo (coerência pedagógica do Inep: mesmos 5 acertos, 480 × 310 pontos).
- Nos simulados ENEM: dica de ordem de resolução (fáceis primeiro) e "não deixe em branco".
- Para vestibulares sem TRI (Fuvest, Unicamp, Unesp, medicinas...): a regra muda conforme o raio-x daquela prova (peso dos temas, discursivas, formato).

### 6. Gêmeos que a banca confunde (intercalação planejada)
- Cada matéria tem uma lista de pares/trios parecidos que a banca troca (ex.: Física: MU × MUV, velocidade média × média das velocidades, deslocamento × distância, série × paralelo, reflexão × refração; Biologia: mitose × meiose; Matemática: PA × PG; Português: coordenada × subordinada).
- Sessão "Qual é este caso?": questões dos gêmeos misturadas; antes de resolver, o aluno diz qual conceito é (intercalação: Brunmair & Richter 2019, g = 0,42, maior em categorias parecidas; Rohrer 2020, 62 × 38).
- A lista de gêmeos é feita pelos especialistas da banca de cada matéria, a partir das pegadinhas das revisões.

### 7. Prioridade = prova-alvo × fraqueza × risco de esquecer
A tela "Hoje" monta a sessão do dia (15–40 min, o aluno escolhe) ordenando por:
`peso do conteúdo nas provas-alvo do aluno (raio-x)` × `fraqueza (erros, certeza errada, nível travado)` × `risco de esquecer até a prova (pilar 2)`.
O treino imita o formato da prova-alvo (Yang 2021: o efeito cresce quando o treino se parece com a prova).

### 8. Painel de domínio real
Nada de "% assistido" ou "cartões vistos". Por conteúdo: **domínio comprovado** (acertos espaçados em questões diferentes), **nível onde trava** (1–10), **previsão para o dia da prova** e **calibração**. Mostra também o "básico garantido" do pilar 5.

### 9. Resolução que esmaece com o domínio
A resolução animada (um único motor) ganha 3 modos que avançam sozinhos: **assistir** → **completar o passo que falta** (o motor esconde um passo e o aluno escolhe/escreve) → **resolver sozinho** (só confere). O aluno que já domina pula a animação (exemplos resolvidos e esmaecimento: Renkl & Atkinson 2003; reversão de especialização: Kalyuga 2003).

### 10. Hábito saudável e modo véspera
- Ofensiva diária contada em **recuperações feitas** (questão, frase, flashcard), não em tempo de tela; "pausa" permitida sem perder a ofensiva; nenhuma punição (Metcalfe 2017).
- **Modo véspera** (últimos 3 dias antes de cada prova): só recuperação leve do que já está dominado e dos erros com certeza; nenhum conteúdo novo; sessão termina cedo; aviso de sono (Gillen-O'Neel 2013; Cousins 2019).
- **Tutor que pergunta**: a IA dá dicas em escada e pede "por que a C está errada?", usando só as resoluções e revisões aprovadas pelas lentes (autoexplicação: Bisra 2018, g = 0,55). Nunca dá resposta pronta antes da tentativa.

## Dados que o site precisa (resumo técnico)
- Por tentativa (já existe em parte): questão, letra, certeza, acerto, tempo, dica, data.
- Por item (questão, frase, flashcard, conteúdo, equívoco): estabilidade S, última revisão, próxima, acertos espaçados, questões diferentes acertadas.
- Por aluno: provas-alvo com data; preferências de tempo diário.
- Conteúdo: `docs/revisao/<matéria>/<TEMA>.json` (formato em `docs/revisao/FORMATO.md`); equívocos por distrator (fábrica); gêmeos por matéria (banca); raio-x por instituição.
- Privacidade: tudo na conta do aluno (LGPD); nada de dado pessoal para terceiros.

## Ordem de construção (fases)
1. **Revisão em slides com o ciclo de 5 tempos** (pilar 1), começando por Física; certeza já existente ligada à fila (pilar 3).
2. **Agenda pela data da prova + painel de domínio + critério de saída** (pilares 2 e 8), com migração do histórico.
3. **Hoje por prova-alvo + Escudo TRI** (pilares 5 e 7).
4. **Equívocos e gêmeos** (pilares 4 e 6), à medida que a fábrica marca os distratores e a banca fecha as listas.
5. **Esmaecimento, modo véspera, hábito e tutor** (pilares 9 e 10).

Cada fase segue o padrão do CLAUDE.md: sistema de design do protótipo, 390/768/1280/1440 claro e escuro, agente separado revisando, testes, publicar.
