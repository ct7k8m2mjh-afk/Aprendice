# APRENDICE — instruções para o Claude Code

## O produto
APRENDICE é um aplicativo de estudos para quem se prepara para **vestibulares de Medicina em todo o Brasil**. O aluno estuda pelas questões reais das provas (ENEM e vestibulares próprios das faculdades de Medicina, públicas e privadas, de todas as regiões), em escadas de dificuldade, com resolução comentada, teoria em cartões, flashcards curtos e simulados por universidade.

Hoje existe um protótipo funcional em HTML estático com 4 matérias (Biologia, Química, Matemática, Português), feito para um aluno e por isso com banco concentrado em provas de São Paulo. O objetivo agora é transformá-lo em **site + aplicativo de celular** para o público geral: contas de usuário, progresso salvo na nuvem, banco nacional de questões e todas as matérias do vestibular (incluir Física, História, Geografia, Inglês, Filosofia/Sociologia, Redação).

Fale com o dono do produto em português do Brasil, direto, passo a passo, sem assumir conhecimento técnico. Antes de escrever código, apresente o plano e espere aprovação. Enumere as tarefas e informe cada uma ao terminar.

## Fases do projeto (respeitar a ordem)
1. **Protótipo completo — FASE ATUAL.** Construir o app inteiro já no formato final (uma base de código para site + iOS + Android, para nada ser reescrito depois), rodando **só localmente**: todas as telas e funções, com o conteúdo real do `app-atual/`. Login, nuvem e IA ficam simulados (progresso salvo no aparelho). Nada de servidor, banco na nuvem, domínio, lojas ou deploy nesta fase. Mostrar cada tela com prints em tamanho de celular e de computador e uma prévia navegável.
2. **Rodadas de ajustes** pedidas pelo dono, até ele aprovar.
3. **Parte real:** contas, banco de dados na nuvem, IA do app pela API.
4. **Simulador e aparelho real.**
5. **Publicação:** site no ar e apps nas lojas.
Não avançar de fase sem aprovação explícita do dono.

## Princípios do produto (não se quebram)
1. **Questões só reais**, de provas publicadas, com a fonte (prova, ano, número, link). Nunca criar, redigitar ou "reconstruir" questão. O app mostra o print/fiel da questão original; o texto serve para acessibilidade e busca.
2. **Gabarito só de fonte publicada** (oficial ou resolução reconhecida). Sem gabarito publicado, a questão não entra.
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
  - **Escada / degrau**: cada conteúdo é uma escada de questões do mais fácil ao mais difícil (meta: 10 degraus por conteúdo).
  - **Treino geral**: mistura questões reais + frases para completar + flashcards dos temas que mais caem.
  - **Simulado**: resolução logo após cada resposta; por universidade e por objetivo.
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
