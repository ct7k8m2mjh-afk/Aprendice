# APRENDICE — instruções para o Claude Code

## O produto
APRENDICE é um site de estudos para **todo estudante que vai prestar ENEM ou vestibular no Brasil, para qualquer curso** (não só Medicina — decisão do dono, 05/11/2026). O aluno estuda pelas questões reais das provas (ENEM e vestibulares próprios das faculdades públicas e privadas, de todas as regiões), organizadas por nível de dificuldade, cada uma com resolução comentada. Para cada matéria, além das questões, haverá teoria em cartões, flashcards curtos e simulados por universidade.

Hoje existe um protótipo funcional em HTML estático com 4 matérias (Biologia, Química, Matemática, Português), feito para um aluno e por isso com banco concentrado em provas de São Paulo. O objetivo agora é transformá-lo em um **site** para o público geral, acessado pelo navegador no computador, no celular e no tablet (não é aplicativo de loja): contas de usuário, progresso salvo na nuvem, banco nacional de questões e todas as matérias do vestibular (incluir Física, História, Geografia, Inglês, Filosofia e Sociologia; Redação não é matéria do site — decisão do dono, 03/11/2026).

**Regra de manutenção (decisão do dono, 05/11/2026):** toda vez que o dono alterar este arquivo, a mudança é aplicada na hora em todos os outros arquivos do projeto que tratam do mesmo assunto — `PRODUCT.md`, `DESIGN.md`, `README.md`s, `docs/`, briefs da banca (`ferramentas/fabrica/agentes/`), textos do site e código. Nada pode contradizer o `CLAUDE.md`. Ao terminar, informe o que foi alterado em cada arquivo. (`docs/historico/` é registro do passado e não se altera.)

**Regra de publicação (decisão do dono, 05/11/2026):** sempre que uma aba (tela) inteira do site for alterada, publicar a atualização no link público (https://aprendice.vercel.app) logo depois de conferir, e avisar o dono.

Fale com o dono do produto em português do Brasil, direto, passo a passo, sem assumir conhecimento técnico.

**Trabalho autônomo (decisão do dono, 05/11/2026):** trabalhe sozinho do começo ao fim, sem pedir aprovação de plano, sem perguntas e sem mandar prints para o dono conferir — a conferência é sua (princípio 9). Pare para perguntar só diante do que não tem volta: apagar conteúdo ou progresso, gastar acima do teto declarado de um lote, ou um risco de direito autoral ainda não decidido (princípio 10). Ao terminar cada comando, informe em poucas linhas o que foi feito.

## Princípios do produto (não se quebram)
1. **Questões reais e questões do Aprendice.** Questão de prova é real, publicada, com a fonte (prova, ano, número, link); nunca "reconstruir" nem alterar questão de prova. O site **pode ter questões criadas por ele** (decisão do dono, 05/11/2026), desde que: tenham como base o que se cobra em cada matéria (raio-x das provas); sejam resolvidas, corrigidas e analisadas pela banca de especialistas da matéria em todas as lentes antes de ir ao ar; e apareçam sempre identificadas como "Questão Aprendice", nunca como questão de vestibular. Questão de prova **só de texto** aparece escrita, copiada da camada de texto da prova oficial e organizada como a banca organizou (parágrafos, versos, alinhamento, negrito/itálico), com a fonte entre parênteses — decisão do dono, 02/11/2026. **Proibido** transcrever questão com imagem, figura geométrica, gráfico, tabela ou fórmula: essas aparecem como print fiel. O print original fica sempre disponível.
2. **Gabarito de questão de prova só de fonte publicada** (oficial ou resolução reconhecida); sem gabarito publicado, a questão não entra. Questão Aprendice: gabarito definido pelo especialista da matéria e confirmado de forma independente pela lente de fatos.
3. **Zero erro em material de estudo.** Resoluções, teoria, flashcards e frases têm fonte e passam por **revisão em lentes sucessivas** com agentes diferentes: 1ª lente confere fatos contra a fonte; 2ª lente confere utilidade, tamanho e estilo de prova; a 1ª lente volta em tudo que mudou. Nada vai ao ar sem isso.
4. **A prova manda.** Prioridade de conteúdo, simulados e treinos vem do que as provas realmente cobram (raio-x por instituição: temas, frequência, formato). O aluno escolhe as provas-alvo e o site prioriza por elas.
5. **Errar ensina.** A resolução explica a alternativa que o aluno marcou, não só a certa (origem de cada distrator).
6. **Rotina sem atrito.** Retomar de onde parou, pausar, responder pelo teclado, revisão espaçada dos erros.
7. **Nunca perder progresso do aluno.** Mudança de formato de dados exige migração; ids existentes não mudam.
8. **Visual profissional:** nada de emoji nem visual "de IA"; tema claro padrão e escuro; ótimo no celular e no desktop; acessível. **Sistema de design = o protótipo `app-atual/`** (decisão do dono, 05/11/2026): grade, alinhamento, posição de cada elemento, hierarquia, fontes (título da matéria em Dancing Script na cor da matéria; textos em Familjen Grotesk; contas à mão em Caveat), tamanhos, espaçamentos, margens, largura máxima e cantos seguem o protótipo, com os valores exatos de `app-atual/design/materia.css` e `fontes.css`. O protótipo é referência do **sistema**, não do conteúdo: matérias, telas, funções e ícones novos continuam, seguindo esse sistema; nada volta atrás. **Ícones**: sem animação (05/11/2026); podem ser trocados quando o dono mandar (ex.: Biologia não precisa ser só a célula), sempre no mesmo lugar, tamanho e enquadramento definidos pelo sistema. **Ícones novos aprovados pelo dono (06/11/2026) substituem os antigos:** ficam salvos em `docs/icones/<matéria>/` (fonte oficial, PNG original guardado) e são os únicos ícones de tema daquela matéria no site; os ícones antigos dessa matéria (de tema e de subtema, gerados a partir do protótipo ou das pranchas) são excluídos do site e do código que os gera — autorização expressa do dono, sem precisar perguntar. Subtemas não têm ícone: onde aparecem, levam um pontinho na cor da matéria, como no menu do protótipo. Exceção: nada se apaga em `app-atual/` (o protótipo continua intacto como referência e arquivo de estudos do dono). Onde cada ícone entra: `docs/icones/ONDE-USAR.md`.
9. **Conferir antes de entregar:** ver o resultado renderizado em 390, 768, 1280 e 1440 px, nos temas claro e escuro (nada cortado, sem rolagem lateral, nada desalinhado), com cada animação rodando do início ao fim, e rodar os testes. Em trabalho visual, um agente separado, que não fez o trabalho, compara com o sistema de design e lista as diferenças; corrigir até não sobrar nenhuma. Nunca declarar pronto sem ver.
10. **Direitos e privacidade:** **quem decide o que de terceiros vai ao site (questões, prints, figuras, logos) é o dono** (decisão do dono, 05/11/2026). O Claude registra de onde veio cada item e, quando houver risco de direito autoral, informa o dono uma vez, de forma objetiva, sem bloquear a publicação que o dono autorizou. Logos oficiais só onde identificam a prova (simulado por universidade). Nunca enviar dado pessoal do usuário a serviços de terceiros sem necessidade; LGPD.
11. **Acabamento acima de velocidade.**
12. **Reproduzir, nunca copiar (decisão do dono, 05/11/2026).** Quando o dono manda uma referência, o trabalho é **reproduzi-la**: construir de novo, com esforço total, o mesmo resultado visual — nunca copiar e colar o código, o CSS, as imagens ou os arquivos da referência. É **proibido reutilizar designs, telas, componentes ou código de trabalhos feitos anteriormente** (deste projeto ou de outros) para copiar e colar sem comando expresso do dono. Não economizar trabalho se esforçando menos: na dúvida entre copiar e construir, construir. **Exceção por comando expresso do dono (05/11/2026):** o protótipo `app-atual/` é o sistema de design oficial (princípio 8); usar as medidas, fontes, cores e regras de layout dele é obrigatório, não é cópia proibida.

## Como o site ensina (o pensamento por trás de tudo)
Toda tela e todo conteúdo novo seguem esta lógica, construída com o dono desde o começo:
- **Questão real primeiro:** o aluno estuda pelo que a prova cobra, com print fiel, fonte e gabarito oficial.
- **Do mais fácil ao mais difícil:** cada conteúdo começa no básico e sobe de nível; o aluno vê onde trava.
- **Errar ensina:** a correção começa pela letra que o aluno marcou e mostra o que faltou no raciocínio dele.
- **A pegadinha sempre aparece:** o aluno aprende a reconhecer a armadilha que a banca usa.
- **Ver a coisa acontecer:** em Biologia, Química, Matemática e Física, resolução animada, nunca só texto; nas outras matérias, texto passo a passo (regras abaixo).
- **O erro volta:** o que o aluno errou retorna na revisão espaçada até ele acertar.
- **Revisar é lembrar, não reler:** o Método Aprendice de Revisão (`docs/estrategia-revisao.md`, decisão do dono 06/11/2026) — pergunta antes da explicação, certeza antes da resposta, agenda contada a partir da data da prova, o equívoco volta (não só a questão), prioridade pela prova-alvo.
- **Confiável:** tudo tem fonte e passa pelas lentes; na dúvida, não entra.

### A correção da questão (decisão do dono, 05/11/2026)
Depois de responder, o aluno vê só 4 blocos, nesta ordem:
1. **Por que eu errei** — o que faltou no raciocínio de quem marcou aquela letra (não aparece quando o aluno acerta).
2. **Resposta correta + a pegadinha** da questão.
3. **Resolução animada** (Bio, Quí, Mat, Fís) **ou resolução em texto** (demais matérias).
4. **Por que as outras estão erradas** — fechado; abre ao clicar.
Os demais campos de `res/` (antes, checagem, essencial, alerta…) continuam nos dados, mas não ocupam a correção; podem aparecer só onde o dono pedir.

### Resolução animada (obrigatória só em Biologia, Química, Matemática e Física)
**Decisão do dono (09/11/2026):** só Química, Matemática, Física e Biologia têm a resolução ilustrada como vídeo, animada, mostrando o que acontece e como. As outras matérias (Português, Geografia, História, Inglês, Filosofia e Sociologia) têm resolução só em texto, passo a passo; imagens da web só quando forem necessárias (com crédito, princípio 10).
- **Biologia e Química:** animação do que acontece — processo, estrutura, reação, molécula, fluxo.
- **Matemática (e toda conta em Física e Química):** a conta escrita à mão, passo a passo, como o "Assistir resolução" do protótipo, e cada passagem **move os termos na tela**: o x atravessa o sinal de igual e troca de sinal; o número que multiplica vai para o outro lado dividindo; os números da fração viajam até onde são multiplicados (multiplicação cruzada); o que se cancela é riscado; o resultado novo aparece no lugar.
- **Fração sempre empilhada:** numerador em cima, barra, denominador embaixo — nunca "3/5" ou "3 ÷ 5" na mesma linha, em textos, fórmulas e animações.
- Um único motor de animação desenha tudo a partir dos passos de cada resolução (nada feito à mão questão por questão), para todas ficarem iguais e corretas.

## Identidade
- Cores por matéria: a paleta aprovada pelo dono (05/11/2026) em `docs/cores/paleta.json`, já aplicada no site — Biologia verde-folha · Química magenta · Matemática azul-marinho vivo · Português roxo · Física laranja · História marrom cor de couro · Geografia azul-petróleo · Inglês vermelho-cereja · Filosofia e Sociologia amarelo-ouro. Ao entrar numa matéria o site assume a cor dela.
- Vocabulário (manter):
  - **Nível**: cada questão tem um nível de dificuldade — básico (dif 1–3), intermediário (4–6) ou avançado (7–10). Sem limite de questões por conteúdo e sem meta de degraus (decisão do dono, 02/11/2026).
  - **Treine sua evolução**: percorre o conteúdo do mais fácil ao mais difícil; dá para treinar um nível só. O desempenho por nível alimenta o feedback "onde você mais erra".
  - Quantidade de questões aparece só nos conteúdos (subtemas), não na matéria nem no tema.
  - **Treino geral**: mistura questões reais + frases para completar + flashcards dos temas que mais caem.
  - **Plataforma**: estamos construindo um **site**, não um aplicativo. Ele funciona no navegador de qualquer aparelho (computador, celular, iPad e outros), com layout responsivo; aplicativo nas lojas está fora do plano (decisão do dono, 05/11/2026).
  - **Simulado**: só prova inteira, com todas as matérias, escolhida por instituição e ano (título com o ano). Sem simulado por objetivo ou por conteúdo. Meta: provas de 2020 a 2026 (privadas incluídas); provas anteriores a 2020 não são baixadas (dono, 09/11/2026).
  - **Flashcard**: pergunta curta no estilo das discursivas, resposta em uma frase; correção por IA ou local; no verso, fonte e "Curtiu este cartão? Sim/Não" (Não tira das próximas sessões).
  - Faixa de temas sempre no topo da matéria.

## Fábrica de conteúdo (API + créditos do Console)
Trabalho de volume (classificar questões, rascunhar resoluções, flashcards, revisões em lentes) roda em programas da fábrica que chamam a **API do Claude** com a chave `ANTHROPIC_API_KEY`, pagos pelos créditos mensais do Console — não pelo limite do plano. Você (Claude Code) escreve, roda e supervisiona esses programas, confere amostras e integra só o que passou por todas as lentes. Use Batches sempre que não for urgente, declare o teto de gasto de cada lote e registre o gasto. Detalhes e linha de produção: `docs/fabrica-de-conteudo-api.md`.

**Resoluções:** para escrever, revisar ou gerar resoluções (inclusive os prompts da fábrica e as Questões Aprendice), use a skill `resolucao-exercicios` (`.claude/skills/resolucao-exercicios/`), junto com a banca de `ferramentas/fabrica/agentes/`. A skill tem as regras de cada campo de `res/<sub>.json` e um guia por matéria (subtemas, roteiros por tipo de questão, distratores típicos, exemplo conferido), tirados de cerca de 430 resoluções em vídeo (`docs/pesquisa/videos-resolucao/`). O formato da correção e das animações é o da seção "Como o site ensina".

## O protótipo atual (`app-atual/`)
- `bio/ qui/ mat/ por/` — uma matéria cada:
  - `dados.json` — `banco` (questões: id, escola, ano, n, banca, enun, alts, gab, modulo, sub, dif, degrau, conceito, pista, url, tipo prova|site, fase), `teoria` (módulos e cartões de teoria), `nomesub` (conteúdos), `glossario`, `areas`, `flash`, `flash_img`, `essencial.abc` (questões do treino geral), `essencial.completar` (frases), `dic`, `alias`.
  - `res/<sub>.json` — resoluções por conteúdo (chave = id da questão): `antes, pista, passos[{faz,conta,porque,tipo}], resposta, checagem, erradas, armadilha, alerta, essencial, img` (print webp base64).
  - `img/<mod>.json` figuras · `vis/` imagens de resolução · `ic.json` ícones · `capa-tg.webp` arte do Treino geral.
  - `app.js`, `head.html`, `body.html` — código base de cada matéria.
- `design/` — camada principal: `materia.js` (escadas, treino geral, flashcards, correção local de respostas por valor numérico, simulados, revisão espaçada, sincronização), `materia.css`, `shell.html` (casca: menu, início, busca), `gera_design.py` (monta os `index.html`; `PUBLICAR=1` para a versão publicada).
- `design/icones_real/` — ícones 3D (módulo: 53; conteúdo: 255) e o pipeline que os gera.
- `app-atual/*.py` — integração de questões e cartões (`integra_*.py`, `dados_util.py`; caminhos absolutos do ambiente antigo, ajustar antes de usar).
- `app-atual/conteudo_fonte/` — fonte editável dos flashcards e frases (já integrados no dados.json).
- `docs/` — `pedidos-do-dono.md` e `comandos-do-dono.md` (leia primeiro), `pesquisa/` (mapa de 352 discursivas reais, padrão dos cartões), `historico/` (briefs, revisões e auditorias que geraram o conteúdo atual). Raio-x completos de provas (Santa Casa, Einstein, ENEM) estão no Project "ESTUDOS" do claude.ai.

Banco do protótipo: Bio 507 · Quí 569 · Mat 650 · Por 535 questões (concentradas em SP: Fuvest, Unesp/Vunesp, Santa Casa, Einstein, São Camilo, Famema, listas públicas); 60 flashcards + 40 frases por matéria. Em Mat, 40 são do ENEM (05/11/2026): conteúdos novos "áreas básicas" (M08.6) e "volumes básicos" (M11.6), lista em `docs/geometria-basica-enem.md` — ainda precisam ser levados para o site.

## O que precisa mudar para virar produto público
- Banco nacional: ENEM e vestibulares de todas as regiões, com raio-x por instituição; mesmo padrão de fonte e gabarito.
- Manter registrada a origem de cada print (prova oficial, PDF de cursinho), para o dono decidir sobre direitos de uso; a decisão de publicar é do dono. Os prints das bancas ficam por enquanto (decisão do dono, 05/11/2026).
- **Questões de sites didáticos saem (decisão do dono, 05/11/2026):** as 788 questões de Brasil Escola, Mundo Educação, Prepara Enem e InfoEscola não podem aparecer no site — nem print, nem foto, nem logo, nem nome. No lugar delas entram Questões Aprendice (questão nova sobre o mesmo conceito, com contexto, números e alternativas próprios) ou a questão de prova original. Plano em `docs/questoes-aprendice.md`.
- Pendências herdadas: logo da Unesp; mais visuais em Mat e Por; lacunas de flashcards — Bio (proporções F2 de epistasia/ligação, zoologia, rim/ADH), Quí (polímeros de condensação, Le Châtelier com temperatura, estrutura com imagem), Mat (leitura de gráfico/tabela), Por (expressão idiomática, união de orações, literatura contemporânea).
