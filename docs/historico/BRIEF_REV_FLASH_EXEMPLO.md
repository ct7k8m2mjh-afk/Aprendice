# BRIEF — Revisão independente dos exemplos dos flashcards ({M})

Outro agente escreveu `/home/claude/escadas-sc/FLASH_EXEMPLO_{M}.json` seguindo `/home/claude/escadas-sc/BRIEF_FLASH_EXEMPLO.md` (leia o brief). Você é a segunda lente. Um vestibulando de Medicina vai estudar com isso hoje à noite: o erro tem de ser zero.

Os dados ficam em `cd /home/claude/escadas-sc && python3 -c "import dados_util as du; D=du.le('{M}')"`, nas chaves D['flash'] e D.get('flash_img', []). NÃO grave em dados.json nem em index.html.

Para CADA flashcard, leia a frente, o verso e o exemplo juntos e confira:
- O exemplo está correto, fato por fato e conta por conta? Refaça as contas.
- O exemplo ilustra exatamente a resposta do verso, sem contradizê-lo e sem cair numa exceção?
- Nas comparações (A × B), há um exemplo de cada lado?
- Um aluno que não entendeu o verso entenderia com o exemplo? Exemplo vago ("por exemplo, em várias situações...") não serve: reescreva.
- O português está correto e com acentos? O tamanho está razoável (até ~300 caracteres)? Em português, os exemplos criados estão marcados com "(criado)"?
- Se houver `verso_novo`, ele está certo e é melhor que o verso atual? Se não for, apague.

Corrija direto no `/home/claude/escadas-sc/FLASH_EXEMPLO_{M}.json`, no mesmo formato e com todos os ids. Valide com Python no fim.
Escreva `/home/claude/escadas-sc/REV_FLASH_EXEMPLO_{M}.md` com cada mudança (antes → depois e o motivo). Devolva um resumo de 5 linhas.
