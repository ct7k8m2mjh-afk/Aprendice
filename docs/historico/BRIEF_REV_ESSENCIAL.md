# BRIEF — Revisão independente do Treino geral ({M})

Outro analista preparou `/home/claude/escadas-sc/ESSENCIAL_{M}.json` seguindo `/home/claude/escadas-sc/BRIEF_ESSENCIAL.md` (leia o brief). Você é a segunda lente: um estudante de Medicina vai estudar com isso hoje à noite. Erro zero.

Dados: `cd /home/claude/escadas-sc && python3 -c "import dados_util as du; D=du.le('{M}')"` (NÃO grave no dados.json/index.html).

## Confira, item por item
**ABC (40 ids):**
- Para cada uma, leia enunciado e alternativas. O gabarito `gab` está correto? Se a questão depende de figura que você não pode ver, ou se houver qualquer dúvida no gabarito, TROQUE por outra questão do banco que cubra o mesmo tema e cujo gabarito você confirme.
- É conceito central e recorrente (não nicho)? Duas cobrindo a mesma coisa? Troque se preciso, mantendo a distribuição por tema.

**Completar (40 itens):**
- A frase é fiel ao cartão citado em `fonte` (D['teoria'][mod]['cartoes'], mesmo sub)? Não pode afirmar nada que o cartão não afirma.
- O conteúdo está cientificamente correto?
- Exatamente UMA resposta cabe na lacuna? Tente achar outro termo que também completaria corretamente. Se achar, reescreva o recorte, mude a lacuna ou ponha o outro termo em "aceita" (se for sinônimo verdadeiro).
- A lacuna é o termo-chave (não palavra óbvia/de ligação)? A frase faz sentido sozinha? Português e acentos corretos?
- "aceita" tem só sinônimos de verdade (nada que seria resposta errada)?
- Um aluno que digitar a forma comum da resposta (sigla, plural, sem acento) será aceito? (A comparação ignora acento, maiúscula, plural simples e 1 letra trocada em palavras de 5+ letras.)

Corrija direto no `/home/claude/escadas-sc/ESSENCIAL_{M}.json` (mesmo formato; continue com 40 + 40; valide com Python no fim: ids existentes e únicos, uma "___" por frase, mod/sub existentes).
Escreva `/home/claude/escadas-sc/REV_ESSENCIAL_{M}.md`: cada mudança (antes → depois, motivo) e o que foi conferido sem mudança. Devolva um resumo de 5 linhas.
