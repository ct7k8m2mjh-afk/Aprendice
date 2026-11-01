# Exemplos dos flashcards — Matemática (mat)

Arquivo: `FLASH_EXEMPLO_mat.json`, com 58 ids (50 de `flash` e 8 de `flash_img`), todos com `exemplo`. A validação em Python passou: nenhum id faltando, nenhum id a mais, nenhum exemplo vazio, e o maior tem 173 caracteres.

## Critérios
- Cada exemplo usa um número concreto e mostra a conta curta, chegando ao resultado do verso (ou ilustrando a fórmula do verso).
- Quando servem, reaproveito os exemplos dos cartões de teoria (`D['teoria'][mod]['cartoes']`) para manter coerência: MMC dos remédios, MDC do piso, escada 3-4-5, teatro com 20 fileiras, meia-vida de 400 mg, pipa a 60°, lei dos cossenos 3-5-120°, área por coordenadas, cone 3-4-5, urna 3B/2P e outros.
- Em fórmulas que costumam gerar erro, o exemplo mostra também a conta errada e por que ela não bate com a certa: log(a + b), sen + cos, n·r × (n − 1)r, dividir pelo valor novo, raio × diâmetro, ordenar antes da mediana, 30% × 27,1%, e 7 × 3 + 4.
- Nas comparações (arranjo × combinação, xᵥ × yᵥ, p.p. × %, diagonal da face × diagonal do cubo, geratriz × altura, área lateral × área total), o exemplo mostra os dois lados.
- Refiz todas as contas uma a uma: substituí os valores, conferi as raízes, o determinante, o volume do tronco (84π), a área total do prisma (132) e 1 − 0,9³ = 0,271.

## Versos propostos para mudar
Nenhum. Os 58 versos já são atômicos e corretos. O problema era a falta de caso concreto, e isso o `exemplo` resolve. Por isso nenhum item tem `verso_novo`.
