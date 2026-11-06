# Física — como resolver
Destilado de 50 resoluções em vídeo de 35 canais (49 resoluções de questões e 1 aula expositiva), conferidas contra a teoria e contra o formato das 2.916 resoluções que já estão no app.

## Subtemas que caem

**Isto é uma proposta.** O app ainda não tem Física. Os códigos seguem o formato das outras matérias (módulo `F01`, conteúdo `F01.1`) e devem ser aprovados antes de virar `nomesub` no `dados.json`. A marca **(muito cobrado)** é qualitativa: vem do que aparece com frequência no ENEM e nos vestibulares de Medicina (Fuvest, Unicamp, Unesp, Santa Casa, Einstein, UEL, federais), não de contagem.

**F01 Cinemática**
- F01.1 grandezas, unidades, prefixos e ordem de grandeza **(muito cobrado)**: entra como passo em quase toda questão
- F01.2 velocidade média e movimento uniforme **(muito cobrado)**
- F01.3 movimento uniformemente variado e equação de Torricelli **(muito cobrado)**
- F01.4 gráficos s × t, v × t e a × t **(muito cobrado)**
- F01.5 queda livre e lançamento vertical
- F01.6 lançamento horizontal e oblíquo
- F01.7 movimento circular, frequência, período e transmissão por correia e engrenagem

**F02 Dinâmica**
- F02.1 vetores e força resultante
- F02.2 leis de Newton e diagrama de forças **(muito cobrado)**
- F02.3 atrito e plano inclinado
- F02.4 sistemas de blocos, fios e polias
- F02.5 força centrípeta e curvas
- F02.6 força elástica (lei de Hooke)

**F03 Energia e quantidade de movimento**
- F03.1 trabalho de uma força
- F03.2 energia cinética, potencial e conservação da energia mecânica **(muito cobrado)**
- F03.3 potência mecânica e rendimento **(muito cobrado)**
- F03.4 impulso e quantidade de movimento
- F03.5 colisões

**F04 Estática e hidrostática**
- F04.1 equilíbrio do ponto material
- F04.2 torque, alavancas e equilíbrio do corpo extenso (inclui músculos e ossos como alavanca)
- F04.3 densidade e pressão **(muito cobrado)**
- F04.4 pressão em líquidos (Stevin), vasos comunicantes, pressão atmosférica e arterial
- F04.5 princípio de Pascal e prensa hidráulica
- F04.6 empuxo e flutuação **(muito cobrado)**

**F05 Gravitação**
- F05.1 leis de Kepler
- F05.2 lei da gravitação universal, gravidade e satélites

**F06 Termologia**
- F06.1 temperatura e escalas termométricas
- F06.2 dilatação térmica
- F06.3 calor sensível e calor latente **(muito cobrado)**
- F06.4 trocas de calor e equilíbrio térmico
- F06.5 propagação do calor, efeito estufa e conforto térmico **(muito cobrado)**

**F07 Gases e termodinâmica**
- F07.1 transformações gasosas e equação de Clapeyron
- F07.2 trabalho de um gás e primeira lei da termodinâmica
- F07.3 máquinas térmicas, segunda lei e ciclo de Carnot

**F08 Óptica**
- F08.1 princípios da óptica, sombra e câmara escura
- F08.2 reflexão e espelho plano
- F08.3 espelhos esféricos
- F08.4 refração, lei de Snell e reflexão total **(muito cobrado)**
- F08.5 lentes e vergência
- F08.6 óptica da visão e defeitos visuais **(muito cobrado)**

**F09 Ondulatória e acústica**
- F09.1 características da onda e v = λ · f **(muito cobrado)**
- F09.2 espectro eletromagnético e radiações **(muito cobrado)**
- F09.3 fenômenos ondulatórios: reflexão, refração, difração, interferência, ressonância, polarização **(muito cobrado)**
- F09.4 som: altura, intensidade, timbre e nível sonoro em dB
- F09.5 cordas, tubos sonoros e ondas estacionárias
- F09.6 efeito Doppler

**F10 Eletrostática**
- F10.1 carga elétrica e processos de eletrização
- F10.2 lei de Coulomb
- F10.3 campo elétrico
- F10.4 potencial elétrico, trabalho e energia potencial elétrica
- F10.5 condutores em equilíbrio, poder das pontas e blindagem

**F11 Eletrodinâmica**
- F11.1 corrente elétrica, leis de Ohm e resistividade **(muito cobrado)**
- F11.2 associação de resistores **(muito cobrado)**
- F11.3 potência elétrica, consumo em kWh e conta de luz **(muito cobrado)**
- F11.4 geradores, receptores e circuitos com mais de uma malha
- F11.5 amperímetro, voltímetro, fusível e instalação residencial
- F11.6 capacitores
- F11.7 choque elétrico e segurança

**F12 Eletromagnetismo**
- F12.1 ímãs e campo magnético
- F12.2 força magnética sobre carga e sobre fio
- F12.3 campo de fio, espira e solenoide
- F12.4 indução eletromagnética, Faraday e Lenz **(muito cobrado)**
- F12.5 transformadores, geradores e produção de energia elétrica

**F13 Física moderna e energia**
- F13.1 fóton, efeito fotoelétrico e dualidade
- F13.2 modelo de Bohr e espectros
- F13.3 radioatividade, meia-vida e dose de radiação (aplicações médicas)
- F13.4 relatividade restrita
- F13.5 fontes de energia, usinas e impacto ambiental **(muito cobrado)**

## Método da matéria

O roteiro que os melhores professores dos vídeos têm em comum, já traduzido para os campos do APRENDICE:

1. **Separar o contexto do comando.** No ENEM, o texto conta uma história (telha branca, etiqueta RFID, fototerapia, voo Rio–Roma) e a pergunta física está na última frase. O primeiro passo, do tipo `localizar`, escreve o comando em uma linha: "A pergunta é a energia do mês, em reais" ou "Pede o ângulo com o espelho, não com a normal". Quando o comando é óbvio, dispense esse passo.
2. **Listar os dados com unidade e marcar as conversões.** Faça isso antes de qualquer fórmula. Em Física, a conversão é a armadilha mais frequente nos vídeos: cm² → m², g → kg, min → h, L/min → L/s, µSv → Sv, km/h → m/s. Toda conversão vira um passo `calcular`, e o `porque` diz qual unidade obriga a converter. Se o enunciado esconde o trabalho real numa conversão, diga isso no `antes.texto`.
3. **Desenhar ou esquematizar em linha.** Diagrama de forças, raio com a normal, circuito redesenhado, eixos x e y, linha do tempo das etapas do movimento. No app não há lousa, por isso a `conta` do passo traz o esquema escrito: "No bloco A: para cima N, para baixo P = 20 N, ao longo do plano Px = 10 N".
4. **Dizer a ideia que resolve antes da conta.** Aqui cabe "Sem tempo no enunciado: Torricelli", "Sem atrito: a energia mecânica se conserva", "Mesmo meio: a velocidade da onda não muda". Essa frase vai no `antes.texto` e no `porque` do primeiro passo de cálculo. As fórmulas do `antes.formulas` são só as que os passos usam.
5. **Isolar a incógnita antes de substituir**, quando a álgebra simplifica (a massa cancela na energia e no plano inclinado, g cancela no empuxo, k cancela no campo nulo). Mostrar o cancelamento ensina por que o dado "falta" no enunciado.
6. **Executar com valores intermediários e unidade em cada linha.** Use um movimento por passo. Potência de dez se resolve em separado ("200 ÷ 25 = 8; 10 × 10⁴ = 10⁵").
7. **Conferir por outro caminho** (`checagem`). Na Física, os caminhos que funcionam são: análise de unidade ("kW × h = kWh"), ordem de grandeza ("1 000 radiografias por ano seria absurdo"), caminho alternativo (energia em vez de cinemática, custo por banho em vez de custo por dia), caso extremo ("se θ = 0, o bloco não acelera") e substituir de volta.
8. **Explicar cada errada pela física.** As erradas típicas de Física saem de erros reais e reproduzíveis: unidade não convertida, fator esquecido, raiz ou quadrado esquecido, sinal trocado, grandeza trocada (intensidade × frequência, ângulo com a normal × com a superfície, pressão final × aumento). Recalcule cada uma por código.

**Tipos de passo mais comuns em Física:** `localizar` para o dado no gráfico, na tabela ou no texto de apoio; `calcular` para conversões e contas; `comparar` para proporções ("o raio caiu 4 vezes, então T cai 4^1,5 = 8 vezes") e para o confronto entre aproximação e afastamento ou entre série e paralelo; `eliminar` para questões de gráfico e conceituais, em que se descartam formas e afirmações; `concluir` ligando o valor à letra.

**Questões conceituais**, sem conta, que são muitas no ENEM: `passos` com 3 ou 4 movimentos (fenômeno → propriedade que muda → consequência → letra). A `conta` traz o trecho do enunciado ou a relação qualitativa ("f aumenta, v fixa → λ diminui").

**Pontos de atenção específicos de Física**

- **Constantes e dados:** use o g, o π, o sen e o cos que o enunciado der (g = 10 m/s², π = 3 são comuns). Se o enunciado não der, diga no `antes` qual valor foi adotado. Se a prova esconde um dado na tabela de constantes da capa, avise no `alerta`, como no exemplo de Química de `Q04.3`.
- **Notação no celular:** escreva as fórmulas em linha, com × e ÷, potências em sobrescrito Unicode (10⁻³, m²) e frações por extenso ("v² ÷ R"). Não use LaTeX. Letras gregas (λ, θ, Δ, η, µ) entram em `simbolos`.
- **Respostas literais** (expressão em letras, como na Fuvest): os passos mantêm as letras até o fim, e a `checagem` testa a expressão com números simples ou por unidade.
- **Questões de afirmativas** (I, II, III ou somatória): um passo `eliminar` ou `comparar` por afirmativa. Nas `erradas`, cada letra diz qual afirmativa ela inclui ou exclui indevidamente e por quê.
- **Questões de gráfico ou figura** (de alternativa gráfica): a `conta` descreve em palavras o que a alternativa mostra ("patamar e depois reta descendo"). Nunca diga só "o gráfico C".
- **Anotações dos vídeos descartadas por erro ou confusão** (não usar como fonte): cos 30° = 0,8 no plano inclinado (`wu-xmW70-6o`); a análise da figura II de indução (`KdGbkL_uvs0`), que contradiz a regra das duas inversões; a conclusão da questão de dB (`fWo6OWzzJ3M`), que se contradiz; e as afirmações sobre imagem em espelho esférico e prisma (`p3vvyCLPLxw`).

## Roteiros por tipo de questão

### 1. Gráfico de movimento (s × t, v × t)
- **Reconhecer:** gráfico com eixo de tempo; "qual gráfico representa", "distância percorrida até…".
- **Roteiro:** dividir o movimento em etapas pelo texto ("um terço do tempo acelerando…") → para cada etapa, dizer a forma esperada (MU: reta em s × t, patamar em v × t; MUV: parábola em s × t, reta inclinada em v × t) → montar o gráfico esperado → `eliminar` as alternativas trecho a trecho.
- **Ideia-chave:** em v × t, a área é o deslocamento e a inclinação é a aceleração; em s × t, a inclinação é a velocidade.
- **Armadilha:** ler o gráfico v × t como se fosse s × t ("a linha desce, então volta").
- **Distratores típicos:** concavidade trocada na etapa de frenagem (em s × t, freando, a concavidade é para baixo); reta no lugar de parábola; v × s de frenagem desenhado como reta (pela equação de Torricelli, v² cai linearmente com a distância, então v × s é curva).

### 2. MUV, frenagem e tempo de reação
- **Reconhecer:** "parte do repouso", "freia até parar", "distância de parada", "tempo de reação".
- **Roteiro:** separar a etapa de reação (velocidade constante: d = v · t) da etapa de frenagem (MUV) → converter km/h → m/s (÷ 3,6) → escolher a equação pela grandeza que falta (sem tempo: Torricelli v² = v₀² + 2aΔs) → somar as distâncias.
- **Ideia-chave:** a equação certa é a que não usa o dado que o enunciado não deu.
- **Armadilha:** esquecer a distância percorrida durante o tempo de reação.
- **Distratores típicos:** só a distância de frenagem; velocidade em km/h direto na fórmula; dobrar v e dobrar a distância de frenagem (na verdade ela quadruplica, porque d ∝ v²).

### 3. Lançamentos (horizontal e oblíquo)
- **Reconhecer:** projétil, "alcance", "altura máxima", "tempo de voo".
- **Roteiro:** fixar eixos → decompor v₀ (vx = v₀ cos θ, v₀y = v₀ sen θ) → no eixo x, MU; no eixo y, MUV com g → o tempo liga os dois eixos → responder.
- **Ideia-chave:** os eixos são independentes e o tempo é o mesmo nos dois; no topo, vy = 0 mas vx continua.
- **Armadilha:** dizer que a velocidade é zero na altura máxima (só a componente vertical é).
- **Distratores típicos:** trocar sen por cos; usar o tempo de subida como tempo de voo (é a metade); usar o valor do ângulo no lugar do seno (30 em vez de 0,5).

### 4. Leis de Newton com blocos, fios, plano inclinado
- **Reconhecer:** "blocos ligados", "tração no fio", "plano inclinado", "força que A exerce em B".
- **Roteiro:** isolar cada corpo e desenhar as forças (no plano inclinado, Px = P sen θ ao longo do plano e Py = P cos θ perpendicular) → aceleração pelo sistema inteiro (forças externas ÷ massa total) → força interna pelo corpo isolado → conferir pelo outro corpo.
- **Ideia-chave:** "separa os corpos, desenha as forças" (Física Resolve). Força interna só aparece quando se isola um corpo.
- **Armadilha:** pôr a normal igual ao peso no plano inclinado (N = P cos θ) ou somar ação e reação no mesmo corpo.
- **Distratores típicos:** a tração calculada como igual à força aplicada; a aceleração calculada com a massa de um bloco só; sen e cos trocados.

### 5. Movimento circular e força centrípeta
- **Reconhecer:** "período", "frequência", "rpm", "curva", "satélite", "correia", "engrenagem".
- **Roteiro:** converter rpm → Hz (÷ 60) e o período para a unidade da velocidade → v = 2πR/T → em curva, a resultante para o centro é F = m v²/R e vem de uma força real (atrito, normal, tração, gravidade).
- **Ideia-chave:** na correia, a velocidade linear é igual nas duas polias; no mesmo eixo, a frequência é igual.
- **Armadilha:** tratar a força centrípeta como uma força a mais no diagrama.
- **Distratores típicos:** 1 h 40 min lido como 1,4 h (o certo é 5/3 h); frequências iguais na correia; raio em km com velocidade em m/s.

### 6. Conservação de energia e rendimento
- **Reconhecer:** montanha-russa, rampa, mola, "desprezando o atrito", usina, "rendimento".
- **Roteiro:** escolher dois pontos (o de partida e o crítico, por exemplo o mais alto do trajeto) → listar as energias em cada um → igualar (sem atrito) ou descontar a energia dissipada → isolar a incógnita (v = √(2gh) quando só há troca entre cinética e potencial).
- **Ideia-chave:** para chegar em C, o carrinho precisa vencer o ponto mais alto entre A e C (Coelho da Física).
- **Armadilha:** calcular entre A e C ignorando o morro do meio.
- **Distratores típicos:** esquecer a raiz (v² no lugar de v); usar a altura errada; rendimento aplicado ao contrário (dividir em vez de multiplicar); massa mantida na conta, gerando número dependente de m quando a questão não dá m.

### 7. Impulso, quantidade de movimento e colisões
- **Reconhecer:** gráfico F × t, "colisão", "ficam juntos", "recuo", airbag.
- **Roteiro:** impulso = área sob F × t (área abaixo do eixo conta negativa) → I = ΔQ → na colisão, quantidade de movimento antes = depois → se a questão continua (subida em rampa), usar a energia só depois da colisão.
- **Ideia-chave:** na colisão inelástica conserva-se a quantidade de movimento, não a energia cinética (Estúdio de Física, Fuvest 2019).
- **Armadilha:** aplicar conservação de energia através da colisão.
- **Distratores típicos:** área negativa somada; v final calculada por energia; massa do conjunto trocada pela massa de um corpo.

### 8. Torque e alavancas (inclui o corpo humano)
- **Reconhecer:** barra apoiada, gangorra, "momento", antebraço segurando peso, "força do músculo".
- **Roteiro:** escolher o ponto de giro (onde há força desconhecida que não interessa) → medir braços perpendiculares → soma dos momentos horários = anti-horários → soma das forças = 0 se pedir a reação no apoio.
- **Ideia-chave:** no antebraço, o bíceps se prende perto do cotovelo, por isso faz força várias vezes maior que o peso segurado.
- **Armadilha:** usar a distância até o ponto errado ou a distância não perpendicular.
- **Distratores típicos:** força do músculo igual ao peso; braços invertidos (dá a razão inversa); peso da própria barra esquecido.

### 9. Pressão, Stevin, Pascal e empuxo
- **Reconhecer:** "área de contato", "profundidade", "mergulhador", "soro na altura", "prensa", "flutua", "parte submersa".
- **Roteiro:** pressão = F/A com área em m² → em líquido, p = p₀ + d g h (cada 10 m de água ≈ 1 atm) → Pascal: F₁/A₁ = F₂/A₂ → flutuação: E = P, logo d_líquido · V_submerso = m_corpo.
- **Ideia-chave:** no corpo que flutua, a fração submersa é a razão das densidades.
- **Armadilha:** cm² → m² é ÷ 10⁴, não ÷ 10² (FISICATOTAL).
- **Distratores típicos:** área convertida com 10⁻²; peso de um só corpo quando há dois (atleta e barra); empuxo calculado com o volume total de um corpo que flutua; pressão manométrica trocada por absoluta.

### 10. Gravitação e Kepler
- **Reconhecer:** "período de translação", "raio da órbita", "periélio/afélio", satélite geoestacionário.
- **Roteiro:** 2ª lei: áreas iguais em tempos iguais, mais rápido no periélio → 3ª lei como proporção: T² ∝ R³, então T₂/T₁ = (R₂/R₁)^(3/2) → aproximar a raiz testando quadrados vizinhos (√125: 11² = 121).
- **Ideia-chave:** a massa do planeta ou satélite não entra no período (Matéria Escura).
- **Armadilha:** elevar só o R ao cubo e esquecer o fator (5R)³ = 125R³ (Emmanoel Macena).
- **Distratores típicos:** T proporcional a R (raio ×4 → período ×4, em vez de ×8); T ∝ R²; velocidade igual em toda a órbita.

### 11. Calorimetria e potência que vira calor
- **Reconhecer:** "aquecer", "chuveiro", "vazão", "calor específico", "derreter", "poder calorífico".
- **Roteiro:** energia fornecida (P · Δt, ou massa × poder calorífico) = Q → Q = m c Δθ para aquecer, Q = m L para mudar de fase → vazão vira massa por tempo (1 L de água ≈ 1 kg) → isolar.
- **Ideia-chave:** em regime contínuo, P = (m/Δt) · c · Δθ: a vazão faz o papel de m/Δt (Gabaritando Física).
- **Armadilha:** misturar cal com J (1 cal ≈ 4,2 J) ou L/min com W (J/s).
- **Distratores típicos:** vazão em minuto com potência em segundo (fator 60); Δθ esquecido ou com a temperatura final no lugar da variação; calor latente esquecido quando há mudança de fase.

### 12. Propagação de calor e conforto térmico (conceitual)
- **Reconhecer:** garrafa térmica, telhado branco, estufa, ilha de calor, roupa clara, iglu.
- **Roteiro:** identificar o processo dominante (condução: contato sólido; convecção: fluido que circula; radiação: sem meio, depende da cor e do albedo) → dizer qual grandeza a mudança altera → `eliminar` as alternativas que atribuem o efeito à propriedade errada.
- **Ideia-chave:** a cor muda absorção e reflexão da radiação, não a condutividade nem a capacidade térmica (Plataforma Memorize, ENEM 2025).
- **Armadilha:** dizer que a superfície branca "reduz a reflexão" (ela aumenta) ou que o cobertor "esquenta" (ele isola).
- **Distratores típicos:** propriedade certa com o sentido invertido; processo verdadeiro mas que a mudança não altera (convecção, quando a pergunta é sobre a cor); "frio" tratado como algo que passa.

### 13. Gases e termodinâmica
- **Reconhecer:** "isotérmica", "isobárica", "adiabática", diagrama p × V, "rendimento da máquina".
- **Roteiro:** temperatura em kelvin → identificar a transformação (o que fica constante) → trabalho = área sob p × V → 1ª lei ΔU = Q − W com a convenção de sinais (W > 0 na expansão) → rendimento η = W/Q_quente; Carnot: η = 1 − T_fria/T_quente.
- **Ideia-chave:** na isotérmica ΔU = 0, logo Q = W; na adiabática Q = 0, logo W = −ΔU.
- **Armadilha:** temperatura em °C na lei dos gases ou no rendimento de Carnot.
- **Distratores típicos:** sinal do trabalho trocado na compressão; rendimento de Carnot com °C; ciclo percorrido no sentido errado (anti-horário em p × V é refrigerador).

### 14. Reflexão, refração e espelhos
- **Reconhecer:** "ângulo de incidência", "espelho", "peixe visto de fora", "fibra óptica", "reflexão total".
- **Roteiro:** desenhar a normal antes de tudo → ângulos sempre medidos com a normal → reflexão: i = r; refração: n₁ sen i = n₂ sen r → no meio mais refringente, o raio se aproxima da normal → reflexão total só do meio mais refringente para o menos, acima do ângulo limite.
- **Ideia-chave:** no espelho plano, "rebater" o ponto (imagem simétrica) transforma o caminho quebrado em reta (Física com Renato Brito).
- **Armadilha:** a pergunta pede o ângulo com a superfície e o aluno dá o ângulo com a normal (90° − 35° = 55°, não 35°; Física com Bandeira).
- **Distratores típicos:** complemento esquecido; reflexão total no sentido errado; achar que refração exige desvio (na incidência normal não há desvio); frequência mudando na refração (muda v e λ, a frequência fica).

### 15. Lentes e óptica da visão
- **Reconhecer:** "miopia", "hipermetropia", "grau dos óculos", "dioptria", "lupa", "pupila".
- **Roteiro:** classificar o defeito (miopia: imagem antes da retina, lente divergente; hipermetropia: depois, lente convergente) → vergência V = 1/f com f em metro (o "grau") → para a imagem, 1/f = 1/p + 1/p′ e aumento A = −p′/p.
- **Ideia-chave:** o grau dos óculos é a vergência em dioptrias; −2 di é divergente de 0,5 m.
- **Armadilha:** f em cm na fórmula da vergência (V = 1/0,5 m = 2 di, não 1/50).
- **Distratores típicos:** lente trocada (convergente para míope); vergência com f em cm; pupila contraída num ambiente escuro (dilata no escuro; Ricci, ENEM 2025).

### 16. Ondas: v = λ · f, espectro e fenômenos
- **Reconhecer:** "comprimento de onda", "frequência", cor, rádio, ultrassom, "quebrar a taça", "ouvir atrás do muro".
- **Roteiro:** se o meio não muda, v é fixa: f sobe ⇔ λ desce → se a onda muda de meio, f fica e v e λ mudam juntas → nomear o fenômeno pelo efeito: contornar obstáculo = difração; mesma frequência natural = ressonância; reforço/cancelamento = interferência; só transversal = polarização.
- **Ideia-chave:** ressonância depende da frequência (afinação), não da intensidade (Fisiquei, taça da Mônica).
- **Armadilha:** confundir intensidade (amplitude, "volume") com frequência (altura, agudo/grave).
- **Distratores típicos:** som polarizado (som é longitudinal no ar); λ e f variando no mesmo sentido; ordem do espectro trocada (do rádio ao gama, a frequência sobe e λ desce); infravermelho tratado como ionizante.

### 17. Som, nível sonoro e efeito Doppler
- **Reconhecer:** dB, "mais agudo quando se aproxima", sirene, morcego, ultrassom.
- **Roteiro:** altura = frequência, intensidade = potência por área, timbre = forma da onda → +10 dB significa intensidade × 10 → Doppler qualitativo: aproximação relativa aumenta a frequência percebida, afastamento diminui → só monte a fórmula se a questão pedir número.
- **Ideia-chave:** em fonte que passa por um observador parado, a frequência percebida cai de um valor alto para um baixo no instante da passagem (Prof. Eduardo Cavalcanti).
- **Armadilha:** achar que o Doppler muda a frequência emitida pela fonte; ela não muda.
- **Distratores típicos:** dB tratado como escala linear (20 dB = "dobro" de 10 dB); Doppler associado à intensidade; frequência que cresce continuamente durante a aproximação com velocidade constante.

### 18. Circuitos: Ohm, associação e medidores
- **Reconhecer:** esquema com resistores, "resistência equivalente", "lâmpadas em série/paralelo", amperímetro, voltímetro, "o que acontece com o brilho".
- **Roteiro:** redesenhar o circuito descartando ramos abertos e curtos → reduzir de dentro para fora (paralelo de iguais: R/n; série: soma) → corrente total i = U/R_eq → voltar ao circuito original para correntes e tensões parciais → em circuitos difíceis, atribuir 0 V a um fio e "andar" somando e subtraindo tensões (Física com Renato Brito).
- **Ideia-chave:** em paralelo, a tensão é a mesma; em série, a corrente é a mesma. Amperímetro em série, voltímetro em paralelo (Professor Boaro).
- **Armadilha:** contar o resistor de um ramo aberto (não passa corrente, não entra no R_eq).
- **Distratores típicos:** soma em série quando era paralelo; 1/R_eq esquecido de inverter no fim; ramo aberto incluído; brilho de lâmpada julgado pela resistência em vez da potência dissipada.

### 19. Potência, consumo e conta de luz
- **Reconhecer:** kWh, "conta", tarifa, chuveiro, "posição inverno", disjuntor, "220 V ou 127 V".
- **Roteiro:** potência de cada aparelho (P = U · i, ou P = U²/R se R fixa) → passar W para kW e tempo para hora → E = P · Δt por aparelho → somar → multiplicar pela tarifa e pelos dias.
- **Ideia-chave:** kWh é unidade de energia: 1 kW ligado por 1 h.
- **Armadilha:** minutos lidos como fração decimal de hora (12 min = 0,2 h, não 0,12 h).
- **Distratores típicos:** W sem converter (resultado 1 000 vezes maior); dias esquecidos; tarifa esquecida (kWh lido como reais); corrente calculada com a tensão errada; chuveiro "inverno" com resistência maior (é menor: com U fixa, P = U²/R).

### 20. Eletrostática: Coulomb e campo
- **Reconhecer:** cargas pontuais, "força entre as esferas", "campo nulo", "esferas encostadas e separadas".
- **Roteiro:** desenhar os vetores (campo se afasta da carga positiva e aponta para a negativa) → módulos por k|Q|/d² ou k|Q₁Q₂|/d² → se a pergunta for de proporção, trabalhe em razões sem números (d × 2 → F ÷ 4) → somar vetores (mesma direção: soma ou subtrai; perpendiculares: Pitágoras).
- **Ideia-chave:** no ponto de campo nulo entre duas cargas de mesmo sinal, a carga menor fica mais perto (CEDERJ, Estúdio de Física).
- **Armadilha:** esquecer o quadrado da distância, ou somar módulos de vetores que não têm a mesma direção.
- **Distratores típicos:** razão sem o quadrado (Q = Q′/2 em vez de Q′/4); esferas idênticas em contato que não dividem a soma das cargas; o sinal usado no módulo.

### 21. Indução eletromagnética e transformadores
- **Reconhecer:** ímã que se aproxima de bobina, "corrente induzida", RFID, carregador sem fio, dínamo, transformador.
- **Roteiro:** há corrente induzida só se o fluxo magnético varia → sentido por Lenz: a bobina cria polo que se opõe à aproximação (repele) ou ao afastamento (atrai) → transformador: U₁/U₂ = N₁/N₂ e, se ideal, U₁ · i₁ = U₂ · i₂.
- **Ideia-chave:** inverter o polo **ou** inverter o movimento troca o sentido da corrente; inverter os dois mantém (Curso Vaga Certa).
- **Armadilha:** dizer que um ímã parado dentro da bobina gera corrente, ou que o transformador funciona em corrente contínua.
- **Distratores típicos:** campo elétrico no lugar do magnético (Rogério Santos, ENEM 2018); transformador que "aumenta a potência"; razão de espiras invertida.

### 22. Física moderna e radiação
- **Reconhecer:** fóton, "função trabalho", eV, "meia-vida", Sv, raio X, "ionizante", relatividade.
- **Roteiro:** E = h · f; efeito fotoelétrico: E_fóton = W + Ec (só arranca elétron acima de uma frequência mínima) → meia-vida: fração restante = (1/2)ⁿ, n = tempo ÷ meia-vida → dose: taxa × tempo, com os prefixos convertidos (µ = 10⁻⁶, m = 10⁻³).
- **Ideia-chave:** aumentar a intensidade da luz aumenta o número de elétrons ejetados, não a energia de cada um.
- **Armadilha:** prefixos mili e micro trocados; tempo total usado no lugar da fração indicada ("80 % do tempo de voo"; Plataforma Memorize, ENEM 2023).
- **Distratores típicos:** dose calculada com 1 000 h em vez de 800 h; meia-vida tratada como queda linear ("2 meias-vidas = zero"); velocidade da luz que depende do referencial.

### 23. Energia, usinas e ambiente (conceitual ENEM)
- **Reconhecer:** usina, "fonte renovável", "transformação de energia", descarte de painéis, eficiência energética.
- **Roteiro:** escrever a cadeia de transformações (química → térmica → cinética → elétrica) → localizar o que a pergunta isola (funcionamento, descarte, armazenamento) → eliminar alternativas verdadeiras mas fora do recorte.
- **Ideia-chave:** "limpa" se refere à operação, não ao ciclo de vida (Plataforma Memorize, descarte de painéis).
- **Armadilha:** a alternativa verdadeira sobre outra fase do processo.
- **Distratores típicos:** radioatividade atribuída a fonte não nuclear; "gera energia" no lugar de "transforma"; impacto da operação quando se pede o do descarte.

## O que os professores fazem de melhor (e o que evitar)

**Padrões a reproduzir**
- Isolam o comando antes de tudo. Ricci começa a leitura "de baixo para cima", pela pergunta; Prof. Guma avisa que o texto do Museu do Amanhã "não tem nada a ver" com a física cobrada. No app, isso vira o primeiro passo `localizar` ou a primeira frase do `antes`.
- Anotam cada dado com a unidade e convertem na hora: FISICATOTAL (cm² → m²), Gabaritando Física (L/min → L/s para casar com o watt), Professor Emanuel Macedo (1 h 40 min = 5/3 h), Questões de Vestibular (500 g = 0,5 kg).
- Justificam a escolha da fórmula pelo dado que falta: "Só tem uma fórmula que não tem tempo: Torricelli" (Questões de Vestibular). Esse é o `porque` ideal.
- Desenham o que o texto descreve. A normal no espelho (Física com Bandeira), o diagrama de forças no bloco isolado (Estúdio de Física, Física Resolve), as etapas do movimento num só eixo (Física em Toda Parte, SouEuNaFisica), os potenciais nos nós (Física com Renato Brito).
- Dizem em voz alta por que um dado não aparece: "a massa corta, por isso a questão nem dá a massa" (Coelho da Física); "a massa do satélite não entra na 3ª lei" (Matéria Escura). No app isso vai para o `porque` ou para a `checagem`.
- Conferem por outro caminho. Plataforma Memorize refaz a placa solar pela perda por grau ("0,4 % de 250 W = 1 W por grau, vezes 40 = 40 W"); Física com Renato Brito confere o atalho 3-4-5 com Pitágoras completo; Emmanoel Macena confere √125 entre 11² e 12²; Davi Oliveira refaz 500 × 0,24 × 50 por frações.
- Nomeiam o distrator pela origem: "você ia marcar 35° porque já botou na cabeça que incidência é igual à reflexão" (Física com Bandeira); "quem usar 1 000 h em vez de 800 h cai em outra letra" (Plataforma Memorize); "o branco aumenta a reflexão, não reduz" (Plataforma Memorize, ENEM 2025).
- Explicam o sinal antes de usar a fórmula: Prof. Eduardo Cavalcanti mostra por que a fração do Doppler fica maior ou menor que 1 antes de pôr números. É uma boa `checagem` qualitativa.
- Usam casos particulares para poupar conta: duas forças iguais a 120° dão resultante de mesmo módulo (Questões de Vestibular); triângulo 3-4-5.

**O que não copiar**
- Marcar a letra sem comentar as erradas. É o padrão em quase metade dos vídeos (Exatas é legal, Física Resolve, Prof. Carlos Leandro, Questões de Vestibular, FisicaInterativa.Com). No app, `erradas` é obrigatório.
- Não conferir. Muitos vídeos terminam ao bater com o gabarito. Bater com o gabarito não é checagem.
- Revisão teórica longa antes da questão, de 2 a 7 minutos em alguns vídeos (NA, Prof. Eduardo Cavalcanti, Professor Boaro). No app, a teoria cabe no `antes` em até 5 frases.
- Aproximar para "encaixar" no gabarito sem dizer. Exemplo: 975 kg viram "aproximadamente 1 000 litros" sem justificativa. Se arredondar, mostre que a alternativa mais próxima é a única plausível.
- Valores trigonométricos errados: há vídeo que usa cos 30° = 0,8 (o certo é ≈ 0,87). Use sempre o valor que o enunciado der; se não der, use o exato.
- Ignorar o sinal "porque em módulo não importa". Explique que o sinal decide o sentido do vetor.
- Mnemônicos e bordões ("sorvetão", "Ui!", "que macete") não entram no app. A regra vai escrita como regra.

## Exemplo completo

Questão Aprendice escrita para este guia (subtema F11.3, potência e consumo):

> Em uma casa, o chuveiro elétrico tem potência de 5 500 W na posição inverno. Quatro pessoas tomam, cada uma, um banho diário de 12 minutos nessa posição. A tarifa de energia é de R$ 0,80 por kWh. Considerando um mês de 30 dias, o gasto com o chuveiro é de
>
> A) R$ 26,40  B) R$ 63,36  C) R$ 105,60  D) R$ 132,00  E) R$ 3,52

Gabarito: C. Contas conferidas em Python: 5,5 × 0,8 × 30 × 0,80 = 105,60; A = 5,5 × 0,2 × 30 × 0,80 = 26,40; B = 5,5 × 4 × 0,12 × 30 × 0,80 = 63,36; D = 5,5 × 0,8 × 30 = 132; E = 5,5 × 0,8 × 0,80 = 3,52.

```json
{
  "antes": {
    "texto": "A conta de luz cobra energia, e energia elétrica é potência vezes tempo de uso. A unidade da tarifa manda em tudo: ela está em kWh, então a potência tem de estar em quilowatt e o tempo em hora. O trabalho real da questão está nas conversões, principalmente a dos minutos de banho para hora.",
    "formulas": [
      "E = P × Δt (energia = potência × tempo)",
      "1 kW = 1 000 W; 1 h = 60 min",
      "gasto = energia em kWh × tarifa por kWh"
    ],
    "simbolos": [
      ["W", "watt, unidade de potência: quanta energia o aparelho usa por segundo"],
      ["kW", "quilowatt, mil watts"],
      ["kWh", "quilowatt-hora, unidade de energia: 1 kW funcionando durante 1 hora"],
      ["Δt", "intervalo de tempo em que o aparelho fica ligado"],
      ["tarifa", "preço cobrado por cada kWh consumido"]
    ]
  },
  "pista": "Olhe a unidade da tarifa antes de multiplicar qualquer coisa: ela diz em que unidades a potência e o tempo precisam estar.",
  "passos": [
    {
      "faz": "Passe a potência para quilowatt",
      "conta": "5 500 W ÷ 1 000 = 5,5 kW",
      "porque": "A tarifa é por kWh, então a potência tem de estar em kW para o resultado sair direto em kWh.",
      "tipo": "calcular"
    },
    {
      "faz": "Some o tempo de banho de um dia",
      "conta": "4 banhos × 12 min = 48 min",
      "porque": "O chuveiro fica ligado em cada um dos quatro banhos, e o consumo depende do tempo total ligado no dia.",
      "tipo": "calcular"
    },
    {
      "faz": "Converta os minutos em hora",
      "conta": "48 min ÷ 60 = 0,8 h",
      "porque": "Uma hora tem 60 minutos, não 100. Por isso 48 min não é 0,48 h: é 48 sessenta avos de hora, ou 0,8 h.",
      "tipo": "calcular"
    },
    {
      "faz": "Calcule a energia do dia e do mês",
      "conta": "E = 5,5 kW × 0,8 h = 4,4 kWh por dia; 4,4 × 30 = 132 kWh no mês",
      "porque": "Energia é potência vezes tempo. Multiplicar quilowatt por hora dá exatamente a unidade da conta de luz.",
      "tipo": "calcular"
    },
    {
      "faz": "Multiplique pela tarifa",
      "conta": "132 kWh × R$ 0,80 por kWh = R$ 105,60",
      "porque": "Cada kWh custa R$ 0,80. O kWh de cima cancela com o 'por kWh' da tarifa, e sobra reais.",
      "tipo": "concluir"
    }
  ],
  "resposta": "Alternativa C — R$ 105,60 por mês com o chuveiro.",
  "checagem": "Faça pelo custo de um banho. Um banho de 12 min é 0,2 h, e 5,5 kW × 0,2 h = 1,1 kWh, que custam 1,1 × 0,80 = R$ 0,88. No mês são 4 × 30 = 120 banhos, e 120 × 0,88 = R$ 105,60. Dá o mesmo valor por outro caminho.",
  "erradas": {
    "A": "Sai de contar um banho por dia em vez de quatro: 5,5 kW × 0,2 h × 30 × 0,80 = R$ 26,40. A casa tem quatro pessoas, e cada uma toma um banho.",
    "B": "Sai de ler 12 min como 0,12 h: 5,5 × (4 × 0,12) × 30 × 0,80 = R$ 63,36. Hora tem 60 minutos, então 12 min = 0,2 h.",
    "D": "132 é o consumo do mês em kWh, não em reais: faltou multiplicar pela tarifa de R$ 0,80 por kWh.",
    "E": "É o gasto de um dia só: 4,4 kWh × R$ 0,80 = R$ 3,52. Faltou multiplicar pelos 30 dias do mês."
  },
  "armadilha": "Os 12 minutos parecem 0,12 h, mas hora tem 60 minutos: 12 min = 0,2 h, e quem erra essa conversão cai em R$ 63,36.",
  "alerta": "",
  "essencial": {
    "pede": "O gasto mensal com um chuveiro de 5 500 W usado em quatro banhos diários de 12 min, a R$ 0,80 por kWh.",
    "chave": "E = 5,5 kW × 0,8 h = 4,4 kWh por dia; 132 kWh no mês × R$ 0,80 = R$ 105,60.",
    "cuidado": "Converter W em kW e minutos em hora dividindo por 60, e não esquecer os quatro banhos, os 30 dias e a tarifa."
  }
}
```
