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

## 2026-11-19 16:23 UTC — PENDENCIAS — session_01PveEKaozjku3Rmd3ikcUSN
Lote gravado: fis-0068 (50 ok).
RECLASS Pb3321d1f F01.4 -> F01.5
DADO Pb3321d1f: alternativas.E -> "Somente as afirmativas II, III e IV são corretas." (o "27" do fim é o número da página)
DADO Pb3321d1f: texto_da_prova (afirmativa II) -> Eₙ = −(1/n²) · 2,18 × 10⁻¹⁸ J
DADO P7499a2d8: alternativas.D -> o texto termina em "...no seu deslocamento." (o resto são legendas da figura coladas)
DADO Pf7a6973c: alternativas.A -> v = k√(g/λ); alternativas.D -> v = k·g/λ
DADO P7c6fa3d8: texto_da_prova -> "Dado: c = 3·10⁸ m/s" (não é "3.108")
RECLASS P4c8c8536 F03.3 -> F04.3
DADO P331f4636: texto_da_prova -> embaralhado e alternativas vazias; no print: A tan θe · B cot θe · C sec θe · D csc θe · E cos θe
DADO P0e95211a: alternativas -> símbolos corrompidos; no print: A μe = tg θ · B μe = cos θ · C μe = sen θ · D μe = sec θ · E μe = cotg θ
DADO P4c8c8536: texto_da_prova -> falta o θ em "ângulo de inclinação ,"; no print: "ângulo de inclinação θ"
DADO P9ead74d0: alternativas -> expoentes achatados; no print A 5 × 10¹ km, B 5 × 10⁴ km, C 5 × 10⁷ km, D 5 × 10¹⁰ km, E 5 × 10¹³ km
RECLASS P90afe8de F12.2 -> F11.2
DADO P12a01571: alternativas.E -> "1 estrela." (lixo colado; o print traz também o quadro de estrelas por velocidade de impacto)
DADO Pe0c53f61: alternativas -> A "tan θ₀ = 5 e V₀ = √2600 m/s"; B "cotan θ₀ = 5 e V₀ = 2600 m/s"; C "tan θ₀ = 10 e V₀ = √60 m/s"; D "cotan θ₀ = 10 e V₀ = 60 m/s"; E "tan θ₀ = 5 e V₀ = √60 m/s"
DADO P67c96a5b: texto_da_prova -> embaralhado e sem o campo alternativas; no print A) 18 B) 13 C) 9 D) 6 E) 4
DADO Pbdbe0e92: alternativas.E -> "120000 m/s²." (o "Note e adote" é um quadro separado no print)
RECLASS Pa1b7e926 F02.1 -> F07.5

## 2026-11-19 16:23 UTC — FIM — session_01PveEKaozjku3Rmd3ikcUSN
Último lote gravado: fis-0068. Nenhum lote de Física aberto. Nesta sessão: fis-0065 (48 ok, 1 pendente, 1 divergência), fis-0066 (50 ok), fis-0067 (50 ok), fis-0068 (50 ok) = 198 resoluções. Física: faltam 444 (145 + 299 nas duas últimas faixas do status).
Pendente: ANULAR P8cad75ee (UEMG 2024 q18). Divergência: P58d32c58 (UFRR 2025 q36, D × preliminar B; ver Edital 97/24-CPV). GABARITO P008531fb (IME, oficial B publicado).
Gabarito do Aprendice (resolvedor e conferente às cegas bateram; preliminar também quando existe): fis-0065 Pf2d7c301 B, Pb24b4c99 B, P008531fb B, P8e870c83 D; fis-0066 P342ad709 A, P23e9cfdf D, Pe0f4cec2 C; fis-0067 P6220eb09 C, P73cbd02f A.
Testes depois do fis-0067 (converte + tsc + vitest): tsc ok; vitest 786 de 786. Conferência no site (Pa8c2a5ea, P717964b4, P57beb5b1, 390 e 1280 px): 4 blocos completos, fração empilhada, lousa até o fim, sem erro de console.
Observação para as próximas sessões: os conferentes recusam rótulos de teste em equivocos (nao-confere-..., valor-sem-origem-...); usar a origem real ou o equívoco de conceito.

## 2026-11-19 16:43 UTC — PENDENCIAS — session_01PveEKYFao9mdqzruhVmuPm
Lote gravado: fis-0069 (49 ok, 1 pendente). Aberto: fis-0070.
DADO P4762e0ac: texto_da_prova -> a camada de texto está embaralhada; enunciado lido no print (chave de roda em L de 25 cm, força de 400 N, torque mínimo de 500 N·m, tabela das alavancas I a V: 0,25; 0,50; 0,75; 1,00; 1,25 m)
DADO P4762e0ac: alternativas.E -> "V."
ANULAR Pa4042d98 (Unesp 2026/2 1ª fase, q76): oficial C exige blocos com a mesma aceleração da placa; o vínculo do fio inclinado dá a_bloco = a·senθ e a = 50/17 ≈ 2,94 m/s², fora das alternativas
DADO Pf9094e2a: alternativas.E -> "20 segundos." (o enunciado do prédio, do elevador e do motor de 10 000 W está colado na alternativa; no print ele vem antes do comando)
DADO P78558614: alternativas -> A) 14,08 m/s. B) 13,00 m/s. C) 12,49 m/s. D) 12,00 m/s. E) 11,00 m/s. (estão dentro do texto_da_prova, com lixo de OCR no fim)
DADO P7f7346b1: alternativas.E -> "100 cm" (o "Note e adote" está colado na alternativa)
DADO P7f372339: alternativas.A -> "as pedras 1 e 2 deslocaram-se para a frente, com velocidades v/2 e v, respectivamente."
DADO P7f372339: alternativas.D -> "as pedras 1 e 2 deslocaram-se para a frente e juntas, com velocidade igual a v/2."
DADO P7f372339: alternativas.E -> "a pedra 1 ficou parada e a pedra 2 deslocou-se para a frente com velocidade igual a v/2."
DADO P11eeab1b: texto_da_prova -> "Considere uma banana de dinamite equivalente a 3,5 x 10⁶ J." (o expoente 6 sumiu)
RECLASS P06e6cb46 F04.4 -> F11.9
RECLASS P37bac67e F06.1 -> F06.2
DADO P37bac67e: texto_da_prova -> potências com expoente: Massa do Sol 2 × 10^30 kg; Massa de Júpiter 2 × 10^27 kg; 1 UA 1,5 × 10^11 m; G = 6 × 10^-11 N·m²/kg²
DADO P9719f376: alternativas -> (A) F_W/F_T = m_W R_T/(m_T R_W); (B) (m_T + m_S) R_W/(m_T R_T); (C) m_W R_W/(m_T R_T); (D) m_W (R_W − R_T)/(m_T R_T); (E) m_T (R_W − R_T)/(m_W R_T); o 'Note e adote' está colado na E e é do enunciado
DADO Pa02b1056: alternativas -> (A) 2F; (B) F/9; (C) 2F/3; (D) 8F; (E) 8F/9
DADO P16f8559e: alternativas -> A. 9,5 m/s²; B. 8,0 m/s²; C. 8,9 m/s²; D. 11 m/s²; E. 7,3 m/s² (a entrada não traz alternativas separadas; texto do OCR embaralhado)
DADO P1eb72652: alternativas -> A. 6,67×10^-11 N para o lado da esfera A; B. 1,67×10^-10 N para o lado da esfera B; C. 3,34×10^-10 N para o lado da esfera B; D. 1,67×10^-10 N para o lado da esfera A; E. 3,34×10^-10 N para o lado da esfera A
DADO P0a31f241: texto_da_prova -> 'Na missão Artemis II' e 'massa da Terra: M_T = 81M_L, onde M_L é a massa da Lua.'
DADO P6ffc283e: alternativas -> (A) 3,6 × 10^6 km e 17 dias; (B) 1,8 × 10^6 km e 8,5 dias; (C) 9,0 × 10^5 km e 17 dias; (D) 9,0 × 10^5 km e 8,5 dias; (E) 1,8 × 10^6 km e 17 dias
DADO Pf7efcfb5: texto_da_prova -> o print traz 'potência de aproximadamente 4 × 10²⁶ W' e 'cerca de 5 × 10⁹ anos atrás'; a camada de texto mistura trechos de outra questão ('entre outros aspectos, (A) fornece evidências...').
DADO Pf7efcfb5: alternativas -> (A) 10⁷ kg. (B) 10¹⁷ kg. (C) 10²⁷ kg. (D) 10³⁷ kg. (E) 10⁴⁷ kg.
DADO Pe59e67a2: alternativas -> A. a = 0,5 m/s² e Fv = P; B. a = 0,5 m/s² e Fv = P/2; C. a = 5,0 m/s² e Fv = P/2; D. a = 10 m/s² e Fv = P/2; E. a = 10 m/s² e Fv = P (o OCR trocou Fv por 'F', 'M', 'H', 'A').
DADO Pfac558a1: texto_da_prova -> faltam os valores do print: densidade da água 10³ kg/m³, aceleração da gravidade 10 m/s² e a razão V2/V1.
RECLASS Pe59e67a2 F07.1 -> F07.4
RECLASS P5fa24d46 F07.2 -> F07.1
RECLASS Pf12c914f F07.4 -> F07.2
DADO Pafefa5c8: alternativas -> no print, cada termo tem a letra P com índice: (A) P1 < P2 < P3; (B) P1 = P3 < P2; (C) P2 < P1 < P3; (D) P3 < P2 < P1; (E) P1 < P2 = P3
DADO Pafefa5c8: texto_da_prova -> no print, 'O período P' e 'períodos de oscilação P1, P2 e P3' (o símbolo P saiu embaralhado na camada de texto)
DADO P5697d0ea: alternativas.E -> 7 min e 21 s. (sem o ' p p' do fim)
DADO P24553b9c: alternativas -> B 2,0 m/s; D 2,8 m/s; E 3,2 m/s
ANULAR Pa4042d98: com o fio inclinado o bloco acelera 0,6a; T = 10 + 0,6a e 20 − 1,2T = 2a dão a = 50/17 ≈ 2,94 m/s², fora das alternativas (oficial C = 2,5 m/s² supõe blocos com a aceleração da placa)

## 2026-11-19 16:49 UTC — PENDENCIAS — session_01PveEKYFao9mdqzruhVmuPm
Lote gravado: fis-0070 (50 ok). Aberto: fis-0071.
DADO P8d499ecf: alternativas.E -> "84°C" (o "Note e adote" é um quadro separado no print, não faz parte da alternativa E)
DADO P5990633d: alternativas.E -> "É igual ou maior que 10 °C. Todo o gelo derreteu, e restou apenas água líquida na caixa." (o "Note e adote" e os dados são um quadro separado no print)
RECLASS P39dd3ef1 F08.4 -> F08.3 (só a água recebe um calor dado; é calor sensível, sem troca entre corpos)
DADO Pbcbb3398: alternativas.E -> "Material E." (lixo "#####" colado no fim)
DADO P8e7cdb06: alternativas -> fórmulas estruturais em imagem: A) propan-2-ol (isopropanol), B) propanal, C) propanona, D) ácido propanoico, E) propanotriol (glicerol)
DADO P272dcf3b: texto_da_prova -> "Sabe-se que o objeto se encontra a 20 cm da lente L1, a qual está a 40 cm da lente L2." e "se comporta como objeto P' para a lente L2. Assim, a imagem de P' conjugada pela lente L2 está localizada" (índices 1 e 2 lidos como vírgula/"a" pelo OCR)
DADO P272dcf3b: alternativas.C -> "entre o objeto P e a lente L1."; alternativas.D -> "entre as lentes L1 e L2."; alternativas.E -> "à direita da lente L2."
DADO Pd417f4f2: alternativas.E -> "18,1 cm" (o Note e adote está colado na alternativa)
DADO P2a28cd0d: texto_da_prova -> camada de texto ilegível (fonte embaralhada); no print, Texto I: tabela Dinamarca 480 m, Espanha (Valência) 1.000 m, Irlanda do Norte 500 m, Itália (Basilicata) 2.000 m, Romênia 360 m; Texto II: distância percorrida por um ruído de infrassom em 3 segundos, com frequência 18 Hz e comprimento de onda 18,5 m
DADO P2a28cd0d: alternativas -> A) Espanha (Valência). B) Irlanda do Norte. C) Itália (Basilicata). D) Dinamarca. E) Romênia. (estão dentro do texto_da_prova)
DADO P6de86a7a: alternativas.E -> "100 GHz." (o Note e adote está colado: c = 3×10⁸ m/s; π ≅ 3; 1 GHz = 10⁹ Hz)
RECLASS Pd417f4f2 F10.1 -> F10.6
DADO P4ab31d4d: alternativas -> são figuras: (A) só pulso invertido voltando para a esquerda na corda fina; (B) só pulso para cima seguindo para a direita na corda grossa; (C) pulso para cima voltando na corda fina e pulso para cima seguindo na grossa; (D) pulso invertido voltando na corda fina e pulso para cima seguindo na grossa
DADO P8f4cd7d3: alternativas -> E termina em "gerada em buracos negros." (o "#####" não está no print)
DADO P06262d36: alternativas -> (A) 4,5 m e 9,0 m, apenas. (B) 4,5 m e 7,5 m, apenas. (C) 3,0 m e 9,0 m, apenas. (D) 3,0 m, 6,0 m e 9,0 m, apenas. (E) 3,0 m, 4,5 m, 6,0 m, 7,5 m e 9,0 m.; texto_da_prova -> sem o lixo de OCR da figura ("AB M jd 20m d-——>>>...")
DADO Pf626cc05: alternativas -> E: '80 cm' (o 'Note e adote: vs = 340 m/s' foi colado na alternativa E).
DADO Pa2f46795: texto_da_prova -> a camada mistura a questão 47; pelo print: corda de comprimento L, massa m₀, frequência f₁ no 1º harmônico; com massa M a frequência passa a 2f₁; pede M/m₀. Alternativas (A) 1/4 (B) 1/2 (C) 1 (D) 2 (E) 4; Note e adote: v ∝ √(tensão).
DADO Pa2f46795: alternativas -> ausentes na entrada; no print: (A) 1/4 (B) 1/2 (C) 1 (D) 2 (E) 4.
DADO P4ce2dde7: texto_da_prova -> faltam as distâncias da imagem: '8/11 m' em t₀ e '20/29 m' em t₁, e o vetor v na primeira frase.
DADO Pc0f508ae: alternativas -> A. 250 Hz; B. 150 Hz; C. 750 Hz; D. 1250 Hz; E. 625 Hz (sem os parênteses do OCR).
DADO P19eed56c: alternativas -> (A) 5 cm (B) 10 cm (C) 50 cm (D) 100 cm (E) 150 cm; texto mistura a questão 49; Note e adote: π = 3, g = 10 m/s².
DADO P734013ac: alternativas -> A. 1,4 A e 187 Ω; B. 1,0 A e 30 Ω; C. 2,0 A e 60 Ω; D. 2,5 A e 120 Ω (faltou o Ω).
RECLASS P4ce2dde7 F10.7 -> F09.3
RECLASS P2c7d9b5a F10.5 -> F10.3
DADO Pcca211b2: alternativas.C -> √Δ/2A.
DADO P2e8d89a7: alternativas -> A: 3,6·10²² elétrons | B: 1,8·10¹⁹ elétrons | C: 1,6·10¹⁶ elétrons | D: 4·10¹⁸ elétrons (expoentes sobrescritos perdidos na camada de texto)
DADO P34628cf3: texto_da_prova -> carga Q = 1,6 µC (no texto está 1,6 C)
DADO P7b16fe01: texto_da_prova -> falta a função x(t) = 5·cos(4πt + π/3) (só no print)

## 2026-11-19 16:54 UTC — PENDENCIAS — session_01PveEKYFao9mdqzruhVmuPm
Lote gravado: fis-0071 (49 ok, 1 pendente). Aberto: fis-0072.
Gabarito do Aprendice: Pbdfc7e79 E (resolvedor e conferente às cegas; igual ao preliminar).
DADO Pd73e285b: texto_da_prova -> falta "√10 = 3,1" (no print: "ar e √10 = 3,1, a intensidade...")
DADO P8beaca57: alternativas.E -> "9,1" (o resto é o início do enunciado colado)
DADO P8751ad89: alternativas.E -> "50℃< 𝑇< 75℃" (o "Note e adote" é caixa à parte)
DADO P201e692f: texto_da_prova -> "qA=qB=1μC" (está "14C")
DADO Pdf09ed04: texto_da_prova -> afirmativa 4 "resistência de 50 Ω" (falta o símbolo Ω)
ANULAR P8beaca57 UPE 2026 SSA3 q75: v0 correto ≈ 5,06 m/s (não está nas alternativas); gabarito C = 5,6 é v² no topo em m²/s²
DADO P6797388c: texto_da_prova -> "resistência interna R_V = 2000 Ω" (a entrada traz "Ry = 2000 2")
DADO P6797388c: alternativas -> A 55 Ω; B 95 Ω; C 105 Ω; D 100 Ω; E 110 Ω (a entrada traz "() 550", "() 950", "() 1059", "() 1009", "() 1100")
RECLASS P3786443c F11.9 -> F11.4
DADO P42817189: alternativas -> são figuras: (A) F_E para a direita e F_B para baixo; (B) F_E para a direita e F_B para cima; (C) F_E para a esquerda e F_B para a direita, na mesma linha; (D) F_E para a direita e F_B para dentro do papel; (E) F_E para a esquerda e F_B para fora do papel
DADO Pe615c6fb: texto_da_prova e alternativas -> símbolos embaralhados; no print: Q = 1,6 × 10⁻¹⁹ C, v = 5,0 × 10⁴ m/s, B = 10 mT, cos θ = 0,80, sen θ = 0,60; alternativas a) 1,6 × 10⁻¹⁷ N b) 3,2 × 10⁻¹⁷ N c) 4,8 × 10⁻¹⁷ N d) 6,4 × 10⁻¹⁷ N e) 8,0 × 10⁻¹⁷ N
DADO Pd4f3e03a: texto_da_prova e alternativas -> símbolos embaralhados; no print: Q = 1,6 × 10⁻¹⁹ C, B = 1,0 T, F = 3,2 × 10⁻¹⁶ N, cos θ = √3/2, sen θ = 1/2; A) v = (4√3/3) × 10³ m/s B) 4,0 × 10³ C) 2,0 × 10³ D) 2√3 × 10³ E) 1,0 × 10³ m/s
DADO P35c39459: texto_da_prova -> vetores e norma embaralhados; no print: "campo magnético B (vetor) (constante), uma força f (vetor) perpendicular", "força B.i.L.sen(α)" e "||B|| é diretamente proporcional a 2i e inversamente proporcional a r²"
DADO P03a6e0eb: alternativas -> A termina em "menor do que 10⁻⁶ T." (expoente −6)
RECLASS Pad542d33 F12.2 -> F11.2
DADO P136b3d9d: texto_da_prova -> 'q = 2,0 µC' (não 2,0 C)
DADO P136b3d9d: alternativas -> em µN: a) 1,2 µN b) 2,6 µN c) 4,2 µN d) 7,4 µN e) 9,6 µN
DADO Pddcf205f: alternativas -> E: '0,8 mA' ('Considere π = 3' é nota do enunciado colada na alternativa)
DADO P1cb89704: texto_da_prova -> 'resistência elétrica 0,50 Ω' (a camada trocou Ω por 'ȍ')
RECLASS P2bd60030 F12.2 -> F04.1
DADO Pa10c738c: alternativas -> A 2/3; B 4/3; C 3/2; D 3/4; E 1 (texto_da_prova embaralhado; vale o print: R1, R2, R3, i_f, i_a)
DADO P72cd4180: alternativas -> A 85%; B 71%; C 56%; D 44%; E 29% (vieram só dentro do texto)
DADO P184df43b: texto_da_prova -> embaralhado; no print: lâmpadas de 20 Ω cada, mesma tensão nos três circuitos, pede a opção de corrente mínima
ANULAR P8beaca57: Fe = 0,036 N; no topo v² = (0,3 + 0,036)·0,5/0,03 = 5,6 m²/s²; na base v0² = 5,6 + 4·10·0,5 = 25,6 → v0 ≈ 5,06 m/s, fora das alternativas (oficial C = 5,6 é o v² no topo, não v0)
RECLASS P49037847 F11.6 -> F11.4

## 2026-11-19 17:10 UTC — PENDENCIAS — session_01PveEKYFao9mdqzruhVmuPm
Lote gravado: fis-0072 (49 ok, 1 pendente).
Gabarito do Aprendice: P7ee5ebb6 D, Pd7d43de1 D, P0de0270a A (resolvedor e conferente às cegas; iguais ao preliminar).
DADO Paa069ab9: alternativas.A -> "a velocidade da luz c depende do referencial em que se encontra o observador."; alternativas.E -> "duas partículas viajando com velocidade c, em sentidos opostos, possuem velocidade relativa igual a 2c."
DADO P9cbc10e5: texto_da_prova -> "Contrações relativísticas ocorrem por um fator de √(1 − v²/c²)."
DADO P0d8d3d39: alternativas -> faltam no campo; no print: A igual ao tempo de queda medido por S' e esse fato independe da magnitude da velocidade v do vagão; B maior... porque a trajetória vista pelo observador S é uma parábola; C menor... se a razão v/c é muito menor que 1; D maior... se a razão v/c é muito próxima de 1; E menor... se a razão v/c é muito próxima de 1
DADO Pf06556ef: alternativas -> potências escritas 10^14 no print (expoente sobrescrito); a entrada traz "1014"; enunciado: "h = 4,1×10^-15 eV.s"
DADO P12b479e4: texto_da_prova -> expoentes ilegíveis na camada de texto; no print: c = 3,0 × 10⁸ m/s, h = 6,6 × 10⁻³⁴ m²kg/s, 1 eV = 1,6 × 10⁻¹⁹ J
RECLASS P3cd13987 F01.5 -> F11.9
DADO P693b19a9: alternativas.E -> "(1) gama, (2) beta e (3) alfa" (a referência "Disponível em: ... Acesso em: 14 out. 2024." é crédito da figura, não da alternativa)
DADO P45210cac: texto_da_prova -> no print: largura do bico 0,4 mm; velocidade 30 mm/s; altura de cada camada 0,2 mm
RECLASS P0118f49e F02.1 -> F02.2
RECLASS P799cb33c F02.1 -> F02.4
DADO P193eb1d8: alternativas.C -> "... notação científica como 8x10³ N."
DADO Pd7d43de1: alternativas -> A "5 m e 5 m/s²"; B "5 m e 10 m/s²"; C "10 m e 5 m/s²"; D "10 m e 10 m/s²"
DADO Pd7d43de1: texto_da_prova -> no print: "No instante t = 0 [...] aceleração constante a. No instante t = 1 s, a esfera A é liberada [...] (de módulo g = 10 m/s²). No instante t = 2 s [...]"
RECLASS Pd7d43de1 F02.2 -> F02.5
DADO P0b65e6db: prova -> no print a questão aparece numerada como 22 (a entrada diz questão 32)
DADO Pc2ea4980: alternativas -> D: '(2,0î − 2,5ĵ) e |v_m| = 6,4' (sem os zeros '−02, 5' e '06, 4' da camada de texto).
DADO Pf4f19edd: texto_da_prova -> camada embaralhada com outras questões; pelo print: r = 2,017 m, ω = 200 rad/s, g = 10 m/s², 100 m de O ao centro da circunferência; alternativas (A) menos de 100 voltas (B) mais de 100 e menos de 110 (C) mais de 110 e menos de 120 (D) mais de 120 e menos de 130 (E) mais de 140 voltas.
DADO P3793c002: alternativas -> (A) (x−y)/(2x−2y+1) (B) −(1+x+y)/(x+y) (C) −(x−y)/(x+y) (D) x/y − y/x (E) (1+x+y)/(1−x+y) (frações achatadas na camada de texto).
DADO P0de0270a: alternativas -> a) u/(sen(β−α)/senβ + h senα/L) b) u cosβ/(cos(α+β) + h senα/L) c) u senβ/(senβ + h senα/L) d) u senβ/(sen(β+α) + h senα/L) e) u/(cosα + h senα cosβ/L) (frações achatadas na camada de texto).
DADO P029ca95d: alternativas -> A V, V e V; B F, F e F; C V, F e V; D F, V e F; E F, V e V (camada de texto embaralhada).
RECLASS P33701b89 F03.2 -> F03.3
RECLASS P71d3d124 F03.2 -> F03.5
ANULAR P5a4ec186 UFT 2023.1 q53 (Questão 21 no caderno): a correta é a = (mB/mA)·g = 2g (A: T = mA·a; B: T = mB·g), fora das alternativas; o gabarito D = 2/3 g vale só com C parado.
AUTORAL P693b19a9 (UEG 2025/1 q27): a figura da prova traz crédito do Brasil Escola (site didático); o dono decide sobre o print
DADO P0b65e6db: alternativas.E -> "II e III" (a caixa "Dado g = 10 m/s² sen 30° ..." veio grudada)
PRINT P4a6ee173 (UEMA 2026 PAES · questão 42): a alternativa E está cortada na borda de baixo (legível); refazer do PDF oficial
ANULAR P5a4ec186 (UFT 2023 Vestibular 2023/1 · questão 53): sem atrito, A dá T = mA·a e B (encostado em C) dá T = mB·g → a = (mB/mA)·g = 2g, fora das alternativas; a oficial D (2/3 g = mB·g/(mA+mB)) só vale com C parado

## 2026-11-19 17:10 UTC — AVISO — session_01PveEKYFao9mdqzruhVmuPm
Conferência no site (Pe2a025f3, Pfb36d3ec, P6de86a7a; 390 e 1280 px, tema claro): 4 blocos completos, fração empilhada, lousa até o fim, sem erro de console. Dois pontos para decidir (design, não mexi):
- Pfb36d3ec a 390 px: a última linha da lousa ("T final = T inicial ≠ T constante no caminho") passa da borda e "caminho" fica cortado; em 1280 px cabe.
- Unidades com barra em linha ("kJ/°C", "kJ/kg·°C") em Pe2a025f3, na lousa e nos textos: a regra da fração empilhada vale para unidades?

## 2026-11-19 17:10 UTC — FIM — session_01PveEKYFao9mdqzruhVmuPm
Último lote gravado: fis-0072. Nenhum lote de Física aberto. Nesta sessão: fis-0069 (49 ok, 1 pendente), fis-0070 (50 ok), fis-0071 (49 ok, 1 pendente), fis-0072 (49 ok, 1 pendente) = 197 resoluções. Física: faltam 244 (todas na faixa f5, demais nível 7-10).
Pendentes desta sessão (ANULAR, linhas acima): Pa4042d98, P8beaca57, P5a4ec186. PRINT P4a6ee173. AUTORAL P693b19a9.
Gabarito do Aprendice: Pbdfc7e79 E; P7ee5ebb6 D; Pd7d43de1 D; P0de0270a A.
Testes depois do fis-0071 (converte + tsc + vitest): tsc ok; vitest 786 de 786.
Observação para as próximas sessões: os conferentes devolvem equivocos que afirmam origem sem conta que a reproduza; quando a conta não chega ao valor exato da letra, usar equívoco de conceito específico daquela letra.

## 2026-11-19 17:43 UTC — PENDENCIAS — session_01PveEKWeU9BGX5xnf2nstPb
Lote fis-0073 gravado (50 resoluções conferidas). Aberto: fis-0074.
Gabarito do Aprendice: Pb540af3d A, P5e3c2b4d B, Pc5f97dfa A (resolvedor e conferente às cegas; iguais ao preliminar).
DADO P52e4b871: alternativas.E -> "102 N." (texto da figura "α A B C" colado na alternativa)
DADO P6c5f6e37: alternativas -> expoentes perdidos: A 6,4×10⁷; B 6,4×10⁵; C 6,4×10³; D 8,3×10⁴; E 8,3×10⁶ (E também traz colado o quadro "Lembre-se de que ac = V2/R" e a legenda da figura)
DADO Pc861023e: texto_da_prova -> sobra a linha "E ( ) mg + √8kmV 2." que não existe no print; a E do print é "mg (1 − 2H/R)"
RECLASS P5b8f3493 F03.4 -> F10.8 (ITA 2026 q17: pêndulo e massa-mola com períodos iguais, MHS e energia)
RECLASS Pd208168a F03.5 -> F04.1 (PUCPR 2023/1 Medicina q42: túnel pela Terra, área sob a × d = v²/2; trabalho de força variável, não força centrípeta)
DADO Pd687e6dc: alternativas.E -> "100" (PUC-Rio 2025 Grupo 4 q25/15: o quadro "Dado g = 10 m/s2" está colado na alternativa E)
DADO P27e436ec: alternativas.D -> "T1 = T2 + T3" (PUCRS 2026 Verão q36: rótulos T1 T2 T3 da figura colados na alternativa D)
DADO Pe70050bf: alternativas -> frações empilhadas no print: A mLf/(2Ri²), B 3mLf/(Ri²), C 5mLf/(2Ri²), D 11mLf/(2Ri²), E 2mLf/(Ri²) (IME 2021 q21)
DADO P5e3c2b4d: alternativas -> no print: A (1/2)mg(cosα + senα); B (1/2)mg; C (1/2)mg cosα √(cos²α + (1/2)sen²α); D (1/2)mg cosα √(cos²α + (1/4)sen²α); E (1/2)mg cosα (IME 2025 q23)
DADO Pd208168a: alternativas -> no print: A √(g₀·R); B m·g₀·R; C √(2·g₀·R); D √((m·g₀·R)/2); E (g₀·R)/2 (PUCPR 2023/1 q42; entrada veio vazia)
GABARITO Pb540af3d: gabarito do Aprendice A (10 N); Estratégia Militares (gabarito IME 2024, q23) também dá A; falta a letra do conferente às cegas e conferir com o preliminar do IME
GABARITO P5e3c2b4d: gabarito do Aprendice B (mg/2); Estratégia Vestibulares (gabarito IME 2025, q23) também dá B; falta a letra do conferente às cegas e conferir com o preliminar do IME
RECLASS P1e81e234 F04.3 -> F02.5 (FCM-MG 2024/1 q45: lançamento oblíquo, velocidade da bola na parede; energia só confere)
DADO P4bf65a1d: alternativas -> ausentes na entrada (estão no fim de texto_da_prova com acentos quebrados); print: A (1/3)(h − 4R + FR/(mg)), B (1/6)(4h − 5R + FR/(mg)), C (1/3)(h − 5R + FR/(mg)), D (1/6)(2h − 3R + FR/(mg)), E (1/6)(h − 2R + FR/(mg))
DADO Paa96f802: alternativas -> ausentes na entrada (no fim de texto_da_prova); print: A 7,7R, B 8,5R, C 9,3R, D 10,1R, E 10,9R
DADO Pe4b1e3e4: texto_da_prova -> "velocidade inicial v0 = 30,0 m/s" (não "vy"), "módulo constante fd = 2,00 N" (não "fy"); alternativas ausentes e embaralhadas, B no print: "45,0 m; 376 J"
DADO Pe5c9b7f8: alternativas.D -> "70 m/s" (texto do gráfico colado)
DADO Pc3ba0c94: alternativas.E -> "45 kN" ("Fmáx" do gráfico colado)
DADO Pf8042133: alternativas -> A v²/(2·10⁶gd), B v/(2·10⁶gd), C v²/(10⁶gd), D v/(3·10⁶gd), E v²/(3·10⁶gd)
DADO P5d6e3279: alternativas -> A (M/(m + M)) tan α, B (1 + m/M) tan α, C tan α, D √(1 + m/M) tan α, E (1 + √(m/M)) tan α
RECLASS P83f2d681 F04.5 -> F12.4
RECLASS Paa96f802 F04.3 -> F05.3
RECLASS Pe2eff0bf F05.2 -> F08.1 (UEG 2021/1 q27: conversão °C -> °F, escalas termométricas)
RECLASS Pe75e787b F06.1 -> F06.2 (UEMA PAES 2022 q41: razão de forças F = G M m/r², gravitação universal, não Kepler)
DADO P82322ec8: alternativas -> (A) vA = −(1/3) v e ΔEc = 0; (B) vA = +(1/3) v e ΔEc = 0; (C) vA = −(1/3) v e ΔEc = +(8/9) v²; (D) vA = +(1/3) v e ΔEc = −(8/9) v² (frações desempilhadas na entrada)
DADO P8963dd0f: texto_da_prova -> sem as três linhas "E ( ) mg + √8kmV 2." (lixo de outra questão; não estão no print)
DADO Pbe492471: alternativas.E -> "I, II e III são verdadeiras." (sem o lixo "a a e a ar"); texto_da_prova começa em "Duas partículas X e Y" (sem "m e h. o m s i é")
DADO Pe75e787b: alternativas -> a) 20/9  b) 9/20  c) 2√5/3  d) 2√5/9  e) 3√20 (entrada com A embaralhada, B–D vazias, E "3 20"; texto_da_prova termina com "20 9" solto)

## 2026-11-19 17:51 UTC — PENDENCIAS — session_01PveEKWeU9BGX5xnf2nstPb
Lote fis-0074 gravado (49 resoluções conferidas, 1 pendente). Aberto: fis-0075 (na conferência).
Gabarito do Aprendice: P0729a463 D, P5d71170c D, P0727817f C, Pd59979ac A, P7a8c7dc8 D (resolvedor e conferente às cegas; iguais ao preliminar).
RECLASS P1e7255e2 F -> mat M01.5 (operações com conjuntos no mapa de satélites; sem Física)
RECLASS P1e7255e2 F06.3 -> M01.5 (UEMA PAES 2020 q48: operações com conjuntos num mapa de coberturas de satélites; é de Matemática — saiu como pendente "classificação")
DADO P153752f7: alternativas -> no print as potências são 10⁸ (A 3,6 × 10⁸ m; B 5,0 × 10⁸ m; C 3,0 × 10⁸ m; D 4,0 × 10⁸ m; E 2,0 × 10⁸ m); a camada de texto achatou para "108m"
DADO Pecbe72a5: alternativas -> no print: A √(2GM/b); B 2√(GM/b); C (1/2)√(GM/b); D √(GM/(2b)); E √(GM/b) (a camada de texto trocou o radical por "p")
GABARITO P0729a463 (IME 2025 1ª fase q26): sem gabarito publicado; letra do Aprendice D (2CGmM/B²); web não achou gabarito nem resolução publicada; falta a letra do conferente às cegas e conferir com o preliminar
DADO Pbfd8c979: alternativas.D -> "2,0" (PUCRS 2023 Verão q33: rótulos da figura "A B h1 h2" colados na alternativa D)
DADO Pfe95ab06: alternativas -> no print: A 2,4 m; B 4,6 m; C 9,0 m; D 1,3 × 10 m; E 1,8 × 10 m (ITA 2023 q5; entrada sem alternativas separadas, texto com acentos quebrados)
DADO Pad8fe9e4: alternativas -> no print: A 1,704 atm; B 1,756 atm; C 1,760 atm; D 1,764 atm; E 1,784 atm; texto_da_prova "1 atm = 105 Pa" -> "1 atm = 10⁵ Pa" e "9,8 m/s2" -> "9,8 m/s²" (UERR 2026 q59)
DADO P79e085fd: alternativas -> fórmulas sumiram na entrada; no print: A m = (kx/g)(As/Ae); B m = (kx/g)(As/Ae); C m = (g/kx)(Ae/As); D m = (kx/g)(As/Ae); E m = (kx/g)(Ae/As) (Unioeste 2022 q57, numerada 36 no caderno)
DADO P3b9c8769: alternativas -> expoentes no print: A 4,0 · 10²⁶; B 8,1 · 10²⁶; C 2,4 · 10²⁷; D 6,4 · 10²⁷ (FCM-MG 2023/2 q45)
DADO P036abe46: alternativas -> no print todas são vetores: A p⃗; B −p⃗; C p⃗ − P⃗; D −(p⃗ + P⃗) (Cederj 2022.2 q16)
GABARITO P5d71170c: gabarito do Aprendice D (x = 21 cm: p₁ = 72 cmHg, Boyle 72·45 = p₂·40 → 81 cmHg, x = 10 + 11); nenhuma resolução publicada achada na web; falta a letra do conferente às cegas e conferir com o preliminar do IME (IME 2025 1ª fase q18)
DADO Pc4941ba7: alternativas.D -> "Nas duas situações, o peso da bolinha é igual ao módulo do empuxo exercido sobre ela." (sem o lixo "( 1 ) ( 2 ) água azeite" da figura)
DADO P23d7b64f: texto_da_prova -> "quando a densidade do ar da sala do laboratório é igual a 1 kg/m³, é dada por" (entrada com "1 *+ ⁄"); alternativas -> A 8,10 m/s² B 8,34 m/s² C 8,82 m/s² D 8,91 m/s² E 9,12 m/s² (entrada sem o campo alternativas; estavam coladas no texto)
DADO Pefc7ba21: alternativas -> A (ρa/ρt − 2/3) B (2ρa − 1/(3ρt)) C (2ρa3ρt − 1) D ((2/3)ρa − ρt) E (2ρa/(3ρt) − 1), todas seguidas de "da massa do tronco." (entrada com caracteres embaralhados)
DADO P7ec4cd33: texto_da_prova -> fórmula "E_relativo = (peso real − peso medido)/(peso real)" (entrada com as palavras soltas "relativo peso real peso medido E peso real −  =")
GABARITO P0727817f: IME 2024 (Concurso 2023/2024) 1ª fase q17 — letra do resolvedor C; Estratégia Militares (gabarito dos professores) também C: https://militares.estrategia.com/portal/eventos/gabaritos/gabarito-ime-correcao-ao-vivo-2/ — conferir com o preliminar/definitivo do IME
GABARITO Pd59979ac: IME 2025 (Concurso 2024/2025) 1ª fase q20 — letra do resolvedor A; Estratégia Militares (página com links do preliminar e do final) também A: https://militares.estrategia.com/portal/eventos/gabarito-ime-2024-2025-correcao-primeira-fase/ — conferir com o preliminar/definitivo do IME
DADO Pb020d69d: alternativas -> ausentes na entrada (no fim de texto_da_prova, com lixo "E ( ) mg + √8kmV2" colado); print: A 2√((H − h)(h + m/(ρA))), B √(2h(H − h + m/(ρA))), C 2√(h(H − h + m/(ρA))), D 2√(h(H − h + m/(2ρA))), E √(h(H − h + m/(ρA)))
DADO P7ec8cfe4: alternativas -> ausentes na entrada (lixo "E ( ) mg + √8kmV2" colado); print: A 0, B ρv1²/2, C (ρv1²/2)((1 − k²)/k²), D (ρv1²/2)((1 − k)/k), E (ρv1²/2)((1 − k²)/k)
DADO P81d2150c: texto_da_prova -> "α = 2 × 10⁻⁴ °C⁻¹" e "(1 + x)ⁿ ≈ 1 + nx, para |x| ≪ 1" (OCR embaralhado); alternativas ausentes: A aumenta de 0,1%, B aumenta de 0,05%, C diminui de 0,1%, D diminui de 0,05%, E permanece inalterado
DADO P7a8c7dc8: alternativas -> frações: A √17γTL/4, B 5γTL/12, C √17γTL/21, D √17γTL/12, E γTL/4
DADO P26bddfd1: alternativas.E -> "Lo [(α2 + α1) ∆T]-1" (sem "Questão 16 AS" colado)
RECLASS Pa8ac08bb F08.1 -> F08.3
DADO P924deffb: alternativas.E -> "9" (o "Questão 19" colado não está na alternativa do print)
DADO Pd61b29a7: texto_da_prova -> o enunciado (regras da bola entre 0,60 e 1,10 atm, calibrada a 0,90 atm e 27 °C, aquecida a 57 °C a volume constante, fórmulas TK = TC + 273 e P0·V0/T0 = P1·V1/T1) está colado na alternativa E; no print ele vem antes do comando, e a alternativa E é só "foi mantida, pois a pressão alcançou aproximadamente 1,90 atm."
DADO P2ab1243e: alternativas -> frações: A γ = 1/T1; B γ = 1/T2; C γ = 2/T2; D γ = 3/T1; E γ = n/T1
DADO P39a488e6: alternativas -> expoentes: A 2 × 10⁻⁵ °C⁻¹; B 5 × 10⁻⁵ °C⁻¹; C −2 × 10⁻⁵ °C⁻¹; D 1,2 × 10⁻⁵ °C⁻¹; E −5 × 10⁻⁵ °C⁻¹
RECLASS P074765f3 F08.3 -> F08.1
RECLASS P39a488e6 F08.5 -> F08.2

## 2026-11-19 17:55 UTC — PENDENCIAS — session_01PveEKWeU9BGX5xnf2nstPb
Lote fis-0075 gravado (49 resoluções conferidas, 1 pendente). Aberto: fis-0076.
Gabarito do Aprendice: P4164d3e5 D, P17ada06f A, P600246b2 B, P4cea0727 C, P6f60a2e4 C, Pa0db8474 E, P5fb1646c A (resolvedor e conferente às cegas; iguais ao preliminar).
RECLASS P82169a8f F09.4 -> qui Q09.1 (pilha de limão: eletroquímica)
GABARITO P0e87de45: resolvida com a oficial B (1ª lei: W = Q = 2500 cal), mas os dados se contradizem (p₁V₁·ln 4 ≈ 4495 J ≈ 1074 cal); alerta na resolução. Decidir se anula.
RECLASS P57fd4393 F08.7 -> F08.6 (PUCRS 2023 Verão q32: só lê T ∝ pV no diagrama, sem trabalho nem 1ª lei; é transformação gasosa)
DADO P4e91097e: texto_da_prova -> OCR embaralhado; no print: "três máquinas térmicas M1, M2 e M3", "aproveitados por M2", "M3 aproveita o rejeito de M2", "fonte fria de M1" e alternativa E "as afirmações I e III estão incorretas" (ITA 2020, questão 15)
DADO P35980c5d: alternativas -> no print: A √(2g(H − 3h/2)); B √(2g(H − h)); C (1/2)√(2g(H − 3h/2)); D 2√(2g(H − 3h/2)); E 2√(2g(H − h)) (ITA 2024, questão 2; o texto da entrada traz as raízes quebradas)
DADO Pdd874c02: texto_da_prova e alternativas -> no print: θ1 = 1° = π/180; n_i = 2·n_(i+1), i = 1..5; para ângulos < 5°, sen θ = θ e cos θ = 1; A θ3R = π/720; B θ3R = π/360; C θ3R = π/120; D θ3R = π/45 (UFT 2024/1, questão 60, impressa como QUESTÃO 28)
GABARITO P4164d3e5: IME 2024 1ª fase questão 28 — nenhuma resolução publicada achada na web (projetoagathaedu dá 403); letra do Aprendice D (|v|² = 17 − 8 sen t, máx 5 m/s); conferir com o preliminar do IME
GABARITO P17ada06f: IME 2024 1ª fase questão 27 — nenhuma resolução publicada achada na web; letra do Aprendice A (D = 15 m, a = 40/9 m/s², v = 5√5 m/s); conferir com o preliminar do IME
RECLASS P82169a8f: UEMA PAES 2020 questão 56 (pilha de limão) é de Química Q09.1, não de Física F09.4 — saiu como pendente "classificação"
DADO Pecd60126: alternativas.E -> "0,96" (o "Questão 17" colado não está na alternativa do print)
DADO P3e48cf43: texto_da_prova -> "índice de refração n = √2" (a entrada diz "n = 2"); alternativas ausentes na entrada (OCR embaralhado); print: A 1 mm; B √2/2 mm; C (1 − √2/2) mm; D √3/3 mm; E (1 − √3/3) mm
DADO Paa98b026: alternativas -> ausentes na entrada (estão no fim de texto_da_prova); print: A V F F; B F V F; C F F V; D V V F; E F V V
DADO P2afa80e2: texto_da_prova -> equação embaralhada; no print: 1/f = (n − 1)[1/R1 + 1/R2]; alternativas -> B "f = 2fo." (sem "fo f f" colado); C "f = (3/2) fo"; D "f = (1/2) fo"
DADO P4cea0727: alternativas -> D "−fΔn/(n² − 1)"; E "fΔn/(n² − 1)" (expoente achatado para "n2")
DADO P5b4bed45: texto_da_prova -> "n(λ) = A + B/λ²"; alternativas -> frações: A αA(λ2² − λ1²)/(λ1λ2); B θ0A(λ2² − λ1²)/(λ1λ2); C αB(λ2² + λ1²)/(λ1λ2)²; D θ0B(λ2² − λ1²)/(λ1λ2)²; E αB(λ2² − λ1²)/(λ1λ2)²
GABARITO P600246b2 (IME 2024 1ª fase q26): sem gabarito publicado; letra do Aprendice B (d = 120 cm); a web não trouxe gabarito nem resolução publicada; falta a letra do conferente às cegas e conferir com o preliminar
GABARITO P4cea0727 (IME 2025 1ª fase q28): sem gabarito publicado; letra do Aprendice C (−fΔn/(n − 1)); a web não trouxe gabarito nem resolução publicada; falta a letra do conferente às cegas e conferir com o preliminar
DADO P4c7b1c15: alternativas -> ausentes na entrada (no fim de texto_da_prova); print: A 7, B 14, C 25, D 75, E 175
DADO Pee295349: texto_da_prova -> valores apagados na camada de texto; print: "energia cinética inicial de um elétron é 40.000 eV e que sua energia após a colisão seja 20.000 eV", "constante de Planck seja aproximadamente 4,0 × 10⁻¹⁵ eV·s"; alternativas vazias, print: a) 1,0 × 10¹² b) 2,0 × 10¹² c) 5,0 × 10¹⁸ d) 10,0 × 10¹⁸ e) 15,0 × 10¹⁸
DADO P4c89caef: texto_da_prova -> "v(t) = 250 − 5 × 10⁶t [m/s]" (expoente 6 achatado em "106t")
DADO P6f60a2e4: alternativas -> frações empilhadas: A (n² − 1)df/c ímpar, B (n² − 1)df/c par, C (n − 1)df/c inteiro, D 2(n − 1)df/c ímpar, E 2(n + 1)df/c par
DADO Pa0db8474: texto_da_prova -> "n(x) = √(2L/(L + x)); 0 ≤ x ≤ L"; alternativas -> A λ/(2(2 + 3√2)), B λ/(3(2√2 − 2)), C λ/(3(2 − √2)), D λ/(2(3 + 2√2)), E λ/(2(3 − 2√2))
DADO Pb7757677: alternativas -> ausentes na entrada; print: A (λm + (n − 1)R)·L/a, B (λm − nR)·L/a, C λm·L/a + (n − 1)R, D (λm + nR)·L/a, E (λm − nR)·L/(2a)
DADO P1f316181: alternativas -> ausentes na entrada; print: A 40 nm, B 90 nm, C 100 nm, D 160 nm, E 200 nm
RECLASS Pee295349 F10.2 -> F01.5
RECLASS P95e563c2 F10.3 -> F01.5
GABARITO P6f60a2e4 (IME 2024 1ª fase q18): gabarito do Aprendice C; falta a letra do conferente às cegas e comparar com o preliminar; nenhuma resolução publicada achada na web
GABARITO Pa0db8474 (IME 2025 1ª fase q24): gabarito do Aprendice E; falta a letra do conferente às cegas e comparar com o preliminar; Estratégia Militares tem a questão, mas a letra não aparece na página pública
RECLASS P4bdbab83 F10.5 -> F10.6
GABARITO P5fb1646c (IME 2025 1ª fase, questão 21): sem gabarito publicado; letra do resolvedor A (f1 ≥ f2 ≥ f3 = ff ≥ f4 ≥ f5); nenhuma resolução publicada localizada na web; falta a letra do conferente às cegas e conferir com o preliminar do IME

## 2026-11-19 18:06 UTC — PENDENCIAS — session_01PveEKWeU9BGX5xnf2nstPb
Lote fis-0076 gravado (50 resoluções conferidas). Aberto: fis-0077 (o último de Física).
Gabarito do Aprendice: P877ce3aa C, Pb9b4cfe3 C, P4ada453c B (resolvedor e conferente às cegas; iguais ao preliminar).
RECLASS P8a70f9d5 F10.8 -> F03.1 (UEMA 2020 PAES q43: objeto pendurado em trem acelerado, a = g·tg θ; leis de Newton, não MHS)
DADO P397cca39: texto_da_prova -> sobra a linha "E ( ) mg+ √8kmV 2." e os rótulos "M 2M F" da figura, que não fazem parte das alternativas; no print: A 0; B 2πl/T; C 2πl/(3T); D √(8/3) × πl/T; E √(8/27) × πl/T (ITA 2022 q7)
DADO Peb8bbfb7: alternativas -> frações empilhadas no print: A MΔf/(2m); B √2MΔf/(2m); C MΔf/m; D √2MΔf/m; E 2MΔf/m (ITA 2021 q7; entrada sem o campo alternativas)
DADO P877ce3aa: alternativas -> frações achatadas; print: A 2·kq²/L², B (9/4)·kq²/L², C (3/2)·kq²/L², D (1/4)·(kq²/L²)·(4 + √2), E (1/4)·(kq²/L²)·(2 + √2)
DADO Pb9b4cfe3: texto_da_prova -> "E(r) = A·cos(3rπ/(2R)) + (2 − r)²/R − 1, para 0 ≤ r ≤ R; E(r) = 0, para r > R" (fórmula embaralhada na camada de texto)
DADO P0a0bda42: alternativas -> ausentes na entrada (OCR embaralhado); print: A l·√(12πε₀mg·senθ·cosθ), B l·√(4πε₀mg·tgθ·√3), C l·senθ·√(4πε₀mg·tgθ·√3), D l·senθ·√(4πε₀mg·tgθ/√3), E l·senθ·√(4πε₀mg·tgθ); texto: "comprimento l", "ângulo ... é θ", "ε₀ a permissividade"
DADO P053d5796: texto_da_prova -> "diferença de potencial igual a 6·10⁵ V" (está "6.105 V")
DADO Pf3445538: texto_da_prova -> símbolos apagados; print: "de raio R", "toda sua carga Q", "módulo do campo elétrico E", "a uma distância r"; alternativas vazias, print: a) E = k₀·Q/R b) E = k₀·(Q/R)·r c) E = k₀·Q/r² d) E = k₀·Q/r e) E = k₀·(Q/R³)·r²
DADO P25d79d22: alternativas -> C "E/9 e V/3" (está "E 9 e V 3")
RECLASS Pbc3a3190 F11.1 -> F11.2
GABARITO P877ce3aa (IME 2025 1ª fase q17): gabarito do Aprendice C; falta a letra do conferente às cegas e comparar com o preliminar; nenhuma resolução publicada achada na web
GABARITO Pb9b4cfe3 (IME 2025 1ª fase q30): gabarito do Aprendice C; falta a letra do conferente às cegas e comparar com o preliminar; nenhuma resolução publicada achada na web
DADO P190205c6: texto_da_prova -> "resistência total de 6,0 x 10³ Ω" (a entrada diz "6,0 x 10º O"); tabela no print: sem carga 2,0 | 1 a 3: 1,9 - 1,5 | 4 a 6: 1,4 - 1,0 | 7 a 9: 0,9 - 0,5 | 10 a 12: 0,4 - 0,1 (mA)
DADO Pf9580bde: alternativas.E -> "0,05%" (o "Dado: 1 cal = 4,2 J; c_ar = 0,25 cal/g°C" é texto de apoio do enunciado, não da alternativa)
DADO P0d961aaa: texto_da_prova/alternativas -> "E = 40 N/C" e velocidades em "m/s" (a entrada achatou para "40𝑁𝐶" e "15𝑚𝑠")
DADO P4ada453c: alternativas -> frações empilhadas: A kqQ/(2am), B kqQ/(3am), C 4kqQ/(3am), D 3kqQ/(2am), E kqQ/(am)
RECLASS Pf9c1c3d0 F11.3 -> F11.5
RECLASS P8b03c753 F11.4 -> F11.5
GABARITO P4ada453c (IME 2024 1ª fase, q. 29): sem gabarito publicado; letra do resolvedor B (v² = kqQ/(3am)); nenhuma resolução publicada achada na web; falta a letra do conferente às cegas e a comparação com o preliminar
RECLASS P1c143527 F11.5 -> F12.4
DADO P841bbcb2: texto_da_prova -> "diferença de potencial V ≠ 0 constante" (o sinal ≠ virou "=" na entrada)
DADO Pa3fd2919: texto_da_prova -> "1,0 kΩ" e "6 kΩ" (o Ω sumiu na entrada); o print traz o número 17 no cabeçalho (entrada: questão 27)
DADO P76cef88f: texto_da_prova -> falta a tabela da figura: BATERIA 1650 mAh; 3,7 V; 6,1 Wh | CARREGADOR Entrada AC: 100-240 V, 50-60 Hz; 0,3 A | Saída DC: 5 V; 1,55 A
DADO P4de453e6: texto_da_prova -> "P = R.i²" e "P = U²/R" (expoentes perdidos na entrada: "R.i2", "U2/R")
DADO Pbf50c69a: texto_da_prova -> IV: "6,25 × 10¹⁸ elétrons" e "1,6 × 10⁻¹⁹ Coulomb" (entrada com "1018" e "10–19")
DADO Paae3ea80: alternativas -> frações: A) i = (ϵ + ϵ′)/(R1 + R2 + r + r′); B) i = (ϵ + ϵ′)/(R1 − R2 − r + r′); C) i = (ϵ′ − ϵ)/(R1 + R2 + r − r′); D) i = (ϵ − ϵ′)/(R1 − R2 + r − r′); E) i = (ϵ − ϵ′)/(R1 + R2 + r + r′) (barra de fração perdida na entrada)
RECLASS Pbf50c69a F11.6 -> F11.4 (URCA 2025.1 q9: afirmativas sobre definição de corrente, campo no fio e carga elementar; só a V é de potência)
RECLASS Pa902c913 F11.7 -> F11.5 (Unifor 2025.1 q19: associação de resistores iguais, simetria/ponte equilibrada, sem gerador)
AVISO (site, conferência de 3 questões): Pe70050bf — o bloco "Resposta correta" mostra a fração em linha ("t = 5mLf/(2Ri²)"); na lousa ela aparece empilhada. Falta empilhar a fração no texto da resposta (é código/design, não mexi). Testes depois do fis-0075: tsc ok; vitest 786 de 786.

## 2026-11-19 18:18 UTC — PENDENCIAS — session_01PveEKWeU9BGX5xnf2nstPb
Lote fis-0077 gravado (44 resoluções conferidas).
Gabarito do Aprendice: P798a0821 D, P68243a65 E, Pe183d00e E (resolvedor e conferente às cegas; iguais ao preliminar).
DADO P7a8f3131: alternativas -> D é só "Chuveiro e lâmpada"; o resto ("220 V Fusível 1 2 3 4") são rótulos da figura (PUCRS 2026 Verão q31)
DADO Pbb89a422: alternativas -> as alternativas são cinco circuitos desenhados no print, sem texto: (A) 0,1 F e 1 H em série de X a Y, 2 Ω em derivação; (B) 0,1 F e 2 Ω em série, 1 H em derivação; (C) 2,4 H e 4 Ω em série, 0,05 F em derivação; (D) 2 Ω e 1 H em série, 0,1 F em derivação; (E) 1 H e 2 Ω em série, 0,1 F em derivação (IME 2021 q30; entrada sem o campo alternativas)
DADO P5c68b498: texto_da_prova -> sobra a linha "E ( ) mg + √8kmV 2." de outra questão; no print as alternativas são só A C, B 2 C, C 3 C, D 8 C/3, E 8 C (ITA 2022 q13)
DADO P5d8fc528: texto_da_prova -> alternativas com fração empilhada no print: A (ε0L²/a)(6,4κo + 2,6κa); B (ε0L²/a)(6,4κo + 1,6κa); C (ε0L²/a)(3,2κo + 0,8κa); D (ε0L²/a)(3,2κo + 1,8κa); E (ε0L²/a)(1,6κo + 6,4κa) (ITA 2025 q21; entrada sem o campo alternativas)
DADO P459af21d: alternativas -> faltam na entrada (vieram coladas no fim do texto_da_prova); no print: A 26; B 20; C 24; D 14; E 12
DADO P9233e304: texto_da_prova -> OCR embaralhado com pedaços da figura; no print: I. Se os raios a, b e c tendem a zero, a aceleração do ímã será a menor possível. II. Se os raios a = c < b, a aceleração do ímã em c será maior que em b. III. Se os raios a = b > c, e considerando o efeito Joule no material condutor, a temperatura local em c é maior que em a e b. IV. Se os raios a = b = c, com a região b agora composta por um material dielétrico ideal, a velocidade final do ímã, após passar por c, será maior do que seria caso todo o tubo fosse condutor. V. Se todo o tubo fosse composto de um material dielétrico ideal com raios a > b > c, a aceleração em b seria maior que em c.
DADO P9233e304: alternativas -> faltam na entrada; no print: A I, II e V; B II, III e IV; C III, IV e V; D I, II, III e IV; E I, III e IV
DADO P2382f20b: alternativas -> frações perdidas; no print: A 2πm/(q(2v0 sen(α)/g − t1)); B πm/(q(2v0 sen(α)/g − t1)); C 2πm/(q(v0 sen(α)/g − t1)); D 4πm/(q(2v0 sen(α)/g − t1)); E πm/(q(v0 sen(α)/(2g) − t1))
RECLASS P9233e304 F12.1 -> F12.4 (ITA 2026 q22: ímã caindo em tubo condutor com furos, correntes induzidas e Lenz)
RECLASS P0b24ca44 F12.2 -> F11.2 (Cederj 2024.2 q16: dipolo elétrico em campo elétrico uniforme, não é força magnética)
RECLASS P0fe3e09a F11.9 -> F11.2 (UTFPR 2024 Verão q58: força elétrica qE sobre carga presa a mola; o capacitor é só o cenário)
DADO P43bd5e45: alternativas -> no print são frações empilhadas vezes (Iπ)/(QB): (A) (1/2)(Iπ/(QB)) (B) (1/4)(Iπ/(QB)) (C) (7/8)(Iπ/(QB)) (D) (3/4)(Iπ/(QB)) (E) (7/12)(Iπ/(QB)) (IME 2023 q29)
DADO P68243a65: texto_da_prova -> o "˘" é sinal de menos no print: B = (−B,0,0), v = (−v,0,0), carga −e; alternativas -> a) mA√(2kA²/M + v²)/(eB) b) m√(kA²/M + v²)/(eB) c) mA√(2k/M)/(eB) d) mA√(k/M)/(eB) e) 2mA√(2k/M)/(eB) (IME 2025 q22)
DADO Pdb41fab8: texto_da_prova -> sem o resto "E ( ) mg + √8kmV2." (não está no print); alternativas -> A 0,33 s, B 0,66 s, C 1,00 s, D 1,33 s, E 1,66 s (ITA 2022 q12)
DADO P4d88d6f7: alternativas -> A m³g²/(q²B²), B (2/3)m³g²/(q²B²), C 2m³g²/(q²B²), D (1/4)m³g²/(q²B²), E (1/2)m³g²/(q²B²) (ITA 2023 q10; na entrada estavam só dentro do texto, desmontadas)
DADO P2c788e44: texto_da_prova -> faltam as constantes do início da parte de Física do caderno, usadas na questão: e/m = 1,8 × 10¹¹ C/kg e π = 3 (UFAM PSC3 2024 q48)
DADO P1e319823: texto_da_prova -> embaralhado (duas colunas misturadas) e sem alternativas; no print: A diminuir v0; B diminuir o módulo do campo; C campo na direção de v0; D aumentar v0; E campo na direção do eixo y (UFJF PISM III 2020, 2º dia, questão 04 do caderno)
RECLASS P5216fb1f F12.3 -> F12.2
RECLASS P6c1badec F12.3 -> F12.4
RECLASS P26be9efd F12.3 -> F12.4
GABARITO Pe183d00e (IME 2024 1ª fase, questão 19): sem gabarito publicado; letra do Aprendice E (10π µΩ); nenhuma resolução publicada achada na web; conferir com o preliminar e com a letra do conferente às cegas

## 2026-11-19 18:18 UTC — ACABOU — session_01PveEKWeU9BGX5xnf2nstPb
Física terminada: lote.py status mostra 0 questões faltando. Último lote gravado: fis-0077. Nenhum lote de Física aberto.
Nesta sessão: fis-0073 (50), fis-0074 (49 + 1 pendente), fis-0075 (49 + 1 pendente), fis-0076 (50), fis-0077 (44) = 242 resoluções conferidas.
Pendentes desta sessão: P1e7255e2 (RECLASS para mat M01.5), P82169a8f (RECLASS para qui Q09.1). A conferir: GABARITO P0e87de45 (resolvida com a oficial B, mas os dados se contradizem; decidir se anula). Pendentes de Física no registro: 17.
Site: AVISO de Pe70050bf (fração em linha no bloco Resposta correta), acima. A vaga desta sessão fica livre para outra matéria.

## 2026-11-19 20:03 UTC — ACABOU (pendentes) — session_01PveEKY2v3nNa3i6GFngYfE
Sessão de pendentes de Física: lote fis-pend-0001 (12 pendentes) gravado.
- Resolvidas: 5 (Pa6cf7d38 UDESC 2024.2 com o gabarito oficial pós-recursos em fontes, Pf32f80b2, Ped0dc1fd, P806713a7, P8de70adc com print refeito) + 8 vindas de Química e Matemática (fis-0078). Total 13.
- DADO P8de70adc (Fatec 2025-1 q26): texto_da_prova truncado; vale o print novo (95 °F).
- Reclassificadas (prova.json corrigido): Pedc8d618 → bio B06.2, P1e7255e2 → mat M01.5, P82169a8f → qui Q09.1 (resolvidas nas matérias novas); Pb1b726b3 → geo G09.6 (só a classificação; está nos pendentes de registro-geo.json).
- Ficaram pendentes: 3 — ANULAR Pcf680d36 (Acafe 2023 q32: faltam sen α, cos α e cos θ e o equilíbrio vertical não fecha); ANULAR P9615ec2a (UERR 2023 q44: a conta dá Δθ ≈ 252 °C, alternativa E; a oficial C só sai com 2α nos raios); ANULAR Pf4c499ee (PUC-Rio 2026 q18: vista de fora a pedra parece mais perto, II é falsa e nenhuma alternativa sobra).
