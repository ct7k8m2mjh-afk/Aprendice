# Estado do protótipo em 01/11/2026 (versão 69 do artifact)

Protótipo publicado como artifact no claude.ai (HTML estático). Código e dados em `app-atual/`.

## Conteúdo
- Banco: Bio 507 · Quí 569 · Mat 610 · Por 535 questões reais, cada uma com print, link da fonte e gabarito publicado. Origem concentrada em SP: Fuvest, Unesp/Vunesp, Santa Casa, Einstein, São Camilo, Famema, Fatec, Sírio-Libanês, FMJ + listas públicas (Brasil Escola, Mundo Educação, Estratégia).
- Resoluções em `app-atual/<m>/res/<sub>.json`, revisadas em lentes sucessivas.
- Teoria em cartões (`teoria` no dados.json), glossário e dicionário.
- Flashcards (refeitos em 01/11): 60 por matéria, estilo "discursiva curta" (resposta em uma frase), cada um com fonte; 40 frases de completar por matéria. Fonte editável em `app-atual/conteudo_fonte/`. Base de pesquisa: `docs/pesquisa/mapa_discursivas.md` (352 discursivas reais de Santa Casa, Einstein, Fuvest e Unesp) e `docs/pesquisa/padrao_cartoes.md`.
- Cartões com imagem: Bio 13, Quí 7, Mat 7 (SVGs em `app-atual/design/flash_img/`, licenças em `LICENCAS.md`).
- Ícones 3D: 53 de módulo (copiados da folha de referência, pipeline em `design/icones_real/foto3d/ref3110/`) + 255 de conteúdo (render Blender + sombra no modelo da referência, `foto3d/sombra3.py`).

## Funcionalidades
- Escadas de degraus por conteúdo; "Continue de onde parou" abre o degrau exato.
- Treino geral (questões + frases + flashcards dos temas que mais caem), retomável.
- Flashcards com correção por IA (quando disponível) ou local; a correção local compara números pelo valor (sinal, fração, vírgula, %, potência, raiz, notação científica) e não confunde nomes químicos parecidos. Voto "Curtiu este cartão? Sim/Não" no verso (Não tira das próximas sessões; guardado em S.flg com o tipo do cartão).
- Simulados por universidade (com logo oficial para São Camilo e Fuvest; fontes em `design/logos/FONTES.md`) e por objetivo; resolução após cada resposta.
- Revisão espaçada dos erros (1, 3, 7, 16, 35 dias); relógio total e por questão com pausa.
- Busca (Ctrl K), tema claro/escuro, tela cheia, layout de celular.
- Progresso salvo no navegador + sincronização opcional com a conta do claude.ai (capacidade db do artifact); exportar/importar JSON.

## Build
`cd app-atual && python3 design/gera_design.py` monta os `index.html`. `PUBLICAR=1` gera a versão publicada (só visuais aprovados). Os scripts `integra_*.py` e `dados_util.py` têm caminhos absolutos do ambiente antigo (`/home/claude/escadas-sc`, scratchpad) — ajustar antes de reutilizar.

## Pendências herdadas
- Logo da Unesp nos simulados.
- Escadas: a maioria dos conteúdos tem menos de 10 degraus.
- Poucas questões com visual em Mat e Por.
- Lacunas de flashcards: Bio (proporções F2 de epistasia/ligação, zoologia, rim/ADH), Quí (polímeros de condensação, Le Châtelier com temperatura, estrutura com imagem), Mat (leitura de gráfico/tabela), Por (expressão idiomática, união de orações, literatura contemporânea).
- Itens pessoais do protótipo a remover no produto público: saudação com nome fixo, capa do Treino geral de Biologia com o rosto do aluno, prioridade fixa em São Camilo.
- Revisar direitos de uso das fontes dos prints antes de abrir ao público.
