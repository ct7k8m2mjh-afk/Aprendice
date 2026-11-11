# Prompt para a sessão de resoluções (colar numa sessão nova, repositório ct7k8m2mjh-afk/Aprendice, ramo app-prototipo-completo)

<papel>
Você é o coordenador da banca de resoluções do Aprendice. Sua tarefa é escrever as resoluções comentadas das questões de prova do site que ainda não têm resolução, com a qualidade da banca e sem nenhum erro.
</papel>

<leia_primeiro>
CLAUDE.md (princípios 2, 3, 5; "Como o site ensina": correção em 4 blocos; "Resolução animada": animada só em Biologia, Química, Matemática e Física, texto passo a passo nas outras; fração sempre empilhada), a skill .claude/skills/resolucao-exercicios/ (SKILL.md e o guia da matéria em materias/), os briefs da banca em ferramentas/fabrica/agentes/ (BRIEF_RESOLVEDOR.md, BRIEF_LENTE_FATOS.md, BRIEF_LENTE_DIDATICA.md, especialistas/), docs/estrategia-revisao.md (pilar 4: código do equívoco em cada alternativa errada) e docs/comandos-do-dono.md (comando 25).
</leia_primeiro>

<tarefa>
1. Levantamento: quantas questões de prova do site não têm resolução, por matéria, prova e nível (o site monta tudo com `cd app && python3 scripts/converte.py`; veja como as resoluções das provas entram: campo `res` das questões em app/conteudo-fonte/provas/<id>/prova.json e res/ das matérias). Grave em docs/resolucoes/levantamento.md.
2. Ordem: primeiro ENEM e as provas-alvo mais comuns, níveis 1 a 6; depois o resto. Matéria por matéria.
3. Para cada questão: o resolvedor (com o especialista da matéria) escreve no formato de res/ (antes, pista, passos[{faz, conta, porque, tipo}], resposta, checagem, erradas por letra com o código do equívoco, armadilha, alerta, essencial); depois três lentes, cada uma num agente diferente que não escreveu o texto: lente de fatos (confere contra a questão e o gabarito oficial; refaz contas) → lente de didática (tamanho, clareza, estilo de prova) → lente de fatos de novo em tudo que mudou. Só entra no site o que passou nas três.
4. Gabarito: sempre o oficial que já está na questão; se a resolução chegar a outra letra, não publique: registre em docs/resolucoes/divergencias.md.
5. Não altere enunciado, print, gabarito, classificação nem ids. Não mexa no design do site (regra do dono: qualquer mudança visual precisa da permissão dele).
</tarefa>

<conferencia>
A cada lote: `cd app && python3 scripts/converte.py && npx tsc --noEmit -p . && npx vitest run` verde; abra 3 questões do lote no site (build local + Playwright; login #ent-email teste@exemplo.com / #ent-senha 123456, botão .l-botao) e veja a correção em 4 blocos completa. Registre em docs/resolucoes/andamento.md quantas foram feitas, quantas as lentes reprovaram e por quê.
</conferencia>

<git>
Commits por lote, mensagem descritiva em português. Antes de cada push: `git pull --rebase origin app-prototipo-completo`; depois `git push origin HEAD:app-prototipo-completo`. Outra sessão trabalha no mesmo ramo: mexa só nos arquivos de resolução e nos docs de docs/resolucoes/. Não publique na Vercel; avise o dono ao fim de cada matéria para a outra sessão publicar.
</git>

<saida>
Ao fim de cada matéria, resposta curta em português: quantas resoluções entraram, quantas reprovadas nas lentes, divergências de gabarito, o que falta.
</saida>
