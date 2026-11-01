# Cartões de teoria (29/10) — o que o Vitor pediu

Ele leu a teoria do app e disse: muito texto, pequeno, não chama atenção; falta EXEMPLO ("anáfora: o pronome retoma o que já foi dito — beleza, mas cadê o exemplo?"); quer "não só o que é, mas como identificar, como se vê no texto, qual é o exemplo, exemplo no cotidiano, como é usado". Fórmulas em notação de verdade (ex.: PV = nRT, T(K) = θ(°C) + 273), não escritas por extenso.

## Formato (gravar em D['teoria'][<mod>]['cartoes'], lista na ordem dos conteúdos)
Um cartão por CONTEÚDO (sub) do módulo, e mais cartões extras quando um conteúdo tiver 2+ ideias que caem em prova (ex.: anáfora e catáfora = 2 cartões).
{
 "sub": "Q06.1",                 # id do conteúdo (de D['nomesub'])
 "titulo": "Transformações gasosas",   # curto (até 5 palavras)
 "oque": "1–2 frases curtas, linguagem simples",
 "identificar": "como reconhecer na questão/no texto: pistas, palavras do enunciado, o que a banca pede",
 "exemplo": "exemplo concreto e correto: do cotidiano E/OU de prova (em Português: frase real com o termo destacado entre **asteriscos**)",
 "caderno": ["linhas curtas para escrever no caderno: fórmula, esquema, regra em notação (no máx. 4 linhas, cada uma ≤ 60 caracteres)"],
 "cuidado": "a pegadinha mais comum (1 frase)"
}
- Frases curtas (≤ 22 palavras). Nada de enrolação, nada de "a banca adora". Zero emoji.
- Notação: Unicode (², ³, ₂, →, ⇌, ≤, ≥, √, π, Δ, θ, °), vírgula decimal, unidades SI e de uso no Brasil.
- Química: equações balanceadas e corretas; Biologia: termos atuais (OpenStax 2e); Matemática: confira toda conta/fórmula com sympy; Português: norma-padrão, Acordo de 1990, exemplos de autores/obras conferidos.
- Além dos cartões, em D['areas'] (lista; crie se não existir, uma lista por matéria) defina 3–6 ÁREAS DE REVISÃO que juntam módulos como o aluno pensa, por exemplo Química: "Química orgânica" (funções, nomenclatura, isomeria, reações), "Físico-química", "Química geral e inorgânica"...:
  {"id": "qorg", "nome": "Química orgânica", "mods": ["Q11","Q12"], "resumo": "1 frase do que cai", "topicos": ["Funções orgânicas", "Nomenclatura", "Isomeria", "Reações orgânicas"]}
  Os módulos de todas as áreas juntos cobrem todos os módulos (um módulo pode estar em mais de uma área se fizer sentido).
- Não apague nada que exista (resumo, formulas, erro etc. ficam); só ACRESCENTE 'cartoes' e 'areas'.

## Gravação e conferência
import sys; sys.path.insert(0,'/home/claude/escadas-sc'); import dados_util as u; D = u.le(m); ...; u.grava(m, D)
Antes: cópia <m>/index.html.bak_cartoes e <m>/dados.json.bak_cartoes. Depois: JSON válido, banco com o mesmo nº de questões, só 'teoria' e 'areas' mudaram.
Confira cada afirmação com fonte confiável (WebSearch/WebFetch) quando houver qualquer dúvida; liste as fontes.
NÃO rode design/gera_design.py e não edite outros arquivos.
Ao terminar, peça a si mesmo uma segunda passada só caçando erro factual, exemplo errado e frase longa.
Registro: /home/claude/escadas-sc/CARTOES_<m>.md (cartões por módulo + fontes). Relatório final em até 8 linhas.
