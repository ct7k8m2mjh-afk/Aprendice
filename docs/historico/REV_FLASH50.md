# Revisão independente — cartões novos/reescritos do corte para 50 (29/10)

Lista confirmada nos ANALISE_FLASH50_<m>.md. Cópias: <m>/index.html.bak_rev50 e <m>/dados.json.bak_rev50.
Depois da gravação: JSON válido, index.html = dados.json, D['flash'] com 50 ids únicos em cada matéria, todas as outras chaves idênticas.

## Corrigidos (7)
- **qui-f161**: erro_comum estava errado. Quebrar entre O e R' (com H no O e OH em R') dá os MESMOS ácido e álcool, então não "troca" nada. Novo: trocar os lados (C=O / "-oato" = ácido; lado do O / "-ila" = álcool). Verso conferido com RDKit (acetato de etila → CC(=O)O + CCO).
- **qui-f160**: "cada ponta livre é um carbono" passou a ser "ponta sem símbolo escrito" (ponta com OH/NH2 não é C), no verso e no essencial. Regra H = 4 − ligações conferida com RDKit (GetTotalNumHs) numa molécula com dupla e tripla.
- **qui-f094**: pH = 14 − pOH ganhou "(a 25 °C)".
- **mat-f162**: aceita tinha "se transbordar, sai o volume do objeto" (falso se o recipiente não estiver cheio) e "Arquimedes" (vago: é o princípio do empuxo); saíram. O erro_comum da faixa 5² − 3² contradizia a frente (objeto mergulhado por inteiro: a superfície ocupa a base toda); agora fala de outro corpo fixo que atravessa a superfície. Verso: "A = área livre da superfície (a base), se não transbordar".
- **por-f163**: "homônimos têm a mesma pronúncia" exclui os homógrafos heterofônicos (colher v. × colher s.). Verso agora: som igual, grafia igual ou ambos, com os três tipos de exemplo. Fonte: todamateria.com.br/homonimos-e-paronimos.
- **por-f162**: a frente pede um exemplo de cada; o essencial ganhou "um exemplo correto de cada".
- **bio-f109**: erro_comum dizia que é erro atribuir a bactérias; há florações de cianobactérias também chamadas de maré vermelha. Ficou só a confusão da relação ecológica.

## Conferidos sem mudança
- bio-f076 (amilase salivar boca pH ≈ 7; pepsina estômago pH ≈ 2; lipase pancreática duodeno pH ≈ 8; OpenStax A&P 23.7), bio-f073 (quantitativa, cor da pele, 2n + 1; 3 pares → 7), bio-f149 (esporos por meiose no esporófito/cápsula; gametas por mitose), bio-f135 (sympy: √0,0001 = 0,01; 2·0,99·0,01 = 0,0198), bio-f157 (OpenStax Bio 2e cap. 25–26), bio-f158 (Pantanal; Pampa e arenização, UFRGS).
- qui-f159 (C = n CO₂; H = 2 n H₂O).
- mat-f161 (sympy: x = 5, y = 1, x + y = 6), mat-f163 (sympy: sen/cos/tg de 30°, 45°, 60°), mat-f107 (retângulo 2πr × h, 2πrh).
- por-f160 (pessoa, este → aquele, aqui → lá, hoje → naquele dia, amanhã → no dia seguinte, ontem → na véspera; dicio.com.br/discurso-direto-indireto-e-indireto-livre), por-f161 (dêitico × anafórico), por-f164 (artigo/preposição/pronome; "começou a chover" = preposição).
