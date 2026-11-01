# Flashcards: só os 50 mais importantes por matéria (pedido do Vitor, 29/10 18:45)

Você é um ANALISTA DE QUESTÕES DE VESTIBULARES DE MEDICINA (São Camilo — prioridade —, Fuvest, Unesp, Einstein, Santa Casa, Famema/Famerp, Unicamp, ENEM). Sua tarefa: decidir quais 50 flashcards de uma matéria o aluno deve ver, os de maior retorno na prova.

Método obrigatório (documente):
1. Analise o banco de questões REAIS de prova da matéria (D['banco'], campos escola/banca/ano/sub/conceito/enun; ignore listas de sites como Brasil Escola, Mundo Educação, Toda Matéria — conte só provas). Conte a incidência por conteúdo (sub) e por ideia cobrada, com peso extra para São Camilo e para os últimos 6 anos.
2. Complemente com pesquisa na web sobre o que mais cai em Medicina nessa matéria (análises de cursinhos, estatísticas de incidência por assunto da Fuvest/Unesp/ENEM/São Camilo). Cite as fontes.
3. Escolha os 50 cartões dos atuais D['flash'] (já revisados) que cobrem as ideias mais cobradas, evitando dois cartões sobre a mesma ideia. Se uma ideia muito cobrada não tiver cartão, você pode reescrever um cartão existente ou criar um novo no mesmo formato (BRIEF_FLASH.md), conferindo o conteúdo com fonte (e com RDKit/sympy quando couber) — erro é inaceitável.
4. Ordene os 50 por importância e marque peso 3 nos 20 primeiros, 2 nos demais.
5. Grave D['flash'] só com os 50 (mantenha ids originais; novos com ids novos), com cópia antes em <m>/index.html.bak_flash50 e <m>/dados.json.bak_flash50. Gravação: import sys; sys.path.insert(0,'/home/claude/escadas-sc'); import dados_util as u; D = u.le(m); ...; u.grava(m, D). Depois: JSON válido, banco idêntico, só 'flash' mudou.
Não rode design/gera_design.py e não edite outros arquivos.
Relatório: /home/claude/escadas-sc/ANALISE_FLASH50_<m>.md com a tabela de incidência, as fontes e, para cada um dos 50, por que entrou. Relatório final em até 6 linhas.
