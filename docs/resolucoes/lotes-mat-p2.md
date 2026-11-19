# Matemática (parte 2): resoluções (gerado por lote.py em 2026-11-19)

Faltam 0 questões sem resolução (fora as que estão em lote, pendentes ou com divergência): ENEM nível 1-6 0; provas-alvo nível 1-6 0; demais nível 1-6 0; ENEM nível 7-10 0; provas-alvo nível 7-10 0; demais nível 7-10 0.

## Lotes

| Lote | Faixa | Questões | Estado | OK | Pendentes | Divergências |
|---|---|---|---|---|---|---|
| mat-p2-0001 | ENEM nível 7-10 | 50 | gravado | 49 | 1 | 0 |
| mat-p2-0002 | provas-alvo nível 7-10 | 50 | gravado | 48 | 2 | 0 |
| mat-p2-0003 | provas-alvo nível 7-10 | 50 | gravado | 50 | 0 | 0 |
| mat-p2-0004 | demais nível 7-10 | 50 | gravado | 49 | 1 | 0 |
| mat-p2-0005 | demais nível 7-10 | 50 | gravado | 50 | 0 | 0 |
| mat-p2-0006 | demais nível 7-10 | 50 | gravado | 50 | 0 | 0 |
| mat-p2-0007 | demais nível 7-10 | 37 | gravado | 37 | 0 | 0 |
| mat-p2-0008 | demais nível 7-10 | 1 | gravado | 1 | 0 | 0 |

## Pendentes (falta de certeza absoluta)

| Questão | Prova | Conteúdo | Motivo |
|---|---|---|---|
| Pfe0deff6 | Acafe 2022 Inverno · questão 22 | M05.4 função definida por partes e modular (tema M05 Funções afim e quadrática) | anular: na afirmação I a condição f(x + y) = f(x) − f(y) + 16x²y + 400x é impossível: com y = 0 fica 400x = f(0) = 0 para todo x, então nenhuma f existe. Substituir y = −x dá f(x) = 8x³ − 200x (raízes positivas somam 5, I verdadeira, gabarito C), mas y = x dá f(t) = 2t³ + 200t (sem raiz positiva, I falsa, resposta B). II (f(2) = 5/2, f(−2) = −11/2) e III (f(2) = 10/3, f(3) = 5/3, f(4) = 1) são verdadeiras; IV é falsa ((3 − 0 + 3)/(−4 + 0) = −1,5). A oficial só vale por verdade vazia, que não se pode ensinar como a banca pretendeu. |
| P2fb6c20f | PUC Minas 2023 Medicina 2023/1 · questão 43 | M06.5 meia-vida, decaimento e crescimento (tema M06 Exponencial e logaritmo) | anular: t = log 0,5/log 0,9 ≈ 6,58 → mais próximo de 6,5 (B); 7,5 (D) só sai de log 3 = 0,48 (log 0,9 = −0,04 em vez de −0,0458); 0,9^6,5 ≈ 0,504 e 0,9^7,5 ≈ 0,454 |
| P56f8d4e7 | Santa Casa 2024 Medicina · questão 76 | M10.3 lei dos cossenos (tema M10 Trigonometria) | anular: dados incompatíveis. Com AB = 1, BAE = 45°, BC = 2 ∥ AF, ângulo de 120° em C e CD = 3, D fica a (√2)/2 + 2 + 3/2 ≈ 4,207 cm de A na horizontal e (√2 + 3√3)/2 ≈ 3,305 cm de altura; com AE = 4, DE = √(0,207² + 3,305²) ≈ 3,31 cm e o perímetro daria ≈ 13,31 cm, não 15. O gabarito C usa DE = 15 − 10 = 5 e sen DEF = 3,305/5 ≈ 0,661, mas com DE = 5 e essa altura o afastamento horizontal seria ≈ 3,75 cm, incompatível com 0,207 cm. Na figura real, sen DEF ≈ 0,998 (nenhuma alternativa). Resolução do Objetivo segue o caminho da banca sem notar a incoerência (contas em python). |

## Divergências de gabarito (o dono decide)

Nenhuma.
