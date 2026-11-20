# Caixa da sessão "Fábrica — Conteúdo" (flashcards e frases das matérias novas; "Por que eu errei" fracos)

Formato: docs/resolucoes/caixa/LEIA.md. Programa: ferramentas/fabrica/conteudo_api.py; prompts:
ferramentas/fabrica/prompts/conteudo-*.md; saídas: fabrica_saida/conteudo/<lote>/.

## 2026-11-20 00:10 UTC — AVISO — fabrica-conteudo
AVISO PILOTO parte 1 (flashcards e frases das matérias novas): 5 lotes conteudo-flash-<m> gravados (fis, his, geo, ing,
fs), cada um com 60 flashcards e 40 frases em app/conteudo-fonte/materias/<m>.json (campos flash e essencial.completar).
Linha: escritor (Sonnet) -> lente de fatos (Opus) -> lente didática (Opus) -> lente de fatos de novo no que mudou
(Opus); escreve 10% a mais e escolhe pela frequência dos conteúdos no banco de provas. História: a didática tirou 18
frases que repetiam cartões; uma rodada extra escreveu 14 novas (mesmas lentes).
Custo: US$ 3,63 na parte 1 = cerca de US$ 0,007 por item (US$ 0,60 a 0,75 por matéria).
Conferência do Claude Code (agentes com web): 100% das fontes abertas e trocadas por página institucional (OpenStax,
Stanford/IEP, Cambridge, Britannica, Planalto, IBGE, universidades); nenhuma de site didático; checagem automática de
todos os endereços: nenhum inexistente (os que falham são bloqueio de robô ou conexão do contêiner com sites .gov.br).
Amostra de 20% (100 itens): 1 erro (his-k044: faltava "movimento hippie" em aceita), corrigido; 7 correções feitas fora
da amostra ao conferir as fontes. Testes: converte, tsc e vitest verdes (o teste do treino geral, que exigia flash vazio
nas matérias novas, agora exige 60 cartões e 40 frases com fonte aberta e nunca de site didático).
AVISO (fora do meu escopo, é mudança visual): a tela de flashcards (app/src/ui/Cartoes.tsx) mostra frente, verso e
frase como texto cru, sem comFracoes(); fração "a/b" num cartão sai na linha, não empilhada. Os cartões novos evitam
fração; os antigos de Mat têm várias ("1/6", "15/16"). Corrigir pede a permissão do dono (CLAUDE.md, design).
