# Revisão independente: exemplos dos flashcards de Química (qui)

Revisei os 62 cartões (50 de `flash` e 12 de `flash_img`). Li frente, verso, erro_comum e exemplo de cada um juntos e refiz todas as contas: ΔH −891 kJ/mol; 22,4 L e 2 270 L; pH 3 e pOH 11; Ea 25 e ΔH +15; ΔE° 0,46 V; d(CO₂) 1,96 g/L; 1,2 × 10²⁴ e 1,8 × 10²⁴; 9 650 C, 0,05 mol, 3,2 g de Cu; 1/8; √(1,8 × 10⁻⁶) ≈ 1,3 × 10⁻³ e pH ≈ 2,9; balanço do Al(OH)₃ e do etanol; 2 ÷ 3 ≈ 0,67; 0,5 ÷ 0,25 = 2 mol/L; 0,5 mol/L de íons; 14,6 g de NaCl. Também conferi os valores tabelados e os casos reais: iodo-131 com 8 dias, CS do NaCl, ΔHf do O₃ e do diamante, H₂S a −60 °C, freon-12 e Montreal (1987), Th-234 → Pa-234 e fenolftaleína.

Resultado: nenhum erro de conceito e nenhuma conta errada. As comparações têm um exemplo de cada lado e todos os exemplos têm até 214 caracteres. Fiz 3 ajustes finos de precisão e reescrevi o verso_novo.

## Mudanças

| id | Antes | Depois | Motivo |
|---|---|---|---|
| qui-f069 | O ar (≈ 29 g/mol) dá ≈ 1,29 g/L | O ar (≈ 29 g/mol) dá ≈ 1,3 g/L | Arredondamento: 29 ÷ (0,082 × 273) = 1,2955, que arredonda para 1,30, não para 1,29. Com "≈ 1,3" a conta que o aluno refizer bate. |
| qui-f097 | Suco de limão, com [H⁺] = 10⁻² mol/L, tem pH 2. | Suco de limão, com [H⁺] perto de 10⁻² mol/L, tem pH perto de 2. | O pH do limão varia entre 2 e 2,6. Escrito como valor exato, o dado ficaria impreciso. |
| qui-f083 | o prego, de mesmo ferro, não. | o prego, do mesmo metal, não. | Correção de português. Além disso, a palha de aço é de aço, e não de ferro puro. |
| qui-f099 (verso_novo) | Ácido — o NH₄⁺ (ácido conjugado da base fraca NH₃) hidrolisa e libera H₃O⁺ | Ácido — sal de ácido forte (HCl) e base fraca (NH₃): o NH₄⁺ hidrolisa e libera H₃O⁺ | Detalhes abaixo. |

## Julgamento do verso_novo de qui-f099 (NH₄Cl)

- O verso atual, "Ácido — o NH₄⁺, de base fraca, sofre hidrólise", está correto, mas a frase é ambígua: dá para ler que o NH₄⁺ é uma base fraca. Ele também não diz por que a solução fica ácida. Vale a pena trocar.
- O verso proposto pelo primeiro agente está quimicamente certo, mas usa "ácido conjugado", um termo de Brønsted. Não é a regra que o aluno usa na prova, e o erro_comum do cartão ("achar que todo sal dá solução neutra") pede justamente essa regra.
- A versão que fiz segue a regra do caderno da teoria Q08.6 ("ácido forte + base fraca: ácido (NH₄Cl)") e mantém o mecanismo (NH₄⁺ → H₃O⁺). Continua atômica: "Ácido" vem no começo, que é a palavra de `essencial`. O exemplo (NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺; Cl⁻ de HCl não hidrolisa; NaCl neutro) bate com ela.

## Validação

Python: 62 ids, os mesmos de flash + flash_img, nenhum exemplo vazio e só um verso_novo (qui-f099). Nada foi gravado em dados.json nem em index.html.
