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

## 2026-11-19 15:19 UTC — PENDENCIAS — session_01PveEKZJQECSzmdn2ajLNFJ
Lote gravado: fis-0063 (60 ok). Aberto: fis-0064.
DADO P842d25ff: alternativas -> ausentes na entrada; no print A 5,0×10² m/s · B 2,5×10² m/s · C 1,0×10³ m/s · D 2,0×10³ m/s · E 3,4×10² m/s
RECLASS P8eb18eff F10.6 -> F10.5
RECLASS P842d25ff F10.6 -> F10.3
DADO P4f8e6c16: alternativas.E -> "√3 k Q²/L²" (o quadro "Dado: sen 30° = 1/2 ; cos 30° = √3/2" está colado na E)
DADO P5d606dcb: alternativas -> frações perdidas; no print A "2Q e Q/2", B "Q/2 e Q/8", C "2Q e Q/4", D "2Q/3 e 2Q/3", E "Q e Q/4"
DADO P091b20d8: texto_da_prova e alternativas -> "106" é 10^6 (expoentes sem sobrescrito)
DADO P427c5966: texto_da_prova -> camada de texto embaralhada; refazer a transcrição pelo print
DADO P3cf2bd47: alternativas -> vieram sem as relações; no print A: f_E = f_R, f_E < f_R e f_E > f_R; B: f_E < f_R, f_E = f_R e f_E > f_R; C: f_E = f_R, f_E > f_R e f_E > f_R; D: f_E = f_R, f_E > f_R e f_E < f_R
DADO Pcb16f982: alternativas -> vazias e falta T₁ = 2π√(m/k) no texto; no print A f₂ = 4f₁, B f₂ = √2·f₁, C f₂ = (√2/2)·f₁, D f₂ = (1/2)·f₁, E f₂ = 2f₁
DADO Pbd5ed9e7: texto_da_prova -> embaralhado (duas colunas) e sem alternativas; no print A 1 s, B 1/2 s, C 1/4 s, D 2 s, E 1/8 s
DADO P1788894b: texto_da_prova -> equação embaralhada; no print x(t) = 0,5·cos((π/2)·t)
RECLASS Pc22ed1df F11.1 -> F11.2
RECLASS P813c712a F10.8 -> F12.4
RECLASS P15aa7c8d F11.2 -> F11.3
DADO Pbd47938d: alternativas -> o "p" é o radical; A = f v/(v − √(2gL[1 − sen(θmax)])), B = f v/(v − √(2gL[1 − cos(θmax)])), C = (f/v){v − √(2gL[1 − sen(θmax)])}, D = (f/v){v − √(2gL[1 − cos(θmax)])}, E = f v/(v − √(2gL cos(θmax)))
DADO Pa69a4a3c: texto_da_prova -> frações quebradas; no print (I) λ = 2ℓ/3, (II) λ = 4ℓ/5, (III) λ = ℓ, (IV) λ = 4ℓ/3, (V) λ = 4ℓ
