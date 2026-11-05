# APRENDICE — instruções para o Claude Code

## O produto
APRENDICE é um site de estudos para quem se prepara para **vestibulares em todo o Brasil**. O aluno estuda pelas questões reais das provas (ENEM e vestibulares próprios das faculdades públicas e privadas, de todas as regiões), organizadas por nível de dificuldade, cada uma com resolução comentada. Para cada matéria, além das questões, haverá teoria em cartões, flashcards curtos e simulados por universidade.

Hoje existe um protótipo funcional em HTML estático com 4 matérias (Biologia, Química, Matemática, Português), feito para um aluno e por isso com banco concentrado em provas de São Paulo. O objetivo agora é transformá-lo em **site + aplicativo de celular** para o público geral: contas de usuário, progresso salvo na nuvem, banco nacional de questões e todas as matérias do vestibular (incluir Física, História, Geografia, Inglês, Filosofia/Sociologia, Redação).

Fale com o dono do produto em português do Brasil, direto, passo a passo, sem assumir conhecimento técnico. Antes de escrever código, apresente o plano e espere aprovação. Enumere as tarefas e informe cada uma ao terminar.

## Princípios do produto (não se quebram)
1. **Questões reais e questões do Aprendice.** Questão de prova é real, publicada, com a fonte (prova, ano, número, link); nunca "reconstruir" nem alterar questão de prova. O site **pode ter questões criadas por ele** (decisão do dono, 05/11/2026), desde que: tenham como base o que se cobra em cada matéria (raio-x das provas); sejam resolvidas, corrigidas e analisadas pela banca de especialistas da matéria em todas as lentes antes de ir ao ar; e apareçam sempre identificadas como "Questão Aprendice", nunca como questão de vestibular. Questão de prova **só de texto** aparece escrita, copiada da camada de texto da prova oficial e organizada como a banca organizou (parágrafos, versos, alinhamento, negrito/itálico), com a fonte entre parênteses — decisão do dono, 02/11/2026. **Proibido** transcrever questão com imagem, figura geométrica, gráfico, tabela ou fórmula: essas aparecem como print fiel. O print original fica sempre disponível.
2. **Gabarito de questão de prova só de fonte publicada** (oficial ou resolução reconhecida); sem gabarito publicado, a questão não entra. Questão Aprendice: gabarito definido pelo especialista da matéria e confirmado de forma independente pela lente de fatos.
3. **Zero erro em material de estudo.** Resoluções, teoria, flashcards e frases têm fonte e passam por **revisão em lentes sucessivas** com agentes diferentes: 1ª lente confere fatos contra a fonte; 2ª lente confere utilidade, tamanho e estilo de prova; a 1ª lente volta em tudo que mudou. Nada vai ao ar sem isso.
4. **A prova manda.** Prioridade de conteúdo, simulados e treinos vem do que as provas de Medicina realmente cobram (raio-x por instituição: temas, frequência, formato). O aluno escolhe as provas-alvo e o app prioriza por elas.
5. **Errar ensina.** A resolução explica a alternativa que o aluno marcou, não só a certa (origem de cada distrator).
6. **Rotina sem atrito.** Retomar de onde parou, pausar, responder pelo teclado, revisão espaçada dos erros.
7. **Nunca perder progresso do aluno.** Mudança de formato de dados exige migração; ids existentes não mudam.
8. **Visual profissional:** nada de emoji nem visual "de IA"; ícones 3D realistas (estilo de referência em `app-atual/design/icones_real/foto3d/ref3110/`); tema claro padrão e escuro; ótimo no celular e no desktop; acessível.
9. **Conferir antes de entregar:** ver o resultado renderizado (claro, escuro, 390 px) e rodar os testes. Nunca declarar pronto sem ver.
10. **Direitos e privacidade:** só publicar conteúdo de terceiros (prints, figuras, logos) com direito de uso verificado; logos oficiais só onde identificam a prova (simulado por universidade), de fonte com licença. Nunca enviar dado pessoal do usuário a serviços de terceiros sem necessidade; LGPD.
11. **Acabamento acima de velocidade.**

## Identidade
- Cores por matéria: Matemática verde-água · Português amarelo · Biologia verde · Química rosa/magenta. Definir as das novas matérias seguindo o mesmo sistema.
- Vocabulário (manter):
  - **Nível**: cada questão tem um nível de dificuldade — básico (dif 1–3), intermediário (4–6) ou avançado (7–10). Sem limite de questões por conteúdo e sem meta de degraus (decisão do dono, 02/11/2026).
  - **Treine sua evolução**: percorre o conteúdo do mais fácil ao mais difícil; dá para treinar um nível só. O desempenho por nível alimenta o feedback "onde você mais erra".
  - Quantidade de questões aparece só nos conteúdos (subtemas), não na matéria nem no tema.
  - **Treino geral**: mistura questões reais + frases para completar + flashcards dos temas que mais caem.
  - **Plataforma**: primeiro site (computador, celular, iPad e outros), depois apps nas lojas (decisão do dono, 02/11/2026).
  - **Simulado**: só prova inteira, com todas as matérias, escolhida por instituição e ano (título com o ano). Sem simulado por objetivo ou por conteúdo. Meta: provas de 2020 a 2026 (privadas incluídas); onde não houver, no mínimo 3 anos por instituição.
  - **Flashcard**: pergunta curta no estilo das discursivas, resposta em uma frase; correção por IA ou local; no verso, fonte e "Curtiu este cartão? Sim/Não" (Não tira das próximas sessões).
  - Faixa de temas sempre no topo da matéria.

## Fábrica de conteúdo (API + créditos do Console)
Trabalho de volume (classificar questões, rascunhar resoluções, flashcards, revisões em lentes) roda em programas da fábrica que chamam a **API do Claude** com a chave `ANTHROPIC_API_KEY`, pagos pelos créditos mensais do Console — não pelo limite do plano. Você (Claude Code) escreve, roda e supervisiona esses programas, confere amostras e integra só o que passou por todas as lentes. Use Batches sempre que não for urgente, declare o teto de gasto de cada lote e registre o gasto. Detalhes e linha de produção: `docs/fabrica-de-conteudo-api.md`.

## O protótipo atual (`app-atual/`)
- `bio/ qui/ mat/ por/` — uma matéria cada:
  - `dados.json` — `banco` (questões: id, escola, ano, n, banca, enun, alts, gab, modulo, sub, dif, degrau, conceito, pista, url, tipo prova|site, fase), `teoria` (módulos e cartões de teoria), `nomesub` (conteúdos), `glossario`, `areas`, `flash`, `flash_img`, `essencial.abc` (questões do treino geral), `essencial.completar` (frases), `dic`, `alias`.
  - `res/<sub>.json` — resoluções por conteúdo (chave = id da questão): `antes, pista, passos[{faz,conta,porque,tipo}], resposta, checagem, erradas, armadilha, alerta, essencial, img` (print webp base64).
  - `img/<mod>.json` figuras · `vis/` imagens de resolução · `ic.json` ícones · `capa-tg.webp` arte do Treino geral.
  - `app.js`, `head.html`, `body.html` — app base de cada matéria.
- `design/` — camada principal: `materia.js` (escadas, treino geral, flashcards, correção local de respostas por valor numérico, simulados, revisão espaçada, sincronização), `materia.css`, `shell.html` (casca: menu, início, busca), `gera_design.py` (monta os `index.html`; `PUBLICAR=1` para a versão publicada).
- `design/icones_real/` — ícones 3D (módulo: 53; conteúdo: 255) e o pipeline que os gera.
- `app-atual/*.py` — integração de questões e cartões (`integra_*.py`, `dados_util.py`; caminhos absolutos do ambiente antigo, ajustar antes de usar).
- `app-atual/conteudo_fonte/` — fonte editável dos flashcards e frases (já integrados no dados.json).
- `docs/` — `estado-escadas-01-11.md` (leia primeiro), `pesquisa/` (mapa de 352 discursivas reais, padrão dos cartões), `historico/` (briefs, revisões e auditorias que geraram o conteúdo atual). Raio-x completos de provas (Santa Casa, Einstein, ENEM) estão no Project "ESTUDOS" do claude.ai.

Banco atual: Bio 507 · Quí 569 · Mat 610 · Por 535 questões (concentradas em SP: Fuvest, Unesp/Vunesp, Santa Casa, Einstein, São Camilo, Famema, listas públicas); 60 flashcards + 40 frases por matéria.

## O que precisa mudar para virar produto público
- Tirar tudo que é pessoal do protótipo: nome fixo na saudação, a arte de capa de Biologia com o rosto do aluno, a prioridade fixa em São Camilo (vira escolha do usuário: provas-alvo).
- Banco nacional: ENEM e vestibulares de Medicina de todas as regiões, com raio-x por instituição; mesmo padrão de fonte e gabarito.
- Revisar os direitos de uso das fontes dos prints (muitos vêm de PDFs de cursinhos e páginas de sites didáticos) antes de abrir ao público.
- Pendências herdadas: logo da Unesp; escadas incompletas (a maioria com menos de 10 degraus); mais visuais em Mat e Por; lacunas de flashcards em `docs/estado-escadas-01-11.md`.
