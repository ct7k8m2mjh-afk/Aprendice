# Padrão dos cartões do APRENDICE (01/11) — vale para os 4 escritores e para os revisores

## O que o Vitor pediu (palavras dele)
- "Coisas que realmente são úteis para mim. Por exemplo, questões discursivas, só que mais curtas… que eu possa responder com uma frase ou poucas coisas."
- "Flashcard também são cartões rápidos, então a pergunta não pode ser grande demais."
- O que ele rejeitou: "Em que prova eu preciso saber que a alternativa que vai além do contexto do que o texto sustenta é extrapolação?" → NADA de cartão que pede só o NOME de um conceito de manual (metalinguagem: extrapolação, dêitico, rima rica, paráfrase, inferência…). O cartão treina o que a prova pede para FAZER ou EXPLICAR.

## Regras de forma
1. Frente: uma pergunta, uma ideia. Até ~90 caracteres. Em Português, quando a pergunta cita uma frase curta de exemplo, até ~150 caracteres no total.
2. Verso: a resposta em UMA frase (ou um número/expressão). Até ~110 caracteres. Sem lista longa.
3. Pergunta aberta (não sim/não), precisa: só uma resposta certa possível.
4. "Por quê/Como" só quando a resposta é um mecanismo exato (Matuschak: "focused, precise, consistent, tractable, effortful").
5. Nada de enunciado de prova copiado ou parafraseado de perto. Frases de exemplo em Português são autorais (marcar no campo "exemplo_autoral": true) e corretas pela norma.
6. Linguagem direta, português do Brasil, sem jargão desnecessário.

## Regras de conteúdo
- Prioridade pelo que as provas cobram (mapa_discursivas.md + raio-x: Santa Casa 2ª fase Bio 8 / Quí 4 / Port 4; Einstein Prova II; Fuvest/Unesp 2ª fase).
  - Bio: genética nº 1; depois fisiologia humana, citologia, botânica, ecologia, evolução, imunologia/microbiologia.
  - Quí: pH/ionização e gases todo ano; físico-química, soluções, orgânica (funções, isomeria, polímeros, reações), eletroquímica, termoquímica.
  - Mat: geometria, porcentagem/proporção, funções, probabilidade/contagem, PA/PG, log/exponencial. Cartão de Mat = um passo-chave de resolução ou uma relação que se usa na prova (não só "fórmula de X?"; prefira "Como achar X quando se sabe Y?" com resposta curta), conta mental curta permitida.
  - Port: tarefas da 2ª fase — reescrever com restrição (voz, tempo, discurso, pontuação, conector), efeito de sentido de uma palavra/pontuação/figura numa frase dada, identificar e JUSTIFICAR, erro de norma numa frase e a correção (concordância, regência, crase, colocação, pontuação), função de um conector, literatura (característica marcante do movimento/autor reconhecida num traço concreto).
- Exatidão: zero erro. Cada cartão traz "fonte" com URL de material confiável (livro/site didático reconhecido, apostila pública, gramática, site de universidade). Não inventar fonte.

## Formato JSON de cada cartão (campo "flash" do dados.json)
{
 "id": "<m>-d001",            // novo prefixo d (discursiva curta); numeração sequencial
 "mod": "B05", "sub": "B05.5", // use apenas mods/subs que existem (lista enviada)
 "tipo": "conceito|processo|comparar|identificar|formula|exemplo",
 "frente": "...", "verso": "...",
 "essencial": ["1 a 3 termos que a resposta precisa conter"],
 "aceita": ["sinônimos/formas equivalentes aceitas na correção automática"],
 "erro_comum": "uma frase: o erro típico de quem responde",
 "peso": 1|2|3,                 // 3 = cai quase todo ano
 "exemplo": "opcional, até ~200 caracteres, concreto",
 "fonte": "URL",
 "exemplo_autoral": true|false
}

## Frases de completar (campo "essencial.completar")
{"id":"<m>-k001","mod":"..","sub":"..","frase":"... ___ ...","resp":"1 a 3 palavras","aceita":[...],"fonte":"URL"}
- Uma lacuna só; a lacuna é a palavra que a PROVA cobra (não o nome de uma técnica de leitura).
- Frase até ~120 caracteres; o contexto da frase deixa só uma resposta possível.

## Quantidade
- 60 cartões por matéria, distribuídos pelos módulos conforme o peso nas provas (nenhum módulo com zero).
- 40 frases de completar por matéria.
