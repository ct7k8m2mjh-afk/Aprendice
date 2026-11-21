# Nível das questões do ENEM pela dificuldade oficial do INEP

Pedido do dono (11/11/2026): "pegar as questões, colocá-las no site e ranqueá-las por dificuldade".

- Fonte: microdados do ENEM (INEP), tabela `ITENS_PROVA_<ano>.csv`, parâmetro **b** da TRI (dificuldade medida com os
  candidatos reais). Lida por `ferramentas/ingestao/nivel_tri.py`, que baixa só essa tabela de dentro do zip.
- Casamento: o caderno do INEP de cada prova do site é achado pela sequência de gabaritos (100% igual); as 1.071 questões
  do ENEM 2020–2025 casaram (2020: 178, 2021–2024: 179 cada, 2025: 177). Anuladas pelo INEP ficam com o nível de antes.
- Regra do nível: dentro de cada área (CN, CH, LC, MT), as questões são ordenadas pelo b e recebem os níveis na MESMA
  distribuição que a área já tinha (a quantidade de básicas, intermediárias e avançadas não muda; muda quem é mais difícil
  que quem). Resultado em 11/11/2026: 476 iguais, 324 subiram, 259 desceram.
- Cada questão guarda `tri` (b, a, c, item e caderno do INEP), `nivel_antes` (a estimativa anterior) e
  `nivel_fonte: "tri-inep"`. Ids não mudam; progresso do aluno não é afetado.
- Nova edição do ENEM: integrar a prova e rodar `python3 ferramentas/ingestao/nivel_tri.py` de novo.
