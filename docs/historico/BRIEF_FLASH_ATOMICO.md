# Flashcards ATÔMICOS — pedido do Vitor, 29/10 21:18

"Tem alguns que parecem pergunta de vestibular. Flashcard não é assim. Flashcard é: 'qual a função disso?' e eu respondo com uma palavra. Pode ter alguns mais complexos, mas poucos."

Princípio (prática de recuperação / Anki): cada cartão testa UMA ideia, com resposta curta e única. Nada de enunciado longo, contexto de prova, "explique", listas grandes.

Tarefa: reescrever os 50 cartões de D['flash'] da sua matéria (os TEMAS escolhidos pelo analista ficam — mesmos ids, mod, sub, peso e ordem):
- ~40 cartões ATÔMICOS: frente ≤ 12 palavras, pergunta direta ("Qual organela faz a respiração celular?", "Função do ribossomo?", "Fórmula da área do círculo?", "Nox do oxigênio na água oxigenada?", "Figura de linguagem: exagero intencional?"); verso = 1 a 4 palavras (ou uma fórmula curta), com no máximo 1 linha de complemento opcional separado por " — " (ex.: "Mitocôndria — produz ATP"). 'essencial' = 1 item (a palavra/fórmula), 'aceita' = sinônimos e formas equivalentes (singular/plural, sigla, nome usual), 'erro_comum' = 1 frase curta.
- Até ~10 cartões um pouco mais complexos (comparação curta, sequência de 2–3 etapas, regra com condição), ainda com frente ≤ 18 palavras e verso ≤ 15 palavras.
- Se um cartão atual cobria várias ideias, escolha a mais importante para a prova (ou divida, mantendo 50 no total e registrando).
- Português: termos e definições curtas ("Nome da figura que retoma termo anterior por pronome?" → "anáfora"); exemplos só como frase curta dentro da frente.
- Matemática: fórmulas e valores notáveis; respostas numéricas exatas.
- Química: nomes, fórmulas, funções, regras curtas; Biologia: estruturas, funções, processos, agentes/vetores.
- Correção: a IA aceita outras palavras; então 'essencial' tem de ser o núcleo e 'aceita' amplo o bastante, sem aceitar algo errado.
- Erro é inaceitável: confira qualquer dúvida em fonte (web), RDKit/sympy quando couber.
Gravação: import sys; sys.path.insert(0,'/home/claude/escadas-sc'); import dados_util as u; D = u.le(m); ...; u.grava(m, D) — cópia antes em <m>/index.html.bak_atomico e <m>/dados.json.bak_atomico; depois JSON válido, banco idêntico, só 'flash' mudou, 50 cartões. NÃO mexa em D['flash_img'] (já está no formato certo). Não rode design/gera_design.py.
Segunda passada: caçar frente ambígua (mais de uma resposta certa), verso errado e 'aceita' que torne certo algo errado.
Registro: /home/claude/escadas-sc/FLASH_ATOMICO_<m>.md (antes → depois de cada cartão). Relatório final em até 5 linhas.
