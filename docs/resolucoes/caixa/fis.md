## 2026-11-13 UTC — FIM — session_01PveEKX5T4pY3Xx4fn4PR8G
Último lote gravado: fis-0059. Nenhum lote de Física aberto. Nesta sessão: fis-0057 (58 ok, 2 pendentes), fis-0058 (60 ok), fis-0059 (60 ok) = 178 resoluções. Física: faltam 944 (f2 428 · f3 31 · f4 186 · f5 299).
Pendentes:
- P8de70adc (fis-0057): print cortado — o fim de cada linha do enunciado (valor em °F) não aparece no print nem no texto; refazer o print a partir do PDF oficial.
- P9615ec2a (fis-0057, UERR, questão 44): o gabarito oficial C só sai usando 2α nos raios; a conta correta dá Δθ ≈ 252 °C (alternativa E). Gabarito definitivo da UERR confirma C, sem anulação. Conferir no caderno se a questão 44 do gabarito é mesmo esta; se for, resolver com C e o alerta.
Avisos:
- Entrada com erro de texto: P42642b2d (fis-0058) — texto_da_prova diz 0,2 kg de óleo, o print diz 2,0 kg (resolvida pelo print). Vale corrigir a transcrição.
- A entrada do lote traz `gabarito_preliminar` nas questões sem gabarito publicado; o conferente que resolve "às cegas" vê a letra preliminar (aconteceu no fis-0059). Talvez tirar o campo da entrada que vai para a parte 0.
## 2026-11-13 UTC — AVISO — session_01PveEKX5T4pY3Xx4fn4PR8G
Testes depois do fis-0059 (converte + tsc + vitest): tsc ok; vitest 773 passaram e 13 falharam. Nenhuma falha é de Física: treinoGeral (fs, geo, his, ing), anuladasAprendice, conteudo (matérias novas), migracao (G13), outraMateria (S01.5), regiao (SP e Sul). Parecem vir do banco ou do converte, não das resoluções. Fica para a sessão principal.

## 2026-11-19 15:14 UTC — PENDENCIAS — session_01PveEKZJQECSzmdn2ajLNFJ
Lote gravado: fis-0062 (59 ok, 1 pendente). Abertos: fis-0063 (na conferência).
DADO Pe5c0e8b2: alternativas e enunciado -> expoentes perderam o sobrescrito ("1016" = 10^16; "3,0 108" = 3,0 × 10^8 m/s; "1 000 10–9 m" = 1 000 × 10^-9 m); vale o print
DADO Pa42cdbcc: alternativas -> expoentes sem sobrescrito ("106" = 10^6, "10-13" = 10^-13, "10-3" = 10^-3)
DADO Pea67f5a2: alternativas.D -> tirar o " 26" do final (número da página colado)
RECLASS Pe5c0e8b2 F10.2 -> F10.1
RECLASS P1487a3f3 F10.2 -> F10.1
RECLASS Pe807b682 F10.2 -> F10.1
RECLASS Pea67f5a2 F10.2 -> F12.2
RECLASS Pa42cdbcc F10.2 -> F01.5
ANULAR Pf61a81be (Unicentro 2022 q48): gabarito oficial D exige a afirmativa I correta, mas ela diz que a velocidade das ondas aumenta perto da praia (na água rasa diminui); sem I sobra II e III, que não é alternativa. Sem errata/anulação na web.
DADO P3a7f34f2: alternativas -> expoentes sem sobrescrito (A 2,5 × 10^-7; B 3,0 × 10^14; C 5,0 × 10^-7; D 6,0 × 10^14)
DADO P1b52de8a: alternativas -> C "4 920 Å a 7 800 Å", D "3 900 Å a 5 970 Å", E "384 THz a 3 900 Å" (falta o Å e o texto da tabela/enunciado está colado na E)
RECLASS P1067cbfa F10.2 -> F01.6
RECLASS Pf7cc2e6b F10.2 -> F01.6
DADO Pc0e0d5a1: texto_da_prova -> tirar a linha final "E ( ) mg + √8kmV2." (não está no print; veio de outra questão)
DADO P08dd210d: alternativas -> expoentes sem sobrescrito (3 · 10^8, 10^11, 10^19, 10^21 Hz)
DADO P67004c26: texto_da_prova e alternativas -> acentos quebrados na camada de texto ("Quest˜ao", "radia¸c˜ao"); print e PDF corretos
RECLASS P1c86b29f F10.2 -> F02.1
