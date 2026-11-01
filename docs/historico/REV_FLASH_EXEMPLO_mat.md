# Revisão independente — exemplos dos flashcards (mat)

Revisor: segunda lente. Arquivo revisado: `/home/claude/escadas-sc/FLASH_EXEMPLO_mat.json` (58 ids: 50 flash + 8 flash_img).

## Método
- Li frente, verso, essencial, erro_comum e exemplo de cada um dos 58 cartões juntos.
- Refiz à mão todas as contas: sistemas, volumes, porcentagens, PA, médias, logs, trigonometria, lei dos cossenos, combinatória, probabilidade, determinante, notação científica, meia-vida, tronco de cone, área lateral do prisma.
- Conferi se cada exemplo ilustra o verso sem cair em exceção, se as comparações têm os dois lados, o português, os acentos e o tamanho (o maior tem 173 caracteres).

## Resultado das contas
Todas as 58 contas e todos os fatos estão corretos. Nenhum exemplo contradiz o verso. Comparações com os dois lados: f124 (arranjo × combinação), f046 (xᵥ × yᵥ), f021 (p.p. × relativo), f059, f099, f020, f076 e f137 (certo × erro comum).
Não há `verso_novo` no arquivo e não proponho nenhum: os versos de matemática estão atômicos e claros. O "(criado)" não se aplica, porque vale só para português.

## Mudanças (antes → depois, com o motivo)
1. **mat-f103**
   - Antes: "Uma caixa de 10 cm × 10 cm × 10 cm (1 dm³) cabe exatamente 1 L."
   - Depois: "Numa caixa de 10 cm × 10 cm × 10 cm (1 dm³) cabe exatamente 1 L."
   - Motivo: regência. É o litro que cabe na caixa, e não a caixa que cabe.
2. **mat-f107**
   - Antes: "Rótulo de uma lata de raio 4 cm e altura 10 cm, aberto, vira um retângulo 2π · 4 × 10: área lateral = 80π ≈ 251 cm²."
   - Depois: "O rótulo de uma lata de raio 4 cm e altura 10 cm, aberto, é um retângulo de 2π · 4 = 8π cm por 10 cm: área lateral = 8π · 10 = 80π ≈ 251 cm²."
   - Motivo: a notação "2π · 4 × 10" era ambígua. Agora as dimensões do retângulo aparecem separadas e a conta fica explícita.
3. **mat-f156**
   - Antes: "… “Nenhum é calmo” exige demais."
   - Depois: "… “Nenhum médico é calmo” afirma demais: diria que todos são nervosos."
   - Motivo: "exige demais" era vago. Agora o texto explica por que essa resposta não é a negação.

## Validação
Validei com Python: os 58 ids batem com D['flash'] + D['flash_img'], nenhum exemplo está vazio e nenhum `verso_novo` foi criado. Não mexi em dados.json nem em index.html.
