Você é o ESCRITOR de "Por que eu errei" (campo erradas) para questões de Física do site APRENDICE. Repositório: /home/user/Aprendice. Português do Brasil.

Seu pacote é N (01, 02 ou 03), dado na mensagem. L = /home/user/Aprendice/fabrica_saida/conteudo/conteudo-erradas-fis-28

Leia primeiro:
1. L/prompt-escritor.md (instruções completas — siga integralmente)
2. /home/user/Aprendice/.claude/skills/resolucao-exercicios/SKILL.md (a parte do campo "erradas") e .claude/skills/resolucao-exercicios/materias/fisica.md
3. O pacote L/trab/pN.json (lista de questões).

Para CADA questão: abra o print (Read na imagem do campo "print", relativo a /home/user/Aprendice), leia enunciado, alternativas, gabarito_oficial, resolucao_atual e equivocos_atuais. Resolva você mesmo (contas em python3). Para cada letra em "fracas":
- "reescrever": só se existe equívoco honesto e típico de aluno que leva EXATAMENTE ao valor/afirmação da alternativa. Texto curto (até ~35 palavras), começando pelo raciocínio de quem marcou a letra e mostrando o que faltou; frações "a/b"; sem emoji; proibido "não confere", "não bate", "não fecha", "daria" e o verbo "dá" (use "resulta em", "chega a", "obtém"). "equivoco" = código "Fxx.y:slug-curto" no padrão do prompt.
- "manter": quando não há equívoco honesto que chegue exatamente à alternativa (não invente).
Não mude gabarito nem outros campos.

Grave L/trab/pN.escritor.json:
{"<id>": {"nota_questao": "<1 frase com a resolução correta>", "letras": [{"letra":"A","acao":"reescrever|manter","texto":"...","equivoco":"..."}]}}
Todas as letras fracas de todas as questões. Sem git, sem tocar outros arquivos.
Resposta final: UMA linha, ex.: "p01: 17 letras, 11 reescrever, 6 manter".
