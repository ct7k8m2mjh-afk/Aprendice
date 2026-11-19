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

## 2026-11-19 15:27 UTC — PENDENCIAS — session_01PveEKZJQECSzmdn2ajLNFJ
Lote gravado: fis-0064 (60 ok).
DADO P23c75f16: texto_da_prova -> "resistência de 500 W" é "resistência de 500 Ω"
DADO P8e8b51ef: alternativas.D -> "1,4 · 10³ V" (o "30" é o número da página)
RECLASS Pb7570230 F11.4 -> F12.2
RECLASS P8e8b51ef F11.4 -> F11.8
RECLASS P23c75f16 F11.4 -> F11.6
RECLASS P373ecb08 F11.4 -> F11.3
RECLASS Pbcc564f3 F11.4 -> F01.5
DADO P51a67e9c: alternativas -> A 2 × 10¹⁵, B 2 × 10¹³, C 6 × 10¹⁵, D 6 × 10¹³ (expoentes achatados e o quadro "Dado: K = 9 × 10⁹ N·m²/C²" colado na D)
DADO Pc5b6fede: alternativas -> A mv²/(2Ed), B Ed/(mv²), C d/E, D mv/(Ed) (termos fora de ordem)
DADO P203d9b91: alternativas -> A k·q0/F, B √(k/F)·q0/2, C 4·k·F·q0, D √(k/F)·q0/4 (termos fora de ordem)
DADO P1960883e: alternativas -> são figuras (A B para cima, B entrando ⊗, C para a direita, D saindo ⊙); "Aterramento" na A é legenda da figura 2
RECLASS P1960883e F11.2 -> F12.2
DADO P58dd9bd5: texto_da_prova -> expoentes sem sobrescrito também no print ("6,0 . 108" = 6,0 · 10⁸; "1,0 . 103" = 1,0 · 10³)

## 2026-11-19 15:27 UTC — FIM — session_01PveEKZJQECSzmdn2ajLNFJ
Último lote gravado: fis-0064. Nenhum lote de Física aberto. Nesta sessão: fis-0062 (retomado; 59 ok, 1 pendente), fis-0063 (60 ok), fis-0064 (60 ok) = 179 resoluções. Física: faltam 644 (f2 128 · f3 31 · f4 186 · f5 299).
Pendente: ANULAR Pf61a81be (já listado acima).
Gabarito do Aprendice (sem gabarito publicado, resolvedor e conferente às cegas bateram, e o preliminar também quando existe): fis-0062 P862afdf8 A, P9ead8d05 B, Pfbfd31a7 B; fis-0063 Pdae9f5c6 D, Pe11ba1f8 E, P3aff7b0d E, P1653076e A, Pa9b2af01 B; fis-0064 P1960883e D, P855d55ed C, Pbcc564f3 A, P922cc49f B.
Testes depois do fis-0063 (converte + tsc + vitest): tsc ok; vitest 786 de 786 passaram.
Observação: o PROMPT mudou hoje para lotes de 50 e 200 questões por sessão; esta sessão fez 3 lotes de 60 (já abertos/no formato antigo), 179 resoluções.

## 2026-11-19 16:02 UTC — PENDENCIAS — session_01PveEKaozjku3Rmd3ikcUSN
Lote gravado: fis-0065 (48 ok, 1 pendente, 1 divergência). Aberto: fis-0066.
RECLASS P7a81b2b1 F11.6 -> F12.5
RECLASS Pd484994e F11.6 -> F11.4
RECLASS P91d2fea4 F11.6 -> F08.4
RECLASS Pb6f57afa F11.6 -> F11.4
RECLASS Pfe4b4ed3 F11.6 -> F11.8
PRINT Pfa76f2c3 (PUC-Rio 2027 G4 q30): esquema do Experimento 2 partido em dois no recorte (bateria no alto, os dois R embaixo à esquerda); refazer o recorte do PDF oficial
DADO P4c72d325: alternativas.D -> "500 mA" (o "28" é o número da página no print)
DADO Pd7fe06ab: texto_da_prova -> o print traz o texto de apoio do UOL ("O chuveiro é um dispositivo...") antes do enunciado; alternativas.D -> "menor - menor." (o texto de apoio foi colado nela)
DADO P5987347a: alternativas.C -> I110 = 1/2 I220
DADO P2a334585: alternativas -> A "P1 = 3 P2"; B "P1 = 3/2 P2"; C "P1 = P2"; D "P1 = 1/3 P2"; E "P1 = 2/3 P2"
GABARITO P008531fb (IME 2024-2025 q19): o gabarito final oficial publicado dá B, não anulada (https://militares.estrategia.com/portal/wp-content/uploads/2024/10/Gabarito_Final.pdf); pôr como gabarito oficial
GABARITO P58d32c58 (UFRR 2025 Prova Integral q36): preliminar B, mas a conta dá D (7/0,02 = 350 Ω = 300 + 50 Ω); conferir no Edital 97/24-CPV (https://editais.ufrr.br/editais/arquivo/568/edital-n-97-24-gabarito-oficial-vestibular-2025.pdf, deu 503 daqui) se mudou para D ou foi anulada
ANULAR P8cad75ee (UEMG 2024 q18): na III, i = 127/480 = 0,2646 A = 264,6 mA, não 264,5 µA, então a III é falsa; sobram só I e V verdadeiras e nenhuma alternativa traz essa dupla (definitivo B, preliminar C)
DIVERGENCIA P58d32c58 (UFRR 2025 q36): sem gabarito definitivo; resolvedor e conferente às cegas dão D, o preliminar dá B; ver o Edital 97/24-CPV (link acima).

## 2026-11-19 16:11 UTC — PENDENCIAS — session_01PveEKaozjku3Rmd3ikcUSN
Lote gravado: fis-0066 (50 ok). Abertos: fis-0067, fis-0068.
RECLASS P69314019 F11.9 -> F11.3
RECLASS Pc324d43f F12.1 -> F12.4
DADO P6f4628f4: alternativas -> o campo veio vazio; as cinco alternativas estão coladas, sem letras, no fim do texto_da_prova (print: A translação; B raios cósmicos na atmosfera; C cargas na superfície; D ímã permanente no centro; E cargas em movimento no interior)
DADO Pa083d775: alternativas.E -> "Em nenhuma das quatro regiões." (o "N 3 2 1 4" colado no fim é da figura)
DADO P23e9cfdf: texto_da_prova/alternativas -> acentos embaralhados ("´ım˜as"); no print: "A respeito do estudo dos ímãs qual das afirmações não está correto no contexto da física:"
RECLASS P5f8b21a4 F12.1 -> F12.3
RECLASS Pb018358c F12.1 -> F12.4
RECLASS P5bd49f7b F12.1 -> F12.4
RECLASS Pbf755804 F12.2 -> F02.2
DADO P4b0f38e3: alternativas -> o campo está ausente na entrada; A–E estão no print e no fim do texto_da_prova
DADO Pb7f528cf: texto_da_prova -> no print a unidade é "Ω" (o texto traz "W" em "90 W" e "em W")
RECLASS P5f7ff111 F11.6 -> F11.4
RECLASS Pc717aba3 F11.6 -> F11.8
RECLASS P68b55b6f F11.7 -> F11.4

## 2026-11-19 16:17 UTC — PENDENCIAS — session_01PveEKaozjku3Rmd3ikcUSN
Lote gravado: fis-0067 (50 ok). Aberto: fis-0068.
DADO Pecec6fdc: texto_da_prova (permeabilidade) -> "Dado: permeabilidade magnética é 4π·10⁻⁷ T.m/A."
DADO Pce9b27ed: alternativas -> A) ε = |Δϕ|/Δt; B) t = |Δε|/Δϕ; C) Δϕ = |Δt|/Δε; D) ε = |Δt|/Δϕ; E) ϕ = |Δε|/Δt (A–D vazias; texto de apoio colado na E)
DADO Pecbdc26a: texto_da_prova -> alternativas misturadas no enunciado; no print A) 5,0 V; B) 15 V; C) 30 V; D) 60 V; E) 130 V
DADO P3ba3b243: alternativas.D -> "Uma corrente elétrica contínua atravessa do carregador para a bateria." (o "25" é o número da página)
DADO P7ffda600: alternativas -> no print as frações vêm empilhadas: A "mₑ·v·B = e·v²/r", B "e·v/B = mₑ·r/v²", C "e·r·B = mₑ·v²/r", D "e·v·B = mₑ·v²/r", E "e·v·B = mₑ·v²·r"
RECLASS Pc4869b3f F11.5 -> F11.8
RECLASS P6561f79a F12.4 -> F12.3
RECLASS Pdfdaa205 F12.4 -> F12.5
