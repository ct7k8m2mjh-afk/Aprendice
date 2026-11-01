# Revisão independente dos cartões — Química e Matemática (29/10)

Escopo: 116 cartões de Química (Q01–Q12) e 102 de Matemática (M01–M17), campos oque, identificar, exemplo, caderno e cuidado, mais D['areas'].
Cópias antes da gravação: qui/ e mat/ → index.html.bak_rev_cartoes e dados.json.bak_rev_cartoes.

## Método
- Química, balanceamento: 25 equações dos cartões conferidas por script (contagem de átomos e de carga). Todas fecham, incluindo cromato/dicromato, 3 NO₂ + H₂O, o ciclo do Cl com O₃ e a esterificação.
- Química, nomes e fórmulas orgânicas: RDKit (fórmula molecular, massa e centros quirais) para 27 nomes. Conferidos isômeros C₂H₆O, C₄H₁₀O e C₄H₈; ácido lático com 1 C quiral; classes dos carbonos do metilpropano (3 primários e 1 terciário); ozonólise do 2-metilbut-2-eno, que dá propanona e etanal.
- Química, contas e regras: refeitas à mão. Inclui nox, Hess (−111 kJ), ΔHf (−891 kJ), energia de ligação (−185 kJ), Faraday (3,2 g de Cu), Clapeyron (22,4 L; 2,5 atm), Ka/pH (2,9), VPP, Kps = 4S³, ânodo e cátodo (pilha −/+ e eletrólise +/−), Le Chatelier e Kp = Kc(RT)^Δn.
- Matemática: todos os exemplos refeitos com sympy (equações, inequações, módulo, log, exponencial, PA/PG, áreas, trigonometria, sólidos, analítica, contagem, probabilidade, determinantes, polinômios e complexos), com as condições de existência (log, módulo, denominador). Única diferença numérica: arredondamento de float (580,0 = 580).
- Forma: todos os 'sub' existem em nomesub. Nenhum ponto decimal nem sin/tan. Nenhuma linha de caderno passa de 60 caracteres.

## Mudanças
1. qui · Q11 · cartão [3] "Ramificações e numeração" (Q11.2), campo oque
   - Antes: "A cadeia principal é a sequência mais longa de carbonos que contém as insaturações. Os grupos de fora são ramificações."
   - Depois: mesmo texto + "Essa é a regra tradicional dos vestibulares; a IUPAC 2013 prefere a cadeia mais longa, mesmo sem a insaturação."
   - Motivo: pedido explícito. A regra usada no cartão é a cobrada nos vestibulares, mas difere da recomendação atual da IUPAC.
   - Fonte: IUPAC Blue Book 2013, P-44.0 e P-44.4.1. Na escolha da cadeia acíclica, o comprimento passou a ser o 1º critério e a insaturação o 2º, o inverso de 1979/1993. https://iupac.qmul.ac.uk/BlueBook/P4.html
2. mat · M12 · cartão [4] "Reta e circunferência" (M12.4), campo cuidado
   - Antes: "Entre duas circunferências, compare a distância dos centros com a soma dos raios."
   - Depois: "Entre duas circunferências, compare a distância dos centros com a soma e com a diferença dos raios."
   - Motivo: só com a soma, o aluno não identifica tangência interna nem circunferência interna (d = |R − r| e d < |R − r|).
   - Fonte: posições relativas de duas circunferências (geometria analítica, ensino médio). Critério conferido com sympy.

Nenhum outro erro factual, de conta, de sinal ou de nomenclatura foi encontrado.

## Conferência final
- JSON válido. dados.json idêntico ao bloco embutido no index.html.
- Banco idêntico ao das cópias: qui 571 e mat 611 questões.
- Só a chave 'teoria' mudou. O HTML fora do bloco de dados ficou igual.
