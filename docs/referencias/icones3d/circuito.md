# Circuito elétrico (Física) — rodadas de comparação com a referência

Referência: `circuito.png`. Cena: `app/src/ui/icones3d/cenas/circuito.js`.
Comparação: `node _compara.cjs circuito .../circuito.png` (repouso) e `ATIVO=1 ...` (aceso). A referência mostra a lâmpada acesa,
então a nota de semelhança é dada sobre o estado ativo (final); o repouso difere só na lâmpada apagada (decisão científica, abaixo).

| Rodada | Mudança | forma | materiais | cor | detalhes | luz/sombra | enquadr. | % |
|---|---|---|---|---|---|---|---|---|
| 0 | estado inicial: câmera perto (cena cortada), pilha baixa, soquete preto alto, vidro opaco laranja sem filamento visível | 6 | 7 | 7 | 5 | 6.5 | 4 | 58 |
| 1 | refeito: pilha AA em torno com cantos arredondados (preto + faixa dourada, "+" preto e "−" branco em relevo curvo, tampa prateada); lâmpada em pera (torno), base rosqueada, soquete; fio no traçado da referência; câmera frontal baixa, fov 25 | 8.5 | 7.5 | 8 | 7.5 | 7.5 | 8.5 | 80 |
| 2 | dourado mais amarelo, soquete cinza-metal, soquete mais baixo, globo maior, filamento e suportes mais altos, câmera um pouco mais longe | 9 | 8 | 8.5 | 8 | 8 | 8.5 | 84 |
| 3 | vidro em duas camadas (parede de trás âmbar opaca + frente translúcida): filamento, suportes e haste aparecem através do vidro âmbar; filamento sem tone mapping (branco incandescente) | 9 | 8.5 | 9 | 8.5 | 8.5 | 9 | 88 |
| 4 | roscas mais curtas (2) e mais escuras, enquadramento vertical ajustado, preto da pilha grafite brilhante, tampa mais alta, sem faixa de sombra do fio alto no chão | 9 | 8.5 | 9 | 9 | 8.5 | 9.5 | 90 |

Diferenças que ficam: a tampa da pilha reflete uma faixa escura do ambiente; o vidro da referência tem a borda mais alaranjada (efeito Fresnel não reproduzido para manter o material leve).

## Animação (pesquisa `docs/pesquisa/animacao-dos-icones.md`, 5.1)
- **Repouso: lâmpada apagada, sem pulsos** (sem corrente não há luz). Com "reduzir movimento": lâmpada acesa, parada (estado final).
- **Ativação (uma vez):** no mesmo instante os pulsos aparecem no circuito inteiro (14, igualmente espaçados, mesma velocidade antes e depois da lâmpada) e a lâmpada acende em 150 ms, sem tremer. Sentido convencional: + → fio → lâmpada → fio → − (e por dentro da pilha, oculto). Os pulsos dão 1 volta em 1,6 s e somem; a lâmpada fica acesa e parada enquanto o ícone estiver ativo. Ao sair: apaga em ~250 ms.
- Conferido quadro a quadro com relógio congelado (t = 0; 0,05; 0,1; 0,2; 0,5; 0,9; 1,3; 1,6; 2,5 s; saída).
