# Revisão independente do dicionário "passe o mouse" (D['dic'])
Você é revisor de outra lente. Erro é inaceitável: o aluno vai decorar. Leia /home/claude/escadas-sc/BRIEF_DICIONARIO.md (formato) e o registro do autor DIC_<m>.md.
Para CADA termo de D['dic'] (import sys; sys.path.insert(0,'/home/claude/escadas-sc'); import dados_util as u; D = u.le(m)):
1. Abra de fato uma fonte confiável na web (WebFetch) e confirme 'def', 'origem' (expansão da sigla, idioma, etimologia) e 'exemplo'. Anote a URL. Se não conseguir confirmar a origem/etimologia, remova só esse campo (não invente).
2. 'formas': cada forma deve casar só o termo certo no texto (siglas curtas com maiúscula exata; nada que case palavra comum).
3. Definição simples, ≤ 30 palavras, sem erro de português.
Corrija direto (só o necessário). Gravação num único script rápido (outros agentes podem gravar outras chaves): D = u.le(m); aplique só suas mudanças em D['dic']; u.grava(m, D). Cópia antes em <m>/index.html.bak_rev_dic e <m>/dados.json.bak_rev_dic. Depois: JSON válido, banco idêntico, só 'dic' mudou. Não edite outros arquivos; não rode design/gera_design.py.
Registro: /home/claude/escadas-sc/REV_DIC_<m>.md (termo → fonte URL → ok/corrigido/removido). Relatório final em até 5 linhas.
